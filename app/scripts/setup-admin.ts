import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = "admin@miniyo.store";
const ADMIN_PASSWORD = "Admin@12345";

if (!DATABASE_URL) {
  console.error("[setup-admin] ERROR: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

async function setupAdmin() {
  console.log("[setup-admin] Connecting to database...");
  const connection = await mysql.createConnection(DATABASE_URL!);

  try {
    // Check if admin user already exists
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      "SELECT id, email FROM admin_users WHERE email = ? LIMIT 1",
      [ADMIN_EMAIL],
    );

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    if (rows.length === 0) {
      // Insert new admin user
      await connection.execute(
        "INSERT INTO admin_users (email, passwordHash, passwordSetAt, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())",
        [ADMIN_EMAIL, passwordHash, now],
      );
      console.log(`[setup-admin] ✓ Admin user created: ${ADMIN_EMAIL}`);
    } else {
      // Update existing admin user's password
      await connection.execute(
        "UPDATE admin_users SET passwordHash = ?, passwordSetAt = ?, updatedAt = NOW() WHERE email = ?",
        [passwordHash, now, ADMIN_EMAIL],
      );
      console.log(`[setup-admin] ✓ Admin user password updated: ${ADMIN_EMAIL}`);
    }

    console.log("[setup-admin] Done.");
  } catch (err) {
    console.error("[setup-admin] ERROR:", err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

setupAdmin();
