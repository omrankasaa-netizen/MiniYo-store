import { useState, useCallback } from 'react'
import { Upload, Check, AlertCircle, FileSpreadsheet, Trash2, ImageIcon } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { formatPrice } from '@/lib/i18n'

interface CsvProduct {
  rowNum: number
  name: string
  nameAr: string
  slug: string
  price: number
  compareAtPrice: number | null
  category: string
  categoryAr: string
  stockQuantity: number
  sku: string
  description: string
  descriptionAr: string
  gender: string
  ageGroup: string
  imageUrl: string
  isNew: boolean
  isFeatured: boolean
  isBestseller: boolean
  status: string
  // Validation
  errors: string[]
  warnings: string[]
}

const REQUIRED_HEADERS = ['name', 'price', 'category', 'stockQuantity']
const OPTIONAL_HEADERS = [
  'nameAr', 'slug', 'compareAtPrice', 'categoryAr', 'sku',
  'description', 'descriptionAr', 'gender', 'ageGroup',
  'imageUrl', 'isNew', 'isFeatured', 'isBestseller', 'status'
]
const ALL_HEADERS = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS]

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  // Simple CSV parser that handles quoted fields
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return { headers: [], rows: [] }

  // Parse a single CSV line respecting quotes
  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = parseLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim().toLowerCase())
  const rows = lines.slice(1).map(parseLine)
  return { headers, rows }
}

