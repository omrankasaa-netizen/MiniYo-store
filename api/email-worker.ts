/**
 * email-worker.ts
 * Polls the email_queue table every 60 seconds and sends pending emails via SMTP.
 * Called once from boot.ts on server start.
 */
import { getDb } from "./queries/connection";
import { emailQueue } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { sendMail } from "./lib/mailer";

const POLL_INTERVAL_MS = 60_000; // 60 seconds
const BATCH_SIZE = 20;

async function processBatch(): Promise<void> {
  const db = getDb();

  const pending = await db
    .select()
    .from(emailQueue)
    .where(eq(emailQueue.status, "pending"))
    .limit(BATCH_SIZE);

  if (pending.length === 0) return;

  console.log(`[email-worker] Processing ${pending.length} pending email(s)`);

  for (const email of pending) {
    try {
      await sendMail({
        to: email.recipient,
        subject: email.subject,
        text: email.body,
      });

      await db
        .update(emailQueue)
        .set({ status: "sent", sentAt: new Date(), error: null })
        .where(eq(emailQueue.id, email.id));

      console.log(`[email-worker] ✓ Sent email #${email.id} to ${email.recipient}`);
    } catch (err: any) {
      const errorMsg = err?.message ?? String(err);
      console.error(`[email-worker] ✗ Failed email #${email.id}: ${errorMsg}`);

      await db
        .update(emailQueue)
        .set({ status: "failed", error: errorMsg.slice(0, 500) })
        .where(eq(emailQueue.id, email.id));
    }
  }
}

export function startEmailWorker(): void {
  console.log(`[email-worker] Started — polling every ${POLL_INTERVAL_MS / 1000}s`);

  // Run immediately on start, then on interval
  processBatch().catch((e) => console.error("[email-worker] Initial batch error:", e));

  setInterval(() => {
    processBatch().catch((e) => console.error("[email-worker] Batch error:", e));
  }, POLL_INTERVAL_MS);
}
