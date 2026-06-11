/**
 * Email Templates
 * ----------------
 * All transactional email HTML templates.
 * Each template receives a `data` object and returns { subject, html, text }.
 */

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

const BASE_URL = process.env.APP_URL || 'https://miniyo.store'
const BRAND_COLOR = '#01696f'
const BRAND_NAME = 'Miniyo'

function layout(content: string, preheader = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND_NAME}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body { margin:0; padding:0; background:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .wrapper { max-width:600px; margin:0 auto; background:#ffffff; }
    .header { background:${BRAND_COLOR}; padding:24px 32px; text-align:center; }
    .header img { height:40px; }
    .header h1 { color:#ffffff; margin:8px 0 0; font-size:22px; font-weight:700; letter-spacing:0.5px; }
    .body { padding:32px; }
    .body h2 { color:#1a1a1a; font-size:20px; margin:0 0 12px; }
    .body p { color:#444; font-size:15px; line-height:1.6; margin:0 0 16px; }
    .btn { display:inline-block; background:${BRAND_COLOR}; color:#ffffff !important; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:600; font-size:15px; margin:16px 0; }
    .table { width:100%; border-collapse:collapse; margin:16px 0; }
    .table th { background:#f7f7f7; padding:10px 12px; text-align:left; font-size:13px; color:#666; border-bottom:1px solid #eee; }
    .table td { padding:10px 12px; font-size:14px; color:#333; border-bottom:1px solid #f0f0f0; }
    .total-row td { font-weight:700; font-size:15px; border-top:2px solid #eee; }
    .tier-badge { display:inline-block; padding:4px 12px; border-radius:99px; font-size:13px; font-weight:600; }
    .tier-bronze { background:#FFF3E0; color:#BF6A1F; }
    .tier-silver { background:#F5F5F5; color:#757575; }
    .tier-gold { background:#FFFDE7; color:#C8920A; }
    .footer { background:#f7f7f7; padding:20px 32px; text-align:center; }
    .footer p { font-size:12px; color:#aaa; margin:4px 0; }
    .footer a { color:${BRAND_COLOR}; text-decoration:none; }
  </style>
</head>
<body>
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
  <div class="wrapper">
    <div class="header">
      <h1>🧒 ${BRAND_NAME}</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${BRAND_NAME} · <a href="${BASE_URL}">miniyo.store</a></p>
      <p><a href="${BASE_URL}/#/privacy">Privacy Policy</a> · <a href="${BASE_URL}/#/contact">Contact Us</a></p>
    </div>
  </div>
</body>
</html>`
}

// ── Welcome / Registration ──
export function welcomeEmail(data: { name: string; email: string }): EmailTemplate {
  const content = `
    <h2>Welcome to ${BRAND_NAME}, ${data.name}! 🎉</h2>
    <p>You're officially a <span class="tier-badge tier-bronze">Bronze Member</span> — and we're so glad you're here.</p>
    <p>As a Bronze Member you get:</p>
    <ul style="color:#444;font-size:15px;line-height:2;">
      <li>🎁 <strong>10% off your very first order</strong></li>
      <li>🚚 1 free shipping per month</li>
      <li>🎂 A birthday surprise just for you</li>
    </ul>
    <p>Start shopping and unlock Silver (after $500 spent) for 5% off every order!</p>
    <a href="${BASE_URL}/#/shop" class="btn">Shop Now</a>
    <p style="color:#888;font-size:13px;">Questions? Reply to this email or WhatsApp us anytime.</p>
  `
  return {
    subject: `Welcome to ${BRAND_NAME}, ${data.name}! 🎉`,
    html: layout(content, `You're now a Bronze Member — 10% off your first order!`),
    text: `Welcome to ${BRAND_NAME}, ${data.name}!\n\nYou're now a Bronze Member.\nEnjoy 10% off your first order.\n\nShop at ${BASE_URL}`,
  }
}

// ── Order Confirmation ──
export function orderConfirmationEmail(data: {
  name: string
  orderNumber: string
  items: { name: string; qty: number; unitPrice: number; imageUrl?: string }[]
  subtotal: number
  discountTotal: number
  deliveryFee: number
  grandTotal: number
  paymentMethod: string
  address: string
  discountReason?: string
}): EmailTemplate {
  const rows = data.items.map(i => `
    <tr>
      <td>${i.name}</td>
      <td style="text-align:center">${i.qty}</td>
      <td style="text-align:right">$${i.unitPrice.toFixed(2)}</td>
      <td style="text-align:right">$${(i.qty * i.unitPrice).toFixed(2)}</td>
    </tr>`).join('')

  const content = `
    <h2>Order Confirmed ✅</h2>
    <p>Hi ${data.name}, thank you for your order! We've received it and will confirm via WhatsApp shortly.</p>
    <p><strong>Order #${data.orderNumber}</strong></p>
    <table class="table">
      <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>
        ${rows}
        <tr><td colspan="3" style="text-align:right;padding-top:12px;">Subtotal</td><td style="text-align:right">$${data.subtotal.toFixed(2)}</td></tr>
        ${data.discountTotal > 0 ? `<tr><td colspan="3" style="text-align:right;color:${BRAND_COLOR}">${data.discountReason || 'Discount'}</td><td style="text-align:right;color:${BRAND_COLOR}">-$${data.discountTotal.toFixed(2)}</td></tr>` : ''}
        <tr><td colspan="3" style="text-align:right">Delivery</td><td style="text-align:right">${data.deliveryFee === 0 ? '<span style="color:' + BRAND_COLOR + '">Free</span>' : '$' + data.deliveryFee.toFixed(2)}</td></tr>
        <tr class="total-row"><td colspan="3" style="text-align:right">Total</td><td style="text-align:right">$${data.grandTotal.toFixed(2)}</td></tr>
      </tbody>
    </table>
    <p><strong>Payment:</strong> ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : data.paymentMethod === 'wish' ? 'Whish Money' : 'Card'}</p>
    <p><strong>Deliver to:</strong> ${data.address}</p>
    <a href="${BASE_URL}/#/track-order" class="btn">Track My Order</a>
  `
  return {
    subject: `Order Confirmed — #${data.orderNumber} | ${BRAND_NAME}`,
    html: layout(content, `Your order #${data.orderNumber} is confirmed!`),
    text: `Order #${data.orderNumber} confirmed!\n\nTotal: $${data.grandTotal.toFixed(2)}\nPayment: ${data.paymentMethod}\nDeliver to: ${data.address}\n\nTrack: ${BASE_URL}/#/track-order`,
  }
}

// ── Password Reset ──
export function passwordResetEmail(data: { name: string; code: string }): EmailTemplate {
  const content = `
    <h2>Reset Your Password</h2>
    <p>Hi ${data.name}, we received a request to reset your ${BRAND_NAME} account password.</p>
    <p>Your one-time reset code is:</p>
    <div style="background:#f7f7f7;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
      <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#1a1a1a">${data.code}</span>
    </div>
    <p style="color:#888;font-size:13px;">This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
  `
  return {
    subject: `Your ${BRAND_NAME} Password Reset Code`,
    html: layout(content, `Your reset code: ${data.code}`),
    text: `Hi ${data.name},\n\nYour ${BRAND_NAME} password reset code is: ${data.code}\n\nExpires in 15 minutes.`,
  }
}

// ── Email Verification ──
export function emailVerificationEmail(data: { name: string; code: string }): EmailTemplate {
  const content = `
    <h2>Verify Your Email Address</h2>
    <p>Hi ${data.name}, almost there! Please verify your email address to activate your ${BRAND_NAME} account.</p>
    <div style="background:#f7f7f7;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
      <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#1a1a1a">${data.code}</span>
    </div>
    <p style="color:#888;font-size:13px;">This code expires in 30 minutes.</p>
  `
  return {
    subject: `Verify your ${BRAND_NAME} account`,
    html: layout(content, `Verification code: ${data.code}`),
    text: `Hi ${data.name},\n\nYour ${BRAND_NAME} verification code is: ${data.code}\n\nExpires in 30 minutes.`,
  }
}

// ── Membership Tier Upgrade ──
export function membershipUpgradeEmail(data: {
  name: string
  oldTier: string
  newTier: string
  totalSpent: number
  newDiscount: number
  newFreeShipping: number
}): EmailTemplate {
  const tierClass = `tier-${data.newTier}`
  const content = `
    <h2>You've been upgraded! 🚀</h2>
    <p>Hi ${data.name}, congratulations — you've reached <span class="tier-badge ${tierClass}">${data.newTier.charAt(0).toUpperCase() + data.newTier.slice(1)} Member</span> status!</p>
    <p>You've spent <strong>$${data.totalSpent.toFixed(2)}</strong> with us — thank you for being a loyal customer.</p>
    <p>Your new benefits:</p>
    <ul style="color:#444;font-size:15px;line-height:2;">
      <li>💸 <strong>${data.newDiscount}% off every order</strong></li>
      <li>🚚 ${data.newFreeShipping} free deliveries per month</li>
      ${data.newTier === 'silver' ? '<li>⚡ Early access to sales</li><li>📱 Priority WhatsApp support</li>' : ''}
      ${data.newTier === 'gold' ? '<li>🌟 Early access to new arrivals</li><li>👑 VIP WhatsApp support</li><li>🎁 Exclusive member-only offers</li>' : ''}
    </ul>
    <a href="${BASE_URL}/#/account" class="btn">View My Membership</a>
  `
  return {
    subject: `You're now a ${data.newTier.charAt(0).toUpperCase() + data.newTier.slice(1)} Member! 🎉 | ${BRAND_NAME}`,
    html: layout(content, `Congratulations! You've unlocked ${data.newTier} membership.`),
    text: `Hi ${data.name},\n\nYou've been upgraded to ${data.newTier} membership!\n\nNew benefits: ${data.newDiscount}% off every order, ${data.newFreeShipping} free deliveries/month.\n\nView account: ${BASE_URL}/#/account`,
  }
}

// ── Abandoned Cart Recovery ──
export function abandonedCartEmail(data: {
  name: string
  items: { name: string; imageUrl?: string; price: number }[]
  cartTotal: number
}): EmailTemplate {
  const itemList = data.items.map(i => `<li style="margin-bottom:6px;"><strong>${i.name}</strong> — $${i.price.toFixed(2)}</li>`).join('')
  const content = `
    <h2>You left something behind 🛒</h2>
    <p>Hi ${data.name}, looks like you left some items in your cart. They're waiting for you!</p>
    <ul style="color:#444;font-size:15px;line-height:1.8;padding-left:20px;">${itemList}</ul>
    <p style="font-size:16px;"><strong>Cart Total: $${data.cartTotal.toFixed(2)}</strong></p>
    <a href="${BASE_URL}/#/cart" class="btn">Complete My Order</a>
    <p style="color:#888;font-size:13px;">Items may sell out — don't miss yours!</p>
  `
  return {
    subject: `${data.name}, your cart misses you 🛒 | ${BRAND_NAME}`,
    html: layout(content, `You left $${data.cartTotal.toFixed(2)} worth of items in your cart.`),
    text: `Hi ${data.name},\n\nYou have items waiting in your cart ($${data.cartTotal.toFixed(2)}).\n\nComplete your order: ${BASE_URL}/#/cart`,
  }
}

// ── Order Status Update ──
export function orderStatusEmail(data: {
  name: string
  orderNumber: string
  newStatus: string
  note?: string
}): EmailTemplate {
  const statusLabels: Record<string, string> = {
    confirmed: '✅ Confirmed',
    packed: '📦 Packed',
    out_for_delivery: '🚚 Out for Delivery',
    delivered: '🎉 Delivered',
    cancelled: '❌ Cancelled',
    refunded: '💸 Refunded',
  }
  const label = statusLabels[data.newStatus] || data.newStatus
  const content = `
    <h2>Order Update: ${label}</h2>
    <p>Hi ${data.name}, here's an update on your order <strong>#${data.orderNumber}</strong>.</p>
    <p>Status: <strong>${label}</strong></p>
    ${data.note ? `<p style="background:#f7f7f7;border-radius:8px;padding:12px 16px;">${data.note}</p>` : ''}
    <a href="${BASE_URL}/#/track-order" class="btn">Track My Order</a>
  `
  return {
    subject: `Order #${data.orderNumber} Update: ${label} | ${BRAND_NAME}`,
    html: layout(content, `Your order #${data.orderNumber} is now: ${label}`),
    text: `Hi ${data.name},\n\nOrder #${data.orderNumber} update: ${label}\n${data.note ? '\nNote: ' + data.note : ''}\n\nTrack: ${BASE_URL}/#/track-order`,
  }
}
