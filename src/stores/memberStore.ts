import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storePassword, verifyPassword } from '@/lib/passwordUtils'

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
      'VIP early access',
      'Birthday gift credit',
      'Priority support',
    ],
  },
}

function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function generateReferralCode(name: string) {
  const base = name.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase() || 'MINI'
  return `${base}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

type MemberStore = {
  isAuthenticated: boolean
  customer: MemberCustomer | null
  children: Child[]
  addresses: CustomerAddress[]
  paymentMethods: CustomerPaymentMethod[]
  orders: CustomerOrder[]
  reviews: ProductReview[]
  register: (payload: {
    name: string
    email: string
    password: string
    phone?: string
    dateOfBirth?: string
    referredBy?: string
  }) => { ok: boolean; message?: string }
  login: (email: string, password: string) => { ok: boolean; message?: string }
  logout: () => void
  updateProfile: (payload: Partial<Pick<MemberCustomer, 'name' | 'phone' | 'dateOfBirth'>>) => void
  addChild: (child: Omit<Child, 'id'>) => void
  removeChild: (id: string) => void
  addAddress: (address: Omit<CustomerAddress, 'id'>) => void
  updateAddress: (id: string, patch: Partial<CustomerAddress>) => void
  removeAddress: (id: string) => void
  addPaymentMethod: (method: Omit<CustomerPaymentMethod, 'id'>) => void
  removePaymentMethod: (id: string) => void
  recordOrder: (order: Omit<CustomerOrder, 'orderNumber' | 'date' | 'status'>) => void
  submitReview: (review: Omit<ProductReview, 'id' | 'createdAt' | 'customerName' | 'customerId' | 'verified' | 'helpful'>) => void
  calculateDiscount: (subtotal: number) => { discount: number; reason: string }
  calculateShipping: (subtotal: number) => { fee: number | null; reason: string }
  getBenefits: () => MembershipBenefit | null
}

export const useMemberStore = create<MemberStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      customer: null,
      children: [],
      addresses: [],
      paymentMethods: [],
      orders: [],
      reviews: [],

      register: ({ name, email, password, phone, dateOfBirth, referredBy }) => {
        const key = `miniyo-member-password:${email.toLowerCase()}`
        const existing = localStorage.getItem(key)
        if (existing) return { ok: false, message: 'An account with this email already exists.' }

        storePassword(email, password)

        const now = new Date().toISOString()
        const customer: MemberCustomer = {
          id: crypto.randomUUID(),
          name,
          email: email.toLowerCase(),
          phone: phone || null,
          dateOfBirth: dateOfBirth || null,
          membershipTier: 'bronze',
          totalOrders: 0,
          totalSpent: 0,
          freeShippingUsed: 0,
          freeShippingMonth: currentMonthKey(),
          firstOrderDiscountUsed: false,
          birthdayOfferUsed: null,
          registeredAt: now,
          referralCode: generateReferralCode(name),
          referralCount: 0,
          referredBy: referredBy || null,
        }

        set({ isAuthenticated: true, customer })
        return { ok: true }
      },

      login: (email, password) => {
        const normalizedEmail = email.toLowerCase()
        const key = `miniyo-member-password:${normalizedEmail}`
        const legacyKey = 'miniyo-passwords'
        const legacyRaw = localStorage.getItem(legacyKey)

        let ok = verifyPassword(normalizedEmail, password)

        if (!ok && legacyRaw) {
          try {
            const legacy = JSON.parse(legacyRaw) as Record<string, string>
            const legacyPassword = legacy[normalizedEmail]
            if (legacyPassword === password) {
              storePassword(normalizedEmail, password)
              delete legacy[normalizedEmail]
              if (Object.keys(legacy).length === 0) localStorage.removeItem(legacyKey)
              else localStorage.setItem(legacyKey, JSON.stringify(legacy))
              ok = true
            }
          } catch {
            // ignore legacy parse errors
          }
        }

        if (!ok) return { ok: false, message: 'Invalid email or password.' }

        const customer = get().customer
        if (!customer || customer.email !== normalizedEmail) {
          const now = new Date().toISOString()
          set({
            isAuthenticated: true,
            customer: {
              id: crypto.randomUUID(),
              name: normalizedEmail.split('@')[0],
              email: normalizedEmail,
              phone: null,
              dateOfBirth: null,
              membershipTier: 'bronze',
              totalOrders: 0,
              totalSpent: 0,
              freeShippingUsed: 0,
              freeShippingMonth: currentMonthKey(),
              firstOrderDiscountUsed: false,
              birthdayOfferUsed: null,
              registeredAt: now,
              referralCode: generateReferralCode(normalizedEmail),
              referralCount: 0,
              referredBy: null,
            },
            children: [],
            addresses: [],
            paymentMethods: [],
            orders: [],
            reviews: [],
          })
        } else {
          set({ isAuthenticated: true })
        }

        return { ok: true }
      },

      logout: () => {
        try {
          localStorage.removeItem('miniyo-member')
          localStorage.removeItem('miniyo-cart')
        } catch {
          // ignore storage cleanup errors
        }
        set({
          isAuthenticated: false,
          customer: null,
          children: [],
          addresses: [],
          paymentMethods: [],
          orders: [],
          reviews: [],
        })
      },

      updateProfile: (payload) => {
        const customer = get().customer
        if (!customer) return
        set({ customer: { ...customer, ...payload } })
      },

      addChild: (child) => set((state) => ({
        children: [...state.children, { ...child, id: crypto.randomUUID() }],
      })),

      removeChild: (id) => set((state) => ({
        children: state.children.filter((child) => child.id !== id),
      })),

      addAddress: (address) => set((state) => ({
        addresses: [...state.addresses, { ...address, id: crypto.randomUUID() }],
      })),

      updateAddress: (id, patch) => set((state) => ({
        addresses: state.addresses.map((address) => (address.id === id ? { ...address, ...patch } : address)),
      })),

      removeAddress: (id) => set((state) => ({
        addresses: state.addresses.filter((address) => address.id !== id),
      })),

      addPaymentMethod: (method) => set((state) => ({
        paymentMethods: [...state.paymentMethods, { ...method, id: crypto.randomUUID() }],
      })),

      removePaymentMethod: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.filter((method) => method.id !== id),
      })),

      recordOrder: (order) => {
        const customer = get().customer
        if (!customer) return

        const nextTotalOrders = customer.totalOrders + 1
        const nextTotalSpent = customer.totalSpent + order.total
        let membershipTier: MembershipTier = customer.membershipTier
        if (nextTotalOrders >= 8 || nextTotalSpent >= 500) membershipTier = 'gold'
        else if (nextTotalOrders >= 3 || nextTotalSpent >= 150) membershipTier = 'silver'

        const updatedCustomer = {
          ...customer,
          totalOrders: nextTotalOrders,
          totalSpent: nextTotalSpent,
          membershipTier,
          firstOrderDiscountUsed: true,
        }

        const recordedOrder: CustomerOrder = {
          orderNumber: `MY-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString(),
          status: 'Processing',
          ...order,
        }

        set((state) => ({
          customer: updatedCustomer,
          orders: [recordedOrder, ...state.orders],
        }))
      },

      submitReview: (review) => {
        const customer = get().customer
        if (!customer) return
        set((state) => ({
          reviews: [
            {
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              customerName: customer.name,
              customerId: customer.id,
              verified: true,
              helpful: 0,
              ...review,
            },
            ...state.reviews,
          ],
        }))
      },

      calculateDiscount: (subtotal) => {
        const state = get()
        const customer = state.customer
        if (!state.isAuthenticated || !customer) return { discount: 0, reason: '' }

        if (!customer.firstOrderDiscountUsed) {
          return { discount: subtotal * 0.1, reason: 'Welcome 10% off first order' }
        }

        if (customer.membershipTier === 'silver') {
          return { discount: subtotal * 0.05, reason: 'Silver member 5% discount' }
        }

        if (customer.membershipTier === 'gold') {
          return { discount: subtotal * 0.1, reason: 'Gold member 10% discount' }
        }

        return { discount: 0, reason: '' }
      },

      calculateShipping: (subtotal) => {
        const state = get()
        const customer = state.customer
        if (!state.isAuthenticated || !customer) return { fee: null, reason: '' }
        if (subtotal >= 50) return { fee: 0, reason: 'Free shipping on orders over $50' }

        const month = currentMonthKey()
        const freeShippingUsed = customer.freeShippingMonth === month ? customer.freeShippingUsed : 0
        const allowed = TIER_BENEFITS[customer.membershipTier].freeShippingPerMonth
        if (freeShippingUsed < allowed) {
          return { fee: 0, reason: `${customer.membershipTier[0].toUpperCase() + customer.membershipTier.slice(1)} member free shipping` }
        }

        return { fee: null, reason: '' }
      },

      getBenefits: () => {
        const state = get()
        if (!state.isAuthenticated || !state.customer) return null
        return TIER_BENEFITS[state.customer.membershipTier]
      },
    }),
    {
      name: 'miniyo-member',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        customer: state.customer,
        children: state.children,
        addresses: state.addresses,
        paymentMethods: state.paymentMethods,
        orders: state.orders,
        reviews: state.reviews,
      }),
    },
  ),
)
