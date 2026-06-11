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
import {
  verifyAdminSession,
  setAdminPassword,
  verifyPassword,
  findAdminUserByEmail,
  listAdminStaff,
  createStaffUser,
  deleteAdminStaff,
  findAdminUserById,
  type AdminRole,
} from "./local-auth";
import * as cookie from "cookie";

const ADMIN_SESSION_COOKIE = "miniyo_admin_session";

// ── Helper: resolve & validate admin session ──
async function requireAdminSession(cookieHeader: string) {
  const cookies = cookie.parse(cookieHeader);
  const token = cookies[ADMIN_SESSION_COOKIE];
  if (!token) return null;
  return verifyAdminSession(token);
}

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
    if (!result.success) return c.json({ success: false, error: result.error }, 401);
    return c.json({ success: true, email: result.email });
  } catch (err) {
    console.error("[admin-login]", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// ── Change admin password ──
app.post("/api/admin/change-password", async (c) => {
  const session = await requireAdminSession(c.req.header("cookie") ?? "");
  if (!session) return c.json({ success: false, error: "Not authenticated" }, 401);

  let body: { currentPassword?: string; newPassword?: string };
  try { body = await c.req.json(); } catch { return c.json({ success: false, error: "Invalid JSON" }, 400); }

  const { currentPassword, newPassword } = body;
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return c.json({ success: false, error: "currentPassword and newPassword are required" }, 400);
  }
  if (newPassword.length < 8) {
    return c.json({ success: false, error: "New password must be at least 8 characters" }, 400);
  }
  const admin = await findAdminUserByEmail(session.email);
  if (!admin || !admin.passwordHash) return c.json({ success: false, error: "Admin account not found" }, 404);
  const valid = await verifyPassword(currentPassword, admin.passwordHash);
  if (!valid) return c.json({ success: false, error: "Current password is incorrect" }, 400);
  await setAdminPassword(session.email, newPassword);
  return c.json({ success: true, message: "Password changed successfully" });
});

// ── List staff members ──
app.get("/api/admin/staff", async (c) => {
  const session = await requireAdminSession(c.req.header("cookie") ?? "");
  if (!session) return c.json({ success: false, error: "Not authenticated" }, 401);
  if (session.role !== "super_admin") return c.json({ success: false, error: "Forbidden" }, 403);
  const staff = await listAdminStaff();
  return c.json({
    success: true,
    staff: staff.map(s => ({
      id: s.id,
      email: s.email,
      name: s.name ?? "",
      role: s.role,
      isActive: s.isActive,
      createdAt: s.createdAt,
      passwordSet: !!s.passwordSet,
    })),
  });
});

// ── Create staff member ──
app.post("/api/admin/staff", async (c) => {
  const session = await requireAdminSession(c.req.header("cookie") ?? "");
  if (!session) return c.json({ success: false, error: "Not authenticated" }, 401);
  if (session.role !== "super_admin") return c.json({ success: false, error: "Forbidden" }, 403);

  let body: { email?: string; name?: string; password?: string; role?: string };
  try { body = await c.req.json(); } catch { return c.json({ success: false, error: "Invalid JSON" }, 400); }

  const { email, name, password, role } = body;
  if (!email || !name || !password) {
    return c.json({ success: false, error: "email, name, and password are required" }, 400);
  }
  if (password.length < 8) {
    return c.json({ success: false, error: "Password must be at least 8 characters" }, 400);
  }
  const allowedRoles: AdminRole[] = ["admin", "staff"];
  const safeRole: AdminRole = allowedRoles.includes(role as AdminRole) ? (role as AdminRole) : "staff";

  try {
    const member = await createStaffUser({ email, name, password, role: safeRole });
    return c.json({ success: true, member: { id: member.id, email: member.email, name: member.name, role: member.role } });
  } catch (err: any) {
    if (err?.message?.includes("Duplicate") || err?.code === "ER_DUP_ENTRY") {
      return c.json({ success: false, error: "A user with that email already exists" }, 409);
    }
    console.error("[create-staff]", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// ── Delete staff member ──
app.delete("/api/admin/staff/:id", async (c) => {
  const session = await requireAdminSession(c.req.header("cookie") ?? "");
  if (!session) return c.json({ success: false, error: "Not authenticated" }, 401);
  if (session.role !== "super_admin") return c.json({ success: false, error: "Forbidden" }, 403);

  const id = Number(c.req.param("id"));
  if (!id || isNaN(id)) return c.json({ success: false, error: "Invalid ID" }, 400);

  // Prevent deleting yourself
  if (session.adminId === id) return c.json({ success: false, error: "You cannot delete your own account" }, 400);

  const target = await findAdminUserById(id);
  if (!target) return c.json({ success: false, error: "Staff member not found" }, 404);
  if (target.role === "super_admin") return c.json({ success: false, error: "Cannot delete a super admin" }, 400);

  await deleteAdminStaff(id);
  return c.json({ success: true });
});

app.post("/api/setup-admin", async (c) => {
  try {
    const result = await setupAdmin();
    return c.json(result, result.success ? 200 : 500);
  } catch (err) {
    console.error("[setup-admin]", err);
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
