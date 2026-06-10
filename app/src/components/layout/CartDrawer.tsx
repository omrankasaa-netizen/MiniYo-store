import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useMemberStore } from '@/stores/memberStore'
import { useAdminStore } from '@/stores/adminStore'
import { useProducts } from '@/hooks/useMiniyo'
import { formatPrice, t } from '@/lib/i18n'
import type { Locale } from '@/types'

interface CartDrawerProps {
  locale: Locale
}

export function CartDrawer({ locale }: CartDrawerProps) {
  const { items, isOpen, close, subtotal, totalItems, updateQuantity, removeItem } = useCartStore()
  const markCartAbandoned = useMemberStore(s => s.markCartAbandoned)
  const adminSettings = useAdminStore(s => s.settings)
  const { data: allProducts = [] } = useProducts({})

  const freeThreshold = adminSettings.freeShippingThreshold || 50
  const amountForFree = Math.max(0, freeThreshold - subtotal)
  const qualifiesForFree = subtotal >= freeThreshold

  // Recommendations: products not in cart, show first 3
  const cartProductIds = new Set(items.map(i => i.productId))
  const recommendations = allProducts
    .filter((p: any) => !cartProductIds.has(p.id) && p.isActive !== false)
    .slice(0, 3)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-dark-teal/40 backdrop-blur-sm z-50" onClick={close} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[460px] bg-white z-50 flex flex-col shadow-2xl rounded-l-2xl">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-beige">
              <h2 className="font-display text-xl text-dark-teal">{t('shoppingCart', locale)} ({totalItems})</h2>
              <button onClick={() => {
                if (items.length > 0) markCartAbandoned()
                close()
              }} className="p-2 text-muted-teal hover:text-dark-teal transition-colors rounded-lg hover:bg-cream"><X size={20} /></button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={60} className="text-border-beige mb-4" />
                  <p className="font-display text-lg text-dark-teal mb-2">{t('cartEmpty', locale)}</p>
                  <p className="text-sm text-muted-teal mb-6">{t('cartEmptyDesc', locale)}</p>
                  <Link to="/shop" onClick={close} className="bg-beige text-dark-teal px-6 py-3 rounded-xl font-accent text-sm font-medium hover:bg-beige-dark transition-colors">
                    {t('startShopping', locale)}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Free Shipping Banner */}
                  {qualifiesForFree ? (
                    <div className="bg-sage-green/10 border border-sage-green/20 rounded-xl p-3 flex items-center gap-2">
                      <Sparkles size={16} className="text-sage-green shrink-0" />
                      <p className="text-xs text-sage-green font-medium">You unlocked free shipping!</p>
                    </div>
                  ) : amountForFree > 0 ? (
                    <div className="bg-blush-light border border-blush-dark/20 rounded-xl p-3">
                      <p className="text-xs text-dark-teal font-medium flex items-center gap-1.5">
                        <Sparkles size={14} className="text-blush-dark" />
                        Add {formatPrice(amountForFree)} more for free shipping across Lebanon
                      </p>
                      <Link to="/shop" onClick={close} className="text-xs text-sage-green font-medium hover:underline mt-1 inline-block">
                        Continue shopping &rarr;
                      </Link>
                    </div>
                  ) : null}

                  {items.map((item) => (
                    <motion.div key={`${item.productId}-${item.variantId}`} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 bg-cream/50 rounded-xl p-3 border border-border-beige/50">
                      <Link to={`/product/${item.sku.split('-').slice(0, 3).join('-').toLowerCase()}`} onClick={close}>
                        <img src={item.image} alt={locale === 'ar' ? item.nameAr : item.name} className="w-20 h-24 object-cover rounded-lg shrink-0" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.sku.split('-').slice(0, 3).join('-').toLowerCase()}`} onClick={close}>
                          <p className="font-medium text-sm text-dark-teal truncate">{locale === 'ar' ? item.nameAr : item.name}</p>
                        </Link>
                        <p className="text-xs text-muted-teal mt-0.5">{[item.color, item.size].filter(Boolean).join(' / ')}</p>
                        <p className="font-accent font-semibold text-sm text-dark-teal mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center border border-border-beige rounded-md bg-cream hover:bg-border-sand transition-colors"><Minus size={14} /></button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center border border-border-beige rounded-md bg-cream hover:bg-border-sand transition-colors"><Plus size={14} /></button>
                          </div>
                          <button onClick={() => removeItem(item.productId, item.variantId)} className="p-1.5 text-muted-teal hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Recommendations */}
                  {recommendations.length > 0 && (
                    <div className="pt-4 border-t border-border-beige">
                      <p className="text-xs font-semibold text-muted-teal uppercase tracking-wider mb-3">You might also like</p>
                      <div className="space-y-3">
                        {recommendations.map((p: any) => (
                          <Link key={p.id} to={`/product/${p.slug}`} onClick={close}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream/60 transition-colors">
                            <img src={p.imageUrl || (p.images?.[0]?.url)} alt={p.name} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-dark-teal truncate font-medium">{p.name}</p>
                              <p className="text-xs text-muted-teal">{formatPrice(p.price)}</p>
                            </div>
                            <Plus size={16} className="text-sage-green" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link to="/shop" onClick={close} className="inline-flex items-center gap-2 text-sm text-muted-teal hover:text-dark-teal transition-colors pt-2">
                    <ArrowRight size={16} className="rotate-180" /> {t('continueShopping', locale)}
                  </Link>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border-beige p-6 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-teal">{t('subtotal', locale)}</span>
                  <span className="font-accent font-semibold text-dark-teal">{formatPrice(subtotal)}</span>
                </div>
                {qualifiesForFree && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-teal text-sm">Shipping</span>
                    <span className="text-sage-green font-medium text-sm">FREE</span>
                  </div>
                )}
                <p className="text-xs text-muted-teal mb-4">
                  {qualifiesForFree ? 'Free shipping across Lebanon' : 'Shipping calculated at checkout'}
                </p>
                <Link to="/checkout" onClick={close}
                  className="flex items-center justify-center gap-2 w-full h-[52px] bg-beige text-dark-teal rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors shadow-lg shadow-beige/30">
                  {t('proceedCheckout', locale)} <ArrowRight size={18} />
                </Link>
                <button onClick={close} className="w-full text-center text-sm text-muted-teal hover:text-dark-teal transition-colors mt-3">
                  {t('continueShopping', locale)}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
