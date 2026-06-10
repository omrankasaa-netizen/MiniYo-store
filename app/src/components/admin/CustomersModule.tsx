import { useState } from 'react'
import { Search, User, ShoppingBag, Phone, Mail, MapPin, X, Crown, Diamond, Leaf, Trash2 } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { useMemberStore, tierColors, type MembershipTier } from '@/stores/memberStore'
import { formatPrice } from '@/lib/i18n'
import { PrintButton } from '@/components/shared/PrintButton'
import { PrintHeader } from '@/components/shared/PrintHeader'

const tierIcons: Record<MembershipTier, typeof Leaf> = { bronze: Leaf, silver: Diamond, gold: Crown }

interface UnifiedCustomer {
  id: string
  name: string
  email: string | null
  phone: string | null
  type: string
  totalOrders: number
  totalSpent: number
  tier: MembershipTier | null
  tags: string[]
  lastOrderDate: string | null
  addresses: any[]
}

export function CustomersModule() {
  const { customers, orders, deleteCustomer } = useAdminStore()
  const memberCustomer = useMemberStore(s => s.customer)
  const memberOrders = useMemberStore(s => s.orders)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  // Merge admin customers + member store customers
  const allCustomers: UnifiedCustomer[] = [...customers.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    type: c.type,
    totalOrders: c.totalOrders,
    totalSpent: Number(c.totalSpent),
    tier: (c.tags?.find((t: string) => ['bronze', 'silver', 'gold'].includes(t)) as MembershipTier | undefined) || null,
    tags: c.tags || [],
    lastOrderDate: c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : null,
    addresses: c.addresses || [],
  }))]

  // Add member store customer if exists and not already in admin list
  if (memberCustomer && !allCustomers.find(c => c.email === memberCustomer.email)) {
    allCustomers.push({
      id: memberCustomer.id,
      name: memberCustomer.name,
      email: memberCustomer.email,
      phone: memberCustomer.phone,
      type: 'registered',
      totalOrders: memberCustomer.totalOrders,
      totalSpent: memberCustomer.totalSpent,
      tier: memberCustomer.membershipTier,
      tags: [memberCustomer.membershipTier, 'member'],
      lastOrderDate: memberOrders.length > 0 ? memberOrders[0].date : null,
      addresses: [],
    })
  }

  // Update existing admin customer with tier if member matches
  if (memberCustomer) {
    const idx = allCustomers.findIndex(c => c.email === memberCustomer.email && c.id !== memberCustomer.id)
    if (idx >= 0) {
      allCustomers[idx] = {
        ...allCustomers[idx],
        tier: memberCustomer.membershipTier,
        totalOrders: Math.max(allCustomers[idx].totalOrders, memberCustomer.totalOrders),
        totalSpent: Math.max(allCustomers[idx].totalSpent, memberCustomer.totalSpent),
      }
    }
  }

  const filtered = allCustomers.filter(c => {
    const q = search.toLowerCase()
    return !q || c.name.toLowerCase().includes(q) || (c.email?.toLowerCase().includes(q) ?? false) || (c.phone?.includes(q) ?? false)
  })

  const selected = allCustomers.find(c => c.id === selectedCustomer)
  // Get orders from the right source
  const _isMemberCustomer = selected && memberCustomer && selected.email === memberCustomer.email
  const relevantOrders = _isMemberCustomer ? memberOrders : orders
  const customerOrders = selected ? relevantOrders.filter((o: any) => o.email === selected.email || o.phone === selected.phone) : []

  return (
    <div className="space-y-4">
      <PrintHeader title="Customer Directory Report" subtitle={`${filtered.length} customers`} />
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A396]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers by name, email, phone..."
            className="w-full h-10 border border-[#D4CFC6] rounded-lg pl-9 pr-3 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#8B8578]">{filtered.length} customers</span>
          <PrintButton label="Print Customers" />
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(customer => {
          const custOrders = orders.filter(o => o.email === customer.email || o.phone === customer.phone)
          return (
            <div
              key={customer.id}
              className="bg-white rounded-xl border border-[#D4CFC6] p-5 hover:border-[#8FAE7B] transition-colors cursor-pointer"
              onClick={() => { setSelectedCustomer(customer.id); setShowDetail(true) }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#F5F0E6] flex items-center justify-center shrink-0">
                    <User size={18} className="text-[#8FAE7B]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#2D5A4C] text-sm truncate">{customer.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${customer.type === 'registered' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                        {customer.type}
                      </span>
                      {customer.tier && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5" style={{ backgroundColor: `${tierColors[customer.tier]}15`, color: tierColors[customer.tier] }}>
                          {(() => { const Icon = tierIcons[customer.tier!]; return <Icon size={9} /> })()}
                          {customer.tier}
                        </span>
                      )}
                      {customer.tags.filter(t => t !== 'member' && !['bronze', 'silver', 'gold'].includes(t)).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F5F0E6] text-[#8B8578]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#2D5A4C]">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-xs text-[#A8A396]">{customer.totalOrders} orders</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm(`Delete customer ${customer.name}?`)) deleteCustomer(customer.id) }}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"
                    title="Delete customer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#F2EFE9] grid grid-cols-2 gap-2 text-xs text-[#8B8578]">
                <div className="flex items-center gap-1.5">
                  <Mail size={12} />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={12} />
                  <span>{customer.phone}</span>
                </div>
                {customer.addresses[0] && (
                  <div className="flex items-center gap-1.5 col-span-2">
                    <MapPin size={12} />
                    <span className="truncate">{customer.addresses[0].city}, {customer.addresses[0].district}</span>
                  </div>
                )}
              </div>

              {custOrders.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-[#8FAE7B]">
                  <ShoppingBag size={12} />
                  <span>Last order: {customer.lastOrderDate}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-12 text-center">
          <User size={32} className="mx-auto text-[#D4CFC6] mb-2" />
          <p className="text-[#8B8578] text-sm">No customers found</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 bg-black/40 overflow-y-auto" onClick={() => setShowDetail(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg my-8 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#E8E4DB]">
              <h3 className="font-semibold text-[#2D5A4C]">Customer Profile</h3>
              <button onClick={() => setShowDetail(false)} className="text-[#A8A396] hover:text-[#2D5A4C]">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#F5F0E6] flex items-center justify-center">
                  <User size={24} className="text-[#8FAE7B]" />
                </div>
                <div>
                  <p className="font-semibold text-[#2D5A4C]">{selected.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selected.type === 'registered' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                      {selected.type}
                    </span>
                    {selected.tier && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1" style={{ backgroundColor: `${tierColors[selected.tier]}15`, color: tierColors[selected.tier] }}>
                        {(() => { const Icon = tierIcons[selected.tier!]; return <Icon size={10} /> })()}
                        {selected.tier?.charAt(0).toUpperCase()}{selected.tier?.slice(1)} Member
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-[#FAFAF7] rounded-lg p-4 space-y-2">
                <p className="text-xs font-medium text-[#8B8578] uppercase tracking-wider">Contact</p>
                <div className="flex items-center gap-2 text-sm text-[#2D5A4C]">
                  <Mail size={14} className="text-[#8FAE7B]" /> {selected.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#2D5A4C]">
                  <Phone size={14} className="text-[#8FAE7B]" /> {selected.phone}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FAFAF7] rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-[#2D5A4C]">{selected.totalOrders}</p>
                  <p className="text-xs text-[#8B8578]">Orders</p>
                </div>
                <div className="bg-[#FAFAF7] rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-[#2D5A4C]">{formatPrice(selected.totalSpent)}</p>
                  <p className="text-xs text-[#8B8578]">Total Spent</p>
                </div>
                <div className="bg-[#FAFAF7] rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-[#2D5A4C]">{selected.lastOrderDate}</p>
                  <p className="text-xs text-[#8B8578]">Last Order</p>
                </div>
              </div>

              {/* Addresses */}
              {selected.addresses.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[#8B8578] uppercase tracking-wider mb-2">Addresses</p>
                  <div className="space-y-2">
                    {selected.addresses.map((addr, i) => (
                      <div key={i} className="bg-[#FAFAF7] rounded-lg p-3 flex items-start gap-2">
                        <MapPin size={14} className="text-[#8FAE7B] mt-0.5 shrink-0" />
                        <div className="text-sm text-[#2D5A4C]">
                          <span className="font-medium">{addr.label}:</span> {addr.building}, {addr.street}, {addr.district}, {addr.city}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order History */}
              <div>
                <p className="text-xs font-medium text-[#8B8578] uppercase tracking-wider mb-2">Order History ({customerOrders.length})</p>
                {customerOrders.length === 0 ? (
                  <p className="text-sm text-[#A8A396]">No orders found</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(customerOrders as any[]).map(order => (
                      <div key={order.id || order.orderNumber} className="bg-[#FAFAF7] rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#2D5A4C]">{order.orderNumber}</p>
                          <p className="text-xs text-[#A8A396]">
                            {_isMemberCustomer
                              ? `${order.items?.length || 0} items — ${formatPrice(order.total || 0)}`
                              : `${order.items?.length || 0} items — ${order.paymentMethod?.toUpperCase() || 'CoD'}`
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#2D5A4C]">
                            {formatPrice(order.grandTotal || order.total || 0)}
                          </p>
                          <p className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${
                            (order.orderStatus === 'delivered') ? 'bg-emerald-50 text-emerald-600' :
                            (order.orderStatus === 'cancelled') ? 'bg-red-50 text-red-500' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {(order.orderStatus || 'pending').replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete Customer */}
              <div className="pt-4 border-t border-[#E8E4DB]">
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to permanently delete ${selected.name}? This cannot be undone.`)) {
                      deleteCustomer(selected.id)
                      setShowDetail(false)
                      setSelectedCustomer(null)
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} /> Delete Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
