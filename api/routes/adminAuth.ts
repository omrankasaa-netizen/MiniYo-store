import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import { getDb } from '../queries/connection'
import bcrypt from 'bcryptjs'

const adminAuth = new Hono()

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'miniyo-admin-secret-change-in-prod'
const COOKIE_NAME = 'miniyo_admin_token'

// POST /api/admin/login
adminAuth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    const db = getDb()
    const rows = await db.execute(
      'SELECT id, email, name, role, passwordHash FROM admin_users WHERE email = ? LIMIT 1',
      [email]
    )
    const user = (rows as any).rows?.[0] ?? (Array.isArray(rows) ? rows[0] : null)

    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    const token = await sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET
    )

    setCookie(c, COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return c.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (err) {
    console.error('[adminAuth/login]', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// GET /api/admin/me
adminAuth.get('/me', async (c) => {
  try {
    const token = getCookie(c, COOKIE_NAME)
    if (!token) return c.json({ error: 'Not authenticated' }, 401)

    const payload = await verify(token, JWT_SECRET)
    return c.json({ user: payload })
  } catch {
    return c.json({ error: 'Invalid or expired session' }, 401)
  }
})

// POST /api/admin/logout
adminAuth.post('/logout', (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/' })
  return c.json({ success: true })
})

export { adminAuth }
