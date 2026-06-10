import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'
import { allProducts } from '@/lib/data'
import { importPendingData } from '@/lib/storefrontSync'

// --- Types ---
export interface Order {
  id: string
  orderNumber: string
  customerName: string
  email: string
  phone: string
  subtotal: number
  discount: number
  discountReason: string
  deliveryFee: number
  grandTotal: number
  paymentMethod: 'cod' | 'wish' | 'card'
  paymentStatus: 'pending' | 'verified' | 'failed' | 'refunded'
  orderStatus: 'draft' | 'pending_confirmation' | 'payment_pending_whish' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded'
  whatsappConfirmed: boolean
  items: { productId: string; productName: string; quantity: number; price: number; sku: string; size?: string | null }[]
  shippingAddress: {
    fullName: string
    phone: string
    city: string
    district: string
    street: string
    building: string
    floor?: string
    apartment?: string
    landmark?: string
    notes?: string
  }
  internalNotes: string
  customerNotes: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  type: 'registered' | 'guest'
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  notes: string
  tags: string[]
  addresses: { label: string; city: string; district: string; street: string; building: string }[]
}

export interface InventoryMovement {
  id: string
  productId: string
  productName: string
  type: 'restock' | 'adjustment' | 'reserve' | 'release' | 'sale' | 'return'
  quantity: number
  previousStock: number
  newStock: number
  note: string
  createdBy: string
  createdAt: string
}

export interface MediaAsset {
  id: string
  type: 'product' | 'logo' | 'hero' | 'brand_kit' | 'sticker' | 'cms'
  url: string
  name: string
  assignedTo?: string
  altEn?: string
  altAr?: string
  uploadedAt: string
}

export interface CmsSection {
  id: string
  key: string
  title: string
  titleAr: string
  body: string
  bodyAr: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
}

export interface AuditLog {
  id: string
  action: string
  entity: string
  entityId: string
  details: string
  user: string
  createdAt: string
}

interface AdminStore {
  // Products
  products: Product[]
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>) => void

  // Orders
  orders: Order[]
  updateOrderStatus: (id: string, status: Order['orderStatus']) => void
  updateOrderPayment: (id: string, status: Order['paymentStatus']) => void
  toggleWhatsAppConfirmed: (id: string) => void
  addOrderNote: (id: string, note: string) => void
  deleteOrder: (id: string) => void
  restoreOrderStock: (orderId: string) => void

  // Customers
  customers: Customer[]
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  // Inventory
  movements: InventoryMovement[]
  addMovement: (m: Omit<InventoryMovement, 'id' | 'createdAt'>) => void

  // Media
  media: MediaAsset[]
  addMedia: (asset: MediaAsset) => void
  deleteMedia: (id: string) => void
  assignMediaToProduct: (mediaId: string, productId: string) => void

  // CMS
  cmsSections: CmsSection[]
  updateCmsSection: (id: string, updates: Partial<CmsSection>) => void

  // Audit
  auditLogs: AuditLog[]
  addAuditLog: (action: string, entity: string, entityId: string, details: string) => void

  // Settings
  settings: {
    storeName: string
    phone: string
    whatsapp: string
    email: string
    facebook: string
    instagram: string
    currency: string
    codEnabled: boolean
    wishEnabled: boolean
    freeShippingThreshold: number
    standardDeliveryFee: number
    expressDeliveryFee: number
    announcementText: string
    announcementTextAr: string
    heroTitle: string
    heroTitleAr: string
    heroSubtitle: string
    heroSubtitleAr: string
    heroImageUrl: string
    logoImageUrl: string
    footerImageUrl: string
  }
  updateSettings: (s: Partial<AdminStore['settings']>) => void
  setHeroImage: (url: string) => void
  setLogoImage: (url: string) => void
  setFooterImage: (url: string) => void

  // Publishing
  publishedAt: string | null
  pendingChanges: boolean
  publishChanges: () => void
  markPending: () => void

  // Storefront sync
  importPending: () => { ordersImported: number; stockProductsUpdated: number }
}

