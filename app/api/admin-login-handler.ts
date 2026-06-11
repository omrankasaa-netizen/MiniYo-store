import * as cookie from "cookie";
import { findAdminUserByEmail, verifyPassword, signAdminSession, type AdminRole } from "./local-auth";
import { getSessionCookieOptions } from "./lib/cookies";

const ADMIN_SESSION_COOKIE = "miniyo_admin_session";

export interface AdminLoginResult {
  success: boolean;
  email?: string;
  name?: string;
  role?: AdminRole;
  permissions?: string[];
  error?: string;
}

export async function handleAdminLogin(
  email: string,
  password: string,
  headers: Headers,
  resHeaders: Headers,
): Promise<AdminLoginResult> {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const admin = await findAdminUserByEmail(email);
  if (!admin || !admin.passwordHash) {
    return { success: false, error: "Invalid email or password" };
  }

  if (!admin.isActive) {
    return { success: false, error: "This account has been deactivated. Contact a super admin." };
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  const role = (admin.role as AdminRole) ?? "super_admin";
  const token = await signAdminSession(admin.id, admin.email, role);
  const opts = getSessionCookieOptions(headers);
  resHeaders.append(
    "set-cookie",
    cookie.serialize(ADMIN_SESSION_COOKIE, token, {
      ...opts,
      maxAge: 30 * 24 * 60 * 60,
    }),
  );

  // Import permissions lazily to avoid circular deps
  const { ROLE_PERMISSIONS } = await import("./local-auth");

  return {
    success: true,
    email: admin.email,
    name: admin.name,
    role,
    permissions: ROLE_PERMISSIONS[role] ?? [],
  };
}
