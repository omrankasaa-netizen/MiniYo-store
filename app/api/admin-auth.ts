/**
 * Admin Authentication Module
 *
 * Completely separate from customer/user auth.
 * Uses the admin_users table only.
 * Issues admin_session cookies with JWT tokens.
 */

import * as jose from "jose";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { adminUsers } from "@db/schema";
import { getDb } from "./queries/connection";
import { env } from "./lib/env";

const JWT_ALG = "HS256";
const ADMIN_SESSION_SECRET = () => new TextEncoder().encode(env.appSecret + "_admin");
const ADMIN_EMAIL = env.adminEmail || "admin@miniyo.store";

// ── Password Utilities ──

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── Session Token ──

export async function signAdminSession(adminId: number, email: string, role: string): Promise<string> {
  return new jose.SignJWT({ adminId, email, role, type: "admin" })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(ADMIN_SESSION_SECRET());
}

export async function verifyAdminSession(token: string): Promise<{ adminId: number; email: string; role: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, ADMIN_SESSION_SECRET(), {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    if (!payload.adminId || !payload.email || payload.type !== "admin") return null;
    return {
      adminId: payload.adminId as number,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

// ── Admin Lookup ──

export async function findAdminByEmail(email: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  return rows.at(0);
}

// ── Idempotent Admin Bootstrap ──

export async function setupAdmin(): Promise<{ success: boolean; message: string; created?: boolean }> {
  try {
    const db = getDb();

    // Check if admin already exists
    const existing = await findAdminByEmail(ADMIN_EMAIL);
    if (existing) {
      // If password changed in env, update it
      const adminPassword = env.adminPassword;
      if (adminPassword && adminPassword.length > 0) {
        const newHash = await hashPassword(adminPassword);
        if (!(await verifyPassword(adminPassword, existing.passwordHash))) {
          await db
            .update(adminUsers)
            .set({ passwordHash: newHash, updatedAt: new Date() })
            .where(eq(adminUsers.id, existing.id));
          console.log("[ADMIN] Password updated for admin@miniyo.store");
          return { success: true, message: "Admin password updated", created: false };
        }
      }
      console.log("[ADMIN] Admin already exists (idempotent): " + ADMIN_EMAIL);
      return { success: true, message: "Admin already exists", created: false };
    }

    // No admin exists — create one
    const adminPassword = env.adminPassword;
    if (!adminPassword || adminPassword.length === 0) {
      console.warn("[ADMIN] ADMIN_PASSWORD not set — cannot create admin user");
      return { success: false, message: "ADMIN_PASSWORD not set" };
    }

    const passwordHash = await hashPassword(adminPassword);

    await db.insert(adminUsers).values({
      email: ADMIN_EMAIL,
      passwordHash,
      name: "Omran",
      role: "super_admin",
      isActive: true,
    });

    console.log("[ADMIN] Created admin user: " + ADMIN_EMAIL);
    return { success: true, message: "Admin created", created: true };
  } catch (err: any) {
    console.error("[ADMIN] setupAdmin failed:", err.message);
    return { success: false, message: err.message };
  }
}

// ── Admin Login Handler ──

export async function handleAdminLogin(email: string, password: string): Promise<
  | { success: true; token: string; admin: { id: number; email: string; name: string | null; role: string } }
  | { success: false; error: string }
> {
  // 1. Find admin by email
  const admin = await findAdminByEmail(email);
  if (!admin || !admin.isActive) {
    return { success: false, error: "Invalid email or password" };
  }

  // 2. Verify password
  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  // 3. Update last login
  const db = getDb();
  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, admin.id));

  // 4. Sign session token
  const token = await signAdminSession(admin.id, admin.email, admin.role);

  // 5. Return safe admin object (no password hash)
  return {
    success: true,
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  };
}

// ── Check if any admin exists ──

export async function hasAnyAdmin(): Promise<boolean> {
  try {
    const db = getDb();
    const rows = await db.select().from(adminUsers).limit(1);
    return rows.length > 0;
  } catch {
    return false;
  }
}
