import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { TopNavigation } from '@/components/layout/TopNavigation'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { BackToTop } from '@/components/shared/BackToTop'
import { ToastContainer } from '@/components/shared/Toast'
import { AbandonedCartRecovery } from '@/components/shared/AbandonedCartRecovery'
import { HomePage } from '@/pages/HomePage'
import { ShopPage } from '@/pages/ShopPage'
import { ProductPage } from '@/pages/ProductPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { OrderSuccessPage } from '@/pages/OrderSuccessPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { MemberAreaPage } from '@/pages/MemberAreaPage'
import { AboutPage } from '@/pages/AboutPage'
import { FAQPage } from '@/pages/FAQPage'
import { ContactPage } from '@/pages/ContactPage'
import { TrackOrderPage } from '@/pages/TrackOrderPage'
import { AdminPage } from '@/pages/AdminPage'
import { WishlistPage } from '@/pages/WishlistPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { TermsPage } from '@/pages/TermsPage'
import { useMemberStore } from '@/stores/memberStore'
import type { Locale } from '@/types'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// FIX: ProtectedRoute — redirects unauthenticated users to /login.
// Wraps /checkout and /account so they cannot be accessed without a valid session.
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useMemberStore(s => s.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

// FIX: AdminRoute — requires both isAuthenticated and a known admin email.
const ADMIN_EMAILS = ['admin@miniyo.store']
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, customer } = useMemberStore(s => ({
    isAuthenticated: s.isAuthenticated,
    customer: s.customer,
  }))
  const isAdmin = isAuthenticated && customer?.email != null && ADMIN_EMAILS.includes(customer.email)
  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function MainLayout({ locale, onLocaleChange, children }: {
  locale: Locale
  onLocaleChange: (l: Locale) => void
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar locale={locale} />
      <TopNavigation locale={locale} onLocaleChange={onLocaleChange} />
      <CartDrawer locale={locale} />
      <main className="flex-1 pt-[108px]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer locale={locale} />
      <BackToTop />
      <AbandonedCartRecovery />
      <ToastContainer />
    </div>
  )
}

function AppRoutes({ locale, onLocaleChange }: { locale: Locale; onLocaleChange: (l: Locale) => void }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Pages - No Layout */}
        <Route path="/login" element={<LoginPage locale={locale} />} />
        <Route path="/register" element={<RegisterPage locale={locale} />} />

        {/* FIX: Admin Panel — now guarded by AdminRoute */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* Main Storefront */}
        <Route path="/" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><HomePage locale={locale} /></MainLayout>} />
        <Route path="/shop" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><ShopPage locale={locale} /></MainLayout>} />
        <Route path="/product/:handle" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><ProductPage locale={locale} /></MainLayout>} />
        <Route path="/cart" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><CartPage locale={locale} /></MainLayout>} />

        {/* FIX: /checkout — now wrapped in ProtectedRoute */}
        <Route
          path="/checkout"
          element={
            <MainLayout locale={locale} onLocaleChange={onLocaleChange}>
              <ProtectedRoute>
                <CheckoutPage locale={locale} />
              </ProtectedRoute>
            </MainLayout>
          }
        />

        <Route path="/order-success/:orderNumber" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><OrderSuccessPage locale={locale} /></MainLayout>} />
        <Route path="/about" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><AboutPage locale={locale} /></MainLayout>} />
        <Route path="/faq" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><FAQPage locale={locale} /></MainLayout>} />
        <Route path="/contact" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><ContactPage locale={locale} /></MainLayout>} />
        <Route path="/track-order" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><TrackOrderPage locale={locale} /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><PrivacyPage /></MainLayout>} />
        <Route path="/terms" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><TermsPage /></MainLayout>} />
        <Route path="/wishlist" element={<MainLayout locale={locale} onLocaleChange={onLocaleChange}><WishlistPage locale={locale} /></MainLayout>} />

        {/* FIX: /account — now wrapped in ProtectedRoute */}
        <Route
          path="/account"
          element={
            <MainLayout locale={locale} onLocaleChange={onLocaleChange}>
              <ProtectedRoute>
                <MemberAreaPage locale={locale} />
              </ProtectedRoute>
            </MainLayout>
          }
        />

        {/* FIX: 404 catch-all — shows a clean not-found state instead of blank page */}
        <Route
          path="*"
          element={
            <MainLayout locale={locale} onLocaleChange={onLocaleChange}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 700, opacity: 0.15 }}>404</h1>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Page Not Found</h2>
                <p style={{ color: 'var(--color-text-muted, #888)', maxWidth: '40ch' }}>The page you are looking for doesn&apos;t exist or has been moved.</p>
                <a href="/#/" style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: 'var(--color-primary, #01696f)', color: '#fff', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>Back to Home</a>
              </div>
            </MainLayout>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    return (localStorage.getItem('locale') as Locale) || 'en'
  })

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  return (
    <HashRouter>
      <ScrollToTop />
      <AppRoutes locale={locale} onLocaleChange={setLocale} />
    </HashRouter>
  )
}
