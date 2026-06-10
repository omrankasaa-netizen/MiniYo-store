import * as cookie from "cookie";
import { findAdminUserByEmail, verifyPassword, signAdminSession } from "./local-auth";
import { getSessionCookieOptions } from "./lib/cookies";

const ADMIN_SESSION_COOKIE = "miniyo_admin_session";

export interface AdminLoginResult {
  success: boolean;
  email?: string;
  error?: string;
}

/**
 * Handles admin login by verifying credentials against the admin_users table
 * and issuing a session cookie on success.
 *
 * @param email     - The admin's email address
 * @param password  - The admin's plaintext password
 * @param headers   - Incoming request headers (used to determine cookie options)
 * @param resHeaders - Response headers to append the Set-Cookie header to
 */
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

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  const token = await signAdminSession(admin.id, admin.email);
  const opts = getSessionCookieOptions(headers);
  resHeaders.append(
    "set-cookie",
    cookie.serialize(ADMIN_SESSION_COOKIE, token, {
      ...opts,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    }),
  );

  return { success: true, email: admin.email };
}
