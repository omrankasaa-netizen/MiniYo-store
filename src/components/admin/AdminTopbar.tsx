import { useState } from 'react'
import { Globe, Check, Bell, LogOut } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import type { AdminUser } from '@/lib/adminAuth'

interface Props {
  title: string
  onMenuClick: () => void
  adminUser?: AdminUser | null
  onLogout?: () => void
}

export function AdminTopbar({ title, onMenuClick, adminUser, onLogout }: Props) {
  const { pendingChanges, publishedAt, publishChanges, orders } = useAdminStore()
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const initial = adminUser?.name?.charAt(0).toUpperCase() || 'A'
  const displayName = adminUser?.name || 'Admin'

  const pendingOrders = orders.filter(o => o.orderStatus === 'pending_confirmation')
  const pendingWA = orders.filter(o =>
    ['confirmed', 'packed', 'out_for_delivery'].includes(o.orderStatus) && !o.whatsappConfirmed
  )
  const notifCount = pendingOrders.length + pendingWA.length

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#E8E4DB] h-14 flex items-center px-4 lg:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-[#5C6B60] hover:text-[#2D5A4C] hover:bg-[#F2EFE9] rounded-lg transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <h1 className="text-sm font-semibold text-[#2D5A4C] capitalize">{title}</h1>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {pendingChanges ? (
            <button
              onClick={() => setShowPublishConfirm(true)}
              className="h-8 px-3 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 animate-pulse"
            >
              <Check size={13} /> Apply Changes
            </button>
          ) : publishedAt ? (
            <div className="flex items-center gap-1.5 text-[10px] text-[#8FAE7B] bg-emerald-50 px-2 py-1 rounded-lg">
              <Globe size={11} /> Live
            </div>
          ) : null}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(v => !v)}
              className="relative w-8 h-8 flex items-center justify-center text-[#5C6B60] hover:text-[#2D5A4C] hover:bg-[#F2EFE9] rounded-lg transition-colors"
            >
              <Bell size={17} />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-[#E8E4DB] z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E8E4DB] flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#2D5A4C]">Notifications</span>
                    {notifCount > 0 && <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">{notifCount} new</span>}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#F2EFE9]">
                    {pendingOrders.length === 0 && pendingWA.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-[#A8A396]">All clear — no pending actions 🎉</div>
                    ) : (
                      <>
                        {pendingOrders.map(o => (
                          <div key={o.id} className="px-4 py-3 hover:bg-[#F9F8F5]">
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-[#2D5A4C]">New order: {o.orderNumber}</p>
                                <p className="text-xs text-[#8B8578]">{o.customerName} · ${o.grandTotal.toFixed(2)}</p>
                                <p className="text-[10px] text-[#A8A396] mt-0.5">{new Date(o.createdAt).toLocaleString('en-LB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {pendingWA.map(o => (
                          <div key={o.id} className="px-4 py-3 hover:bg-[#F9F8F5]">
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 w-2 h-2 rounded-full bg-green-400 shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-[#2D5A4C]">WhatsApp needed: {o.orderNumber}</p>
                                <p className="text-xs text-[#8B8578]">{o.customerName} · {o.orderStatus.replace(/_/g, ' ')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User */}
          <div className="flex items-center gap-2 ml-1 pl-2 border-l border-[#E8E4DB]">
            <div className="w-8 h-8 rounded-full bg-[#2D5A4C] flex items-center justify-center text-white text-xs font-semibold">
              {initial}
            </div>
            <span className="hidden md:inline text-xs text-[#5C6B60] font-medium max-w-[100px] truncate">{displayName}</span>
          </div>

          {/* Logout */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="ml-1 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </header>

      {showPublishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Globe size={20} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#2D5A4C]">Publish Changes?</h3>
                <p className="text-xs text-[#8B8578] mt-0.5">This will make all pending changes live on the storefront immediately.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setShowPublishConfirm(false)} className="flex-1 py-2 text-sm font-medium text-[#5C6B60] bg-[#F2EFE9] hover:bg-[#E8E4DB] rounded-lg transition-colors">Cancel</button>
              <button onClick={() => { publishChanges(); setShowPublishConfirm(false) }} className="flex-1 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Yes, Publish</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
