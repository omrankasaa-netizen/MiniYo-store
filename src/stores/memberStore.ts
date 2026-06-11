import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MembershipTier = 'bronze' | 'silver' | 'gold'

export interface CustomerAddress {
  id: string
  label: string
  fullName: string
  phone: string
  city: string
  district: string
  street: string
  building: string
  floor: string
  apartment: string
  landmark: string
  isDefault: boolean
}

export interface CustomerPaymentMethod {
  id: string
  type: 'cod' | 'wish'
  label: string
  isDefault: boolean
}

export interface CustomerOrder {
  orderNumber: string
  date: string
  status: string
  subtotal: number
  discount: number
  shipping: number
  total: number
  items: { name: string; qty: number; price: number }[]
}

export interface Child {
  id: string
  name: string
  dateOfBirth: string
  gender: 'boy' | 'girl' | 'neutral'
}

export interface MemberCustomer {
  id: string
  name: string
  email: string
  phone: string | null
  dateOfBirth: string | null
  membershipTier: MembershipTier
  totalOrders: number
  totalSpent: number
  freeShippingUsed: number
  freeShippingMonth: string
  firstOrderDiscountUsed: boolean
  birthdayOfferUsed: string | null
  registeredAt: string
  referralCode: string
  referralCount: number
  referredBy: string | null
}

export interface ProductReview {
  id: string
  productId: string
  customerName: string
  customerId: string
  rating: number
  title: string
  body: string
  verified: boolean
  helpful: number
  createdAt: string
}

export interface MembershipBenefit {
  discount: number
  discountLabel: string
  freeShippingPerMonth: number
  description: string
  perks: string[]
}

const TIER_BENEFITS: Record<MembershipTier, MembershipBenefit> = {
  bronze: {
    discount: 0,
    discountLabel: 'Welcome 10% on first order',
    freeShippingPerMonth: 1,
    description: 'Welcome to the Miniyo Family',
    perks: [
      '10% off your first order',
      '1 free shipping welcome gift',
      'Birthday surprise',
    ],
  },
  silver: {
    discount: 0.05,
    discountLabel: '5% Member Discount',
    freeShippingPerMonth: 2,
    description: '5% off every order + 2 free monthly deliveries',
    perks: [
      '5% discount on every order',
      '2 free shipping under $50/month',
      'Early access to sales',
      'Priority WhatsApp support',
    ],
  },
  gold: {
    discount: 0.10,
    discountLabel: '10% Member Discount',
    freeShippingPerMonth: 5,
    description: '10% off every order + 5 free monthly deliveries',
    perks: [
      '10% discount on every order',
      '5 free shipping under $50/month',
      'Early access to new arrivals',
      'VIP WhatsApp support',
      'Exclusive member-only offers',
    ],
  },
}

const TIER_THRESHOLDS: Record<MembershipTier, number> = {
  bronze: 0,
  silver: 500,
  gold: 1000,
}

export const tierColors: Record<MembershipTier, string> = {
  bronze: '#CD7F32',
  silver: '#A8A8A8',
  gold: '#D4A843',
}

interface MemberStore {
  customer: MemberCustomer | null
  isAuthenticated: boolean
  children: Child[]
  addresses: CustomerAddress[]
  paymentMethods: CustomerPaymentMethod[]
  orders: CustomerOrder[]
  activities: { action: string; details: string; amount?: number; date: string }[]
  reviews: ProductReview[]
  cartAbandonedAt: string | null

  register: (data: { name: string; email: string; phone?: string; dateOfBirth?: string; password: string; referralCode?: string }) => boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  updateProfile: (updates: Partial<MemberCustomer>) => void
  syncProfile: (user: { name: string | null; email: string | null; phone: string | null }) => void

