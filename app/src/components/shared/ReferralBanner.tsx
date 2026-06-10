import { useState } from 'react'
import { Copy, Check, Gift } from 'lucide-react'
import { useMemberStore } from '@/stores/memberStore'
import type { Locale } from '@/types'

interface ReferralBannerProps {
  locale: Locale
}

export function ReferralBanner({ locale }: ReferralBannerProps) {
  const customer = useMemberStore(s => s.customer)
  const referralCode = useMemberStore(s => s.getReferralCode)()
  const referralUrl = useMemberStore(s => s.getReferralUrl)()
  const [copied, setCopied] = useState(false)

  if (!customer) return null

  const isAr = locale === 'ar'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gradient-to-r from-[#D4A843]/10 via-[#CD7F32]/5 to-[#D4A843]/10 border border-[#D4A843]/20 rounded-2xl p-5 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#D4A843]/15 flex items-center justify-center shrink-0">
          <Gift size={20} className="text-[#B8923A]" />
        </div>
        <div className="flex-1">
          <h4 className="font-accent font-semibold text-dark-teal text-sm mb-1">
            {isAr ? 'شاركي مينيو مع صديقاتك' : 'Share Miniyo with Friends'}
          </h4>
          <p className="text-xs text-muted-teal mb-3">
            {isAr
              ? `ادعي صديقة واحصلي على $5 رصيد عند تسجيلها. أنتي حالياً دعيتي ${customer.referralCount} صديقات.`
              : `Invite a friend and earn $5 credit when they join. You've invited ${customer.referralCount} friends so far.`}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border border-border-beige rounded-lg px-3 py-2 text-xs text-dark-teal font-medium truncate">
              {referralCode}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-dark-teal text-cream rounded-lg text-xs font-medium hover:bg-dark-teal-light transition-colors"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
