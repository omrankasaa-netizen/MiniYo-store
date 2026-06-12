// Admin Auth — talks to /api/admin/* endpoints backed by MySQL admin_users table.
// No localStorage, no build-time hash, no dependency on customer auth.

export interface AdminUser {
  id: number
  email: string
  name: string
  role: string
}

const TOKEN_KEY = 'miniyo_admin_jwt'

export function getAdminToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

function saveToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token) } catch {}
}

function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY) } catch {}
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: true; user: AdminUser } | { success: false; error: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) return { success: false, error: data.error || 'Login failed' }
    if (data.token) saveToken(data.token)
    return { success: true, user: data.user }
  } catch {
    return { success: false, error: 'Network error. Please try again.' }
  }
}

export async function adminGetMe(): Promise<AdminUser | null> {
  const token = getAdminToken()
  if (!token) return null
  try {
    const res = await fetch('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) { clearToken(); return null }
    const data = await res.json()
    return data.user ?? null
  } catch {
    return null
  }
}

export async function adminLogout(): Promise<void> {
  clearToken()
  try {
    const token = getAdminToken()
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  } catch {}
}
