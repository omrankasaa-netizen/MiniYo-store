import { Printer } from 'lucide-react'
import { useState } from 'react'

interface Props {
  label?: string
  onBeforePrint?: () => void
}

export function PrintButton({ label = 'Print', onBeforePrint }: Props) {
  const [printing, setPrinting] = useState(false)

  const handlePrint = () => {
    onBeforePrint?.()
    setPrinting(true)
    // Small delay to let any state updates render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print()
        setPrinting(false)
      })
    })
  }

  return (
    <button
      onClick={handlePrint}
      disabled={printing}
      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#D4CFC6] text-[#5C6B60] rounded-lg text-xs font-medium hover:bg-[#F2EFE9] hover:text-[#2D5A4C] transition-colors print:hidden"
    >
      <Printer size={14} />
      {label}
    </button>
  )
}
