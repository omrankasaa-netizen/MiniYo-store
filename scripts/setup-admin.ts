import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../app/db/schema";
import "dotenv/config";

const ADMIN_EMAIL = "admin@miniyo.store";
const ADMIN_PASSWORD = "Admin@12345";
const BCRYPT_ROUNDS = 12;

async function setupAdminBootstrap() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("[admin-bootstrap] FATAL: DATABASE_URL is not set");
    process.exit(1);
  }

  console.log("[admin-bootstrap] Starting admin bootstrap process...");

  const db = drizzle(databaseUrl, { mode: "planetscale", schema });

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);

    // Check if admin already exists
    const existing = await db
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, ADMIN_EMAIL))
      .limit(1);

    if (existing.length === 0) {
      // Create new admin
      await db.insert(schema.adminUsers).values({
        email: ADMIN_EMAIL,
        passwordHash,
        passwordSetAt: new Date(),
      });
      console.log(`[admin-bootstrap] ✓ Admin user ${ADMIN_EMAIL} created successfully`);
    } else {
      // Update existing admin password
      await db
        .update(schema.adminUsers)
        .set({ passwordHash, passwordSetAt: new Date() })
        .where(eq(schema.adminUsers.email, ADMIN_EMAIL));
      console.log(`[admin-bootstrap] ✓ Admin user ${ADMIN_EMAIL} password reset successfully`);
    }

    console.log("[admin-bootstrap] Admin bootstrap completed successfully");
    process.exit(0);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[admin-bootstrap] FATAL: ${message}`);
    process.exit(1);
  }
}

setupAdminBootstrap();
