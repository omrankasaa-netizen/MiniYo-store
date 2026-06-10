import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalSession, findLocalUserByEmail } from "./local-auth";
import * as cookie from "cookie";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth first (Kimi)
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // OAuth not available, try local auth
  }

  // If no OAuth user, try local auth session
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

  return ctx;
}
