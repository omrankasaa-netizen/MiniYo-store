/**
 * Client-side password hashing using the Web Crypto API (SHA-256).
 *
 * NOTE: This is a frontend-only store — there is no backend server to handle
 * auth. SHA-256 hashing is NOT a substitute for bcrypt/argon2 on a real server,
 * but it is far better than plain-text passwords in localStorage.
 *
 * Passwords are stored under 'miniyo-passwords-v2' to avoid collisions with
 * the old plain-text 'miniyo-passwords' key.
 */

const STORAGE_KEY = 'miniyo-passwords-v2'

async function sha256(str: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function getStore(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {}
}

function saveStore(store: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

/** Hash and store a password for a given email. */
export async function storePassword(email: string, password: string): Promise<void> {
  const hash = await sha256(password)
  const store = getStore()
  store[email] = hash
  saveStore(store)
}

/** Verify a password against the stored hash. Returns true if it matches. */
export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const store = getStore()
  const stored = store[email]
  if (!stored) {
    // Migration: check old plain-text store as fallback (first login after upgrade)
    const oldStore = (() => {
      try {
        const raw = localStorage.getItem('miniyo-passwords')
        return raw ? JSON.parse(raw) : {}
      } catch { return {} }
    })()
    if (oldStore[email] && oldStore[email] === password) {
      // Migrate to hashed storage on first match
      await storePassword(email, password)
      return true
    }
    return false
  }
  const hash = await sha256(password)
  return stored === hash
}
