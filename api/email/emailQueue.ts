/**
 * Email Queue Worker
 * -------------------
 * Polls email_queue table every 60 seconds and sends pending emails.
 * Retries failed emails up to 3 times, then marks them as failed.
 *
 * Started in boot.ts via startEmailQueueWorker().
 */

import { getDb } from '../queries/connection'
import * as schema from '@db/schema'
import { eq, and, lte } from 'drizzle-orm'
import { sendEmailNow } from './emailService'

const POLL_INTERVAL_MS = 60_000  // 60 seconds
const MAX_RETRIES = 3

let workerTimer: ReturnType<typeof setInterval> | null = null
let _retryCount: Record<number, number> = {}

async function drainQueue(): Promise<void> {
  try {
    const db = getDb()
    const pending = await db
      .select()
      .from(schema.emailQueue)
      .where(eq(schema.emailQueue.status, 'pending'))
      .limit(20)

    if (pending.length === 0) return

    console.log(`[emailQueue] Processing ${pending.length} pending email(s)`)

    for (const row of pending) {
      const retries = _retryCount[row.id] || 0

      if (retries >= MAX_RETRIES) {
        await db
          .update(schema.emailQueue)
          .set({ status: 'failed', error: `Max retries (${MAX_RETRIES}) exceeded` })
          .where(eq(schema.emailQueue.id, row.id))
        delete _retryCount[row.id]
        continue
      }

      try {
        const nodemailer = await import('nodemailer').catch(() => null)
        if (!nodemailer) continue

        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"Miniyo Store" <hello@miniyo.store>',
          to: row.recipient,
          subject: row.subject,
          html: row.body,
        })

        await db
          .update(schema.emailQueue)
          .set({ status: 'sent', sentAt: new Date() })
          .where(eq(schema.emailQueue.id, row.id))

        delete _retryCount[row.id]
        console.log(`[emailQueue] Sent to ${row.recipient} (id:${row.id})`)
      } catch (err: any) {
        _retryCount[row.id] = retries + 1
        console.warn(`[emailQueue] Failed (attempt ${retries + 1}/${MAX_RETRIES}) for id:${row.id}:`, err?.message)

        if (retries + 1 >= MAX_RETRIES) {
          await db
            .update(schema.emailQueue)
            .set({ status: 'failed', error: err?.message || 'Unknown error' })
            .where(eq(schema.emailQueue.id, row.id))
          delete _retryCount[row.id]
        }
      }
    }
  } catch (err) {
    console.error('[emailQueue] Drain error:', err)
  }
}

export function startEmailQueueWorker(): void {
  if (workerTimer) return
  console.log('[emailQueue] Worker started — polling every', POLL_INTERVAL_MS / 1000, 'seconds')
  // Run immediately on startup, then on interval
  drainQueue()
  workerTimer = setInterval(drainQueue, POLL_INTERVAL_MS)
}

export function stopEmailQueueWorker(): void {
  if (workerTimer) {
    clearInterval(workerTimer)
    workerTimer = null
    console.log('[emailQueue] Worker stopped')
  }
}
