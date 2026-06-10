// Bridges admin store (localStorage) with storefront data.
// When admin assigns images to products via Media module, this makes
// those changes visible on the storefront immediately.

const STORAGE_KEY = 'miniyo-admin-store'

interface AdminProduct {
  id: string
  images?: Array<{
    id: string
    url: string
    alt?: string
    altAr?: string
    isPrimary?: boolean
  }>
  name?: string
  nameAr?: string
  price?: number
  compareAtPrice?: number | null
  stockQuantity?: number
  isActive?: boolean
  isNew?: boolean
  isFeatured?: boolean
  isBestseller?: boolean
  category?: { id: string; name: string; nameAr: string; slug: string; image?: string }
  sku?: string
  slug?: string
  gender?: string
  ageGroup?: string
  material?: string
  description?: string
  descriptionAr?: string
  [key: string]: any
}

export function getAdminProductOverrides(): {
  byId: Map<string, AdminProduct>
  bySlug: Map<string, AdminProduct>
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { byId: new Map(), bySlug: new Map() }
    const state = JSON.parse(raw)
    const products: AdminProduct[] = state.state?.products || state.products || []
    const byId = new Map<string, AdminProduct>()
    const bySlug = new Map<string, AdminProduct>()
    for (const p of products) {
      if (p.id) byId.set(String(p.id), p)
      if (p.slug) bySlug.set(p.slug, p)
    }
    return { byId, bySlug }
  } catch {
    return { byId: new Map(), bySlug: new Map() }
  }
}

// Merge admin-store images into a product from DB/static
export function mergeAdminImages<T extends { id?: string | number; slug?: string; images?: any[] }>(
  product: T
): T {
  const { byId, bySlug } = getAdminProductOverrides()

  // Look up by slug first (most reliable), then by ID
  let adminProduct: AdminProduct | undefined
  if (product.slug) adminProduct = bySlug.get(product.slug)
  if (!adminProduct && product.id) adminProduct = byId.get(String(product.id))
  if (!adminProduct?.images?.length) return product

  // Start with DB images, append admin images that aren't already there
  const existingUrls = new Set((product.images || []).map((i: any) => i.url))
  const mergedImages = [...(product.images || [])]

  for (const adminImg of adminProduct.images) {
    if (!existingUrls.has(adminImg.url)) {
      mergedImages.push(adminImg)
    }
  }

  return { ...product, images: mergedImages }
}

// Apply admin overrides to a list of products
export function applyAdminOverrides<T extends { id?: string | number; slug?: string; images?: any[] }>(
  products: T[]
): T[] {
  return products.map(mergeAdminImages)
}
