import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Heart } from 'lucide-react'
import { dataService } from '@/lib/data'
import { useWishlistStore } from '@/stores/wishlistStore'
import { t } from '@/lib/i18n'
import { ProductCard } from '@/components/shared/ProductCard'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import type { Locale, Product } from '@/types'

interface WishlistPageProps {
  locale: Locale
}

export function WishlistPage({ locale }: WishlistPageProps) {
  const { items } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadProducts() {
      if (items.length === 0) {
        setProducts([])
        return
      }
      const prods = await dataService.getWishlistProducts(items)
      setProducts(prods)
    }
    loadProducts()
  }, [items])

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Heart size={60} className="text-border-beige mb-4" />
        <h1 className="font-display text-2xl text-dark-teal mb-2">
          {locale === 'ar' ? 'المفضلة فارغة' : 'Your Wishlist is Empty'}
        </h1>
        <p className="text-muted-teal text-sm mb-6">
          {locale === 'ar' ? 'احفظ المنتجات التي تعجبك هنا' : 'Save items you love here'}
        </p>
        <Link to="/shop" className="bg-beige text-dark-teal px-8 py-3 rounded-xl font-accent font-medium hover:bg-beige-dark transition-colors">
          {t('startShopping', locale)}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ScrollReveal>
        <h1 className="font-display text-3xl text-dark-teal mb-8">{t('wishlist', locale)} ({products.length})</h1>
      </ScrollReveal>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} locale={locale} index={i} />
        ))}
      </div>
    </div>
  )
}
