// storefrontSync.ts
// ============================================================
// Single source of truth for storefront -> admin data flow.
//
// Problem: Zustand persist uses in-memory caching. When the
// storefront writes directly to localStorage, the admin panel's
// in-memory state becomes stale and overwrites on next persist.
//
// Solution: A dedicated sync layer that BOTH sides read from.
// Key: 'miniyo-sync' (separate from zustand's 'miniyo-admin-store')
//
// Stock:
//   - Static products define initial stock (allProducts)
//   - Sync layer tracks per-product overrides (delta from initial)
//   - Effective stock = initialStock + syncOverride
//
// Orders:
//   - Storefront appends to sync.orders[]
//   - Admin panel imports them on mount, then clears
//
// ============================================================

import type { Product } from '@/types'
import { allProducts } from './data'

const SYNC_KEY = 'miniyo-sync'

export interface SyncOrder {
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
  paymentMethod: 'cod' | 'wish'
  paymentStatus: string
  orderStatus: string
  whatsappConfirmed: boolean
  items: { productId: string; productName: string; quantity: number; price: number; sku: string; size?: string | null }[]
  shippingAddress: Record<string, string>
  internalNotes: string
  customerNotes: string
  createdAt: string
  updatedAt: string
}

interface SyncState {
  // Stock overrides: productId -> delta (negative = sold)
  stockOverrides: Record<string, number>
  // Pending orders from storefront
  orders: SyncOrder[]
  // Inventory movements log
  movements: {
    id: string
    productId: string
    productName: string
    type: string
    quantity: number
    previousStock: number
    newStock: number
    note: string
    createdBy: string
    createdAt: string
  }[]
  // Last sync timestamp
  lastSync: string
}

const DEFAULT_SYNC: SyncState = {
  stockOverrides: {},
  orders: [],
  movements: [],
  lastSync: new Date().toISOString(),
}

