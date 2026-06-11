import { useState } from 'react'
import {
  Store, CreditCard, Truck, Tag, Users, ClipboardList, Save, Check,
  Shield, DollarSign, Package, Lock, X, UserPlus, Trash2, Image, Settings2
} from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { ConfigModule } from './ConfigModule'

interface StaffMember {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'staff'
  status: 'active' | 'inactive'
  lastLogin: string
}

const initialStaff: StaffMember[] = [
  { id: 's1', name: 'Omran', email: 'Management@miniyo.store', role: 'super_admin', status: 'active', lastLogin: new Date().toISOString().slice(0, 10) },
  { id: 's2', name: 'Ahmad K.', email: 'admin@miniyo.store', role: 'admin', status: 'active', lastLogin: new Date().toISOString().slice(0, 10) },
  { id: 's3', name: 'Marketing', email: 'marketing@miniyo.store', role: 'staff', status: 'active', lastLogin: '-' },
]

type SubSection = 'general' | 'payments' | 'shipping' | 'discounts' | 'staff' | 'audit' | 'configuration'

const navItems: { key: SubSection; label: string; icon: typeof Store }[] = [
  { key: 'general', label: 'General', icon: Store },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'shipping', label: 'Shipping', icon: Truck },
  { key: 'discounts', label: 'Discounts', icon: Tag },
  { key: 'staff', label: 'Staff & Roles', icon: Users },
  { key: 'audit', label: 'Audit Log', icon: ClipboardList },
  { key: 'configuration', label: 'Configuration', icon: Settings2 },
]

