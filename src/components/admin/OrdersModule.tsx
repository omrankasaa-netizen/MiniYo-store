import { useState } from 'react'
import { Search, ChevronDown, MessageCircle, CreditCard, Check, X, Eye, Trash2, RotateCcw, Gift, Tag, Sparkles, MapPin, Phone, Mail, User, Package, Truck, FileText, Bell, Percent, Printer } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { useAdminOrders } from '@/hooks/useMiniyo'
import { formatPrice } from '@/lib/i18n'
import { PrintButton } from '@/components/shared/PrintButton'
import { PrintHeader } from '@/components/shared/PrintHeader'

interface Props {
  filterPayment?: boolean
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

export function OrdersModule({ filterPayment }: Props) {
  const store = useAdminStore()
  const { orders, updateStatus, toggleWA, deleteOrder, restoreOrderStock } = useAdminOrders()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  const detailOrder = orders.find(o => o.id === selectedOrder)

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !q || o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.phone.includes(q)
    const matchStatus = !statusFilter || o.orderStatus === statusFilter
    const matchPayment = !filterPayment || true
    return matchSearch && matchStatus && matchPayment
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const nextStatuses: Record<string, string[]> = {
    draft: ['pending_confirmation', 'cancelled'],
    pending_confirmation: ['confirmed', 'cancelled'],
    payment_pending_whish: ['confirmed', 'cancelled'],
    confirmed: ['packed', 'cancelled'],
    packed: ['out_for_delivery', 'cancelled'],
    out_for_delivery: ['delivered', 'cancelled'],
    delivered: ['refunded'],
    cancelled: [],
    refunded: [],
  }

  return (
    <div className="space-y-4">
      <PrintHeader title="Orders Report" subtitle={`${orders.length} orders — ${filtered.length} matching current filters`} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#2D5A4C] print-section-header">Orders</h2>
        <PrintButton label="Print Orders" />
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A396]" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search orders..." className="w-full h-10 border border-[#D4CFC6] rounded-lg pl-9 pr-3 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]">
          <option value="">All Statuses</option>
          {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <span className="h-10 flex items-center text-sm text-[#8B8578]">{filtered.length} orders</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F2EFE9] border-b border-[#D4CFC6]">
                <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Order #</th>
                <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Items</th>
                <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">WA</th>
                <th className="text-right px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(order => (
                <tr key={order.id} className="border-b border-[#F2EFE9] hover:bg-[#FAFAF7] transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => { setSelectedOrder(order.id); setNoteText(order.internalNotes || '') }} className="font-mono text-xs text-[#8B8578] hover:text-[#2D5A4C]">
                      {order.orderNumber}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[#2D5A4C] font-medium">{order.customerName}</p>
                    <p className="text-[11px] text-[#A8A396]">{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-[#5C6B60]">{order.phone}</td>
                  <td className="px-4 py-3 text-[#5C6B60]">{order.items.length}</td>
                  <td className="px-4 py-3 font-semibold text-[#2D5A4C]">{formatPrice(order.grandTotal)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentMethod === 'cod' ? 'bg-[#D4C4B0]/30 text-[#5C6B60]' : 'bg-blue-50 text-blue-600'}`}>
                      {order.paymentMethod === 'cod' ? 'CoD' : 'Wish'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.orderStatus] || ''}`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleWA(order.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${order.whatsappConfirmed ? 'bg-[#8FAE7B] text-white' : 'bg-[#F2EFE9] text-[#A8A396] hover:bg-amber-100'}`}
                      title={order.whatsappConfirmed ? 'Confirmed via WA' : 'Mark WA confirmed'}
                    >
                      {order.whatsappConfirmed ? <Check size={14} /> : <MessageCircle size={14} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelectedOrder(order.id); setNoteText(order.internalNotes || '') }} className="p-1.5 text-[#8B8578] hover:text-[#2D5A4C] hover:bg-[#F2EFE9] rounded" title="View">
                        <Eye size={15} />
                      </button>
                      {order.orderStatus === 'cancelled' && (
                        <>
                          <button onClick={() => { if (confirm('Restore stock for this cancelled order?')) restoreOrderStock(order.id) }} className="p-1.5 text-sage-green hover:bg-sage-green/10 rounded" title="Restore Stock">
                            <RotateCcw size={15} />
                          </button>
                          <button onClick={() => { if (confirm('Delete this cancelled order?')) deleteOrder(order.id) }} className="p-1.5 text-red-400 hover:bg-red-50 rounded" title="Delete Order">
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                      {order.paymentMethod === 'wish' && order.paymentStatus === 'pending' && (
                        <button onClick={() => store.updateOrderPayment(order.id, 'verified')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Verify Wish">
                          <CreditCard size={15} />
                        </button>
                      )}
                      {nextStatuses[order.orderStatus]?.map(ns => (
                        <button
                          key={ns}
                          onClick={() => updateStatus(order.id, ns as never)}
                          className={`text-[11px] px-2 py-1 rounded ${ns === 'cancelled' ? 'text-red-500 hover:bg-red-50' : 'text-[#2D5A4C] hover:bg-[#8FAE7B]/10'} font-medium transition-colors`}
                        >
                          {ns === 'out_for_delivery' ? 'Ship' : ns.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 px-4 py-3 border-t border-[#F2EFE9]">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-[#F2EFE9] disabled:opacity-30"><ChevronDown size={16} className="rotate-90" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-[#2D5A4C] text-white' : 'hover:bg-[#F2EFE9] text-[#5C6B60]'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-[#F2EFE9] disabled:opacity-30"><ChevronDown size={16} className="-rotate-90" /></button>
          </div>
        )}
      </div>

      {/* ==================== ORDER DETAIL MODAL ==================== */}
      {detailOrder && (
        <div className="order-detail-modal-container fixed inset-0 bg-[#2D5A4C]/50 backdrop-blur-sm flex items-start justify-center p-3 pt-8 overflow-auto" style={{ zIndex: 60 }}>
          <div className="order-detail-modal bg-white rounded-2xl w-full max-w-3xl shadow-2xl mb-8">
            {/* Header */}
            <div className="order-detail-modal-header flex items-center justify-between px-6 py-4 border-b border-[#D4CFC6] bg-[#FAFAF7] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-semibold text-[#2D5A4C] text-lg">{detailOrder.orderNumber}</h3>
                  <p className="text-xs text-[#8B8578]">
                    {new Date(detailOrder.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D4CFC6] text-[#5C6B60] rounded-lg text-xs font-medium hover:bg-[#F2EFE9] hover:text-[#2D5A4C] transition-colors print:hidden"
                  title="Print order details"
                >
                  <Printer size={14} /> Print
                </button>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[detailOrder.orderStatus]}`}>
                  {detailOrder.orderStatus.replace(/_/g, ' ')}
                </span>
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-[#8B8578] hover:text-[#2D5A4C] hover:bg-[#E8E4DB] rounded-lg transition-colors print:hidden">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Print-only order header */}
            <div className="print-only px-6 pt-6 pb-2 border-b border-[#2D5A4C]">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#2D5A4C] tracking-tight">Order {detailOrder.orderNumber}</h1>
                  <p className="text-xs text-[#8B8578] mt-1">
                    {new Date(detailOrder.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[#2D5A4C]">Miniyo</p>
                  <p className="text-[10px] text-[#8B8578]">+961 81 38 59 40</p>
                  <p className="text-[10px] text-[#8B8578]">miniyo.store.lb@gmail.com</p>
                </div>
              </div>
              <p className="text-[10px] text-[#A8A396] mt-2 flex items-center gap-2">
                <span>Printed on {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                <span className="text-[#D4CFC6]">|</span>
                <span>Miniyo Admin Panel</span>
              </p>
            </div>

            <div className="order-detail-modal-body p-6 space-y-6">

              {/* ── ROW 1: Customer + Shipping Side by Side ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Customer Info */}
                <div className="bg-[#F8F6F2] rounded-xl p-4">
                  <h4 className="text-[11px] font-bold text-[#8B8578] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <User size={13} /> Customer
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#2D5A4C]">{detailOrder.customerName}</p>
                    <div className="flex items-center gap-2 text-sm text-[#5C6B60]">
                      <Mail size={13} className="text-[#A8A396]" />
                      {detailOrder.email || <span className="text-[#A8A396] italic">No email</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5C6B60]">
                      <Phone size={13} className="text-[#A8A396]" />
                      <a href={`https://wa.me/${detailOrder.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-medium">
                        {detailOrder.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Shipping Address - FULL */}
                <div className="bg-[#F8F6F2] rounded-xl p-4">
                  <h4 className="text-[11px] font-bold text-[#8B8578] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <MapPin size={13} /> Shipping Address
                  </h4>
                  <div className="space-y-1 text-sm text-[#5C6B60]">
                    <p className="font-semibold text-[#2D5A4C]">{detailOrder.shippingAddress.fullName || detailOrder.customerName}</p>
                    <p>{detailOrder.shippingAddress.building}{detailOrder.shippingAddress.street ? `, ${detailOrder.shippingAddress.street}` : ''}</p>
                    <p>{detailOrder.shippingAddress.district}{detailOrder.shippingAddress.city ? `, ${detailOrder.shippingAddress.city}` : ''}</p>
                    {(detailOrder.shippingAddress.floor || detailOrder.shippingAddress.apartment) && (
                      <p>Floor: {detailOrder.shippingAddress.floor || '-'} | Apt: {detailOrder.shippingAddress.apartment || '-'}</p>
                    )}
                    {detailOrder.shippingAddress.landmark && (
                      <p className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs inline-block mt-1">
                        Landmark: {detailOrder.shippingAddress.landmark}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── ROW 2: Order Items with Size ── */}
              <div>
                <h4 className="text-[11px] font-bold text-[#8B8578] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Package size={13} /> Order Items ({detailOrder.items.length})
                </h4>
                <div className="bg-white border border-[#E8E4DB] rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F2EFE9]">
                        <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-[#8B8578]">Product</th>
                        <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-[#8B8578]">SKU</th>
                        <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-[#8B8578]">Size</th>
                        <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-[#8B8578]">Qty</th>
                        <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-[#8B8578]">Price</th>
                        <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-[#8B8578]">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailOrder.items.map((item, i) => (
                        <tr key={i} className="border-b border-[#F2EFE9]">
                          <td className="px-4 py-3 text-[#2D5A4C] font-medium">{item.productName}</td>
                          <td className="px-4 py-3 font-mono text-[11px] text-[#8B8578]">{item.sku}</td>
                          <td className="px-4 py-3 text-[#5C6B60]">{item.size || '-'}</td>
                          <td className="px-4 py-3 text-right font-semibold text-[#2D5A4C]">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-[#5C6B60]">{formatPrice(item.price)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-[#2D5A4C]">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── ROW 3: Financial Summary ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-[#E8E4DB] rounded-xl p-4">
                  <h4 className="text-[11px] font-bold text-[#8B8578] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Truck size={13} /> Payment & Shipping
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8B8578]">Payment Method</span>
                      <span className="font-medium text-[#2D5A4C]">{detailOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Wish Money'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B8578]">Payment Status</span>
                      <span className={`font-medium ${detailOrder.paymentStatus === 'verified' ? 'text-emerald-600' : detailOrder.paymentStatus === 'pending' ? 'text-amber-600' : 'text-[#2D5A4C]'}`}>
                        {detailOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B8578]">WhatsApp Confirmed</span>
                      <span className={`font-medium ${detailOrder.whatsappConfirmed ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {detailOrder.whatsappConfirmed ? 'Yes' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#E8E4DB] rounded-xl p-4">
                  <h4 className="text-[11px] font-bold text-[#8B8578] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CreditCard size={13} /> Order Total
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8B8578]">Subtotal</span>
                      <span className="font-medium text-[#2D5A4C]">{formatPrice(detailOrder.subtotal)}</span>
                    </div>
                    {(detailOrder as any).discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-amber-600 flex items-center gap-1"><Percent size={11} /> {(detailOrder as any).discountReason || 'Discount'}</span>
                        <span className="font-medium text-amber-600">-{formatPrice((detailOrder as any).discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#8B8578]">Delivery Fee</span>
                      <span className="font-medium text-[#2D5A4C]">{detailOrder.deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatPrice(detailOrder.deliveryFee)}</span>
                    </div>
                    <div className="border-t border-[#E8E4DB] pt-2 flex justify-between text-base">
                      <span className="font-bold text-[#2D5A4C]">Grand Total</span>
                      <span className="font-bold text-[#2D5A4C]">{formatPrice(detailOrder.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ROW 4: Order Flags (Gift, WhatsApp, Promo, Discount) ── */}
              {(detailOrder.internalNotes || detailOrder.customerNotes || detailOrder.shippingAddress?.notes) && (
                <div>
                  <h4 className="text-[11px] font-bold text-[#8B8578] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Bell size={13} /> Order Flags & Notes
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Gift */}
                    {detailOrder.internalNotes?.includes('GIFT') && (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 flex items-start gap-3">
                        <Gift size={18} className="text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-rose-700">GIFT ORDER</p>
                          {detailOrder.internalNotes?.includes('price HIDDEN') && (
                            <p className="text-xs text-rose-600 font-medium mt-0.5">Prices are HIDDEN on the packing slip</p>
                          )}
                          {detailOrder.customerNotes && (
                            <p className="text-xs text-[#5C6B60] mt-1.5 italic bg-white/60 px-2 py-1 rounded">&quot;{detailOrder.customerNotes}&quot;</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* WhatsApp */}
                    {detailOrder.internalNotes?.includes('WhatsApp') && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-3">
                        <MessageCircle size={18} className="text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-emerald-700">Customer requested WhatsApp updates</p>
                          <p className="text-xs text-emerald-600">Send order status updates via WhatsApp</p>
                        </div>
                      </div>
                    )}

                    {/* Promo */}
                    {detailOrder.internalNotes?.includes('Promo:') && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-center gap-3">
                        <Tag size={18} className="text-blue-600 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-blue-700">Promo Code Applied</p>
                          <p className="text-xs text-blue-600 font-mono bg-white/60 px-2 py-0.5 rounded inline-block mt-0.5">
                            {detailOrder.internalNotes.match(/Promo: ([^|]+)/)?.[1]?.trim() || 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Discount */}
                    {(detailOrder as any).discount > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-center gap-3">
                        <Sparkles size={18} className="text-amber-600 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-amber-700">Discount Applied</p>
                          <p className="text-xs text-amber-600">
                            {(detailOrder as any).discountReason || 'Member discount'} — <strong>{formatPrice((detailOrder as any).discount)} off</strong>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Shipping / Delivery Notes */}
                    {detailOrder.shippingAddress?.notes && (
                      <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 flex items-start gap-3">
                        <FileText size={18} className="text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-sky-700">Delivery Notes</p>
                          <p className="text-xs text-sky-600 mt-0.5 whitespace-pre-wrap">{detailOrder.shippingAddress.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Customer Notes (non-gift) */}
                    {detailOrder.customerNotes && !detailOrder.internalNotes?.includes('GIFT') && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex items-start gap-3">
                        <FileText size={18} className="text-gray-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-gray-700">Customer Notes</p>
                          <p className="text-xs text-gray-600 mt-0.5 italic">&quot;{detailOrder.customerNotes}&quot;</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── ROW 5: Actions ── */}
              <div>
                <h4 className="text-[11px] font-bold text-[#8B8578] uppercase tracking-wider mb-3">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <a href={`https://wa.me/${detailOrder.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-semibold hover:bg-[#128C7E] transition-colors shadow-sm">
                    <MessageCircle size={14} /> WhatsApp Customer
                  </a>
                  {detailOrder.paymentMethod === 'wish' && detailOrder.paymentStatus === 'pending' && (
                    <button onClick={() => store.updateOrderPayment(detailOrder.id, 'verified')} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors shadow-sm">
                      <CreditCard size={14} /> Verify Wish Payment
                    </button>
                  )}
                  {nextStatuses[detailOrder.orderStatus]?.map(ns => (
                    <button key={ns} onClick={() => updateStatus(detailOrder.id, ns as Parameters<typeof updateStatus>[1])} className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors ${ns === 'cancelled' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-[#8FAE7B]/15 text-[#2D5A4C] hover:bg-[#8FAE7B]/25'}`}>
                      {ns === 'out_for_delivery' ? 'Mark Shipped' : ns.replace(/_/g, ' ')}
                    </button>
                  ))}
                  {detailOrder.orderStatus === 'cancelled' && (
                    <>
                      <button onClick={() => { if (confirm('Restore all stock from this cancelled order?')) { restoreOrderStock(detailOrder.id) } }} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-sm">
                        <RotateCcw size={14} /> Restore Stock
                      </button>
                      <button onClick={() => { if (confirm('Permanently delete this order?')) { deleteOrder(detailOrder.id); setSelectedOrder(null) } }} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors shadow-sm">
                        <Trash2 size={14} /> Delete Order
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* ── ROW 6: Internal Notes ── */}
              <div className="border-t border-[#E8E4DB] pt-5">
                <h4 className="text-[11px] font-bold text-[#8B8578] uppercase tracking-wider mb-3">Internal Notes (Admin Only)</h4>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={3}
                  placeholder="Add private notes about this order..."
                  className="w-full border border-[#D4CFC6] rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20 resize-y"
                />
                <button onClick={() => store.addOrderNote(detailOrder.id, noteText)} className="mt-2 px-5 py-2 bg-[#2D5A4C] text-white rounded-xl text-xs font-semibold hover:bg-[#1E4539] transition-colors">
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
