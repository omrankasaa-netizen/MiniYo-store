import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'

let toastHandler: ((msg: string) => void) | null = null

export function showToast(message: string) {
  toastHandler?.(message)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])

  useEffect(() => {
    toastHandler = (msg: string) => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, msg }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800)
    }
    return () => { toastHandler = null }
  }, [])

  const el = document.getElementById('toast-root')
  if (!el) return null

  return createPortal(
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto bg-dark-teal text-cream px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[240px]"
          >
            <CheckCircle size={18} className="text-sage-green shrink-0" />
            <span className="text-sm font-medium">{t.msg}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="ml-auto text-cream/60 hover:text-cream">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    el
  )
}