export function SettingsModule({ section }: { section?: string }) {
  const { settings, updateSettings, auditLogs, setFooterImage } = useAdminStore()
  const [activeTab, setActiveTab] = useState<SubSection>((section as SubSection) || 'general')
  const [form, setForm] = useState({ ...settings })
  const [saved, setSaved] = useState(false)

  // Staff state
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [showStaffForm, setShowStaffForm] = useState(false)
  const [staffForm, setStaffForm] = useState({ name: '', email: '', role: 'staff' as const })

  const handleSave = () => {
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addStaff = () => {
    if (!staffForm.name || !staffForm.email) return
    const newMember: StaffMember = {
      id: `s-${Date.now()}`,
      name: staffForm.name,
      email: staffForm.email,
      role: staffForm.role as 'staff',
      status: 'active',
      lastLogin: '-',
    }
    setStaff(prev => [...prev, newMember])
    setStaffForm({ name: '', email: '', role: 'staff' })
    setShowStaffForm(false)
  }

  const removeStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id))
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-[#2D5A4C] text-sm">Store Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8B8578] mb-1 block">Store Name</label>
                <input
                  value={form.storeName}
                  onChange={e => setForm(prev => ({ ...prev, storeName: e.target.value }))}
                  className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                />
              </div>
              <div>
                <label className="text-xs text-[#8B8578] mb-1 block">Currency</label>
                <select
                  value={form.currency}
                  onChange={e => setForm(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="LBP">LBP (LL)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8B8578] mb-1 block">Phone Number</label>
                <input
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                />
              </div>
              <div>
                <label className="text-xs text-[#8B8578] mb-1 block">WhatsApp Number</label>
                <input
                  value={form.whatsapp}
                  onChange={e => setForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                />
              </div>
              <div>
                <label className="text-xs text-[#8B8578] mb-1 block">Email</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                />
              </div>
              <div>
                <label className="text-xs text-[#8B8578] mb-1 block">Facebook</label>
                <input
                  value={form.facebook || ''}
                  onChange={e => setForm(prev => ({ ...prev, facebook: e.target.value }))}
                  placeholder="Miniyo.store.lb"
                  className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                />
              </div>
              <div>
                <label className="text-xs text-[#8B8578] mb-1 block">Instagram</label>
                <input
                  value={form.instagram || ''}
                  onChange={e => setForm(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="Miniyo.store.lb"
                  className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                />
              </div>
            </div>

            {/* Footer Image Upload */}
            <div className="mt-5 pt-5 border-t border-[#E8E4DB]">
              <h4 className="text-xs font-bold text-[#8B8578] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Image size={13} /> Footer Brand Image
              </h4>
              <div className="flex items-center gap-4">
                {form.footerImageUrl && (
                  <img
                    src={form.footerImageUrl}
                    alt="Footer"
                    className="h-16 w-auto object-contain border border-[#D4CFC6] rounded-lg p-1 bg-white"
                  />
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = ev => {
                        const url = ev.target?.result as string
                        if (url) {
                          setForm(prev => ({ ...prev, footerImageUrl: url }))
                          setFooterImage(url)
                        }
                      }
                      reader.readAsDataURL(file)
                    }}
                    className="text-xs text-[#5C6B60] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#2D5A4C] file:text-white hover:file:bg-[#1E4539]"
                  />
                  <p className="text-[10px] text-[#A8A396] mt-1">Appears above the footer on every page. Recommended: transparent PNG, 200x80px.</p>
                </div>
                {form.footerImageUrl && (
                  <button
                    onClick={() => {
                      setForm(prev => ({ ...prev, footerImageUrl: '' }))
                      setFooterImage('')
                    }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove image"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )

      case 'payments':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-[#2D5A4C] text-sm">Payment Methods</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 bg-white rounded-xl border border-[#D4CFC6] p-4 cursor-pointer hover:border-[#8FAE7B] transition-colors">
                <input
                  type="checkbox"
                  checked={form.codEnabled}
                  onChange={e => setForm(prev => ({ ...prev, codEnabled: e.target.checked }))}
                  className="w-4 h-4 accent-[#2D5A4C]"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#2D5A4C]">Cash on Delivery (CoD)</p>
                  <p className="text-xs text-[#A8A396]">Customers pay when they receive their order</p>
                </div>
                <Package size={18} className="text-[#8FAE7B]" />
              </label>
              <label className="flex items-center gap-3 bg-white rounded-xl border border-[#D4CFC6] p-4 cursor-pointer hover:border-[#8FAE7B] transition-colors">
                <input
                  type="checkbox"
                  checked={form.wishEnabled}
                  onChange={e => setForm(prev => ({ ...prev, wishEnabled: e.target.checked }))}
                  className="w-4 h-4 accent-[#2D5A4C]"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#2D5A4C]">Wish Money Transfer</p>
                  <p className="text-xs text-[#A8A396]">Customers pay via Wish app, you verify manually</p>
                </div>
                <CreditCard size={18} className="text-[#8FAE7B]" />
              </label>
            </div>
          </div>
        )

      case 'shipping':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-[#2D5A4C] text-sm">Delivery Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#D4CFC6] p-4">
                <label className="text-xs text-[#8B8578] mb-1 block">Free Shipping Threshold</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A396]" />
                  <input
                    type="number"
                    value={form.freeShippingThreshold}
                    onChange={e => setForm(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                    className="w-full h-10 border border-[#D4CFC6] rounded-lg pl-8 pr-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                  />
                </div>
                <p className="text-xs text-[#A8A396] mt-1">Orders above this amount get free delivery</p>
              </div>
              <div className="bg-white rounded-xl border border-[#D4CFC6] p-4">
                <label className="text-xs text-[#8B8578] mb-1 block">Standard Delivery Fee</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A396]" />
                  <input
                    type="number"
                    value={form.standardDeliveryFee}
                    onChange={e => setForm(prev => ({ ...prev, standardDeliveryFee: Number(e.target.value) }))}
                    className="w-full h-10 border border-[#D4CFC6] rounded-lg pl-8 pr-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                  />
                </div>
                <p className="text-xs text-[#A8A396] mt-1">Default delivery charge for Lebanon</p>
              </div>
              <div className="bg-white rounded-xl border border-[#D4CFC6] p-4">
                <label className="text-xs text-[#8B8578] mb-1 block">Express Delivery Fee</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A396]" />
                  <input
                    type="number"
                    value={form.expressDeliveryFee}
                    onChange={e => setForm(prev => ({ ...prev, expressDeliveryFee: Number(e.target.value) }))}
                    className="w-full h-10 border border-[#D4CFC6] rounded-lg pl-8 pr-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                  />
                </div>
                <p className="text-xs text-[#A8A396] mt-1">Same-day or next-day delivery charge</p>
              </div>
            </div>
          </div>
        )

      case 'discounts':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-[#2D5A4C] text-sm">Promo Codes</h3>
            <div className="bg-white rounded-xl border border-[#D4CFC6] p-6 text-center">
              <Tag size={28} className="mx-auto text-[#D4CFC6] mb-2" />
              <p className="text-sm text-[#8B8578]">Promo code management coming soon</p>
              <p className="text-xs text-[#A8A396] mt-1">Create discount codes, percentage-off deals, and flash sales</p>
            </div>
          </div>
        )

      case 'staff':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#2D5A4C] text-sm">Team Members</h3>
              <button
                onClick={() => setShowStaffForm(true)}
                className="h-8 px-3 bg-[#2D5A4C] text-white text-xs rounded-lg hover:bg-[#1e4539] transition-colors flex items-center gap-1.5"
              >
                <UserPlus size={13} /> Add Member
              </button>
            </div>

            {showStaffForm && (
              <div className="bg-white rounded-xl border border-[#D4CFC6] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#2D5A4C]">New Team Member</p>
                  <button onClick={() => setShowStaffForm(false)} className="text-[#A8A396] hover:text-[#2D5A4C]">
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    value={staffForm.name}
                    onChange={e => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Name"
                    className="h-9 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                  />
                  <input
                    value={staffForm.email}
                    onChange={e => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                    className="h-9 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                  />
                  <select
                    value={staffForm.role}
                    onChange={e => setStaffForm(prev => ({ ...prev, role: e.target.value as 'staff' }))}
                    className="h-9 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={addStaff}
                  className="h-8 px-4 bg-[#2D5A4C] text-white text-xs rounded-lg hover:bg-[#1e4539] transition-colors flex items-center gap-1.5"
                >
                  <Check size={12} /> Add
                </button>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F5F0E6]">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-[#8B8578]">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-[#8B8578]">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-[#8B8578]">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-[#8B8578]">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-[#8B8578]">Last Login</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EFE9]">
                    {staff.map(member => (
                      <tr key={member.id} className="hover:bg-[#FAFAF7] transition-colors">
                        <td className="px-4 py-3 font-medium text-[#2D5A4C]">{member.name}</td>
                        <td className="px-4 py-3 text-[#5C6B60]">{member.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            member.role === 'super_admin' ? 'bg-purple-50 text-purple-600' :
                            member.role === 'admin' ? 'bg-blue-50 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {member.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            member.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#A8A396] text-xs">{member.lastLogin}</td>
                        <td className="px-4 py-3">
                          {member.role !== 'super_admin' && (
                            <button
                              onClick={() => removeStaff(member.id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#F5F0E6] rounded-xl p-4 space-y-2">
              <p className="text-xs font-medium text-[#8B8578] uppercase tracking-wider">Role Permissions</p>
              <div className="space-y-1.5 text-xs text-[#5C6B60]">
                <div className="flex items-center gap-2"><Shield size={12} className="text-purple-500" /> <span className="font-medium">Super Admin:</span> Full access to everything</div>
                <div className="flex items-center gap-2"><Lock size={12} className="text-blue-500" /> <span className="font-medium">Admin:</span> Orders, products, inventory, customers, CMS</div>
                <div className="flex items-center gap-2"><UserPlus size={12} className="text-gray-500" /> <span className="font-medium">Staff:</span> View orders, update order status, view inventory</div>
              </div>
            </div>
          </div>
        )

      case 'audit':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-[#2D5A4C] text-sm">Audit Log</h3>
            {auditLogs.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#D4CFC6] p-8 text-center">
                <ClipboardList size={28} className="mx-auto text-[#D4CFC6] mb-2" />
                <p className="text-sm text-[#8B8578]">No audit logs yet</p>
                <p className="text-xs text-[#A8A396] mt-1">Actions performed in the admin panel will appear here</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden">
                <div className="overflow-x-auto max-h-[600px]">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F5F0E6] sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-[#8B8578]">Time</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-[#8B8578]">Action</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-[#8B8578]">Entity</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-[#8B8578]">Details</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-[#8B8578]">User</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EFE9]">
                      {[...auditLogs].reverse().map(log => (
                        <tr key={log.id} className="hover:bg-[#FAFAF7] transition-colors">
                          <td className="px-4 py-3 text-xs text-[#A8A396] whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              log.action.includes('DELETE') ? 'bg-red-50 text-red-500' :
                              log.action.includes('UPDATE') || log.action.includes('CHANGE') ? 'bg-blue-50 text-blue-600' :
                              log.action.includes('CREATE') || log.action.includes('ADD') ? 'bg-emerald-50 text-emerald-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#2D5A4C]">{log.entity}</td>
                          <td className="px-4 py-3 text-[#5C6B60] max-w-xs truncate">{log.details}</td>
                          <td className="px-4 py-3 text-xs text-[#8B8578]">{log.user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )

      case 'configuration':
        return <ConfigModule />
    }
  }

  return (
    <div className="space-y-4">
      {/* Sub Navigation */}
      <div className="flex flex-wrap gap-1 bg-white border border-[#D4CFC6] rounded-xl p-1">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-colors ${
                activeTab === item.key
                  ? 'bg-[#2D5A4C] text-white'
                  : 'text-[#8B8578] hover:text-[#2D5A4C] hover:bg-[#F5F0E6]'
              }`}
            >
              <Icon size={13} />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-[#D4CFC6] p-5">
        {renderContent()}
      </div>

      {/* Save Button (for settings tabs only — not config or audit) */}
      {(activeTab === 'general' || activeTab === 'payments' || activeTab === 'shipping') && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="h-10 px-5 bg-[#2D5A4C] text-white text-sm rounded-lg hover:bg-[#1e4539] transition-colors flex items-center gap-2"
          >
            <Save size={14} /> Save Settings
          </button>
          {saved && (
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <Check size={12} /> Settings saved
            </span>
          )}
        </div>
      )}
    </div>
  )
}