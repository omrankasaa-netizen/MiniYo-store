/**
 * Admin Authentication
 *
 * DB-backed admin auth via tRPC API.
 * No hardcoded credentials or build-time hashes.
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

async function callTrpcQuery<T>(procedure: string): Promise<T> {
  const url = `/api/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify({ json: null }))}`;
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (data?.error) {
    const msg = data.error?.json?.message || data.error?.message || "Request failed";
    throw new Error(msg);
  }
  return data?.result?.data?.json ?? data?.result?.data;
}

async function callTrpcMutation<T>(procedure: string, input: unknown = null): Promise<T> {
  const url = `/api/trpc/${procedure}`;
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json: input }),
  });
  const data = await response.json();
  if (data?.error) {
    const msg = data.error?.json?.message || data.error?.message || "Request failed";
    throw new Error(msg);
  }
  return data?.result?.data?.json ?? data?.result?.data;
}

export async function adminSetupStatus(): Promise<{ isSetup: boolean; needsSetup: boolean }> {
  return callTrpcQuery("adminAuth.setupStatus");
}

export async function adminFirstLogin(email: string): Promise<{ success: boolean; needsPasswordSetup: boolean; email: string }> {
  return callTrpcMutation("adminAuth.firstLogin", { email });
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; email: string }> {
  return callTrpcMutation("adminAuth.login", { email, password });
}

export async function adminSetupPassword(password: string, confirmPassword: string): Promise<{ success: boolean; email: string }> {
  return callTrpcMutation("adminAuth.setupPassword", { password, confirmPassword });
}

export async function adminLogout(): Promise<void> {
  await callTrpcMutation("adminAuth.logout");
  clearAdminUser();
}

export async function fetchAdminMe(): Promise<AdminAuthUser | null> {
  return callTrpcQuery("adminAuth.me");
}
