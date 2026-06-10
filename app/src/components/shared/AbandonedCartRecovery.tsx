import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag, Clock } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useMemberStore } from '@/stores/memberStore'
import { formatPrice } from '@/lib/i18n'

export function AbandonedCartRecovery() {
  const cart = useCartStore()
  const { cartAbandonedAt, recoverCart, dismissAbandonedCart } = useMemberStore()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!cartAbandonedAt || cart.items.length === 0) {
      setShow(false)
      return
    }
    const abandonedTime = new Date(cartAbandonedAt).getTime()
    const now = Date.now()
    const hoursSince = (now - abandonedTime) / (1000 * 60 * 60)
    if (hoursSince >= 1 && cart.items.length > 0) {
      setShow(true)
    }
  }, [cartAbandonedAt, cart.items.length])

  const handleDismiss = () => {
    setShow(false)
    dismissAbandonedCart()
  }

  const handleRecover = () => {
    recoverCart()
    setShow(false)
    cart.open()
  }

  if (cart.items.length === 0) return null

  return (
    <AnimatePresence>
      {show && cart.items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-6 left-1/2 z-50 w-full max-w-[420px]"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-border-beige p-5 mx-4">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 text-muted-teal hover:text-dark-teal"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blush-light flex items-center justify-center">
                <ShoppingBag size={18} className="text-blush-dark" />
              </div>
              <div>
                <p className="font-medium text-sm text-dark-teal">Forgot something?</p>
                <p className="text-xs text-muted-teal flex items-center gap-1">
                  <Clock size={10} /> You have {cart.items.length} item{cart.items.length > 1 ? 's' : ''} in your cart
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
              {cart.items.slice(0, 3).map(item => (
                <img key={item.productId} src={item.image} alt="" className="w-12 h-14 object-cover rounded-lg shrink-0" />
              ))}
              {cart.items.length > 3 && (
                <span className="text-xs text-muted-teal shrink-0">+{cart.items.length - 3} more</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-accent font-semibold text-dark-teal">{formatPrice(cart.subtotal)}</span>
              <button
                onClick={handleRecover}
                className="px-5 py-2 bg-beige text-dark-teal rounded-xl text-sm font-medium hover:bg-beige-dark transition-colors"
              >
                Complete Order
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
