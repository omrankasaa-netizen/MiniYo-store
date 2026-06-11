import { useState } from 'react'
import { Crown, Diamond, Leaf, Search, TrendingUp, Users, Gift, Star, ChevronRight, X, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react'
import { useMemberStore, tierColors, TIER_BENEFITS, TIER_THRESHOLDS, type MembershipTier, type MemberCustomer } from '@/stores/memberStore'
import { useAdminStore } from '@/stores/adminStore'
import { formatPrice } from '@/lib/i18n'
import { PrintButton } from '@/components/shared/PrintButton'
import { PrintHeader } from '@/components/shared/PrintHeader'

const tierIcons: Record<MembershipTier, typeof Leaf> = { bronze: Leaf, silver: Diamond, gold: Crown }

interface MemberRow {
  id: string
  name: string
  email: string
  phone: string | null
  tier: MembershipTier
  totalOrders: number
  totalSpent: number
  registeredAt: string
  freeShippingUsed: number
  firstOrderDiscountUsed: boolean
  referralCode: string
  referralCount: number
}

function TierBadge({ tier }: { tier: MembershipTier }) {
  const Icon = tierIcons[tier]
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${tierColors[tier]}18`, color: tierColors[tier] }}
    >
      <Icon size={9} />
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#D4CFC6] p-4">
      <p className="text-xs text-[#8B8578] mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color: color || '#2D5A4C' }}>{value}</p>
      {sub && <p className="text-xs text-[#A8A396] mt-0.5">{sub}</p>}
    </div>
  )
}

export function MembershipsModule() {
  const memberCustomer = useMemberStore(s => s.customer)
  const memberOrders = useMemberStore(s => s.orders)
  const { customers, orders } = useAdminStore()
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState<MembershipTier | 'all'>('all')
  const [selected, setSelected] = useState<MemberRow | null>(null)

  // Build unified member list from admin customer tags + live member store
  const members: MemberRow[] = []

  // Admin customers tagged with a tier
  for (const c of customers) {
    const tier = (c.tags?.find((t: string) => ['bronze', 'silver', 'gold'].includes(t)) as MembershipTier | undefined)
    if (!tier) continue
    if (members.find(m => m.email === c.email)) continue
    members.push({
      id: c.id,
      name: c.name,
      email: c.email || '',
      phone: c.phone || null,
      tier,
      totalOrders: c.totalOrders,
      totalSpent: Number(c.totalSpent),
      registeredAt: c.lastOrderDate || '',
      freeShippingUsed: 0,
      firstOrderDiscountUsed: c.totalOrders > 0,
      referralCode: '',
      referralCount: 0,
    })
  }

  // Live member store customer (most authoritative)
  if (memberCustomer) {
    const idx = members.findIndex(m => m.email === memberCustomer.email)
    const row: MemberRow = {
      id: memberCustomer.id,
      name: memberCustomer.name,
      email: memberCustomer.email,
      phone: memberCustomer.phone,
      tier: memberCustomer.membershipTier,
      totalOrders: memberCustomer.totalOrders,
      totalSpent: memberCustomer.totalSpent,
      registeredAt: memberCustomer.registeredAt,
      freeShippingUsed: memberCustomer.freeShippingUsed,
      firstOrderDiscountUsed: memberCustomer.firstOrderDiscountUsed,
      referralCode: memberCustomer.referralCode,
      referralCount: memberCustomer.referralCount,
    }
    if (idx >= 0) members[idx] = row
    else members.push(row)
  }

  // Stats
  const byTier = (t: MembershipTier) => members.filter(m => m.tier === t).length
  const totalRevenue = members.reduce((s, m) => s + m.totalSpent, 0)
  const avgSpend = members.length ? totalRevenue / members.length : 0

  // Filter
  const filtered = members.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.phone?.includes(q) ?? false)
    const matchTier = filterTier === 'all' || m.tier === filterTier
    return matchSearch && matchTier
  })

  // Detail panel orders
  const detailOrders = selected
    ? (memberCustomer && selected.email === memberCustomer.email
        ? memberOrders
        : orders.filter((o: any) => o.email === selected.email))
    : []

  return (
    <div className="space-y-5">
      <PrintHeader title="Memberships Report" subtitle={`${members.length} registered members`} />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Members" value={members.length} />
        <StatCard label="Bronze" value={byTier('bronze')} color={tierColors.bronze} />
        <StatCard label="Silver" value={byTier('silver')} color={tierColors.silver} />
        <StatCard label="Gold" value={byTier('gold')} color={tierColors.gold} />
        <StatCard label="Total Revenue" value={formatPrice(totalRevenue)} sub="from members" />
        <StatCard label="Avg. Spend" value={formatPrice(avgSpend)} sub="per member" />
      </div>

      {/* Tier benefit reference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['bronze', 'silver', 'gold'] as MembershipTier[]).map(tier => {
          const b = TIER_BENEFITS[tier]
          const Icon = tierIcons[tier]
          return (
            <div key={tier} className="bg-white rounded-xl border border-[#D4CFC6] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} style={{ color: tierColors[tier] }} />
                <span className="font-semibold text-sm" style={{ color: tierColors[tier] }}>
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </span>
                <span className="ml-auto text-xs text-[#8B8578]">{byTier(tier)} members</span>
              </div>
              <p className="text-xs text-[#5C6B60] mb-2">{b.description}</p>
              <div className="space-y-1">
                {b.perks.map(p => (
                  <div key={p} className="flex items-start gap-1.5 text-xs text-[#8B8578]">
                    <Star size={9} className="mt-0.5 shrink-0" style={{ color: tierColors[tier] }} />
                    {p}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[#F2EFE9] text-xs text-[#A8A396]">
                Threshold: {tier === 'bronze' ? 'On registration' : `$${TIER_THRESHOLDS[tier]}+ spent`}
              </div>
            </div>
          )
        })}
      </div>

      {/* Member table */}
      <div className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[#F2EFE9]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A396]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, phone…"
              className="w-full h-9 border border-[#D4CFC6] rounded-lg pl-8 pr-3 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20"
            />
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'bronze', 'silver', 'gold'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilterTier(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterTier === t
                    ? 'bg-[#2D5A4C] text-white'
                    : 'bg-[#F5F0E6] text-[#5C6B60] hover:bg-[#E8E4DB]'
                }`}
                style={filterTier === t && t !== 'all' ? { backgroundColor: tierColors[t] } : {}}
              >
                {t === 'all' ? 'All Tiers' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
            <PrintButton label="Print" />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#A8A396] text-sm">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            No members match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F2EFE9] text-[10px] uppercase tracking-wider text-[#A8A396]">
                  <th className="text-left px-4 py-2.5 font-medium">Member</th>
                  <th className="text-left px-4 py-2.5 font-medium">Tier</th>
                  <th className="text-right px-4 py-2.5 font-medium">Orders</th>
                  <th className="text-right px-4 py-2.5 font-medium">Spent</th>
                  <th className="text-right px-4 py-2.5 font-medium">Progress to next</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9]">
                {filtered.map(m => {
                  const nextTier: MembershipTier | null = m.tier === 'bronze' ? 'silver' : m.tier === 'silver' ? 'gold' : null
                  const threshold = nextTier ? TIER_THRESHOLDS[nextTier] : null
                  const progress = threshold ? Math.min(100, (m.totalSpent / threshold) * 100) : 100
                  return (
                    <tr key={m.id} className="hover:bg-[#F9F8F5] transition-colors cursor-pointer" onClick={() => setSelected(m)}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#2D5A4C]">{m.name}</p>
                        <p className="text-xs text-[#A8A396]">{m.email}</p>
                      </td>
                      <td className="px-4 py-3"><TierBadge tier={m.tier} /></td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#5C6B60]">{m.totalOrders}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-[#2D5A4C]">{formatPrice(m.totalSpent)}</td>
                      <td className="px-4 py-3">
                        {nextTier ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[#F2EFE9] rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: tierColors[nextTier] }} />
                            </div>
                            <span className="text-[10px] text-[#A8A396] whitespace-nowrap tabular-nums">
                              {formatPrice(m.totalSpent)} / {formatPrice(TIER_THRESHOLDS[nextTier])}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#D4A843] font-semibold flex items-center gap-1">
                            <Crown size={10} /> Max tier
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ChevronRight size={14} className="text-[#A8A396] inline" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-[#D4CFC6]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TierBadge tier={selected.tier} />
                </div>
                <p className="font-semibold text-[#2D5A4C] text-lg">{selected.name}</p>
                <p className="text-xs text-[#8B8578]">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F2EFE9] text-[#8B8578]">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F9F8F5] rounded-lg p-3">
                  <p className="text-xs text-[#A8A396] mb-0.5">Total Spent</p>
                  <p className="font-bold text-[#2D5A4C]">{formatPrice(selected.totalSpent)}</p>
                </div>
                <div className="bg-[#F9F8F5] rounded-lg p-3">
                  <p className="text-xs text-[#A8A396] mb-0.5">Orders</p>
                  <p className="font-bold text-[#2D5A4C]">{selected.totalOrders}</p>
                </div>
                <div className="bg-[#F9F8F5] rounded-lg p-3">
                  <p className="text-xs text-[#A8A396] mb-0.5">Free Shipping Used</p>
                  <p className="font-bold text-[#2D5A4C]">{selected.freeShippingUsed} / {TIER_BENEFITS[selected.tier].freeShippingPerMonth} this month</p>
                </div>
                <div className="bg-[#F9F8F5] rounded-lg p-3">
                  <p className="text-xs text-[#A8A396] mb-0.5">First-order discount</p>
                  <p className="font-bold text-[#2D5A4C]">{selected.firstOrderDiscountUsed ? 'Used' : 'Available'}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[#8B8578] uppercase tracking-wider">Contact</p>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm text-[#5C6B60]">
                    <Phone size={13} />{selected.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-[#5C6B60]">
                  <Mail size={13} />{selected.email}
                </div>
                {selected.registeredAt && (
                  <div className="flex items-center gap-2 text-sm text-[#5C6B60]">
                    <Calendar size={13} />Member since {new Date(selected.registeredAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Referral */}
              {selected.referralCode && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-[#8B8578] uppercase tracking-wider">Referral</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Gift size={13} className="text-[#8FAE7B]" />
                    <span className="font-mono bg-[#F2EFE9] px-2 py-0.5 rounded text-[#2D5A4C]">{selected.referralCode}</span>
                    <span className="text-[#A8A396] text-xs">{selected.referralCount} referrals</span>
                  </div>
                </div>
              )}

              {/* Tier progress */}
              {selected.tier !== 'gold' && (() => {
                const next: MembershipTier = selected.tier === 'bronze' ? 'silver' : 'gold'
                const thr = TIER_THRESHOLDS[next]
                const pct = Math.min(100, (selected.totalSpent / thr) * 100)
                return (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-[#8B8578] uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp size={11} /> Progress to {next.charAt(0).toUpperCase() + next.slice(1)}
                    </p>
                    <div className="h-2 bg-[#F2EFE9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: tierColors[next] }} />
                    </div>
                    <p className="text-xs text-[#A8A396]">
                      {formatPrice(selected.totalSpent)} of {formatPrice(thr)} — {formatPrice(thr - selected.totalSpent)} to go
                    </p>
                  </div>
                )
              })()}

              {/* Benefits */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[#8B8578] uppercase tracking-wider">Active Benefits</p>
                <div className="space-y-1">
                  {TIER_BENEFITS[selected.tier].perks.map(p => (
                    <div key={p} className="flex items-start gap-2 text-xs text-[#5C6B60]">
                      <Star size={9} className="mt-0.5 shrink-0" style={{ color: tierColors[selected.tier] }} />
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent orders */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[#8B8578] uppercase tracking-wider flex items-center gap-1">
                  <ShoppingBag size={11} /> Recent Orders ({detailOrders.length})
                </p>
                {detailOrders.length === 0 ? (
                  <p className="text-xs text-[#A8A396]">No orders yet.</p>
                ) : (
                  <div className="space-y-2">
                    {detailOrders.slice(0, 5).map((o: any) => (
                      <div key={o.orderNumber || o.id} className="bg-[#F9F8F5] rounded-lg p-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[#2D5A4C] font-medium">{o.orderNumber || o.id}</span>
                          <span className="font-semibold text-[#2D5A4C]">{formatPrice(o.total)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#A8A396]">
                          <span>{o.date}</span>
                          <span className="capitalize">{o.status?.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
