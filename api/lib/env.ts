import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  kimiAuthUrl: required("KIMI_AUTH_URL"),
  kimiOpenUrl: required("KIMI_OPEN_URL"),
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  adminEmail: process.env.ADMIN_EMAIL ?? "",

  // ── SMTP (GoDaddy Professional Email / Microsoft 365) ──
  // smtpHost: GoDaddy outgoing server — smtpout.secureserver.net
  smtpHost: process.env.SMTP_HOST ?? "smtpout.secureserver.net",
  smtpPort: parseInt(process.env.SMTP_PORT ?? "465"),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",

  // ── Notification recipients (comma-separated) ──
  // Once GoDaddy emails are ready, update these in Railway env vars:
  //   NOTIFY_EMAILS=admin@miniyo.store,Management@miniyo.store,marketing@miniyo.store
  notifyEmails: (process.env.NOTIFY_EMAILS ?? "miniyo.store.lb@gmail.com")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean),
};
