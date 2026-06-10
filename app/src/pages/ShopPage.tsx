import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { SlidersHorizontal, X, Grid3X3, List } from 'lucide-react'
import { useProducts, useCategories } from '@/hooks/useMiniyo'
import { t } from '@/lib/i18n'
import { ProductCard } from '@/components/shared/ProductCard'
import type { Locale } from '@/types'

interface ShopPageProps {
  locale: Locale
}

interface FilterState {
  category: string | null
  gender: string | null
  ageGroup: string | null
  minPrice: number | null
  maxPrice: number | null
  search: string | null
  isNew: boolean
  isBestseller: boolean
  isSale: boolean
}

export function ShopPage({ locale }: ShopPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [, setMobileFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 12

  const filters: FilterState = useMemo(() => ({
    category: searchParams.get('category'),
    gender: searchParams.get('gender'),
    ageGroup: searchParams.get('age'),
    minPrice: searchParams.get('min') ? Number(searchParams.get('min')) : null,
    maxPrice: searchParams.get('max') ? Number(searchParams.get('max')) : null,
    search: searchParams.get('search'),
    isNew: searchParams.get('new') === 'true',
    isBestseller: searchParams.get('bestseller') === 'true',
    isSale: searchParams.get('sale') === 'true',
  }), [searchParams])

  // Fetch from database via tRPC
  const { data: categories = [] } = useCategories()
  const { data: products = [] } = useProducts({
    category: filters.category || undefined,
    gender: filters.gender || undefined,
    search: filters.search || undefined,
    isNew: filters.isNew || undefined,
    isBestseller: filters.isBestseller || undefined,
    sale: filters.isSale || undefined,
    sort: sortBy,
  })

  const totalPages = Math.ceil(products.length / perPage)
  const paginated = products.slice((page - 1) * perPage, page * perPage)

  const activeFilters = useMemo(() => {
    const list: { key: string; label: string; remove: () => void }[] = []
    if (filters.category) {
      const cat = categories.find(c => c.slug === filters.category)
      list.push({ key: 'cat', label: cat?.name || '', remove: () => { const s = new URLSearchParams(searchParams); s.delete('category'); setSearchParams(s) } })
    }
    if (filters.gender) list.push({ key: 'gen', label: filters.gender, remove: () => { const s = new URLSearchParams(searchParams); s.delete('gender'); setSearchParams(s) } })
    if (filters.isNew) list.push({ key: 'new', label: 'New', remove: () => { const s = new URLSearchParams(searchParams); s.delete('new'); setSearchParams(s) } })
    if (filters.isBestseller) list.push({ key: 'best', label: 'Bestseller', remove: () => { const s = new URLSearchParams(searchParams); s.delete('bestseller'); setSearchParams(s) } })
    if (filters.isSale) list.push({ key: 'sale', label: 'On Sale', remove: () => { const s = new URLSearchParams(searchParams); s.delete('sale'); setSearchParams(s) } })
    if (filters.search) list.push({ key: 'srch', label: `Search: ${filters.search}`, remove: () => { const s = new URLSearchParams(searchParams); s.delete('search'); setSearchParams(s) } })
    return list
  }, [filters, categories, searchParams, setSearchParams])

  const updateFilter = (key: string, value: string | null) => {
    const s = new URLSearchParams(searchParams)
    if (value) s.set(key, value)
    else s.delete(key)
    setSearchParams(s)
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-dark-teal py-16 text-center">
        <div className="max-w-[1400px] mx-auto px-4">
          <nav className="text-cream/60 text-sm mb-4">
            <Link to="/" className="hover:text-cream">{t('home', locale)}</Link>
            <span className="mx-2">/</span>
            <span className="text-cream/80">{t('shop', locale)}</span>
          </nav>
          <h1 className="font-display text-4xl lg:text-5xl text-cream mb-2">
            {filters.search ? `${t('search', locale)}: "${filters.search}"` : t('allProducts', locale)}
          </h1>
          <p className="text-cream/70">{t('showing', locale) || 'Showing'} {products.length} {locale === 'ar' ? 'منتج' : 'products'}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[72px] z-40 bg-white border-b border-border-beige">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-border-beige rounded-full px-4 py-2 text-sm font-accent font-medium text-dark-teal hover:bg-cream transition-colors"
            >
              <SlidersHorizontal size={16} /> {t('filter', locale) || 'Filters'}
            </button>
            {/* Category Pills */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => updateFilter('category', null)}
                className={`px-4 py-2 rounded-full text-sm font-accent font-medium border transition-colors ${
                  !filters.category ? 'bg-beige border-beige text-dark-teal' : 'border-border-beige text-dark-teal hover:bg-cream'
                }`}
              >
                {t('allProducts', locale)}
              </button>
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-accent font-medium border transition-colors whitespace-nowrap ${
                    filters.category === cat.slug ? 'bg-beige border-beige text-dark-teal' : 'border-border-beige text-dark-teal hover:bg-cream'
                  }`}
                >
                  {locale === 'ar' ? cat.nameAr : cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-border-beige rounded-lg px-3 py-2 text-sm text-dark-teal bg-white outline-none focus:border-beige"
            >
              <option value="featured">{t('sort', locale) || 'Sort by'}: {t('featured', locale) || 'Featured'}</option>
              <option value="newest">{t('newest', locale) || 'Newest'}</option>
              <option value="price-asc">{t('priceLow', locale) || 'Price: Low to High'}</option>
              <option value="price-desc">{t('priceHigh', locale) || 'Price: High to Low'}</option>
            </select>
            <div className="hidden sm:flex border border-border-beige rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-cream' : ''}`}>
                <Grid3X3 size={18} className="text-dark-teal" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-cream' : ''}`}>
                <List size={18} className="text-dark-teal" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex flex-wrap items-center gap-2">
            {activeFilters.map(f => (
              <span key={f.key} className="inline-flex items-center gap-1.5 bg-cream border border-border-beige rounded-full px-3 py-1 text-sm text-dark-teal">
                {f.label}
                <button onClick={f.remove} className="text-muted-teal hover:text-red-500"><X size={14} /></button>
              </span>
            ))}
            <button
              onClick={() => setSearchParams(new URLSearchParams())}
              className="text-sm text-muted-teal hover:text-beige transition-colors"
            >
              {t('clearAll', locale) || 'Clear All'}
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {paginated.length === 0 ? (
          <div className="text-center py-20">
            <img src="/images/logo.png" alt="" className="w-24 h-24 mx-auto mb-4 opacity-30" />
            <p className="font-display text-xl text-dark-teal mb-2">{t('noProducts', locale) || 'No products found'}</p>
            <p className="text-muted-teal text-sm mb-4">{t('tryFilters', locale) || 'Try adjusting your filters'}</p>
            <button
              onClick={() => setSearchParams(new URLSearchParams())}
              className="text-sm text-muted-teal hover:text-beige transition-colors"
            >
              {t('clearFilters', locale) || 'Clear Filters'}
            </button>
          </div>
        ) : (
          <>
            <div className={`grid gap-4 lg:gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {paginated.map((product, i) => (
                <ProductCard key={product.id} product={product} locale={locale} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-teal hover:bg-cream disabled:opacity-30 transition-colors"
                >
                  &larr;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                      p === page ? 'bg-beige text-dark-teal' : 'text-muted-teal hover:bg-cream'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-teal hover:bg-cream disabled:opacity-30 transition-colors"
                >
                  &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
