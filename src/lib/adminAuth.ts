/**
 * Admin Auth — DB-backed JWT via httpOnly cookie.
 * All admin auth goes through /api/admin/* endpoints.
 * No localStorage, no build-time hash.
 */

export interface AdminUser {
  id: number
  email: string
  name: string
  role: string
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: true; user: AdminUser } | { success: false; error: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) return { success: false, error: data.error || 'Login failed' }
    return { success: true, user: data.user }
  } catch {
    return { success: false, error: 'Network error. Please try again.' }
  }
}

export async function adminGetMe(): Promise<AdminUser | null> {
  try {
    const res = await fetch('/api/admin/me', { credentials: 'include' })
    if (!res.ok) return null
    const data = await res.json()
    return data.user ?? null
  } catch {
    return null
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
  } catch {}
}
