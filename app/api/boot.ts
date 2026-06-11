import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";
import { handleAdminLogin } from "./admin-login-handler";
import { setupAdmin } from "./setup-admin";
import { startEmailWorker } from "./email-worker";
import { verifyAdminSession, setAdminPassword, verifyPassword, findAdminUserByEmail } from "./local-auth";
import * as cookie from "cookie";

const ADMIN_SESSION_COOKIE = "miniyo_admin_session";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

app.use("/api/*", async (c, next) => {
  const origin = c.req.header("origin") || "";
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .filter(Boolean);

  const isAllowed =
    !origin ||
    allowedOrigins.length === 0 ||
    allowedOrigins.includes(origin) ||
    origin.includes("localhost");

  if (isAllowed) {
    c.header("Access-Control-Allow-Origin", origin || "*");
  }

  c.header("Access-Control-Allow-Credentials", "true");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (c.req.method === "OPTIONS") {
    return c.text("", 204);
  }

  await next();
});

app.get(Paths.oauthCallback, createOAuthCallbackHandler());

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

app.post("/api/admin/login", async (c) => {
  let body: { email?: string; password?: string };

  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: "Invalid JSON body" }, 400);
  }

  const { email, password } = body;

  if (typeof email !== "string" || typeof password !== "string") {
    return c.json({ success: false, error: "Email and password are required" }, 400);
  }

  try {
    const result = await handleAdminLogin(
      email,
      password,
      c.req.raw.headers,
      c.res.headers,
    );

    if (!result.success) {
      return c.json({ success: false, error: result.error }, 401);
    }

    return c.json({ success: true, email: result.email });
  } catch (err) {
    console.error("[admin-login] Unexpected error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// ── Change admin password (requires valid admin session) ──
app.post("/api/admin/change-password", async (c) => {
  // Verify session cookie
  const cookieHeader = c.req.header("cookie") ?? "";
  const cookies = cookie.parse(cookieHeader);
  const token = cookies[ADMIN_SESSION_COOKIE];

  if (!token) {
    return c.json({ success: false, error: "Not authenticated" }, 401);
  }

  const session = await verifyAdminSession(token);
  if (!session) {
    return c.json({ success: false, error: "Invalid or expired session" }, 401);
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: "Invalid JSON body" }, 400);
  }

  const { currentPassword, newPassword } = body;

  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return c.json({ success: false, error: "currentPassword and newPassword are required" }, 400);
  }

  if (newPassword.length < 8) {
    return c.json({ success: false, error: "New password must be at least 8 characters" }, 400);
  }

  try {
    const admin = await findAdminUserByEmail(session.email);
    if (!admin || !admin.passwordHash) {
      return c.json({ success: false, error: "Admin account not found" }, 404);
    }

    const valid = await verifyPassword(currentPassword, admin.passwordHash);
    if (!valid) {
      return c.json({ success: false, error: "Current password is incorrect" }, 400);
    }

    await setAdminPassword(session.email, newPassword);
    return c.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("[change-password] Unexpected error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

app.post("/api/setup-admin", async (c) => {
  try {
    const result = await setupAdmin();
    return c.json(result, result.success ? 200 : 500);
  } catch (err) {
    console.error("[setup-admin] Unexpected error:", err);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
    startEmailWorker();
  });
}
