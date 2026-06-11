import { create } from 'zustand'
import type { Locale } from '@/types'

interface AuthStore {
  user: { id: number; email: string | null; name: string | null; role: string } | null
  // isAuthenticated is derived — not stored — to prevent spoofing
  readonly isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  locale: Locale

  setUser: (user: AuthStore['user']) => void
  setLoading: (loading: boolean) => void
  setLocale: (locale: Locale) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAdmin: false,
  isLoading: true,
  locale: (localStorage.getItem('locale') as Locale) || 'en',

  // SECURITY: Derived getter — cannot be forged via DevTools
  get isAuthenticated() {
    return get().user !== null
  },

  setUser: (user) => {
    set({
      user,
      isAdmin: user ? ['admin', 'super_admin', 'staff'].includes(user.role) : false,
      isLoading: false,
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    set({ user: null, isAdmin: false })
  },

  setLocale: (locale) => {
    localStorage.setItem('locale', locale)
    set({ locale })
  },
}))
