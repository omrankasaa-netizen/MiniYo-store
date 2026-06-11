/**
 * Email Worker — polls the emailQueue table every 60 seconds and sends
 * any pending emails via the mailer. Marks sent rows as 'sent' or 'failed'.
 *
 * Started automatically by boot.ts in production.
 */
import { getDb } from "./queries/connection";
import { emailQueue } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { sendMail, buildOrderNotificationHtml } from "./lib/mailer";
import { env } from "./lib/env";

let workerInterval: ReturnType<typeof setInterval> | null = null;

const STATUS = {
  PENDING: "pending" as const,
  SENT: "sent" as const,
  FAILED: "failed" as const,
};

async function processQueue() {
  const db = getDb();
  let pending: typeof emailQueue.$inferSelect[];

  try {
    pending = await db
      .select()
      .from(emailQueue)
      .where(eq(emailQueue.status, STATUS.PENDING))
      .limit(20);
  } catch (err) {
    console.error("[email-worker] DB read error:", err);
    return;
  }

  if (pending.length === 0) return;

  console.log(`[email-worker] Processing ${pending.length} queued email(s)...`);

  for (const email of pending) {
    // For order notifications, fan out to all notification recipients
    const recipients =
      email.template === "order_notification"
        ? env.notificationEmails
        : [email.recipient];

    // Build HTML body for order notifications
    const htmlBody =
      email.template === "order_notification" && email.htmlBody
        ? email.htmlBody
        : undefined;

    let success = false;
    try {
      success = await sendMail({
        to: recipients,
        subject: email.subject,
        text: email.body,
        html: htmlBody,
      });
    } catch (err) {
      console.error(`[email-worker] Send error for email id=${email.id}:`, err);
    }

    try {
      await db
        .update(emailQueue)
        .set({
          status: success ? STATUS.SENT : STATUS.FAILED,
          sentAt: success ? new Date() : undefined,
          attempts: (email.attempts ?? 0) + 1,
        } as Partial<typeof emailQueue.$inferInsert>)
        .where(eq(emailQueue.id, email.id));
    } catch (err) {
      console.error(`[email-worker] Status update error for email id=${email.id}:`, err);
    }

    if (success) {
      console.log(`[email-worker] ✓ Sent "${email.subject}" → ${recipients.join(", ")}`);
    } else {
      console.warn(`[email-worker] ✗ Failed to send email id=${email.id}`);
    }
  }
}

export function startEmailWorker(intervalMs = 60_000) {
  if (workerInterval) return; // already running
  console.log(`[email-worker] Started — polling every ${intervalMs / 1000}s`);
  processQueue(); // run immediately on startup
  workerInterval = setInterval(processQueue, intervalMs);
}

export function stopEmailWorker() {
  if (workerInterval) {
    clearInterval(workerInterval);
    workerInterval = null;
    console.log("[email-worker] Stopped");
  }
}
