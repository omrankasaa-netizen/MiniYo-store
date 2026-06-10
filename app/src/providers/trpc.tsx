import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { ReactNode } from "react";
import type { AppRouter } from "../../api/router";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
    mutations: { retry: 0 },
  },
});

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return "http://localhost:3000";
}

export function TRPCProvider({ children }: { children: ReactNode }) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          async fetch(url, options) {
            try {
              const response = await fetch(url, {
                ...options,
                credentials: "include",
              });
              const text = await response.clone().text();
              if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
                return new Response(
                  JSON.stringify({ error: { json: { message: "Backend unavailable", code: -32000 } } }),
                  { status: 503, headers: { "content-type": "application/json" } }
                );
              }
              return response;
            } catch {
              return new Response(
                JSON.stringify({ error: { json: { message: "Backend unavailable", code: -32000 } } }),
                { status: 503, headers: { "content-type": "application/json" } }
              );
            }
          },
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
