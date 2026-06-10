import { Link } from 'react-router'
import { FileText, Truck, RotateCcw, CreditCard, AlertCircle } from 'lucide-react'

export function TermsPage() {
  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-border-beige p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#2D5A4C]/10 flex items-center justify-center">
              <FileText size={24} className="text-[#2D5A4C]" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-dark-teal">Terms of Service</h1>
              <p className="text-xs text-muted-teal">Last updated: January 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-[#5C6B60]">
            <section>
              <h2 className="font-semibold text-dark-teal mb-2">1. Acceptance of Terms</h2>
              <p>By accessing and using Miniyo, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            </section>

            <section>
              <h2 className="font-semibold text-dark-teal flex items-center gap-2 mb-2">
                <CreditCard size={16} /> 2. Orders and Payment
              </h2>
              <p>We accept Cash on Delivery (CoD) and Whish money transfers. Orders are confirmed after stock availability is verified. Prices are listed in USD.</p>
            </section>

            <section>
              <h2 className="font-semibold text-dark-teal flex items-center gap-2 mb-2">
                <Truck size={16} /> 3. Shipping and Delivery
              </h2>
              <p>We deliver throughout Lebanon. Delivery fees vary by region: Beirut ($3), Mount Lebanon ($3), North ($4), South ($4), Bekaa ($5). Free shipping on orders over $50.</p>
            </section>

            <section>
              <h2 className="font-semibold text-dark-teal flex items-center gap-2 mb-2">
                <RotateCcw size={16} /> 4. Returns and Exchanges
              </h2>
              <p>Unused items in original packaging may be returned or exchanged within 14 days of delivery. Contact us via WhatsApp to initiate a return.</p>
            </section>

            <section>
              <h2 className="font-semibold text-dark-teal flex items-center gap-2 mb-2">
                <AlertCircle size={16} /> 5. Limitation of Liability
              </h2>
              <p>Miniyo shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid for your order.</p>
            </section>

            <section>
              <h2 className="font-semibold text-dark-teal mb-2">Contact</h2>
              <p>For any questions about these terms, contact us at <a href="mailto:miniyo.store.lb@gmail.com" className="text-[#2D5A4C] underline">miniyo.store.lb@gmail.com</a>.</p>
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
