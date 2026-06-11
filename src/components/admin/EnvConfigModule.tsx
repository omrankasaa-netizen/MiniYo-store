import { useState } from 'react'
import { Save, Check, Eye, EyeOff, AlertTriangle, RefreshCw, Terminal } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'

interface EnvVar {
  key: string
  label: string
  description: string
  category: 'auth' | 'database' | 'email' | 'admin' | 'platform'
  sensitive: boolean
  readonly?: boolean
  placeholder?: string
}

const ENV_DEFINITIONS: EnvVar[] = [
  // ── Auth / Kimi OAuth ──
  { key: 'APP_ID',            label: 'App ID (Kimi OAuth)',       description: 'OAuth application ID used by the backend for Kimi auth flow.',            category: 'auth',     sensitive: false, placeholder: '19ea3c1d-...' },
  { key: 'APP_SECRET',        label: 'App Secret (Kimi OAuth)',   description: 'OAuth application secret. Keep private — never expose to the frontend.', category: 'auth',     sensitive: true,  placeholder: 'mTApc...' },
  { key: 'VITE_APP_ID',       label: 'Vite App ID (frontend)',    description: 'Same App ID exposed to the React frontend via Vite.',                    category: 'auth',     sensitive: false, placeholder: '19ea3c1d-...' },
  { key: 'VITE_KIMI_AUTH_URL',label: 'Kimi Auth URL (frontend)', description: 'Base URL for the Kimi authentication service used in the browser.',      category: 'auth',     sensitive: false, placeholder: 'https://auth.kimi.com' },
  // ── Database ──
  { key: 'DATABASE_URL',      label: 'Database URL (MySQL)',      description: 'Full MySQL connection string. Format: mysql://user:pass@host:port/db.', category: 'database', sensitive: true,  placeholder: 'mysql://root:password@host:port/railway' },
  // ── Platform ──
  { key: 'KIMI_AUTH_URL',     label: 'Kimi Auth URL (server)',    description: 'Server-side base URL for the Kimi auth service.',                       category: 'platform', sensitive: false, placeholder: 'https://auth.kimi.com' },
  { key: 'KIMI_OPEN_URL',     label: 'Kimi Open URL',            description: 'Base URL for the Kimi open/data platform API.',                         category: 'platform', sensitive: false, placeholder: 'https://open.kimi.com' },
  // ── Admin Account ──
  { key: 'OWNER_UNION_ID',    label: 'Owner Union ID',           description: 'Unique Kimi platform ID for the store owner account.',                  category: 'admin',    sensitive: true,  placeholder: 'd8as01gpe77...' },
  { key: 'ADMIN_PASSWORD',    label: 'Admin Password',           description: 'Master admin panel password. Change immediately after first deploy.', category: 'admin',    sensitive: true,  placeholder: 'MiniYostore!b' },
  { key: 'ADMIN_EMAIL',       label: 'Admin Email',              description: 'Primary admin email — used for login and system notifications.',       category: 'admin',    sensitive: false, placeholder: 'admin@miniyo.store' },
]

const CATEGORY_LABELS: Record<string, string> = {
  auth: '🔑 OAuth & Authentication',
  database: '🗄️ Database',
  email: '📧 Email',
  admin: '🛡️ Admin Account',
  platform: '🌐 Platform URLs',
}

type EnvValues = Record<string, string>

// Initial values pre-filled from .env.example defaults so the form is not empty
const DEFAULT_VALUES: EnvValues = {
  APP_ID: '19ea3c1d-70f2-804d-8000-0000b3fca5a0',
  APP_SECRET: '',
  VITE_APP_ID: '19ea3c1d-70f2-804d-8000-0000b3fca5a0',
  VITE_KIMI_AUTH_URL: 'https://auth.kimi.com',
  DATABASE_URL: '',
  KIMI_AUTH_URL: 'https://auth.kimi.com',
  KIMI_OPEN_URL: 'https://open.kimi.com',
  OWNER_UNION_ID: '',
  ADMIN_PASSWORD: '',
  ADMIN_EMAIL: 'admin@miniyo.store',
}

