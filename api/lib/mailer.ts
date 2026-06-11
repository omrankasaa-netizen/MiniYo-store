/**
 * Mailer — sends transactional email via GoDaddy SMTP (Management@miniyo.store)
 * Falls back to console.log in development so no SMTP is needed locally.
 */
import nodemailer from "nodemailer";
import { env } from "./env";

function createTransport() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    return null;
  }
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
    tls: {
      rejectUnauthorized: false, // GoDaddy hosted email compatibility
    },
  });
}

export interface MailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export async function sendMail(opts: MailOptions): Promise<boolean> {
  const transport = createTransport();

  if (!transport) {
    // Dev fallback — log to console
    console.log("[mailer] DEV MODE — email not sent:");
    console.log(`  To: ${Array.isArray(opts.to) ? opts.to.join(", ") : opts.to}`);
    console.log(`  Subject: ${opts.subject}`);
    console.log(`  Body: ${opts.text}`);
    return true;
  }

  try {
    await transport.sendMail({
      from: `"Miniyo Store" <${env.smtpUser}>`,
      to: Array.isArray(opts.to) ? opts.to.join(", ") : opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html ?? opts.text.replace(/\n/g, "<br>"),
      replyTo: opts.replyTo,
    });
    return true;
  } catch (err) {
    console.error("[mailer] Failed to send email:", err);
    return false;
  }
}

/**
 * Builds a styled HTML email body for order notifications.
 */
export function buildOrderNotificationHtml(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  grandTotal: number | string;
  paymentMethod: string;
  shippingAddress?: Record<string, string>;
  items: Array<{ productName: string; quantity: number; unitPrice: number | string; color?: string; size?: string }>;
  customerNotes?: string;
}): string {
  const paymentLabels: Record<string, string> = {
    cod: "Cash on Delivery",
    wish: "Wish Money Transfer",
    card: "Card Payment",
  };
  const paymentLabel = paymentLabels[order.paymentMethod] ?? order.paymentMethod;

  const addressHtml = order.shippingAddress
    ? Object.entries(order.shippingAddress)
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="color:#8B8578;padding:2px 8px 2px 0;font-size:12px;">${k}:</td><td style="font-size:13px;">${v}</td></tr>`)
        .join("")
    : "";

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr style="border-bottom:1px solid #F2EFE9;">
          <td style="padding:8px 12px;font-size:13px;color:#2D5A4C;">${item.productName}${
            item.color ? ` <span style="color:#8B8578;">(${item.color}${item.size ? " / " + item.size : ""})</span>` : ""
          }</td>
          <td style="padding:8px 12px;font-size:13px;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;font-size:13px;text-align:right;">$${Number(item.unitPrice).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2EFE9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2EFE9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.07);">
        <!-- Header -->
        <tr><td style="background:#2D5A4C;padding:24px 32px;">
          <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;">🛍️ New Order Received</h1>
          <p style="margin:4px 0 0;color:#A8D5C4;font-size:13px;">Order ${order.orderNumber}</p>
        </td></tr>

        <!-- Customer Info -->
        <tr><td style="padding:24px 32px 0;">
          <h2 style="margin:0 0 12px;font-size:14px;color:#8B8578;text-transform:uppercase;letter-spacing:0.05em;">Customer</h2>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="font-size:16px;font-weight:600;color:#2D5A4C;padding-bottom:4px;">${order.customerName}</td></tr>
            <tr><td style="font-size:13px;color:#5C6B60;">📞 ${order.customerPhone}</td></tr>
            ${order.customerEmail ? `<tr><td style="font-size:13px;color:#5C6B60;">✉️ ${order.customerEmail}</td></tr>` : ""}
          </table>
        </td></tr>

        <!-- Shipping Address -->
        ${addressHtml ? `<tr><td style="padding:16px 32px 0;">
          <h2 style="margin:0 0 8px;font-size:14px;color:#8B8578;text-transform:uppercase;letter-spacing:0.05em;">Delivery Address</h2>
          <table>${addressHtml}</table>
        </td></tr>` : ""}

        <!-- Items -->
        <tr><td style="padding:24px 32px 0;">
          <h2 style="margin:0 0 8px;font-size:14px;color:#8B8578;text-transform:uppercase;letter-spacing:0.05em;">Items</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8E4DB;border-radius:8px;overflow:hidden;">
            <thead><tr style="background:#F5F0E6;">
              <th style="text-align:left;padding:8px 12px;font-size:11px;color:#8B8578;font-weight:600;">PRODUCT</th>
              <th style="text-align:center;padding:8px 12px;font-size:11px;color:#8B8578;font-weight:600;">QTY</th>
              <th style="text-align:right;padding:8px 12px;font-size:11px;color:#8B8578;font-weight:600;">PRICE</th>
            </tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </td></tr>

        <!-- Total + Payment -->
        <tr><td style="padding:20px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:15px;font-weight:700;color:#2D5A4C;">Grand Total: $${Number(order.grandTotal).toFixed(2)}</td>
              <td style="text-align:right;">
                <span style="background:#E8F4F0;color:#2D5A4C;font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;">${paymentLabel}</span>
              </td>
            </tr>
          </table>
          ${order.customerNotes ? `<p style="margin:12px 0 0;padding:10px 14px;background:#FFF9F0;border-left:3px solid #8FAE7B;border-radius:4px;font-size:13px;color:#5C6B60;"><strong>Note:</strong> ${order.customerNotes}</p>` : ""}
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F5F0E6;padding:16px 32px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#A8A396;">Miniyo Store — Lebanon's curated children's fashion boutique</p>
          <p style="margin:4px 0 0;font-size:11px;color:#A8A396;">miniyo.store · Management@miniyo.store</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
