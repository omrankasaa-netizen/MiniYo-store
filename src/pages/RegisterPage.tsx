import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, Calendar, Lock, Eye, EyeOff, Gift, Truck, Sparkles, Leaf } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMemberStore } from '@/stores/memberStore'
import type { Locale } from '@/types'

interface RegisterPageProps {
  locale: Locale
}

export function RegisterPage({ locale }: RegisterPageProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register } = useAuth()
  const memberRegister = useMemberStore(s => s.register)
  const referralCode = searchParams.get('ref') || ''
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dateOfBirth: '', password: '', confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showWelcome, setShowWelcome] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = locale === 'ar' ? 'الاسم مطلوب' : 'Full name is required'
    if (!form.email.trim()) e.email = locale === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = locale === 'ar' ? 'بريد إلكتروني غير صالح' : 'Invalid email'
    if (!form.dateOfBirth) e.dateOfBirth = locale === 'ar' ? 'تاريخ الميلاد مطلوب' : 'Date of birth is required'
    if (!form.password) e.password = locale === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required'
    else if (form.password.length < 6) e.password = locale === 'ar' ? '6 أحرف على الأقل' : 'At least 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = locale === 'ar' ? 'كلمات المرور لا تتطابق' : 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)

    try {
      // Register with unified auth system
      await register({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
      })

      // Sync to member store for profile data (children, addresses, membership)
      memberRegister({
        name: form.name,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        password: form.password,
        referralCode: referralCode || undefined,
      })

      setShowWelcome(true)
    } catch (err: any) {
      setErrors({ email: err.message || (locale === 'ar' ? 'فشل التسجيل' : 'Registration failed') })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismissWelcome = () => {
    setShowWelcome(false)
    navigate('/account')
  }

  const isAr = locale === 'ar'

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/images/logo.png" alt="Miniyo" className="h-14 mx-auto mb-3" />
          </Link>
          <h1 className="font-display text-2xl text-dark-teal">
            {isAr ? 'انضمي لعائلة مينيو' : 'Join the Miniyo Family'}
          </h1>
          <p className="text-sm text-muted-teal mt-1">
            {isAr ? 'سجلي واحصلي على عضوية برونز + مفاجآت ترحيب' : 'Register and get Bronze membership + welcome gifts'}
          </p>
          {referralCode && (
            <div className="mt-3 bg-[#D4A843]/10 border border-[#D4A843]/20 rounded-lg px-3 py-2 inline-flex items-center gap-2">
              <Leaf size={14} className="text-[#B8923A]" />
              <span className="text-xs text-[#B8923A] font-medium">
                {isAr ? `رمز الإحالة: ${referralCode} — ستحصلي على مكافأة ترحيب` : `Referral: ${referralCode} — Welcome bonus included`}
              </span>
            </div>
          )}
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border-beige p-6 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-dark-teal mb-1.5">
                {isAr ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-teal" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder={isAr ? 'مثال: ليلى حسن' : 'e.g. Layla Hassan'}
                  className="w-full h-12 pl-10 pr-4 border border-border-beige rounded-xl bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-dark-teal mb-1.5">
                {isAr ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-teal" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder={isAr ? 'مثال: layla@email.com' : 'e.g. layla@email.com'}
                  className="w-full h-12 pl-10 pr-4 border border-border-beige rounded-xl bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-dark-teal mb-1.5">
                {isAr ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-teal" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+961 __ __ ___"
                  className="w-full h-12 pl-10 pr-4 border border-border-beige rounded-xl bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-dark-teal mb-1.5">
                {isAr ? 'تاريخ الميلاد' : 'Date of Birth'} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-teal" />
                <input
                  type="date"
                  required
                  value={form.dateOfBirth}
                  onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 border border-border-beige rounded-xl bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20 text-dark-teal"
                />
              </div>
              {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-dark-teal mb-1.5">
                {isAr ? 'كلمة المرور' : 'Password'} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-teal" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder={isAr ? '6 أحرف على الأقل' : 'At least 6 characters'}
                  className="w-full h-12 pl-10 pr-10 border border-border-beige rounded-xl bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-teal hover:text-dark-teal"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-dark-teal mb-1.5">
                {isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-teal" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full h-12 pl-10 pr-10 border border-border-beige rounded-xl bg-white outline-none focus:border-beige focus:ring-2 focus:ring-beige/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-teal hover:text-dark-teal"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-beige text-dark-teal rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors mt-2 disabled:opacity-50"
            >
              {isLoading ? '...' : isAr ? 'سجلي الآن' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border-beige" />
            <span className="text-xs text-muted-teal">{isAr ? 'أو' : 'or'}</span>
            <div className="flex-1 h-px bg-border-beige" />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-teal">
            {isAr ? 'مسجلة بالفعل؟' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-dark-teal font-medium hover:underline">
              {isAr ? 'سجلي دخول' : 'Sign in'}
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-teal/50 backdrop-blur-sm z-50"
              onClick={handleDismissWelcome}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[440px] bg-white rounded-2xl shadow-2xl z-50 p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#CD7F32]/15 flex items-center justify-center mb-4">
                  <Leaf size={28} className="text-[#CD7F32]" />
                </div>
                <h2 className="font-display text-2xl text-dark-teal mb-1">
                  {isAr ? 'أهلاً وسهلاً' : `Welcome, ${form.name || 'Friend'}!`}
                </h2>
                <p className="text-sm text-muted-teal mb-2">
                  {isAr
                    ? 'أنتي الآن عضوة برونز في عائلة مينيو'
                    : `You're now a Bronze member of the Miniyo family`}
                </p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#CD7F32]/10 text-[#CD7F32] text-xs font-semibold rounded-full mb-6">
                  <Leaf size={12} /> {isAr ? 'عضوية برونز' : 'Bronze Membership'}
                </span>

                <div className="w-full space-y-3 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-cream rounded-xl text-left">
                    <Gift size={18} className="text-sage-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-dark-teal">{isAr ? 'خصم الترحيب' : 'Welcome Discount'}</p>
                      <p className="text-xs text-muted-teal">{isAr ? '10% خصم على أول طلبية' : '10% off your first order'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-cream rounded-xl text-left">
                    <Truck size={18} className="text-sage-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-dark-teal">{isAr ? 'توصيل مجاني هدية' : 'Free Shipping Gift'}</p>
                      <p className="text-xs text-muted-teal">{isAr ? 'توصيل مجاني لأول طلبية' : 'Free shipping on your first order'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-cream rounded-xl text-left">
                    <Sparkles size={18} className="text-sage-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-dark-teal">{isAr ? 'مكافآت تتراكم' : 'Rewards Grow'}</p>
                      <p className="text-xs text-muted-teal">{isAr ? 'فضي عند 500$ - ذهبي عند 1000$' : 'Silver at $500 — Gold at $1,000'}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDismissWelcome}
                  className="w-full h-12 bg-beige text-dark-teal rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors"
                >
                  {isAr ? 'يلا نتسوّق!' : 'Start Shopping!'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
