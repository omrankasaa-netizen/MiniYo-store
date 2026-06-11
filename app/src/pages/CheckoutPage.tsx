import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Lock, ChevronDown, ChevronUp, Gift, Truck, Sparkles, Crown, Leaf, Diamond, Tag } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useMemberStore } from '@/stores/memberStore'
import { useDiscountStore } from '@/stores/discountStore'
import { showToast } from '@/components/shared/Toast'
import { submitOrder } from '@/lib/storefrontSync'
import { formatPrice, t } from '@/lib/i18n'
import type { Locale } from '@/types'

interface CheckoutPageProps {
  locale: Locale
}

const SHIPPING_ZONES = [
  { key: 'tripoli', label: 'Tripoli', fee: 4 },
  { key: 'akkar', label: 'Akkar', fee: 5 },
  { key: 'beirut', label: 'Beirut', fee: 5 },
  { key: 'other', label: 'Other Areas', fee: 6 },
]

const tierIcons = { bronze: Leaf, silver: Diamond, gold: Crown }
const tierColors = { bronze: '#CD7F32', silver: '#A8A8A8', gold: '#D4A843' }

function getAdminSettings() {
  try {
    const raw = localStorage.getItem('miniyo-admin-store')
    if (raw) {
      const parsed = JSON.parse(raw)
      const state = parsed.state || parsed
      if (state.settings) return state.settings
    }
  } catch { /* ignore */ }
  return { codEnabled: true, wishEnabled: true, freeShippingThreshold: 50 }
}

