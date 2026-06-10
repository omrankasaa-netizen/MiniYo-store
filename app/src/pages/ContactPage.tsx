import { useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react'
import { t } from '@/lib/i18n'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import type { Locale } from '@/types'

interface ContactPageProps {
  locale: Locale
}

export function ContactPage({ locale }: ContactPageProps) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'general', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div>
      <div className="bg-cream py-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="font-display text-4xl text-dark-teal text-center mb-2">{t('getInTouch', locale)}</h1>
            <p className="text-muted-teal text-center mb-10">{t('getInTouchDesc', locale)}</p>
          </ScrollReveal>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <ScrollReveal className="flex-1">
              {sent ? (
                <div className="text-center py-16">
                  <img src="/images/logo.png" alt="" className="w-20 h-20 mx-auto mb-4" />
                  <h3 className="font-display text-2xl text-dark-teal mb-2">
                    {locale === 'ar' ? 'تم إرسال رسالتك!' : 'Message Sent!'}
                  </h3>
                  <p className="text-muted-teal">{locale === 'ar' ? 'سنرد عليك قريباً.' : 'We will get back to you soon.'}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t('name', locale)} className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20" />
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder={t('email', locale)} className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20" />
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder={t('phone', locale) + ' (' + (locale === 'ar' ? 'اختياري' : 'optional') + ')'} className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20" />
                  <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={t('message', locale)} rows={5} className="w-full border border-border-beige rounded-lg px-4 py-3 bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20 resize-y" />
                  <button type="submit" className="w-full h-12 bg-beige text-dark-teal rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors">
                    {t('sendMessage', locale)}
                  </button>
                </form>
              )}
            </ScrollReveal>

            {/* Contact Info */}
            <ScrollReveal delay={0.2} className="lg:w-[360px]">
              {/* WhatsApp Card */}
              <a
                href="https://wa.me/96181385940"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#25D366] rounded-2xl p-6 text-center text-white mb-6 hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={32} className="mx-auto mb-3" />
                <h3 className="font-accent font-semibold text-lg mb-1">{t('chatOnWhatsApp', locale)}</h3>
                <p className="text-white/90 mb-1">+961 81 38 59 40</p>
                <p className="text-white/70 text-sm">{t('usuallyReplies', locale)}</p>
                <span className="inline-block mt-3 bg-white text-[#25D366] px-4 py-2 rounded-lg font-medium text-sm">
                  {t('startChat', locale)}
                </span>
              </a>

              {/* Info Cards */}
              <div className="space-y-4">
                {[
                  { icon: Phone, value: '+961 81 38 59 40', label: 'Mon-Sat, 9am-6pm' },
                  { icon: Mail, value: 'miniyo.store.lb@gmail.com', label: t('weReplyWithin', locale) },
                  { icon: MapPin, value: 'Al Koura, North Lebanon', label: 'Lebanon' },
                ].map(item => (
                  <div key={item.value} className="bg-white rounded-xl p-5 border border-border-beige">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sage-green/10 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon size={18} className="text-sage-green" />
                      </div>
                      <div>
                        <p className="font-medium text-dark-teal text-sm">{item.value}</p>
                        <p className="text-muted-teal text-xs">{item.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="flex items-center gap-4 mt-6">
                <a href="https://instagram.com/Miniyo.store.lb" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-border-beige rounded-lg flex items-center justify-center text-dark-teal hover:text-beige hover:border-beige transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="https://facebook.com/Miniyo.store.lb" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-border-beige rounded-lg flex items-center justify-center text-dark-teal hover:text-beige hover:border-beige transition-colors">
                  <Facebook size={18} />
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}
