import { useState } from 'react'
import { Search, CheckCircle, Package, Truck, Home, MessageCircle } from 'lucide-react'
import { t } from '@/lib/i18n'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import type { Locale } from '@/types'

interface TrackOrderPageProps {
  locale: Locale
}

export function TrackOrderPage({ locale }: TrackOrderPageProps) {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderNumber) {
      setResult({
        orderNumber,
        date: new Date().toLocaleDateString(),
        status: 'processing',
        items: [
          { name: 'Bunny Print Bodysuit', qty: 2, price: 18 },
          { name: 'Stripe Romper', qty: 1, price: 22 },
        ],
        total: 58,
        address: 'Al Koura, North Lebanon',
        method: 'Standard Delivery',
      })
    }
  }

  const steps = [
    { key: 'placed', label: t('orderPlaced', locale), icon: CheckCircle, done: true },
    { key: 'processing', label: t('processing', locale), icon: Package, done: result?.status === 'processing' || result?.status === 'shipped' || result?.status === 'delivered' },
    { key: 'shipped', label: t('shipped', locale), icon: Truck, done: result?.status === 'shipped' || result?.status === 'delivered' },
    { key: 'delivered', label: t('delivered', locale), icon: Home, done: result?.status === 'delivered' },
  ]

  return (
    <div className="max-w-[600px] mx-auto px-4 py-16">
      <ScrollReveal className="text-center mb-10">
        <h1 className="font-display text-3xl lg:text-4xl text-dark-teal mb-2">{t('trackYourOrder', locale)}</h1>
        <p className="text-muted-teal">{t('trackOrderDesc', locale)}</p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <form onSubmit={handleTrack} className="space-y-4 mb-10">
          <input
            type="text"
            required
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            placeholder={t('orderNumberPlaceholder', locale)}
            className="w-full h-14 border border-border-beige rounded-xl px-5 bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20 font-display text-lg"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('email', locale)}
            className="w-full h-12 border border-border-beige rounded-xl px-5 bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20"
          />
          <button type="submit" className="w-full h-12 bg-beige text-dark-teal rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors flex items-center justify-center gap-2">
            <Search size={18} /> {t('track', locale)}
          </button>
        </form>
      </ScrollReveal>

      {result && (
        <ScrollReveal>
          <div className="bg-white rounded-2xl p-6 border border-border-beige">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-accent font-semibold text-dark-teal">{result.orderNumber}</p>
                <p className="text-sm text-muted-teal">{t('orderDate', locale)}: {result.date}</p>
              </div>
              <span className="bg-brand-lavender text-dark-teal text-xs font-semibold px-3 py-1 rounded-full">
                {t('processing', locale)}
              </span>
            </div>

            {/* Timeline */}
            <div className="relative mb-6">
              {steps.map((step, i) => (
                <div key={step.key} className="relative flex items-start gap-4 pb-6 last:pb-0">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className={`absolute left-[14px] top-7 w-0.5 h-[calc(100%-8px)] ${step.done ? 'bg-sage-green' : 'bg-border-sand'}`} />
                  )}
                  {/* Icon */}
                  <div className={`relative z-10 shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${step.done ? 'bg-sage-green' : 'border-2 border-border-beige bg-white'}`}>
                    {step.done ? <CheckCircle size={15} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-border-sand" />}
                  </div>
                  {/* Label */}
                  <p className={`font-medium text-sm pt-1 ${step.done ? 'text-dark-teal' : 'text-muted-teal'}`}>{step.label}</p>
                </div>
              ))}
            </div>

            {/* Items */}
            <div className="border-t border-border-beige pt-4">
              <p className="font-medium text-sm text-dark-teal mb-3">{locale === 'ar' ? 'المنتجات' : 'Items'}</p>
              {result.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-teal">{item.name} × {item.qty}</span>
                  <span className="text-dark-teal">${item.price * item.qty}.00</span>
                </div>
              ))}
              <div className="flex items-center justify-between font-accent font-semibold pt-2 border-t border-border-beige">
                <span className="text-dark-teal">{t('total', locale)}</span>
                <span className="text-dark-teal">${result.total}.00</span>
              </div>
            </div>

            <a
              href="https://wa.me/96181385940"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-4 text-[#25D366] font-medium text-sm"
            >
              <MessageCircle size={16} /> {t('questions', locale)} {t('chatWhatsApp', locale)}
            </a>
          </div>
        </ScrollReveal>
      )}
    </div>
  )
}