  addAddress: (address: Omit<CustomerAddress, 'id'>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void

  addPaymentMethod: (method: Omit<CustomerPaymentMethod, 'id'>) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void

  addChild: (child: Omit<Child, 'id'>) => void
  removeChild: (id: string) => void
  updateChild: (id: string, updates: Partial<Child>) => void
  getChildAge: (dateOfBirth: string) => number
  getAgeGroup: (ageInMonths: number) => string

  isBirthday: () => boolean
  claimBirthdayOffer: () => boolean
  getBirthdayOfferStatus: () => { isBirthday: boolean; claimed: boolean; canClaim: boolean }

  getProductRecommendations: (products: any[]) => any[]

  getBenefits: () => MembershipBenefit
  getTierProgress: () => { current: number; target: number; tier: MembershipTier; nextTier: MembershipTier | null; percent: number }
  checkTierUpgrade: () => void

  calculateDiscount: (subtotal: number) => { discount: number; reason: string }
  calculateShipping: (subtotal: number) => { fee: number | null; reason: string }
  canUseFreeShipping: () => boolean
  recordOrder: (order: { subtotal: number; discount: number; shipping: number; total: number; items: CustomerOrder['items'] }) => void
  resetMonthlyCounters: () => void

  getOrders: () => CustomerOrder[]

  requestPasswordReset: (email: string) => { success: boolean; code: string } | null
  resetPassword: (email: string, code: string, newCode: string, newPassword: string) => boolean

  getReferralCode: () => string
  getReferralUrl: () => string
  applyReferral: (code: string) => boolean

  addReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => void
  getProductReviews: (productId: string) => ProductReview[]
  getAverageRating: (productId: string) => number
  markHelpful: (reviewId: string) => void

  markCartAbandoned: () => void
  recoverCart: () => void
  dismissAbandonedCart: () => void
}

function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function upgradeTier(current: MembershipTier, totalSpent: number): MembershipTier {
  if (totalSpent >= TIER_THRESHOLDS.gold) return 'gold'
  if (totalSpent >= TIER_THRESHOLDS.silver) return 'silver'
  return current
}

function generateReferralCode(name: string): string {
  const prefix = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'MINI'
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}${num}`
}

function getPasswordStore(): Record<string, string> {
  try {
    const raw = localStorage.getItem('miniyo-passwords')
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {}
}
function setPasswordStore(store: Record<string, string>) {
  localStorage.setItem('miniyo-passwords', JSON.stringify(store))
}

const _resetCodes: Record<string, string> = {}
const _referralRewards: Record<string, number> = {}

function clearCartStore() {
  try {
    localStorage.removeItem('miniyo-cart')
  } catch { /* ignore */ }
}

// FIX: Also clear wishlist on logout to prevent data leaking between sessions.
function clearWishlistStore() {
  try {
    localStorage.removeItem('miniyo-wishlist')
  } catch { /* ignore */ }
}

export const useMemberStore = create<MemberStore>()(
  persist(
    (set, get) => ({
      customer: null,
      isAuthenticated: false,
      children: [],
      addresses: [],
      paymentMethods: [],
      orders: [],
      activities: [],
      reviews: [],
      cartAbandonedAt: null,

      register: (data) => {
        // FIX: Check localStorage for existing email, not just in-memory customer.
        // The old check only compared against the currently loaded customer object,
        // so a second person could register with the same email on the same browser
        // after the first user had logged out.
        const pwStore = getPasswordStore()
        if (pwStore[data.email]) return false
        try {
          const raw = localStorage.getItem('miniyo-member')
          if (raw) {
            const parsed = JSON.parse(raw)
            const state = parsed.state || parsed
            if (state.customer?.email === data.email) return false
          }
        } catch { /* ignore */ }

        let referralBonus = 0
        const allStores = Object.keys(localStorage)
          .filter(k => k.startsWith('miniyo-member'))
          .map(k => {
            try { return JSON.parse(localStorage.getItem(k)!) } catch { return null }
          })
          .filter(Boolean)

        for (const store of allStores) {
          const state = store.state || store
          if (state.customer?.referralCode === data.referralCode) {
            _referralRewards[state.customer.email] = (_referralRewards[state.customer.email] || 0) + 5
            referralBonus = 5
            break
          }
        }

        const id = `member-${Date.now()}`
        const customer: MemberCustomer = {
          id,
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          dateOfBirth: data.dateOfBirth || null,
          membershipTier: 'bronze',
          totalOrders: 0,
          totalSpent: 0,
          freeShippingUsed: 0,
          freeShippingMonth: getCurrentMonth(),
          firstOrderDiscountUsed: false,
          birthdayOfferUsed: null,
          registeredAt: new Date().toISOString(),
          referralCode: generateReferralCode(data.name),
          referralCount: 0,
          referredBy: data.referralCode || null,
        }

        pwStore[data.email] = data.password
        setPasswordStore(pwStore)

        const activities: { action: string; details: string; amount?: number; date: string }[] = [{
          action: 'register',
          details: 'Welcome to Miniyo! You are now a Bronze member.',
          date: new Date().toISOString(),
        }]
        if (referralBonus > 0) {
          activities.push({
            action: 'referral_bonus',
            details: `You received $${referralBonus} referral credit from code ${data.referralCode}!`,
            amount: referralBonus,
            date: new Date().toISOString(),
          })
        }

        set({
          customer,
          isAuthenticated: true,
          addresses: [],
          paymentMethods: [{
            id: 'pm-default-cod',
            type: 'cod',
            label: 'Cash on Delivery',
            isDefault: true,
          }],
          orders: [],
          activities,
          cartAbandonedAt: null,
        })
        return true
      },

      login: (email, password) => {
        const store = get()
        const pwStore = getPasswordStore()
        if (store.customer && store.customer.email === email && pwStore[email] === password) {
          set({ isAuthenticated: true })
          return true
        }
        try {
          const raw = localStorage.getItem('miniyo-member')
          if (raw) {
            const parsed = JSON.parse(raw)
            const state = parsed.state || parsed
            if (state.customer?.email === email && pwStore[email] === password) {
              set({
                customer: state.customer,
                isAuthenticated: true,
                addresses: state.addresses || [],
                paymentMethods: state.paymentMethods || [{ id: 'pm-default-cod', type: 'cod', label: 'Cash on Delivery', isDefault: true }],
                orders: state.orders || [],
                activities: state.activities || [],
                reviews: state.reviews || [],
              })
              return true
            }
          }
        } catch { /* ignore */ }
        return false
      },

      logout: () => {
        clearCartStore()
        clearWishlistStore()
        set({
          customer: null,
          isAuthenticated: false,
          children: [],
          addresses: [],
          paymentMethods: [],
          orders: [],
          activities: [],
          reviews: [],
          cartAbandonedAt: null,
        })
        localStorage.removeItem('miniyo-member')
      },

      updateProfile: (updates) => {
        const customer = get().customer
        if (!customer) return
        set({ customer: { ...customer, ...updates } })
      },

      syncProfile: (user) => {
        if (!user.email) return
        const existing = get().customer

        if (existing && existing.email === user.email) {
          set({
            customer: {
              ...existing,
              name: user.name || existing.name,
              phone: user.phone || existing.phone,
            },
            isAuthenticated: true,
          })
        } else {
          set({
            customer: {
              id: `member-${Date.now()}`,
              name: user.name || 'Member',
              email: user.email,
              phone: user.phone || null,
              dateOfBirth: null,
              membershipTier: 'bronze',
              totalOrders: 0,
              totalSpent: 0,
              freeShippingUsed: 0,
              freeShippingMonth: getCurrentMonth(),
              firstOrderDiscountUsed: false,
              birthdayOfferUsed: null,
              registeredAt: new Date().toISOString(),
              referralCode: generateReferralCode(user.name || 'Member'),
              referralCount: 0,
              referredBy: null,
            },
            isAuthenticated: true,
          })
        }
      },

      addAddress: (address) => {
        const newAddress: CustomerAddress = { ...address, id: `addr-${Date.now()}` }
        const addresses = get().addresses
        if (addresses.length === 0 || newAddress.isDefault) {
          set({ addresses: [...addresses.map(a => ({ ...a, isDefault: false })), newAddress] })
        } else {
          set({ addresses: [...addresses, newAddress] })
        }
      },

      removeAddress: (id) => {
        set({ addresses: get().addresses.filter(a => a.id !== id) })
      },

      setDefaultAddress: (id) => {
        set({ addresses: get().addresses.map(a => ({ ...a, isDefault: a.id === id })) })
      },

      addPaymentMethod: (method) => {
        const newMethod: CustomerPaymentMethod = { ...method, id: `pm-${Date.now()}` }
        const methods = get().paymentMethods
        if (newMethod.isDefault) {
          set({ paymentMethods: [...methods.map(m => ({ ...m, isDefault: false })), newMethod] })
        } else {
          set({ paymentMethods: [...methods, newMethod] })
        }
      },

      removePaymentMethod: (id) => {
        set({ paymentMethods: get().paymentMethods.filter(m => m.id !== id) })
      },

      setDefaultPaymentMethod: (id) => {
        set({ paymentMethods: get().paymentMethods.map(m => ({ ...m, isDefault: m.id === id })) })
      },

      getBenefits: () => {
        const tier = get().customer?.membershipTier || 'bronze'
        return TIER_BENEFITS[tier]
      },

      getTierProgress: () => {
        const customer = get().customer
        const totalSpent = customer?.totalSpent || 0
        const currentTier = customer?.membershipTier || 'bronze'
        if (currentTier === 'gold') {
          return { current: totalSpent, target: totalSpent, tier: 'gold' as const, nextTier: null, percent: 100 }
        }
        if (currentTier === 'silver') {
          const target = TIER_THRESHOLDS.gold
          return { current: totalSpent, target, tier: 'silver' as const, nextTier: 'gold' as const, percent: Math.min(100, (totalSpent / target) * 100) }
        }
        const target = TIER_THRESHOLDS.silver
        return { current: totalSpent, target, tier: 'bronze' as const, nextTier: 'silver' as const, percent: Math.min(100, (totalSpent / target) * 100) }
      },

      checkTierUpgrade: () => {
        const customer = get().customer
        if (!customer) return
        const newTier = upgradeTier(customer.membershipTier, customer.totalSpent)
        if (newTier !== customer.membershipTier) {
          set({
            customer: { ...customer, membershipTier: newTier },
            activities: [...get().activities, {
              action: 'upgrade',
              details: `Upgraded from ${customer.membershipTier} to ${newTier}!`,
              date: new Date().toISOString(),
            }],
          })
        }
      },

      calculateDiscount: (subtotal) => {
        const state = get()
        if (!state.customer || !state.isAuthenticated) return { discount: 0, reason: '' }
        const customer = state.customer
        const benefits = TIER_BENEFITS[customer.membershipTier]
        if (!customer.firstOrderDiscountUsed && customer.totalOrders === 0) {
          return { discount: subtotal * 0.10, reason: 'Welcome Offer (10%)' }
        }
        if (benefits.discount > 0) {
          return { discount: subtotal * benefits.discount, reason: benefits.discountLabel }
        }
        return { discount: 0, reason: '' }
      },

      calculateShipping: (subtotal) => {
        if (subtotal >= 50) return { fee: 0, reason: 'Free shipping (over $50)' }
        const state = get()
        if (!state.customer || !state.isAuthenticated) return { fee: null, reason: '' }
        const customer = state.customer
        const currentMonth = getCurrentMonth()
        if (customer.freeShippingMonth !== currentMonth) {
          set({ customer: { ...customer, freeShippingUsed: 0, freeShippingMonth: currentMonth } })
        }
        const benefits = TIER_BENEFITS[customer.membershipTier]
        if (customer.freeShippingUsed < benefits.freeShippingPerMonth) {
          return { fee: 0, reason: `${customer.membershipTier.charAt(0).toUpperCase() + customer.membershipTier.slice(1)} Member Free Shipping` }
        }
        return { fee: null, reason: '' }
      },

      canUseFreeShipping: () => {
        const state = get()
        if (!state.customer || !state.isAuthenticated) return false
        const benefits = TIER_BENEFITS[state.customer.membershipTier]
        return state.customer.freeShippingUsed < benefits.freeShippingPerMonth
      },

      recordOrder: (order) => {
        const customer = get().customer
        if (!customer) return
        const newOrder: CustomerOrder = {
          orderNumber: `MIN-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`,
          date: new Date().toLocaleDateString(),
          status: 'pending_confirmation',
          ...order,
        }
        const isFirstOrder = !customer.firstOrderDiscountUsed && customer.totalOrders === 0
        const newTier = upgradeTier(customer.membershipTier, customer.totalSpent + order.subtotal)
        set({
          customer: {
            ...customer,
            totalOrders: customer.totalOrders + 1,
            totalSpent: customer.totalSpent + order.total,
            firstOrderDiscountUsed: isFirstOrder ? true : customer.firstOrderDiscountUsed,
            freeShippingUsed: order.shipping === 0 && order.subtotal < 50 ? customer.freeShippingUsed + 1 : customer.freeShippingUsed,
            membershipTier: newTier,
          },
          orders: [newOrder, ...get().orders],
          activities: [
            ...get().activities,
            { action: 'order_placed', details: `Order ${newOrder.orderNumber} — $${order.total.toFixed(2)}`, amount: order.total, date: new Date().toISOString() },
            ...(newTier !== customer.membershipTier ? [{ action: 'upgrade', details: `Upgraded to ${newTier} member!`, date: new Date().toISOString() }] : []),
          ],
          cartAbandonedAt: null,
        })
      },

      resetMonthlyCounters: () => {
        const customer = get().customer
        if (!customer) return
        const currentMonth = getCurrentMonth()
        if (customer.freeShippingMonth !== currentMonth) {
          set({ customer: { ...customer, freeShippingUsed: 0, freeShippingMonth: currentMonth } })
        }
      },

      getOrders: () => get().orders,

      requestPasswordReset: (email) => {
        const customer = get().customer
        if (!customer || customer.email !== email) return null
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        _resetCodes[email] = code
        return { success: true, code }
      },

      resetPassword: (email, code, _newCode, newPassword) => {
        if (_resetCodes[email] !== code) return false
        const pwStore = getPasswordStore()
        pwStore[email] = newPassword
        setPasswordStore(pwStore)
        delete _resetCodes[email]
        return true
      },

      getReferralCode: () => {
        return get().customer?.referralCode || ''
      },

      getReferralUrl: () => {
        const code = get().customer?.referralCode || ''
        return `${window.location.origin}/#/register?ref=${code}`
      },

      applyReferral: (code) => {
        if (!code) return false
        set(state => ({
          customer: state.customer ? {
            ...state.customer,
            referredBy: code,
          } : null,
        }))
        return true
      },

      addReview: (review) => {
        const newReview: ProductReview = {
          ...review,
          id: `rev-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ reviews: [...get().reviews, newReview] })
      },

      getProductReviews: (productId) => {
        return get().reviews.filter(r => r.productId === productId)
      },

      getAverageRating: (productId) => {
        const productReviews = get().reviews.filter(r => r.productId === productId)
        if (productReviews.length === 0) return 0
        return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      },

      markHelpful: (reviewId) => {
        set({
          reviews: get().reviews.map(r =>
            r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
          ),
        })
      },

      markCartAbandoned: () => {
        set({ cartAbandonedAt: new Date().toISOString() })
      },

      recoverCart: () => {
        set({ cartAbandonedAt: null })
      },

      dismissAbandonedCart: () => {
        set({ cartAbandonedAt: null })
      },

      addChild: (child) => {
        const newChild: Child = { ...child, id: `child-${Date.now()}` }
        set({ children: [...get().children, newChild] })
      },

      removeChild: (id) => {
        set({ children: get().children.filter(c => c.id !== id) })
      },

      updateChild: (id, updates) => {
        set({ children: get().children.map(c => c.id === id ? { ...c, ...updates } : c) })
      },

      getChildAge: (dateOfBirth) => {
        const birth = new Date(dateOfBirth)
        const now = new Date()
        const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
        return Math.max(0, months)
      },

      getAgeGroup: (ageInMonths) => {
        if (ageInMonths < 3) return '0-3M'
        if (ageInMonths < 6) return '3-6M'
        if (ageInMonths < 12) return '6-12M'
        if (ageInMonths < 18) return '12-18M'
        if (ageInMonths < 24) return '18-24M'
        if (ageInMonths < 36) return '2-3Y'
        if (ageInMonths < 48) return '3-4Y'
        return '4Y+'
      },

      isBirthday: () => {
        const customer = get().customer
        if (!customer?.dateOfBirth) return false
        const dob = new Date(customer.dateOfBirth)
        const today = new Date()
        return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth()
      },

      claimBirthdayOffer: () => {
        const customer = get().customer
        if (!customer) return false
        const thisMonth = getCurrentMonth()
        if (customer.birthdayOfferUsed === thisMonth) return false
        set({
          customer: { ...customer, birthdayOfferUsed: thisMonth },
          activities: [...get().activities, {
            action: 'birthday',
            details: `Birthday offer claimed! Free delivery on your birthday month.`,
            date: new Date().toISOString(),
          }],
        })
        return true
      },

      getBirthdayOfferStatus: () => {
        const customer = get().customer
        const isBday = get().isBirthday()
        const thisMonth = getCurrentMonth()
        const claimed = customer?.birthdayOfferUsed === thisMonth
        return { isBirthday: isBday, claimed, canClaim: isBday && !claimed }
      },

      getProductRecommendations: (products) => {
        const children = get().children
        if (children.length === 0) return []
        const getAge = get().getChildAge
        const getGroup = get().getAgeGroup
        const childAgeGroups = children.map(c => getGroup(getAge(c.dateOfBirth)))
        const genderPrefs = children.map(c => c.gender)
        return products.filter((p: any) => {
          const productAge = p.ageGroup || ''
          const productGender = p.gender || 'unisex'
          const ageMatch = childAgeGroups.some(ag => productAge.includes(ag) || productAge === '0-12M' || ag === '0-3M')
          const genderMatch = productGender === 'unisex' || genderPrefs.some(g => g === 'neutral' || productGender === g)
          return ageMatch && genderMatch && p.stockQuantity > 0
        }).slice(0, 6)
      },
    }),
    {
      name: 'miniyo-member',
      partialize: (state) => ({
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
        children: state.children,
        addresses: state.addresses,
        paymentMethods: state.paymentMethods,
        orders: state.orders,
        activities: state.activities,
        reviews: state.reviews,
      }),
    }
  )
)

export { TIER_BENEFITS, TIER_THRESHOLDS, upgradeTier, getCurrentMonth }
