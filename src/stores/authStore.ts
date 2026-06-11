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

  /**
   * FIX: logout now also wipes memberStore + cart.
   * Previously authStore and memberStore were independent — logging out of one
   * left the other intact, so membership discounts persisted for anonymous visitors.
   */
  logout: () => {
    set({ user: null, isAuthenticated: false, isAdmin: false })
    // Lazy import to avoid circular dependency at module load time
    import('@/stores/memberStore').then(({ useMemberStore }) => {
      useMemberStore.getState().logout()
    }).catch(() => {
      // Fallback: wipe localStorage keys directly if import fails
      try {
        localStorage.removeItem('miniyo-member')
        localStorage.removeItem('miniyo-cart')
      } catch { /* ignore */ }
    })
  },

  setLocale: (locale) => {
    localStorage.setItem('locale', locale)
    set({ locale })
  },
}))
