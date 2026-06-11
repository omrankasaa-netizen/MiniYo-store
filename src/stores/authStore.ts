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

  // FIX: authStore.logout() now calls useMemberStore.logout() to keep both
  // stores in sync. Previously authStore could be cleared while memberStore
  // still held the authenticated customer, leaving membership benefits active.
  logout: () => {
    // Lazy import to avoid circular dependency
    import('@/stores/memberStore').then(({ useMemberStore }) => {
      useMemberStore.getState().logout()
    })
    set({ user: null, isAuthenticated: false, isAdmin: false })
  },

  setLocale: (locale) => {
    localStorage.setItem('locale', locale)
    set({ locale })
  },
}))
