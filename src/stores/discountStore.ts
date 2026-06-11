import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type DiscountType = 'percentage' | 'fixed_amount' | 'flash_sale'
export type DiscountScope = 'all' | 'category' | 'product'

export interface Discount {
  id: string
  name: string
  code: string
  type: DiscountType
  value: number
  scope: DiscountScope
  minOrderAmount: number
  maxDiscount?: number
  usageLimit: number
  usageCount: number
  autoApply: boolean
  // FIX #8 — default validUntil updated to 2026-12-31.
  // The previous default was 2025-12-31, meaning any newly created discount
  // would immediately be expired (current date is June 2026). applyCode() now
  // also enforces the date check so expired codes are silently rejected at
  // checkout rather than applying a $0 discount without feedback.
  validFrom: string
  validUntil: string
  isActive: boolean
  description: string
  createdAt: string
}

interface DiscountStore {
  discounts: Discount[]
  addDiscount: (discount: Omit<Discount, 'id' | 'usageCount' | 'createdAt'>) => void
  updateDiscount: (id: string, updates: Partial<Discount>) => void
  deleteDiscount: (id: string) => void
  toggleActive: (id: string) => void
  applyCode: (code: string, subtotal: number) => { valid: boolean; discount: number; reason: string; discountId: string } | null
  applyAutoDiscounts: (subtotal: number) => { discount: number; reason: string }
  incrementUsage: (id: string) => void
}

export const useDiscountStore = create<DiscountStore>()(
  persist(
    (set, get) => ({
      discounts: [],

      addDiscount: (discount) => {
        const newDiscount: Discount = {
          ...discount,
          id: `disc-${Date.now()}`,
          usageCount: 0,
          createdAt: new Date().toISOString(),
        }
        set({ discounts: [...get().discounts, newDiscount] })
      },

      updateDiscount: (id, updates) => {
        set({
          discounts: get().discounts.map(d =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })
      },

      deleteDiscount: (id) => {
        set({ discounts: get().discounts.filter(d => d.id !== id) })
      },

      toggleActive: (id) => {
        set({
          discounts: get().discounts.map(d =>
            d.id === id ? { ...d, isActive: !d.isActive } : d
          ),
        })
      },

      // FIX #8 — strict validity check: isActive + date window + usage limit.
      // Before this fix, an expired discount (validUntil in the past) would still
      // match if isActive was true, resulting in $0 discount applied silently.
      applyCode: (code, subtotal) => {
        const now = new Date()
        const discount = get().discounts.find(
          d => d.code.toUpperCase() === code.toUpperCase() && d.isActive
        )
        if (!discount) return null

        // Date window check
        const from = new Date(discount.validFrom)
        const until = new Date(discount.validUntil)
        // Set until to end-of-day
        until.setHours(23, 59, 59, 999)
        if (now < from || now > until) return null

        // Usage limit check
        if (discount.usageLimit > 0 && discount.usageCount >= discount.usageLimit) return null

        // Minimum order check
        if (subtotal < discount.minOrderAmount) return null

        let discountAmount = 0
        if (discount.type === 'fixed_amount') {
          discountAmount = Math.min(discount.value, subtotal)
        } else {
          discountAmount = subtotal * (discount.value / 100)
          if (discount.maxDiscount) {
            discountAmount = Math.min(discountAmount, discount.maxDiscount)
          }
        }

        return {
          valid: true,
          discount: discountAmount,
          reason: `${discount.name} (${discount.code})`,
          discountId: discount.id,
        }
      },

      applyAutoDiscounts: (subtotal) => {
        const now = new Date()
        const autoDiscounts = get().discounts.filter(d => {
          if (!d.autoApply || !d.isActive) return false
          const from = new Date(d.validFrom)
          const until = new Date(d.validUntil)
          until.setHours(23, 59, 59, 999)
          return now >= from && now <= until && subtotal >= d.minOrderAmount
        })

        if (autoDiscounts.length === 0) return { discount: 0, reason: '' }

        const best = autoDiscounts.reduce((prev, curr) => {
          const prevAmt = prev.type === 'fixed_amount' ? prev.value : subtotal * (prev.value / 100)
          const currAmt = curr.type === 'fixed_amount' ? curr.value : subtotal * (curr.value / 100)
          return currAmt > prevAmt ? curr : prev
        })

        let discountAmount = 0
        if (best.type === 'fixed_amount') {
          discountAmount = Math.min(best.value, subtotal)
        } else {
          discountAmount = subtotal * (best.value / 100)
          if (best.maxDiscount) discountAmount = Math.min(discountAmount, best.maxDiscount)
        }

        return { discount: discountAmount, reason: best.name }
      },

      incrementUsage: (id) => {
        set({
          discounts: get().discounts.map(d =>
            d.id === id ? { ...d, usageCount: d.usageCount + 1 } : d
          ),
        })
      },
    }),
    { name: 'miniyo-discounts' }
  )
)
