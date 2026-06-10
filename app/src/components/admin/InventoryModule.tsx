import { useState } from 'react'
import { Search, ArrowUpDown, Plus, Minus, ClipboardList, AlertTriangle, Package } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { PrintButton } from '@/components/shared/PrintButton'
import { PrintHeader } from '@/components/shared/PrintHeader'

const typeColors: Record<string, string> = {
  restock: 'bg-emerald-50 text-emerald-600',
  adjustment: 'bg-amber-50 text-amber-600',
  reserve: 'bg-blue-50 text-blue-600',
  release: 'bg-purple-50 text-purple-600',
  sale: 'bg-sky-50 text-sky-600',
  return: 'bg-green-50 text-green-600',
}

export function InventoryModule() {
  const { products, movements, addMovement } = useAdminStore()
  const [search, setSearch] = useState('')
  const [showLogs, setShowLogs] = useState(false)
  const [adjustModal, setAdjustModal] = useState<string | null>(null)
  const [adjustVal, setAdjustVal] = useState(0)
  const [adjustNote, setAdjustNote] = useState('')

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    return !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  })

  const lowStockProducts = products.filter(p => p.stockQuantity <= 5)
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0)

  const handleAdjust = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return
    const newStock = Math.max(0, product.stockQuantity + adjustVal)
    addMovement({
      productId, productName: product.name,
      type: adjustVal >= 0 ? 'restock' : 'adjustment',
      quantity: adjustVal, previousStock: product.stockQuantity,
      newStock, note: adjustNote || (adjustVal >= 0 ? 'Restock' : 'Manual adjustment'),
      createdBy: 'Omran',
    })
    setAdjustModal(null)
    setAdjustVal(0)
    setAdjustNote('')
  }

  return (
    <div className="space-y-4">
      <PrintHeader title="Inventory Report" subtitle={`${products.length} products tracked`} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#2D5A4C] print-section-header">Inventory</h2>
        <PrintButton label="Print Inventory" />
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A396]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full h-10 border border-[#D4CFC6] rounded-lg pl-9 pr-3 text-sm bg-white outline-none focus:border-[#8FAE7B]" />
        </div>
        <button onClick={() => setShowLogs(!showLogs)} className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors ${showLogs ? 'bg-[#2D5A4C] text-white' : 'bg-white border border-[#D4CFC6] text-[#5C6B60] hover:bg-[#F2EFE9]'}`}>
          <ClipboardList size={15} className="inline mr-1.5" />{showLogs ? 'Products' : 'Movement Logs'}
        </button>
      </div>

      {/* Low Stock Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="space-y-2">
          {outOfStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package size={16} className="text-red-500" />
                <h4 className="text-sm font-semibold text-red-600">Out of Stock ({outOfStockProducts.length})</h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {outOfStockProducts.slice(0, 8).map(p => (
                  <span key={p.id} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">{p.name}</span>
                ))}
                {outOfStockProducts.length > 8 && <span className="text-xs text-red-500 px-1">+{outOfStockProducts.length - 8} more</span>}
              </div>
            </div>
          )}
          {lowStockProducts.filter(p => p.stockQuantity > 0).length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <h4 className="text-sm font-semibold text-amber-700">Low Stock Warning ({lowStockProducts.filter(p => p.stockQuantity > 0).length})</h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {lowStockProducts.filter(p => p.stockQuantity > 0).slice(0, 8).map(p => (
                  <span key={p.id} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{p.name} ({p.stockQuantity})</span>
                ))}
                {lowStockProducts.filter(p => p.stockQuantity > 0).length > 8 && <span className="text-xs text-amber-600 px-1">+{lowStockProducts.filter(p => p.stockQuantity > 0).length - 8} more</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {showLogs ? (
        <div className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden print-break-before">
          <div className="print-only p-4 border-b border-[#D4CFC6]">
            <h3 className="text-lg font-semibold text-[#2D5A4C]">Stock Movement Log</h3>
            <p className="text-xs text-[#8B8578] mt-1">{movements.length} movements recorded</p>
          </div>
          {movements.length === 0 ? (
            <div className="p-8 text-center text-[#A8A396]">No stock movements recorded yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F2EFE9] border-b border-[#D4CFC6]">
                    <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Product</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Qty</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">From → To</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {[...movements].reverse().map(m => (
                    <tr key={m.id} className="border-b border-[#F2EFE9]">
                      <td className="px-4 py-3 text-[11px] text-[#8B8578]">{new Date(m.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm text-[#2D5A4C]">{m.productName}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[m.type]}`}>{m.type}</span></td>
                      <td className={`px-4 py-3 font-semibold text-sm ${m.quantity >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{m.quantity >= 0 ? '+' : ''}{m.quantity}</td>
                      <td className="px-4 py-3 text-sm text-[#5C6B60]">{m.previousStock} → {m.newStock}</td>
                      <td className="px-4 py-3 text-xs text-[#8B8578]">{m.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F2EFE9] border-b border-[#D4CFC6]">
                  <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">SKU</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">On Hand</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-[#2D5A4C] text-xs">Adjust</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-[#F2EFE9] hover:bg-[#FAFAF7]">
                    <td className="px-4 py-3">
                      <p className="text-[#2D5A4C] font-medium">{p.name}</p>
                      <p className="text-[11px] text-[#A8A396]">{p.category?.name}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#8B8578]">{p.sku}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${p.stockQuantity <= 5 ? (p.stockQuantity === 0 ? 'text-red-500' : 'text-amber-600') : 'text-[#2D5A4C]'}`}>{p.stockQuantity}</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.stockQuantity === 0 ? <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Out of Stock</span>
                        : p.stockQuantity <= 5 ? <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Low Stock</span>
                        : <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">OK</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setAdjustModal(p.id); setAdjustVal(0); setAdjustNote('') }} className="p-1.5 text-[#8B8578] hover:text-[#2D5A4C] hover:bg-[#F2EFE9] rounded transition-colors">
                        <ArrowUpDown size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {adjustModal && (
        <div className="fixed inset-0 bg-[#2D5A4C]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-semibold text-[#2D5A4C] mb-1">Adjust Stock</h3>
            <p className="text-sm text-[#8B8578] mb-4">{products.find(p => p.id === adjustModal)?.name}</p>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setAdjustVal(v => v - 1)} className="w-10 h-10 rounded-lg bg-[#F2EFE9] flex items-center justify-center hover:bg-[#E8E4DB]"><Minus size={16} /></button>
              <input type="number" value={adjustVal} onChange={e => setAdjustVal(parseInt(e.target.value) || 0)} className="flex-1 h-10 border border-[#D4CFC6] rounded-lg px-3 text-center text-sm outline-none focus:border-[#8FAE7B]" />
              <button onClick={() => setAdjustVal(v => v + 1)} className="w-10 h-10 rounded-lg bg-[#F2EFE9] flex items-center justify-center hover:bg-[#E8E4DB]"><Plus size={16} /></button>
            </div>
            <input value={adjustNote} onChange={e => setAdjustNote(e.target.value)} placeholder="Note (optional)" className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B] mb-4" />
            <div className="flex gap-2">
              <button onClick={() => handleAdjust(adjustModal)} className="flex-1 bg-[#8FAE7B] text-white py-2.5 rounded-xl font-medium hover:bg-[#7A9A68]">Apply</button>
              <button onClick={() => setAdjustModal(null)} className="px-4 py-2.5 border border-[#D4CFC6] rounded-xl text-sm text-[#5C6B60] hover:bg-[#F2EFE9]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