export function CheckoutPage({ locale }: CheckoutPageProps) {
  const navigate = useNavigate()
  const { items, subtotal, checkout } = useCartStore()
  const memberStore = useMemberStore()
  const discountStore = useDiscountStore()
  const customer = memberStore.customer
  const addresses = memberStore.addresses
  const paymentMethods = memberStore.paymentMethods
  const adminSettings = getAdminSettings()

  const [summaryOpen, setSummaryOpen] = useState(false)
  const [zone, setZone] = useState('')
  const [payment, setPayment] = useState('cod')
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [isGift, setIsGift] = useState(false)
  const [mutePrice, setMutePrice] = useState(false)
  const [giftNote, setGiftNote] = useState('')
  const [selectedAddressId, setSelectedAddressId] = useState('')

  // Pre-fill form from member profile / saved address (authenticated users only)
  const defaultAddress = customer ? (addresses.find(a => a.isDefault) || addresses[0]) : undefined
  const [form, setForm] = useState({
    email: customer?.email || '',
    phone: customer ? (customer.phone || defaultAddress?.phone || '') : '',
    fullName: customer ? (customer.name || defaultAddress?.fullName || '') : '',
    city: customer ? (defaultAddress?.city || '') : '',
    district: customer ? (defaultAddress?.district || '') : '',
    street: customer ? (defaultAddress?.street || '') : '',
    building: customer ? (defaultAddress?.building || '') : '',
    floor: customer ? (defaultAddress?.floor || '') : '',
    apartment: customer ? (defaultAddress?.apartment || '') : '',
    landmark: customer ? (defaultAddress?.landmark || '') : '',
    notes: '',
    whatsappUpdates: false,
  })

  // Reset / pre-fill form whenever the authenticated customer changes (e.g. on logout)
  useEffect(() => {
    const defaultAddress = customer ? (addresses.find(a => a.isDefault) || addresses[0]) : undefined
    setForm({
      email: customer?.email || '',
      phone: customer ? (customer.phone || defaultAddress?.phone || '') : '',
      fullName: customer ? (customer.name || defaultAddress?.fullName || '') : '',
      city: customer ? (defaultAddress?.city || '') : '',
      district: customer ? (defaultAddress?.district || '') : '',
      street: customer ? (defaultAddress?.street || '') : '',
      building: customer ? (defaultAddress?.building || '') : '',
      floor: customer ? (defaultAddress?.floor || '') : '',
      apartment: customer ? (defaultAddress?.apartment || '') : '',
      landmark: customer ? (defaultAddress?.landmark || '') : '',
      notes: '',
      whatsappUpdates: false,
    })
  }, [customer, addresses])

  // Calculate member discount + promo code
  const memberDiscount = customer ? memberStore.calculateDiscount(subtotal) : { discount: 0, reason: '' }
  const promoDiscount = promoCode ? discountStore.calculateDiscount(promoCode, subtotal) : { discount: 0, reason: '' }
  const autoDiscount = discountStore.applyAutoDiscounts(subtotal)
  const activeDiscount = promoDiscount.discount > 0 ? promoDiscount : (memberDiscount.discount > 0 ? memberDiscount : autoDiscount)
  const discount = activeDiscount.discount
  const discountReason = activeDiscount.reason

  // Calculate shipping with member perks
  const qualifiesForFree = subtotal >= (adminSettings.freeShippingThreshold || 50)
  const zoneFee = SHIPPING_ZONES.find(z => z.key === zone)?.fee || 0
  const memberShipping = customer && subtotal < 50 ? memberStore.calculateShipping(subtotal) : { fee: null, reason: '' }
  const deliveryFee = qualifiesForFree ? 0 : (memberShipping.fee !== null ? memberShipping.fee : zoneFee)

  const total = subtotal + deliveryFee - discount

  const codEnabled = adminSettings.codEnabled !== false
  const wishEnabled = adminSettings.wishEnabled !== false

  // Auto-select payment method from saved preferences
  useEffect(() => {
    const defaultPm = paymentMethods.find(p => p.isDefault)
    if (defaultPm) {
      setPayment(defaultPm.type)
    }
  }, [paymentMethods])

  // Apply saved address selection
  const handleAddressSelect = (addrId: string) => {
    setSelectedAddressId(addrId)
    const addr = addresses.find(a => a.id === addrId)
    if (addr) {
      setForm(prev => ({
        ...prev,
        fullName: addr.fullName,
        phone: addr.phone,
        city: addr.city,
        district: addr.district,
        street: addr.street,
        building: addr.building,
        floor: addr.floor,
        apartment: addr.apartment,
        landmark: addr.landmark,
      }))
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-display text-2xl text-dark-teal mb-2">{t('cartEmpty', locale)}</h1>
        <Link to="/shop" className="bg-beige text-dark-teal px-8 py-3 rounded-xl font-accent font-medium hover:bg-beige-dark transition-colors mt-4">
          {t('startShopping', locale)}
        </Link>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = checkout()
    if (!result) return
    const { orderNumber } = result

    // Record in member store if logged in
    if (customer) {
      memberStore.recordOrder({
        subtotal,
        discount,
        shipping: deliveryFee,
        total: total > 0 ? total : 0,
        items: result.items.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
      })
    }

    // Build complete order with all checkout data
    const shippingNotes = [
      form.notes,
      isGift ? `GIFT: ${giftNote || 'Free gift wrapping requested'}` : null,
      mutePrice ? 'Price HIDDEN on packing slip' : null,
      form.whatsappUpdates ? 'Customer wants WhatsApp updates at +961 81 38 59 40' : null,
      promoCode ? `Promo code: ${promoCode}` : null,
    ].filter(Boolean).join(' | ')

    const order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: form.fullName || 'Guest',
      email: form.email || '',
      phone: form.phone || '',
      subtotal,
      discount: discount,
      discountReason: discountReason || '',
      deliveryFee,
      grandTotal: total > 0 ? total : 0,
      paymentMethod: payment as 'cod' | 'wish',
      paymentStatus: 'pending',
      orderStatus: (payment === 'wish' ? 'payment_pending_whish' : 'pending_confirmation') as 'payment_pending_whish' | 'pending_confirmation',
      whatsappConfirmed: false,
      items: result.items.map(i => ({
        productId: i.productId,
        productName: i.name,
        quantity: i.quantity,
        price: i.price,
        sku: i.sku || '',
        size: i.size || null,
      })),
      shippingAddress: {
        fullName: form.fullName,
        phone: form.phone,
        city: form.city,
        district: form.district,
        street: form.street,
        building: form.building,
        floor: form.floor,
        apartment: form.apartment,
        landmark: form.landmark,
        notes: shippingNotes,
      },
      internalNotes: [
        isGift ? `GIFT ORDER${mutePrice ? ' — price HIDDEN on packing slip' : ''}` : null,
        discount > 0 ? `Discount: ${discountReason}` : null,
        form.whatsappUpdates ? 'WhatsApp updates: YES (+961 81 38 59 40)' : null,
        promoCode ? `Promo: ${promoCode}` : null,
      ].filter(Boolean).join(' | ') || '',
      customerNotes: form.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    submitOrder(order)
    navigate(`/order-success/${orderNumber}?total=${total > 0 ? total : 0}&method=${payment}&gift=${isGift ? '1' : '0'}`)
  }

  const membershipTier = customer?.membershipTier || 'bronze'
  const TierIcon = customer ? tierIcons[membershipTier] : null
  const tierColor = customer ? tierColors[membershipTier] : '#8B8578'

  return (
    <div className="max-w-[680px] mx-auto px-4 py-8">
      <nav className="text-sm text-muted-teal mb-2">
        <Link to="/" className="hover:text-dark-teal">{t('home', locale)}</Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="hover:text-dark-teal">{t('shoppingCart', locale)}</Link>
        <span className="mx-2">/</span>
        <span className="text-dark-teal">{t('checkout', locale)}</span>
      </nav>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-dark-teal">{t('checkout', locale)}</h1>
        <span className="flex items-center gap-1 text-green-600 text-sm"><Lock size={14} /> Secure</span>
      </div>

      {/* Membership Banner */}
      {customer && (
        <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 border`} style={{ backgroundColor: `${tierColor}08`, borderColor: `${tierColor}25` }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${tierColor}15` }}>
            {TierIcon && <TierIcon size={20} style={{ color: tierColor }} />}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: tierColor }}>
              {membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)} Member
            </p>
            {discount > 0 ? (
              <p className="text-xs text-sage-green">{discountReason} applied: -{formatPrice(discount)}</p>
            ) : (
              <p className="text-xs text-muted-teal">
                {(customer?.totalOrders || 0) > 0 ? `5% off every order (Silver+) or 10% off (Gold)` : 'Welcome: 10% off your first order'}
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Order Summary (Mobile) */}
        <div className="lg:hidden">
          <button type="button" onClick={() => setSummaryOpen(!summaryOpen)}
            className="flex items-center justify-between w-full py-3 border-b border-border-beige">
            <span className="text-sm font-medium">{summaryOpen ? 'Hide' : 'Show'} Order Summary ({items.length})</span>
            <span className="flex items-center gap-2">
              <span className="font-accent font-semibold">{formatPrice(total)}</span>
              {summaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>
          {summaryOpen && (
            <div className="py-3 border-b border-border-beige space-y-2">
              {items.map(item => (
                <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={item.image} alt="" className="w-12 h-14 object-cover rounded-lg" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-beige text-dark-teal text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{locale === 'ar' ? item.nameAr : item.name}</p>
                    {item.size && <p className="text-[10px] text-muted-teal">Size: {item.size}</p>}
                    {mutePrice && <p className="text-[10px] text-sage-green">Gift — price hidden</p>}
                  </div>
                  <span className="text-sm font-medium">{mutePrice ? '—' : formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-accent font-semibold text-dark-teal mb-4">1. Contact Information</h3>
          <div className="space-y-3">
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige" />
            <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone (e.g. +961 81 38 59 40)" className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige" />
            <label className="flex items-center gap-2 text-sm text-muted-teal cursor-pointer">
              <input type="checkbox" checked={form.whatsappUpdates} onChange={e => setForm({ ...form, whatsappUpdates: e.target.checked })} className="rounded border-border-beige" />
              Send me WhatsApp updates about my order
            </label>
          </div>
          {!customer && (
            <p className="text-xs text-muted-teal mt-2">
              <Link to="/register" className="text-sage-green hover:underline">Create an account</Link> to save your details for faster checkout next time and earn rewards!
            </p>
          )}
        </div>

        {/* Saved Addresses */}
        {addresses.length > 0 && (
          <div>
            <h3 className="font-accent font-semibold text-dark-teal mb-3">1b. Saved Address</h3>
            <div className="space-y-2">
              {addresses.map(addr => (
                <label key={addr.id} className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-beige bg-[#FFF8F9]' : 'border-border-beige hover:bg-cream'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="savedAddress" checked={selectedAddressId === addr.id} onChange={() => handleAddressSelect(addr.id)} className="text-beige" />
                    <div>
                      <p className="text-sm font-medium text-dark-teal">{addr.fullName} — {addr.city}</p>
                      <p className="text-xs text-muted-teal">{addr.street}, {addr.building}{addr.isDefault && <span className="text-sage-green ml-1">(Default)</span>}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Address */}
        <div>
          <h3 className="font-accent font-semibold text-dark-teal mb-4">2. Shipping Address</h3>
          <div className="space-y-3">
            <input type="text" required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Full Name" className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige" />
              <input type="text" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} placeholder="District / Area" className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige" />
            </div>
            <input type="text" required value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} placeholder="Street Address" className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige" />
            <div className="grid grid-cols-3 gap-3">
              <input type="text" required value={form.building} onChange={e => setForm({ ...form, building: e.target.value })} placeholder="Building" className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige" />
              <input type="text" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} placeholder="Floor" className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige" />
              <input type="text" value={form.apartment} onChange={e => setForm({ ...form, apartment: e.target.value })} placeholder="Apt." className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige" />
            </div>
            <input type="text" value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} placeholder="Nearby Landmark (optional)" className="w-full h-12 border border-border-beige rounded-lg px-4 bg-white outline-none focus:border-beige" />
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Delivery notes (optional)" className="w-full h-24 border border-border-beige rounded-lg px-4 py-3 bg-white outline-none focus:border-beige resize-y" />
          </div>
        </div>

        {/* Delivery Method */}
        <div>
          <h3 className="font-accent font-semibold text-dark-teal mb-4">3. Delivery Method</h3>
          <div className="bg-cream rounded-xl p-4 mb-3 flex items-center gap-3">
            <Truck size={20} className="text-sage-green" />
            <div>
              <p className="font-semibold text-sm text-dark-teal">TOPSPEED</p>
              <p className="text-xs text-muted-teal">Delivery across Lebanon in 2-3 business days</p>
            </div>
          </div>

          {qualifiesForFree && (
            <div className="bg-sage-green/10 border border-sage-green/20 rounded-lg p-3 mb-3 text-sm text-sage-green font-medium flex items-center gap-2">
              <Sparkles size={14} /> Free shipping unlocked (over $50)!
            </div>
          )}

          {deliveryFee === 0 && !qualifiesForFree && memberShipping.reason && (
            <div className="bg-[#D4A843]/10 border border-[#D4A843]/20 rounded-lg p-3 mb-3 text-sm font-medium flex items-center gap-2" style={{ color: tierColor }}>
              {TierIcon && <TierIcon size={14} />}
              {memberShipping.reason}!
              {customer && <span className="text-xs opacity-70">({customer.freeShippingUsed || 0}/{membershipTier === 'gold' ? 5 : membershipTier === 'silver' ? 2 : 1} used this month)</span>}
            </div>
          )}

          <div className="space-y-2">
            {SHIPPING_ZONES.map(opt => (
              <label key={opt.key}
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  zone === opt.key ? 'border-beige bg-[#FFF8F9]' : 'border-border-beige hover:bg-cream'
                } ${qualifiesForFree || deliveryFee === 0 ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="zone" value={opt.key} checked={zone === opt.key}
                    onChange={() => setZone(opt.key)} className="text-beige focus:ring-beige"
                    disabled={qualifiesForFree || deliveryFee === 0} />
                  <p className="font-medium text-sm">{opt.label}</p>
                </div>
                <span className="font-accent font-semibold text-sm">
                  {qualifiesForFree || deliveryFee === 0 ? 'FREE' : formatPrice(opt.fee)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Gift Options */}
        <div>
          <h3 className="font-accent font-semibold text-dark-teal mb-4">4. Gift Options</h3>
          <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors mb-3 ${isGift ? 'border-beige bg-[#FFF8F9]' : 'border-border-beige hover:bg-cream'}`}>
            <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} className="rounded border-border-beige text-beige w-5 h-5" />
            <div className="flex items-center gap-2">
              <Gift size={18} className="text-sage-green" />
              <div>
                <p className="font-medium text-sm">This is a gift</p>
                <p className="text-xs text-muted-teal">Free gift wrapping with Miniyo sticker & thank-you card</p>
              </div>
            </div>
          </label>
          {isGift && (
            <div className="space-y-3 pl-4 border-l-2 border-beige ml-2">
              <label className="flex items-center gap-2 text-sm text-muted-teal cursor-pointer">
                <input type="checkbox" checked={mutePrice} onChange={e => setMutePrice(e.target.checked)} className="rounded border-border-beige" />
                Hide prices on packing slip
              </label>
              <textarea value={giftNote} onChange={e => setGiftNote(e.target.value)} placeholder="Add a personal gift note (optional)..." rows={3}
                className="w-full border border-border-beige rounded-lg px-4 py-3 bg-white outline-none focus:border-beige resize-y text-sm" />
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="font-accent font-semibold text-dark-teal mb-4">5. Payment Method</h3>
          <div className="space-y-2">
            {codEnabled && (
              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${payment === 'cod' ? 'border-beige bg-[#FFF8F9]' : 'border-border-beige hover:bg-cream'}`}>
                <input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} className="text-beige focus:ring-beige" />
                <div>
                  <p className="font-medium text-sm">Cash on Delivery (CoD)</p>
                  <p className="text-xs text-muted-teal">Pay when your order arrives</p>
                </div>
              </label>
            )}
            {wishEnabled && (
              <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${payment === 'wish' ? 'border-beige bg-[#FFF8F9]' : 'border-border-beige hover:bg-cream'}`}>
                <input type="radio" name="payment" value="wish" checked={payment === 'wish'} onChange={() => setPayment('wish')} className="text-beige focus:ring-beige" />
                <div>
                  <p className="font-medium text-sm">Wish Money Transfer</p>
                  <p className="text-xs text-muted-teal">Transfer via Wish app, we verify manually</p>
                </div>
              </label>
            )}
            {!codEnabled && !wishEnabled && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">No payment methods available.</p>
            )}
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <h3 className="font-accent font-semibold text-dark-teal mb-3">Promo Code</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1 border border-border-beige rounded-xl px-4 bg-white">
              <Tag size={16} className="text-muted-teal" />
              <input
                type="text"
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value); setPromoError('') }}
                placeholder="Enter promo code"
                className="flex-1 h-12 bg-transparent outline-none text-dark-teal font-mono uppercase"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!promoCode) return
                const result = discountStore.calculateDiscount(promoCode, subtotal)
                if (result.discount > 0) {
                  setPromoError('')
                  showToast(`Promo applied: ${result.reason} — ${formatPrice(result.discount)} off`)
                  discountStore.incrementUsage(result.discountId!)
                } else {
                  setPromoError('Invalid or expired promo code')
                }
              }}
              className="h-12 px-5 bg-beige text-dark-teal rounded-xl font-accent font-medium hover:bg-beige-dark transition-colors"
            >
              Apply
            </button>
          </div>
          {promoError && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
          {discount > 0 && discountReason && (
            <p className="text-xs text-sage-green mt-2 flex items-center gap-1">
              <Sparkles size={12} /> {discountReason} — {formatPrice(discount)} off
            </p>
          )}
        </div>

        {/* Order Total */}
        <div className="bg-cream rounded-xl p-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-teal">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-sage-green">{discountReason}</span>
              <span className="font-medium text-sage-green">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-teal">Shipping (TOPSPEED)</span>
            <span className="font-medium">
              {deliveryFee === 0 ? <span className="text-sage-green">FREE</span> : zone ? formatPrice(deliveryFee) : '—'}
            </span>
          </div>
          {isGift && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-teal">Gift wrapping</span>
              <span className="text-sage-green font-medium">FREE</span>
            </div>
          )}
          <div className="border-t border-border-beige pt-2 flex justify-between">
            <span className="font-semibold text-dark-teal">Total</span>
            <span className="font-display text-xl text-dark-teal">{formatPrice(total)}</span>
          </div>
          {mutePrice && <p className="text-xs text-sage-green">Prices hidden on packing slip</p>}
        </div>

        {/* Submit */}
        <div>
          <button type="submit"
            disabled={items.length === 0 || (!codEnabled && !wishEnabled)}
            className="w-full h-14 bg-beige text-dark-teal rounded-xl font-accent font-semibold text-lg hover:bg-beige-dark transition-colors shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
            Complete Order {total > 0 ? `— ${formatPrice(total)}` : '— FREE'}
          </button>
          <p className="text-xs text-muted-teal text-center mt-3">By placing this order, you agree to our Terms of Service.</p>
        </div>
      </form>
    </div>
  )
}
