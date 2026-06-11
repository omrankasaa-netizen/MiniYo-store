/**
 * Email tRPC Router
 * ------------------
 * Endpoints:
 *   - email.testConnection  (admin only) — verify SMTP credentials
 *   - email.sendWelcome     (internal) — triggered on register
 *   - email.sendOrderConfirmation (internal) — triggered on order placed
 *   - email.sendPasswordReset (public) — triggered on forgot password
 *   - email.sendVerification (public) — triggered on registration
 *   - email.sendOrderStatus  (admin) — triggered on order status change
 *   - email.sendMembershipUpgrade (internal) — triggered on tier upgrade
 *   - email.getQueue         (admin only) — view email_queue
 */

import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedQuery, publicQuery } from '../middleware'
import { sendEmailNow, queueEmail, testSmtpConnection } from '../email/emailService'
import {
  welcomeEmail,
  orderConfirmationEmail,
  passwordResetEmail,
  emailVerificationEmail,
  membershipUpgradeEmail,
  abandonedCartEmail,
  orderStatusEmail,
} from '../email/emailTemplates'
import { getDb } from '../queries/connection'
import * as schema from '@db/schema'
import { desc, eq } from 'drizzle-orm'

export const emailRouter = createRouter({
  testConnection: protectedQuery
    .mutation(async ({ ctx }) => {
      if (!['admin', 'super_admin'].includes(ctx.user!.role)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      return testSmtpConnection()
    }),

  sendWelcome: publicQuery
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      const tpl = welcomeEmail(input)
      return queueEmail(input.email, tpl, 'welcome')
    }),

  sendOrderConfirmation: publicQuery
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      orderNumber: z.string(),
      items: z.array(z.object({
        name: z.string(),
        qty: z.number(),
        unitPrice: z.number(),
        imageUrl: z.string().optional(),
      })),
      subtotal: z.number(),
      discountTotal: z.number(),
      deliveryFee: z.number(),
      grandTotal: z.number(),
      paymentMethod: z.string(),
      address: z.string(),
      discountReason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { email, ...data } = input
      const tpl = orderConfirmationEmail(data)
      return queueEmail(email, tpl, 'order_confirmation')
    }),

  sendPasswordReset: publicQuery
    .input(z.object({ name: z.string(), email: z.string().email(), code: z.string() }))
    .mutation(async ({ input }) => {
      const tpl = passwordResetEmail({ name: input.name, code: input.code })
      return sendEmailNow(input.email, tpl, 'password_reset')
    }),

  sendVerification: publicQuery
    .input(z.object({ name: z.string(), email: z.string().email(), code: z.string() }))
    .mutation(async ({ input }) => {
      const tpl = emailVerificationEmail({ name: input.name, code: input.code })
      return sendEmailNow(input.email, tpl, 'email_verification')
    }),

  sendOrderStatus: protectedQuery
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      orderNumber: z.string(),
      newStatus: z.string(),
      note: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!['admin', 'super_admin', 'staff'].includes(ctx.user!.role)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      const { email, ...data } = input
      const tpl = orderStatusEmail(data)
      return queueEmail(email, tpl, 'order_status')
    }),

  sendMembershipUpgrade: publicQuery
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      oldTier: z.string(),
      newTier: z.string(),
      totalSpent: z.number(),
      newDiscount: z.number(),
      newFreeShipping: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { email, ...data } = input
      const tpl = membershipUpgradeEmail(data)
      return queueEmail(email, tpl, 'membership_upgrade')
    }),

  sendAbandonedCart: publicQuery
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      items: z.array(z.object({ name: z.string(), imageUrl: z.string().optional(), price: z.number() })),
      cartTotal: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { email, ...data } = input
      const tpl = abandonedCartEmail(data)
      return queueEmail(email, tpl, 'abandoned_cart')
    }),

  getQueue: protectedQuery
    .input(z.object({ limit: z.number().min(1).max(100).default(50) }).optional())
    .query(async ({ input, ctx }) => {
      if (!['admin', 'super_admin'].includes(ctx.user!.role)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      const db = getDb()
      return db
        .select()
        .from(schema.emailQueue)
        .orderBy(desc(schema.emailQueue.createdAt))
        .limit(input?.limit ?? 50)
    }),
})
