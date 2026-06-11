import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { getProfile, getStaffRole } from '@/lib/auth'
import type { Profile } from '@/lib/auth'
import { useMemberStore } from '@/stores/memberStore'
import { useCartStore } from '@/stores/cartStore'

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  role: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const syncProfile = useMemberStore(s => s.syncProfile)
  const memberLogout = useMemberStore(s => s.logout)
  const clearCart = useCartStore(s => s.clearCart)

  const loadUserData = useCallback(async (user: User) => {
    try {
      const [prof, staffRole] = await Promise.all([
        getProfile(user.id),
        getStaffRole(user.id),
      ])
      setProfile(prof)
      setRole(staffRole)
      // Keep Zustand memberStore in sync for components that read membership data
      syncProfile({
        name: prof.name,
        email: user.email ?? null,
        phone: prof.phone ?? null,
      })
    } catch (err) {
      console.error('[AuthProvider] Failed to load user data:', err)
      setProfile(null)
      setRole(null)
    }
  }, [syncProfile])

  useEffect(() => {
    // Rehydrate session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) {
        loadUserData(data.session.user).finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        loadUserData(newSession.user)
      } else {
        // User signed out — wipe all state
        setProfile(null)
        setRole(null)
        memberLogout()  // wipes Zustand memberStore + localStorage
        clearCart()     // wipes persisted cart
      }
    })

    return () => subscription.unsubscribe()
  }, [loadUserData, memberLogout, clearCart])

  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadUserData(session.user)
  }, [session, loadUserData])

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      profile,
      role,
      isAuthenticated: !!session,
      isAdmin: !!role,
      isSuperAdmin: role === 'super_admin',
      isLoading,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
