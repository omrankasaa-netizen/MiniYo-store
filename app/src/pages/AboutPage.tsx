// About page
import { Gem, Palette, Wallet, Zap } from 'lucide-react'
import { t } from '@/lib/i18n'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import type { Locale } from '@/types'

interface AboutPageProps {
  locale: Locale
}

const values = [
  { icon: Gem, title: 'premiumMaterials', desc: 'premiumMaterialsDesc' },
  { icon: Palette, title: 'adorableDesigns', desc: 'adorableDesignsDesc' },
  { icon: Wallet, title: 'affordablePrices', desc: 'affordablePricesDesc' },
  { icon: Zap, title: 'fastDelivery', desc: 'fastDeliveryDesc' },
]

export function AboutPage({ locale }: AboutPageProps) {
  return (
    <div>
      {/* Hero */}
      <div className="bg-dark-teal py-20 text-center">
        <ScrollReveal>
          <h1 className="font-display text-4xl lg:text-5xl text-cream mb-4">{t('aboutTitle', locale)}</h1>
          <p className="text-cream/80 max-w-[600px] mx-auto px-4 leading-relaxed">{t('aboutDesc', locale)}</p>
        </ScrollReveal>
      </div>

      {/* Story */}
      <div className="bg-cream py-16 lg:py-24">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <ScrollReveal className="lg:w-1/2">
              <img src="/images/hero.jpg" alt="Baby in Miniyo" className="rounded-2xl w-full" />
            </ScrollReveal>
            <ScrollReveal delay={0.2} className="lg:w-1/2">
              <div className="space-y-4 text-dark-teal leading-relaxed">
                <p>
                  {locale === 'ar'
                    ? 'بدأت مينيو كحلم بسيط — توفير ملابس أطفال لطيفة ومريحة وبأسعار معقولة للعائلات في لبنان. من يومنا الأول، كان هدفنا واضحاً: جعل كل طفل يبدو ويشعر بأفضل حال.'
                    : 'Miniyo started as a simple dream — to provide cute, comfortable, and affordable children\'s clothing for families in Lebanon. From day one, our goal was clear: make every child look and feel their best.'}
                </p>
                <p>
                  {locale === 'ar'
                    ? 'نختار كل قطعة في مجموعتنا بعناية فائقة، مع التركيز على الأقمشة الناعمة والتصاميم المحببة والمتانة التي تتحمل مغامرات الأطفال اليومية.'
                    : 'We carefully select every piece in our collection, focusing on soft fabrics, adorable designs, and durability that can withstand kids\' daily adventures.'}
                </p>
              </div>
              <blockquote className="mt-6 pl-5 border-l-3 border-beige">
                <p className="font-display text-xl text-beige italic">
                  {t('ourStoryTitle', locale)}
                </p>
              </blockquote>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl text-dark-teal">{t('whyChooseMiniyo', locale)}</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1} className="text-center">
                <div className="w-14 h-14 bg-sage-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon size={28} className="text-sage-green" />
                </div>
                <h3 className="font-accent font-semibold text-dark-teal mb-2">{t(v.title as any, locale)}</h3>
                <p className="text-sm text-muted-teal">{t(v.desc as any, locale)}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
