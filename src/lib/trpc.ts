/**
 * tRPC client — single source of truth for all API calls
 * Uses cookie-based auth (miniyo_session) — set automatically by login
 */
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '../../api/miniyo-router'

const API_URL = import.meta.env.VITE_API_URL || 'https://miniyo-store-production.up.railway.app'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${API_URL}/api/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include', // sends miniyo_session cookie
        })
      },
    }),
  ],
  transformer: superjson,
})
