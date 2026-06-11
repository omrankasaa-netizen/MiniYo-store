/**
 * Hybrid Authentication System
 *
 * Admin password hash is injected at BUILD TIME via vite.config.ts define.
 * No plaintext password exists in source code or bundle.
 *
 * Customer passwords are bcrypt-hashed (cost 12) and stored in
 * localStorage under the key 'miniyo_users'. The legacy 'miniyo-passwords'
 * key (plaintext) is no longer written — all password operations route
 * through this module.
 */

import bcrypt from 'bcryptjs'

// Injected at build time by vite.config.ts define plugin
declare const __ADMIN_PASSWORD_HASH__: string

const AUTH_KEY = 'miniyo_auth_user'
const USERS_KEY = 'miniyo_users'

/** Single source of truth for the admin email — imported by App.tsx and memberStore */
export const ADMIN_EMAIL = 'miniyo.store.lb@gmail.com'

// Build-time hash from vite.config.ts define plugin
const BUILD_TIME_ADMIN_HASH: string =
  typeof __ADMIN_PASSWORD_HASH__ !== 'undefined' ? __ADMIN_PASSWORD_HASH__ : ''

export interface LocalUser {
  id: number
  email: string
  name: string | null
  phone: string | null
  role: string
  avatar: string | null
  passwordHash: string
}

function getStoredUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function storeUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function seedAdminUser() {
  const users = getStoredUsers()
  if (users.some((u) => u.email === ADMIN_EMAIL)) return
  users.push({
    id: 1,
    email: ADMIN_EMAIL,
    name: 'Omran',
    phone: '+961 81 38 59 40',
    role: 'super_admin',
    avatar: null,
    passwordHash: BUILD_TIME_ADMIN_HASH || '__unset__',
  })
  storeUsers(users)
}

export function getCurrentUser(): Omit<LocalUser, 'passwordHash'> | null {
  seedAdminUser()
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw) || null
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
}

export function setAuthUser(user: Omit<LocalUser, 'passwordHash'>) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export async function localLogin(
  email: string,
  password: string
): Promise<
  | { success: true; user: Omit<LocalUser, 'passwordHash'> }
  | { success: false; error: string }
> {
  seedAdminUser()
  const users = getStoredUsers()
  const user = users.find((u) => u.email === email)
  if (!user) return { success: false, error: 'Invalid email or password' }

  if (user.passwordHash === '__unset__' || user.passwordHash === '') {
    return {
      success: false,
      error: 'Admin login is disabled. Set ADMIN_PASSWORD environment variable and redeploy.',
    }
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return { success: false, error: 'Invalid email or password' }

  const { passwordHash: _, ...safeUser } = user
  setAuthUser(safeUser)
  return { success: true, user: safeUser }
}

export async function localRegister(data: {
  email: string
  password: string
  name: string
  phone?: string
}): Promise<
  | { success: true; user: Omit<LocalUser, 'passwordHash'> }
  | { success: false; error: string }
> {
  seedAdminUser()
  const users = getStoredUsers()

  if (users.some((u) => u.email === data.email)) {
    return { success: false, error: 'An account with this email already exists' }
  }

  const passwordHash = await bcrypt.hash(data.password, 12)
  const newUser: LocalUser = {
    id: Date.now(),
    email: data.email,
    name: data.name,
    phone: data.phone || null,
    role: 'customer',
    avatar: null,
    passwordHash,
  }

  users.push(newUser)
  storeUsers(users)

  const { passwordHash: _, ...safeUser } = newUser
  setAuthUser(safeUser)
  return { success: true, user: safeUser }
}

export async function localLogout() {
  clearAuth()
}

/**
 * Update a user's password — bcrypt-hashes the new value (cost 12)
 * and persists it to miniyo_users. Used by memberStore.resetPassword().
 */
export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  const users = getStoredUsers()
  const idx = users.findIndex((u) => u.email === email)
  if (idx === -1) return false
  users[idx] = { ...users[idx], passwordHash: await bcrypt.hash(newPassword, 12) }
  storeUsers(users)
  return true
}

export function isAdminRole(role: string): boolean {
  return ['admin', 'super_admin', 'staff'].includes(role)
}
