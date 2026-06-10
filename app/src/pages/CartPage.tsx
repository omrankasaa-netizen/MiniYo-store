import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice, t } from '@/lib/i18n'
import type { Locale } from '@/types'

interface CartPageProps {
  locale: Locale
}

export function CartPage({ locale }: CartPageProps) {
  const { items, subtotal, totalItems, updateQuantity, removeItem } = useCartStore()
  const deliveryFee = subtotal > 50 ? 0 : 3
  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={80} className="text-border-beige mb-4" />
        <h1 className="font-display text-2xl text-dark-teal mb-2">{t('cartEmpty', locale)}</h1>
        <p className="text-muted-teal text-sm mb-6">{t('cartEmptyDesc', locale)}</p>
        <Link to="/shop" className="bg-beige text-dark-teal px-8 py-3 rounded-xl font-accent font-medium hover:bg-beige-dark transition-colors">
          {t('startShopping', locale)}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <nav className="text-sm text-muted-teal mb-2">
        <Link to="/" className="hover:text-dark-teal">{t('home', locale)}</Link>
        <span className="mx-2">/</span>
        <span className="text-dark-teal">{t('shoppingCart', locale)}</span>
      </nav>
      <h1 className="font-display text-3xl text-dark-teal mb-1">{t('shoppingCart', locale)}</h1>
      <p className="text-muted-teal text-sm mb-6">{totalItems} {locale === 'ar' ? 'منتج' : 'items'}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.variantId}`}
                layout
                className="flex gap-4 bg-white rounded-xl p-4 border border-border-beige"
              >
                <Link to={`/product/${item.sku.split('-').slice(0, 3).join('-').toLowerCase()}`}>
                  <img src={item.image} alt={locale === 'ar' ? item.nameAr : item.name} className="w-24 h-28 object-cover rounded-lg shrink-0" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.sku.split('-').slice(0, 3).join('-').toLowerCase()}`}>
                    <p className="font-medium text-dark-teal">{locale === 'ar' ? item.nameAr : item.name}</p>
                  </Link>
                  <p className="text-sm text-muted-teal">{[item.color, item.size].filter(Boolean).join(' / ')}</p>
                  <p className="font-accent font-medium text-sm text-dark-teal mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border-beige rounded-lg bg-cream">
                      <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-border-sand/50 transition-colors"><Minus size={14} /></button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-border-sand/50 transition-colors"><Plus size={14} /></button>
                    </div>
                    <div className="font-accent font-semibold text-dark-teal">{formatPrice(item.price * item.quantity)}</div>
                    <button onClick={() => removeItem(item.productId, item.variantId)} className="p-2 text-muted-teal hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-teal hover:text-dark-teal transition-colors mt-6">
            <ArrowLeft size={16} /> {t('continueShopping', locale)}
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:w-[340px]">
          <div className="bg-white rounded-2xl p-6 border border-border-beige lg:sticky lg:top-[100px]">
            <h2 className="font-display text-xl text-dark-teal mb-4">{t('orderSummary', locale)}</h2>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-teal">{t('subtotal', locale)}</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-teal">{t('shipping', locale)}</span>
              <span className="font-medium">{deliveryFee === 0 ? t('freeDelivery', locale) : formatPrice(deliveryFee)}</span>
            </div>
            <div className="border-t border-border-beige pt-3 mb-4">
              <div className="flex justify-between">
                <span className="font-accent font-semibold text-dark-teal">{t('total', locale)}</span>
                <span className="font-accent font-semibold text-xl text-dark-teal">{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="flex items-center justify-center w-full h-[52px] bg-beige text-dark-teal rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors shadow-lg shadow-beige/20"
            >
              {t('proceedCheckout', locale)}
            </Link>
            <p className="text-xs text-muted-teal text-center mt-3">{t('shippingCalculated', locale)}</p>
            <div className="flex items-center justify-center gap-3 mt-4 text-xs text-muted-teal">
              <span className="flex items-center gap-1"><span className="text-green-600">&#128274;</span> SSL</span>
              <span>{t('cod', locale)}</span>
              <span>{t('thirtyDayReturns', locale)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