const initialOrders: Order[] = [
  { id: 'ord-001', orderNumber: 'MIN-250615-001', customerName: 'Sarah M.', email: 'sarah@email.com', phone: '+961 70 123 456', subtotal: 58, discount: 0, discountReason: '', deliveryFee: 3, grandTotal: 61, paymentMethod: 'cod', paymentStatus: 'pending', orderStatus: 'pending_confirmation', whatsappConfirmed: false, items: [{ productId: '1', productName: 'Basic Bodysuit', quantity: 2, price: 18, sku: 'basic-bodysuit' }, { productId: '2', productName: 'Cozy Romper', quantity: 1, price: 22, sku: 'cozy-romper' }], shippingAddress: { fullName: 'Sarah M.', phone: '+961 70 123 456', city: 'Beirut', district: 'Hamra', street: 'Hamra Main St', building: '15', floor: '3', apartment: '7B' }, internalNotes: '', customerNotes: '', createdAt: '2025-06-15T10:30:00Z', updatedAt: '2025-06-15T10:30:00Z' },
  { id: 'ord-002', orderNumber: 'MIN-250615-002', customerName: 'Layla H.', email: 'layla@email.com', phone: '+961 71 234 567', subtotal: 32, discount: 0, discountReason: '', deliveryFee: 0, grandTotal: 32, paymentMethod: 'wish', paymentStatus: 'pending', orderStatus: 'payment_pending_whish', whatsappConfirmed: false, items: [{ productId: '5', productName: 'Gift Set - Newborn', quantity: 1, price: 32, sku: 'gift-set-newborn' }], shippingAddress: { fullName: 'Layla H.', phone: '+961 71 234 567', city: 'Tripoli', district: 'Mina', street: 'Haddad St', building: '42' }, internalNotes: 'GIFT ORDER | Price hidden on packing slip', customerNotes: 'Please gift wrap', createdAt: '2025-06-15T14:20:00Z', updatedAt: '2025-06-15T14:20:00Z' },
  { id: 'ord-003', orderNumber: 'MIN-250616-003', customerName: 'Karim S.', email: 'karim@email.com', phone: '+961 76 345 678', subtotal: 124, discount: 5.8, discountReason: 'Silver Member (5%)', deliveryFee: 3, grandTotal: 121.2, paymentMethod: 'cod', paymentStatus: 'pending', orderStatus: 'confirmed', whatsappConfirmed: true, items: [{ productId: '3', productName: 'Summer Dress', quantity: 2, price: 28, sku: 'summer-dress' }, { productId: '4', productName: 'Dino Tee', quantity: 1, price: 16, sku: 'dino-tee' }, { productId: '8', productName: 'Winter Cardigan', quantity: 2, price: 26, sku: 'winter-cardigan' }], shippingAddress: { fullName: 'Karim S.', phone: '+961 76 345 678', city: 'Beirut', district: 'Achrafieh', street: 'Sursock St', building: '8' }, internalNotes: 'Repeat customer - VIP | WhatsApp updates: YES (+961 81 38 59 40) | Promo: WELCOME15', customerNotes: '', createdAt: '2025-06-16T09:15:00Z', updatedAt: '2025-06-16T09:15:00Z' },
  { id: 'ord-004', orderNumber: 'MIN-250616-004', customerName: 'Nadia K.', email: 'nadia@email.com', phone: '+961 03 456 789', subtotal: 18, discount: 0, discountReason: '', deliveryFee: 3, grandTotal: 21, paymentMethod: 'cod', paymentStatus: 'pending', orderStatus: 'out_for_delivery', whatsappConfirmed: true, items: [{ productId: '1', productName: 'Basic Bodysuit', quantity: 1, price: 18, sku: 'basic-bodysuit' }], shippingAddress: { fullName: 'Nadia K.', phone: '+961 03 456 789', city: 'Jounieh', district: 'Kaslik', street: 'Marina St', building: '21' }, internalNotes: '', customerNotes: '', createdAt: '2025-06-16T11:00:00Z', updatedAt: '2025-06-16T11:00:00Z' },
  { id: 'ord-005', orderNumber: 'MIN-250616-005', customerName: 'Mohammad A.', email: 'mohammad@email.com', phone: '+961 81 567 890', subtotal: 76, discount: 0, discountReason: '', deliveryFee: 3, grandTotal: 79, paymentMethod: 'wish', paymentStatus: 'verified', orderStatus: 'packed', whatsappConfirmed: true, items: [{ productId: '2', productName: 'Cozy Romper', quantity: 2, price: 22, sku: 'cozy-romper' }, { productId: '7', productName: 'Starlight Pajamas', quantity: 1, price: 32, sku: 'starlight-pajamas' }], shippingAddress: { fullName: 'Mohammad A.', phone: '+961 81 567 890', city: 'Beirut', district: 'Verdun', street: 'Verdun St', building: '55' }, internalNotes: '', customerNotes: '', createdAt: '2025-06-16T16:45:00Z', updatedAt: '2025-06-16T16:45:00Z' },
  { id: 'ord-006', orderNumber: 'MIN-250617-006', customerName: 'Fatima R.', email: 'fatima@email.com', phone: '+961 70 987 654', subtotal: 45, discount: 0, discountReason: '', deliveryFee: 0, grandTotal: 45, paymentMethod: 'cod', paymentStatus: 'pending', orderStatus: 'pending_confirmation', whatsappConfirmed: false, items: [{ productId: '6', productName: 'Rain Jacket', quantity: 1, price: 32, sku: 'rain-jacket' }, { productId: '10', productName: 'Hair Accessories', quantity: 1, price: 13, sku: 'hair-accessories' }], shippingAddress: { fullName: 'Fatima R.', phone: '+961 70 987 654', city: 'Sidon', district: 'Old City', street: 'Old Street', building: '12' }, internalNotes: '', customerNotes: 'Call before delivery', createdAt: '2025-06-17T08:30:00Z', updatedAt: '2025-06-17T08:30:00Z' },
]

