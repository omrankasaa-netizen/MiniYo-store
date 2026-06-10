import { useState } from 'react'
import { Plus, Tag, Trash2, Edit3, Check, X, Calendar, Percent, DollarSign, Zap, ToggleLeft, ToggleRight } from 'lucide-react'
import { useDiscountStore, type Discount, type DiscountType } from '@/stores/discountStore'
import { PrintButton } from '@/components/shared/PrintButton'
import { PrintHeader } from '@/components/shared/PrintHeader'

export function DiscountsModule() {
  const store = useDiscountStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Discount>>({
    name: '', code: '', type: 'percentage', value: 0, scope: 'all',
    minOrderAmount: 0, usageLimit: 0, autoApply: false,
    validFrom: new Date().toISOString().slice(0, 10),
    validUntil: '2025-12-31', isActive: true, description: '',
  })

  const resetForm = () => {
    setForm({
      name: '', code: '', type: 'percentage', value: 0, scope: 'all',
      minOrderAmount: 0, usageLimit: 0, autoApply: false,
      validFrom: new Date().toISOString().slice(0, 10),
      validUntil: '2025-12-31', isActive: true, description: '',
    })
    setEditingId(null)
  }

  const handleSave = () => {
    if (!form.name || !form.code || !form.value) return
    if (editingId) {
      store.updateDiscount(editingId, form)
    } else {
      store.addDiscount(form as Omit<Discount, 'id' | 'usageCount' | 'createdAt'>)
    }
    resetForm()
    setShowForm(false)
  }

  const handleEdit = (d: Discount) => {
    setForm({ ...d })
    setEditingId(d.id)
    setShowForm(true)
  }

  const typeLabels: Record<DiscountType, string> = {
    percentage: 'Percentage Off',
    fixed_amount: 'Fixed Amount',
    flash_sale: 'Flash Sale',
  }

  const typeIcons = {
    percentage: <Percent size={14} />,
    fixed_amount: <DollarSign size={14} />,
    flash_sale: <Zap size={14} />,
  }

  return (
    <div className="space-y-6">
      <PrintHeader title="Discounts & Promotions Report" subtitle={`${store.discounts.length} discounts configured`} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-[#2D5A4C] print-section-header">Discounts & Promotions</h2>
          <p className="text-sm text-[#8B8578] print:hidden">Create promo codes, flash sales, and automatic discounts</p>
        </div>
        <div className="flex items-center gap-2">
          <PrintButton label="Print Discounts" />
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2D5A4C] text-white rounded-xl text-sm font-medium hover:bg-[#1e4236] transition-colors print:hidden"
          >
            <Plus size={16} /> Add Discount
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-4 text-center">
          <p className="text-2xl font-semibold text-[#2D5A4C]">{store.discounts.length}</p>
          <p className="text-xs text-[#8B8578]">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-4 text-center">
          <p className="text-2xl font-semibold text-sage-green">{store.discounts.filter(d => d.isActive).length}</p>
          <p className="text-xs text-[#8B8578]">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-4 text-center">
          <p className="text-2xl font-semibold text-[#D4A843]">{store.discounts.filter(d => d.type === 'flash_sale').length}</p>
          <p className="text-xs text-[#8B8578]">Flash Sales</p>
        </div>
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-4 text-center">
          <p className="text-2xl font-semibold text-[#8B8578]">{store.discounts.reduce((s, d) => s + d.usageCount, 0)}</p>
          <p className="text-xs text-[#8B8578]">Redemptions</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-6">
          <h3 className="font-semibold text-[#2D5A4C] mb-4">{editingId ? 'Edit' : 'New'} Discount</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#8B8578] mb-1 block">Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Summer Sale" className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#8B8578] mb-1 block">Promo Code</label>
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER15" className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B] font-mono uppercase" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#8B8578] mb-1 block">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as DiscountType })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]">
                <option value="percentage">Percentage Off (%)</option>
                <option value="fixed_amount">Fixed Amount ($)</option>
                <option value="flash_sale">Flash Sale (%)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#8B8578] mb-1 block">Value {form.type === 'fixed_amount' ? '($)' : '(%)'}</label>
              <input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#8B8578] mb-1 block">Min Order ($)</label>
              <input type="number" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: Number(e.target.value) })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#8B8578] mb-1 block">Max Discount ($)</label>
              <input type="number" value={form.maxDiscount || ''} onChange={e => setForm({ ...form, maxDiscount: Number(e.target.value) || undefined })} placeholder="No limit" className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#8B8578] mb-1 block">Valid From</label>
              <input type="date" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#8B8578] mb-1 block">Valid Until</label>
              <input type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#8B8578] mb-1 block">Usage Limit (0 = unlimited)</label>
              <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: Number(e.target.value) })} className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <label className="flex items-center gap-2 text-sm text-[#2D5A4C] cursor-pointer">
                <input type="checkbox" checked={form.autoApply} onChange={e => setForm({ ...form, autoApply: e.target.checked })} className="rounded" />
                Auto-apply at checkout
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-medium text-[#8B8578] mb-1 block">Description</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What customers see at checkout" className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B]" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="px-4 py-2 bg-[#2D5A4C] text-white rounded-lg text-sm font-medium hover:bg-[#1e4236]">
              {editingId ? 'Update' : 'Create'} Discount
            </button>
            <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-2 text-sm text-[#8B8578] hover:bg-[#F2EFE9] rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Discounts List */}
      <div className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F2EFE9]">
            <tr>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Discount</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Code</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Value</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Usage</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E4DB]">
            {store.discounts.slice().reverse().map(d => (
              <tr key={d.id} className="hover:bg-[#FAFAF7]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#2D5A4C]">{d.name}</p>
                  <p className="text-[10px] text-[#8B8578]">{d.description}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs bg-[#F2EFE9] px-2 py-1 rounded">{d.code}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-xs text-[#8B8578]">
                    {typeIcons[d.type]} {typeLabels[d.type]}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-[#2D5A4C]">
                  {d.type === 'fixed_amount' ? `$${d.value}` : `${d.value}%`}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => store.toggleActive(d.id)} className="flex items-center gap-1">
                    {d.isActive
                      ? <ToggleRight size={20} className="text-sage-green" />
                      : <ToggleLeft size={20} className="text-[#A8A396]" />
                    }
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-[#8B8578]">
                  {d.usageCount}{d.usageLimit > 0 ? ` / ${d.usageLimit}` : ''}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(d)} className="p-1.5 text-[#8B8578] hover:text-[#2D5A4C] hover:bg-[#F2EFE9] rounded"><Edit3 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete this discount?')) store.deleteDiscount(d.id); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {store.discounts.length === 0 && (
          <div className="text-center py-8 text-[#A8A396] text-sm">No discounts created yet</div>
        )}
      </div>
    </div>
  )
}
