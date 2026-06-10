import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as cookie from "cookie";
import { createRouter, publicQuery } from "./middleware";
import {
  verifyPassword,
  signLocalSession,
  findLocalUserByEmail,
  createLocalUser,
  verifyLocalSession,
} from "./local-auth";
import { getSessionCookieOptions } from "./lib/cookies";
import { getDb } from "./queries/connection";
import { eq } from "drizzle-orm";
import * as schema from "@db/schema";

export const localAuthRouter = createRouter({
  // Register new user
  register: publicQuery
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        name: z.string().min(1, "Name is required"),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if email already exists
      const existing = await findLocalUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists",
        });
      }

      const user = await createLocalUser({
        email: input.email,
        password: input.password,
        name: input.name,
        phone: input.phone,
        role: "customer",
      });

      // Create session
      const token = await signLocalSession(user.id, user.email!, user.role);
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize("miniyo_session", token, {
          ...opts,
          maxAge: 30 * 24 * 60 * 60, // 30 days
        })
      );

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
      };
    }),

  // Login
  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await findLocalUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Update last sign in
      const db = getDb();
      await db.update(schema.users)
        .set({ lastSignInAt: new Date() })
        .where(eq(schema.users.id, user.id));

      // Create session
      const token = await signLocalSession(user.id, user.email!, user.role);
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize("miniyo_session", token, {
          ...opts,
          maxAge: 30 * 24 * 60 * 60, // 30 days
        })
      );

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
      };
    }),

  // Get current user
  me: publicQuery.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      name: ctx.user.name,
      phone: ctx.user.phone,
      role: ctx.user.role,
      avatar: ctx.user.avatar,
    };
  }),

  // Logout — public so anyone can clear cookies even if session expired
  logout: publicQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);

    // Clear local session cookie
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize("miniyo_session", "", {
        ...opts,
        maxAge: 0,
      })
    );

    // Clear OAuth cookie
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize("kimi_sid", "", {
        ...opts,
        maxAge: 0,
      })
    );

    return { success: true };
  }),

  // Admin login check
  isAdmin: publicQuery.query(async ({ ctx }) => {
    if (!ctx.user) return { isAdmin: false, role: null };
    const adminRoles = ["admin", "super_admin", "staff"];
    return {
      isAdmin: adminRoles.includes(ctx.user.role),
      role: ctx.user.role,
    };
  }),
});
