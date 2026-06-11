/**
 * Settings Router — admin-only endpoints to read/write site_settings
 * and manage SMTP configuration. Wired into api/router.ts.
 */
import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { siteSettings, emailQueue } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { sendMail, testConnection } from "./lib/mailer";
import { invalidateSettingsCache } from "./lib/settings-cache";

export const settingsAdminRouter = createRouter({
  // Get all settings as a flat key→value map
  getAll: adminQuery.query(async () => {
    const rows = await getDb().select().from(siteSettings);
    const map: Record<string, string> = {};
    for (const r of rows) {
      if (r.settingValue !== null) map[r.settingKey] = r.settingValue;
    }
    return map;
  }),

  // Upsert many settings at once
  saveMany: adminQuery
    .input(z.record(z.string()))
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const [key, value] of Object.entries(input)) {
        await db
          .insert(siteSettings)
          .values({ settingKey: key, settingValue: value })
          .onDuplicateKeyUpdate({ set: { settingValue: value } });
      }
      invalidateSettingsCache();
      const rows = await db.select().from(siteSettings);
      const map: Record<string, string> = {};
      for (const r of rows) {
        if (r.settingValue !== null) map[r.settingKey] = r.settingValue;
      }
      return map;
    }),

  // Test SMTP connection
  testSmtp: adminQuery.mutation(async () => {
    return testConnection();
  }),

  // Send a test email
  sendTestEmail: adminQuery
    .input(z.object({ to: z.string().email() }))
    .mutation(async ({ input }) => {
      return sendMail({
        to: input.to,
        subject: "✅ MiniYo SMTP Test",
        text: "If you received this, your GoDaddy SMTP is working correctly!\n\nSent from your MiniYo admin panel.",
      });
    }),

  // Get email queue with recent history
  emailQueue: adminQuery
    .input(z.object({ limit: z.number().default(50) }).optional())
    .query(async ({ input }) => {
      return getDb()
        .select()
        .from(emailQueue)
        .orderBy(desc(emailQueue.createdAt))
        .limit(input?.limit || 50);
    }),
});
