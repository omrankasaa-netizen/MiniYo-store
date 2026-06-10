import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useAuth } from '@/hooks/useAuth'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAdminStore } from '@/stores/adminStore'
import { t } from '@/lib/i18n'
import type { Locale } from '@/types'

interface TopNavigationProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}

const shopLinks = [
  { label: 'allProducts', href: '/shop' },
  { label: 'newArrivals', href: '/shop?new=true' },
  { label: 'bestSellers', href: '/shop?bestseller=true' },
  { label: 'onSale', href: '/shop?sale=true' },
]

const categoryLinks = [
  { label: 'Bodysuits & Rompers', href: '/shop?category=bodysuits-rompers' },
  { label: 'Tops & T-Shirts', href: '/shop?category=tops-tshirts' },
  { label: 'Bottoms & Pants', href: '/shop?category=bottoms-pants' },
  { label: 'Outerwear & Jackets', href: '/shop?category=outerwear-jackets' },
  { label: 'Dresses', href: '/shop?category=dresses' },
  { label: 'Sleepwear & Pajamas', href: '/shop?category=sleepwear-pajamas' },
  { label: 'Sets & Bundles', href: '/shop?category=sets-bundles' },
  { label: 'Accessories', href: '/shop?category=accessories' },
]

export function TopNavigation({ locale, onLocaleChange }: TopNavigationProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const cart = useCartStore()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const wishlist = useWishlistStore()
  const logoUrl = useAdminStore(s => s.settings.logoImageUrl)
  const isLoggedIn = isAuthenticated
  const [scrolled, setScrolled] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setShopOpen(false)
  }, [location.pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-border-beige/60 transition-all duration-300 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2 text-dark-teal hover:text-sage-green transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img src={logoUrl || '/images/logo.png'} alt="Miniyo" className="h-9 w-auto" />
              <div className="hidden sm:block">
                <span className="font-display text-xl font-medium text-dark-teal tracking-tight">
                  Miniyo
                </span>
                <span className="block text-[9px] text-muted-teal tracking-[0.15em] uppercase -mt-0.5 font-accent">
                  {locale === 'en' ? 'Baby Boutique' : 'بوتيك الأطفال'}
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-7">
              {/* Shop Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button className="flex items-center gap-1 font-accent text-[13px] font-medium text-dark-teal hover:text-sage-green transition-colors py-2">
                  {t('shop', locale)}
                  <ChevronDown size={13} className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {shopOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 mt-1.5 w-[260px] bg-white rounded-xl shadow-xl border border-border-beige/60 p-3 z-50"
                    >
                      {shopLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          className="block py-2 px-3 text-[13px] text-dark-teal hover:text-sage-green hover:bg-cream/50 rounded-lg transition-all"
                        >
                          {t(link.label as any, locale)}
                        </Link>
                      ))}
                      <div className="my-1.5 border-t border-border-beige/40 mx-3" />
                      {categoryLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          className="block py-1.5 px-3 text-[12px] text-muted-teal hover:text-dark-teal hover:bg-cream/50 rounded-lg transition-all"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/about" className="font-accent text-[13px] font-medium text-dark-teal hover:text-sage-green transition-colors py-2 relative group">
                {t('about', locale)}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-sage-green transition-all duration-200 group-hover:w-full" />
              </Link>
              <Link to="/contact" className="font-accent text-[13px] font-medium text-dark-teal hover:text-sage-green transition-colors py-2 relative group">
                {t('contact', locale)}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-sage-green transition-all duration-200 group-hover:w-full" />
              </Link>
              <Link to="/track-order" className="font-accent text-[13px] font-medium text-dark-teal hover:text-sage-green transition-colors py-2 relative group">
                {t('trackOrder', locale)}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-sage-green transition-all duration-200 group-hover:w-full" />
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => onLocaleChange(locale === 'en' ? 'ar' : 'en')}
                className="hidden sm:flex items-center gap-1 bg-cream/80 rounded-lg px-2.5 py-1.5 font-accent text-[11px] font-semibold text-muted-teal hover:bg-cream hover:text-dark-teal transition-colors border border-border-beige/40"
              >
                <span className={locale === 'en' ? 'text-dark-teal' : 'text-muted-teal/60'}>EN</span>
                <span className="text-border-beige">/</span>
                <span className={locale === 'ar' ? 'text-dark-teal' : 'text-muted-teal/60'}>عربي</span>
              </button>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-dark-teal hover:text-sage-green hover:bg-cream/60 rounded-lg transition-colors"
              >
                <Search size={19} />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2.5 text-dark-teal hover:text-sage-green hover:bg-cream/60 rounded-lg transition-colors hidden sm:block">
                <Heart size={19} />
                {wishlist.items.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-sage-green text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.items.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => cart.toggle()}
                className="relative p-2.5 text-dark-teal hover:text-sage-green hover:bg-cream/60 rounded-lg transition-colors"
              >
                <ShoppingBag size={19} />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-sage-green text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </button>

              {/* User */}
              <Link to={isLoggedIn ? (isAdmin ? '/admin' : '/account') : '/login'} className="p-2.5 text-dark-teal hover:text-sage-green hover:bg-cream/60 rounded-lg transition-colors">
                <User size={19} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-white border-b border-border-beige/60 shadow-lg"
          >
            <div className="max-w-[1400px] mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder', locale)}
                  className="w-full h-12 font-body text-base text-dark-teal placeholder:text-muted-teal/40 bg-cream/50 border border-border-beige/60 rounded-xl px-4 outline-none focus:border-sage-green/50 focus:ring-2 focus:ring-sage-green/10 transition-all"
                  autoFocus
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-teal hover:text-dark-teal p-1">
                  <Search size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-ivory z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <img src={logoUrl || '/images/logo.png'} alt="Miniyo" className="h-11 w-auto" />
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-dark-teal hover:bg-cream rounded-lg transition-colors">
                    <X size={22} />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <Link to="/shop" className="font-display text-lg text-dark-teal py-2">{t('shop', locale)}</Link>
                  <Link to="/shop?new=true" className="font-body text-sm text-muted-teal pl-4 py-1.5">{t('newArrivals', locale)}</Link>
                  <Link to="/shop?bestseller=true" className="font-body text-sm text-muted-teal pl-4 py-1.5">{t('bestSellers', locale)}</Link>
                  <Link to="/about" className="font-display text-lg text-dark-teal py-2">{t('about', locale)}</Link>
                  <Link to="/contact" className="font-display text-lg text-dark-teal py-2">{t('contact', locale)}</Link>
                  <Link to="/track-order" className="font-display text-lg text-dark-teal py-2">{t('trackOrder', locale)}</Link>
                  <Link to="/faq" className="font-display text-lg text-dark-teal py-2">{t('faqTitle', locale)}</Link>
                  <div className="border-t border-border-beige/60 pt-4 mt-3">
                    {isAuthenticated ? (
                      <>
                        <Link to={isAdmin ? '/admin' : '/account'} className="font-display text-lg text-dark-teal block py-2">{t('account', locale)}</Link>
                        <button onClick={() => logout()} className="font-display text-lg text-red-500 py-2">{t('signOut', locale)}</button>
                      </>
                    ) : (
                      <Link to="/login" className="font-display text-lg text-dark-teal py-2">{t('signIn', locale)}</Link>
                    )}
                  </div>
                  <div className="border-t border-border-beige/60 pt-4">
                    <button
                      onClick={() => onLocaleChange(locale === 'en' ? 'ar' : 'en')}
                      className="flex items-center gap-2 font-accent text-sm font-medium text-muted-teal bg-cream/60 rounded-lg px-3 py-2"
                    >
                      <span className={locale === 'en' ? 'text-dark-teal' : ''}>English</span>
                      <span className="text-border-beige">|</span>
                      <span className={locale === 'ar' ? 'text-dark-teal' : ''}>العربية</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
