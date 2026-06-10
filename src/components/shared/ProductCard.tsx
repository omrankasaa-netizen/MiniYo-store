import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useCartStore } from '@/stores/cartStore'
import { showToast } from '@/components/shared/Toast'
import { getEffectiveStock } from '@/lib/storefrontSync'
import { SizeSelectorModal } from './SizeSelectorModal'
import { formatPrice, t } from '@/lib/i18n'
import type { Product, Locale, ProductSize } from '@/types'

interface ProductCardProps {
  product: Product
  locale: Locale
  index?: number
}

export function ProductCard({ product, locale, index = 0 }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [showSizeModal, setShowSizeModal] = useState(false)
  const wishlist = useWishlistStore()
  const cart = useCartStore()
  const isWished = wishlist.isInWishlist(product.id)
  const primaryImage = product.images?.find((i) => i.isPrimary) || product.images?.[0]
  const colors = product.colors || []
  const sizes = product.sizes || []

  // Stock from sync layer (reflects decrements from orders)
  const stock = getEffectiveStock(product.id)
  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stock <= 5

  // How many of this product are already in cart
  const inCartQty = cart.items
    .filter(i => i.productId === product.id)
    .reduce((sum, i) => sum + i.quantity, 0)
  const canAdd = !isOutOfStock && inCartQty < stock

  // Direct add (no sizes) or open size modal (has sizes)
  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!canAdd) return

    if (sizes.length > 0) {
      // Enforce size selection via modal
      setShowSizeModal(true)
    } else {
      // No sizes - add directly
      addToCart(null)
    }
  }

  const addToCart = (size: ProductSize | null, quantity: number = 1) => {
    cart.addItem({
      productId: product.id,
      variantId: size ? size.id : null,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      quantity,
      image: primaryImage?.url || '/images/products/bunny-bodysuit.jpg',
      color: colors[0]?.name || null,
      size: size ? size.name : null,
      sku: product.sku,
    })
    showToast(locale === 'ar' ? `تمت إضافة ${product.name}` : `Added to cart: ${product.name}`)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link to={`/product/${product.slug}`} className="block">
          <div className={`bg-white rounded-2xl border overflow-hidden shadow-[0_1px_4px_rgba(45,90,76,0.03)] transition-all duration-300 hover:shadow-[0_8px_28px_rgba(45,90,76,0.08)] hover:-translate-y-0.5 ${isOutOfStock ? 'opacity-60' : 'border-border-beige/60'}`}>
            {/* Image Area */}
            <div className="relative aspect-[3/4] overflow-hidden bg-cream">
              <img
                src={primaryImage?.url || '/images/products/bunny-bodysuit.jpg'}
                alt={locale === 'ar' ? (primaryImage?.altAr || product.nameAr) : (primaryImage?.alt || product.name)}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
              />

              {/* Stock overlay when out of stock */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-dark-teal/90 text-white text-xs font-accent font-semibold uppercase tracking-wider px-4 py-2 rounded-xl">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Badges - Top Left */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {isLowStock && !isOutOfStock && (
                  <span className="bg-amber-500 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-[5px] rounded-lg shadow-sm">
                    Only {stock} left
                  </span>
                )}
                {product.isNew && !isOutOfStock && (
                  <span className="bg-sage-green text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-[5px] rounded-lg shadow-sm">
                    {t('new', locale)}
                  </span>
                )}
                {product.compareAtPrice && !isOutOfStock && (
                  <span className="bg-blush-dark text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-[5px] rounded-lg shadow-sm">
                    {t('sale', locale)} {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                  </span>
                )}
                {product.isBestseller && !isOutOfStock && (
                  <span className="bg-dark-teal text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-[5px] rounded-lg shadow-sm">
                    {t('bestseller', locale)}
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <motion.button
                initial={false}
                animate={hovered ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  wishlist.toggle(product.id)
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-blush-light transition-colors border border-border-beige/30"
              >
                <Heart size={16} className={isWished ? 'fill-red-500 text-red-500' : 'text-dark-teal/70'} />
              </motion.button>

              {/* Quick Add — hidden when out of stock */}
              {!isOutOfStock && (
                <motion.button
                  initial={false}
                  animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleAddClick}
                  disabled={!canAdd}
                  className={`absolute bottom-3 left-3 right-3 h-10 rounded-xl font-accent text-[13px] font-medium flex items-center justify-center gap-2 shadow-lg transition-colors ${
                    canAdd
                      ? 'bg-dark-teal text-cream hover:bg-dark-teal-light'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag size={15} />
                  {canAdd
                    ? (sizes.length > 0
                        ? `${t('addToCart', locale)} • ${sizes.length} ${t('sizes', locale) || 'sizes'}`
                        : t('addToCart', locale))
                    : `Max ${stock} in cart`
                  }
                </motion.button>
              )}
            </div>

            {/* Info Area */}
            <div className="p-4 pt-3.5">
              <p className="font-accent text-[11px] uppercase tracking-wider text-muted-teal/80 mb-1">
                {product.category?.name || ''}
              </p>
              <p className="font-medium text-[14px] text-dark-teal truncate mb-1 leading-snug">
                {locale === 'ar' ? product.nameAr : product.name}
              </p>
              <p className="text-[12px] text-muted-teal/70 mb-2.5">
                {product.ageGroup}
              </p>

              {/* Size hint */}
              {sizes.length > 0 && !isOutOfStock && (
                <p className="text-[11px] text-muted-teal/60 mb-1.5">
                  {t('availableSizes', locale) || 'Sizes'}: {sizes.map(s => locale === 'ar' ? s.nameAr : s.name).join(', ')}
                </p>
              )}

              {/* Stock indicator */}
              <p className={`text-[11px] mb-2 ${isOutOfStock ? 'text-red-500 font-medium' : isLowStock ? 'text-amber-600' : 'text-sage-green'}`}>
                {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${stock} left in stock` : 'In Stock'}
              </p>

              {/* Color Swatches */}
              {colors.length > 0 && (
                <div className="flex gap-1.5 mb-2.5">
                  {colors.slice(0, 4).map((color) => (
                    <span
                      key={color.id}
                      className="w-3.5 h-3.5 rounded-full border border-border-beige/60 shadow-sm"
                      style={{ backgroundColor: color.hexCode }}
                      title={locale === 'ar' ? color.nameAr : color.name}
                    />
                  ))}
                  {colors.length > 4 && (
                    <span className="text-[10px] text-muted-teal self-center ml-0.5">+{colors.length - 4}</span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 pt-1 border-t border-border-beige/30">
                <span className="font-accent font-bold text-[15px] text-dark-teal">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-[13px] text-muted-teal/60 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Size Selector Modal */}
      <SizeSelectorModal
        product={product}
        locale={locale}
        isOpen={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        onConfirm={(size, qty) => addToCart(size, qty)}
      />
    </>
  )
}
