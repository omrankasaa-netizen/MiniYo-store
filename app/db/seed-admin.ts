import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL!;
const ADMIN_EMAIL = "admin@miniyo.store";
const ADMIN_PASSWORD = "Admin@12345";

async function seedAdmin() {
  if (!DATABASE_URL) {
    console.error("[seed-admin] DATABASE_URL is not set");
    process.exit(1);
  }

  console.log("[seed-admin] Connecting to database...");
  const pool = mysql.createPool(DATABASE_URL);

  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      "SELECT id, email FROM admin_users WHERE email = ? LIMIT 1",
      [ADMIN_EMAIL]
    );

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    if (rows.length === 0) {
      await pool.execute(
        "INSERT INTO admin_users (email, passwordHash, passwordSetAt) VALUES (?, ?, NOW())",
        [ADMIN_EMAIL, passwordHash]
      );
      console.log(`[seed-admin] Created admin user: ${ADMIN_EMAIL}`);
    } else {
      await pool.execute(
        "UPDATE admin_users SET passwordHash = ?, passwordSetAt = NOW(), updatedAt = NOW() WHERE email = ?",
        [passwordHash, ADMIN_EMAIL]
      );
      console.log(`[seed-admin] Updated password for existing admin: ${ADMIN_EMAIL}`);
    }
  } finally {
    await pool.end();
  }

  console.log("[seed-admin] Done.");
}

seedAdmin().catch((err) => {
  console.error("[seed-admin] Failed:", err);
  process.exit(1);
});
