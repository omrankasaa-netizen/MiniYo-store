import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
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
import { NotificationsModule } from '@/components/admin/NotificationsModule'

export type AdminView =
  | 'dashboard' | 'notifications' | 'orders' | 'products' | 'inventory'
  | 'customers' | 'media' | 'cms' | 'payments'
  | 'shipping' | 'discounts' | 'settings' | 'staff'
  | 'reports' | 'audit' | 'import'

export function AdminPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin } = useAuth()
  const importPending = useAdminStore(s => s.importPending)
  const [view, setView] = useState<AdminView>('notifications')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [syncNotification, setSyncNotification] = useState<string | null>(null)
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isAdmin) {
      navigate(isAuthenticated ? '/' : '/login')
      return
    }
    // Initial sync on mount
    const result = importPending()
    if (result.ordersImported > 0) {
      setSyncNotification(`Imported ${result.ordersImported} new order${result.ordersImported > 1 ? 's' : ''} from storefront`)
    }
    if (result.stockProductsUpdated > 0) {
      setSyncNotification(prev => prev
        ? `${prev} + updated stock for ${result.stockProductsUpdated} product${result.stockProductsUpdated > 1 ? 's' : ''}`
        : `Updated stock for ${result.stockProductsUpdated} product${result.stockProductsUpdated > 1 ? 's' : ''}`
      )
    }

    // Auto-refresh every 30 seconds so staff see new orders without reloading
    syncIntervalRef.current = setInterval(() => {
      const r = importPending()
      if (r.ordersImported > 0) {
        setSyncNotification(`${r.ordersImported} new order${r.ordersImported > 1 ? 's' : ''} just arrived`)
      }
    }, 30_000)

    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current)
    }
  }, [isAdmin, isAuthenticated, navigate, importPending])

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'miniyo-sync') {
        const result = importPending()
        if (result.ordersImported > 0 || result.stockProductsUpdated > 0) {
          setSyncNotification(`Synced: ${result.ordersImported} orders, ${result.stockProductsUpdated} stock updates`)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [importPending])

  if (!isAdmin) return null

  const renderModule = () => {
    switch (view) {
      case 'notifications': return <NotificationsModule onNavigate={setView} />
      case 'dashboard': return <DashboardModule onNavigate={setView} />
      case 'orders': return <OrdersModule />
      case 'products': return <ProductsModule />
      case 'inventory': return <InventoryModule />
      case 'customers': return <CustomersModule />
      case 'media': return <MediaModule />
      case 'cms': return <CmsModule />
      case 'payments': return <OrdersModule filterPayment />
      case 'shipping': return <SettingsModule section="shipping" />
      case 'settings': return <SettingsModule />
      case 'staff': return <SettingsModule section="staff" />
      case 'reports': return <DashboardModule onNavigate={setView} reports />
      case 'audit': return <SettingsModule section="audit" />
      case 'import': return <CsvImportModule />
      case 'discounts': return <DiscountsModule />
      default: return <NotificationsModule onNavigate={setView} />
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
        {/* Sync Notification Toast */}
        {syncNotification && (
          <div className="bg-sage-green/10 border-b border-sage-green/30 px-4 py-2.5 flex items-center justify-between shrink-0">
            <span className="text-sm text-sage-green font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.5 5.5L7 11l-2.5-2.5 1-1L7 9l3.5-3.5 1 1z" fill="currentColor"/></svg>
              {syncNotification}
            </span>
            <button
              onClick={() => setSyncNotification(null)}
              className="text-sage-green/70 hover:text-sage-green text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        )}
        <AdminTopbar
          title={view.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          onMenuClick={() => setMobileSidebarOpen(true)}
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
