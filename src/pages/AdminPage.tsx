import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { adminGetMe, adminLogout, type AdminUser } from '@/lib/adminAuth'

// ── Types ─────────────────────────────────────────────────────────────────────
type View = 'dashboard' | 'orders' | 'products' | 'customers' | 'staff' | 'settings'

interface Stats { totalOrders: number; totalRevenue: number; totalCustomers: number; totalProducts: number }
interface Order { id: number; orderNumber: string; customerName: string; grandTotal: number; orderStatus: string; createdAt: string; paymentMethod?: string }
interface Product { id: number; name: string; price: number; stock: number; category: string; isActive: number; handle: string }
interface Customer { id: number; email: string; name: string; phone?: string; role: string; createdAt: string }
interface Staff { id: number; email: string; name: string; role: string; createdAt: string }

// ── Helpers ───────────────────────────────────────────────────────────────────
function getToken() { try { return localStorage.getItem('miniyo_admin_jwt') || '' } catch { return '' } }

async function api(path: string, opts: RequestInit = {}) {
  const r = await fetch(`/api/admin${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...(opts.headers || {}) },
  })
  return r.json()
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const NAV: { id: View; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { id: 'customers', label: 'Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'staff', label: 'Staff', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

const STATUS_COLORS: Record<string, string> = {
  pending_confirmation: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  packed: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AdminPage() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [checking, setChecking] = useState(true)
  const [view, setView] = useState<View>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // data state
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // form state
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [productForm, setProductForm] = useState({ name: '', handle: '', price: '', stock: '', category: '', description: '', isActive: true })
  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '', role: 'staff' })
  const [search, setSearch] = useState('')

  // ── Auth check ──
  useEffect(() => {
    adminGetMe().then(user => {
      if (!user) navigate('/admin-login', { replace: true })
      else { setAdmin(user); setChecking(false) }
    })
  }, [])

  // ── Toast helper ──
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // ── Data loading ──
  const loadDashboard = useCallback(async () => {
    setLoading(true)
    const data = await api('/dashboard')
    setStats(data.stats)
    setRecentOrders(data.recentOrders || [])
    setLoading(false)
  }, [])

  const loadOrders = useCallback(async () => {
    setLoading(true)
    const data = await api('/orders')
    setOrders(data.orders || [])
    setLoading(false)
  }, [])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    const data = await api('/products')
    setProducts(data.products || [])
    setLoading(false)
  }, [])

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    const data = await api('/customers')
    setCustomers(data.customers || [])
    setLoading(false)
  }, [])

  const loadStaff = useCallback(async () => {
    setLoading(true)
    const data = await api('/staff')
    setStaff(data.staff || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (checking) return
    if (view === 'dashboard') loadDashboard()
    if (view === 'orders') loadOrders()
    if (view === 'products') loadProducts()
    if (view === 'customers') loadCustomers()
    if (view === 'staff') loadStaff()
  }, [view, checking])

  const handleLogout = async () => {
    await adminLogout()
    navigate('/admin-login', { replace: true })
  }

  const updateOrderStatus = async (id: number, status: string) => {
    await api(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ orderStatus: status }) })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: status } : o))
    showToast('Order status updated')
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product?')) return
    await api(`/products/${id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== id))
    showToast('Product deleted')
  }

  const toggleProductActive = async (id: number, current: number) => {
    await api(`/products/${id}`, { method: 'PATCH', body: JSON.stringify({ isActive: current ? 0 : 1 }) })
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: current ? 0 : 1 } : p))
  }

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await api('/products', {
      method: 'POST',
      body: JSON.stringify({ ...productForm, price: parseFloat(productForm.price), stock: parseInt(productForm.stock) })
    })
    if (res.success) {
      showToast('Product added')
      setShowAddProduct(false)
      setProductForm({ name: '', handle: '', price: '', stock: '', category: '', description: '', isActive: true })
      loadProducts()
    } else showToast(res.error || 'Error')
  }

  const submitStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await api('/staff', { method: 'POST', body: JSON.stringify(staffForm) })
    if (res.success) {
      showToast('Staff member added')
      setShowAddStaff(false)
      setStaffForm({ name: '', email: '', password: '', role: 'staff' })
      loadStaff()
    } else showToast(res.error || 'Error')
  }

  const deleteStaff = async (id: number) => {
    if (!confirm('Remove this staff member?')) return
    await api(`/staff/${id}`, { method: 'DELETE' })
    setStaff(prev => prev.filter(s => s.id !== id))
    showToast('Staff member removed')
  }

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE9]">
      <div className="w-8 h-8 border-[3px] border-[#01696f] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!admin) return null

  // ── Sidebar ──
  const Sidebar = () => (
    <aside className={`fixed inset-y-0 left-0 z-40 w-56 bg-[#1a2e1a] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#01696f] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-white">MiniYo</div>
            <div className="text-[10px] text-white/40">Admin Panel</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => { setView(item.id); setSidebarOpen(false) }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              view === item.id
                ? 'bg-[#01696f] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-[#01696f] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {admin.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">{admin.name || 'Admin'}</div>
            <div className="text-[10px] text-white/40 truncate">{admin.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sign out
        </button>
      </div>
    </aside>
  )

  // ── Dashboard ──
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats?.totalOrders ?? '—', color: 'bg-blue-50 text-blue-600' },
          { label: 'Revenue', value: stats ? `$${Number(stats.totalRevenue || 0).toFixed(2)}` : '—', color: 'bg-green-50 text-green-600' },
          { label: 'Customers', value: stats?.totalCustomers ?? '—', color: 'bg-purple-50 text-purple-600' },
          { label: 'Products', value: stats?.totalProducts ?? '—', color: 'bg-amber-50 text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E4DB]">
            <div className={`text-2xl font-bold ${s.color.split(' ')[1]}`}>{loading ? '…' : s.value}</div>
            <div className="text-xs text-[#888] mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E8E4DB] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E4DB]">
          <h2 className="font-semibold text-[#1a1a1a] text-sm">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9F8F5]">
              <tr>{['Order #','Customer','Amount','Status','Date'].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[#888]">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {recentOrders.length === 0 && !loading && <tr><td colSpan={5} className="text-center py-8 text-[#aaa] text-sm">No orders yet</td></tr>}
              {recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-[#F9F8F5] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#01696f]">{o.orderNumber}</td>
                  <td className="px-4 py-3 font-medium">{o.customerName}</td>
                  <td className="px-4 py-3">${Number(o.grandTotal).toFixed(2)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-600'}`}>{o.orderStatus?.replace(/_/g,' ')}</span></td>
                  <td className="px-4 py-3 text-[#888] text-xs">{new Date(o.createdAt).toLocaleDateString('en-LB',{day:'numeric',month:'short',year:'numeric'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // ── Orders ──
  const OrdersView = () => {
    const filtered = orders.filter(o =>
      !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || o.customerName?.toLowerCase().includes(search.toLowerCase())
    )
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#E8E4DB] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E4DB] flex items-center gap-3">
          <h2 className="font-semibold text-sm flex-1">All Orders</h2>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…" className="px-3 py-1.5 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#01696f] w-48" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9F8F5]"><tr>{['Order #','Customer','Amount','Payment','Status','Date','Action'].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[#888]">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-[#aaa]">No orders found</td></tr>}
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-[#F9F8F5]">
                  <td className="px-4 py-3 font-mono text-xs text-[#01696f]">{o.orderNumber}</td>
                  <td className="px-4 py-3 font-medium">{o.customerName}</td>
                  <td className="px-4 py-3">${Number(o.grandTotal).toFixed(2)}</td>
                  <td className="px-4 py-3 uppercase text-xs text-[#888]">{o.paymentMethod}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-600'}`}>{o.orderStatus?.replace(/_/g,' ')}</span></td>
                  <td className="px-4 py-3 text-xs text-[#888]">{new Date(o.createdAt).toLocaleDateString('en-LB',{day:'numeric',month:'short'})}</td>
                  <td className="px-4 py-3">
                    <select value={o.orderStatus} onChange={e => updateOrderStatus(o.id, e.target.value)}
                      className="text-xs border border-[#ddd] rounded-md px-2 py-1 outline-none focus:border-[#01696f]">
                      {['pending_confirmation','confirmed','packed','out_for_delivery','delivered','cancelled'].map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ── Products ──
  const ProductsView = () => {
    const filtered = products.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()))
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="px-3 py-1.5 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#01696f] flex-1 max-w-xs" />
          <button onClick={() => setShowAddProduct(true)} className="px-4 py-1.5 bg-[#01696f] text-white text-sm font-semibold rounded-lg hover:bg-[#015a60] transition-colors">+ Add Product</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#E8E4DB] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F9F8F5]"><tr>{['Name','Category','Price','Stock','Active','Actions'].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[#888]">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[#aaa]">No products found</td></tr>}
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#F9F8F5]">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-[#888] text-xs">{p.category}</td>
                  <td className="px-4 py-3">${Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleProductActive(p.id, p.isActive)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${p.isActive ? 'bg-[#01696f]' : 'bg-[#ddd]'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${p.isActive ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showAddProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="font-bold text-lg mb-4">Add Product</h3>
              <form onSubmit={submitProduct} className="space-y-3">
                {[['Name','name','text'],['Handle (URL slug)','handle','text'],['Price','price','number'],['Stock','stock','number'],['Category','category','text']].map(([label,key,type]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-[#444] mb-1">{label}</label>
                    <input type={type} required value={(productForm as any)[key]} onChange={e => setProductForm(f => ({...f,[key]:e.target.value}))}
                      className="w-full px-3 py-2 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#01696f]" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">Description</label>
                  <textarea value={productForm.description} onChange={e => setProductForm(f => ({...f,description:e.target.value}))}
                    className="w-full px-3 py-2 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#01696f] resize-none" rows={3} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 py-2 text-sm font-medium text-[#666] bg-[#F2EFE9] hover:bg-[#E8E4DB] rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2 text-sm font-semibold text-white bg-[#01696f] hover:bg-[#015a60] rounded-lg">Add Product</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Customers ──
  const CustomersView = () => {
    const filtered = customers.filter(c => !search || c.email?.toLowerCase().includes(search.toLowerCase()) || c.name?.toLowerCase().includes(search.toLowerCase()))
    return (
      <div className="space-y-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…" className="px-3 py-1.5 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#01696f] max-w-xs" />
        <div className="bg-white rounded-xl shadow-sm border border-[#E8E4DB] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F9F8F5]"><tr>{['Name','Email','Phone','Role','Joined'].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[#888]">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-[#aaa]">No customers found</td></tr>}
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-[#F9F8F5]">
                  <td className="px-4 py-3 font-medium">{c.name || '—'}</td>
                  <td className="px-4 py-3 text-[#888]">{c.email}</td>
                  <td className="px-4 py-3 text-[#888]">{c.phone || '—'}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-[#F2EFE9] text-[#5C6B60]">{c.role}</span></td>
                  <td className="px-4 py-3 text-xs text-[#888]">{new Date(c.createdAt).toLocaleDateString('en-LB',{day:'numeric',month:'short',year:'numeric'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ── Staff ──
  const StaffView = () => (
    <div className="space-y-4">
      {admin.role === 'super_admin' && (
        <button onClick={() => setShowAddStaff(true)} className="px-4 py-1.5 bg-[#01696f] text-white text-sm font-semibold rounded-lg hover:bg-[#015a60]">+ Add Staff Member</button>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-[#E8E4DB] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F9F8F5]"><tr>{['Name','Email','Role','Added','Actions'].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[#888]">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#F2EFE9]">
            {staff.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-[#aaa]">No staff members</td></tr>}
            {staff.map(s => (
              <tr key={s.id} className="hover:bg-[#F9F8F5]">
                <td className="px-4 py-3 font-medium">{s.name || '—'}</td>
                <td className="px-4 py-3 text-[#888]">{s.email}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.role === 'super_admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{s.role}</span></td>
                <td className="px-4 py-3 text-xs text-[#888]">{new Date(s.createdAt).toLocaleDateString('en-LB',{day:'numeric',month:'short',year:'numeric'})}</td>
                <td className="px-4 py-3">
                  {admin.role === 'super_admin' && s.role !== 'super_admin' && (
                    <button onClick={() => deleteStaff(s.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-lg mb-4">Add Staff Member</h3>
            <form onSubmit={submitStaff} className="space-y-3">
              {[['Full Name','name','text'],['Email','email','email'],['Password','password','password']].map(([label,key,type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#444] mb-1">{label}</label>
                  <input type={type} required value={(staffForm as any)[key]} onChange={e => setStaffForm(f => ({...f,[key]:e.target.value}))}
                    className="w-full px-3 py-2 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#01696f]" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Role</label>
                <select value={staffForm.role} onChange={e => setStaffForm(f => ({...f,role:e.target.value}))}
                  className="w-full px-3 py-2 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#01696f]">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddStaff(false)} className="flex-1 py-2 text-sm font-medium text-[#666] bg-[#F2EFE9] hover:bg-[#E8E4DB] rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-sm font-semibold text-white bg-[#01696f] hover:bg-[#015a60] rounded-lg">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )

  // ── Settings ──
  const SettingsView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-[#E8E4DB] p-6 max-w-lg space-y-4">
      <h2 className="font-bold text-base">Account Settings</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between py-2 border-b border-[#F2EFE9]"><span className="text-[#888]">Name</span><span className="font-medium">{admin.name}</span></div>
        <div className="flex justify-between py-2 border-b border-[#F2EFE9]"><span className="text-[#888]">Email</span><span className="font-medium">{admin.email}</span></div>
        <div className="flex justify-between py-2 border-b border-[#F2EFE9]"><span className="text-[#888]">Role</span><span className="font-medium capitalize">{admin.role}</span></div>
      </div>
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">Sign out</button>
    </div>
  )

  const VIEWS: Record<View, React.ReactNode> = {
    dashboard: <DashboardView />,
    orders: <OrdersView />,
    products: <ProductsView />,
    customers: <CustomersView />,
    staff: <StaffView />,
    settings: <SettingsView />,
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9] flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-[#E8E4DB] h-14 flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-[#555] hover:bg-[#F2EFE9] rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <h1 className="text-sm font-semibold text-[#1a1a1a] capitalize flex-1">{view}</h1>
          <button onClick={() => { setSearch(''); setView(v => v) }} className="p-1.5 text-[#555] hover:bg-[#F2EFE9] rounded-lg" title="Refresh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-[1400px] mx-auto">
            {loading && view !== 'dashboard'
              ? <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-[#01696f] border-t-transparent rounded-full animate-spin" /></div>
              : VIEWS[view]
            }
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1a2e1a] text-white text-sm px-4 py-2.5 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  )
}
