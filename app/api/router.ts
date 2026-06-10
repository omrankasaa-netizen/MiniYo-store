import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { adminAuthRouter } from "./admin-auth-router";
import { miniyoRouter } from "./miniyo-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  adminAuth: adminAuthRouter,
  miniyo: miniyoRouter,
});

export type AppRouter = typeof appRouter;
