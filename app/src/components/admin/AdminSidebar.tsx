import { Link } from 'react-router'
import {
  LayoutDashboard, ShoppingCart, Package, ClipboardList,
  Users, Image, FileText, CreditCard, Truck, Tag, Settings,
  UserCog, BarChart3, ShieldCheck, PanelLeftClose, PanelLeft,
  X, Download, Percent,
} from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import type { AdminView } from '@/pages/AdminPage'

interface Props {
  view: AdminView
  onNavigate: (v: AdminView) => void
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

const navGroups = [
  {
    label: 'Main',
    items: [
      { key: 'dashboard' as AdminView, label: 'Dashboard', icon: LayoutDashboard },
      { key: 'orders' as AdminView, label: 'Orders', icon: ShoppingCart },
      { key: 'products' as AdminView, label: 'Products', icon: Package },
      { key: 'inventory' as AdminView, label: 'Inventory', icon: ClipboardList },
      { key: 'customers' as AdminView, label: 'Customers', icon: Users },
    ],
  },
  {
    label: 'Content',
    items: [
      { key: 'media' as AdminView, label: 'Media', icon: Image },
      { key: 'cms' as AdminView, label: 'CMS / Homepage', icon: FileText },
    ],
  },
  {
    label: 'Operations',
    items: [
      { key: 'payments' as AdminView, label: 'Payments', icon: CreditCard },
      { key: 'shipping' as AdminView, label: 'Shipping', icon: Truck },
      { key: 'discounts' as AdminView, label: 'Discounts', icon: Percent },
      { key: 'import' as AdminView, label: 'Import CSV', icon: Download },
    ],
  },
  {
    label: 'System',
    items: [
      { key: 'settings' as AdminView, label: 'Settings', icon: Settings },
      { key: 'staff' as AdminView, label: 'Staff / Roles', icon: UserCog },
      { key: 'reports' as AdminView, label: 'Reports', icon: BarChart3 },
      { key: 'audit' as AdminView, label: 'Audit Log', icon: ShieldCheck },
    ],
  },
]

export function AdminSidebar({ view, onNavigate, collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: Props) {
  const { orders, products } = useAdminStore()
  const pendingWA = orders.filter(o => o.orderStatus === 'pending_confirmation' && !o.whatsappConfirmed).length
  const lowStock = products.filter(p => p.stockQuantity <= 5 && p.stockQuantity > 0).length

  const NavButton = ({ item }: { item: { key: AdminView; label: string; icon: React.ElementType } }) => {
    const isActive = view === item.key
    const Icon = item.icon
    return (
      <button
        onClick={() => { onNavigate(item.key); onCloseMobile() }}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all relative ${
          isActive
            ? 'bg-[#2D5A4C] text-white shadow-sm'
            : 'text-[#5C6B60] hover:bg-[#E8E4DB] hover:text-[#2D5A4C]'
        }`}
      >
        <Icon size={18} className="shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {item.key === 'orders' && pendingWA > 0 && !collapsed && (
          <span className="ml-auto bg-amber-400 text-[#2D5A4C] text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingWA}</span>
        )}
        {item.key === 'inventory' && lowStock > 0 && !collapsed && (
          <span className="ml-auto bg-red-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{lowStock}</span>
        )}
      </button>
    )
  }

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#D4CFC6]">
        <img src="/images/logo.png" alt="Miniyo" className={`${collapsed ? 'h-8' : 'h-10'} w-auto transition-all`} />
        {!collapsed && <span className="font-display text-lg text-[#2D5A4C]">Miniyo</span>}
        <button onClick={onToggleCollapse} className="ml-auto text-[#8B8578] hover:text-[#2D5A4C] p-1 rounded transition-colors hidden lg:block">
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navGroups.map(group => (
          <div key={group.label} className="mb-2">
            {!collapsed && <p className="px-3 text-[10px] font-semibold text-[#A8A396] uppercase tracking-wider mb-1">{group.label}</p>}
            <div className="space-y-0.5">
              {group.items.map(item => <NavButton key={item.key} item={item} />)}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[#D4CFC6]">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#8B8578] hover:text-[#2D5A4C] rounded-lg hover:bg-[#E8E4DB] transition-colors">
          <span>View Storefront</span>
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-[#D4CFC6] h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'} shrink-0`}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onCloseMobile} />
          <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-[#D4CFC6] z-50 flex flex-col lg:hidden">
            <div className="flex items-center justify-end px-4 py-3 border-b border-[#D4CFC6]">
              <button onClick={onCloseMobile} className="p-1 text-[#8B8578]"><X size={20} /></button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
