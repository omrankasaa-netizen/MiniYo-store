import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Require specific role or higher
function requireRole(minRole: string) {
  const roleHierarchy: Record<string, number> = {
    customer: 0,
    staff: 1,
    admin: 2,
    super_admin: 3,
  };

  return t.middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: ErrorMessages.unauthenticated,
      });
    }

    const userLevel = roleHierarchy[ctx.user.role] ?? 0;
    const requiredLevel = roleHierarchy[minRole] ?? 0;

    if (userLevel < requiredLevel) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole,
      });
    }

    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

export const authedQuery = t.procedure.use(requireAuth);
export const staffQuery = authedQuery.use(requireRole("staff"));
export const adminQuery = authedQuery.use(requireRole("admin"));
export const superAdminQuery = authedQuery.use(requireRole("super_admin"));
