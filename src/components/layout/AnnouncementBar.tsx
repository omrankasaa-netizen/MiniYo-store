import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Locale } from '@/types'

interface AnnouncementBarProps {
  locale: Locale
}

const messages = ['freeDelivery', 'securePayments', 'support24_7']

export function AnnouncementBar({ locale }: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('announcement-dismissed') === 'true'
  })

  const nextMessage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % messages.length)
  }, [])

  useEffect(() => {
    if (dismissed) return
    const interval = setInterval(nextMessage, 5000)
    return () => clearInterval(interval)
  }, [dismissed, nextMessage])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('announcement-dismissed', 'true')
  }

  if (dismissed) return null

  const getMessageText = (key: string) => {
    switch (key) {
      case 'freeDelivery': return `${t('freeDelivery', locale)} — ${t('freeDeliveryDesc', locale)}`
      case 'securePayments': return `${t('securePayments', locale)} — ${t('securePaymentsDesc', locale)}`
      case 'support24_7': return `${t('support24_7', locale)} — ${t('support24_7Desc', locale)}`
      default: return ''
    }
  }

  return (
    <div className="bg-dark-teal h-9 flex items-center justify-center relative">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-cream font-accent text-[13px] font-medium px-8 text-center"
        >
          {getMessageText(messages[currentIndex])}
        </motion.p>
      </AnimatePresence>
      <button
        onClick={handleDismiss}
        className="absolute right-4 text-cream/60 hover:text-cream transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}
