import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  items: string[]
  add: (productId: string) => void
  remove: (productId: string) => void
  toggle: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (productId) => {
        if (!get().items.includes(productId)) {
          set({ items: [...get().items, productId] })
        }
      },

      remove: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) })
      },

      toggle: (productId) => {
        if (get().items.includes(productId)) {
          set({ items: get().items.filter((id) => id !== productId) })
        } else {
          set({ items: [...get().items, productId] })
        }
      },

      isInWishlist: (productId) => get().items.includes(productId),
    }),
    {
      name: 'miniyo-wishlist',
    }
  )
)
