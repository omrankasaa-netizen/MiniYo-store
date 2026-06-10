import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { checkStock, getEffectiveStock } from '@/lib/storefrontSync'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  subtotal: number

  addItem: (item: CartItem) => boolean
  removeItem: (productId: string, variantId: string | null) => void
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => boolean
  clearCart: () => void
  open: () => void
  close: () => void
  toggle: () => void
  getCartQtyForProduct: (productId: string) => number
  checkout: () => { orderNumber: string; items: CartItem[]; subtotal: number } | null
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      subtotal: 0,

      getCartQtyForProduct: (productId: string) => {
        return get().items
          .filter(i => i.productId === productId)
          .reduce((sum, i) => sum + i.quantity, 0)
      },

      addItem: (item) => {
        const inCartQty = get().getCartQtyForProduct(item.productId)
        const { allowed, available } = checkStock(item.productId, item.quantity, inCartQty)

        if (available <= 0) return false
        if (allowed <= 0) return false

        const effectiveItem = { ...item, quantity: allowed }

        const items = get().items
        const existingIndex = items.findIndex(
          (i) => i.productId === effectiveItem.productId && i.variantId === effectiveItem.variantId
        )
        let newItems: CartItem[]
        if (existingIndex >= 0) {
          newItems = [...items]
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + effectiveItem.quantity,
          }
        } else {
          newItems = [...items, effectiveItem]
        }
        set({
          items: newItems,
          totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
        return true
      },

      removeItem: (productId, variantId) => {
        const items = get().items.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        )
        set({
          items,
          totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity < 1) return false
        const stock = getEffectiveStock(productId)
        if (quantity > stock) return false

        const items = get().items.map((i) =>
          i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
        )
        set({
          items,
          totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
        return true
      },

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      checkout: () => {
        const items = get().items
        if (items.length === 0) return null

        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
        const orderNumber = `MIN-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`

        const result = { orderNumber, items: [...items], subtotal }
        set({ items: [], totalItems: 0, subtotal: 0 })
        return result
      },
    }),
    {
      name: 'miniyo-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
