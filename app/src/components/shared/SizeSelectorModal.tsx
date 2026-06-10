import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, AlertCircle } from 'lucide-react'
import { showToast } from '@/components/shared/Toast'
import { formatPrice, t } from '@/lib/i18n'
import type { Product, Locale, ProductSize } from '@/types'

interface SizeSelectorModalProps {
  product: Product
  locale: Locale
  isOpen: boolean
  onClose: () => void
  onConfirm: (size: ProductSize, quantity: number) => void
}

export function SizeSelectorModal({ product, locale, isOpen, onClose, onConfirm }: SizeSelectorModalProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showError, setShowError] = useState(false)

  const sizes = product.sizes || []
  const stock = product.stockQuantity || 0

  const handleConfirm = () => {
    if (!selectedSize) {
      setShowError(true)
      return
    }
    onConfirm(selectedSize, quantity)
    showToast(locale === 'ar' ? `تمت الإضافة — المقاس: ${selectedSize.name}` : `Added to cart — Size: ${selectedSize.name}`)
    onClose()
  }

  const handleClose = () => {
    setSelectedSize(null)
    setQuantity(1)
    setShowError(false)
    onClose()
  }

  const primaryImage = product.images?.find((i) => i.isPrimary) || product.images?.[0]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-dark-teal/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <img
                  src={primaryImage?.url || '/images/products/bunny-bodysuit.jpg'}
                  alt={locale === 'ar' ? product.nameAr : product.name}
                  className="w-14 h-14 object-contain rounded-xl"
                />
                <div>
                  <p className="font-medium text-dark-teal text-sm line-clamp-1">
                    {locale === 'ar' ? product.nameAr : product.name}
                  </p>
                  <p className="font-accent font-semibold text-dark-teal">
                    {formatPrice(product.price)}
                  </p>
                  {stock <= 5 && stock > 0 && (
                    <p className="text-xs text-amber-600">Only {stock} left</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-muted-teal hover:text-dark-teal transition-colors rounded-lg hover:bg-cream"
              >
                <X size={18} />
              </button>
            </div>

            {/* Size Selection */}
            <div className="mb-5">
              <p className="font-accent font-semibold text-dark-teal text-sm mb-3">
                {t('selectSize', locale) || 'Select Size'}
                <span className="text-red-400 ml-1">*</span>
              </p>

              {showError && !selectedSize && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 text-xs bg-red-50 rounded-lg px-3 py-2 mb-3"
                >
                  <AlertCircle size={14} />
                  {t('pleaseSelectSize', locale) || 'Please select a size to continue'}
                </motion.div>
              )}

              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                      setSelectedSize(size)
                      setShowError(false)
                    }}
                    className={`px-5 py-2.5 border-2 rounded-xl text-sm font-medium transition-all ${
                      selectedSize?.id === size.id
                        ? 'border-beige bg-[#FFF8F9] text-dark-teal shadow-sm'
                        : 'border-border-beige text-dark-teal hover:bg-cream hover:border-beige/50'
                    }`}
                  >
                    {locale === 'ar' ? size.nameAr : size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-accent font-semibold text-dark-teal text-sm mb-3">
                {t('quantity', locale) || 'Quantity'}
              </p>
              <div className="flex items-center border border-border-beige rounded-xl bg-white w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-cream transition-colors rounded-l-xl text-dark-teal font-medium"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium text-dark-teal">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  disabled={quantity >= stock}
                  className="w-11 h-11 flex items-center justify-center hover:bg-cream transition-colors rounded-r-xl text-dark-teal font-medium disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="w-full h-12 bg-beige text-dark-teal rounded-xl font-accent font-semibold flex items-center justify-center gap-2 hover:bg-beige-dark transition-colors shadow-lg"
            >
              <ShoppingBag size={16} />
              {t('addToCart', locale) || 'Add to Cart'} — {formatPrice(product.price * quantity)}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
