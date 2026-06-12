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

  // If already logged in as admin, go straight to panel
  useEffect(() => {
    adminGetMe().then((user) => {
      if (user) navigate('/admin', { replace: true })
      else setChecking(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await adminLogin(email.trim().toLowerCase(), password)
    setLoading(false)
    if (result.success) {
      navigate('/admin', { replace: true })
    } else {
      setError(result.error)
    }
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2EFE9' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #01696f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2EFE9', fontFamily: 'inherit' }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: '2.5rem 2rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 0.75rem' }}>
            <rect width="48" height="48" rx="12" fill="#01696f" />
            <path d="M14 16h20l-2 14H16L14 16z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="19" cy="34" r="2" fill="#fff" />
            <circle cx="29" cy="34" r="2" fill="#fff" />
            <path d="M10 12h4l2 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>MiniYo Admin</h1>
          <p style={{ fontSize: '0.875rem', color: '#888', marginTop: '0.25rem' }}>Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#444', marginBottom: '0.375rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
              style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1.5px solid #ddd', borderRadius: 8, fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#01696f'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#444', marginBottom: '0.375rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1.5px solid #ddd', borderRadius: 8, fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#01696f'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 8, padding: '0.625rem 0.875rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#c0392b' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: loading ? '#aaa' : '#01696f', color: '#fff', border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#bbb', marginTop: '1.5rem' }}>
          Admin access only — <a href="/#/" style={{ color: '#01696f', textDecoration: 'none' }}>Back to store</a>
        </p>
      </div>
    </div>
  )
}
