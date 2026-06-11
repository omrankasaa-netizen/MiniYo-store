/**
 * Membership tRPC Router
 * -----------------------
 * Server-side membership logic — the frontend memberStore is for UI state only.
 * All discount, tier, and activity writes go through here so MySQL is the source of truth.
 *
 * Endpoints:
 *   - membership.getCustomer      — load customer from DB by userId
 *   - membership.syncAfterLogin   — pull DB customer into session
 *   - membership.recordOrder      — post-order: update stats, check tier upgrade, log activity
 *   - membership.upgradeTier      — manually trigger tier check (cron-safe)
 *   - membership.resetMonthly     — reset freeShippingUsed each month (call from cron)
 *   - membership.getActivities    — activity log for member area
 *   - membership.applyDiscount    — validate + apply discount to cart server-side
 *   - membership.validateShipping — validate free shipping eligibility server-side
 */

import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, publicQuery, protectedQuery } from '../middleware'
import { getDb } from '../queries/connection'
import * as schema from '@db/schema'
import { eq, desc } from 'drizzle-orm'
import { queueEmail } from '../email/emailService'
import { membershipUpgradeEmail } from '../email/emailTemplates'

const TIER_THRESHOLDS = { bronze: 0, silver: 500, gold: 1000 } as const
type Tier = 'bronze' | 'silver' | 'gold'

const TIER_BENEFITS: Record<Tier, { discount: number; freeShippingPerMonth: number }> = {
  bronze:  { discount: 0,    freeShippingPerMonth: 1 },
  silver:  { discount: 0.05, freeShippingPerMonth: 2 },
  gold:    { discount: 0.10, freeShippingPerMonth: 5 },
}

function computeTier(totalSpent: number, currentTier: Tier): Tier {
  if (Number(totalSpent) >= TIER_THRESHOLDS.gold) return 'gold'
  if (Number(totalSpent) >= TIER_THRESHOLDS.silver) return 'silver'
  return currentTier
}

