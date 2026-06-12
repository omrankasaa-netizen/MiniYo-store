import { useState } from 'react'
import { useAdminOrders } from '@/hooks/useMiniyo'

const ORDER_STATUSES = [
  'pending_confirmation', 'payment_pending_whish', 'confirmed',
  'packed', 'out_for_delivery', 'delivered', 'cancelled', 'refunded',
]

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
  filterPayment?: boolean
}

export function OrdersModule({ filterPayment }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [updating, setUpdating] = useState<number | null>(null)

  const { data: allOrders, isLoading, refetch, updateStatus } = useAdminOrders(
    statusFilter ? { status: statusFilter, search: search || undefined } : { search: search || undefined }
  ) as any

  const orders: any[] = filterPayment
    ? (allOrders ?? []).filter((o: any) => o.paymentMethod === 'wish')
    : (allOrders ?? [])

  async function handleStatusChange(id: number, orderStatus: string) {
    setUpdating(id)
    try {
      await updateStatus(id, { orderStatus })
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="search"
          placeholder="Search orders or customer…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]/30"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <button onClick={() => refetch()} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['#', 'Customer', 'Phone', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{order.orderNumber}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">{order.customerPhone}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">${parseFloat(order.grandTotal || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 uppercase">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.orderStatus}
                        disabled={updating === order.id}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${
                          STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'
                        } ${updating === order.id ? 'opacity-50' : ''}`}
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#01696f] hover:underline text-xs font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-500">Customer</span><p className="font-medium">{selectedOrder.customerName}</p></div>
                <div><span className="text-gray-500">Phone</span><p className="font-medium">{selectedOrder.customerPhone}</p></div>
                <div><span className="text-gray-500">Email</span><p className="font-medium">{selectedOrder.customerEmail || '—'}</p></div>
                <div><span className="text-gray-500">Payment</span><p className="font-medium uppercase">{selectedOrder.paymentMethod}</p></div>
                <div><span className="text-gray-500">Subtotal</span><p className="font-medium tabular-nums">${parseFloat(selectedOrder.subtotal || 0).toFixed(2)}</p></div>
                <div><span className="text-gray-500">Delivery</span><p className="font-medium tabular-nums">${parseFloat(selectedOrder.deliveryFee || 0).toFixed(2)}</p></div>
              </div>
              <div className="border-t pt-3">
                <span className="text-gray-500">Grand Total</span>
                <p className="text-2xl font-bold tabular-nums">${parseFloat(selectedOrder.grandTotal || 0).toFixed(2)}</p>
              </div>
              {selectedOrder.shippingAddress && (
                <div className="border-t pt-3">
                  <span className="text-gray-500">Shipping Address</span>
                  <pre className="text-xs bg-gray-50 rounded p-2 mt-1 whitespace-pre-wrap">
                    {typeof selectedOrder.shippingAddress === 'string'
                      ? selectedOrder.shippingAddress
                      : JSON.stringify(selectedOrder.shippingAddress, null, 2)}
                  </pre>
                </div>
              )}
              {selectedOrder.customerNotes && (
                <div className="border-t pt-3">
                  <span className="text-gray-500">Notes</span>
                  <p className="mt-1 text-gray-700">{selectedOrder.customerNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
