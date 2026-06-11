import devServer from "@hono/vite-dev-server"
import path from "path"
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import bcrypt from "bcryptjs"

// ── Admin Password Hash ──
// Reads ADMIN_PASSWORD from environment, hashes it with bcrypt,
// injects into frontend bundle as a build-time constant.
// No plaintext password exists in the bundle — only the hash.
const adminPassword = process.env.ADMIN_PASSWORD || ""
const adminPasswordHash = adminPassword ? bcrypt.hashSync(adminPassword, 12) : ""
if (adminPassword) {
  console.log("✅ Admin password hash generated")
} else {
  console.log("⚠️  ADMIN_PASSWORD not set — admin login disabled")
}

// https://vite.dev/config/
export default defineConfig({
  // Explicit root ensures Vite resolves from project dir regardless of cwd
  root: __dirname,
  plugins: [
    devServer({
      entry: "api/boot.ts",
      // Exclude all non-API routes from the Hono dev server so Vite handles them.
      // Written as a function to avoid regex lookahead syntax that esbuild cannot parse.
      exclude: [(path: string) => !path.startsWith("/api")],
    }),
    inspectAttr(),
    react(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      "db": path.resolve(__dirname, "./db"),
    },
  },
  envDir: path.resolve(__dirname),
  define: {
    __ADMIN_PASSWORD_HASH__: JSON.stringify(adminPasswordHash),
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
})