const initialCustomers: Customer[] = [
  { id: 'c1', name: 'Sarah M.', email: 'sarah@email.com', phone: '+961 70 123 456', type: 'registered', totalOrders: 3, totalSpent: 156, lastOrderDate: '2025-06-15', notes: '', tags: ['repeat'], addresses: [{ label: 'Home', city: 'Beirut', district: 'Hamra', street: 'Hamra Main St', building: '15' }] },
  { id: 'c2', name: 'Layla H.', email: 'layla@email.com', phone: '+961 71 234 567', type: 'registered', totalOrders: 2, totalSpent: 89, lastOrderDate: '2025-06-15', notes: '', tags: [], addresses: [{ label: 'Home', city: 'Tripoli', district: 'Mina', street: 'Haddad St', building: '42' }] },
  { id: 'c3', name: 'Karim S.', email: 'karim@email.com', phone: '+961 76 345 678', type: 'registered', totalOrders: 5, totalSpent: 312, lastOrderDate: '2025-06-16', notes: 'VIP customer', tags: ['vip', 'repeat'], addresses: [{ label: 'Home', city: 'Beirut', district: 'Achrafieh', street: 'Sursock St', building: '8' }] },
  { id: 'c4', name: 'Nadia K.', email: 'nadia@email.com', phone: '+961 03 456 789', type: 'guest', totalOrders: 1, totalSpent: 21, lastOrderDate: '2025-06-16', notes: '', tags: [], addresses: [{ label: 'Home', city: 'Jounieh', district: 'Kaslik', street: 'Marina St', building: '21' }] },
  { id: 'c5', name: 'Mohammad A.', email: 'mohammad@email.com', phone: '+961 81 567 890', type: 'registered', totalOrders: 4, totalSpent: 245, lastOrderDate: '2025-06-16', notes: '', tags: ['repeat'], addresses: [{ label: 'Home', city: 'Beirut', district: 'Verdun', street: 'Verdun St', building: '55' }] },
  { id: 'c6', name: 'Fatima R.', email: 'fatima@email.com', phone: '+961 70 987 654', type: 'guest', totalOrders: 1, totalSpent: 45, lastOrderDate: '2025-06-17', notes: 'Called about delivery time', tags: [], addresses: [{ label: 'Home', city: 'Sidon', district: 'Old City', street: 'Old Street', building: '12' }] },
]