function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const membershipRouter = createRouter({
  getCustomer: protectedQuery
    .query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
      const db = getDb()
      const [cust] = await db
        .select()
        .from(schema.customers)
        .where(eq(schema.customers.email, ctx.user.email!))
        .limit(1)
      return cust || null
    }),

  syncAfterLogin: protectedQuery
    .mutation(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
      const db = getDb()
      const [cust] = await db
        .select()
        .from(schema.customers)
        .where(eq(schema.customers.email, ctx.user.email!))
        .limit(1)
      return cust || null
    }),

  recordOrder: protectedQuery
    .input(z.object({
      customerId: z.number(),
      subtotal: z.number(),
      discountTotal: z.number(),
      deliveryFee: z.number(),
      grandTotal: z.number(),
      usedFreeShipping: z.boolean(),
      isFirstOrder: z.boolean(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
      const db = getDb()

      const [cust] = await db
        .select()
        .from(schema.customers)
        .where(eq(schema.customers.id, input.customerId))
        .limit(1)

      if (!cust) throw new TRPCError({ code: 'NOT_FOUND', message: 'Customer not found' })

      const currentMonth = getCurrentMonth()
      const newTotalSpent = Number(cust.totalSpent) + input.grandTotal
      const newTotalOrders = cust.totalOrders + 1
      const prevTier = cust.membershipTier as Tier
      const newTier = computeTier(newTotalSpent, prevTier)
      const wasUpgraded = newTier !== prevTier

      await db.update(schema.customers).set({
        totalOrders: newTotalOrders,
        totalSpent: String(newTotalSpent.toFixed(2)),
        firstOrderDiscountUsed: input.isFirstOrder ? true : cust.firstOrderDiscountUsed,
        freeShippingUsed: input.usedFreeShipping ? cust.freeShippingUsed + 1 : cust.freeShippingUsed,
        freeShippingMonth: currentMonth,
        membershipTier: newTier,
        lastOrderDate: new Date(),
        updatedAt: new Date(),
      }).where(eq(schema.customers.id, input.customerId))

      // Log activity
      await db.insert(schema.membershipActivities).values({
        customerId: input.customerId,
        action: 'order_placed',
        oldTier: prevTier,
        newTier,
        amount: String(input.grandTotal.toFixed(2)),
        details: `Order placed. Subtotal: $${input.subtotal.toFixed(2)}, Discount: $${input.discountTotal.toFixed(2)}, Delivery: $${input.deliveryFee.toFixed(2)}`,
      })

      if (wasUpgraded) {
        // Log upgrade activity
        await db.insert(schema.membershipActivities).values({
          customerId: input.customerId,
          action: 'upgrade',
          oldTier: prevTier,
          newTier,
          details: `Upgraded from ${prevTier} to ${newTier} after $${newTotalSpent.toFixed(2)} total spent`,
        })

        // Queue upgrade email
        const benefits = TIER_BENEFITS[newTier]
        if (cust.email) {
          const tpl = membershipUpgradeEmail({
            name: cust.name,
            oldTier: prevTier,
            newTier,
            totalSpent: newTotalSpent,
            newDiscount: benefits.discount * 100,
            newFreeShipping: benefits.freeShippingPerMonth,
          })
          await queueEmail(cust.email, tpl, 'membership_upgrade')
        }
      }

      return { customerId: input.customerId, newTier, wasUpgraded, newTotalSpent }
    }),

  applyDiscount: protectedQuery
    .input(z.object({ customerId: z.number(), subtotal: z.number() }))
    .query(async ({ input }) => {
      const db = getDb()
      const [cust] = await db
        .select()
        .from(schema.customers)
        .where(eq(schema.customers.id, input.customerId))
        .limit(1)

      if (!cust) return { discount: 0, reason: '' }

      const tier = cust.membershipTier as Tier
      const benefits = TIER_BENEFITS[tier]

      // First-order 10% welcome discount
      if (!cust.firstOrderDiscountUsed && cust.totalOrders === 0) {
        return { discount: input.subtotal * 0.10, reason: 'Welcome Offer (10%)' }
      }

      if (benefits.discount > 0) {
        return {
          discount: input.subtotal * benefits.discount,
          reason: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Member (${benefits.discount * 100}% off)`,
        }
      }

      return { discount: 0, reason: '' }
    }),

  validateShipping: protectedQuery
    .input(z.object({ customerId: z.number(), subtotal: z.number() }))
    .query(async ({ input }) => {
      // Always free over $50
      if (input.subtotal >= 50) return { free: true, reason: 'Free shipping on orders over $50' }

      const db = getDb()
      const [cust] = await db
        .select()
        .from(schema.customers)
        .where(eq(schema.customers.id, input.customerId))
        .limit(1)

      if (!cust) return { free: false, reason: '' }

      const tier = cust.membershipTier as Tier
      const benefits = TIER_BENEFITS[tier]
      const currentMonth = getCurrentMonth()
      const usedThisMonth = cust.freeShippingMonth === currentMonth ? cust.freeShippingUsed : 0

      if (usedThisMonth < benefits.freeShippingPerMonth) {
        return {
          free: true,
          reason: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Member Free Shipping (${usedThisMonth + 1}/${benefits.freeShippingPerMonth} this month)`,
        }
      }

      return { free: false, reason: '' }
    }),

  resetMonthly: protectedQuery
    .mutation(async ({ ctx }) => {
      if (!ctx.user || !['admin', 'super_admin'].includes(ctx.user.role)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      const db = getDb()
      const currentMonth = getCurrentMonth()
      const result = await db
        .update(schema.customers)
        .set({ freeShippingUsed: 0, freeShippingMonth: currentMonth })
      return { success: true, month: currentMonth }
    }),

  getActivities: protectedQuery
    .input(z.object({ customerId: z.number(), limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ input }) => {
      const db = getDb()
      return db
        .select()
        .from(schema.membershipActivities)
        .where(eq(schema.membershipActivities.customerId, input.customerId))
        .orderBy(desc(schema.membershipActivities.createdAt))
        .limit(input.limit)
    }),
})
