/**
 * orderNotification.ts
 * --------------------
 * Email notification system for new orders.
 *
 * How it works (frontend-only, no backend required):
 *   1. When an order is placed, buildOrderEmailBody() creates a formatted
 *      plain-text + HTML email body.
 *   2. sendOrderNotification() opens a mailto: link with the email pre-filled.
 *      Staff can optionally configure a webhook URL in the admin panel; if set,
 *      the function also fires a POST to that URL so tools like Make/Zapier/n8n
 *      can forward the email automatically.
 *
 * To wire up automatic sending without staff interaction:
 *   - Create a free Make.com / Zapier / n8n webhook.
 *   - Paste the webhook URL in Admin → Settings → Notifications.
 *   - The webhook receives a JSON payload and sends the email via Gmail / SMTP.
 *
 * Staff email configuration is stored in adminStore.notificationSettings.
 */

export interface OrderNotificationPayload {
  orderNumber: string
  customerName: string
  phone: string
  email: string
  paymentMethod: 'cod' | 'wish' | string
  items: { productName: string; sku: string; size?: string; quantity: number; price: number }[]
  subtotal: number
  discount: number
  discountReason?: string
  deliveryFee: number
  grandTotal: number
  shippingAddress: {
    fullName?: string
    building?: string
    street?: string
    district?: string
    city?: string
    floor?: string
    apartment?: string
    landmark?: string
    notes?: string
  }
  customerNotes?: string
  isGift?: boolean
  createdAt: string
}

/** Formats a price for the email (plain dollars). */
function fmt(amount: number): string {
  return `$${amount.toFixed(2)}`
}

/** Builds the plain-text body shown in the mailto link fallback. */
export function buildOrderEmailText(order: OrderNotificationPayload): string {
  const lines: string[] = [
    `🛍️ NEW ORDER — ${order.orderNumber}`,
    `Placed: ${new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`,
    '',
    '── CUSTOMER ──────────────────────────',
    `Name:    ${order.customerName}`,
    `Phone:   ${order.phone}`,
    `Email:   ${order.email || 'N/A'}`,
    '',
    '── SHIPPING ──────────────────────────',
    `${order.shippingAddress.building || ''}${order.shippingAddress.street ? ', ' + order.shippingAddress.street : ''}`,
    `${order.shippingAddress.district || ''}${order.shippingAddress.city ? ', ' + order.shippingAddress.city : ''}`,
    order.shippingAddress.floor ? `Floor ${order.shippingAddress.floor}${order.shippingAddress.apartment ? ', Apt ' + order.shippingAddress.apartment : ''}` : '',
    order.shippingAddress.landmark ? `Landmark: ${order.shippingAddress.landmark}` : '',
    order.shippingAddress.notes ? `Delivery note: ${order.shippingAddress.notes}` : '',
    '',
    '── ITEMS ─────────────────────────────',
    ...order.items.map(i =>
      `  • ${i.productName}${i.size ? ` (${i.size})` : ''} × ${i.quantity}   ${fmt(i.price * i.quantity)}`
    ),
    '',
    '── TOTALS ────────────────────────────',
    `Subtotal:     ${fmt(order.subtotal)}`,
    order.discount > 0 ? `Discount:     -${fmt(order.discount)}${order.discountReason ? '  (' + order.discountReason + ')' : ''}` : '',
    `Delivery:     ${order.deliveryFee === 0 ? 'FREE' : fmt(order.deliveryFee)}`,
    `GRAND TOTAL:  ${fmt(order.grandTotal)}`,
    `Payment:      ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Wish Money'}`,
    '',
    order.isGift ? '🎁 GIFT ORDER — prices hidden on packing slip' : '',
    order.customerNotes ? `Customer note: "${order.customerNotes}"` : '',
    '',
    '──────────────────────────────────────',
    'Miniyo Admin Panel | miniyo.store.lb@gmail.com',
  ].filter(l => l !== undefined && l !== null) as string[]

  return lines.filter((_, i, arr) => !(arr[i - 1] === '' && arr[i] === '')).join('\n').trim()
}

