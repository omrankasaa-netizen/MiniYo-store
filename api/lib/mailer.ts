/**
 * Mailer — Nodemailer wrapper for GoDaddy Workspace Email (SMTP).
 * Config is read from DB site_settings first, falls back to env vars.
 * SMTP password is ALWAYS read from process.env.SMTP_PASS only (never stored in DB).
 */
import nodemailer from "nodemailer";
import { getSettings } from "./settings-cache";

export interface MailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

async function createTransport() {
  const s = await getSettings();

  const host   = s["smtp_host"]   || process.env.SMTP_HOST   || "smtpout.secureserver.net";
  const port   = parseInt(s["smtp_port"]   || process.env.SMTP_PORT   || "465");
  const secure = (s["smtp_secure"] || process.env.SMTP_SECURE || "true") === "true";
  const user   = s["smtp_user"]   || process.env.SMTP_USER   || "Management@miniyo.store";
  // Password ONLY from env — never from DB
  const pass   = process.env.SMTP_PASS || "";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }, // GoDaddy sometimes needs this
  });
}

export async function sendMail(opts: MailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const s = await getSettings();
    const fromName  = s["smtp_from_name"]  || process.env.SMTP_FROM_NAME  || "MiniYo Store";
    const fromEmail = s["smtp_from_email"] || process.env.SMTP_FROM_EMAIL || "Management@miniyo.store";

    const transport = await createTransport();
    await transport.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(opts.to) ? opts.to.join(", ") : opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html || opts.text?.replace(/\n/g, "<br>"),
    });
    return { success: true };
  } catch (err: any) {
    console.error("[mailer] send failed:", err?.message);
    return { success: false, error: err?.message };
  }
}

export async function testConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const transport = await createTransport();
    await transport.verify();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