function readSync(): SyncState {
  try {
    const raw = localStorage.getItem(SYNC_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { ...DEFAULT_SYNC }
}

function writeSync(state: SyncState) {
  localStorage.setItem(SYNC_KEY, JSON.stringify(state))
}

// ---- Stock API ----

/**
 * Read the current admin product stock from localStorage.
 * This is the single source of truth after admin imports.
 */
function getAdminProductStock(productId: string): number | null {
  try {
    const raw = localStorage.getItem('miniyo-admin-store')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const state = parsed.state || parsed
    const products = state.products || []
    const product = products.find((p: any) => String(p.id) === String(productId) || p.sku === productId)
    if (product && typeof product.stockQuantity === 'number') {
      return product.stockQuantity
    }
  } catch { /* ignore */ }
  return null
}

/**
 * Get the current effective stock for a product.
 * Reads admin store stock first (post-import), falls back to static data + sync overrides.
 */
export function getEffectiveStock(productId: string): number {
  // First: check admin store for the most up-to-date stock
  const adminStock = getAdminProductStock(productId)
  if (adminStock !== null) {
    // Admin stock is the base, apply any NEW sync overrides on top
    const sync = readSync()
    const override = sync.stockOverrides[productId] || 0
    return Math.max(0, adminStock + override)
  }
  // Fallback: static data + sync overrides (first-time, before any admin import)
  const initial = allProducts.find(p => String(p.id) === String(productId))?.stockQuantity ?? 0
  const sync = readSync()
  const override = sync.stockOverrides[productId] || 0
  return Math.max(0, initial + override)
}

/**
 * Check if a quantity can be added to cart for a product.
 * Returns the max allowed quantity (0 if none).
 */
export function checkStock(productId: string, requestedQty: number, inCartQty: number): { allowed: number; available: number } {
  const available = getEffectiveStock(productId)
  const maxAllowed = Math.max(0, available - inCartQty)
  return {
    allowed: Math.min(requestedQty, maxAllowed),
    available: maxAllowed,
  }
}

/**
 * Decrement stock for a product (called during checkout).
 */
export function decrementStock(productId: string, quantity: number, orderNumber: string, productName: string): boolean {
  const sync = readSync()
  const prevOverride = sync.stockOverrides[productId] || 0
  const prevStock = getEffectiveStock(productId)

  if (prevStock < quantity) return false // Not enough stock

  sync.stockOverrides[productId] = prevOverride - quantity

  sync.movements.push({
    id: `mov-${Date.now()}-${productId}`,
    productId,
    productName,
    type: 'sale',
    quantity: -quantity,
    previousStock: prevStock,
    newStock: prevStock - quantity,
    note: `Order ${orderNumber}`,
    createdBy: 'System',
    createdAt: new Date().toISOString(),
  })

  sync.lastSync = new Date().toISOString()
  writeSync(sync)
  return true
}

/**
 * Get all stock overrides (for admin import).
 */
export function getStockOverrides(): Record<string, number> {
  return { ...readSync().stockOverrides }
}

/**
 * Get all pending movements (for admin import).
 */
export function getPendingMovements() {
  return [...readSync().movements]
}

/**
 * Clear processed stock changes.
 */
export function clearStockChanges() {
  const sync = readSync()
  sync.stockOverrides = {}
  sync.movements = []
  writeSync(sync)
}

// ---- Orders API ----

/**
 * Submit an order from the storefront.
 * Appends to sync.orders[] so admin can import.
 */
export function submitOrder(order: SyncOrder) {
  const sync = readSync()

  // Decrement stock for each item
  for (const item of order.items) {
    decrementStock(item.productId, item.quantity, order.orderNumber, item.productName)
  }

  sync.orders.push(order)
  sync.lastSync = new Date().toISOString()
  writeSync(sync)
}

/**
 * Get all pending orders (for admin import).
 */
export function getPendingOrders(): SyncOrder[] {
  return [...readSync().orders]
}

/**
 * Clear imported orders.
 */
export function clearPendingOrders() {
  const sync = readSync()
  sync.orders = []
  writeSync(sync)
}

// ---- Admin Import ----

/**
 * Import all pending data into admin state.
 * Call this from admin panel on mount.
 * Returns: { ordersImported, stockProductsUpdated }
 */
export function importPendingData(): { ordersImported: number; stockProductsUpdated: number } {
  const sync = readSync()

  // Read the current admin store from zustand's persisted state
  let adminState: any = null
  try {
    const raw = localStorage.getItem('miniyo-admin-store')
    if (raw) {
      const parsed = JSON.parse(raw)
      adminState = parsed.state || parsed
    }
  } catch { /* ignore */ }

  if (!adminState) {
    return { ordersImported: 0, stockProductsUpdated: 0 }
  }

  let ordersImported = 0
  let stockProductsUpdated = 0

  // Apply stock overrides
  for (const [productId, delta] of Object.entries(sync.stockOverrides)) {
    const products = adminState.products || []
    const idx = products.findIndex((p: any) => String(p.id) === String(productId))
    if (idx >= 0) {
      const prevStock = products[idx].stockQuantity || 0
      products[idx] = { ...products[idx], stockQuantity: Math.max(0, prevStock + (delta as number)) }
      stockProductsUpdated++
    }
  }

  // Merge movements
  if (sync.movements.length > 0) {
    adminState.movements = [...(adminState.movements || []), ...sync.movements]
  }

  // Append orders
  if (sync.orders.length > 0) {
    const existingOrderIds = new Set((adminState.orders || []).map((o: any) => o.id))
    const newOrders = sync.orders.filter(o => !existingOrderIds.has(o.id))
    adminState.orders = [...(adminState.orders || []), ...newOrders]
    ordersImported = newOrders.length
  }

  if (ordersImported > 0 || stockProductsUpdated > 0) {
    adminState.pendingChanges = true
    // Write back in zustand persist format
    localStorage.setItem('miniyo-admin-store', JSON.stringify({ state: adminState, version: 0 }))

    // Clear sync after successful import
    sync.stockOverrides = {}
    sync.movements = []
    sync.orders = []
    sync.lastSync = new Date().toISOString()
    writeSync(sync)

    // Dispatch event so any live admin panel rehydrates
    window.dispatchEvent(new StorageEvent('storage', { key: 'miniyo-admin-store' }))
  }

  return { ordersImported, stockProductsUpdated }
}

// ---- Product enrichment ----

/**
 * Apply sync stock overrides to a product list.
 * Call this in useProducts/useProductBySlug before returning data.
 */
export function applySyncOverrides(products: Product[]): Product[] {
  const sync = readSync()
  if (Object.keys(sync.stockOverrides).length === 0) return products

  return products.map(p => {
    const override = sync.stockOverrides[p.id]
    if (override === undefined) return p
    const newStock = Math.max(0, (p.stockQuantity || 0) + override)
    return { ...p, stockQuantity: newStock }
  })
}
