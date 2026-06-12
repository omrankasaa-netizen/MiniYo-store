import { useState } from 'react'
import { useAdminProducts } from '@/hooks/useMiniyo'

export function ProductsModule() {
  const { data: products, isLoading, createProduct, updateProduct, deleteProduct } = useAdminProducts() as any
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', nameAr: '', slug: '', sku: '', price: '', compareAtPrice: '',
    stockQuantity: '0', description: '', imageUrl: '', isActive: true,
    isNew: false, isFeatured: false, isBestseller: false,
    gender: '', categorySlug: '',
  })

  const filtered = (products ?? []).filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditProduct(null)
    setForm({ name: '', nameAr: '', slug: '', sku: '', price: '', compareAtPrice: '', stockQuantity: '0', description: '', imageUrl: '', isActive: true, isNew: false, isFeatured: false, isBestseller: false, gender: '', categorySlug: '' })
    setError(null)
    setModalOpen(true)
  }

  function openEdit(p: any) {
    setEditProduct(p)
    setForm({
      name: p.name || '', nameAr: p.nameAr || '', slug: p.slug || '', sku: p.sku || '',
      price: String(p.price || ''), compareAtPrice: String(p.compareAtPrice || ''),
      stockQuantity: String(p.stockQuantity ?? 0), description: p.description || '',
      imageUrl: p.imageUrl || '', isActive: p.isActive ?? true, isNew: p.isNew ?? false,
      isFeatured: p.isFeatured ?? false, isBestseller: p.isBestseller ?? false,
      gender: p.gender || '', categorySlug: p.categorySlug || '',
    })
    setError(null)
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.slug || !form.sku || !form.price) {
      setError('Name, slug, SKU and price are required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        stockQuantity: parseInt(form.stockQuantity) || 0,
      }
      if (editProduct) {
        await updateProduct(editProduct.id, payload)
      } else {
        await createProduct(payload)
      }
      setModalOpen(false)
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]/30"
        />
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] transition-colors"
        >
          + New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">🏷️</div>
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Image', 'Name', 'SKU', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} width={40} height={40} loading="lazy" className="w-10 h-10 object-cover rounded-lg border border-gray-100" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">IMG</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-gray-400 text-xs">{p.nameAr}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">
                      ${parseFloat(p.price || 0).toFixed(2)}
                      {p.compareAtPrice && <span className="text-gray-400 line-through ml-1 text-xs">${parseFloat(p.compareAtPrice).toFixed(2)}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`tabular-nums font-medium ${
                        (p.stockQuantity ?? 0) === 0 ? 'text-red-600' : (p.stockQuantity ?? 0) <= 5 ? 'text-amber-600' : 'text-green-700'
                      }`}>{p.stockQuantity ?? 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="text-[#01696f] hover:underline text-xs font-medium">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-lg">{editProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['name', 'Name (EN)', 'text'],
                  ['nameAr', 'Name (AR)', 'text'],
                  ['slug', 'Slug', 'text'],
                  ['sku', 'SKU', 'text'],
                  ['price', 'Price ($)', 'number'],
                  ['compareAtPrice', 'Compare At Price ($)', 'number'],
                  ['stockQuantity', 'Stock Qty', 'number'],
                  ['imageUrl', 'Image URL', 'text'],
                  ['categorySlug', 'Category Slug', 'text'],
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">—</option>
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['isActive', 'Active'],
                  ['isNew', 'New Arrival'],
                  ['isFeatured', 'Featured'],
                  ['isBestseller', 'Bestseller'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description (EN)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]/30"
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
