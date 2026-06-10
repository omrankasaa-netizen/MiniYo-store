import { useState, useCallback } from "react";
import {
  getStoredAdminUser,
  storeAdminUser,
  clearAdminUser,
  adminLogin,
  type AdminAuthUser,
} from "@/lib/adminAuth";

export interface AdminAuthState {
  admin: AdminAuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminAuthUser | null>(() => getStoredAdminUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        const user: AdminAuthUser = result.user ?? {
          id: 0,
          email: result.email,
          passwordSet: true,
        };
        storeAdminUser(user);
        setAdmin(user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAdminUser();
    setAdmin(null);
  }, []);

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
  };
}
