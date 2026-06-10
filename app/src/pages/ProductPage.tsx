import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { Heart, Lock, Truck, RotateCcw, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { dataService } from '@/lib/data'
import { getEffectiveStock } from '@/lib/storefrontSync'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { formatPrice, t } from '@/lib/i18n'
import { StarRating } from '@/components/shared/StarRating'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { ReviewSection } from '@/components/shared/ReviewSection'
import type { Locale, Product } from '@/types'

interface ProductPageProps {
  locale: Locale
}

export function ProductPage({ locale }: ProductPageProps) {
  const { handle } = useParams()
  const cart = useCartStore()
  const wishlist = useWishlistStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [openAccordion, setOpenAccordion] = useState<string | null>('description')

  useEffect(() => {
    async function loadProduct() {
      if (!handle) return
      const prod = await dataService.getProduct(handle)
      if (prod) {
        setProduct(prod)
        if (prod.colors?.[0]) setSelectedColor(prod.colors[0].name)
        if (prod.sizes?.[0]) setSelectedSize(prod.sizes[0].name)
      }
    }
    loadProduct()
    window.scrollTo(0, 0)
  }, [handle])

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-border-beige border-t-brand-blush rounded-full" />
      </div>
    )
  }

  const primaryImage = product.images?.find(i => i.isPrimary) || product.images?.[0]
  const isWished = wishlist.isInWishlist(product.id)
  const savings = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0
  const effectiveStock = getEffectiveStock(product.id)
  const stockLow = effectiveStock <= 5 && effectiveStock > 0
  const outOfStock = effectiveStock <= 0

  const cartQty = cart.items.filter(i => i.productId === product.id).reduce((s, i) => s + i.quantity, 0)
  const maxQty = Math.max(0, effectiveStock - cartQty)

  const handleAddToCart = () => {
    if (outOfStock || maxQty <= 0) return
    const qty = Math.min(quantity, maxQty)
    const added = cart.addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      quantity: qty,
      image: primaryImage?.url || '',
      color: selectedColor,
      size: selectedSize,
      sku: product.sku,
    })
    if (added) cart.open()
  }

  const whatsappMessage = encodeURIComponent(`${t('askProductWhatsApp', locale)} ${product.name}`)

  return (
    <div className="bg-cream">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-teal mb-6">
          <Link to="/" className="hover:text-dark-teal">{t('home', locale)}</Link>
          <span className="mx-2">/</span>
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-dark-teal">
                {locale === 'ar' ? product.category.nameAr : product.category.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-dark-teal">{locale === 'ar' ? product.nameAr : product.name}</span>
        </nav>

        {/* Product Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="lg:w-[55%]">
            <ScrollReveal>
              <div className="relative bg-white rounded-2xl overflow-hidden aspect-[3/4]">
                <img
                  src={product.images?.[activeImage]?.url || primaryImage?.url || ''}
                  alt={locale === 'ar' ? (product.images?.[activeImage]?.altAr || product.nameAr) : (product.images?.[activeImage]?.alt || product.name)}
                  className="w-full h-full object-contain"
                />
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage(Math.max(0, activeImage - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setActiveImage(Math.min(product.images!.length - 1, activeImage + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      className={`w-[72px] h-[72px] rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                        i === activeImage ? 'border-beige' : 'border-transparent hover:border-border-beige'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </ScrollReveal>
          </div>

          {/* Product Info */}
          <div className="lg:w-[45%]">
            <ScrollReveal delay={0.1}>
              <h1 className="font-display text-3xl lg:text-4xl text-dark-teal mb-2">
                {locale === 'ar' ? product.nameAr : product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating || 0} />
                <span className="font-accent font-semibold text-sm text-dark-teal">{product.rating}</span>
                <span className="text-sm text-muted-teal">({product.reviewCount} {t('reviews', locale).toLowerCase()})</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-accent text-2xl font-semibold text-dark-teal">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-lg text-muted-teal line-through">{formatPrice(product.compareAtPrice)}</span>
                    <span className="bg-beige text-dark-teal text-xs font-semibold px-2 py-1 rounded">
                      {t('save', locale)} {savings}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-muted-teal leading-relaxed mb-6">
                {locale === 'ar' ? (product.shortDescriptionAr || product.descriptionAr || product.shortDescription) : (product.shortDescription || product.description || '')}
              </p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium text-sm text-dark-teal mb-2">
                    {t('color', locale)}: {selectedColor ? (locale === 'ar' ? product.colors.find(c => c.name === selectedColor)?.nameAr : selectedColor) : ''}
                  </p>
                  <div className="flex gap-2.5">
                    {product.colors.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColor === color.name ? 'border-beige ring-2 ring-beige/30' : 'border-border-beige'
                        }`}
                        style={{ backgroundColor: color.hexCode }}
                        title={locale === 'ar' ? color.nameAr : color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-dark-teal">
                      {t('size', locale)}: {selectedSize ? (locale === 'ar' ? product.sizes.find(s => s.name === selectedSize)?.nameAr : selectedSize) : ''}
                    </p>
                    <button className="text-xs text-muted-teal underline">{t('sizeGuide', locale)}</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.name)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          selectedSize === size.name
                            ? 'bg-dark-teal text-cream border-dark-teal'
                            : 'border-border-beige text-dark-teal hover:bg-cream'
                        }`}
                      >
                        {locale === 'ar' ? size.nameAr : size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-border-beige rounded-lg bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-12 flex items-center justify-center hover:bg-cream transition-colors">-</button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(maxQty, quantity + 1))} disabled={quantity >= maxQty} className="w-10 h-12 flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock || maxQty <= 0}
                  className={`flex-1 h-12 rounded-xl font-accent font-semibold transition-colors ${
                    outOfStock || maxQty <= 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-beige text-dark-teal hover:bg-beige-dark'
                  }`}
                >
                  {outOfStock ? t('outOfStock', locale) : maxQty <= 0 ? 'Max in cart' : t('addToCart', locale)}
                </button>
                <button
                  onClick={() => wishlist.toggle(product.id)}
                  className={`w-12 h-12 border rounded-xl flex items-center justify-center transition-colors ${
                    isWished ? 'border-red-300 bg-red-50' : 'border-border-beige hover:bg-cream'
                  }`}
                >
                  <Heart size={20} className={isWished ? 'fill-red-500 text-red-500' : 'text-dark-teal'} />
                </button>
              </div>

              {/* Stock */}
              <div className="mb-4">
                {outOfStock ? (
                  <p className="text-red-500 text-sm font-medium">{t('outOfStock', locale)}</p>
                ) : stockLow ? (
                  <p className="text-orange-500 text-sm font-medium">{t('onlyLeft', locale).replace('{count}', String(effectiveStock))}</p>
                ) : (
                  <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" /> {t('inStock', locale)}
                  </p>
                )}
              </div>

              {/* Trust Row */}
              <div className="flex items-center gap-4 text-xs text-muted-teal mb-6">
                <span className="flex items-center gap-1"><Lock size={14} className="text-brand-sage" /> {t('secureCheckout', locale)}</span>
                <span className="flex items-center gap-1"><Truck size={14} className="text-brand-sage" /> {t('cod', locale)}</span>
                <span className="flex items-center gap-1"><RotateCcw size={14} className="text-brand-sage" /> {t('easyReturns', locale)}</span>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/96181385940?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-11 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#128C7E] transition-colors mb-6"
              >
                <MessageCircle size={18} /> {t('askWhatsApp', locale)}
              </a>

              {/* Accordions */}
              <div className="border-t border-border-beige">
                {[
                  { key: 'description', label: t('description', locale), content: locale === 'ar' ? (product.descriptionAr || product.description || '') : (product.description || '') },
                  { key: 'shipping', label: t('shippingReturns', locale), content: locale === 'ar' ? 'الشحن مجاني للطلبات فوق 50 دولار. يستغرق التوصيل 3-5 أيام عمل في لبنان. يمكن الإرجاع خلال 30 يوماً.' : 'Free shipping on orders over $50. Delivery takes 3-5 business days across Lebanon. Returns accepted within 30 days.' },
                  { key: 'reviews', label: `${t('reviews', locale)} (${product.reviewCount})`, content: null },
                ].map(section => (
                  <div key={section.key} className="border-b border-border-beige">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === section.key ? null : section.key)}
                      className="flex items-center justify-between w-full py-4 font-accent font-medium text-dark-teal text-left"
                    >
                      {section.label}
                      <span className={`transition-transform ${openAccordion === section.key ? 'rotate-180' : ''}`}>&#9662;</span>
                    </button>
                    {openAccordion === section.key && (
                      <div className="pb-4">
                        {section.key === 'reviews' ? (
                          <div className="space-y-4">
                            {product.reviews?.map(review => (
                              <div key={review.id} className="bg-cream rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <StarRating rating={review.rating} size={14} />
                                  <span className="text-xs font-medium">{review.customerName}</span>
                                  {review.isVerified && <span className="text-[10px] bg-sage-green text-white px-1.5 py-0.5 rounded">{t('verifiedPurchase', locale)}</span>}
                                </div>
                                {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                                <p className="text-sm text-muted-teal">{review.body}</p>
                              </div>
                            ))}
                            {(!product.reviews || product.reviews.length === 0) && (
                              <p className="text-muted-teal text-sm">{locale === 'ar' ? 'لا توجد مراجعات بعد. كن الأول!' : 'No reviews yet. Be the first!'}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-teal leading-relaxed">{section.content}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <ReviewSection productId={product.id} productName={locale === 'ar' ? product.nameAr : product.name} locale={locale} />
      </div>

      {/* Sticky Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-beige p-3 z-40 flex items-center gap-3">
        <div className="shrink-0">
          <span className="font-accent font-semibold text-dark-teal">{formatPrice(product.price)}</span>
          {product.compareAtPrice && <span className="text-sm text-muted-teal line-through ml-2">{formatPrice(product.compareAtPrice)}</span>}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={outOfStock || maxQty <= 0}
          className={`flex-1 h-11 rounded-xl font-accent font-semibold text-sm transition-colors ${
            outOfStock || maxQty <= 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-beige text-dark-teal hover:bg-beige-dark'
          }`}
        >
          {outOfStock ? t('outOfStock', locale) : maxQty <= 0 ? 'Max in cart' : t('addToCart', locale)}
        </button>
      </div>
    </div>
  )
}
