import { useState, useEffect } from 'react'
import { useAdminSettings, useAdminFaqs } from '@/hooks/useMiniyo'

const SETTING_GROUPS = [
  {
    label: 'Store Info',
    keys: [
      { key: 'store_name', label: 'Store Name' },
      { key: 'store_name_ar', label: 'Store Name (AR)' },
      { key: 'store_email', label: 'Contact Email' },
      { key: 'store_phone', label: 'Contact Phone' },
      { key: 'store_address', label: 'Address' },
    ],
  },
  {
    label: 'Commerce',
    keys: [
      { key: 'currency', label: 'Currency' },
      { key: 'delivery_fee', label: 'Default Delivery Fee' },
      { key: 'free_delivery_threshold', label: 'Free Delivery Threshold' },
      { key: 'tax_rate', label: 'Tax Rate (%)' },
    ],
  },
  {
    label: 'Social',
    keys: [
      { key: 'instagram_url', label: 'Instagram URL' },
      { key: 'facebook_url', label: 'Facebook URL' },
      { key: 'whatsapp_number', label: 'WhatsApp Number' },
    ],
  },
]

interface Props {
  section?: string
}

export function SettingsModule({ section }: Props) {
  const { dbSettings, isLoading, setBulk } = useAdminSettings() as any
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (dbSettings) {
      const map: Record<string, string> = {}
      for (const { key, value } of dbSettings) map[key] = value
      setLocalSettings(map)
    }
  }, [dbSettings])

  async function handleSave() {
    setSaving(true)
    try {
      await setBulk(
        Object.entries(localSettings).map(([key, value]) => ({ key, value }))
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (section === 'audit') return <AuditSection />
  if (section === 'staff') return <StaffSection />
  if (section === 'shipping') return <ShippingSection settings={localSettings} onChange={setLocalSettings} onSave={handleSave} saving={saving} />

  return (
    <div className="space-y-6 max-w-2xl">
      {saved && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">✓ Settings saved successfully</div>
      )}
      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
      ) : (
        SETTING_GROUPS.map(group => (
          <div key={group.label} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{group.label}</h2>
            </div>
            <div className="p-6 space-y-4">
              {group.keys.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input
                    type="text"
                    value={localSettings[key] || ''}
                    onChange={e => setLocalSettings(s => ({ ...s, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]/30"
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      <button
        onClick={handleSave}
        disabled={saving || isLoading}
        className="px-6 py-2.5 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  )
}

function ShippingSection({ settings, onChange, onSave, saving }: any) {
  return (
    <div className="space-y-4 max-w-lg">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Shipping Zones</h2>
        {[
          { key: 'delivery_fee', label: 'Default Delivery Fee ($)' },
          { key: 'free_delivery_threshold', label: 'Free Delivery Threshold ($)' },
          { key: 'beirut_delivery_fee', label: 'Beirut Delivery Fee ($)' },
          { key: 'outside_beirut_fee', label: 'Outside Beirut Fee ($)' },
          { key: 'south_fee', label: 'South Lebanon Fee ($)' },
          { key: 'north_fee', label: 'North Lebanon Fee ($)' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
              type="number"
              value={settings[key] || ''}
              onChange={e => onChange((s: any) => ({ ...s, [key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        ))}
      </div>
      <button onClick={onSave} disabled={saving} className="px-6 py-2.5 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Shipping Settings'}
      </button>
    </div>
  )
}

function AuditSection() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('@/lib/trpc').then(({ trpc }) => {
      trpc.audit.list.query().then(data => {
        setLogs(data as any[])
        setLoading(false)
      })
    })
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold">Audit Log</h2></div>
      {loading ? (
        <div className="p-6 space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}</div>
      ) : !logs.length ? (
        <p className="p-8 text-center text-gray-400">No audit logs</p>
      ) : (
        <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
          {logs.map(l => (
            <div key={l.id} className="px-6 py-3 flex items-center justify-between text-sm">
              <div>
                <span className="font-medium text-gray-900">{l.action}</span>
                <span className="text-gray-500 ml-2">{l.entity}{l.entityId ? ` #${l.entityId}` : ''}</span>
                {l.details && <p className="text-xs text-gray-400 mt-0.5">{l.details}</p>}
              </div>
              <div className="text-xs text-gray-400 text-right">
                <div>{l.user || 'system'}</div>
                <div>{new Date(l.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StaffSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <div className="text-4xl mb-3">👥</div>
      <p className="text-gray-500 text-sm">Staff management via database. Add users with <code className="bg-gray-100 px-1 rounded">role = 'admin'</code> directly in MySQL.</p>
    </div>
  )
}
