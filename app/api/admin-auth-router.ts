import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as cookie from "cookie";
import { isNotNull } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import {
  verifyPassword,
  countAdminUsers,
  findAdminUserByEmail,
  createAdminUser,
  setAdminPassword,
  signAdminSession,
  verifyAdminSession,
  type AdminRole,
} from "./local-auth";
import { getSessionCookieOptions } from "./lib/cookies";
import { getDb } from "./queries/connection";
import { adminUsers } from "@db/schema";

const ADMIN_SESSION_COOKIE = "miniyo_admin_session";

export const adminAuthRouter = createRouter({
  setupStatus: publicQuery.query(async () => {
    const total = await countAdminUsers();
    if (total === 0) {
      return { isSetup: false, needsSetup: true };
    }
    const db = getDb();
    const withPassword = await db
      .select()
      .from(adminUsers)
      .where(isNotNull(adminUsers.passwordHash))
      .limit(1);
    const isSetup = withPassword.length > 0;
    return { isSetup, needsSetup: !isSetup };
  }),

  firstLogin: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const total = await countAdminUsers();
      if (total > 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin already configured. Please log in with your password.",
        });
      }
      const admin = await createAdminUser(input.email);
      const token = await signAdminSession(admin.id, admin.email, "super_admin");
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(ADMIN_SESSION_COOKIE, token, { ...opts, maxAge: 30 * 60 }),
      );
      return { success: true, needsPasswordSetup: true, email: admin.email };
    }),

  setupPassword: publicQuery
    .input(z.object({
      password: z.string().min(8),
      confirmPassword: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (input.password !== input.confirmPassword) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Passwords do not match" });
      }
      const cookies = cookie.parse(ctx.req.headers.get("cookie") || "");
      const sessionToken = cookies[ADMIN_SESSION_COOKIE];
      if (!sessionToken) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "No admin session found." });
      }
      const session = await verifyAdminSession(sessionToken);
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired session." });
      }
      await setAdminPassword(session.email, input.password);
      const opts = getSessionCookieOptions(ctx.req.headers);
      const fullToken = await signAdminSession(session.adminId, session.email, "super_admin");
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(ADMIN_SESSION_COOKIE, fullToken, { ...opts, maxAge: 30 * 24 * 60 * 60 }),
      );
      return { success: true, email: session.email };
    }),

  login: publicQuery
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const admin = await findAdminUserByEmail(input.email);
      if (!admin || !admin.passwordHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }
      const valid = await verifyPassword(input.password, admin.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }
      const role = (admin.role ?? "super_admin") as AdminRole;
      const token = await signAdminSession(admin.id, admin.email, role);
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(ADMIN_SESSION_COOKIE, token, { ...opts, maxAge: 30 * 24 * 60 * 60 }),
      );
      return { success: true, email: admin.email, role };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const cookies = cookie.parse(ctx.req.headers.get("cookie") || "");
    const sessionToken = cookies[ADMIN_SESSION_COOKIE];
    if (!sessionToken) return null;
    const session = await verifyAdminSession(sessionToken);
    if (!session) return null;
    const admin = await findAdminUserByEmail(session.email);
    if (!admin) return null;
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name ?? null,
      role: (admin.role ?? "super_admin") as AdminRole,
      passwordSet: !!admin.passwordHash,
    };
  }),

  logout: publicQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(ADMIN_SESSION_COOKIE, "", { ...opts, maxAge: 0 }),
    );
    return { success: true };
  }),
});
