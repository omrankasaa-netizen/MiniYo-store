import { useState } from 'react'
import { useAdminStore } from '@/stores/adminStore'
import type { AdminView } from '@/pages/AdminPage'
import { Bell, ShoppingCart, Package, CheckCheck, MessageCircle, ExternalLink, RefreshCw } from 'lucide-react'

interface Props {
  onNavigate: (v: AdminView) => void
}

const STATUS_LABELS: Record<string, string> = {
  pending_confirmation: 'Awaiting Confirmation',
  payment_pending_whish: 'Awaiting Wish Payment',
  confirmed: 'Confirmed',
  packed: 'Packing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

function waLink(phone: string, name: string, orderNumber: string, status: string, total: number) {
  const statusLabel = STATUS_LABELS[status] || status
  const msg = `Hi ${name} 👋\n\nYour Miniyo order *${orderNumber}* is now *${statusLabel}*.\n\nOrder Total: $${total.toFixed(2)}\n\nThank you for shopping with Miniyo 🛍️\nNeed help? Reply to this message.`
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
}

export function NotificationsModule({ onNavigate }: Props) {
  const { orders, products, updateOrderStatus, toggleWhatsAppConfirmed, importPending } = useAdminStore()
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  const pendingConfirm = orders.filter(o => o.orderStatus === 'pending_confirmation')
  const pendingWish = orders.filter(o => o.orderStatus === 'payment_pending_whish')
  const needsWA = orders.filter(o =>
    ['confirmed', 'packed', 'out_for_delivery'].includes(o.orderStatus) && !o.whatsappConfirmed
  )
  const lowStock = products.filter(p => (p.stockQuantity ?? 99) <= 5 && (p.stockQuantity ?? 99) > 0)
  const outOfStock = products.filter(p => (p.stockQuantity ?? 1) === 0)

  function handleSync() {
    setSyncing(true)
    setTimeout(() => {
      importPending()
      setLastSync(new Date().toLocaleTimeString('en-LB', { hour: '2-digit', minute: '2-digit' }))
      setSyncing(false)
    }, 800)
  }

  const hasAnything = pendingConfirm.length + pendingWish.length + needsWA.length + lowStock.length + outOfStock.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#2D5A4C]">Notifications & Action Items</h2>
          <p className="text-xs text-[#8B8578] mt-0.5">Everything that needs your team's attention right now</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#2D5A4C] bg-white border border-[#D4CFC6] rounded-lg hover:bg-[#F2EFE9] transition-colors disabled:opacity-60"
        >
          <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Refresh'}
          {lastSync && !syncing && <span className="text-[#A8A396]">· {lastSync}</span>}
        </button>
      </div>

      {/* All Clear */}
      {!hasAnything && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCheck size={28} className="text-emerald-600" />
          </div>
          <h3 className="text-base font-semibold text-[#2D5A4C]">All caught up!</h3>
          <p className="text-sm text-[#8B8578] mt-1 max-w-xs">No pending orders, no low-stock alerts, no WhatsApp messages needed. Great work! 🎉</p>
        </div>
      )}

      {/* New Orders — Need Confirmation */}
      {pendingConfirm.length > 0 && (
        <section className="bg-white rounded-xl border border-[#E8E4DB] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#F2EFE9] bg-amber-50">
            <ShoppingCart size={16} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">New Orders — Confirm &amp; Contact Customer</span>
            <span className="ml-auto bg-amber-400 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full">{pendingConfirm.length}</span>
          </div>
          <div className="divide-y divide-[#F2EFE9]">
            {pendingConfirm.map(order => (
              <div key={order.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#2D5A4C]">{order.orderNumber}</span>
                    <span className="text-xs px-2 py-0.5 bg-[#F2EFE9] rounded-full text-[#5C6B60]">{order.paymentMethod.toUpperCase()}</span>
                    {order.customerNotes && (
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Has note</span>
                    )}
                  </div>
                  <p className="text-xs text-[#5C6B60] mt-1">
                    {order.customerName} · {order.shippingAddress.city}, {order.shippingAddress.district}
                  </p>
                  <p className="text-xs text-[#8B8578] mt-0.5">
                    {order.items.map(i => `${i.productName} ×${i.quantity}`).join(' · ')} · <span className="font-semibold text-[#2D5A4C]">${order.grandTotal.toFixed(2)}</span>
                  </p>
                  {order.customerNotes && (
                    <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-2 py-1 mt-1.5 italic">📝 {order.customerNotes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={waLink(order.phone, order.customerName, order.orderNumber, 'confirmed', order.grandTotal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#25D366] hover:bg-[#1da851] rounded-lg transition-colors"
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'confirmed')}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-[#2D5A4C] hover:bg-[#1e3d34] rounded-lg transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => onNavigate('orders')}
                    className="p-1.5 text-[#8B8578] hover:text-[#2D5A4C] rounded-lg hover:bg-[#F2EFE9] transition-colors"
                    title="View in Orders"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Wish Money — Awaiting Payment */}
      {pendingWish.length > 0 && (
        <section className="bg-white rounded-xl border border-[#E8E4DB] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#F2EFE9] bg-purple-50">
            <Bell size={16} className="text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">Wish Money — Awaiting Payment Verification</span>
            <span className="ml-auto bg-purple-400 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{pendingWish.length}</span>
          </div>
          <div className="divide-y divide-[#F2EFE9]">
            {pendingWish.map(order => (
              <div key={order.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-[#2D5A4C]">{order.orderNumber}</span>
                  <p className="text-xs text-[#5C6B60] mt-1">{order.customerName} · ${order.grandTotal.toFixed(2)}</p>
                  <p className="text-xs text-[#8B8578]">{order.items.map(i => `${i.productName} ×${i.quantity}`).join(' · ')}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={waLink(order.phone, order.customerName, order.orderNumber, 'payment_pending_whish', order.grandTotal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#25D366] hover:bg-[#1da851] rounded-lg transition-colors"
                  >
                    <MessageCircle size={13} /> Ask for Payment
                  </a>
                  <button
                    onClick={() => onNavigate('orders')}
                    className="p-1.5 text-[#8B8578] hover:text-[#2D5A4C] rounded-lg hover:bg-[#F2EFE9] transition-colors"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp Updates Needed */}
      {needsWA.length > 0 && (
        <section className="bg-white rounded-xl border border-[#E8E4DB] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#F2EFE9] bg-green-50">
            <MessageCircle size={16} className="text-green-600" />
            <span className="text-sm font-semibold text-green-800">WhatsApp Updates Needed</span>
            <span className="ml-auto bg-green-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{needsWA.length}</span>
          </div>
          <div className="divide-y divide-[#F2EFE9]">
            {needsWA.map(order => (
              <div key={order.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-[#2D5A4C]">{order.orderNumber}</span>
                  <p className="text-xs text-[#5C6B60] mt-1">
                    {order.customerName} · Status: <span className="font-medium">{STATUS_LABELS[order.orderStatus]}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={waLink(order.phone, order.customerName, order.orderNumber, order.orderStatus, order.grandTotal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#25D366] hover:bg-[#1da851] rounded-lg transition-colors"
                  >
                    <MessageCircle size={13} /> Send Update
                  </a>
                  <button
                    onClick={() => toggleWhatsAppConfirmed(order.id)}
                    className="px-3 py-1.5 text-xs font-medium text-[#2D5A4C] border border-[#D4CFC6] hover:bg-[#F2EFE9] rounded-lg transition-colors"
                  >
                    Mark Sent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Low Stock */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <section className="bg-white rounded-xl border border-[#E8E4DB] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#F2EFE9] bg-red-50">
            <Package size={16} className="text-red-600" />
            <span className="text-sm font-semibold text-red-800">Stock Alerts</span>
            <span className="ml-auto bg-red-400 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {lowStock.length + outOfStock.length}
            </span>
          </div>
          <div className="divide-y divide-[#F2EFE9]">
            {outOfStock.map(p => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-[#2D5A4C] truncate block">{p.name}</span>
                  <span className="text-xs text-red-600 font-semibold">OUT OF STOCK</span>
                </div>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="text-xs text-[#2D5A4C] hover:underline"
                >
                  Restock →
                </button>
              </div>
            ))}
            {lowStock.map(p => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-[#2D5A4C] truncate block">{p.name}</span>
                  <span className="text-xs text-amber-700">{p.stockQuantity} unit{p.stockQuantity !== 1 ? 's' : ''} left</span>
                </div>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="text-xs text-[#2D5A4C] hover:underline"
                >
                  Restock →
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
