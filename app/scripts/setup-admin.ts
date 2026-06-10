import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import "dotenv/config";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@miniyo.store";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@12345";

async function setupAdmin() {
  if (!DATABASE_URL) {
    console.error("ERROR: DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  console.log("Connecting to database...");
  const pool = mysql.createPool(DATABASE_URL);
  const db = drizzle(pool, { schema, mode: "planetscale" });

  console.log(`Setting up admin user: ${ADMIN_EMAIL}`);

  const existing = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, ADMIN_EMAIL))
    .limit(1);

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  if (existing.length === 0) {
    await db.insert(schema.adminUsers).values({
      email: ADMIN_EMAIL,
      passwordHash,
      passwordSetAt: new Date(),
    });
    console.log(`Admin user created: ${ADMIN_EMAIL}`);
  } else {
    await db
      .update(schema.adminUsers)
      .set({ passwordHash, passwordSetAt: new Date() })
      .where(eq(schema.adminUsers.email, ADMIN_EMAIL));
    console.log(`Admin user updated: ${ADMIN_EMAIL}`);
  }

  await pool.end();
  console.log("Admin setup completed successfully.");
}

setupAdmin().catch((e) => {
  console.error("Admin setup failed:", e);
  process.exit(1);
});
