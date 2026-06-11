/**
 * mailer.ts — SMTP email sender using Nodemailer
 * Compatible with GoDaddy Professional Email / Microsoft 365 Exchange
 * Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in Railway environment variables
 */
import nodemailer from "nodemailer";
import { env } from "./env";

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST || "smtpout.secureserver.net";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER || env.adminEmail;
  const pass = process.env.SMTP_PASS || "";

  if (!pass) {
    console.warn("[mailer] SMTP_PASS not set — emails will be queued but not sent until configured");
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  return _transporter;
}

export interface MailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

export async function sendMail(opts: MailOptions): Promise<void> {
  const transporter = getTransporter();
  const from = `"Miniyo Store" <${process.env.SMTP_USER || env.adminEmail}>`;

  await transporter.sendMail({
    from,
    to: Array.isArray(opts.to) ? opts.to.join(", ") : opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html ?? opts.text.replace(/\n/g, "<br>"),
  });
}

/** Builds a styled HTML order notification email */
export function buildOrderNotificationHtml(data: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  grandTotal: number | string;
  paymentMethod: string;
  items?: Array<{ productName: string; quantity: number; unitPrice: number | string }>;
  shippingAddress?: Record<string, string>;
}): string {
  const itemRows = (data.items ?? []).map(i =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #f0ebe4">${i.productName}</td><td style="padding:6px 12px;border-bottom:1px solid #f0ebe4;text-align:center">${i.quantity}</td><td style="padding:6px 12px;border-bottom:1px solid #f0ebe4;text-align:right">$${Number(i.unitPrice).toFixed(2)}</td></tr>`
  ).join("");

  const addressBlock = data.shippingAddress
    ? Object.entries(data.shippingAddress).filter(([, v]) => v).map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`).join("")
    : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f7f6f2;font-family:'Helvetica Neue',Arial,sans-serif">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
  <div style="background:#01696f;padding:28px 32px">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">🛍️ New Order Received</h1>
    <p style="color:rgba(255,255,255,.8);margin:6px 0 0;font-size:14px">Order ${data.orderNumber}</p>
  </div>
  <div style="padding:28px 32px">
    <table style="width:100%;margin-bottom:20px">
      <tr><td style="color:#7a7974;font-size:13px;padding:4px 0">Customer</td><td style="font-weight:600;text-align:right">${data.customerName}</td></tr>
      <tr><td style="color:#7a7974;font-size:13px;padding:4px 0">Phone</td><td style="font-weight:600;text-align:right">${data.customerPhone}</td></tr>
      <tr><td style="color:#7a7974;font-size:13px;padding:4px 0">Payment</td><td style="font-weight:600;text-align:right;text-transform:uppercase">${data.paymentMethod}</td></tr>
      <tr><td style="color:#7a7974;font-size:13px;padding:4px 0">Total</td><td style="font-weight:700;font-size:18px;color:#01696f;text-align:right">$${Number(data.grandTotal).toFixed(2)}</td></tr>
    </table>
    ${itemRows ? `<h3 style="font-size:14px;color:#28251d;margin:0 0 8px">Items</h3><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#f7f6f2"><th style="padding:8px 12px;text-align:left;font-size:12px;color:#7a7974">Product</th><th style="padding:8px 12px;text-align:center;font-size:12px;color:#7a7974">Qty</th><th style="padding:8px 12px;text-align:right;font-size:12px;color:#7a7974">Price</th></tr></thead><tbody>${itemRows}</tbody></table>` : ""}
    ${addressBlock ? `<div style="margin-top:20px;padding:16px;background:#f7f6f2;border-radius:8px"><h3 style="font-size:13px;color:#7a7974;margin:0 0 8px">Shipping Address</h3>${addressBlock}</div>` : ""}
    <div style="margin-top:24px;text-align:center">
      <a href="https://miniyo.store/#/admin" style="display:inline-block;background:#01696f;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View in Admin Panel</a>
    </div>
  </div>
  <div style="background:#f7f6f2;padding:16px 32px;text-align:center">
    <p style="color:#bab9b4;font-size:12px;margin:0">Miniyo Store — Lebanon's children's clothing boutique</p>
  </div>
</div>
</body></html>`;
}
