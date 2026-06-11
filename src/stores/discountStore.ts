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
  scopeTarget?: string
  minOrderAmount: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  isActive: boolean
  usageLimit: number
  usageCount: number
  autoApply: boolean
  description: string
  createdAt: string
}

interface DiscountStore {
  discounts: Discount[]

  addDiscount: (d: Omit<Discount, 'id' | 'usageCount' | 'createdAt'>) => void
  updateDiscount: (id: string, updates: Partial<Discount>) => void
  deleteDiscount: (id: string) => void
  toggleActive: (id: string) => void
  incrementUsage: (id: string) => void

  // Validation
  getActiveDiscounts: () => Discount[]
  validateCode: (code: string, subtotal: number) => Discount | null
  calculateDiscount: (code: string, subtotal: number) => { discount: number; reason: string; discountId?: string }
  applyAutoDiscounts: (subtotal: number) => { discount: number; reason: string; discountId?: string }
}

// FIX: Updated validUntil from '2025-12-31' to '2026-12-31' — the code was
// expired and silently returning $0 discount for all customers applying it.
const SEED_DISCOUNTS: Discount[] = [
  {
    id: 'disc-welcome',
    name: 'Welcome Sale',
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    scope: 'all',
    minOrderAmount: 0,
    maxDiscount: 30,
    validFrom: '2025-01-01',
    validUntil: '2026-12-31',
    isActive: true,
    usageLimit: 9999,
    usageCount: 0,
    autoApply: false,
    description: '15% off your first order',
    createdAt: '2025-01-01',
  },
]

export const useDiscountStore = create<DiscountStore>()(
  persist(
    (set, get) => ({
      discounts: SEED_DISCOUNTS,

      addDiscount: (d) => {
        const discount: Discount = {
          ...d,
          id: `disc-${Date.now()}`,
          usageCount: 0,
          createdAt: new Date().toISOString(),
        }
        set({ discounts: [...get().discounts, discount] })
      },

      updateDiscount: (id, updates) => {
        set({ discounts: get().discounts.map(d => d.id === id ? { ...d, ...updates } : d) })
      },

      deleteDiscount: (id) => {
        set({ discounts: get().discounts.filter(d => d.id !== id) })
      },

      toggleActive: (id) => {
        set({ discounts: get().discounts.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d) })
      },

      incrementUsage: (id) => {
        set({ discounts: get().discounts.map(d => d.id === id ? { ...d, usageCount: d.usageCount + 1 } : d) })
      },

      getActiveDiscounts: () => {
        const now = new Date().toISOString().slice(0, 10)
        return get().discounts.filter(d =>
          d.isActive &&
          d.validFrom <= now &&
          d.validUntil >= now &&
          (d.usageLimit === 0 || d.usageCount < d.usageLimit)
        )
      },

      validateCode: (code, subtotal) => {
        const now = new Date().toISOString().slice(0, 10)
        const d = get().discounts.find(d =>
          d.code.toUpperCase() === code.toUpperCase() &&
          d.isActive &&
          d.validFrom <= now &&
          d.validUntil >= now &&
          subtotal >= d.minOrderAmount &&
          (d.usageLimit === 0 || d.usageCount < d.usageLimit)
        )
        return d || null
      },

      calculateDiscount: (code, subtotal) => {
        const d = get().validateCode(code, subtotal)
        if (!d) return { discount: 0, reason: '' }
        let discount = 0
        if (d.type === 'percentage' || d.type === 'flash_sale') {
          discount = subtotal * (d.value / 100)
        } else if (d.type === 'fixed_amount') {
          discount = d.value
        }
        if (d.maxDiscount && discount > d.maxDiscount) discount = d.maxDiscount
        return { discount, reason: `${d.name} (${d.code})`, discountId: d.id }
      },

      applyAutoDiscounts: (subtotal) => {
        const now = new Date().toISOString().slice(0, 10)
        const auto = get().discounts.find(d =>
          d.autoApply && d.isActive &&
          d.validFrom <= now && d.validUntil >= now &&
          subtotal >= d.minOrderAmount &&
          (d.usageLimit === 0 || d.usageCount < d.usageLimit)
        )
        if (!auto) return { discount: 0, reason: '' }
        let discount = 0
        if (auto.type === 'percentage' || auto.type === 'flash_sale') {
          discount = subtotal * (auto.value / 100)
        } else if (auto.type === 'fixed_amount') {
          discount = auto.value
        }
        if (auto.maxDiscount && discount > auto.maxDiscount) discount = auto.maxDiscount
        return { discount, reason: `${auto.name} (auto)`, discountId: auto.id }
      },
    }),
    { name: 'miniyo-discounts' }
  )
)
