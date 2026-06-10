import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";
import * as cookie from "cookie";
import { setupAdmin, handleAdminLogin } from "./admin-auth";
import { getSessionCookieOptions } from "./lib/cookies";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// ═══════════════════════════════════════════════════════════════
// 1. GLOBAL MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

// CORS middleware for API routes
app.use("/api/*", async (c, next) => {
  const origin = c.req.header("origin") || "";
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean);
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

// ═══════════════════════════════════════════════════════════════
// 2. EXPLICIT HTTP ROUTES (must be BEFORE catch-all)
// ═══════════════════════════════════════════════════════════════

// ── Health Check ──
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── OAuth Callback ──
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

// ── Debug: List all registered routes ──
app.get("/api/debug-routes", (c) => {
  const routes = [
    "GET  /health",
    "GET  /api/oauth/callback",
    "POST /api/setup-admin",
    "POST /api/admin/login",
    "GET  /api/debug-routes",
    "ALL  /api/trpc/*  (tRPC)",
    "ALL  /api/*       (404 catch-all)",
  ];
  return c.json({
    ok: true,
    env: env.isProduction ? "production" : "development",
    nodeEnv: process.env.NODE_ENV || "unset",
    routes,
    note: "If POST /api/admin/login is missing below, boot.ts was not deployed correctly.",
  });
});

// ── Setup Admin (idempotent) ──
app.post("/api/setup-admin", async (c) => {
  try {
    // Only allow in production if no admin exists yet, or if called with setup key
    const body = await c.req.json().catch(() => ({}));
    const setupKey = body.setupKey || c.req.header("x-setup-key");
    const hasAdmin = await import("./admin-auth").then(m => m.hasAnyAdmin());

    // Allow if: no admin exists yet, OR correct setup key provided
    if (hasAdmin && setupKey !== env.appSecret) {
      return c.json({
        success: false,
        error: "Admin already exists. Use setupKey (APP_SECRET) to reset.",
      }, 403);
    }

    const result = await setupAdmin();
    return c.json(result, result.success ? 200 : 500);
  } catch (err: any) {
    console.error("[BOOT] /api/setup-admin error:", err.message);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// ── Admin Login ──
app.post("/api/admin/login", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      return c.json({ success: false, error: "Email and password required" }, 400);
    }

    const result = await handleAdminLogin(email, password);

    if (!result.success) {
      return c.json({ success: false, error: result.error }, 401);
    }

    // Set admin_session cookie
    const opts = getSessionCookieOptions(c.req.raw.headers);
    c.header(
      "set-cookie",
      cookie.serialize("admin_session", result.token, {
        ...opts,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })
    );

    return c.json({
      success: true,
      admin: result.admin,
    });
  } catch (err: any) {
    console.error("[BOOT] /api/admin/login error:", err.message);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// ── Admin Logout ──
app.post("/api/admin/logout", async (c) => {
  const opts = getSessionCookieOptions(c.req.raw.headers);
  c.header(
    "set-cookie",
    cookie.serialize("admin_session", "", { ...opts, maxAge: 0 })
  );
  return c.json({ success: true });
});

// ── Check Admin Auth ──
app.get("/api/admin/me", async (c) => {
  try {
    const cookies = cookie.parse(c.req.header("cookie") || "");
    const token = cookies["admin_session"];
    if (!token) return c.json({ authenticated: false }, 401);

    const { verifyAdminSession } = await import("./admin-auth");
    const session = await verifyAdminSession(token);
    if (!session) return c.json({ authenticated: false }, 401);

    return c.json({
      authenticated: true,
      admin: {
        id: session.adminId,
        email: session.email,
        role: session.role,
      },
    });
  } catch {
    return c.json({ authenticated: false }, 401);
  }
});

// ═══════════════════════════════════════════════════════════════
// 3. tRPC ROUTER (ALL tRPC calls go through here)
// ═══════════════════════════════════════════════════════════════

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// ═══════════════════════════════════════════════════════════════
// 4. CATCH-ALL 404 (must be LAST)
// ═══════════════════════════════════════════════════════════════

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// ═══════════════════════════════════════════════════════════════
// 5. STATIC FILES + SERVER START (production only)
// ═══════════════════════════════════════════════════════════════

export default app;

if (env.isProduction) {
  // Bootstrap admin on startup (idempotent)
  (async () => {
    console.log("[BOOT] Production startup — checking admin bootstrap...");
    try {
      const result = await setupAdmin();
      console.log("[BOOT] Admin bootstrap:", result.message);
    } catch (err: any) {
      console.error("[BOOT] Admin bootstrap failed (non-fatal):", err.message);
    }
  })();

  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`[BOOT] Server running on port ${port}`);
    console.log(`[BOOT] Health:  http://localhost:${port}/health`);
    console.log(`[BOOT] Routes: http://localhost:${port}/api/debug-routes`);
  });
}
