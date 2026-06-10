import { useCallback, useState, useEffect } from "react";
import {
  getCurrentUser,
  clearAuth,
  localLogin,
  localRegister,
  localLogout,
  isAdminRole,
} from "@/lib/hybridAuth";
import { useMemberStore } from "@/stores/memberStore";

export interface AuthUser {
  id: number;
  email: string | null;
  name: string | null;
  phone: string | null;
  role: string;
  avatar: string | null;
}

export function useAuth() {
  const [user, setUserState] = useState<AuthUser | null>(() => getCurrentUser())
  const [isLoading, setIsLoading] = useState(false)

  // Keep state in sync across tabs
  useEffect(() => {
    const handler = () => {
      setUserState(getCurrentUser())
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const setUser = useCallback((user: AuthUser | null) => {
    setUserState(user)
  }, [])

  const memberSync = useMemberStore(s => s.syncProfile)
  const memberLogout = useMemberStore(s => s.logout)

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await localLogin(email, password)
      if (result.success) {
        setUserState(result.user)
        // Sync auth user to memberStore so checkout sees profile data
        memberSync({
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
        })
        return { success: true, user: result.user }
      } else {
        throw new Error(result.error)
      }
    },
    [setUser, memberSync]
  )

  const register = useCallback(
    async (data: { email: string; password: string; name: string; phone?: string }) => {
      const result = await localRegister(data)
      if (result.success) {
        setUserState(result.user)
        // Sync auth user to memberStore
        memberSync({
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
        })
        return { success: true, user: result.user }
      } else {
        throw new Error(result.error)
      }
    },
    [setUser, memberSync]
  )

  const logout = useCallback(() => {
    localLogout()
    memberLogout()
    setUserState(null)
    window.location.reload()
  }, [setUser, memberLogout])

  const isAuthenticated = !!user
  const isAdmin = user ? isAdminRole(user.role) : false
  const isStaff = user ? ["admin", "super_admin", "staff"].includes(user.role) : false

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isStaff,
    login,
    register,
    logout,
    isLoggingIn: false,
    isRegistering: false,
    isLoggingOut: false,
    loginError: null,
    registerError: null,
    backendAvailable: false,
  }
}
