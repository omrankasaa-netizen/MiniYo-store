import { useStats, useAdminOrders } from '@/hooks/useMiniyo'
import type { AdminView } from '@/pages/AdminPage'

const STATUS_COLORS: Record<string, string> = {
  pending_confirmation: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  payment_pending_whish: 'bg-orange-100 text-orange-800',
  refunded: 'bg-gray-100 text-gray-700',
}

interface Props {
  onNavigate: (view: AdminView) => void
  reports?: boolean
}

export function DashboardModule({ onNavigate }: Props) {
  const { data: stats, isLoading: statsLoading } = useStats()
  const { data: orders, isLoading: ordersLoading } = useAdminOrders()

  const recentOrders = (orders as any[])?.slice(0, 8) ?? []

  const kpis = [
    { label: 'Total Orders', value: (stats as any)?.totalOrders ?? '—', icon: '📦', view: 'orders' as AdminView },
    { label: 'Products', value: (stats as any)?.totalProducts ?? '—', icon: '🏷️', view: 'products' as AdminView },
    { label: 'Customers', value: (stats as any)?.totalCustomers ?? '—', icon: '👥', view: 'customers' as AdminView },
    { label: 'Recent Orders', value: (stats as any)?.recentOrders?.length ?? '—', icon: '🕐', view: 'orders' as AdminView },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <button
            key={kpi.label}
            onClick={() => onNavigate(kpi.view)}
            className="bg-white rounded-xl p-5 text-left shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">{kpi.icon}</div>
            {statsLoading ? (
              <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mb-1" />
            ) : (
              <div className="text-3xl font-bold text-gray-900 tabular-nums">{kpi.value}</div>
            )}
            <div className="text-sm text-gray-500 mt-1">{kpi.label}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <button
            onClick={() => onNavigate('orders')}
            className="text-sm text-[#01696f] hover:underline"
          >
            View all
          </button>
        </div>
        {ordersLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-900">{order.customerName}</td>
                    <td className="px-4 py-3 font-medium tabular-nums">${parseFloat(order.grandTotal || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 uppercase">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'
                      }`}>
                        {order.orderStatus?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
