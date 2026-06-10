import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck, MessageCircle, Gift } from 'lucide-react'
import { formatPrice, t } from '@/lib/i18n'
import type { Locale } from '@/types'

interface OrderSuccessPageProps {
  locale: Locale
}

export function OrderSuccessPage({ locale }: OrderSuccessPageProps) {
  const { orderNumber } = useParams()
  const [searchParams] = useSearchParams()
  const total = Number(searchParams.get('total')) || 0
  const method = searchParams.get('method') || 'cod'
  const isGift = searchParams.get('gift') === '1'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="w-20 h-20 bg-sage-green rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle size={40} className="text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-display text-3xl text-dark-teal mb-3"
      >
        {t('thankYou', locale)}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-teal mb-6"
      >
        {t('orderSuccessDesc', locale)}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white border border-border-beige rounded-lg px-6 py-3 inline-block mb-8"
      >
        <p className="font-accent font-semibold text-dark-teal">{t('orderNumber', locale)} {orderNumber}</p>
      </motion.div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 border border-border-beige text-left mb-8"
      >
        {isGift && (
          <div className="bg-sage-green/10 border border-sage-green/20 rounded-xl p-4 mb-5 flex items-start gap-3">
            <Gift size={18} className="text-sage-green shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-sage-green">Gift order placed!</p>
              <p className="text-xs text-muted-teal mt-0.5">Beautifully wrapped with Miniyo packaging and a handwritten thank-you card. Prices hidden on the packing slip.</p>
            </div>
          </div>
        )}
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-teal">{t('total', locale)}</span>
          <span className="font-accent font-semibold">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-teal">{t('paymentMethod', locale)}</span>
          <span className="font-medium">{method === 'cod' ? t('cod', locale) : t('wish', locale)}</span>
        </div>
      </motion.div>

      {/* Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <p className="font-accent font-semibold text-dark-teal mb-4">{t('whatHappensNext', locale)}</p>
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { icon: CheckCircle, label: t('step1', locale), color: 'bg-sage-green' },
            { icon: Package, label: t('step2', locale), color: 'bg-beige' },
            { icon: Truck, label: t('step3', locale), color: 'bg-brand-lavender' },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center`}>
                <step.icon size={20} className="text-white" />
              </div>
              <span className="text-xs text-muted-teal">{step.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Link to={`/track-order?order=${orderNumber}`} className="flex-1 h-12 bg-beige text-dark-teal rounded-xl font-accent font-semibold flex items-center justify-center hover:bg-beige-dark transition-colors">
          {t('trackOrder', locale)}
        </Link>
        <Link to="/shop" className="flex-1 h-12 border-2 border-dark-teal text-dark-teal rounded-xl font-accent font-semibold flex items-center justify-center hover:bg-dark-teal hover:text-cream transition-colors">
          {t('continueShopping', locale)}
        </Link>
      </motion.div>

      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        href="https://wa.me/96181385940"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-6 text-[#25D366] font-medium text-sm"
      >
        <MessageCircle size={18} /> {t('questions', locale)} {t('chatWhatsApp', locale)}
      </motion.a>
    </div>
  )
}
