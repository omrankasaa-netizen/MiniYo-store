/**
 * Data hooks — ALL data comes from the real tRPC backend.
 * No more fake adminStore reads.
 */
import { useState, useEffect, useCallback } from 'react'
import { trpc } from '@/lib/trpc'

// ─── Generic fetch state ───────────────────────────────────────────────────
function useTrpc<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result as T)
    } catch (e: any) {
      setError(e?.message || 'Request failed')
    } finally {
      setIsLoading(false)
    }
  }, deps)

  useEffect(() => { load() }, [load])

  return { data, isLoading, error, refetch: load }
}

// ─── Products (storefront) ─────────────────────────────────────────────────
export function useProducts(filters?: {
  category?: string
  search?: string
  isNew?: boolean
  isBestseller?: boolean
  sale?: boolean
  gender?: string
  sort?: string
}) {
  return useTrpc(
    () => trpc.products.list.query(filters || {}),
    [JSON.stringify(filters)]
  )
}

export function useProductBySlug(slug: string) {
  return useTrpc(
    () => trpc.products.getBySlug.query({ slug }),
    [slug]
  )
}

// ─── Categories ───────────────────────────────────────────────────────────
export function useCategories() {
  return useTrpc(() => trpc.categories.list.query(), [])
}

// ─── Orders (admin) ───────────────────────────────────────────────────────
export function useOrders(filters?: { status?: string; search?: string }) {
  return useTrpc(
    () => trpc.orders.list.query(filters || {}),
    [JSON.stringify(filters)]
  )
}

// ─── Customers (admin) ────────────────────────────────────────────────────
export function useCustomers(search?: string) {
  return useTrpc(
    () => trpc.customers.list.query(search ? { search } : undefined),
    [search]
  )
}

// ─── CMS sections ─────────────────────────────────────────────────────────
export function useCmsSections() {
  return useTrpc(() => trpc.cms.list.query(), [])
}

// ─── Site settings ────────────────────────────────────────────────────────
export function useSettings() {
  return useTrpc(() => trpc.siteSettings.get.query(), [])
}

// ─── Dashboard stats ──────────────────────────────────────────────────────
export function useStats() {
  return useTrpc(() => trpc.stats.summary.query(), [])
}

// ─── Promo codes ──────────────────────────────────────────────────────────
export function usePromoCodes() {
  return useTrpc(() => trpc.promos.list.query(), [])
}

// ─── Media ────────────────────────────────────────────────────────────────
export function useMedia(type?: string) {
  return useTrpc(
    () => trpc.media.list.query(type ? { type } : undefined),
    [type]
  )
}

// ─── Audit logs ───────────────────────────────────────────────────────────
export function useAuditLogs() {
  return useTrpc(() => trpc.audit.list.query(), [])
}

// ─── Inventory movements ──────────────────────────────────────────────────
export function useInventory(productId?: number) {
  return useTrpc(
    () => trpc.inventory.list.query(productId ? { productId } : undefined),
    [productId]
  )
}

// ─── FAQs ─────────────────────────────────────────────────────────────────
export function useFaqs() {
  return useTrpc(() => trpc.faqs.list.query(), [])
}

// ─── Admin products (with mutations) ─────────────────────────────────────
export function useAdminProducts() {
  const list = useTrpc(() => trpc.products.list.query({}), [])

  const createProduct = useCallback(async (data: any) => {
    const result = await trpc.products.create.mutate(data)
    list.refetch()
    return result
  }, [list.refetch])

  const updateProduct = useCallback(async (id: number, data: any) => {
    const result = await trpc.products.update.mutate({ id, data })
    list.refetch()
    return result
  }, [list.refetch])

  const deleteProduct = useCallback(async (id: number) => {
    await trpc.products.delete.mutate({ id })
    list.refetch()
  }, [list.refetch])

  return { ...list, createProduct, updateProduct, deleteProduct }
}

// ─── Admin orders (with mutations) ────────────────────────────────────────
export function useAdminOrders(filters?: { status?: string; search?: string }) {
  const list = useTrpc(
    () => trpc.orders.list.query(filters || {}),
    [JSON.stringify(filters)]
  )

  const updateStatus = useCallback(async (id: number, updates: {
    orderStatus?: string
    paymentStatus?: string
    whatsappConfirmed?: boolean
    internalNotes?: string
  }) => {
    await trpc.orders.updateStatus.mutate({ id, ...updates } as any)
    list.refetch()
  }, [list.refetch])

  return { ...list, updateStatus }
}

