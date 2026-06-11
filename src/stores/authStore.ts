import { create } from 'zustand'
import type { Locale } from '@/types'

interface AuthStore {
  user: { id: number; email: string | null; name: string | null; role: string } | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  locale: Locale

  setUser: (user: AuthStore['user']) => void
  setLoading: (loading: boolean) => void
  setLocale: (locale: Locale) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  locale: (localStorage.getItem('locale') as Locale) || 'en',

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user ? ['admin', 'super_admin', 'staff'].includes(user.role) : false,
      isLoading: false,
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  // Unified logout: wipes authStore, memberStore, and in-memory cart together.
  // Import lazily via getState() to avoid circular module dependencies.
  logout: () => {
    // 1. Reset auth state
    set({ user: null, isAuthenticated: false, isAdmin: false })
    // 2. Wipe member session + localStorage snapshot + persisted cart
    try {
      const { useMemberStore } = require('@/stores/memberStore')
      useMemberStore.getState().logout()
    } catch { /* ignore if not yet loaded */ }
    // 3. Clear in-memory Zustand cart (memberStore.logout already removes the
    //    localStorage key, but the running Zustand instance also needs a reset)
    try {
      const { useCartStore } = require('@/stores/cartStore')
      useCartStore.getState().clearCart()
    } catch { /* ignore if not yet loaded */ }
  },

  setLocale: (locale) => {
    localStorage.setItem('locale', locale)
    set({ locale })
  },
}))