const initialCmsSections: CmsSection[] = [
  { id: 'cms-1', key: 'announcement', title: 'Announcement Bar', titleAr: 'شريط الإعلان', body: 'Cash on Delivery & Wish Money accepted | Free delivery on orders over $50 | WhatsApp: +961 81 38 59 40', bodyAr: 'الدفع عند الاستلام وWish Money مقبولين | توصيل مجاني للطلبات فوق 50 دولار | واتساب: +961 81 38 59 40', isActive: true, sortOrder: 1 },
  { id: 'cms-2', key: 'hero', title: 'Hero Section', titleAr: 'القسم الرئيسي', body: 'Soft & Beautiful, Just Like Them', bodyAr: 'ناعمة وجميلة، مثلهم بالضبط', isActive: true, sortOrder: 2 },
  { id: 'cms-3', key: 'categories', title: 'Featured Categories', titleAr: 'الفئات المميزة', body: 'Browse by Category', bodyAr: 'تصفحي حسب الفئة', isActive: true, sortOrder: 3 },
  { id: 'cms-4', key: 'featured', title: 'Featured Products', titleAr: 'المنتجات المميزة', body: 'Handpicked for your little ones', bodyAr: 'اختيرت خصيصاً لأطفالك', isActive: true, sortOrder: 4 },
  { id: 'cms-5', key: 'gift', title: 'Gift Block', titleAr: 'قسم الهدايا', body: "A Gift They'll Truly Treasure", bodyAr: 'هدية بتحفر بقلبهم', isActive: true, sortOrder: 5 },
  { id: 'cms-6', key: 'story', title: 'Brand Story', titleAr: 'قصة العلامة', body: 'Made with Love, Delivered with Care', bodyAr: 'مصنوعة بحب، موصلة بعناية', isActive: true, sortOrder: 6 },
  { id: 'cms-7', key: 'testimonials', title: 'Testimonials', titleAr: 'آراء العملاء', body: 'From Lebanese Families', bodyAr: 'من عائلات لبنانية', isActive: true, sortOrder: 7 },
  { id: 'cms-8', key: 'footer', title: 'Footer', titleAr: 'التذييل', body: 'Miniyo Footer', bodyAr: 'تذييل مينيو', isActive: true, sortOrder: 8 },
]

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      products: JSON.parse(JSON.stringify(allProducts)),
      orders: initialOrders,
      customers: initialCustomers,
      movements: [],
      media: [],
      cmsSections: initialCmsSections,
      auditLogs: [],
      settings: {
        storeName: 'Miniyo',
        phone: '+961 81 38 59 40',
        whatsapp: '+961 81 38 59 40',
        email: 'miniyo.store.lb@gmail.com',
        facebook: 'Miniyo.store.lb',
        instagram: 'Miniyo.store.lb',
        currency: 'USD',
        codEnabled: true,
        wishEnabled: true,
        freeShippingThreshold: 50,
        standardDeliveryFee: 3,
        expressDeliveryFee: 5,
        announcementText: 'Cash on Delivery & Wish Money accepted | Free delivery on orders over $50 | WhatsApp: +961 81 38 59 40',
        announcementTextAr: 'الدفع عند الاستلام وWish Money مقبولين | توصيل مجاني للطلبات فوق 50 دولار | واتساب: +961 81 38 59 40',
        heroTitle: 'Soft & Beautiful, Just Like Them',
        heroTitleAr: 'ناعمة وجميلة، مثلهم بالضبط',
        heroSubtitle: 'Handpicked baby essentials and little gifts, made with care for Lebanese families. Delivered across Lebanon with love.',
        heroSubtitleAr: 'مستلزمات أطفال وهدايا صغيرة مختارة بعناية للعائلات اللبنانية. نوصلها لكل لبنان بحب.',
        heroImageUrl: '/images/hero.jpg',
        logoImageUrl: '/images/logo.png',
        footerImageUrl: '/images/footer-brand.png',
      },
      publishedAt: null,
      pendingChanges: false,

      updateProduct: (id, updates) => set(state => {
        // Match by id (string or number) or by slug
        const idx = state.products.findIndex(p => String(p.id) === String(id) || (updates.slug && p.slug === updates.slug))
        if (idx === -1) {
          // If product not found, try to find by matching fields
          const slugMatch = state.products.findIndex(p => p.slug && String(p.slug) === String(id))
          if (slugMatch === -1) return state
          const updated = [...state.products]
          updated[slugMatch] = { ...updated[slugMatch], ...updates }
          return { products: updated, pendingChanges: true }
        }
        const updated = [...state.products]
        updated[idx] = { ...updated[idx], ...updates }
        return {
          products: updated,
          pendingChanges: true,
          auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'UPDATE', entity: 'Product', entityId: String(id), details: `Updated ${Object.keys(updates).join(', ')}`, user: 'Omran', createdAt: new Date().toISOString() }]
        }
      }),

      deleteProduct: (id) => set(state => {
        const sid = String(id)
        return {
          products: state.products.filter(p => String(p.id) !== sid && p.slug !== sid),
          pendingChanges: true,
          auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'DELETE', entity: 'Product', entityId: sid, details: 'Product deleted', user: 'Omran', createdAt: new Date().toISOString() }]
        }
      }),

      bulkUpdateProducts: (ids, updates) => set(state => {
        const idSet = new Set(ids.map(String))
        return {
          products: state.products.map(p => (idSet.has(String(p.id)) || idSet.has(p.slug || '')) ? { ...p, ...updates } : p),
          pendingChanges: true,
          auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'BULK_UPDATE', entity: 'Product', entityId: ids.join(','), details: `Bulk ${Object.keys(updates).join(', ')}`, user: 'Omran', createdAt: new Date().toISOString() }]
        }
      }),

      updateOrderStatus: (id, status) => set(state => {
        const order = state.orders.find(o => o.id === id)
        const newOrders = state.orders.map(o => o.id === id ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o)
        const newAuditLogs = [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'STATUS_CHANGE', entity: 'Order', entityId: id, details: `Status → ${status}`, user: 'Omran', createdAt: new Date().toISOString() }]

        // Auto-restore stock when order is cancelled
        if (status === 'cancelled' && order && order.orderStatus !== 'cancelled') {
          const restoredProducts = [...state.products]
          const newMovements = [...state.movements]
          for (const item of order.items) {
            const idx = restoredProducts.findIndex(p => String(p.id) === String(item.productId) || p.sku === item.sku)
            if (idx >= 0) {
              const prevStock = restoredProducts[idx].stockQuantity
              const newStock = prevStock + item.quantity
              restoredProducts[idx] = { ...restoredProducts[idx], stockQuantity: newStock }
              newMovements.push({
                id: `mov-${Date.now()}-${item.productId}`,
                productId: item.productId,
                productName: item.productName,
                type: 'return',
                quantity: item.quantity,
                previousStock: prevStock,
                newStock,
                note: `Stock restored from cancelled order ${order.orderNumber}`,
                createdBy: 'System',
                createdAt: new Date().toISOString(),
              })
              newAuditLogs.push({
                id: `audit-${Date.now()}-${item.productId}`,
                action: 'STOCK_RESTORE',
                entity: 'Inventory',
                entityId: String(item.productId),
                details: `Restored ${item.quantity} units from cancelled order ${order.orderNumber}`,
                user: 'System',
                createdAt: new Date().toISOString(),
              })
            }
          }
          return { orders: newOrders, products: restoredProducts, movements: newMovements, pendingChanges: true, auditLogs: newAuditLogs }
        }

        return { orders: newOrders, pendingChanges: true, auditLogs: newAuditLogs }
      }),

      updateOrderPayment: (id, status) => set(state => ({
        orders: state.orders.map(o => o.id === id ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() } : o),
        pendingChanges: true,
        auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'PAYMENT_CHANGE', entity: 'Order', entityId: id, details: `Payment → ${status}`, user: 'Omran', createdAt: new Date().toISOString() }]
      })),

      toggleWhatsAppConfirmed: (id) => set(state => ({
        orders: state.orders.map(o => o.id === id ? { ...o, whatsappConfirmed: !o.whatsappConfirmed, updatedAt: new Date().toISOString() } : o),
        pendingChanges: true,
        auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'WHATSAPP_TOGGLE', entity: 'Order', entityId: id, details: 'WhatsApp confirmation toggled', user: 'Omran', createdAt: new Date().toISOString() }]
      })),

      addOrderNote: (id, note) => set(state => ({
        orders: state.orders.map(o => o.id === id ? { ...o, internalNotes: note, updatedAt: new Date().toISOString() } : o),
        pendingChanges: true,
      })),

      deleteOrder: (id) => set(state => {
        const order = state.orders.find(o => o.id === id)
        return {
          orders: state.orders.filter(o => o.id !== id),
          pendingChanges: true,
          auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'DELETE', entity: 'Order', entityId: id, details: `Deleted order ${order?.orderNumber || id}`, user: 'Omran', createdAt: new Date().toISOString() }],
        }
      }),

      restoreOrderStock: (orderId) => set(state => {
        const order = state.orders.find(o => o.id === orderId)
        if (!order || order.orderStatus !== 'cancelled') return state

        const restoredProducts = [...state.products]
        const newMovements = [...state.movements]
        const newAuditLogs = [...state.auditLogs]

        for (const item of order.items) {
          const idx = restoredProducts.findIndex(p => String(p.id) === String(item.productId) || p.sku === item.sku)
          if (idx >= 0) {
            const prevStock = restoredProducts[idx].stockQuantity
            const newStock = prevStock + item.quantity
            restoredProducts[idx] = { ...restoredProducts[idx], stockQuantity: newStock }
            newMovements.push({
              id: `mov-${Date.now()}-${item.productId}`,
              productId: item.productId,
              productName: item.productName,
              type: 'return',
              quantity: item.quantity,
              previousStock: prevStock,
              newStock,
              note: `Manual stock restore from cancelled order ${order.orderNumber}`,
              createdBy: 'Omran',
              createdAt: new Date().toISOString(),
            })
            newAuditLogs.push({
              id: `audit-${Date.now()}-${item.productId}`,
              action: 'STOCK_RESTORE',
              entity: 'Inventory',
              entityId: String(item.productId),
              details: `Manually restored ${item.quantity} units from cancelled order ${order.orderNumber}`,
              user: 'Omran',
              createdAt: new Date().toISOString(),
            })
          }
        }
        return { products: restoredProducts, movements: newMovements, pendingChanges: true, auditLogs: newAuditLogs }
      }),

      deleteCustomer: (id) => set(state => ({
        customers: state.customers.filter(c => c.id !== id),
        pendingChanges: true,
        auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'DELETE', entity: 'Customer', entityId: id, details: 'Customer deleted', user: 'Omran', createdAt: new Date().toISOString() }],
      })),

      updateCustomer: (id, updates) => set(state => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c),
        pendingChanges: true,
      })),

      addMovement: (m) => set(state => {
        const idx = state.products.findIndex(p => String(p.id) === String(m.productId) || p.slug === m.productId)
        const newProducts = [...state.products]
        if (idx >= 0) {
          newProducts[idx] = { ...newProducts[idx], stockQuantity: m.newStock }
        }
        return {
          products: newProducts,
          movements: [...state.movements, { ...m, id: `mov-${Date.now()}`, createdAt: new Date().toISOString() }],
          pendingChanges: true,
          auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'STOCK_CHANGE', entity: 'Inventory', entityId: String(m.productId), details: `${m.type}: ${m.quantity}`, user: m.createdBy, createdAt: new Date().toISOString() }]
        }
      }),

      addMedia: (asset) => set(state => ({
        media: [...state.media, asset],
        pendingChanges: true,
      })),
      deleteMedia: (id) => set(state => ({
        media: state.media.filter(m => m.id !== id),
        pendingChanges: true,
      })),

      assignMediaToProduct: (mediaId, productId) => set(state => {
        const mediaItem = state.media.find(m => m.id === mediaId)
        if (!mediaItem) return state
        const pid = String(productId)
        const updatedProducts = state.products.map(p => {
          if (String(p.id) === pid || p.slug === pid) {
            return {
              ...p,
              images: [...(p.images || []), { id: `img-${Date.now()}`, url: mediaItem.url, alt: mediaItem.name, altAr: mediaItem.altAr || mediaItem.name, isPrimary: !(p.images || []).length }]
            }
          }
          return p
        })
        return {
          products: updatedProducts,
          media: state.media.map(m => m.id === mediaId ? { ...m, assignedTo: pid } : m),
          pendingChanges: true,
          auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'ASSIGN', entity: 'Media', entityId: mediaId, details: `Assigned to product ${pid}`, user: 'Omran', createdAt: new Date().toISOString() }]
        }
      }),

      updateCmsSection: (id, updates) => set(state => ({
        cmsSections: state.cmsSections.map(s => s.id === id ? { ...s, ...updates } : s),
        pendingChanges: true,
      })),

      addAuditLog: (action, entity, entityId, details) => set(state => ({
        auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action, entity, entityId, details, user: 'Omran', createdAt: new Date().toISOString() }]
      })),

      updateSettings: (s) => set(state => ({
        settings: { ...state.settings, ...s },
        pendingChanges: true,
      })),

      setHeroImage: (url) => set(state => ({
        settings: { ...state.settings, heroImageUrl: url },
        pendingChanges: true,
        auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'SET_HERO', entity: 'Media', entityId: 'hero', details: `Hero image updated`, user: 'Omran', createdAt: new Date().toISOString() }]
      })),

      setLogoImage: (url) => set(state => ({
        settings: { ...state.settings, logoImageUrl: url },
        pendingChanges: true,
        auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'SET_LOGO', entity: 'Media', entityId: 'logo', details: `Logo image updated`, user: 'Omran', createdAt: new Date().toISOString() }]
      })),

      setFooterImage: (url) => set(state => ({
        settings: { ...state.settings, footerImageUrl: url },
        pendingChanges: true,
        auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'SET_FOOTER', entity: 'Media', entityId: 'footer', details: `Footer image updated`, user: 'Omran', createdAt: new Date().toISOString() }]
      })),

      publishChanges: () => set(state => {
        const now = new Date().toISOString()
        return {
          publishedAt: now,
          pendingChanges: false,
          auditLogs: [...state.auditLogs, { id: `audit-${Date.now()}`, action: 'PUBLISH', entity: 'Store', entityId: 'all', details: `Published ${state.pendingChanges ? 'pending' : 'all'} changes at ${now}`, user: 'Omran', createdAt: now }]
        }
      }),

      markPending: () => set({ pendingChanges: true }),

      importPending: () => {
        const result = importPendingData()
        // After importing, refresh our own state from localStorage
        if (result.ordersImported > 0 || result.stockProductsUpdated > 0) {
          try {
            const raw = localStorage.getItem('miniyo-admin-store')
            if (raw) {
              const parsed = JSON.parse(raw)
              const state = parsed.state || parsed
              set({
                products: state.products || [],
                orders: state.orders || [],
                movements: state.movements || [],
                pendingChanges: true,
              })
            }
          } catch { /* ignore */ }
        }
        return result
      },
    }),
    {
      name: 'miniyo-admin-store',
      partialize: (state) => ({
        products: state.products,
        media: state.media,
        cmsSections: state.cmsSections,
        settings: state.settings,
        auditLogs: state.auditLogs,
        publishedAt: state.publishedAt,
        pendingChanges: state.pendingChanges,
        movements: state.movements,
        orders: state.orders,
        customers: state.customers,
      }),
    }
  )
)