// ─── Admin customers (with mutations) ─────────────────────────────────────
export function useAdminCustomers(search?: string) {
  const list = useTrpc(
    () => trpc.customers.list.query(search ? { search } : undefined),
    [search]
  )

  const updateCustomer = useCallback(async (id: number, data: any) => {
    await trpc.customers.update.mutate({ id, data })
    list.refetch()
  }, [list.refetch])

  return { ...list, updateCustomer }
}

// ─── Admin promo codes (with mutations) ───────────────────────────────────
export function useAdminPromos() {
  const list = useTrpc(() => trpc.promos.list.query(), [])

  const createPromo = useCallback(async (data: any) => {
    await trpc.promos.create.mutate(data)
    list.refetch()
  }, [list.refetch])

  const deletePromo = useCallback(async (id: number) => {
    await trpc.promos.delete.mutate({ id })
    list.refetch()
  }, [list.refetch])

  return { ...list, createPromo, deletePromo }
}

// ─── Admin CMS (with mutations) ────────────────────────────────────────────
export function useAdminCms() {
  const list = useTrpc(() => trpc.cms.list.query(), [])

  const upsertSection = useCallback(async (data: any) => {
    await trpc.cms.upsert.mutate(data)
    list.refetch()
  }, [list.refetch])

  const deleteSection = useCallback(async (key: string) => {
    await trpc.cms.delete.mutate({ key })
    list.refetch()
  }, [list.refetch])

  return { sections: list.data ?? [], isLoading: list.isLoading, upsertSection, deleteSection, refetch: list.refetch }
}

// ─── Admin settings (with mutations) ──────────────────────────────────────
export function useAdminSettings() {
  const { data: settingsMap, isLoading, refetch } = useTrpc(
    () => trpc.siteSettings.get.query(),
    []
  )

  const dbSettings = settingsMap
    ? Object.entries(settingsMap).map(([key, value]) => ({ key, value: String(value) }))
    : []

  const setSetting = useCallback(async (key: string, value: string) => {
    await trpc.siteSettings.set.mutate({ key, value })
    refetch()
  }, [refetch])

  const setBulk = useCallback(async (entries: { key: string; value: string }[]) => {
    await trpc.siteSettings.setBulk.mutate(entries)
    refetch()
  }, [refetch])

  return { dbSettings, isLoading, setSetting, setBulk, refetch }
}

// ─── Admin media (with mutations) ─────────────────────────────────────────
export function useAdminMedia() {
  const list = useTrpc(() => trpc.media.list.query(), [])

  const createMedia = useCallback(async (data: any) => {
    await trpc.media.create.mutate(data)
    list.refetch()
  }, [list.refetch])

  const deleteMedia = useCallback(async (id: number) => {
    await trpc.media.delete.mutate({ id })
    list.refetch()
  }, [list.refetch])

  return { ...list, createMedia, deleteMedia }
}

// ─── Inventory mutations ───────────────────────────────────────────────────
export function useAdminInventory(productId?: number) {
  const list = useInventory(productId)

  const addMovement = useCallback(async (data: {
    productId: number
    movementType: string
    quantity: number
    reason?: string
    reference?: string
  }) => {
    await trpc.inventory.create.mutate(data as any)
    list.refetch()
  }, [list.refetch])

  return { ...list, addMovement }
}

// ─── FAQs with mutations ──────────────────────────────────────────────────
export function useAdminFaqs() {
  const list = useTrpc(() => trpc.faqs.list.query(), [])

  const createFaq = useCallback(async (data: any) => {
    await trpc.faqs.create.mutate(data)
    list.refetch()
  }, [list.refetch])

  const updateFaq = useCallback(async (id: number, data: any) => {
    await trpc.faqs.update.mutate({ id, data })
    list.refetch()
  }, [list.refetch])

  const deleteFaq = useCallback(async (id: number) => {
    await trpc.faqs.delete.mutate({ id })
    list.refetch()
  }, [list.refetch])

  return { ...list, createFaq, updateFaq, deleteFaq }
}

// ─── Wishlist ─────────────────────────────────────────────────────────────
export function useWishlist(sessionId: string) {
  const list = useTrpc(
    () => trpc.wishlist.get.query({ sessionId }),
    [sessionId]
  )

  const addToWishlist = useCallback(async (productId: number) => {
    await trpc.wishlist.add.mutate({ sessionId, productId })
    list.refetch()
  }, [sessionId, list.refetch])

  const removeFromWishlist = useCallback(async (productId: number) => {
    await trpc.wishlist.remove.mutate({ sessionId, productId })
    list.refetch()
  }, [sessionId, list.refetch])

  return { ...list, addToWishlist, removeFromWishlist }
}
