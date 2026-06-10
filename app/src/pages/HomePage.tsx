import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  ChevronDown, Truck, Shield, RotateCcw, Headphones,
  Sparkles, Flame, Package, CreditCard, MessageCircle, MapPin, Star
} from 'lucide-react'
import { useCategories, useProducts, useSettings } from '@/hooks/useMiniyo'
import { useAdminStore } from '@/stores/adminStore'
import { t } from '@/lib/i18n'
import { ProductCard } from '@/components/shared/ProductCard'
import { CategoryCard } from '@/components/shared/CategoryCard'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import type { Locale } from '@/types'

interface HomePageProps {
  locale: Locale
}

export function HomePage({ locale }: HomePageProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 32 })
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [announcementVisible, setAnnouncementVisible] = useState(true)

  // tRPC — database-backed data
  const { data: categories = [] } = useCategories()
  const { data: newArrivals = [] } = useProducts({ isNew: true })
  const { data: bestSellers = [] } = useProducts({ isBestseller: true })
  const { data: settingsList = [] } = useSettings()

  // Admin store for hero/logo images (media uploads)
  const adminSettings = useAdminStore(s => s.settings)

  // Build settings map from DB
  const db = new Map(settingsList.map(s => [s.key, s.value]))
  const s = {
    announcementText: db.get('announcementText') || '',
    announcementTextAr: db.get('announcementTextAr') || '',
    heroTitle: db.get('heroTitle') || t('heroTitle', locale),
    heroTitleAr: db.get('heroTitleAr') || t('heroTitle', locale),
    heroSubtitle: db.get('heroSubtitle') || t('heroSubtitle', locale),
    heroSubtitleAr: db.get('heroSubtitleAr') || t('heroSubtitle', locale),
    heroImageUrl: adminSettings.heroImageUrl || db.get('heroImageUrl') || '/images/hero.jpg',
    logoImageUrl: adminSettings.logoImageUrl || db.get('logoImageUrl') || '/images/logo.png',
  }

  const announcementText = locale === 'ar' ? (s.announcementTextAr || s.announcementText) : s.announcementText
  const heroTitle = locale === 'ar' ? (s.heroTitleAr || s.heroTitle) : s.heroTitle
  const heroSubtitle = locale === 'ar' ? (s.heroSubtitleAr || s.heroSubtitle) : s.heroSubtitle

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(p => {
        if (p.minutes > 0) return { ...p, minutes: p.minutes - 1 }
        if (p.hours > 0) return { ...p, hours: p.hours - 1, minutes: 59 }
        if (p.days > 0) return { ...p, days: p.days - 1, hours: 23, minutes: 59 }
        return p
      })
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => setTestimonialIndex(p => (p + 1) % 3), 6000)
    return () => clearInterval(timer)
  }, [])

  const testimonials = [
    { name: 'Sarah M.', rating: 5, text: 'The softest baby clothes I have found in Lebanon. The packaging with the little bunny sticker made it feel like a gift even though I bought it for my own baby!', location: 'Beirut' },
    { name: 'Nadia K.', rating: 5, text: "I ordered a gift set for my friend's newborn and it arrived beautifully wrapped with a handwritten card. The Cash on Delivery option made it so easy. Will definitely order again.", location: 'Tripoli' },
    { name: 'Rana H.', rating: 5, text: 'Miniyo has become my go-to for baby gifts. The quality is amazing, delivery to Jounieh was fast, and the WhatsApp support is so helpful for choosing sizes.', location: 'Jounieh' },
  ]

  const stats = [
    { value: 2000, suffix: '+', label: 'happyFamilies' },
    { value: 100, suffix: '%', label: 'qualityGuaranteed' },
    { value: 48, suffix: 'h', label: 'deliveryBeirut' },
  ]

  const trustFeatures = [
    { icon: Truck, title: 'freeDelivery', desc: 'freeDeliveryDesc' },
    { icon: Shield, title: 'securePayments', desc: 'securePaymentsDesc' },
    { icon: RotateCcw, title: 'easyReturns', desc: 'easyReturnsDesc' },
    { icon: Headphones, title: 'support24_7', desc: 'support24_7Desc' },
  ]

  const heroTrust = [
    { icon: Package, label: 'heroTrustCod' },
    { icon: CreditCard, label: 'heroTrustWish' },
    { icon: MapPin, label: 'heroTrustDelivery' },
    { icon: MessageCircle, label: 'heroTrustWhatsapp' },
  ]

  return (
    <div>
      {/* Announcement Bar */}
      {announcementVisible && announcementText && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          className="bg-dark-teal text-cream text-center relative">
          <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm">
            <Package size={13} className="text-sage-green mr-1 inline" />
            <span className="text-cream/90 tracking-wide">{announcementText}</span>
            <button onClick={() => setAnnouncementVisible(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream">×</button>
          </div>
        </motion.div>
      )}

      {/* Hero */}
      <section className="relative h-[calc(100vh-80px)] min-h-[520px] max-h-[900px] overflow-hidden">
        <img src={s.heroImageUrl} alt="Miniyo baby essentials" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-teal/50 via-dark-teal/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-teal/40 via-transparent to-dark-teal/10" />
        <div className="relative h-full flex flex-col justify-end pb-[10vh] px-6 sm:px-8 lg:px-[8vw] max-w-[1400px] mx-auto">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
            className="text-white/90 text-xs sm:text-sm font-accent uppercase tracking-[0.2em] mb-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            {locale === 'en' ? 'Handpicked for Lebanese Families' : 'Handpicked for Lebanese Families'}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] text-white leading-[1.05] max-w-[560px]">
            {heroTitle}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16,1,0.3,1] }}
            className="text-white/85 text-base sm:text-lg max-w-[480px] mt-5 leading-relaxed">
            {heroSubtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: [0.16,1,0.3,1] }}
            className="flex flex-wrap gap-3 mt-8">
            <Link to="/shop" className="bg-beige text-dark-teal px-8 py-4 rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors text-base shadow-lg">{t('shopNow', locale)}</Link>
            <Link to="/shop?new=true" className="bg-white/15 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-accent font-medium hover:bg-white/25 transition-colors text-base">{t('viewNewArrivals', locale)}</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7, ease: [0.16,1,0.3,1] }}
            className="flex flex-wrap gap-x-6 gap-y-2 mt-10">
            {heroTrust.map(item => (
              <div key={item.label} className="flex items-center gap-2 text-white/80">
                <item.icon size={15} className="text-sage-green" />
                <span className="text-xs sm:text-sm font-accent">{t(item.label as any, locale)}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"><ChevronDown size={22} /></motion.div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white py-7 border-b border-border-beige/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
            {trustFeatures.map((feat, i) => (
              <ScrollReveal key={feat.title} delay={i * 0.1}
                className={`flex items-center gap-3.5 ${i > 0 ? 'lg:border-l lg:border-border-beige/60 lg:pl-8' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-sage-green/10 flex items-center justify-center shrink-0"><feat.icon size={18} className="text-sage-green" /></div>
                <div>
                  <p className="font-accent text-[13px] font-semibold text-dark-teal leading-tight">{t(feat.title as any, locale)}</p>
                  <p className="text-[12px] text-muted-teal leading-tight mt-0.5">{t(feat.desc as any, locale)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-accent text-xs uppercase tracking-[0.15em] text-muted-teal mb-2">{locale === 'en' ? 'Curated Collections' : 'Curated Collections'}</p>
              <h2 className="font-display text-3xl lg:text-[2.5rem] text-dark-teal">{t('shopByCategory', locale)}</h2>
            </div>
            <Link to="/shop" className="font-accent text-sm font-medium text-muted-teal hover:text-dark-teal transition-colors mb-1">{t('viewAll', locale)} &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
            {categories.slice(0, 6).map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} locale={locale} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-green/10 flex items-center justify-center"><Sparkles size={18} className="text-sage-green" /></div>
              <div>
                <p className="font-accent text-xs uppercase tracking-[0.15em] text-muted-teal mb-1">{locale === 'en' ? 'Fresh In' : 'Fresh In'}</p>
                <h2 className="font-display text-3xl lg:text-[2.5rem] text-dark-teal">{t('newArrivalsTitle', locale)}</h2>
              </div>
            </div>
            <Link to="/shop?new=true" className="font-accent text-sm font-medium text-muted-teal hover:text-dark-teal transition-colors mb-1">{t('viewAll', locale)} &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {newArrivals.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} locale={locale} index={i} />)}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-dark-teal py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #F5F0E6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <ScrollReveal direction="left" className="flex-1">
              <p className="font-accent text-xs uppercase tracking-[0.15em] text-sage-green mb-3">{t('limitedTimeOffer', locale)}</p>
              <h2 className="font-display text-3xl lg:text-[2.5rem] text-cream mb-4 leading-tight">{t('summerSaleTitle', locale)}</h2>
              <p className="text-cream/70 leading-relaxed max-w-[480px] mb-6">{t('summerSaleDesc', locale)}</p>
              <Link to="/shop?sale=true" className="inline-block bg-beige text-dark-teal px-8 py-3.5 rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors">{t('shopTheSale', locale)}</Link>
              <p className="text-beige font-accent font-semibold mt-4 text-sm">{t('endsIn', locale)} {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</p>
            </ScrollReveal>
            <ScrollReveal direction="right" className="flex-1">
              <div className="relative">
                <img src="/images/products/floral-dress.jpg" alt="Summer collection" className="rounded-2xl shadow-2xl w-full max-w-sm mx-auto rotate-1" />
                <div className="absolute -bottom-3 -left-3 bg-sage-green text-white text-sm font-accent font-bold px-4 py-2 rounded-xl shadow-lg">-30%</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="bg-blush-light py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-beige/50 flex items-center justify-center"><Flame size={18} className="text-beige-dark" /></div>
                <div>
                  <p className="font-accent text-xs uppercase tracking-[0.15em] text-muted-teal mb-1">{locale === 'en' ? 'Customer Favorites' : 'Customer Favorites'}</p>
                  <h2 className="font-display text-3xl lg:text-[2.5rem] text-dark-teal">{t('bestSellersTitle', locale)}</h2>
                </div>
              </div>
              <Link to="/shop?bestseller=true" className="font-accent text-sm font-medium text-muted-teal hover:text-dark-teal transition-colors mb-1">{t('viewAll', locale)} &rarr;</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
              {bestSellers.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} locale={locale} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.img src={s.logoImageUrl} alt="Miniyo" className="w-16 h-16 mx-auto mb-6"
            initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', damping: 12 }} />
          <ScrollReveal>
            <p className="font-accent text-xs uppercase tracking-[0.2em] text-sage-green mb-3">{locale === 'en' ? 'Our Story' : 'Our Story'}</p>
            <h2 className="font-display text-3xl lg:text-[2.5rem] text-dark-teal mb-6 leading-tight">{t('ourStoryTitle', locale)}</h2>
            <p className="text-muted-teal text-base sm:text-lg leading-relaxed mb-12 max-w-[640px] mx-auto">{t('ourStoryDesc', locale)}</p>
          </ScrollReveal>
          <div className="grid grid-cols-3 gap-6 lg:gap-10">
            {stats.map(st => (
              <ScrollReveal key={st.label} delay={0.2}>
                <div className="bg-cream rounded-2xl p-5 lg:p-6">
                  <p className="font-display text-3xl lg:text-4xl text-dark-teal">{st.value}{st.suffix}</p>
                  <p className="text-xs sm:text-sm text-muted-teal mt-2">{t(st.label as any, locale)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gift CTA */}
      <section className="bg-beige/40 py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #2D5A4C 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-[800px] mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="w-12 h-12 rounded-2xl bg-beige mx-auto mb-5 flex items-center justify-center"><Package size={22} className="text-dark-teal" /></div>
            <h2 className="font-display text-3xl lg:text-[2.5rem] text-dark-teal mb-4 leading-tight">{t('giftTitle', locale)}</h2>
            <p className="text-muted-teal text-base leading-relaxed mb-8 max-w-[520px] mx-auto">{t('giftDesc', locale)}</p>
            <Link to="/shop?category=sets-bundles" className="inline-block bg-dark-teal text-cream px-8 py-3.5 rounded-xl font-accent font-semibold hover:bg-dark-teal-light transition-colors shadow-lg">{t('shopGiftSets', locale)}</Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-10">
            <p className="font-accent text-xs uppercase tracking-[0.2em] text-sage-green mb-3">{locale === 'en' ? 'Testimonials' : 'Testimonials'}</p>
            <h2 className="font-display text-3xl lg:text-[2.5rem] text-dark-teal">{t('whatParentsSay', locale)}</h2>
          </ScrollReveal>
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div className="flex" animate={{ x: `-${testimonialIndex * 100}%` }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
                {testimonials.map((tm, i) => (
                  <div key={i} className="w-full shrink-0 px-2">
                    <div className="bg-white rounded-2xl p-8 lg:p-10 border border-border-beige/60 shadow-sm">
                      <div className="flex gap-0.5 mb-4">{Array.from({ length: tm.rating }).map((_, si) => <Star key={si} size={16} className="fill-beige-dark text-beige-dark" />)}</div>
                      <p className="text-dark-teal text-base lg:text-lg leading-relaxed mb-6">&ldquo;{tm.text}&rdquo;</p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border-beige/40">
                        <div className="w-9 h-9 rounded-full bg-sage-green/15 flex items-center justify-center"><span className="text-sage-green font-accent text-sm font-semibold">{tm.name.charAt(0)}</span></div>
                        <div><p className="font-accent text-sm font-semibold text-dark-teal">{tm.name}</p><p className="text-xs text-muted-teal">{tm.location}, Lebanon</p></div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIndex(i)} className={`h-2 rounded-full transition-all ${i === testimonialIndex ? 'w-6 bg-dark-teal' : 'w-2 bg-border-beige'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-dark-teal py-14 lg:py-16">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <ScrollReveal>
            <p className="font-accent text-xs uppercase tracking-[0.15em] text-sage-green mb-2">{locale === 'en' ? 'Stay Connected' : 'Stay Connected'}</p>
            <h2 className="font-display text-2xl lg:text-3xl text-cream mb-2">{t('joinFamily', locale)}</h2>
            <p className="text-cream/60 mb-6 text-sm">{t('subscribeDesc', locale)}</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder={t('yourEmail', locale)} className="flex-1 h-12 bg-white/10 border border-white/20 text-cream placeholder:text-cream/40 rounded-xl px-4 outline-none focus:border-sage-green/50 transition-colors font-body text-sm" />
              <button type="submit" className="h-12 bg-beige text-dark-teal px-6 rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors shrink-0 text-sm">{t('subscribe', locale)}</button>
            </form>
            <p className="text-cream/40 text-xs mt-3">{t('noSpam', locale)}</p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
