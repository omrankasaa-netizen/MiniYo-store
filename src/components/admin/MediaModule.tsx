import { useState, useRef } from 'react'
import { Upload, Trash2, Search, FolderOpen, Link2, ImageIcon, Star } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'

type MediaFilter = 'all' | 'product' | 'logo' | 'hero' | 'brand_kit' | 'sticker' | 'cms'

const filterLabels: Record<MediaFilter, string> = {
  all: 'All Media',
  product: 'Products',
  logo: 'Logos',
  hero: 'Hero Images',
  brand_kit: 'Brand Kit',
  sticker: 'Stickers',
  cms: 'CMS Content',
}

export function MediaModule() {
  const store = useAdminStore()
  const { media, products, addMedia, deleteMedia, assignMediaToProduct, setHeroImage, setLogoImage } = store
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<MediaFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [assignProductId, setAssignProductId] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = media.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = !q || m.name.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || m.type === filter
    return matchSearch && matchFilter
  })

  const selected = media.find(m => m.id === selectedId)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        addMedia({
          id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: (filter !== 'all' ? filter : 'product') as Exclude<MediaFilter, 'all'>,
          url,
          name: file.name,
          uploadedAt: new Date().toISOString(),
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDelete = (id: string) => {
    deleteMedia(id)
    if (selectedId === id) setSelectedId(null)
  }

  const handleAssign = () => {
    if (!selectedId || !assignProductId) return
    assignMediaToProduct(selectedId, assignProductId)
    setAssignProductId('')
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A396]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search media..."
            className="w-full h-10 border border-[#D4CFC6] rounded-lg pl-9 pr-3 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as MediaFilter)}
          className="h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#8FAE7B]"
        >
          {Object.entries(filterLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button
          onClick={() => fileRef.current?.click()}
          className="h-10 px-4 bg-[#2D5A4C] text-white text-sm rounded-lg hover:bg-[#1e4539] transition-colors flex items-center gap-2"
        >
          <Upload size={14} /> Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={e => handleFileSelect(e.target.files)}
        />
        <span className="text-sm text-[#8B8578]">{filtered.length} items</span>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files) }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? 'border-[#8FAE7B] bg-[#8FAE7B]/5' : 'border-[#D4CFC6] bg-white'
        }`}
      >
        <Upload size={24} className="mx-auto text-[#A8A396] mb-2" />
        <p className="text-sm text-[#8B8578]">Drag & drop images here, or click the Upload button</p>
        <p className="text-xs text-[#A8A396] mt-1">
          Tip: Upload a <strong>hero</strong> image (16:9) or a <strong>logo</strong> (square), then select it below and click &quot;Use as Hero/Logo&quot;
        </p>
      </div>

      {/* Action Panel for selected media */}
      {selected && (
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon size={14} className="text-[#8FAE7B]" />
            <span className="text-sm font-semibold text-[#2D5A4C]">{selected.name}</span>
            <span className="text-[10px] uppercase text-[#A8A396] bg-[#F5F0E6] px-1.5 py-0.5 rounded">{selected.type}</span>
          </div>

          {/* Hero / Logo actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setHeroImage(selected.url); setSelectedId(null) }}
              className="h-8 px-3 bg-[#2D5A4C] text-white text-xs rounded-lg hover:bg-[#1e4539] transition-colors flex items-center gap-1.5"
              title="Use this image as the storefront hero"
            >
              <ImageIcon size={12} /> Use as Hero
            </button>
            <button
              onClick={() => { setLogoImage(selected.url); setSelectedId(null) }}
              className="h-8 px-3 bg-[#8FAE7B] text-white text-xs rounded-lg hover:bg-[#6B8E5A] transition-colors flex items-center gap-1.5"
              title="Use this image as the site logo"
            >
              <Star size={12} /> Use as Logo
            </button>
            <button
              onClick={() => handleDelete(selected.id)}
              className="h-8 px-3 border border-red-200 text-red-500 text-xs rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5 ml-auto"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>

          {/* Assign to product */}
          {selected.type === 'product' && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F2EFE9]">
              <Link2 size={13} className="text-[#8FAE7B]" />
              <span className="text-xs text-[#5C6B60]">Assign to product:</span>
              <select
                value={assignProductId}
                onChange={e => setAssignProductId(e.target.value)}
                className="h-8 border border-[#D4CFC6] rounded-lg px-2 text-xs bg-white outline-none focus:border-[#8FAE7B] flex-1 min-w-[180px]"
              >
                <option value="">Select product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                disabled={!assignProductId}
                className="h-8 px-3 bg-[#2D5A4C] text-white text-xs rounded-lg hover:bg-[#1e4539] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>
          )}
        </div>
      )}

      {/* Current Hero / Logo Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-3 flex items-center gap-3">
          <div className="w-16 h-10 rounded-lg bg-[#F5F0E6] overflow-hidden shrink-0">
            <img src={store.settings.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#2D5A4C]">Current Hero</p>
            <p className="text-[10px] text-[#A8A396] truncate max-w-[200px]">{store.settings.heroImageUrl}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F5F0E6] overflow-hidden shrink-0">
            <img src={store.settings.logoImageUrl} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#2D5A4C]">Current Logo</p>
            <p className="text-[10px] text-[#A8A396] truncate max-w-[200px]">{store.settings.logoImageUrl}</p>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                selectedId === item.id ? 'border-[#8FAE7B] ring-2 ring-[#8FAE7B]/20' : 'border-[#D4CFC6]'
              }`}
              onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
            >
              <div className="aspect-square bg-[#F5F0E6] flex items-center justify-center relative group">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                {item.assignedTo && (
                  <div className="absolute bottom-1 left-1 bg-[#2D5A4C] text-white text-[9px] px-1.5 py-0.5 rounded">
                    Assigned
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-[#2D5A4C] truncate font-medium">{item.name}</p>
                <p className="text-[10px] text-[#A8A396] uppercase">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#D4CFC6] p-12 text-center">
          <FolderOpen size={32} className="mx-auto text-[#D4CFC6] mb-2" />
          <p className="text-[#8B8578] text-sm">No media found</p>
          <p className="text-[#A8A396] text-xs mt-1">Upload your first image to get started</p>
        </div>
      )}
    </div>
  )
}
