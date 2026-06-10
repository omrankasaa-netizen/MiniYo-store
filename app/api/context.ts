import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User, AdminUser } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalSession, findLocalUserByEmail } from "./local-auth";
import { verifyAdminSession } from "./admin-auth";
import * as cookie from "cookie";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  admin?: Pick<AdminUser, "id" | "email" | "name" | "role">;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // ── 1. Try OAuth first (Kimi) ──
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // OAuth not available
  }

  // ── 2. If no OAuth user, try local auth session ──
  if (!ctx.user) {
    try {
      const cookies = cookie.parse(opts.req.headers.get("cookie") || "");
      const localToken = cookies["miniyo_session"];
      if (localToken) {
        const session = await verifyLocalSession(localToken);
        if (session) {
          const user = await findLocalUserByEmail(session.email);
          if (user) {
            ctx.user = user;
          }
        }
      }
    } catch {
      // Local auth not available
    }
  }

  // ── 3. Check admin session (separate from user session) ──
  try {
    const cookies = cookie.parse(opts.req.headers.get("cookie") || "");
    const adminToken = cookies["admin_session"];
    if (adminToken) {
      const session = await verifyAdminSession(adminToken);
      if (session) {
        ctx.admin = {
          id: session.adminId,
          email: session.email,
          name: null,
          role: session.role,
        };
        // Also set user from admin so existing adminQuery middleware works
        ctx.user = {
          id: session.adminId,
          email: session.email,
          name: "Admin",
          role: session.role,
          unionId: null,
          passwordHash: null,
          avatar: null,
          phone: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignInAt: new Date(),
        };
      }
    }
  } catch {
    // Admin auth not available
  }

  return ctx;
}
