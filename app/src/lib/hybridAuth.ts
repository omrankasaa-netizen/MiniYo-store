/**
 * Customer Authentication System (localStorage-based)
 *
 * Handles customer registration and login for storefront users.
 * Admin authentication is handled separately via adminAuth.ts.
 */

import bcrypt from "bcryptjs";

const AUTH_KEY = "miniyo_auth_user";
const USERS_KEY = "miniyo_users";

export interface LocalUser {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  avatar: string | null;
  passwordHash: string;
}

function getStoredUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): Omit<LocalUser, "passwordHash"> | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user || null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function setAuthUser(user: Omit<LocalUser, "passwordHash">) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export async function localLogin(
  email: string,
  password: string
): Promise<{ success: true; user: Omit<LocalUser, "passwordHash"> } | { success: false; error: string }> {
  const users = getStoredUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  if (!user.passwordHash) {
    return { success: false, error: "Invalid email or password" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  const { passwordHash: _, ...safeUser } = user;
  setAuthUser(safeUser);
  return { success: true, user: safeUser };
}

export async function localRegister(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}): Promise<{ success: true; user: Omit<LocalUser, "passwordHash"> } | { success: false; error: string }> {
  const users = getStoredUsers();

  if (users.some((u) => u.email === data.email)) {
    return { success: false, error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const newUser: LocalUser = {
    id: Date.now(),
    email: data.email,
    name: data.name,
    phone: data.phone || null,
    role: "customer",
    avatar: null,
    passwordHash,
  };

  users.push(newUser);
  storeUsers(users);

  const { passwordHash: _, ...safeUser } = newUser;
  setAuthUser(safeUser);
  return { success: true, user: safeUser };
}

export async function localLogout() {
  clearAuth();
}

export function isAdminRole(role: string): boolean {
  return ["admin", "super_admin", "staff"].includes(role);
}