// --- Public API for storefront ---
// This is what the storefront uses. It reads from the admin store's state,
// so any changes made in admin are immediately visible after publish.
export const storefrontAPI = {
  getProducts(): Product[] {
    return useAdminStore.getState().products
  },

  getCategories() {
    const { products } = useAdminStore.getState()
    // Derive unique categories from products
    const catMap = new Map()
    products.forEach(p => {
      if (p.category && !catMap.has(p.category.id)) {
        catMap.set(p.category.id, p.category)
      }
    })
    return Array.from(catMap.values())
  },

  getProduct(handle: string): Product | null {
    return useAdminStore.getState().products.find(p => p.slug === handle) || null
  },

  getNewArrivals(): Product[] {
    return useAdminStore.getState().products.filter(p => p.isNew)
  },

  getBestSellers(): Product[] {
    return useAdminStore.getState().products.filter(p => p.isBestseller)
  },

  getFeatured(): Product[] {
    return useAdminStore.getState().products.filter(p => p.isFeatured)
  },

  getWishlistProducts(ids: string[]): Product[] {
    return useAdminStore.getState().products.filter(p => ids.includes(p.id))
  },

  getCmsSection(key: string): CmsSection | undefined {
    return useAdminStore.getState().cmsSections.find(s => s.key === key && s.isActive)
  },

  getAllCmsSections(): CmsSection[] {
    return useAdminStore.getState().cmsSections.filter(s => s.isActive)
  },

  getSettings() {
    return useAdminStore.getState().settings
  },

  getMedia(type?: MediaAsset['type']): MediaAsset[] {
    const media = useAdminStore.getState().media
    return type ? media.filter(m => m.type === type) : media
  },
}
