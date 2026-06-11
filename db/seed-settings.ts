/**
 * Seeds the site_settings table with all configurable values.
 * Run once: npx tsx db/seed-settings.ts
 * Safe to re-run — uses INSERT ... ON DUPLICATE KEY UPDATE.
 *
 * NOTE: SMTP_PASS is intentionally NOT seeded here.
 *       Set it in Railway environment variables: SMTP_PASS=yourpassword
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { siteSettings } from "./schema";

const defaults: Record<string, string> = {
  // ── SMTP / Email ──
  smtp_host:        "smtpout.secureserver.net",
  smtp_port:        "465",
  smtp_secure:      "true",
  smtp_user:        "Management@miniyo.store",
  smtp_from_name:   "MiniYo Store",
  smtp_from_email:  "Management@miniyo.store",

  // ── Notification recipients ──
  notify_orders_to:  "Management@miniyo.store,admin@miniyo.store",
  notify_contact_to: "Management@miniyo.store",

  // ── Store info ──
  store_name:       "MiniYo",
  store_tagline:    "Premium Kids Fashion — Lebanon",
  store_tagline_ar: "أزياء الأطفال الراقية — لبنان",
  store_url:        "https://miniyo.store",
  store_phone:      "+961",
  store_whatsapp:   "+961",
  store_instagram:  "https://instagram.com/miniyo.lb",
  store_facebook:   "",
  store_address:    "Lebanon",
  store_currency:   "USD",
  store_currency_symbol: "$",

  // ── Email addresses ──
  email_admin:      "admin@miniyo.store",
  email_management: "Management@miniyo.store",
  email_marketing:  "marketing@miniyo.store",
  email_legacy:     "miniyo.store.lb@gmail.com",

  // ── Membership config ──
  membership_bronze_min_orders:    "1",
  membership_bronze_discount_pct:  "5",
  membership_bronze_free_shipping: "1",
  membership_silver_min_orders:    "5",
  membership_silver_discount_pct:  "10",
  membership_silver_free_shipping: "2",
  membership_gold_min_orders:      "10",
  membership_gold_discount_pct:    "15",
  membership_gold_free_shipping:   "999",  // unlimited

  // ── Delivery ──
  delivery_fee_default:       "3.00",
  delivery_fee_free_threshold: "50.00",
  delivery_beirut:            "2.50",
  delivery_mount_lebanon:     "3.00",
  delivery_north:             "4.00",
  delivery_south:             "4.00",
  delivery_bekaa:             "4.00",

  // ── Order settings ──
  order_prefix:               "MNY",
  whatsapp_confirmation:      "true",

  // ── Feature flags ──
  feature_membership:         "true",
  feature_wishlist:           "true",
  feature_reviews:            "true",
  feature_promo_codes:        "true",
  feature_cod:                "true",
  feature_whish_pay:          "true",

  // ── SEO ──
  seo_title:        "MiniYo — Premium Kids Fashion Lebanon",
  seo_description:  "Shop the finest kids clothing and accessories in Lebanon. Free delivery on orders over $50.",
  seo_title_ar:     "ميني يو — أزياء الأطفال الراقية لبنان",
  seo_description_ar: "تسوق أرقى ملابس وإكسسوارات الأطفال في لبنان. توصيل مجاني للطلبات فوق 50$.",
};

async function run() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  console.log(`Seeding ${Object.keys(defaults).length} settings...`);

  for (const [key, value] of Object.entries(defaults)) {
    await db
      .insert(siteSettings)
      .values({ settingKey: key, settingValue: value })
      .onDuplicateKeyUpdate({ set: { settingValue: value } });
    console.log(`  ✓ ${key}`);
  }

  console.log("\n✅ Settings seed complete!");
  console.log("⚠️  Remember: Set SMTP_PASS in Railway env vars (not stored in DB)");
  await connection.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
