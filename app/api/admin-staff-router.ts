/**
 * Staff management API (super_admin only)
 * POST /api/admin/staff        — create a new staff/admin user with password
 * GET  /api/admin/staff        — list all panel users
 * PUT  /api/admin/staff/:id    — update name / role / isActive
 * DELETE /api/admin/staff/:id  — remove a staff user (cannot remove self)
 */
import { Hono } from "hono";
import * as cookie from "cookie";
import {
  verifyAdminSession,
  listAdminUsers,
  createStaffUser,
  updateStaffUser,
  deleteStaffUser,
  type AdminRole,
} from "./local-auth";

const ADMIN_SESSION_COOKIE = "miniyo_admin_session";

export const staffRouter = new Hono();

// ── Auth helper ──
async function requireSuperAdmin(c: any) {
  const cookies = cookie.parse(c.req.header("cookie") ?? "");
  const session = await verifyAdminSession(cookies[ADMIN_SESSION_COOKIE] ?? "");
  if (!session) return null;
  if (session.role !== "super_admin") return null;
  return session;
}

async function requireAdminOrAbove(c: any) {
  const cookies = cookie.parse(c.req.header("cookie") ?? "");
  const session = await verifyAdminSession(cookies[ADMIN_SESSION_COOKIE] ?? "");
  if (!session) return null;
  if (session.role === "staff") return null;
  return session;
}

// GET /api/admin/staff — list (admin+ can see the list)
staffRouter.get("/", async (c) => {
  const session = await requireAdminOrAbove(c);
  if (!session) return c.json({ success: false, error: "Forbidden" }, 403);
  const users = await listAdminUsers();
  return c.json({ success: true, users });
});

// POST /api/admin/staff — create (super_admin only)
staffRouter.post("/", async (c) => {
  const session = await requireSuperAdmin(c);
  if (!session) return c.json({ success: false, error: "Forbidden — super_admin only" }, 403);

  let body: { email?: string; name?: string; password?: string; role?: AdminRole };
  try { body = await c.req.json(); } catch { return c.json({ success: false, error: "Invalid JSON" }, 400); }

  const { email, name, password, role } = body;
  if (!email || !name || !password || !role) {
    return c.json({ success: false, error: "email, name, password, and role are required" }, 400);
  }
  if (!["super_admin", "admin", "staff"].includes(role)) {
    return c.json({ success: false, error: "Invalid role" }, 400);
  }
  if (password.length < 8) {
    return c.json({ success: false, error: "Password must be at least 8 characters" }, 400);
  }

  try {
    const user = await createStaffUser({ email, name, password, role });
    return c.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err: any) {
    if (err?.message?.includes("Duplicate") || err?.code === "ER_DUP_ENTRY") {
      return c.json({ success: false, error: "A user with this email already exists" }, 409);
    }
    console.error("[staff create]", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// PUT /api/admin/staff/:id — update (super_admin only)
staffRouter.put("/:id", async (c) => {
  const session = await requireSuperAdmin(c);
  if (!session) return c.json({ success: false, error: "Forbidden — super_admin only" }, 403);

  const id = Number(c.req.param("id"));
  if (!id) return c.json({ success: false, error: "Invalid id" }, 400);

  let body: { name?: string; role?: AdminRole; isActive?: boolean };
  try { body = await c.req.json(); } catch { return c.json({ success: false, error: "Invalid JSON" }, 400); }

  await updateStaffUser(id, body);
  return c.json({ success: true });
});

// DELETE /api/admin/staff/:id — remove (super_admin only, cannot remove self)
staffRouter.delete("/:id", async (c) => {
  const session = await requireSuperAdmin(c);
  if (!session) return c.json({ success: false, error: "Forbidden — super_admin only" }, 403);

  const id = Number(c.req.param("id"));
  if (!id) return c.json({ success: false, error: "Invalid id" }, 400);
  if (id === session.adminId) return c.json({ success: false, error: "You cannot remove your own account" }, 400);

  await deleteStaffUser(id);
  return c.json({ success: true });
});
