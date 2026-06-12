import { useState } from 'react'
import { useAdminProducts, useAdminInventory } from '@/hooks/useMiniyo'

export function InventoryModule() {
  const { data: products, isLoading: productsLoading } = useAdminProducts() as any
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const { data: movements, isLoading: movLoading, addMovement } = useAdminInventory(selectedProduct?.id) as any
  const [movForm, setMovForm] = useState({ movementType: 'in', quantity: '', reason: '' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = (products ?? []).filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleAddMovement() {
    if (!selectedProduct || !movForm.quantity) return
    setSaving(true)
    try {
      await addMovement({
        productId: selectedProduct.id,
        movementType: movForm.movementType,
        quantity: parseInt(movForm.quantity),
        reason: movForm.reason || undefined,
      })
      setMovForm({ movementType: 'in', quantity: '', reason: '' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Product list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Products</h2>
          <input
            type="search" placeholder="Search…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
          />
        </div>
        {productsLoading ? (
          <div className="p-4 space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : (
          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
            {filtered.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className={`w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors ${
                  selectedProduct?.id === p.id ? 'bg-[#01696f]/5 border-l-2 border-[#01696f]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.sku}</div>
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${
                    (p.stockQuantity ?? 0) === 0 ? 'text-red-600' : (p.stockQuantity ?? 0) <= 5 ? 'text-amber-600' : 'text-green-700'
                  }`}>{p.stockQuantity ?? 0}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Movements panel */}
      <div className="space-y-4">
        {selectedProduct ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Add Movement — {selectedProduct.name}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Type</label>
                  <select value={movForm.movementType} onChange={e => setMovForm(f => ({ ...f, movementType: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="in">Stock In (+)</option>
                    <option value="out">Stock Out (−)</option>
                    <option value="adjustment">Adjustment</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Quantity</label>
                  <input type="number" min="1" value={movForm.quantity} onChange={e => setMovForm(f => ({ ...f, quantity: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Reason</label>
                  <input type="text" value={movForm.reason} onChange={e => setMovForm(f => ({ ...f, reason: e.target.value }))} placeholder="Optional" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <button onClick={handleAddMovement} disabled={saving || !movForm.quantity} className="w-full py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] disabled:opacity-50">
                  {saving ? 'Saving…' : 'Record Movement'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Movement History</h3>
              </div>
              {movLoading ? (
                <div className="p-4 space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}</div>
              ) : !movements?.length ? (
                <p className="p-6 text-center text-gray-400 text-sm">No movements yet</p>
              ) : (
                <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                  {(movements as any[]).map(m => (
                    <div key={m.id} className="px-5 py-3 flex items-center justify-between text-sm">
                      <div>
                        <span className={`font-medium ${
                          m.movementType === 'in' ? 'text-green-700' : 'text-red-600'
                        }`}>{m.movementType === 'in' ? '+' : '−'}{m.quantity}</span>
                        {m.reason && <span className="text-gray-500 ml-2">{m.reason}</span>}
                      </div>
                      <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📊</div>
            <p>Select a product to manage inventory</p>
          </div>
        )}
      </div>
    </div>
  )
}
