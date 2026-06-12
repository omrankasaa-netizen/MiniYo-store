import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { getDb } from './queries/connection'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'miniyo-admin-jwt-secret'

export const adminRouter = new Hono()

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractToken(c: any): string | null {
  const auth = c.req.header('Authorization') || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  return null
}

async function requireAdmin(c: any): Promise<any | null> {
  const token = extractToken(c)
  if (!token) return null
  try {
    const payload = await verify(token, JWT_SECRET) as any
    return payload
  } catch {
    return null
  }
}

function db() { return getDb() }

async function queryRows(sql: string, params: any[] = []): Promise<any[]> {
  const result = await db().execute(sql, params) as any
  return result.rows ?? (Array.isArray(result) ? result : [])
}

// ── POST /api/admin/login ─────────────────────────────────────────────────────
adminRouter.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    if (!email || !password) return c.json({ error: 'Email and password required' }, 400)

    const rows = await queryRows(
      'SELECT id, email, name, role, passwordHash FROM admin_users WHERE email = ? LIMIT 1',
      [email.toLowerCase().trim()]
    )
    const user = rows[0]
    if (!user) return c.json({ error: 'Invalid email or password' }, 401)

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return c.json({ error: 'Invalid email or password' }, 401)

    const token = await sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET
    )

    return c.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    })
  } catch (err) {
    console.error('[admin/login]', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── GET /api/admin/me ─────────────────────────────────────────────────────────
adminRouter.get('/me', async (c) => {
  const user = await requireAdmin(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  return c.json({ user })
})

// ── POST /api/admin/logout ────────────────────────────────────────────────────
adminRouter.post('/logout', (c) => c.json({ success: true }))

// ── GET /api/admin/dashboard ──────────────────────────────────────────────────
adminRouter.get('/dashboard', async (c) => {
  const user = await requireAdmin(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const [orders, customers, products] = await Promise.all([
      queryRows('SELECT COUNT(*) as total, SUM(grandTotal) as revenue FROM orders'),
      queryRows('SELECT COUNT(*) as total FROM users'),
      queryRows('SELECT COUNT(*) as total FROM products'),
    ])
    const recentOrders = await queryRows(
      'SELECT id, orderNumber, customerName, grandTotal, orderStatus, createdAt FROM orders ORDER BY createdAt DESC LIMIT 10'
    )
    return c.json({
      stats: {
        totalOrders: orders[0]?.total || 0,
        totalRevenue: orders[0]?.revenue || 0,
        totalCustomers: customers[0]?.total || 0,
        totalProducts: products[0]?.total || 0,
      },
      recentOrders
    })
  } catch (err) {
    console.error('[admin/dashboard]', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── GET /api/admin/orders ─────────────────────────────────────────────────────
adminRouter.get('/orders', async (c) => {
  const user = await requireAdmin(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const orders = await queryRows(
      'SELECT * FROM orders ORDER BY createdAt DESC LIMIT 200'
    )
    return c.json({ orders })
  } catch (err) {
    console.error('[admin/orders]', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── PATCH /api/admin/orders/:id ───────────────────────────────────────────────
adminRouter.patch('/orders/:id', async (c) => {
  const user = await requireAdmin(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const allowed = ['orderStatus', 'whatsappConfirmed', 'trackingNumber']
    const updates = Object.entries(body).filter(([k]) => allowed.includes(k))
    if (!updates.length) return c.json({ error: 'No valid fields' }, 400)
    const set = updates.map(([k]) => `${k} = ?`).join(', ')
    const vals = updates.map(([, v]) => v)
    await db().execute(`UPDATE orders SET ${set}, updatedAt = NOW() WHERE id = ?`, [...vals, id])
    return c.json({ success: true })
  } catch (err) {
    console.error('[admin/orders/:id]', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── GET /api/admin/products ───────────────────────────────────────────────────
adminRouter.get('/products', async (c) => {
  const user = await requireAdmin(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const products = await queryRows('SELECT * FROM products ORDER BY createdAt DESC')
    return c.json({ products })
  } catch (err) {
    console.error('[admin/products]', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── POST /api/admin/products ──────────────────────────────────────────────────
adminRouter.post('/products', async (c) => {
  const user = await requireAdmin(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const body = await c.req.json()
    await db().execute(
      'INSERT INTO products (name, handle, price, compareAtPrice, description, category, stock, images, isActive, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,NOW(),NOW())',
      [body.name, body.handle, body.price, body.compareAtPrice||null, body.description||'', body.category||'', body.stock||0, JSON.stringify(body.images||[]), body.isActive ? 1 : 0]
    )
    return c.json({ success: true })
  } catch (err) {
    console.error('[admin/products POST]', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── PATCH /api/admin/products/:id ────────────────────────────────────────────
adminRouter.patch('/products/:id', async (c) => {
  const user = await requireAdmin(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const allowed = ['name','handle','price','compareAtPrice','description','category','stock','images','isActive']
    const updates = Object.entries(body).filter(([k]) => allowed.includes(k))
    if (!updates.length) return c.json({ error: 'No valid fields' }, 400)
    const set = updates.map(([k]) => `${k} = ?`).join(', ')
    const vals = updates.map(([, v]) => typeof v === 'object' ? JSON.stringify(v) : v)
    await db().execute(`UPDATE products SET ${set}, updatedAt = NOW() WHERE id = ?`, [...vals, id])
    return c.json({ success: true })
  } catch (err) {
    console.error('[admin/products/:id]', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── DELETE /api/admin/products/:id ───────────────────────────────────────────
adminRouter.delete('/products/:id', async (c) => {
  const user = await requireAdmin(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  try {
    await db().execute('DELETE FROM products WHERE id = ?', [c.req.param('id')])
    return c.json({ success: true })
  } catch (err) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── GET /api/admin/customers ──────────────────────────────────────────────────
adminRouter.get('/customers', async (c) => {
  const user = await requireAdmin(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const customers = await queryRows(
      'SELECT id, email, name, phone, role, createdAt FROM users ORDER BY createdAt DESC'
    )
    return c.json({ customers })
  } catch (err) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── GET /api/admin/staff ──────────────────────────────────────────────────────
adminRouter.get('/staff', async (c) => {
  const user = await requireAdmin(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const staff = await queryRows(
      'SELECT id, email, name, role, createdAt FROM admin_users ORDER BY createdAt ASC'
    )
    return c.json({ staff })
  } catch (err) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── POST /api/admin/staff ─────────────────────────────────────────────────────
adminRouter.post('/staff', async (c) => {
  const user = await requireAdmin(c)
  if (!user || !['super_admin'].includes(user.role)) return c.json({ error: 'Forbidden' }, 403)
  try {
    const { email, name, password, role } = await c.req.json()
    if (!email || !password) return c.json({ error: 'Email and password required' }, 400)
    const hash = await bcrypt.hash(password, 12)
    await db().execute(
      'INSERT INTO admin_users (email, name, passwordHash, role, createdAt) VALUES (?,?,?,?,NOW())',
      [email.toLowerCase().trim(), name || '', hash, role || 'staff']
    )
    return c.json({ success: true })
  } catch (err: any) {
    if (err?.message?.includes('Duplicate')) return c.json({ error: 'Email already exists' }, 409)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ── DELETE /api/admin/staff/:id ───────────────────────────────────────────────
adminRouter.delete('/staff/:id', async (c) => {
  const user = await requireAdmin(c)
  if (!user || user.role !== 'super_admin') return c.json({ error: 'Forbidden' }, 403)
  try {
    await db().execute('DELETE FROM admin_users WHERE id = ? AND role != ?', [c.req.param('id'), 'super_admin'])
    return c.json({ success: true })
  } catch (err) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})
