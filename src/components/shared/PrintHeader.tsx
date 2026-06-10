import { useAdminStore } from '@/stores/adminStore'

interface PrintHeaderProps {
  title: string
  subtitle?: string
}

export function PrintHeader({ title, subtitle }: PrintHeaderProps) {
  const settings = useAdminStore(s => s.settings)
  const now = new Date()
  const formatted = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="print-only mb-6 pb-4 border-b-2 border-[#2D5A4C]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D5A4C] tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[#8B8578] mt-1">{subtitle}</p>}
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-[#2D5A4C]">{settings.storeName || 'Miniyo'}</p>
          <p className="text-[10px] text-[#8B8578] mt-0.5">{settings.phone || '+961 81 38 59 40'}</p>
          <p className="text-[10px] text-[#8B8578]">{settings.email || 'miniyo.store.lb@gmail.com'}</p>
        </div>
      </div>
      <p className="text-[10px] text-[#A8A396] mt-3 flex items-center gap-2">
        <span>Printed on {formatted}</span>
        <span className="text-[#D4CFC6]">|</span>
        <span>Miniyo Admin Panel</span>
      </p>
    </div>
  )
}
