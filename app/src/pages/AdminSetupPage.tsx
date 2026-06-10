import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { adminSetupPassword } from '@/lib/adminAuth'

export function AdminSetupPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    try {
      await adminSetupPassword(password, confirmPassword)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Failed to set password')
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
              <KeyRound className="w-6 h-6 text-[#2D5A4C]" />
            </div>
            <h1 className="text-xl font-semibold text-[#1A2E28]">Set Admin Password</h1>
            <p className="text-sm text-[#8B8578] mt-1 text-center">
              Create a secure password for your admin account.
              <br />
              This will be stored in the database.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5C6B60] mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 border border-[#D4CFC6] rounded-xl px-4 pr-10 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20 transition-all"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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

            <div>
              <label className="block text-sm font-medium text-[#5C6B60] mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full h-11 border border-[#D4CFC6] rounded-xl px-4 pr-10 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20 transition-all"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A396] hover:text-[#5C6B60]"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#2D5A4C] text-white font-semibold rounded-xl hover:bg-[#1E4539] transition-colors disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Saving…' : 'Save password & continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
