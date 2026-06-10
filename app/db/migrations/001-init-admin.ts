import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../schema";

const ADMIN_EMAIL = "admin@miniyo.store";
const ADMIN_PASSWORD = "Admin@12345";

export interface MigrationResult {
  success: boolean;
  message: string;
}

/**
 * Migration 001 — Ensure admin@miniyo.store exists in admin_users.
 *
 * - Creates the row if absent, with a bcrypt-hashed password.
 * - Updates the password hash if the row already exists.
 *
 * Safe to run on every deployment (idempotent).
 */
export async function runMigration001(): Promise<MigrationResult> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return { success: false, message: "DATABASE_URL is not set — skipping migration 001." };
  }

  const db = drizzle(databaseUrl, { mode: "planetscale", schema });

  try {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const existing = await db
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, ADMIN_EMAIL))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.adminUsers).values({
        email: ADMIN_EMAIL,
        passwordHash,
        passwordSetAt: new Date(),
      });
      return { success: true, message: `[migration-001] Admin user ${ADMIN_EMAIL} created.` };
    }

    await db
      .update(schema.adminUsers)
      .set({ passwordHash, passwordSetAt: new Date() })
      .where(eq(schema.adminUsers.email, ADMIN_EMAIL));

    return { success: true, message: `[migration-001] Admin user ${ADMIN_EMAIL} password updated.` };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, message: `[migration-001] Failed: ${message}` };
  }
}
