import { useState } from 'react'
import { Edit2, Eye, EyeOff, Save, X, Globe, Layout } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'

export function CmsModule() {
  const { cmsSections, updateCmsSection } = useAdminStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    title: string; titleAr: string; body: string; bodyAr: string; imageUrl: string; isActive: boolean
  }>({ title: '', titleAr: '', body: '', bodyAr: '', imageUrl: '', isActive: true })
  const [previewLang, setPreviewLang] = useState<'en' | 'ar'>('en')

  const startEdit = (section: typeof cmsSections[0]) => {
    setEditingId(section.id)
    setEditForm({
      title: section.title,
      titleAr: section.titleAr,
      body: section.body,
      bodyAr: section.bodyAr,
      imageUrl: section.imageUrl || '',
      isActive: section.isActive,
    })
  }

  const saveEdit = () => {
    if (!editingId) return
    updateCmsSection(editingId, {
      title: editForm.title,
      titleAr: editForm.titleAr,
      body: editForm.body,
      bodyAr: editForm.bodyAr,
      imageUrl: editForm.imageUrl || undefined,
      isActive: editForm.isActive,
    })
    setEditingId(null)
  }

  const toggleActive = (id: string, current: boolean) => {
    updateCmsSection(id, { isActive: !current })
  }

  return (
    <div className="space-y-4">
      {/* Language toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#8B8578]">Manage homepage sections and bilingual content</p>
        <div className="flex items-center gap-1 bg-white border border-[#D4CFC6] rounded-lg p-0.5">
          <button
            onClick={() => setPreviewLang('en')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${previewLang === 'en' ? 'bg-[#2D5A4C] text-white' : 'text-[#8B8578] hover:text-[#2D5A4C]'}`}
          >
            English
          </button>
          <button
            onClick={() => setPreviewLang('ar')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${previewLang === 'ar' ? 'bg-[#2D5A4C] text-white' : 'text-[#8B8578] hover:text-[#2D5A4C]'}`}
          >
            العربية
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {cmsSections.sort((a, b) => a.sortOrder - b.sortOrder).map(section => {
          const isEditing = editingId === section.id
          const isActive = section.isActive

          return (
            <div
              key={section.id}
              className={`bg-white rounded-xl border transition-all ${
                isActive ? 'border-[#D4CFC6]' : 'border-[#E8E4DB] opacity-60'
              } ${isEditing ? 'ring-2 ring-[#8FAE7B]/20' : ''}`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#F5F0E6] flex items-center justify-center text-xs font-semibold text-[#8FAE7B]">
                    {section.sortOrder}
                  </span>
                  <div>
                    <p className="font-semibold text-[#2D5A4C] text-sm">{section.key}</p>
                    <p className="text-xs text-[#A8A396]">
                      {isActive ? 'Visible on site' : 'Hidden'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(section.id, section.isActive)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={isActive ? 'Hide section' : 'Show section'}
                  >
                    {isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={() => isEditing ? saveEdit() : startEdit(section)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isEditing ? 'text-emerald-600 hover:bg-emerald-50' : 'text-[#8FAE7B] hover:bg-[#F5F0E6]'
                    }`}
                  >
                    {isEditing ? <Save size={15} /> : <Edit2 size={15} />}
                  </button>
                </div>
              </div>

              {/* Preview / Edit Content */}
              <div className="px-5 pb-4">
                {isEditing ? (
                  <div className="space-y-3 border-t border-[#F2EFE9] pt-3">
                    {/* English Fields */}
                    <div className="flex items-center gap-2 text-xs text-[#8FAE7B] font-medium">
                      <Globe size={12} /> English Content
                    </div>
                    <div>
                      <label className="text-xs text-[#8B8578] mb-1 block">Title</label>
                      <input
                        value={editForm.title}
                        onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full h-9 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-[#FAFAF7] outline-none focus:border-[#8FAE7B]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#8B8578] mb-1 block">Body</label>
                      <textarea
                        value={editForm.body}
                        onChange={e => setEditForm(prev => ({ ...prev, body: e.target.value }))}
                        rows={3}
                        className="w-full border border-[#D4CFC6] rounded-lg px-3 py-2 text-sm bg-[#FAFAF7] outline-none focus:border-[#8FAE7B] resize-none"
                      />
                    </div>

                    {/* Arabic Fields */}
                    <div className="flex items-center gap-2 text-xs text-[#8FAE7B] font-medium border-t border-[#F2EFE9] pt-3">
                      <Globe size={12} /> Arabic Content
                    </div>
                    <div>
                      <label className="text-xs text-[#8B8578] mb-1 block">Title (AR)</label>
                      <input
                        value={editForm.titleAr}
                        onChange={e => setEditForm(prev => ({ ...prev, titleAr: e.target.value }))}
                        className="w-full h-9 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-[#FAFAF7] outline-none focus:border-[#8FAE7B]"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#8B8578] mb-1 block">Body (AR)</label>
                      <textarea
                        value={editForm.bodyAr}
                        onChange={e => setEditForm(prev => ({ ...prev, bodyAr: e.target.value }))}
                        rows={3}
                        className="w-full border border-[#D4CFC6] rounded-lg px-3 py-2 text-sm bg-[#FAFAF7] outline-none focus:border-[#8FAE7B] resize-none"
                        dir="rtl"
                      />
                    </div>

                    {/* Image URL */}
                    <div className="border-t border-[#F2EFE9] pt-3">
                      <label className="text-xs text-[#8B8578] mb-1 block">Image URL (optional)</label>
                      <input
                        value={editForm.imageUrl}
                        onChange={e => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://..."
                        className="w-full h-9 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-[#FAFAF7] outline-none focus:border-[#8FAE7B]"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={saveEdit}
                        className="h-9 px-4 bg-[#2D5A4C] text-white text-sm rounded-lg hover:bg-[#1e4539] transition-colors flex items-center gap-1.5"
                      >
                        <Save size={14} /> Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="h-9 px-4 border border-[#D4CFC6] text-[#8B8578] text-sm rounded-lg hover:bg-[#F2EFE9] transition-colors flex items-center gap-1.5"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-[#F2EFE9] pt-3 space-y-2">
                    <div className={`${previewLang === 'ar' ? 'text-right' : 'text-left'}`} dir={previewLang === 'ar' ? 'rtl' : 'ltr'}>
                      <p className="text-sm font-semibold text-[#2D5A4C]">
                        {previewLang === 'ar' ? section.titleAr : section.title}
                      </p>
                      <p className="text-sm text-[#5C6B60] mt-1">
                        {previewLang === 'ar' ? section.bodyAr : section.body}
                      </p>
                    </div>
                    {section.imageUrl && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-[#E8E4DB] max-w-xs">
                        <img src={section.imageUrl} alt={section.title} className="w-full h-auto" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
        <Layout size={16} className="text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">CMS Editor</p>
          <p className="text-xs text-blue-600 mt-1">
            Changes here are immediately reflected on the storefront homepage. Toggle visibility to show/hide sections. 
            Edit content in both English and Arabic to support bilingual customers.
          </p>
        </div>
      </div>
    </div>
  )
}
