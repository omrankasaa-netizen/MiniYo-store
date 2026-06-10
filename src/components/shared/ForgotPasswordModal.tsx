import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Mail, KeyRound, CheckCircle, AlertCircle } from 'lucide-react'
import { useMemberStore } from '@/stores/memberStore'
import type { Locale } from '@/types'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  locale: Locale
  prefilledEmail?: string
}

export function ForgotPasswordModal({ isOpen, onClose, locale, prefilledEmail = '' }: ForgotPasswordModalProps) {
  const requestPasswordReset = useMemberStore(s => s.requestPasswordReset)
  const resetPassword = useMemberStore(s => s.resetPassword)
  const [step, setStep] = useState<'email' | 'code' | 'reset' | 'done'>('email')
  const [email, setEmail] = useState(prefilledEmail)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [displayCode, setDisplayCode] = useState('')

  const isAr = locale === 'ar'

  const handleRequestCode = () => {
    setError('')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(isAr ? 'بريد إلكتروني غير صالح' : 'Please enter a valid email')
      return
    }
    const result = requestPasswordReset(email)
    if (result) {
      setDisplayCode(result.code)
      setStep('code')
    } else {
      setError(isAr ? 'لا يوجد حساب بهذا البريد' : 'No account found with this email')
    }
  }

  const handleVerifyCode = () => {
    setError('')
    if (code !== displayCode) {
      setError(isAr ? 'رمز التحقق غير صحيح' : 'Invalid verification code')
      return
    }
    setStep('reset')
  }

  const handleResetPassword = () => {
    setError('')
    if (newPassword.length < 6) {
      setError(isAr ? '6 أحرف على الأقل' : 'At least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError(isAr ? 'كلمات المرور لا تتطابق' : 'Passwords do not match')
      return
    }
    const success = resetPassword(email, code, displayCode, newPassword)
    if (success) {
      setStep('done')
    } else {
      setError(isAr ? 'حدث خطأ' : 'Something went wrong')
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep('email')
      setEmail(prefilledEmail)
      setCode('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
      setDisplayCode('')
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-teal/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 p-1 text-muted-teal hover:text-dark-teal">
              <X size={18} />
            </button>

            {step === 'email' && (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center mx-auto mb-3">
                  <Mail size={22} className="text-dark-teal" />
                </div>
                <h3 className="font-display text-lg text-dark-teal mb-1">
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </h3>
                <p className="text-sm text-muted-teal mb-4">
                  {isAr ? 'أدخل بريدك لإرسال رمز التحقق' : 'Enter your email to receive a verification code'}
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full h-12 border border-border-beige rounded-xl px-4 mb-3 outline-none focus:border-beige"
                />
                {error && <p className="text-xs text-red-500 mb-2 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
                <button
                  onClick={handleRequestCode}
                  className="w-full h-12 bg-beige text-dark-teal rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors"
                >
                  {isAr ? 'إرسال الرمز' : 'Send Code'}
                </button>
              </div>
            )}

            {step === 'code' && (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center mx-auto mb-3">
                  <KeyRound size={22} className="text-dark-teal" />
                </div>
                <h3 className="font-display text-lg text-dark-teal mb-1">
                  {isAr ? 'أدخل رمز التحقق' : 'Enter Verification Code'}
                </h3>
                <p className="text-sm text-muted-teal mb-2">
                  {isAr ? 'تم إرسال رمز مكون من 6 أرقام إلى' : 'A 6-digit code was sent to'} {email}
                </p>
                {/* Show code for demo purposes */}
                <div className="bg-sage-green/10 border border-sage-green/30 rounded-lg p-2 mb-3">
                  <p className="text-xs text-sage-green font-medium">Demo Code: {displayCode}</p>
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full h-12 border border-border-beige rounded-xl px-4 text-center text-lg font-accent tracking-[0.5em] mb-3 outline-none focus:border-beige"
                />
                {error && <p className="text-xs text-red-500 mb-2 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
                <button
                  onClick={handleVerifyCode}
                  className="w-full h-12 bg-beige text-dark-teal rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors"
                >
                  {isAr ? 'تحقق' : 'Verify'}
                </button>
                <button
                  onClick={() => setStep('email')}
                  className="text-xs text-muted-teal mt-2 hover:underline"
                >
                  {isAr ? 'تغيير البريد' : 'Change email'}
                </button>
              </div>
            )}

            {step === 'reset' && (
              <div className="text-center">
                <h3 className="font-display text-lg text-dark-teal mb-1">
                  {isAr ? 'كلمة مرور جديدة' : 'New Password'}
                </h3>
                <p className="text-sm text-muted-teal mb-4">
                  {isAr ? 'أنشئي كلمة مرور جديدة لحسابك' : 'Create a new password for your account'}
                </p>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder={isAr ? 'كلمة المرور الجديدة' : 'New password'}
                  className="w-full h-12 border border-border-beige rounded-xl px-4 mb-3 outline-none focus:border-beige"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder={isAr ? 'تأكيد كلمة المرور' : 'Confirm password'}
                  className="w-full h-12 border border-border-beige rounded-xl px-4 mb-3 outline-none focus:border-beige"
                />
                {error && <p className="text-xs text-red-500 mb-2 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
                <button
                  onClick={handleResetPassword}
                  className="w-full h-12 bg-beige text-dark-teal rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors"
                >
                  {isAr ? 'تحديث كلمة المرور' : 'Update Password'}
                </button>
              </div>
            )}

            {step === 'done' && (
              <div className="text-center">
                <CheckCircle size={40} className="text-sage-green mx-auto mb-3" />
                <h3 className="font-display text-lg text-dark-teal mb-1">
                  {isAr ? 'تم التحديث!' : 'Password Updated!'}
                </h3>
                <p className="text-sm text-muted-teal mb-4">
                  {isAr ? 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة' : 'You can now sign in with your new password'}
                </p>
                <button
                  onClick={handleClose}
                  className="w-full h-12 bg-beige text-dark-teal rounded-xl font-accent font-semibold hover:bg-beige-dark transition-colors"
                >
                  {isAr ? 'تسجيل الدخول' : 'Sign In'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
