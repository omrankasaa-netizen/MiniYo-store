import { useState } from 'react'
import { useAdminMedia } from '@/hooks/useMiniyo'

const MEDIA_TYPES = ['product', 'logo', 'hero', 'brand_kit', 'sticker', 'cms']

export function MediaModule() {
  const { data: media, isLoading, createMedia, deleteMedia, refetch } = useAdminMedia() as any
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState('')
  const [form, setForm] = useState({ url: '', name: '', type: 'product', altEn: '', altAr: '' })

  const filtered = typeFilter ? (media ?? []).filter((m: any) => m.type === typeFilter) : (media ?? [])

  async function handleCreate() {
    if (!form.url || !form.name) { setError('URL and name required'); return }
    setSaving(true)
    setError(null)
    try {
      await createMedia(form)
      setModalOpen(false)
      setForm({ url: '', name: '', type: 'product', altEn: '', altAr: '' })
    } catch (e: any) {
      setError(e?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All types</option>
          {MEDIA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={() => refetch()} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">↻</button>
        <button onClick={() => { setModalOpen(true); setError(null) }} className="px-4 py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54]">+ Add Media</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : !filtered.length ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-100">
          <div className="text-4xl mb-3">🖼️</div><p>No media assets</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(filtered as any[]).map(m => (
            <div key={m.id} className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gray-50">
                <img src={m.url} alt={m.altEn || m.name} width={200} height={200} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-800 truncate">{m.name}</p>
                <p className="text-xs text-gray-400">{m.type}</p>
              </div>
              <button
                onClick={() => deleteMedia(m.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Add Media Asset</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm mb-3">{error}</div>}
            <div className="space-y-3">
              {[['url', 'Image URL'], ['name', 'Name'], ['altEn', 'Alt Text (EN)'], ['altAr', 'Alt Text (AR)']].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input
                    type="text"
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  {MEDIA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {form.url && <img src={form.url} alt="preview" width={80} height={80} loading="lazy" className="w-20 h-20 object-cover rounded-lg border border-gray-100" />}
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="px-6 py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] disabled:opacity-50">
                {saving ? 'Saving…' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
