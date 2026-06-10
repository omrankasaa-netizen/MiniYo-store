/**
 * Admin Authentication
 *
 * Direct HTTP-based admin auth via /api/admin/login.
 * No tRPC dependencies.
 */

const ADMIN_USER_KEY = "miniyo_admin_user";

export interface AdminAuthUser {
  id: number;
  email: string;
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

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; email: string; user?: AdminAuthUser }> {
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
