import { useState } from 'react'
import { useAdminCms } from '@/hooks/useMiniyo'

export function CmsModule() {
  const { sections, isLoading, upsertSection, deleteSection, refetch } = useAdminCms() as any
  const [editSection, setEditSection] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<any>({})

  function openEdit(s: any) {
    setEditSection(s)
    setForm({ ...s })
    setError(null)
  }

  function openNew() {
    setEditSection({ _new: true })
    setForm({ key: '', title: '', titleAr: '', body: '', bodyAr: '', imageUrl: '', isActive: true, sortOrder: 0 })
    setError(null)
  }

  async function handleSave() {
    if (!form.key) { setError('Key is required'); return }
    setSaving(true)
    setError(null)
    try {
      await upsertSection(form)
      setEditSection(null)
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(key: string) {
    if (!confirm(`Delete section "${key}"?`)) return
    await deleteSection(key)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">CMS Sections</h2>
        <button onClick={openNew} className="px-4 py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] transition-colors">+ New Section</button>
      </div>

      <div className="grid gap-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)
        ) : !(sections as any[]).length ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-100">
            <div className="text-4xl mb-3">📝</div><p>No CMS sections yet</p>
          </div>
        ) : (
          (sections as any[]).map(s => (
            <div key={s.key} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{s.key}</code>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {s.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                {s.title && <p className="font-medium text-gray-900 text-sm">{s.title}</p>}
                {s.titleAr && <p className="text-gray-500 text-xs">{s.titleAr}</p>}
                {s.body && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{s.body}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(s)} className="text-[#01696f] hover:underline text-xs font-medium">Edit</button>
                <button onClick={() => handleDelete(s.key)} className="text-red-500 hover:underline text-xs">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {editSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditSection(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-lg">{editSection._new ? 'New Section' : `Edit: ${editSection.key}`}</h2>
              <button onClick={() => setEditSection(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
              {[
                ['key', 'Key (unique identifier)', 'text'],
                ['title', 'Title (EN)', 'text'],
                ['titleAr', 'Title (AR)', 'text'],
                ['imageUrl', 'Image URL', 'text'],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input
                    type="text"
                    value={form[key] || ''}
                    readOnly={key === 'key' && !editSection._new}
                    onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]/30 read-only:bg-gray-50"
                  />
                </div>
              ))}
              {[['body', 'Body (EN)'], ['bodyAr', 'Body (AR)']].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <textarea
                    rows={3}
                    value={form[key] || ''}
                    onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              ))}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive ?? true} onChange={e => setForm((f: any) => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                <span className="text-sm">Active</span>
              </label>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setEditSection(null)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
