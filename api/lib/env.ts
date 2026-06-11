import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  // ── Core ──
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  kimiAuthUrl: required("KIMI_AUTH_URL"),
  kimiOpenUrl: required("KIMI_OPEN_URL"),
  ownerUnionId: optional("OWNER_UNION_ID"),
  adminPassword: optional("ADMIN_PASSWORD"),
  adminEmail: optional("ADMIN_EMAIL"),

  // ── SMTP (GoDaddy hosted email — Management@miniyo.store) ──
  smtpHost: optional("SMTP_HOST", "smtpout.secureserver.net"),
  smtpPort: parseInt(optional("SMTP_PORT", "465")),
  smtpUser: optional("SMTP_USER", "Management@miniyo.store"),
  smtpPass: optional("SMTP_PASS", "MiniYostore!b"),

  // ── Notification Recipients ──
  // Comma-separated list; all receive a copy of every new order alert
  get notificationEmails(): string[] {
    const raw = optional(
      "NOTIFICATION_EMAILS",
      "admin@miniyo.store,Management@miniyo.store,marketing@miniyo.store"
    );
    return raw
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
  },
};
