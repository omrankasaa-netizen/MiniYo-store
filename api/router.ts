import { createRouter } from "./middleware";
import { miniyoRouter } from "./miniyo-router";
import { settingsAdminRouter } from "./settings-router";

export const appRouter = createRouter({
  miniyo: miniyoRouter,
  settingsAdmin: settingsAdminRouter,
});

export type AppRouter = typeof appRouter;
