import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { adminLogin, adminGetMe } from '@/lib/adminAuth'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    adminGetMe().then(user => {
      if (user) navigate('/admin', { replace: true })
      else setChecking(false)
    })
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await adminLogin(email.trim().toLowerCase(), password)
    setLoading(false)
    if (result.success) navigate('/admin', { replace: true })
    else setError(result.error)
  }

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE9]">
      <div className="w-8 h-8 border-[3px] border-[#01696f] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE9] p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#01696f] flex items-center justify-center mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="1.5"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">MiniYo Admin</h1>
          <p className="text-sm text-[#888] mt-1">Sign in to your dashboard</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#444] mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com" required autoFocus
              className="w-full px-3.5 py-2.5 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#01696f] focus:ring-2 focus:ring-[#01696f]/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#444] mb-1.5">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              className="w-full px-3.5 py-2.5 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#01696f] focus:ring-2 focus:ring-[#01696f]/20 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 bg-[#01696f] hover:bg-[#015a60] disabled:bg-[#aaa] text-white font-semibold rounded-lg text-sm transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-[#bbb] mt-6">
          <a href="/#/" className="text-[#01696f] hover:underline">← Back to store</a>
        </p>
      </div>
    </div>
  )
}
