import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ForgotPasswordModal } from '@/components/shared/ForgotPasswordModal'
import { t } from '@/lib/i18n'
import type { Locale } from '@/types'

interface LoginPageProps {
  locale: Locale
  mode?: 'login' | 'register'
}

export function LoginPage({ locale, mode: initialMode = 'login' }: LoginPageProps) {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', dateOfBirth: '', password: '', confirmPassword: '', agreeTerms: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        const result = await login(form.email, form.password) as any
        // Navigate based on role
        const role = result?.user?.role || 'customer'
        if (role === 'admin' || role === 'super_admin' || role === 'staff') {
          navigate('/admin')
        } else {
          navigate('/account')
        }
      } else {
        if (form.password !== form.confirmPassword) {
          setError(locale === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
          setIsLoading(false)
          return
        }
        if (!form.agreeTerms) {
          setError(locale === 'ar' ? 'يرجى الموافقة على الشروط' : 'Please agree to the terms')
          setIsLoading(false)
          return
        }
        await register({
          email: form.email,
          password: form.password,
          name: form.fullName,
          phone: form.phone,
        })
        navigate('/account')
      }
    } catch (err: any) {
      setError(err.message || (locale === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-beige items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #5B3E29 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative text-center">
          <motion.img
            src="/images/logo.png"
            alt="Miniyo"
            className="w-32 h-32 mx-auto mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <h2 className="font-display text-3xl text-dark-teal mb-3">{t('loginWelcome', locale)}</h2>
          <p className="text-[#8B8578] max-w-xs mx-auto">{t('loginWelcomeDesc', locale)}</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-cream">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <img src="/images/logo.png" alt="Miniyo" className="w-20 h-20 mx-auto" />
            </Link>
          </div>

          <h1 className="font-display text-2xl text-dark-teal mb-1">
            {isLogin ? t('login', locale) : t('register', locale)}
          </h1>
          <p className="text-[#8B8578] text-sm mb-6">
            {isLogin ? t('loginDesc', locale) : t('registerDesc', locale)}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#5C6B60] mb-1.5">{t('fullName', locale)} *</label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={form.fullName}
                    onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full h-11 border border-[#D4CFC6] rounded-xl px-4 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20 transition-all"
                    placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5C6B60] mb-1.5">{t('phone', locale)}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full h-11 border border-[#D4CFC6] rounded-xl px-4 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20 transition-all"
                    placeholder="+961 XX XXX XXX"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#5C6B60] mb-1.5">{t('email', locale)} *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full h-11 border border-[#D4CFC6] rounded-xl px-4 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C6B60] mb-1.5">{t('password', locale)} *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full h-11 border border-[#D4CFC6] rounded-xl px-4 pr-10 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20 transition-all"
                  placeholder={isLogin ? t('password', locale) : t('passwordMin6', locale)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A396] hover:text-[#5C6B60]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#5C6B60] mb-1.5">{t('confirmPassword', locale)} *</label>
                <input
                  type="password"
                  required={!isLogin}
                  value={form.confirmPassword}
                  onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full h-11 border border-[#D4CFC6] rounded-xl px-4 text-sm bg-white outline-none focus:border-[#8FAE7B] focus:ring-2 focus:ring-[#8FAE7B]/20 transition-all"
                />
              </div>
            )}

            {!isLogin && (
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={e => setForm(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-[#D4CFC6] text-[#2D5A4C] focus:ring-[#8FAE7B]"
                />
                <span className="text-xs text-[#8B8578]">
                  {t('agreeTerms', locale)} <Link to="/faq" className="text-[#2D5A4C] hover:underline">{t('terms', locale)}</Link> {t('and', locale)} <Link to="/faq" className="text-[#2D5A4C] hover:underline">{t('privacy', locale)}</Link>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-dark-teal text-cream font-semibold rounded-xl hover:bg-[#1E4539] transition-colors disabled:opacity-50"
            >
              {isLoading ? '...' : isLogin ? t('login', locale) : t('register', locale)}
            </button>
          </form>

          <div className="mt-6 text-center">
            {isLogin ? (
              <>
                <button onClick={() => setShowForgot(true)} className="text-sm text-[#8B8578] hover:text-[#2D5A4C] transition-colors mb-3">
                  {t('forgotPassword', locale)}
                </button>
                <p className="text-sm text-[#8B8578]">
                  {t('noAccount', locale)} <button onClick={() => { setIsLogin(false); setError('') }} className="text-[#2D5A4C] font-semibold hover:underline">{t('register', locale)}</button>
                </p>
              </>
            ) : (
              <p className="text-sm text-[#8B8578]">
                {t('haveAccount', locale)} <button onClick={() => { setIsLogin(true); setError('') }} className="text-[#2D5A4C] font-semibold hover:underline">{t('login', locale)}</button>
              </p>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-[#A8A396] hover:text-[#5C6B60] transition-colors">
              {t('backToHome', locale)}
            </Link>
          </div>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal locale={locale} onClose={() => setShowForgot(false)} />}
    </div>
  )
}
