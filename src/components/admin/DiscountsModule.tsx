import { useState } from 'react'
import { useAdminPromos } from '@/hooks/useMiniyo'

export function DiscountsModule() {
  const { data: promos, isLoading, createPromo, deletePromo, refetch } = useAdminPromos() as any
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    code: '', discountType: 'percentage', discountValue: '',
    minOrderAmount: '0', maxDiscount: '', usageLimit: '',
    validFrom: '', validUntil: '', isActive: true,
  })

  async function handleCreate() {
    if (!form.code || !form.discountValue) { setError('Code and value are required'); return }
    setSaving(true)
    setError(null)
    try {
      await createPromo({
        ...form,
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: parseFloat(form.minOrderAmount) || 0,
        maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
      })
      setModalOpen(false)
      setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '0', maxDiscount: '', usageLimit: '', validFrom: '', validUntil: '', isActive: true })
    } catch (e: any) {
      setError(e?.message || 'Failed to create')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Promo Codes</h2>
        <button
          onClick={() => { setModalOpen(true); setError(null) }}
          className="px-4 py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] transition-colors"
        >+ New Code</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : !promos?.length ? (
          <div className="p-12 text-center text-gray-400"><div className="text-4xl mb-3">🏷️</div><p>No promo codes yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Code', 'Type', 'Value', 'Min Order', 'Usage', 'Expires', 'Active', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(promos as any[]).map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">{p.code}</td>
                    <td className="px-4 py-3 text-gray-600">{p.discountType}</td>
                    <td className="px-4 py-3 tabular-nums font-medium">{p.discountType === 'percentage' ? `${p.discountValue}%` : `$${p.discountValue}`}</td>
                    <td className="px-4 py-3 tabular-nums">${p.minOrderAmount || 0}</td>
                    <td className="px-4 py-3 text-gray-500">{p.usageCount || 0}{p.usageLimit ? `/${p.usageLimit}` : ''}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{p.validUntil ? new Date(p.validUntil).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {p.isActive ? 'Active' : 'Off'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deletePromo(p.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">New Promo Code</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm mb-3">{error}</div>}
            <div className="space-y-3">
              {[
                ['code', 'Code', 'text'],
                ['discountValue', 'Discount Value', 'number'],
                ['minOrderAmount', 'Min Order Amount ($)', 'number'],
                ['maxDiscount', 'Max Discount ($)', 'number'],
                ['usageLimit', 'Usage Limit', 'number'],
                ['validFrom', 'Valid From', 'date'],
                ['validUntil', 'Valid Until', 'date'],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]/30"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select
                  value={form.discountType}
                  onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                <span className="text-sm">Active</span>
              </label>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="px-6 py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] disabled:opacity-50"
              >{saving ? 'Saving…' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
