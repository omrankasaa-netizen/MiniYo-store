import { useState, useCallback, useEffect } from "react";
import {
  getStoredAdminUser,
  storeAdminUser,
  clearAdminUser,
  adminLogin,
  fetchAdminMe,
  can,
  type AdminAuthUser,
  type AdminRole,
} from "@/lib/adminAuth";

export type { AdminAuthUser, AdminRole };

export interface AdminAuthState {
  admin: AdminAuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminAuthUser | null>(() => getStoredAdminUser());
  const [isLoading, setIsLoading] = useState(true);

  // On mount: verify session is still valid server-side
  useEffect(() => {
    fetchAdminMe()
      .then((user) => {
        if (user) {
          storeAdminUser(user);
          setAdmin(user);
        } else {
          clearAdminUser();
          setAdmin(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        const user: AdminAuthUser = {
          id: 0,
          email: result.email,
          name: result.name ?? "",
          role: result.role,
          permissions: result.permissions ?? [],
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

  /** Check if the logged-in admin has a given permission */
  const hasPermission = useCallback(
    (permission: string) => can(admin, permission),
    [admin]
  );

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    role: admin?.role ?? null,
    permissions: admin?.permissions ?? [],
    hasPermission,
    isSuperAdmin: admin?.role === "super_admin",
    isAdminOrAbove: admin?.role === "super_admin" || admin?.role === "admin",
    login,
    logout,
  };
}