export function EnvConfigModule() {
  const { settings, updateSettings } = useAdminStore()

  // Load saved env values from adminStore.settings or fall back to defaults
  const saved: EnvValues = (settings as any).envConfig || DEFAULT_VALUES
  const [values, setValues] = useState<EnvValues>({ ...DEFAULT_VALUES, ...saved })
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [saved2, setSaved2] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const handleChange = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }))
    setDirty(true)
  }

  const handleSave = () => {
    // Persist to adminStore settings so it survives page reload
    updateSettings({ ...(settings as any), envConfig: values })
    setSaved2(true)
    setDirty(false)
    setTimeout(() => setSaved2(false), 2500)
  }

  const toggleReveal = (key: string) => {
    setRevealed(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const categories = ['all', ...Array.from(new Set(ENV_DEFINITIONS.map(d => d.category)))]
  const filtered = activeCategory === 'all'
    ? ENV_DEFINITIONS
    : ENV_DEFINITIONS.filter(d => d.category === activeCategory)

  const grouped: Record<string, EnvVar[]> = {}
  filtered.forEach(d => {
    if (!grouped[d.category]) grouped[d.category] = []
    grouped[d.category].push(d)
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#2D5A4C] flex items-center gap-2">
            <Terminal size={16} /> Environment Variables
          </h2>
          <p className="text-xs text-[#A8A396] mt-0.5">
            View and update all application config variables. Changes are saved to the store config.
            To apply them to Railway or GitHub you must also update those platforms separately.
          </p>
        </div>
        {dirty && (
          <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
            <AlertTriangle size={12} /> Unsaved changes
          </span>
        )}
      </div>

      {/* Warning banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-700 space-y-1">
          <p className="font-semibold">Important — how this panel works</p>
          <p>Values saved here are stored in the admin configuration database (Railway MySQL). They do <strong>not</strong> automatically update your <code>.env</code> file or Railway environment variables. To propagate a change to production, also update it in the Railway dashboard under <em>Variables</em>.</p>
          <p>Sensitive fields (passwords, secrets, connection strings) are masked by default. Click the eye icon to reveal.</p>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              activeCategory === cat
                ? 'bg-[#2D5A4C] text-white'
                : 'bg-white border border-[#D4CFC6] text-[#8B8578] hover:border-[#8FAE7B] hover:text-[#2D5A4C]'
            }`}
          >
            {cat === 'all' ? '🗂 All' : CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Variable groups */}
      {Object.entries(grouped).map(([cat, vars]) => (
        <div key={cat} className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden">
          <div className="px-5 py-3 bg-[#F5F0E6] border-b border-[#E8E4DB]">
            <p className="text-xs font-semibold text-[#5C6B60] uppercase tracking-wider">
              {CATEGORY_LABELS[cat] || cat}
            </p>
          </div>
          <div className="divide-y divide-[#F2EFE9]">
            {vars.map(def => {
              const isRevealed = !!revealed[def.key]
              const val = values[def.key] ?? ''
              return (
                <div key={def.key} className="px-5 py-4 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3 items-start">
                  {/* Label */}
                  <div>
                    <p className="text-sm font-medium text-[#2D5A4C]">{def.label}</p>
                    <code className="text-[10px] text-[#A8A396] bg-[#F5F0E6] px-1.5 py-0.5 rounded mt-0.5 inline-block">{def.key}</code>
                    <p className="text-xs text-[#8B8578] mt-1 leading-relaxed">{def.description}</p>
                  </div>
                  {/* Input */}
                  <div className="relative">
                    <input
                      type={def.sensitive && !isRevealed ? 'password' : 'text'}
                      value={val}
                      onChange={e => handleChange(def.key, e.target.value)}
                      placeholder={def.placeholder}
                      readOnly={def.readonly}
                      className={`w-full h-10 border rounded-lg px-3 pr-10 text-sm outline-none transition-colors font-mono ${
                        def.readonly
                          ? 'bg-[#F5F0E6] border-[#D4CFC6] text-[#A8A396] cursor-not-allowed'
                          : 'bg-white border-[#D4CFC6] text-[#2D5A4C] focus:border-[#8FAE7B]'
                      }`}
                    />
                    {def.sensitive && (
                      <button
                        type="button"
                        onClick={() => toggleReveal(def.key)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A396] hover:text-[#2D5A4C] transition-colors"
                        title={isRevealed ? 'Hide' : 'Reveal'}
                      >
                        {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Save bar */}
      <div className="flex items-center gap-3 sticky bottom-0 bg-[#F2EFE9] py-3 -mx-1 px-1">
        <button
          onClick={handleSave}
          disabled={!dirty}
          className={`h-10 px-5 text-sm rounded-lg flex items-center gap-2 transition-colors ${
            dirty
              ? 'bg-[#2D5A4C] text-white hover:bg-[#1e4539]'
              : 'bg-[#D4CFC6] text-[#A8A396] cursor-not-allowed'
          }`}
        >
          <Save size={14} /> Save Config
        </button>
        {saved2 && (
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <Check size={12} /> Saved to config database
          </span>
        )}
        <button
          onClick={() => { setValues({ ...DEFAULT_VALUES, ...((settings as any).envConfig || {}) }); setDirty(false) }}
          className="h-10 px-4 text-xs text-[#8B8578] border border-[#D4CFC6] rounded-lg hover:border-[#8FAE7B] hover:text-[#2D5A4C] transition-colors flex items-center gap-1.5 ml-auto"
        >
          <RefreshCw size={12} /> Reset
        </button>
      </div>
    </div>
  )
}
