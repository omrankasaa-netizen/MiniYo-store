import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  items: string[]
  add: (productId: string) => void
  remove: (productId: string) => void
  toggle: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  // FIX: Added clearWishlist so logout can wipe the wishlist and prevent
  // a previous customer's saved items from being visible to the next session.
  clearWishlist: () => void
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

      clearWishlist: () => {
        set({ items: [] })
        localStorage.removeItem('miniyo-wishlist')
      },
    }),
    {
      name: 'miniyo-wishlist',
    }
  )
)
