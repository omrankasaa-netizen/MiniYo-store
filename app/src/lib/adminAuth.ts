/**
 * Admin Authentication
 * Direct HTTP-based admin auth via /api/admin/login and /api/admin/me.
 */

const ADMIN_USER_KEY = "miniyo_admin_user";

export type AdminRole = "super_admin" | "admin" | "staff";

export interface AdminAuthUser {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  permissions: string[];
  passwordSet: boolean;
}

export function getStoredAdminUser(): AdminAuthUser | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeAdminUser(user: AdminAuthUser) {
  sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminUser() {
  sessionStorage.removeItem(ADMIN_USER_KEY);
}

/** Check if the current user has a specific permission */
export function can(user: AdminAuthUser | null, permission: string): boolean {
  return user?.permissions.includes(permission) ?? false;
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; email: string; name: string; role: AdminRole; permissions: string[]; user?: AdminAuthUser }> {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    const msg = data?.error || data?.message || "Login failed";
    throw new Error(msg);
  }
  return data;
}

/** Rehydrate admin session from the server (call on app mount) */
export async function fetchAdminMe(): Promise<AdminAuthUser | null> {
  try {
    const res = await fetch("/api/admin/me", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.email) return null;
    return data as AdminAuthUser;
  } catch {
    return null;
  }
}
