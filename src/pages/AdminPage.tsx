import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { adminGetMe, adminLogout, type AdminUser } from '@/lib/adminAuth'
import { useAdminStore } from '@/stores/adminStore'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { DashboardModule } from '@/components/admin/DashboardModule'
import { ProductsModule } from '@/components/admin/ProductsModule'
import { OrdersModule } from '@/components/admin/OrdersModule'
import { InventoryModule } from '@/components/admin/InventoryModule'
import { CustomersModule } from '@/components/admin/CustomersModule'
import { MediaModule } from '@/components/admin/MediaModule'
import { CmsModule } from '@/components/admin/CmsModule'
import { SettingsModule } from '@/components/admin/SettingsModule'
import { CsvImportModule } from '@/components/admin/CsvImportModule'
import { DiscountsModule } from '@/components/admin/DiscountsModule'
import { MembershipsModule } from '@/components/admin/MembershipsModule'

export type AdminView =
  | 'dashboard' | 'orders' | 'products' | 'inventory'
  | 'customers' | 'media' | 'cms' | 'payments'
  | 'shipping' | 'discounts' | 'memberships' | 'settings'
  | 'staff' | 'reports' | 'audit' | 'import'

export function AdminPage() {
  const navigate = useNavigate()
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [checking, setChecking] = useState(true)
  const importPending = useAdminStore(s => s.importPending)
  const [view, setView] = useState<AdminView>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [syncNotification, setSyncNotification] = useState<string | null>(null)

  // Verify admin session via DB-backed JWT cookie
  useEffect(() => {
    adminGetMe().then((user) => {
      if (!user) {
        navigate('/admin-login', { replace: true })
      } else {
        setAdminUser(user)
        setChecking(false)
        const result = importPending()
        if (result.ordersImported > 0) {
          setSyncNotification(`Imported ${result.ordersImported} new order${result.ordersImported > 1 ? 's' : ''} from storefront`)
        }
      }
    })
  }, [])

  const handleLogout = async () => {
    await adminLogout()
    navigate('/admin-login', { replace: true })
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2EFE9' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #01696f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!adminUser) return null

  const renderModule = () => {
    switch (view) {
      case 'dashboard': return <DashboardModule onNavigate={setView} />
      case 'orders': return <OrdersModule />
      case 'products': return <ProductsModule />
      case 'inventory': return <InventoryModule />
      case 'customers': return <CustomersModule />
      case 'media': return <MediaModule />
      case 'cms': return <CmsModule />
      case 'payments': return <OrdersModule filterPayment />
      case 'shipping': return <SettingsModule section="shipping" />
      case 'discounts': return <DiscountsModule />
      case 'memberships': return <MembershipsModule />
      case 'settings': return <SettingsModule />
      case 'staff': return <SettingsModule section="staff" />
      case 'reports': return <DashboardModule onNavigate={setView} reports />
      case 'audit': return <SettingsModule section="audit" />
      case 'import': return <CsvImportModule />
      default: return <DashboardModule onNavigate={setView} />
    }
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9] flex">
      <AdminSidebar
        view={view}
        onNavigate={setView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {syncNotification && (
          <div className="bg-sage-green/10 border-b border-sage-green/30 px-4 py-2.5 flex items-center justify-between shrink-0">
            <span className="text-sm text-sage-green font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.5 5.5L7 11l-2.5-2.5 1-1L7 9l3.5-3.5 1 1z" fill="currentColor"/></svg>
              {syncNotification}
            </span>
            <button onClick={() => setSyncNotification(null)} className="text-sage-green/70 hover:text-sage-green text-xs font-medium">Dismiss</button>
          </div>
        )}
        <AdminTopbar
          title={view.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          onMenuClick={() => setMobileSidebarOpen(true)}
          adminUser={adminUser}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-[1400px] mx-auto">
            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  )
}
