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
import { runMigration001 } from "../db/migrations/001-init-admin";

// Run startup migrations — failures are logged but never crash the server.
runMigration001()
  .then((result) => {
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  })
  .catch((err) => {
    console.error("[migration-001] Unexpected error:", err);
  });

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

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

app.get(Paths.oauthCallback, createOAuthCallbackHandler());
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
// Direct admin login endpoint — bypasses tRPC router
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
    const result = await handleAdminLogin(email, password, c.req.raw.headers, c.res.headers);
    if (!result.success) {
      return c.json({ success: false, error: result.error }, 401);
    }
    return c.json({ success: true, email: result.email });
  } catch (err) {
    console.error("[admin-login] Unexpected error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// Manual admin setup endpoint — creates or resets admin@miniyo.store
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

// Health check endpoint for deployment platforms
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
  });
}
