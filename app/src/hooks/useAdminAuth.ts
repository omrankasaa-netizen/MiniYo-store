import { useState, useEffect, useCallback } from "react";
import {
  getStoredAdminUser,
  storeAdminUser,
  clearAdminUser,
  adminSetupStatus,
  adminFirstLogin,
  adminLogin,
  adminSetupPassword,
  adminLogout,
  fetchAdminMe,
  type AdminAuthUser,
} from "@/lib/adminAuth";

export interface AdminAuthState {
  admin: AdminAuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsSetup: boolean;
}

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminAuthUser | null>(() => getStoredAdminUser());
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  // On mount, verify the session with the server and check setup status
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Check setup status first
        const status = await adminSetupStatus();
        if (cancelled) return;

        if (status.needsSetup) {
          setNeedsSetup(true);
          setAdmin(null);
          clearAdminUser();
          setIsLoading(false);
          return;
        }

        // Verify existing session
        const me = await fetchAdminMe();
        if (cancelled) return;

        if (me) {
          storeAdminUser(me);
          setAdmin(me);
        } else {
          clearAdminUser();
          setAdmin(null);
        }
      } catch {
        if (!cancelled) {
          setAdmin(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const firstLogin = useCallback(async (email: string) => {
    const result = await adminFirstLogin(email);
    if (result.success) {
      // Don't store user yet — they still need to set a password
      setNeedsSetup(false); // admin record created, now needs password setup
    }
    return result;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await adminLogin(email, password);
    if (result.success) {
      // Fetch full admin profile after login
      const me = await fetchAdminMe();
      if (me) {
        storeAdminUser(me);
        setAdmin(me);
      }
    }
    return result;
  }, []);

  const setupPassword = useCallback(async (password: string, confirmPassword: string) => {
    const result = await adminSetupPassword(password, confirmPassword);
    if (result.success) {
      const me = await fetchAdminMe();
      if (me) {
        storeAdminUser(me);
        setAdmin(me);
      }
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await adminLogout();
    setAdmin(null);
    setNeedsSetup(false);
  }, []);

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    needsSetup,
    firstLogin,
    login,
    setupPassword,
    logout,
  };
}
