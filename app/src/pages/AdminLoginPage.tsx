import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { adminSetupStatus, adminFirstLogin, adminLogin } from '@/lib/adminAuth'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email address is required')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      // Check setup status first
      const status = await adminSetupStatus()

      if (status.needsSetup) {
        // No admin exists yet — first-time login (no password required)
        const result = await adminFirstLogin(email)
        if (result.success && result.needsPasswordSetup) {
          navigate('/admin/setup-password')
        }
      } else {
        // Normal login with password
        await adminLogin(email, password)
        navigate('/admin')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE9]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E3DC] p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[#2D5A4C]/10 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-[#2D5A4C]" />
            </div>
            <h1 className="text-xl font-semibold text-[#1A2E28]">Admin Access</h1>
            <p className="text-sm text-[#8B8578] mt-1 text-center">
              Sign in to the Miniyo admin panel
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5C6B60] mb-1.5">
                Email address
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-11 border border-[#D4CFC6] rounded-xl px-4 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20 transition-all"
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C6B60] mb-1.5">
                Password
                <span className="text-[#A8A396] font-normal ml-1">(leave blank on first access)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 border border-[#D4CFC6] rounded-xl px-4 pr-10 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20 transition-all"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A396] hover:text-[#5C6B60]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#2D5A4C] text-white font-semibold rounded-xl hover:bg-[#1E4539] transition-colors disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
