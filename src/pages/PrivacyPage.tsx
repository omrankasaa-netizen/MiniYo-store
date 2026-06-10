import { Link } from 'react-router'
import { Shield, Lock, Eye, Trash2, Cookie } from 'lucide-react'

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-border-beige p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#2D5A4C]/10 flex items-center justify-center">
              <Shield size={24} className="text-[#2D5A4C]" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-dark-teal">Privacy Policy</h1>
              <p className="text-xs text-muted-teal">Last updated: January 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-[#5C6B60]">
            <section>
              <h2 className="font-semibold text-dark-teal flex items-center gap-2 mb-2">
                <Eye size={16} /> Information We Collect
              </h2>
              <p>We collect information you provide directly to us when you create an account, place an order, or contact us. This includes your name, email address, phone number, shipping address, and payment preferences.</p>
            </section>

            <section>
              <h2 className="font-semibold text-dark-teal flex items-center gap-2 mb-2">
                <Lock size={16} /> How We Protect Your Data
              </h2>
              <p>We implement appropriate security measures to protect your personal information. Passwords are hashed using industry-standard bcrypt hashing. We use secure connections (HTTPS) for all data transmission.</p>
            </section>

            <section>
              <h2 className="font-semibold text-dark-teal flex items-center gap-2 mb-2">
                <Cookie size={16} /> Cookies
              </h2>
              <p>We use cookies and similar technologies to maintain your session, remember your preferences, and analyze site usage. You can control cookies through your browser settings.</p>
            </section>

            <section>
              <h2 className="font-semibold text-dark-teal flex items-center gap-2 mb-2">
                <Trash2 size={16} /> Your Rights
              </h2>
              <p>You have the right to access, correct, or delete your personal information. Contact us at miniyo.store.lb@gmail.com to exercise these rights.</p>
            </section>

            <section>
              <h2 className="font-semibold text-dark-teal mb-2">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:miniyo.store.lb@gmail.com" className="text-[#2D5A4C] underline">miniyo.store.lb@gmail.com</a> or via WhatsApp at +961 81 38 59 40.</p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-border-beige text-center">
            <Link to="/" className="text-sm text-muted-teal hover:text-dark-teal transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
