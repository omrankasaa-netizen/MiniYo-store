import mysql from "mysql2/promise";
import "dotenv/config";

const url = process.env.DATABASE_URL!;

async function check() {
  const pool = mysql.createPool(url);

  const [users] = await pool.execute(
    "SELECT id, email, name, role, passwordHash IS NOT NULL as hasPassword FROM users LIMIT 3"
  );
  console.log("Users:", JSON.stringify(users, null, 2));

  const [counts] = await pool.execute(
    "SELECT (SELECT COUNT(*) FROM users) as userCount, (SELECT COUNT(*) FROM products) as productCount, (SELECT COUNT(*) FROM categories) as categoryCount, (SELECT COUNT(*) FROM site_settings) as settingsCount, (SELECT COUNT(*) FROM faqs) as faqCount, (SELECT COUNT(*) FROM promo_codes) as promoCount"
  );
  console.log("Counts:", JSON.stringify(counts, null, 2));

  await pool.end();
}

check().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
