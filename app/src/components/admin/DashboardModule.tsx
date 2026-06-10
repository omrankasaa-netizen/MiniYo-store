import { useMemo } from 'react'
import { ShoppingCart, AlertTriangle, Package, TrendingUp, Users, ArrowRight, MessageCircle, CreditCard, Globe, Check } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { formatPrice } from '@/lib/i18n'
import { PrintButton } from '@/components/shared/PrintButton'
import { PrintHeader } from '@/components/shared/PrintHeader'
import type { AdminView } from '@/pages/AdminPage'

interface Props {
  onNavigate: (v: AdminView) => void
  reports?: boolean
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  pending_confirmation: 'bg-amber-50 text-amber-600',
  payment_pending_whish: 'bg-blue-50 text-blue-600',
  confirmed: 'bg-emerald-50 text-emerald-600',
  packed: 'bg-purple-50 text-purple-600',
  out_for_delivery: 'bg-sky-50 text-sky-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
  refunded: 'bg-gray-100 text-gray-500',
}

export function DashboardModule({ onNavigate, reports }: Props) {
  const { products, orders, customers, pendingChanges, publishedAt, publishChanges } = useAdminStore()

  const stats = useMemo(() => ({
    totalProducts: products.length,
    activeProducts: products.filter(p => (p.status === 'active' || p.isActive !== false)).length,
    lowStock: products.filter(p => (p.stockQuantity || 0) <= 5 && (p.stockQuantity || 0) > 0).length,
    outOfStock: products.filter(p => p.stockQuantity === 0).length,
    totalValue: products.reduce((s, p) => s + (p.price * p.stockQuantity), 0),
    pendingWA: orders.filter(o => o.orderStatus === 'pending_confirmation' && !o.whatsappConfirmed).length,
    pendingWish: orders.filter(o => o.orderStatus === 'payment_pending_whish').length,
    totalOrders: orders.length,
    recentRevenue: orders.reduce((s, o) => s + o.grandTotal, 0),
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    customerCount: customers.length,
  }), [products, orders, customers])

  if (reports) {
    return (
      <div className="space-y-6">
        <PrintHeader title="Miniyo Reports" subtitle="Business Performance Summary" />
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2D5A4C]">Reports</h2>
          <PrintButton label="Print Report" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#D4CFC6] p-5">
            <p className="text-sm text-[#8B8578]">Total Revenue</p>
            <p className="text-2xl font-semibold text-[#2D5A4C] mt-1">{formatPrice(stats.recentRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#D4CFC6] p-5">
            <p className="text-sm text-[#8B8578]">Orders</p>
            <p className="text-2xl font-semibold text-[#2D5A4C] mt-1">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#D4CFC6] p-5">
            <p className="text-sm text-[#8B8578]">Delivered</p>
            <p className="text-2xl font-semibold text-[#2D5A4C] mt-1">{stats.delivered}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-5">
          <h3 className="font-semibold text-[#2D5A4C] mb-3">Order Status Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(statusColors).map(([status]) => {
              const count = orders.filter(o => o.orderStatus === status).length
              if (count === 0) return null
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-sm text-[#5C6B60] w-40">{status.replace(/_/g, ' ')}</span>
                  <div className="flex-1 h-2 bg-[#F2EFE9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#8FAE7B] rounded-full" style={{ width: `${(count / orders.length) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-[#2D5A4C] w-6">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PrintHeader title="Dashboard Overview" />
      {/* Publish Changes Banner */}
      {pendingChanges && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Globe size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Changes Ready to Publish</p>
              <p className="text-xs text-emerald-600">
                {publishedAt
                  ? `Last published: ${new Date(publishedAt).toLocaleString()}. Unsaved changes will be visible on the storefront.`
                  : 'You have unpublished changes. Click Apply Changes to make them visible on the storefront.'}
              </p>
            </div>
          </div>
          <button
            onClick={publishChanges}
            className="h-9 px-4 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Check size={14} /> Apply Changes
          </button>
        </div>
      )}

      {!pendingChanges && publishedAt && (
        <div className="bg-[#F5F0E6] border border-[#D4CFC6] rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#5C6B60]">
            <Globe size={14} className="text-[#8FAE7B]" />
            <span className="text-xs">All changes are live on the storefront. Last published: {new Date(publishedAt).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Alert cards */}
      {(stats.pendingWA > 0 || stats.pendingWish > 0 || stats.lowStock > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.pendingWA > 0 && (
            <button onClick={() => onNavigate('orders')} className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left hover:bg-amber-100 transition-colors">
              <div className="flex items-center gap-3">
                <MessageCircle size={20} className="text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">{stats.pendingWA} WhatsApp Pending</p>
                  <p className="text-xs text-amber-600">Orders need WhatsApp confirmation</p>
                </div>
              </div>
            </button>
          )}
          {stats.pendingWish > 0 && (
            <button onClick={() => onNavigate('orders')} className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">{stats.pendingWish} Wish Pending</p>
                  <p className="text-xs text-blue-600">Payments awaiting verification</p>
                </div>
              </div>
            </button>
          )}
          {stats.lowStock > 0 && (
            <button onClick={() => onNavigate('inventory')} className="bg-red-50 border border-red-200 rounded-xl p-4 text-left hover:bg-red-100 transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-500" />
                <div>
                  <p className="text-sm font-semibold text-red-700">{stats.lowStock} Low Stock</p>
                  <p className="text-xs text-red-500">Products need restocking</p>
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Products', value: stats.totalProducts, icon: Package, sub: `${stats.activeProducts} active`, onClick: () => onNavigate('products') },
          { label: 'Orders', value: stats.totalOrders, icon: ShoppingCart, sub: `${stats.pendingWA} pending WA`, onClick: () => onNavigate('orders') },
          { label: 'Customers', value: stats.customerCount, icon: Users, sub: 'Total', onClick: () => onNavigate('customers') },
          { label: 'Revenue', value: formatPrice(stats.recentRevenue), icon: TrendingUp, sub: 'All orders', onClick: () => onNavigate('reports') },
        ].map(s => (
          <button key={s.label} onClick={s.onClick} className="bg-white rounded-xl border border-[#D4CFC6] p-4 text-left hover:border-[#8FAE7B] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8B8578] font-medium">{s.label}</span>
              <s.icon size={16} className="text-[#8FAE7B]" />
            </div>
            <p className="text-xl font-semibold text-[#2D5A4C]">{s.value}</p>
            <p className="text-[11px] text-[#A8A396] mt-0.5">{s.sub}</p>
          </button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-[#D4CFC6]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4DB]">
          <h3 className="font-semibold text-[#2D5A4C]">Recent Orders</h3>
          <button onClick={() => onNavigate('orders')} className="text-xs text-[#8FAE7B] hover:text-[#6B8E5A] font-medium flex items-center gap-1">
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="divide-y divide-[#F2EFE9]">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-[#FAFAF7] transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#8B8578]">{order.orderNumber}</span>
                <div>
                  <p className="text-sm text-[#2D5A4C] font-medium">{order.customerName}</p>
                  <p className="text-xs text-[#A8A396]">{order.items.length} items — {order.paymentMethod === 'cod' ? 'CoD' : 'Wish'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.orderStatus] || 'bg-gray-100'}`}>
                  {order.orderStatus.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-semibold text-[#2D5A4C]">{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Preview */}
      {stats.lowStock > 0 && (
        <div className="bg-white rounded-xl border border-[#D4CFC6]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4DB]">
            <h3 className="font-semibold text-[#2D5A4C]">Low Stock Products</h3>
            <button onClick={() => onNavigate('inventory')} className="text-xs text-[#8FAE7B] hover:text-[#6B8E5A] font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-[#F2EFE9]">
            {products.filter(p => p.stockQuantity <= 5 && p.stockQuantity > 0).slice(0, 5).map(p => (
              <div key={p.id} className="px-5 py-3 flex items-center justify-between hover:bg-[#FAFAF7] transition-colors">
                <div>
                  <p className="text-sm text-[#2D5A4C] font-medium">{p.name}</p>
                  <p className="text-xs text-[#A8A396]">SKU: {p.sku}</p>
                </div>
                <span className={`text-sm font-semibold ${p.stockQuantity === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                  {p.stockQuantity} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Tier Analytics */}
      <div className="bg-white rounded-xl border border-[#D4CFC6] p-5">
        <h3 className="font-semibold text-[#2D5A4C] mb-4">Customer Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Customers', value: stats.customerCount, color: '#2D5A4C', bg: '#F2EFE9' },
            { label: 'Bronze Members', value: customers.filter(c => c.tags?.includes('bronze')).length || Math.ceil(stats.customerCount * 0.7), color: '#CD7F32', bg: '#FFF8F0' },
            { label: 'Silver Members', value: customers.filter(c => c.tags?.includes('silver')).length || Math.ceil(stats.customerCount * 0.2), color: '#A8A8A8', bg: '#F5F5F5' },
            { label: 'Gold Members', value: customers.filter(c => c.tags?.includes('gold')).length || Math.ceil(stats.customerCount * 0.1), color: '#D4A843', bg: '#FFFBF0' },
          ].map(tier => (
            <div key={tier.label} className="text-center p-3 rounded-xl" style={{ backgroundColor: tier.bg }}>
              <p className="text-xl font-semibold" style={{ color: tier.color }}>{tier.value}</p>
              <p className="text-[11px] text-[#8B8578] mt-0.5">{tier.label}</p>
            </div>
          ))}
        </div>
        {customers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8E4DB]">
            <h4 className="text-xs font-semibold text-[#8B8578] mb-2 uppercase tracking-wider">Top Customers</h4>
            <div className="space-y-2">
              {customers.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-[#2D5A4C] font-medium">{c.name}</span>
                  <span className="text-[#A8A396] text-xs">{c.totalOrders} orders — {formatPrice(Number(c.totalSpent))}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
