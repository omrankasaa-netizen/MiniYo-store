import { Globe, Check, Bell, LogOut } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useNavigate } from 'react-router'

interface Props {
  title: string
  onMenuClick: () => void
}

export function AdminTopbar({ title, onMenuClick }: Props) {
  const { pendingChanges, publishedAt, publishChanges } = useAdminStore()
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()

  const initial = admin?.email?.charAt(0).toUpperCase() || 'A'

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
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
        {/* Apply Changes Button */}
        {pendingChanges ? (
          <button
            onClick={publishChanges}
            className="h-8 px-3 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 animate-pulse"
            title="Publish pending changes to storefront"
          >
            <Check size={13} /> Apply Changes
          </button>
        ) : publishedAt ? (
          <div className="flex items-center gap-1.5 text-[10px] text-[#8FAE7B] bg-emerald-50 px-2 py-1 rounded-lg">
            <Globe size={11} />
            Live
          </div>
        ) : null}

        {/* User Info */}
        <div className="flex items-center gap-2 ml-1 pl-2 border-l border-[#E8E4DB]">
          <div
            className="w-8 h-8 rounded-full bg-[#2D5A4C] flex items-center justify-center text-white text-xs font-semibold"
            title={admin?.email || 'Admin'}
          >
            {initial}
          </div>
          <span className="hidden md:inline text-xs text-[#5C6B60] font-medium max-w-[100px] truncate">
            {admin?.email || 'Admin'}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="ml-1 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}
