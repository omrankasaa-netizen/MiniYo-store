/**
 * Email Service
 * ──────────────
 * Wraps nodemailer with:
 *   - Queue-first sending (writes to email_queue, then drains)
 *   - Direct sending for time-sensitive emails (password reset, verification)
 *   - Graceful no-op when SMTP is not yet configured
 *
 * Environment variables needed (add to .env — see .env.example):
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM
 */

import { getDb } from '../queries/connection'
import * as schema from '@db/schema'
import { eq } from 'drizzle-orm'
import type { EmailTemplate } from './emailTemplates'

function getTransporter() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  // Dynamic import so nodemailer is optional at startup
  return import('nodemailer').then(({ default: nodemailer }) =>
    nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    })
  ).catch(() => null)
}

const FROM = process.env.SMTP_FROM || `"Miniyo Store" <hello@miniyo.store>`

/**
 * Queue an email — writes to email_queue table.
 * The worker in emailQueue.ts drains this table every 60 seconds.
 */
export async function queueEmail(
  recipient: string,
  template: EmailTemplate,
  templateName?: string
): Promise<void> {
  try {
    const db = getDb()
    await db.insert(schema.emailQueue).values({
      recipient,
      subject: template.subject,
      body: template.html,
      template: templateName || null,
      status: 'pending',
    })
  } catch (err) {
    console.error('[emailService] Failed to queue email:', err)
  }
}

/**
 * Send an email immediately (for password reset, verification codes).
 * Falls back to queue if transporter is unavailable.
 */
export async function sendEmailNow(
  recipient: string,
  template: EmailTemplate,
  templateName?: string
): Promise<{ success: boolean; queued?: boolean; error?: string }> {
  const transporter = await getTransporter()

  if (!transporter) {
    // SMTP not configured yet — queue it so it sends once credentials are added
    await queueEmail(recipient, template, templateName)
    return { success: true, queued: true }
  }

  try {
    await transporter.sendMail({
      from: FROM,
      to: recipient,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    // Mark as sent in DB if it was queued
    try {
      const db = getDb()
      await db
        .update(schema.emailQueue)
        .set({ status: 'sent', sentAt: new Date() })
        .where(eq(schema.emailQueue.recipient, recipient))
    } catch { /* not critical if the row doesn't exist */ }

    return { success: true }
  } catch (err: any) {
    console.error('[emailService] Failed to send email to', recipient, err?.message)

    // Save to queue so it retries
    await queueEmail(recipient, template, templateName)
    return { success: false, queued: true, error: err?.message }
  }
}

/**
 * Test SMTP connection — call from admin panel to verify credentials.
 */
export async function testSmtpConnection(): Promise<{ ok: boolean; error?: string }> {
  const transporter = await getTransporter()
  if (!transporter) return { ok: false, error: 'SMTP not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASS to .env' }
  try {
    await transporter.verify()
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err?.message }
  }
}
