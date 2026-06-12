import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";
import { setupAdmin } from "./setup-admin";
import { startEmailWorker } from "./email-worker";
import { adminRouter } from "./admin-router";

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
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (c.req.method === "OPTIONS") return c.text("", 204);
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

// Mount clean admin router at /api/admin
app.route("/api/admin", adminRouter);

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

app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() }));

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