function mapRowToProduct(row: string[], headers: string[], rowNum: number): CsvProduct {
  const get = (col: string) => {
    const idx = headers.indexOf(col.toLowerCase())
    return idx >= 0 ? row[idx]?.replace(/^"|"$/g, '').trim() || '' : ''
  }

  const errors: string[] = []
  const warnings: string[] = []

  const name = get('name')
  if (!name) errors.push('Product name is required')

  const priceStr = get('price')
  const price = parseFloat(priceStr)
  if (!priceStr || isNaN(price) || price <= 0) errors.push('Valid price is required')

  const category = get('category')
  if (!category) errors.push('Category is required')

  const stockStr = get('stockQuantity') || get('stock')
  const stockQuantity = parseInt(stockStr) || 0
  if (!stockStr || isNaN(stockQuantity)) errors.push('Valid stock quantity is required')

  const slug = get('slug') || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (!slug) errors.push('Could not generate slug from name')

  const imageUrl = get('imageUrl') || get('imageurl') || get('image') || ''
  if (imageUrl && !imageUrl.match(/^https?:\/\//)) {
    warnings.push('Image URL should start with http:// or https://')
  }

  // Auto-generate nameAr if missing
  let nameAr = get('nameAr')
  if (!nameAr) {
    nameAr = name
    warnings.push('Arabic name missing — using English name')
  }

  return {
    rowNum,
    name,
    nameAr,
    slug,
    price: isNaN(price) ? 0 : price,
    compareAtPrice: get('compareAtPrice') ? parseFloat(get('compareAtPrice')) || null : null,
    category,
    categoryAr: get('categoryAr') || category,
    stockQuantity,
    sku: get('sku') || slug,
    description: get('description') || name,
    descriptionAr: get('descriptionAr') || name,
    gender: get('gender') || 'unisex',
    ageGroup: get('ageGroup') || '0-12M',
    imageUrl,
    isNew: get('isNew')?.toLowerCase() === 'true' || get('isNew') === '1',
    isFeatured: get('isFeatured')?.toLowerCase() === 'true' || get('isFeatured') === '1',
    isBestseller: get('isBestseller')?.toLowerCase() === 'true' || get('isBestseller') === '1',
    status: get('status') || 'active',
    errors,
    warnings,
  }
}

// Derive category ID from name
function getCategoryId(name: string): string {
  const map: Record<string, string> = {
    apparel: '1', clothing: '1', clothes: '1', ملابس: '1',
    set: '2', sets: '2', طقم: '2', 'gift set': '2',
    accessories: '3', إكسسوارات: '3', accessory: '3',
    basics: '4', أساسيات: '4', basic: '4',
    sleepwear: '5', 'sleep wear': '5', pajamas: '5', ملابس_نوم: '5',
  }
  return map[name.toLowerCase().trim()] || '1'
}

export function CsvImportModule() {
  const { products, updateProduct } = useAdminStore()
  const [dragOver, setDragOver] = useState(false)
  const [parsedProducts, setParsedProducts] = useState<CsvProduct[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [imported, setImported] = useState(false)
  const [importSummary, setImportSummary] = useState<{ added: number; updated: number; errors: number } | null>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a .csv file')
      return
    }
    setFileName(file.name)
    setImported(false)
    setImportSummary(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { headers, rows } = parseCSV(text)

      // Check for required headers
      const missingHeaders = REQUIRED_HEADERS.filter(h => !headers.includes(h.toLowerCase()))
      if (missingHeaders.length > 0) {
        alert(`Missing required columns: ${missingHeaders.join(', ')}\n\nRequired columns: ${REQUIRED_HEADERS.join(', ')}\nOptional columns: ${OPTIONAL_HEADERS.join(', ')}`)
        setParsedProducts([])
        return
      }

      const products = rows.map((row, i) => mapRowToProduct(row, headers, i + 2))
      setParsedProducts(products)
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleImport = () => {
    const valid = parsedProducts.filter(p => p.errors.length === 0)
    let added = 0
    let updated = 0

    for (const csvProd of valid) {
      const existingIdx = products.findIndex(p => p.slug === csvProd.slug || p.sku === csvProd.sku)
      const catId = getCategoryId(csvProd.category)

      const productData = {
        name: csvProd.name,
        nameAr: csvProd.nameAr,
        slug: csvProd.slug,
        description: csvProd.description,
        descriptionAr: csvProd.descriptionAr,
        shortDescription: csvProd.description.slice(0, 120),
        shortDescriptionAr: csvProd.descriptionAr.slice(0, 120),
        price: csvProd.price,
        compareAtPrice: csvProd.compareAtPrice,
        currency: 'USD',
        sku: csvProd.sku,
        status: csvProd.status,
        isNew: csvProd.isNew,
        isBestseller: csvProd.isBestseller,
        isFeatured: csvProd.isFeatured,
        gender: csvProd.gender,
        ageGroup: csvProd.ageGroup,
        categoryId: catId,
        stockQuantity: csvProd.stockQuantity,
        rating: null,
        reviewCount: 0,
        images: csvProd.imageUrl ? [{
          id: `img-${Date.now()}-${csvProd.rowNum}`,
          url: csvProd.imageUrl,
          alt: csvProd.name,
          altAr: csvProd.nameAr,
          isPrimary: true,
        }] : [],
        category: {
          id: catId,
          name: csvProd.category,
          nameAr: csvProd.categoryAr,
          slug: csvProd.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: null,
          descriptionAr: null,
          image: null,
          sortOrder: parseInt(catId),
        },
      }

      if (existingIdx >= 0) {
        // Update existing
        const existing = products[existingIdx]
        updateProduct(existing.id, {
          ...productData,
          // Merge images: keep existing + add new if different
          images: csvProd.imageUrl
            ? [...(existing.images || []), { id: `img-${Date.now()}`, url: csvProd.imageUrl, alt: csvProd.name, altAr: csvProd.nameAr, isPrimary: !(existing.images?.length) }]
            : existing.images,
        })
        updated++
      } else {
        // Add new — generate a new ID
        const newId = `csv-${Date.now()}-${csvProd.rowNum}`
        updateProduct(newId, { ...productData, id: newId } as any)
        added++
      }
    }

    setImportSummary({ added, updated, errors: parsedProducts.length - valid.length })
    setImported(true)
  }

  const validCount = parsedProducts.filter(p => p.errors.length === 0).length
  const errorCount = parsedProducts.filter(p => p.errors.length > 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display text-[#2D5A4C] mb-1">Bulk Import Products</h2>
        <p className="text-sm text-[#8B8578]">Upload a CSV file to add or update products. Products will appear on the storefront after import.</p>
      </div>

      {/* CSV Template Download */}
      <div className="bg-white rounded-xl border border-[#D4CFC6] p-4">
        <p className="text-sm font-medium text-[#2D5A4C] mb-2">CSV Template</p>
        <p className="text-xs text-[#8B8578] mb-3">
          Required columns: <span className="font-semibold text-[#2D5A4C]">{REQUIRED_HEADERS.join(', ')}</span>
        </p>
        <p className="text-xs text-[#8B8578] mb-3">
          Optional columns: {OPTIONAL_HEADERS.join(', ')}
        </p>
        <button
          onClick={() => {
            const csv = ALL_HEADERS.join(',') + '\n' +
              '"Bunny Bodysuit","بوديسويت أرنب","bunny-bodysuit",18.00,22.00,"Apparel","ملابس",12,"bunny-bodysuit-001","Soft cotton bodysuit with bunny print","بوديسويت قطن ناعم بطبعة أرنب","unisex","0-6M","https://example.com/image.jpg",true,false,false,active'
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'miniyo-product-template.csv'
            a.click()
            URL.revokeObjectURL(url)
          }}
          className="text-xs text-[#2D5A4C] font-medium underline hover:text-[#8FAE7B] transition-colors"
        >
          Download template CSV
        </button>
      </div>

      {/* Drop Zone */}
      {!imported && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
            dragOver
              ? 'border-[#8FAE7B] bg-[#8FAE7B]/5'
              : 'border-[#D4CFC6] bg-white hover:border-[#8FAE7B]/50 hover:bg-[#8FAE7B]/[0.02]'
          }`}
        >
          <Upload size={36} className={`mx-auto mb-3 ${dragOver ? 'text-[#8FAE7B]' : 'text-[#A8A396]'}`} />
          <p className="text-sm text-[#2D5A4C] font-medium mb-1">
            {fileName || 'Drag & drop your CSV file here'}
          </p>
          <p className="text-xs text-[#8B8578] mb-4">or click to browse</p>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D5A4C] text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-[#1e4236] transition-colors">
            <FileSpreadsheet size={16} />
            Select CSV File
            <input type="file" accept=".csv" onChange={handleInputChange} className="hidden" />
          </label>
        </div>
      )}

      {/* Parsed Products Preview */}
      {parsedProducts.length > 0 && !imported && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-accent font-semibold text-[#2D5A4C]">
                Preview ({parsedProducts.length} rows)
              </h3>
              <span className="text-xs bg-[#8FAE7B]/10 text-[#2D5A4C] px-2 py-1 rounded-full font-medium">
                {validCount} valid
              </span>
              {errorCount > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                  {errorCount} errors
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setParsedProducts([]); setFileName(null); }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
              <button
                onClick={handleImport}
                disabled={validCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#2D5A4C] text-white rounded-xl text-sm font-medium hover:bg-[#1e4236] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Check size={16} />
                Import {validCount} Product{validCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-sm">
                <thead className="bg-[#F2EFE9] sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider w-8">#</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Price</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Stock</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider">Image</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#8B8578] uppercase tracking-wider w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DB]">
                  {parsedProducts.map((p) => (
                    <tr key={p.rowNum} className={p.errors.length > 0 ? 'bg-red-50/50' : 'hover:bg-[#F2EFE9]/50'}>
                      <td className="px-4 py-3 text-[#8B8578] text-xs">{p.rowNum}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#2D5A4C] text-[13px]">{p.name}</p>
                        <p className="text-[11px] text-[#8B8578]">{p.slug}</p>
                        {p.warnings.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.warnings.map((w, i) => (
                              <span key={i} className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{w}</span>
                            ))}
                          </div>
                        )}
                        {p.errors.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.errors.map((err, i) => (
                              <span key={i} className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <AlertCircle size={10} /> {err}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-accent font-semibold text-[#2D5A4C]">{formatPrice(p.price)}</span>
                        {p.compareAtPrice && (
                          <span className="text-[11px] text-[#8B8578] line-through ml-1">{formatPrice(p.compareAtPrice)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${p.stockQuantity <= 5 ? 'text-amber-600' : 'text-[#2D5A4C]'}`}>
                          {p.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#2D5A4C] text-[13px]">{p.category}</td>
                      <td className="px-4 py-3">
                        {p.imageUrl ? (
                          <div className="flex items-center gap-1.5">
                            <ImageIcon size={14} className="text-[#8FAE7B]" />
                            <span className="text-[11px] text-[#8FAE7B] truncate max-w-[100px]">{p.imageUrl.slice(0, 30)}...</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#A8A396]">No image</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {p.errors.length > 0 ? (
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">Error</span>
                        ) : (
                          <span className="text-[10px] bg-[#8FAE7B]/10 text-[#2D5A4C] px-2 py-1 rounded-full font-medium">Ready</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Import Result */}
      {importSummary && (
        <div className="bg-[#8FAE7B]/10 border border-[#8FAE7B]/30 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Check size={24} className="text-[#8FAE7B]" />
            <h3 className="text-lg font-display text-[#2D5A4C]">Import Complete!</h3>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-2xl font-accent font-bold text-[#2D5A4C]">{importSummary.added}</p>
              <p className="text-[#8B8578]">Added</p>
            </div>
            <div className="w-px h-10 bg-[#D4CFC6]" />
            <div className="text-center">
              <p className="text-2xl font-accent font-bold text-[#2D5A4C]">{importSummary.updated}</p>
              <p className="text-[#8B8578]">Updated</p>
            </div>
            <div className="w-px h-10 bg-[#D4CFC6]" />
            <div className="text-center">
              <p className="text-2xl font-accent font-bold text-red-500">{importSummary.errors}</p>
              <p className="text-[#8B8578]">Skipped</p>
            </div>
          </div>
          <p className="text-xs text-[#8B8578] mt-4">
            Products will appear on the storefront after you refresh the page.
          </p>
          <button
            onClick={() => {
              setImported(false)
              setImportSummary(null)
              setParsedProducts([])
              setFileName(null)
            }}
            className="mt-4 px-5 py-2.5 bg-[#2D5A4C] text-white rounded-xl text-sm font-medium hover:bg-[#1e4236] transition-colors"
          >
            Import Another File
          </button>
        </div>
      )}
    </div>
  )
}
