import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  LayoutDashboard, ShoppingBag, User, MapPin, CreditCard,
  Crown, Leaf, Diamond, LogOut, Plus, Baby,
  Trash2, Edit3, Check, Package, Gift, Sparkles
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMemberStore, TIER_BENEFITS, type MembershipTier } from '@/stores/memberStore'
import { ReferralBanner } from '@/components/shared/ReferralBanner'
import { formatPrice } from '@/lib/i18n'
import type { Locale } from '@/types'

interface MemberAreaPageProps {
  locale: Locale
}

type MemberTab = 'dashboard' | 'orders' | 'profile' | 'children' | 'addresses' | 'payment' | 'membership'

const tierIcons: Record<MembershipTier, typeof Leaf> = {
  bronze: Leaf,
  silver: Diamond,
  gold: Crown,
}

const tierColors: Record<MembershipTier, string> = {
  bronze: '#CD7F32',
  silver: '#A8A8A8',
  gold: '#D4A843',
}

const tierGradients: Record<MembershipTier, string> = {
  bronze: 'from-[#CD7F32]/15 to-[#CD7F32]/5',
  silver: 'from-gray-200 to-gray-100',
  gold: 'from-[#FFD700]/20 to-[#FFD700]/5',
}

export function MemberAreaPage({ locale }: MemberAreaPageProps) {
  const navigate = useNavigate()
  const { user: authUser, isAuthenticated, logout: authLogout } = useAuth()
  const [tab, setTab] = useState<MemberTab>('dashboard')
  const customer = useMemberStore(s => s.customer)
  const children = useMemberStore(s => s.children)
  const addresses = useMemberStore(s => s.addresses)
  const paymentMethods = useMemberStore(s => s.paymentMethods)
  const orders = useMemberStore(s => s.orders)
  const activities = useMemberStore(s => s.activities)
  const memberLogout = useMemberStore(s => s.logout)
  const updateProfile = useMemberStore(s => s.updateProfile)
  const addChild = useMemberStore(s => s.addChild)
  const removeChild = useMemberStore(s => s.removeChild)
  const addAddress = useMemberStore(s => s.addAddress)
  const removeAddress = useMemberStore(s => s.removeAddress)
  const setDefaultAddress = useMemberStore(s => s.setDefaultAddress)
  const addPaymentMethod = useMemberStore(s => s.addPaymentMethod)
  const removePaymentMethod = useMemberStore(s => s.removePaymentMethod)
  const getBenefits = useMemberStore(s => s.getBenefits)
  const getTierProgress = useMemberStore(s => s.getTierProgress)
  const getBirthdayOfferStatus = useMemberStore(s => s.getBirthdayOfferStatus)
  const claimBirthdayOffer = useMemberStore(s => s.claimBirthdayOffer)
  const getChildAge = useMemberStore(s => s.getChildAge)
  const getAgeGroup = useMemberStore(s => s.getAgeGroup)

  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    label: 'Home', fullName: '', phone: '', city: '', district: '',
    street: '', building: '', floor: '', apartment: '', landmark: '', isDefault: false,
  })

  // Use authUser name for display if memberStore customer is not yet synced
  const displayName = customer?.name || authUser?.name || (locale === 'ar' ? 'عضوة' : 'Member')
  const displayEmail = customer?.email || authUser?.email || ''
  const displayPhone = customer?.phone || authUser?.phone || ''

  // Unified logout — clears both auth systems
  const handleLogout = () => {
    authLogout()
    memberLogout()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="font-display text-2xl text-dark-teal mb-2">
          {locale === 'ar' ? 'الرجاء تسجيل الدخول' : 'Please Sign In'}
        </h1>
        <p className="text-muted-teal text-sm mb-4">
          {locale === 'ar' ? 'سجلي دخولي لعرض حسابك' : 'Login to view your account'}
        </p>
        <div className="flex gap-3">
          <Link to="/login" className="px-6 py-2.5 bg-beige text-dark-teal rounded-xl font-accent font-medium hover:bg-beige-dark transition-colors">
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
          <Link to="/register" className="px-6 py-2.5 border border-border-beige text-dark-teal rounded-xl font-accent font-medium hover:bg-cream transition-colors">
            {locale === 'ar' ? 'إنشاء حساب' : 'Register'}
          </Link>
        </div>
      </div>
    )
  }

  // Safe defaults when customer profile hasn't been synced from memberStore
  const membershipTier = customer?.membershipTier || 'bronze'
  const benefits = customer ? getBenefits() : TIER_BENEFITS.bronze
  const progress = customer ? getTierProgress() : { current: 0, target: 500, tier: 'bronze' as MembershipTier, nextTier: 'silver' as MembershipTier, percent: 0 }
  const TierIcon = tierIcons[membershipTier]
  const tierColor = tierColors[membershipTier]

  const tabs: { key: MemberTab; label: string; labelAr: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم', icon: LayoutDashboard },
    { key: 'orders', label: 'My Orders', labelAr: 'طلباتي', icon: ShoppingBag },
    { key: 'profile', label: 'Profile', labelAr: 'الملف الشخصي', icon: User },
    { key: 'children', label: 'My Children', labelAr: 'أطفالي', icon: Baby },
    { key: 'addresses', label: 'Addresses', labelAr: 'العناوين', icon: MapPin },
    { key: 'payment', label: 'Payment Methods', labelAr: 'طرق الدفع', icon: CreditCard },
    { key: 'membership', label: 'Membership', labelAr: 'العضوية', icon: Crown },
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-cream border-2 flex items-center justify-center" style={{ borderColor: tierColor }}>
            <TierIcon size={24} style={{ color: tierColor }} />
          </div>
          <div>
            <h1 className="font-display text-2xl text-dark-teal">{displayName}</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${tierColor}15`, color: tierColor }}>
                {customer?.membershipTier?.charAt(0).toUpperCase() + (customer?.membershipTier?.slice(1) || '')}
              </span>
              <span className="text-xs text-muted-teal">{displayEmail}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut size={15} /> {locale === 'ar' ? 'خروج' : 'Logout'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-[240px] shrink-0">
          <nav className="bg-white rounded-xl border border-border-beige p-2 space-y-0.5">
            {tabs.map(t => {
              const Icon = t.icon
              const isActive = tab === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-dark-teal text-white'
                      : 'text-dark-teal hover:bg-cream'
                  }`}
                >
                  <Icon size={17} />
                  <span>{locale === 'ar' ? t.labelAr : t.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {/* ====== DASHBOARD ====== */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              {/* Referral Banner */}
              <ReferralBanner locale={locale} />

              {/* Tier Banner */}
              <div className={`bg-gradient-to-r ${tierGradients[membershipTier]} rounded-2xl p-6 border`} style={{ borderColor: `${tierColor}30` }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                    <TierIcon size={22} style={{ color: tierColor }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-teal">
                      {locale === 'ar' ? 'عضويتك الحالية' : 'Your Membership'}
                    </p>
                    <p className="font-display text-xl" style={{ color: tierColor }}>
                      {membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)}
                    </p>
                    {progress.nextTier && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-teal">${progress.current.toFixed(0)} spent</span>
                          <span className="text-muted-teal">${progress.target} for {progress.nextTier}</span>
                        </div>
                        <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress.percent}%`, backgroundColor: tierColor }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Birthday Banner */}
              {(() => {
                const bdayStatus = getBirthdayOfferStatus()
                if (!bdayStatus.isBirthday) return null
                return (
                  <div className="bg-gradient-to-r from-blush-dark/10 to-blush-light border border-blush-dark/20 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blush-light flex items-center justify-center shrink-0">
                      <Gift size={22} className="text-blush-dark" />
                    </div>
                    <div className="flex-1">
                      <p className="font-accent font-semibold text-dark-teal">
                        {locale === 'ar' ? 'عيد ميلاد سعيد!' : 'Happy Birthday!'}
                      </p>
                      <p className="text-xs text-muted-teal">
                        {locale === 'ar' ? 'مينيو تهديكي توصيل مجاني على طلبيتك اليوم!' : 'Miniyo gifts you free delivery on your order today!'}
                      </p>
                    </div>
                    {bdayStatus.canClaim ? (
                      <button
                        onClick={() => {
                          claimBirthdayOffer()
                          window.location.reload()
                        }}
                        className="px-4 py-2 bg-blush-dark text-white rounded-xl text-xs font-medium hover:bg-blush-dark/90 transition-colors shrink-0"
                      >
                        {locale === 'ar' ? 'استلمي الهدية' : 'Claim Gift'}
                      </button>
                    ) : (
                      <span className="text-xs text-sage-green font-medium shrink-0 flex items-center gap-1">
                        <Sparkles size={12} /> {locale === 'ar' ? 'تم الاستلام' : 'Claimed'}
                      </span>
                    )}
                  </div>
                )
              })()}

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-border-beige p-4 text-center">
                  <p className="text-2xl font-accent font-bold text-dark-teal">{customer?.totalOrders || 0}</p>
                  <p className="text-xs text-muted-teal">{locale === 'ar' ? 'طلبية' : 'Orders'}</p>
                </div>
                <div className="bg-white rounded-xl border border-border-beige p-4 text-center">
                  <p className="text-2xl font-accent font-bold text-dark-teal">{formatPrice(customer?.totalSpent || 0)}</p>
                  <p className="text-xs text-muted-teal">{locale === 'ar' ? 'إجمالي' : 'Total Spent'}</p>
                </div>
                <div className="bg-white rounded-xl border border-border-beige p-4 text-center">
                  <p className="text-2xl font-accent font-bold text-sage-green">{addresses.length}</p>
                  <p className="text-xs text-muted-teal">{locale === 'ar' ? 'عناوين' : 'Addresses'}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl border border-border-beige p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-accent font-semibold text-dark-teal">
                    {locale === 'ar' ? 'آخر الطلبات' : 'Recent Orders'}
                  </h3>
                  <button onClick={() => setTab('orders')} className="text-xs text-sage-green hover:underline">
                    {locale === 'ar' ? 'عرض الكل' : 'View All'}
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-teal text-center py-6">
                    {locale === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map(o => (
                      <div key={o.orderNumber} className="flex items-center justify-between py-2 border-b border-border-beige/50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-dark-teal">{o.orderNumber}</p>
                          <p className="text-xs text-muted-teal">{o.date} — {o.items.length} {locale === 'ar' ? 'منتج' : 'item'}{o.items.length > 1 ? 's' : ''}</p>
                        </div>
                        <span className="font-accent font-semibold text-sm text-dark-teal">{formatPrice(o.total)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Benefits Summary */}
              <div className="bg-white rounded-xl border border-border-beige p-5">
                <h3 className="font-accent font-semibold text-dark-teal mb-3">
                  {locale === 'ar' ? 'مميزات عضويتك' : 'Your Benefits'}
                </h3>
                <div className="space-y-2">
                  {benefits.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-teal">
                      <Check size={14} className="text-sage-green shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age-Based Recommendations */}
              {children.length > 0 && (
                <div className="bg-white rounded-xl border border-border-beige p-5">
                  <h3 className="font-accent font-semibold text-dark-teal mb-3">
                    {locale === 'ar' ? 'مقترحات لأطفالك' : 'Picks for Your Little Ones'}
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {children.map(child => {
                      const ageMonths = getChildAge(child.dateOfBirth)
                      const ageGroup = getAgeGroup(ageMonths)
                      const ageText = ageMonths < 12 ? `${ageMonths}M` : ageMonths < 24 ? `${Math.floor(ageMonths / 12)}Y` : `${Math.floor(ageMonths / 12)}Y ${ageMonths % 12}M`
                      return (
                        <div key={child.id} className="shrink-0 w-[140px] bg-cream rounded-xl p-3 text-center">
                          <div className="w-10 h-10 rounded-full bg-sage-green/10 flex items-center justify-center mx-auto mb-2">
                            <Baby size={18} className="text-sage-green" />
                          </div>
                          <p className="text-sm font-medium text-dark-teal truncate">{child.name}</p>
                          <p className="text-[10px] text-muted-teal">{ageText} old — {ageGroup}</p>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-xs text-muted-teal mt-2">
                    {locale === 'ar'
                      ? 'سنقترح لكِ منتجات تناسب أعمار أطفالك عند التسوق'
                      : 'We will suggest products matching your children ages while shopping'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ====== ORDERS ====== */}
          {tab === 'orders' && (
            <div className="bg-white rounded-xl border border-border-beige p-5">
              <h3 className="font-accent font-semibold text-dark-teal mb-4">
                {locale === 'ar' ? 'جميع الطلبات' : 'All Orders'}
              </h3>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={40} className="mx-auto text-border-beige mb-3" />
                  <p className="text-muted-teal">{locale === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
                  <Link to="/shop" className="text-sm text-sage-green hover:underline mt-2 inline-block">
                    {locale === 'ar' ? 'تسوّقي الآن' : 'Start Shopping'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(o => (
                    <div key={o.orderNumber} className="border border-border-beige rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-dark-teal">{o.orderNumber}</p>
                          <p className="text-xs text-muted-teal">{o.date}</p>
                        </div>
                        <span className="text-sm font-accent font-semibold text-dark-teal">{formatPrice(o.total)}</span>
                      </div>
                      <div className="space-y-1">
                        {o.items.map((item, i) => (
                          <p key={i} className="text-xs text-muted-teal">{item.name} × {item.qty}</p>
                        ))}
                      </div>
                      {o.discount > 0 && (
                        <p className="text-xs text-sage-green mt-2">{locale === 'ar' ? 'خصم:' : 'Discount:'} -{formatPrice(o.discount)}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====== PROFILE ====== */}
          {tab === 'profile' && (
            <div className="bg-white rounded-xl border border-border-beige p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-accent font-semibold text-dark-teal">
                  {locale === 'ar' ? 'الملف الشخصي' : 'My Profile'}
                </h3>
                {!editingProfile && (
                  <button
                    onClick={() => { setEditingProfile(true); setProfileForm({ name: displayName, email: displayEmail, phone: displayPhone || '' }) }}
                    className="flex items-center gap-1 text-xs text-sage-green hover:underline"
                  >
                    <Edit3 size={13} /> {locale === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                )}
              </div>

              {editingProfile ? (
                <form onSubmit={(e) => { e.preventDefault(); updateProfile({ name: profileForm.name, email: profileForm.email, phone: profileForm.phone }); setEditingProfile(false); }} className="space-y-4">
                  <div>
                    <label className="text-sm text-dark-teal font-medium">{locale === 'ar' ? 'الاسم' : 'Name'}</label>
                    <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full h-10 border border-border-beige rounded-lg px-3 mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-dark-teal font-medium">Email</label>
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full h-10 border border-border-beige rounded-lg px-3 mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-dark-teal font-medium">{locale === 'ar' ? 'الهاتف' : 'Phone'}</label>
                    <input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full h-10 border border-border-beige rounded-lg px-3 mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-beige text-dark-teal rounded-lg font-medium text-sm hover:bg-beige-dark">{locale === 'ar' ? 'حفظ' : 'Save'}</button>
                    <button type="button" onClick={() => setEditingProfile(false)} className="px-4 py-2 border border-border-beige rounded-lg text-sm text-muted-teal hover:bg-cream">{locale === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border-beige/50">
                    <span className="text-sm text-muted-teal">{locale === 'ar' ? 'الاسم' : 'Name'}</span>
                    <span className="text-sm font-medium text-dark-teal">{displayName}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border-beige/50">
                    <span className="text-sm text-muted-teal">Email</span>
                    <span className="text-sm font-medium text-dark-teal">{displayEmail}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border-beige/50">
                    <span className="text-sm text-muted-teal">{locale === 'ar' ? 'الهاتف' : 'Phone'}</span>
                    <span className="text-sm font-medium text-dark-teal">{displayPhone || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border-beige/50">
                    <span className="text-sm text-muted-teal">{locale === 'ar' ? 'العضوية' : 'Membership'}</span>
                    <span className="text-sm font-medium" style={{ color: tierColor }}>{membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border-beige/50">
                    <span className="text-sm text-muted-teal">{locale === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}</span>
                    <span className="text-sm font-medium text-dark-teal">{customer?.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : '-'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border-beige/50">
                    <span className="text-sm text-muted-teal">{locale === 'ar' ? 'الأطفال' : 'Children'}</span>
                    <button onClick={() => setTab('children')} className="text-sm font-medium text-sage-green hover:underline">{children.length} {locale === 'ar' ? (children.length === 1 ? 'طفل' : 'أطفال') : (children.length === 1 ? 'child' : 'children')}</button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-teal">{locale === 'ar' ? 'مسجل منذ' : 'Member Since'}</span>
                    <span className="text-sm font-medium text-dark-teal">{customer?.registeredAt ? new Date(customer.registeredAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====== CHILDREN ====== */}
          {tab === 'children' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-accent font-semibold text-dark-teal">
                  {locale === 'ar' ? 'أطفالي' : 'My Children'}
                </h3>
                <span className="text-xs text-muted-teal">{children.length} {locale === 'ar' ? 'مسجّل' : 'registered'}</span>
              </div>

              {children.length === 0 ? (
                <div className="bg-white rounded-xl border border-border-beige p-8 text-center">
                  <Baby size={36} className="mx-auto text-border-beige mb-3" />
                  <p className="text-sm text-muted-teal mb-1">{locale === 'ar' ? 'لا يوجد أطفال مسجّلين' : 'No children added yet'}</p>
                  <p className="text-xs text-muted-teal mb-4">{locale === 'ar' ? 'أضيفي أطفالك لتحصلي على مقترحات مخصصة' : 'Add your children to get personalized recommendations'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map(child => {
                    const ageMonths = getChildAge(child.dateOfBirth)
                    const ageGroup = getAgeGroup(ageMonths)
                    const ageText = ageMonths < 12 ? `${ageMonths}M` : `${Math.floor(ageMonths / 12)}Y ${ageMonths % 12}M`
                    return (
                      <div key={child.id} className="bg-white rounded-xl border border-border-beige p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${child.gender === 'boy' ? 'bg-blue-50' : child.gender === 'girl' ? 'bg-pink-50' : 'bg-cream'}`}>
                              <Baby size={18} className={child.gender === 'boy' ? 'text-blue-400' : child.gender === 'girl' ? 'text-pink-400' : 'text-sage-green'} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-dark-teal">{child.name}</p>
                              <p className="text-xs text-muted-teal">{ageText} old — {ageGroup}</p>
                            </div>
                          </div>
                          <button onClick={() => removeChild(child.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Add Child Form */}
              <AddChildForm
                locale={locale}
                onAdd={(child) => addChild(child)}
              />
            </div>
          )}

          {/* ====== ADDRESSES ====== */}
          {tab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-accent font-semibold text-dark-teal">
                  {locale === 'ar' ? 'عناويني' : 'Saved Addresses'}
                </h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 text-xs bg-beige text-dark-teal px-3 py-1.5 rounded-lg hover:bg-beige-dark transition-colors"
                >
                  <Plus size={13} /> {locale === 'ar' ? 'إضافة' : 'Add New'}
                </button>
              </div>

              {showAddressForm && (
                <div className="bg-white rounded-xl border border-border-beige p-5">
                  <h4 className="text-sm font-medium text-dark-teal mb-3">{locale === 'ar' ? 'عنوان جديد' : 'New Address'}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder={locale === 'ar' ? 'الاسم' : 'Full Name'} value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })} className="h-10 border border-border-beige rounded-lg px-3 text-sm" />
                    <input placeholder={locale === 'ar' ? 'الهاتف' : 'Phone'} value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} className="h-10 border border-border-beige rounded-lg px-3 text-sm" />
                    <input placeholder={locale === 'ar' ? 'المدينة' : 'City'} value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} className="h-10 border border-border-beige rounded-lg px-3 text-sm" />
                    <input placeholder={locale === 'ar' ? 'المنطقة' : 'District'} value={addressForm.district} onChange={e => setAddressForm({ ...addressForm, district: e.target.value })} className="h-10 border border-border-beige rounded-lg px-3 text-sm" />
                    <input placeholder={locale === 'ar' ? 'الشارع' : 'Street'} value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} className="h-10 border border-border-beige rounded-lg px-3 text-sm col-span-2" />
                    <input placeholder={locale === 'ar' ? 'المبنى' : 'Building'} value={addressForm.building} onChange={e => setAddressForm({ ...addressForm, building: e.target.value })} className="h-10 border border-border-beige rounded-lg px-3 text-sm" />
                    <input placeholder={locale === 'ar' ? 'الطابق' : 'Floor'} value={addressForm.floor} onChange={e => setAddressForm({ ...addressForm, floor: e.target.value })} className="h-10 border border-border-beige rounded-lg px-3 text-sm" />
                    <input placeholder={locale === 'ar' ? 'علامة مميزة' : 'Landmark'} value={addressForm.landmark} onChange={e => setAddressForm({ ...addressForm, landmark: e.target.value })} className="h-10 border border-border-beige rounded-lg px-3 text-sm col-span-2" />
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => { addAddress(addressForm); setShowAddressForm(false); setAddressForm({ label: 'Home', fullName: '', phone: '', city: '', district: '', street: '', building: '', floor: '', apartment: '', landmark: '', isDefault: false }); }} className="px-4 py-2 bg-beige text-dark-teal rounded-lg text-sm font-medium hover:bg-beige-dark">
                      {locale === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                    <button onClick={() => setShowAddressForm(false)} className="px-4 py-2 text-sm text-muted-teal hover:bg-cream rounded-lg">
                      {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}

              {addresses.length === 0 ? (
                <p className="text-sm text-muted-teal text-center py-8 bg-white rounded-xl border border-border-beige">
                  {locale === 'ar' ? 'لا توجد عناوين محفوظة' : 'No saved addresses'}
                </p>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} className={`bg-white rounded-xl border p-4 ${addr.isDefault ? 'border-sage-green' : 'border-border-beige'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-dark-teal">{addr.fullName}</span>
                          {addr.isDefault && <span className="text-[10px] bg-sage-green/10 text-sage-green px-1.5 py-0.5 rounded-full font-medium">{locale === 'ar' ? 'افتراضي' : 'Default'}</span>}
                        </div>
                        <p className="text-xs text-muted-teal">{addr.phone}</p>
                        <p className="text-xs text-muted-teal mt-1">{addr.street}, {addr.building}{addr.floor ? `, Floor ${addr.floor}` : ''}</p>
                        <p className="text-xs text-muted-teal">{addr.city}{addr.district ? `, ${addr.district}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!addr.isDefault && (
                          <button onClick={() => setDefaultAddress(addr.id)} className="text-[10px] text-sage-green hover:underline px-2 py-1">
                            {locale === 'ar' ? 'تعيين افتراضي' : 'Set Default'}
                          </button>
                        )}
                        <button onClick={() => removeAddress(addr.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ====== PAYMENT METHODS ====== */}
          {tab === 'payment' && (
            <div className="space-y-4">
              <h3 className="font-accent font-semibold text-dark-teal">
                {locale === 'ar' ? 'طرق الدفع' : 'Payment Methods'}
              </h3>
              <div className="space-y-3">
                {paymentMethods.map(pm => (
                  <div key={pm.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between ${pm.isDefault ? 'border-sage-green' : 'border-border-beige'}`}>
                    <div className="flex items-center gap-3">
                      <CreditCard size={18} className="text-muted-teal" />
                      <div>
                        <p className="text-sm font-medium text-dark-teal">{pm.label}</p>
                        {pm.isDefault && <span className="text-[10px] bg-sage-green/10 text-sage-green px-1.5 py-0.5 rounded-full">{locale === 'ar' ? 'افتراضي' : 'Default'}</span>}
                      </div>
                    </div>
                    {paymentMethods.length > 1 && (
                      <button onClick={() => removePaymentMethod(pm.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {paymentMethods.length < 2 && (
                  <button
                    onClick={() => addPaymentMethod({
                      type: paymentMethods.some(p => p.type === 'cod') ? 'wish' : 'cod',
                      label: paymentMethods.some(p => p.type === 'cod') ? 'Wish Money' : 'Cash on Delivery',
                      isDefault: paymentMethods.length === 0,
                    })}
                    className="w-full py-3 border border-dashed border-border-beige rounded-xl text-sm text-muted-teal hover:bg-cream hover:border-beige transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={15} /> {locale === 'ar' ? 'إضافة طريقة دفع' : 'Add Payment Method'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ====== MEMBERSHIP ====== */}
          {tab === 'membership' && (
            <div className="space-y-6">
              {/* Current Tier Card */}
              <div className={`bg-gradient-to-r ${tierGradients[membershipTier]} rounded-2xl p-6 border text-center`} style={{ borderColor: `${tierColor}30` }}>
                <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3">
                  <TierIcon size={28} style={{ color: tierColor }} />
                </div>
                <h2 className="font-display text-2xl" style={{ color: tierColor }}>
                  {membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)} Member
                </h2>
                <p className="text-sm text-muted-teal mt-1">{benefits.description}</p>
              </div>

              {/* Progress */}
              {progress.nextTier && (
                <div className="bg-white rounded-xl border border-border-beige p-5">
                  <h4 className="text-sm font-medium text-dark-teal mb-3">
                    {locale === 'ar' ? 'تقدّمك نحو' : 'Progress to'} {progress.nextTier?.charAt(0).toUpperCase()}{progress.nextTier?.slice(1)}
                  </h4>
                  <div className="w-full h-3 bg-cream rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress.percent}%`, backgroundColor: tierColor }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-teal">{formatPrice(progress.current)}</span>
                    <span className="text-muted-teal">{formatPrice(progress.target)}</span>
                  </div>
                  <p className="text-xs text-muted-teal mt-2 text-center">
                    {locale === 'ar' ? 'باقي' : 'Only'} {formatPrice(progress.target - progress.current)} {locale === 'ar' ? 'للوصول إلى' : 'more to reach'} {progress.nextTier?.charAt(0).toUpperCase()}{progress.nextTier?.slice(1)}!
                  </p>
                </div>
              )}

              {/* All Tiers */}
              <div className="bg-white rounded-xl border border-border-beige p-5">
                <h4 className="text-sm font-medium text-dark-teal mb-4">
                  {locale === 'ar' ? 'مستويات العضوية' : 'Membership Tiers'}
                </h4>
                <div className="space-y-4">
                  {(['bronze', 'silver', 'gold'] as MembershipTier[]).map(tier => {
                    const Icon = tierIcons[tier]
                    const b = TIER_BENEFITS[tier]
                    const isCurrent = membershipTier === tier
                    return (
                      <div key={tier} className={`flex items-start gap-3 p-3 rounded-xl ${isCurrent ? 'bg-cream border border-sage-green/30' : ''}`}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${tierColors[tier]}15` }}>
                          <Icon size={18} style={{ color: tierColors[tier] }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm text-dark-teal">{tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
                            {isCurrent && <Check size={13} className="text-sage-green" />}
                            {tier === 'bronze' && <span className="text-[10px] text-muted-teal">(Default)</span>}
                          </div>
                          <p className="text-xs text-muted-teal">{b.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {b.perks.map((p, i) => (
                              <span key={i} className="text-[10px] bg-cream text-muted-teal px-2 py-0.5 rounded-full">{p}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Activity History */}
              {activities.length > 0 && (
                <div className="bg-white rounded-xl border border-border-beige p-5">
                  <h4 className="text-sm font-medium text-dark-teal mb-3">
                    {locale === 'ar' ? 'النشاط' : 'Activity'}
                  </h4>
                  <div className="space-y-2">
                    {activities.slice().reverse().map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-sage-green shrink-0" />
                        <span className="text-muted-teal">{a.details}</span>
                        <span className="text-[10px] text-muted-teal/60 ml-auto">{new Date(a.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Add Child Form Component
function AddChildForm({ locale, onAdd }: { locale: 'en' | 'ar'; onAdd: (child: { name: string; dateOfBirth: string; gender: 'boy' | 'girl' | 'neutral' }) => void }) {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState<'boy' | 'girl' | 'neutral'>('neutral')
  const [error, setError] = useState('')

  const isAr = locale === 'ar'

  const handleSubmit = () => {
    setError('')
    if (!name.trim()) { setError(isAr ? 'اسم الطفل مطلوب' : 'Child name is required'); return }
    if (!dateOfBirth) { setError(isAr ? 'تاريخ الميلاد مطلوب' : 'Date of birth is required'); return }
    onAdd({ name: name.trim(), dateOfBirth, gender })
    setName('')
    setDateOfBirth('')
    setGender('neutral')
    setShow(false)
  }

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-full py-3 border-2 border-dashed border-border-beige rounded-xl text-sm text-dark-teal font-medium hover:bg-cream hover:border-beige transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={15} /> {isAr ? 'إضافة طفل' : 'Add a Child'}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-border-beige p-5">
      <h4 className="text-sm font-medium text-dark-teal mb-3">{isAr ? 'طفل جديد' : 'New Child'}</h4>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={isAr ? 'اسم الطفل' : 'Child name'}
          className="w-full h-10 border border-border-beige rounded-lg px-3 text-sm outline-none focus:border-beige"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-teal mb-1 block">{isAr ? 'تاريخ الميلاد' : 'Date of Birth'}</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={e => setDateOfBirth(e.target.value)}
              className="w-full h-10 border border-border-beige rounded-lg px-3 text-sm outline-none focus:border-beige text-dark-teal"
            />
          </div>
          <div>
            <label className="text-xs text-muted-teal mb-1 block">{isAr ? 'الجنس' : 'Gender'}</label>
            <div className="flex gap-1">
              {(['neutral', 'boy', 'girl'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium border-2 transition-colors ${
                    gender === g
                      ? g === 'boy' ? 'border-blue-300 bg-blue-50 text-blue-600' : g === 'girl' ? 'border-pink-300 bg-pink-50 text-pink-600' : 'border-beige bg-[#FFF8F9] text-dark-teal'
                      : 'border-border-beige text-muted-teal hover:bg-cream'
                  }`}
                >
                  {g === 'neutral' ? (isAr ? 'محايد' : 'Neutral') : g === 'boy' ? (isAr ? 'ولد' : 'Boy') : (isAr ? 'بنت' : 'Girl')}
                </button>
              ))}
            </div>
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="px-4 py-2 bg-beige text-dark-teal rounded-lg text-sm font-medium hover:bg-beige-dark">
            {isAr ? 'إضافة' : 'Add Child'}
          </button>
          <button onClick={() => { setShow(false); setName(''); setDateOfBirth(''); setGender('neutral'); setError(''); }} className="px-4 py-2 text-sm text-muted-teal hover:bg-cream rounded-lg">
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}
