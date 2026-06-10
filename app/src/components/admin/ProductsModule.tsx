import { useState, useRef } from 'react'
import { Search, Pencil, Trash2, Upload, X, Save, ChevronDown, Check, Image } from 'lucide-react'
import { useAdminProducts } from '@/hooks/useMiniyo'
import { useAdminStore } from '@/stores/adminStore'
import { formatPrice } from '@/lib/i18n'
import { PrintButton } from '@/components/shared/PrintButton'
import { PrintHeader } from '@/components/shared/PrintHeader'

export function ProductsModule() {
  const { products, updateProduct, deleteProduct, addProductImage, bulkUpdate } = useAdminProducts()
  const store = useAdminStore()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [photoProduct, setPhotoProduct] = useState<any>(null)
  const [stockEdit, setStockEdit] = useState<{ id: string; val: number } | null>(null)
  const [page, setPage] = useState(1)
  const [savedToast, setSavedToast] = useState(false)
  const perPage = 15
  const fileRef = useRef<HTMLInputElement>(null)

  // Derive categories from products
  const catMap = new Map<string, string>()
  products.forEach((p: any) => {
    if (p.categoryName && !catMap.has(p.categoryName)) {
      catMap.set(p.categoryName, p.categoryName)
    }
    if (p.category?.name && !catMap.has(p.category.name)) {
      catMap.set(p.category.name, p.category.name)
    }
  })
  const categoryNames = Array.from(catMap.keys())

  const filtered = products.filter((p: any) => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
    const catName = p.categoryName || p.category?.name || ''
    const matchCat = !catFilter || catName === catFilter
    const pStatus = p.isActive === false ? 'draft' : 'active'
    const matchStatus = !statusFilter || pStatus === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const showSaved = () => {
    setSavedToast(true)
    store.markPending()
    setTimeout(() => setSavedToast(false), 2000)
  }

  const handlePhotoUpload = () => {
    if (!photoProduct || !fileRef.current?.files?.[0]) return
    addProductImage(
      photoProduct.id,
      photoProduct.slug,
      fileRef.current.files[0],
      () => {
        setPhotoProduct(null)
        showSaved()
      }
    )
  }

  const handleStockSave = (id: string) => {
    if (!stockEdit) return
    const product = products.find((p: any) => String(p.id) === String(id))
    if (!product) return
    const prev = product.stockQuantity || 0
    const delta = stockEdit.val - prev
    updateProduct(id, { stockQuantity: stockEdit.val })
    store.addMovement({
      productId: String(id), productName: product.name || '', type: 'adjustment',
      quantity: delta, previousStock: prev, newStock: stockEdit.val,
      note: 'Manual adjustment', createdBy: 'Omran',
    })
    setStockEdit(null)
    showSaved()
  }

  const handleSaveEdit = () => {
    if (!editing) return
    const { id, ...updates } = editing
    updateProduct(id, updates)
    setEditing(null)
    showSaved()
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this product?')) return
    deleteProduct(id)
    showSaved()
  }

  const handleBulkActivate = () => {
    if (selectedIds.length === 0) return
    bulkUpdate(selectedIds, { isActive: true })
    setSelectedIds([])
    showSaved()
  }

  return (
    <div className="space-y-4">
      <PrintHeader title="Product Catalog Report" subtitle={`${filtered.length} products — ${categoryNames.length} categories`} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#2D5A4C] print-section-header">Products</h2>
        <PrintButton label="Print Products" />
      </div>
      {/* Saved Toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg z-50 flex items-center gap-2 text-sm font-medium animate-in slide-in-from-bottom-2">
          <Check size={16} /> Saved — click &quot;Apply Changes&quot; to publish
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A396]" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search name or SKU..." className="w-full h-10 border border-[#D4CFC6] rounded-lg pl-9 pr-3 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20" />
        </div>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1) }} className="h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]">
          <option value="">All Categories</option>
          {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
        {selectedIds.length > 0 && (
          <button onClick={handleBulkActivate} className="h-10 px-4 bg-[#8FAE7B] text-white rounded-lg text-sm font-medium hover:bg-[#7A9A68]">
            Activate ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Product Count */}
      <p className="text-xs text-[#8B8578]">{filtered.length} products found</p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F2EFE9] border-b border-[#D4CFC6]">
                <th className="px-3 py-3"><input type="checkbox" checked={selectedIds.length === paginated.length && paginated.length > 0} onChange={e => setSelectedIds(e.target.checked ? paginated.map((p: any) => String(p.id)) : [])} className="rounded border-[#D4CFC6]" /></th>
                <th className="text-left px-2 py-3 font-semibold text-[#2D5A4C] text-xs">Photo</th>
                <th className="text-left px-3 py-3 font-semibold text-[#2D5A4C] text-xs">Product</th>
                <th className="text-left px-3 py-3 font-semibold text-[#2D5A4C] text-xs">SKU</th>
                <th className="text-left px-3 py-3 font-semibold text-[#2D5A4C] text-xs">Cat</th>
                <th className="text-left px-3 py-3 font-semibold text-[#2D5A4C] text-xs">Price</th>
                <th className="text-left px-3 py-3 font-semibold text-[#2D5A4C] text-xs">Stock</th>
                <th className="text-left px-3 py-3 font-semibold text-[#2D5A4C] text-xs">Status</th>
                <th className="text-right px-3 py-3 font-semibold text-[#2D5A4C] text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p: any) => (
                <tr key={p.id} className="border-b border-[#F2EFE9] hover:bg-[#FAFAF7] transition-colors">
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedIds.includes(String(p.id))} onChange={() => toggleSelect(String(p.id))} className="rounded border-[#D4CFC6]" /></td>
                  <td className="px-2 py-3">
                    {p.images && p.images.length > 0 ? (
                      <div className="relative group">
                        <img src={p.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <button
                          onClick={() => {
                            if (confirm('Remove this product photo?')) {
                              updateProduct(p.id, { images: p.images.filter((_: any, i: number) => i !== 0) })
                              showSaved()
                            }
                          }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove photo"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : p.imageUrl ? (
                      <div className="relative group">
                        <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <button
                          onClick={() => {
                            if (confirm('Remove this product photo?')) {
                              updateProduct(p.id, { imageUrl: null, images: [] })
                              showSaved()
                            }
                          }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove photo"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setPhotoProduct(p)} className="w-10 h-10 rounded-lg bg-[#F2EFE9] border border-[#D4CFC6] flex items-center justify-center hover:bg-[#E8E4DB] transition-colors" title="Upload photo">
                        <Image size={14} className="text-[#A8A396]" />
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-[#2D5A4C] font-medium max-w-[200px] truncate">{p.name}</p>
                    <p className="text-[11px] text-[#A8A396] max-w-[200px] truncate">{p.nameAr}</p>
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px] text-[#8B8578]">{p.sku}</td>
                  <td className="px-3 py-3 text-[11px] text-[#5C6B60]">{p.categoryName || p.category?.name}</td>
                  <td className="px-3 py-3 font-semibold text-[#2D5A4C]">{formatPrice(p.price)}</td>
                  <td className="px-3 py-3">
                    {stockEdit?.id === String(p.id) ? (
                      <div className="flex items-center gap-1">
                        <input type="number" value={stockEdit.val} onChange={e => setStockEdit({ id: String(p.id), val: parseInt(e.target.value) || 0 })} className="w-16 h-7 border border-[#D4CFC6] rounded px-1 text-xs" autoFocus />
                        <button onClick={() => handleStockSave(String(p.id))} className="p-1 text-[#8FAE7B]"><Check size={14} /></button>
                        <button onClick={() => setStockEdit(null)} className="p-1 text-[#A8A396]"><X size={14} /></button>
                      </div>
                    ) : (
                      <button onClick={() => setStockEdit({ id: String(p.id), val: p.stockQuantity || 0 })} className={`text-sm font-semibold ${(p.stockQuantity || 0) <= 5 ? ((p.stockQuantity || 0) === 0 ? 'text-red-500' : 'text-amber-600') : 'text-[#2D5A4C]'}`}>
                        {p.stockQuantity || 0}
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive !== false ? 'bg-[#8FAE7B]/10 text-[#6B8E5A]' : 'bg-[#F2EFE9] text-[#8B8578]'}`}>{p.isActive !== false ? 'active' : 'draft'}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <button onClick={() => setPhotoProduct(p)} className="p-1.5 text-[#8B8578] hover:text-[#8FAE7B] hover:bg-[#8FAE7B]/10 rounded" title="Upload photo"><Upload size={14} /></button>
                      <button onClick={() => setEditing({ ...p })} className="p-1.5 text-[#8B8578] hover:text-[#2D5A4C] hover:bg-[#2D5A4C]/10 rounded" title="Edit"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(String(p.id))} className="p-1.5 text-[#8B8578] hover:text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="py-12 text-center text-[#A8A396]">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 px-4 py-3 border-t border-[#F2EFE9]">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-[#F2EFE9] disabled:opacity-30"><ChevronDown size={16} className="rotate-90" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-[#2D5A4C] text-white' : 'hover:bg-[#F2EFE9] text-[#5C6B60]'}`}>{p}</button>)}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-[#F2EFE9] disabled:opacity-30"><ChevronDown size={16} className="-rotate-90" /></button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-[#2D5A4C]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4CFC6] sticky top-0 bg-white">
              <h3 className="font-semibold text-[#2D5A4C]">Edit Product</h3>
              <button onClick={() => setEditing(null)} className="p-1.5 text-[#8B8578] hover:text-[#2D5A4C]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#8B8578] mb-1 block">Name (EN)</label>
                  <input value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#8B8578] mb-1 block">Name (AR)</label>
                  <input value={editing.nameAr || ''} onChange={e => setEditing({ ...editing, nameAr: e.target.value })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" dir="rtl" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#8B8578] mb-1 block">Price</label>
                  <input type="number" step="0.01" value={editing.price || ''} onChange={e => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#8B8578] mb-1 block">Stock</label>
                  <input type="number" value={editing.stockQuantity || 0} onChange={e => setEditing({ ...editing, stockQuantity: parseInt(e.target.value) || 0 })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#8B8578] mb-1 block">SKU</label>
                  <input value={editing.sku || ''} onChange={e => setEditing({ ...editing, sku: e.target.value })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#8B8578] mb-1 block">Category</label>
                  <select value={editing.categorySlug || editing.category?.slug || ''} onChange={e => setEditing({ ...editing, categorySlug: e.target.value })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]">
                    <option value="">Select...</option>
                    {categoryNames.map(c => <option key={c} value={c.toLowerCase().replace(/\s+/g, '-')}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#8B8578] mb-1 block">Status</label>
                  <select value={editing.isActive !== false ? 'active' : 'draft'} onChange={e => setEditing({ ...editing, isActive: e.target.value === 'active' })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 text-sm text-[#5C6B60]"><input type="checkbox" checked={!!editing.isNew} onChange={e => setEditing({ ...editing, isNew: e.target.checked })} className="rounded border-[#D4CFC6] text-[#8FAE7B]" /> New</label>
                <label className="flex items-center gap-2 text-sm text-[#5C6B60]"><input type="checkbox" checked={!!editing.isFeatured} onChange={e => setEditing({ ...editing, isFeatured: e.target.checked })} className="rounded border-[#D4CFC6] text-[#8FAE7B]" /> Featured</label>
                <label className="flex items-center gap-2 text-sm text-[#5C6B60]"><input type="checkbox" checked={!!editing.isBestseller} onChange={e => setEditing({ ...editing, isBestseller: e.target.checked })} className="rounded border-[#D4CFC6] text-[#8FAE7B]" /> Bestseller</label>
              </div>
              <div>
                <label className="text-xs font-medium text-[#8B8578] mb-1 block">Description (EN)</label>
                <textarea value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full border border-[#D4CFC6] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#8FAE7B] resize-y" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSaveEdit} className="flex items-center gap-2 bg-[#8FAE7B] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#7A9A68] transition-colors">
                  <Save size={16} /> Save Changes
                </button>
                <button onClick={() => { if (confirm('Delete?')) { handleDelete(String(editing.id)); setEditing(null) } }} className="text-red-500 px-4 py-2.5 rounded-xl font-medium hover:bg-red-50 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {photoProduct && (
        <div className="fixed inset-0 bg-[#2D5A4C]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#2D5A4C]">Upload Photo</h3>
              <button onClick={() => setPhotoProduct(null)} className="p-1.5 text-[#8B8578]"><X size={18} /></button>
            </div>
            <p className="text-sm text-[#8B8578] mb-4">{photoProduct.name}</p>
            <input ref={fileRef} type="file" accept="image/*" className="w-full text-sm mb-4 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-[#D4C4B0] file:text-[#2D5A4C] file:font-medium" />
            <button onClick={handlePhotoUpload} className="w-full bg-[#8FAE7B] text-white py-2.5 rounded-xl font-medium hover:bg-[#7A9A68] transition-colors">
              Upload & Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
