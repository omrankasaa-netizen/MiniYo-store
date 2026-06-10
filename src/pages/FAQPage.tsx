import { useState } from 'react'
import { Link } from 'react-router'
import { Search, MessageCircle, ChevronDown } from 'lucide-react'
import { t } from '@/lib/i18n'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import type { Locale } from '@/types'

interface FAQPageProps {
  locale: Locale
}

const faqData = {
  ordering: [
    { q: 'How do I place an order?', a: 'Simply browse our products, add items to your cart, and proceed to checkout. You can pay with Cash on Delivery or Wish.' },
    { q: 'Can I modify my order?', a: 'Please contact us within 1 hour of placing your order if you need to make changes. After that, the order may have already been processed.' },
    { q: 'How do I track my order?', a: 'You can track your order using the "Track Order" page and entering your order number.' },
  ],
  shipping: [
    { q: 'What are the delivery options?', a: 'We offer Standard Delivery (3-5 business days, $3), Express Delivery (1-2 days for Beirut, $5), and Free Pickup from our store.' },
    { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days for Beirut area only.' },
    { q: 'Do you deliver outside Lebanon?', a: 'Currently we only deliver within Lebanon. We plan to expand internationally soon!' },
  ],
  returns: [
    { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging.' },
    { q: 'How do I return an item?', a: 'Contact us via WhatsApp or email to initiate a return. We will arrange a pickup or provide a return address.' },
    { q: 'When will I get my refund?', a: 'Refunds are processed within 5-7 business days after we receive the returned item.' },
  ],
  payments: [
    { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD) and Wish mobile payment.' },
    { q: 'Is Cash on Delivery available?', a: 'Yes! COD is our most popular payment method. Pay when you receive your order.' },
    { q: 'Is my payment secure?', a: 'Absolutely. We use SSL encryption and never store your payment details.' },
  ],
  products: [
    { q: 'How do I choose the right size?', a: 'Check our Size Guide on each product page. When in doubt, size up — kids grow fast!' },
    { q: 'What materials are used?', a: 'We use soft, organic cotton and baby-safe fabrics. All materials are hypoallergenic.' },
    { q: 'How do I care for the clothes?', a: 'Machine wash cold, tumble dry low. For best results, wash inside out.' },
  ],
}

export function FAQPage({ locale }: FAQPageProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('ordering')
  const [openItem, setOpenItem] = useState<number | null>(0)

  const categories = Object.keys(faqData) as (keyof typeof faqData)[]

  const filteredItems = search
    ? categories.flatMap(cat => faqData[cat].map((item, i) => ({ ...item, cat, i }))).filter(
        item => item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
      )
    : faqData[activeCategory as keyof typeof faqData].map((item, i) => ({ ...item, cat: activeCategory, i }))

  return (
    <div>
      {/* Header */}
      <div className="bg-cream py-16 text-center">
        <ScrollReveal>
          <h1 className="font-display text-4xl text-dark-teal mb-3">{t('faqTitle', locale)}</h1>
          <p className="text-muted-teal max-w-[500px] mx-auto px-4">{t('faqDesc', locale)}</p>
        </ScrollReveal>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-teal" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchQuestions', locale)}
            className="w-full h-12 border border-border-beige rounded-xl pl-11 pr-4 bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20"
          />
        </div>

        {/* Category Tabs */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenItem(0) }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors capitalize ${
                  activeCategory === cat ? 'bg-beige border-beige text-dark-teal' : 'border-border-beige text-muted-teal hover:bg-cream'
                }`}
              >
                {t(cat as any, locale)}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Items */}
        <div className="space-y-0">
          {filteredItems.map((item, idx) => (
            <div key={`${item.cat}-${item.i}-${idx}`} className="border-b border-border-beige">
              <button
                onClick={() => setOpenItem(openItem === idx ? null : idx)}
                className="flex items-center justify-between w-full py-5 text-left"
              >
                <span className="font-accent font-medium text-dark-teal pr-4">{item.q}</span>
                <ChevronDown size={18} className={`text-muted-teal shrink-0 transition-transform ${openItem === idx ? 'rotate-180' : ''}`} />
              </button>
              {openItem === idx && (
                <div className="pb-5">
                  <p className="text-muted-teal leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal className="mt-12">
          <div className="bg-white rounded-2xl p-8 text-center border border-border-beige">
            <h3 className="font-display text-xl text-dark-teal mb-2">{t('stillHaveQuestions', locale)}</h3>
            <p className="text-muted-teal text-sm mb-4">{t('teamHereToHelp', locale)}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact" className="bg-beige text-dark-teal px-6 py-2.5 rounded-xl font-accent font-medium hover:bg-beige-dark transition-colors">
                {t('contactUs', locale)}
              </Link>
              <a
                href="https://wa.me/96181385940"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={16} /> {t('whatsappUs', locale)}
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