/** Builds a clean HTML email body for webhook-based delivery. */
export function buildOrderEmailHtml(order: OrderNotificationPayload): string {
  const addr = order.shippingAddress
  const addrLines = [
    addr.building || '',
    addr.street ? `, ${addr.street}` : '',
    addr.district ? `<br>${addr.district}` : '',
    addr.city ? `, ${addr.city}` : '',
    addr.floor ? `<br>Floor ${addr.floor}` : '',
    addr.apartment ? `, Apt ${addr.apartment}` : '',
    addr.landmark ? `<br><em>Landmark: ${addr.landmark}</em>` : '',
    addr.notes ? `<br><strong>Note:</strong> ${addr.notes}` : '',
  ].join('')

  const itemRows = order.items.map(i => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #f0ede8">${i.productName}${i.size ? ` <span style="color:#888;font-size:12px">(${i.size})</span>` : ''}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f0ede8;color:#888;font-size:12px">${i.sku}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f0ede8;text-align:center">${i.quantity}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f0ede8;text-align:right">${fmt(i.price)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f0ede8;text-align:right;font-weight:600">${fmt(i.price * i.quantity)}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#2a2a2a">
<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
  <!-- Header -->
  <div style="background:#2D5A4C;padding:24px 28px;">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">🛍️ New Order — ${order.orderNumber}</h1>
    <p style="margin:4px 0 0;color:#a8c9bd;font-size:13px">${new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
  </div>

  <!-- Body -->
  <div style="padding:24px 28px">
    <!-- Customer + Address -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr>
        <td style="width:50%;vertical-align:top;padding-right:12px">
          <p style="margin:0 0 6px;font-weight:700;font-size:11px;text-transform:uppercase;color:#888;letter-spacing:.06em">Customer</p>
          <p style="margin:0;font-weight:600;color:#2D5A4C">${order.customerName}</p>
          <p style="margin:2px 0;color:#555">${order.phone}</p>
          <p style="margin:2px 0;color:#555">${order.email || 'N/A'}</p>
        </td>
        <td style="width:50%;vertical-align:top">
          <p style="margin:0 0 6px;font-weight:700;font-size:11px;text-transform:uppercase;color:#888;letter-spacing:.06em">Ship To</p>
          <p style="margin:0;font-weight:600;color:#2D5A4C">${addr.fullName || order.customerName}</p>
          <p style="margin:2px 0;color:#555;line-height:1.5">${addrLines}</p>
        </td>
      </tr>
    </table>

    ${order.isGift ? '<div style="background:#fff0f3;border:1px solid #ffd0da;border-radius:8px;padding:10px 14px;margin-bottom:16px"><strong style="color:#c53030">🎁 GIFT ORDER</strong> — prices hidden on packing slip</div>' : ''}
    ${order.customerNotes ? `<div style="background:#fffbec;border:1px solid #f5e07a;border-radius:8px;padding:10px 14px;margin-bottom:16px"><strong>Customer note:</strong> "${order.customerNotes}"</div>` : ''}

    <!-- Items -->
    <p style="margin:0 0 8px;font-weight:700;font-size:11px;text-transform:uppercase;color:#888;letter-spacing:.06em">Items</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <thead>
        <tr style="background:#f5f3ef">
          <th style="padding:7px 8px;text-align:left;font-size:11px;color:#888">Product</th>
          <th style="padding:7px 8px;text-align:left;font-size:11px;color:#888">SKU</th>
          <th style="padding:7px 8px;text-align:center;font-size:11px;color:#888">Qty</th>
          <th style="padding:7px 8px;text-align:right;font-size:11px;color:#888">Price</th>
          <th style="padding:7px 8px;text-align:right;font-size:11px;color:#888">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <!-- Totals -->
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:4px 0;color:#888">Subtotal</td><td style="padding:4px 0;text-align:right">${fmt(order.subtotal)}</td></tr>
      ${order.discount > 0 ? `<tr><td style="padding:4px 0;color:#d4a843">Discount${order.discountReason ? ' (' + order.discountReason + ')' : ''}</td><td style="padding:4px 0;text-align:right;color:#d4a843">-${fmt(order.discount)}</td></tr>` : ''}
      <tr><td style="padding:4px 0;color:#888">Delivery</td><td style="padding:4px 0;text-align:right">${order.deliveryFee === 0 ? '<span style="color:#2D5A4C;font-weight:600">FREE</span>' : fmt(order.deliveryFee)}</td></tr>
      <tr style="border-top:2px solid #f0ede8">
        <td style="padding:8px 0 0;font-weight:700;font-size:16px;color:#2D5A4C">Grand Total</td>
        <td style="padding:8px 0 0;text-align:right;font-weight:700;font-size:16px;color:#2D5A4C">${fmt(order.grandTotal)}</td>
      </tr>
      <tr><td style="padding:4px 0;color:#888">Payment</td><td style="padding:4px 0;text-align:right">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Wish Money'}</td></tr>
    </table>
  </div>

  <!-- Footer -->
  <div style="background:#f5f3ef;padding:16px 28px;text-align:center">
    <p style="margin:0;font-size:12px;color:#aaa">Miniyo Admin · miniyo.store.lb@gmail.com · +961 81 38 59 40</p>
  </div>
</div>
</body></html>`
}

export interface NotificationSettings {
  /** Staff emails to notify on each order. Comma-separated. */
  staffEmails: string
  /** If true, open mailto fallback when no webhook configured. */
  emailEnabled: boolean
  /** Optional Make/Zapier/n8n webhook URL for automatic sending. */
  webhookUrl: string
  /** If true, also send a WhatsApp message to the staff phone. */
  whatsappEnabled: boolean
  /** Staff WhatsApp number (international format, no +). */
  staffWhatsapp: string
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  staffEmails: 'miniyo.store.lb@gmail.com',
  emailEnabled: true,
  webhookUrl: '',
  whatsappEnabled: true,
  staffWhatsapp: '96181385940',
}

/**
 * Sends an order notification to staff.
 *
 * Priority:
 *   1. If webhookUrl is set → POST JSON payload to the webhook (Make/Zapier/n8n).
 *   2. If emailEnabled → open a mailto: link (manual fallback, opens staff's email client).
 *   3. If whatsappEnabled → open a wa.me link with the order summary.
 */
export async function sendOrderNotification(
  order: OrderNotificationPayload,
  settings: NotificationSettings
): Promise<void> {
  const subject = encodeURIComponent(`[Miniyo] New Order ${order.orderNumber} — ${order.customerName}`)
  const textBody = buildOrderEmailText(order)
  const htmlBody = buildOrderEmailHtml(order)

  // 1. Webhook (automatic, no user interaction required)
  if (settings.webhookUrl) {
    try {
      await fetch(settings.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: decodeURIComponent(subject),
          to: settings.staffEmails,
          text: textBody,
          html: htmlBody,
          order,
        }),
      })
    } catch (err) {
      console.warn('[Miniyo] Order webhook failed:', err)
    }
  }

  // 2. mailto fallback (opens staff email client)
  if (settings.emailEnabled && !settings.webhookUrl) {
    const to = encodeURIComponent(settings.staffEmails)
    const body = encodeURIComponent(textBody)
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`
    // Open in background tab so checkout flow is not interrupted
    const a = document.createElement('a')
    a.href = mailto
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // 3. WhatsApp staff alert
  if (settings.whatsappEnabled && settings.staffWhatsapp) {
    const wa = `https://wa.me/${settings.staffWhatsapp}?text=${encodeURIComponent(
      `🛍️ NEW ORDER ${order.orderNumber}\n${order.customerName} · ${order.phone}\n${fmt(order.grandTotal)} · ${order.paymentMethod === 'cod' ? 'CoD' : 'Wish'}\nCheck admin panel.`
    )}`
    const a = document.createElement('a')
    a.href = wa
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
