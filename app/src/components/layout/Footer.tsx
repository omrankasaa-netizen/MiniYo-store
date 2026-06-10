import { Link } from 'react-router'
import { Instagram, Facebook, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { t } from '@/lib/i18n'
import type { Locale } from '@/types'

interface FooterProps {
  locale: Locale
}

export function Footer({ locale }: FooterProps) {
  const settings = useAdminStore(s => s.settings)
  const logoUrl = settings.logoImageUrl
  const igHandle = settings.instagram || 'Miniyo.store.lb'
  const fbHandle = settings.facebook || 'Miniyo.store.lb'
  const emailAddr = settings.email || 'miniyo.store.lb@gmail.com'
  const footerImage = settings.footerImageUrl || ''
  return (
    <footer className="bg-dark-teal text-cream">
      {/* Footer Image / Banner */}
      {footerImage && (
        <div className="w-full flex justify-center pt-10 pb-2">
          <img src={footerImage} alt="Miniyo" className="h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
        </div>
      )}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logoUrl || '/images/logo.png'} alt="Miniyo" className="h-12 w-auto" />
              <div>
                <span className="font-display text-xl text-cream">Miniyo</span>
                <span className="block text-[9px] text-cream/40 tracking-[0.15em] uppercase font-accent">
                  {locale === 'en' ? 'Baby Boutique' : 'بوتيك الأطفال'}
                </span>
              </div>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed mb-5 max-w-[280px]">
              {t('tagline', locale)}
            </p>
            <div className="flex items-center gap-3">
              <a href={`https://instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-cream/50 hover:text-cream hover:bg-white/10 transition-all">
                <Instagram size={17} />
              </a>
              <a href={`https://facebook.com/${fbHandle}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-cream/50 hover:text-cream hover:bg-white/10 transition-all">
                <Facebook size={17} />
              </a>
              <a href="https://wa.me/96181385940" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-cream/50 hover:text-cream hover:bg-white/10 transition-all">
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-accent text-[10px] font-semibold uppercase tracking-[0.15em] text-cream/40 mb-4">
              {t('quickLinks', locale)}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'home', href: '/' },
                { label: 'shop', href: '/shop' },
                { label: 'about', href: '/about' },
                { label: 'contact', href: '/contact' },
                { label: 'faqTitle', href: '/faq' },
                { label: 'trackOrder', href: '/track-order' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-cream/60 text-sm hover:text-cream hover:translate-x-0.5 inline-block transition-all"
                  >
                    {t(link.label as any, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h4 className="font-accent text-[10px] font-semibold uppercase tracking-[0.15em] text-cream/40 mb-4">
              {t('categories', locale)}
            </h4>
            <ul className="space-y-2.5">
              {[
                'Bodysuits & Rompers',
                'Tops & T-Shirts',
                'Bottoms & Pants',
                'Outerwear & Jackets',
                'Dresses',
                'Sets & Bundles',
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${cat.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                    className="text-cream/60 text-sm hover:text-cream hover:translate-x-0.5 inline-block transition-all"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="font-accent text-[10px] font-semibold uppercase tracking-[0.15em] text-cream/40 mb-4">
              {t('contactUs', locale)}
            </h4>
            <div className="space-y-3">
              <a href="tel:+96181385940" className="flex items-center gap-3 text-cream/60 text-sm hover:text-cream transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Phone size={14} />
                </div>
                +961 81 38 59 40
              </a>
              <a href={`mailto:${emailAddr}`} className="flex items-center gap-3 text-cream/60 text-sm hover:text-cream transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail size={14} />
                </div>
                {emailAddr}
              </a>
              <div className="flex items-center gap-3 text-cream/60 text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                Al Koura, North Lebanon
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/10 mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/40 text-xs">
            &copy; {new Date().getFullYear()} Miniyo. {t('rights', locale)}
          </p>
          <div className="flex items-center gap-3 text-cream/40 text-xs">
            <Link to="/privacy" className="hover:text-cream/70 transition-colors">{t('privacyPolicy', locale)}</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-cream/70 transition-colors">{t('termsOfService', locale)}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
