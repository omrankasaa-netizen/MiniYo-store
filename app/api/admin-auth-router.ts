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
} from "./local-auth";
import { getSessionCookieOptions } from "./lib/cookies";
import { getDb } from "./queries/connection";
import { adminUsers } from "@db/schema";

const ADMIN_SESSION_COOKIE = "miniyo_admin_session";

export const adminAuthRouter = createRouter({
  /**
   * Returns whether the admin setup has been completed (i.e. at least one
   * admin user with a password exists in the database).
   */
  setupStatus: publicQuery.query(async () => {
    const total = await countAdminUsers();
    if (total === 0) {
      return { isSetup: false, needsSetup: true };
    }
    // Check if any admin has a password set
    const db = getDb();
    const withPassword = await db
      .select()
      .from(adminUsers)
      .where(isNotNull(adminUsers.passwordHash))
      .limit(1);
    const isSetup = withPassword.length > 0;
    return { isSetup, needsSetup: !isSetup };
  }),

  /**
   * First-time admin login: no password required.
   * Allowed only when no admin user exists in the database yet.
   * Creates the admin record and returns a temporary session that only
   * permits access to the setup-password page.
   */
  firstLogin: publicQuery
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const total = await countAdminUsers();
      if (total > 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin already configured. Please log in with your password.",
        });
      }

      // Create the admin record (no password yet)
      const admin = await createAdminUser(input.email);

      // Issue a short-lived setup session
      const token = await signAdminSession(admin.id, admin.email);
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(ADMIN_SESSION_COOKIE, token, {
          ...opts,
          maxAge: 30 * 60, // 30 minutes — only for setup
        })
      );

      return { success: true, needsPasswordSetup: true, email: admin.email };
    }),

  /**
   * Set the admin password during first-time setup.
   * Requires a valid admin session cookie (issued by firstLogin).
   */
  setupPassword: publicQuery
    .input(
      z.object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.password !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }

      // Verify the setup session cookie
      const cookies = cookie.parse(ctx.req.headers.get("cookie") || "");
      const sessionToken = cookies[ADMIN_SESSION_COOKIE];
      if (!sessionToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No admin session found. Please start the setup process again.",
        });
      }

      const session = await verifyAdminSession(sessionToken);
      if (!session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired session. Please start the setup process again.",
        });
      }

      // Save the hashed password
      await setAdminPassword(session.email, input.password);

      // Issue a full-duration session
      const opts = getSessionCookieOptions(ctx.req.headers);
      const fullToken = await signAdminSession(session.adminId, session.email);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(ADMIN_SESSION_COOKIE, fullToken, {
          ...opts,
          maxAge: 30 * 24 * 60 * 60, // 30 days
        })
      );

      return { success: true, email: session.email };
    }),

  /**
   * Subsequent admin logins: requires email + password from the database.
   */
  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const admin = await findAdminUserByEmail(input.email);
      if (!admin || !admin.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const valid = await verifyPassword(input.password, admin.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = await signAdminSession(admin.id, admin.email);
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(ADMIN_SESSION_COOKIE, token, {
          ...opts,
          maxAge: 30 * 24 * 60 * 60, // 30 days
        })
      );

      return { success: true, email: admin.email };
    }),

  /**
   * Returns the currently authenticated admin (from cookie), or null.
   */
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
      passwordSet: !!admin.passwordHash,
    };
  }),

  /**
   * Logs out the admin by clearing the session cookie.
   */
  logout: publicQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(ADMIN_SESSION_COOKIE, "", {
        ...opts,
        maxAge: 0,
      })
    );
    return { success: true };
  }),
});
