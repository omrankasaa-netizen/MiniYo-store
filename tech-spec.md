# Miniyo — Technical Specification

## Project Overview

Miniyo is a bilingual (EN/AR) baby boutique e-commerce platform built for the Lebanese market. It features a customer-facing storefront, a protected admin panel, and full order management with Lebanese-specific payment methods (Cash on Delivery and Whish).

---

## Architecture

### Frontend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| Vite | 7.x | Build tool and dev server |
| React | 19.x | UI framework |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui | latest | UI component primitives |
| Radix UI | latest | Accessible component base |
| React Router | 7.x | Client-side routing (HashRouter) |
| Zustand | 5.x | Client state management |
| tRPC | 11.x | Type-safe API client |
| TanStack Query | 5.x | Server state management |
| Framer Motion | 12.x | Animations |
| Lucide React | latest | Icons |
| Superjson | 2.x | JSON serialization |

### Backend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| Hono | 4.x | HTTP server framework |
| tRPC | 11.x | Type-safe API router |
| Drizzle ORM | 0.45.x | Database ORM |
| mysql2 | 3.14.x | MySQL driver |
| bcryptjs | 3.x | Password hashing |
| jose | 6.x | JWT token handling |
| cookie | 1.x | Cookie parsing |
| Zod | 4.x | Input validation |
| esbuild | 0.27.x | Backend bundling |

### Database
| Technology | Purpose |
|-----------|---------|
| MySQL (TiDB) | Primary database |
| Drizzle ORM | Schema definition and queries |

---

## Project Structure

```
/mnt/agents/output/app/          ← Project root
├── api/                          ← Backend
│   ├── boot.ts                   ← Hono server entry
│   ├── router.ts                 ← tRPC app router
│   ├── context.ts                ← Request context (auth)
│   ├── middleware.ts             ← tRPC middleware (roles)
│   ├── local-auth.ts             ← Local auth (bcrypt/JWT)
│   ├── local-auth-router.ts      ← tRPC auth endpoints
│   ├── auth-router.ts            ← Kimi OAuth (unused)
│   ├── customer-router.ts        ← Customer endpoints (unused)
│   ├── miniyo-router.ts          ← Main CRUD router
│   ├── lib/
│   │   ├── env.ts                ← Environment variables
│   │   ├── cookies.ts            ← Cookie helpers
│   │   └── vite.ts               ← SPA fallback
│   └── queries/
│       └── connection.ts         ← Drizzle DB connection
├── contracts/                    ← Shared types/constants
│   ├── constants.ts
│   └── errors.ts
├── db/                           ← Database
│   ├── schema.ts                 ← 22 Drizzle table schemas
│   ├── relations.ts              ← Table relations
│   ├── push-schema.ts            ← Schema creation (raw SQL)
│   ├── seed.ts                   ← Seed data
│   └── check-db.ts
├── src/                          ← Frontend
│   ├── main.tsx                  ← Entry point
│   ├── App.tsx                   ← Root component + routes
│   ├── index.css                 ← Global styles
│   ├── pages/                    ← All pages
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── MemberAreaPage.tsx
│   │   ├── WishlistPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── FaqPage.tsx
│   │   ├── PrivacyPage.tsx
│   │   ├── TermsPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── TrackOrderPage.tsx
│   │   ├── ShippingPage.tsx
│   │   └── AdminPage.tsx
│   ├── components/
│   │   ├── layout/               ← Navigation, Footer
│   │   ├── shared/               ← Shared components
│   │   └── admin/                ← Admin modules
│   ├── stores/                   ← Zustand stores
│   ├── hooks/                    ← Custom hooks (useAuth, etc.)
│   ├── lib/                      ← Utilities
│   ├── providers/                ← Context providers
│   └── types/                    ← TypeScript types
├── index.html                    ← Vite entry HTML
├── package.json                  ← Dependencies & scripts
├── vite.config.ts                ← Vite configuration
├── tailwind.config.js            ← Tailwind theme
├── .env                          ← Environment variables
└── .env.example                  ← Env template
```

---

## Database Schema (22 Tables)

| Table | Key Fields |
|-------|-----------|
| `users` | id, email, passwordHash, name, role (super_admin/admin/staff/customer) |
| `categories` | id, slug, name, nameAr, description, descriptionAr |
| `collections` | id, slug, name, nameAr |
| `products` | id, slug, sku, name, nameAr, price, stockQuantity, categorySlug, gender, colors, sizes |
| `product_images` | id, productId, url, alt, altAr, isPrimary |
| `product_variants` | id, productId, sku, qtyOnHand, qtyReserved, option1, option2 |
| `reviews` | id, productId, rating, body, isVerified |
| `orders` | id, orderNumber, customerName, subtotal, discountTotal, grandTotal, paymentMethod, orderStatus, shippingAddress |
| `order_items` | id, orderId, productId, productName, quantity, unitPrice, sku, size, color |
| `order_status_history` | id, orderId, status, note, changedBy |
| `inventory_movements` | id, productId, type, quantity, previousStock, newStock |
| `customers` | id, name, email, phone, membershipTier, totalOrders, totalSpent |
| `customer_addresses` | id, customerId, fullName, city, district, street, building, floor, apartment, landmark |
| `wishlist_items` | id, userId, productId |
| `promo_codes` | id, code, name, type (percentage/fixed_amount/flash_sale), value, scope, validFrom, validUntil |
| `media_assets` | id, type (product/logo/favicon/hero/footer), url, name, altEn, altAr |
| `cms_sections` | id, sectionKey, title, titleAr, body, bodyAr |
| `faqs` | id, question, questionAr, answer, answerAr, category |
| `site_settings` | id, settingKey, settingValue |
| `audit_logs` | id, action, entity, entityId, details, userName |
| `email_queue` | id, recipient, subject, body, template, status |
| `membership_activities` | id, customerId, action, oldTier, newTier |

---

## API Endpoints (tRPC)

| Router | Endpoint | Method | Purpose |
|--------|----------|--------|---------|
| `localAuth` | `register` | mutation | Create account |
| `localAuth` | `login` | mutation | Authenticate |
| `localAuth` | `me` | query | Get current user |
| `localAuth` | `logout` | mutation | Clear session |
| `localAuth` | `isAdmin` | query | Check admin role |
| `miniyo.product` | `list` | query | List products (filtered) |
| `miniyo.product` | `getBySlug` | query | Product detail |
| `miniyo.product` | `create` | mutation | Create product |
| `miniyo.product` | `update` | mutation | Update product |
| `miniyo.product` | `delete` | mutation | Delete product |
| `miniyo.category` | `list` | query | List categories |
| `miniyo.order` | `list` | query | List orders |
| `miniyo.order` | `getById` | query | Order detail |
| `miniyo.order` | `create` | mutation | Create order |
| `miniyo.order` | `updateStatus` | mutation | Update order status |
| `miniyo.settings` | `getAll` | query | All settings |
| `miniyo.settings` | `getByKey` | query | Single setting |
| `miniyo.settings` | `set` | mutation | Update setting |
| `miniyo.media` | `list` | query | List media |
| `miniyo.media` | `create` | mutation | Upload media |
| `miniyo.faq` | `list` | query | List FAQs |
| `miniyo.wishlist` | `list` | query | List wishlist |
| `miniyo.wishlist` | `add` | mutation | Add to wishlist |
| `miniyo.wishlist` | `remove` | mutation | Remove from wishlist |
| `miniyo.promo` | `validate` | query | Validate promo code |
| `miniyo.inventory` | `movements` | query | Stock movements |
| `miniyo.inventory` | `adjust` | mutation | Adjust stock |
| `miniyo.stats` | `get` | query | Dashboard stats |

---

## Authentication

### Local Auth (Active)
- **Registration:** bcrypt hash → localStorage user array
- **Login:** bcrypt compare → set localStorage session
- **Session:** localStorage (`miniyo_auth_user`) + Zustand store
- **Roles:** super_admin, admin, staff, customer
- **Admin access:** Any role >= staff can access /admin
- **Logout:** Clears localStorage + Zustand + page reload

### Admin Password
- Set via `ADMIN_PASSWORD` environment variable
- Hashed at build time via `vite.config.ts` → injected into bundle as `__ADMIN_PASSWORD_HASH__`
- No plaintext password in source or bundle

### Kimi OAuth (Unused)
- Code exists in `api/auth-router.ts` but not wired to frontend
- Kept for future use but non-functional

---

## Build & Deploy

### Scripts
| Script | Command |
|--------|---------|
| `npm run dev` | `vite` (frontend dev + Hono API) |
| `npm run build` | `vite build` (frontend → dist/public) + `esbuild api/boot.ts` (backend → dist/boot.js) |
| `npm start` | `NODE_ENV=production node dist/boot.js` |
| `npm run seed` | `npx tsx db/seed.ts` |
| `npm run db:push` | `npx tsx db/push-schema.ts` |

### Build Outputs
| Output | Location |
|--------|----------|
| Frontend | `dist/public/` (index.html + assets) |
| Backend | `dist/boot.js` (bundled Hono server) |

### Environment Variables (Required)
```
DATABASE_URL=mysql://user:pass@host:port/db
APP_ID=your_app_id
APP_SECRET=your_app_secret
ADMIN_PASSWORD=your_admin_password
KIMI_AUTH_URL=...
KIMI_OPEN_URL=...
OWNER_UNION_ID=...
```

### Deployment
1. `npm install` — install dependencies
2. Set environment variables in hosting dashboard
3. `npm run build` — build frontend + backend
4. `npm start` — start production server
5. `npm run seed` — seed initial data (first run only)

### Server Behavior (Hono)
- `/api/trpc/*` → tRPC API endpoints
- `/api/oauth/callback` → OAuth callback
- `/*` → Static files from `dist/public/`
- SPA fallback → `index.html` for unknown routes

---

## Key Design Decisions

1. **HashRouter** — Used for static hosting compatibility (no server-side routing needed)
2. **Hybrid Auth** — localStorage-based auth for static deployment, tRPC-enhanced when backend available
3. **Single Build** — Both frontend and backend bundled from one `npm run build`
4. **Bilingual** — EN/AR with locale switcher, RTL support, parallel fields (name/nameAr, etc.)
5. **Lebanese Market** — CoD default, Whish secondary, WhatsApp integration, Lebanese address format
6. **Admin Password at Build Time** — Hash baked into bundle, no runtime env var needed for auth

---

## Known Limitations

- Static hosting serves frontend only — tRPC API requires Node.js backend
- Images stored as base64 data URLs (no cloud storage integration)
- Cart/wishlist use localStorage (not database-backed for guests)
- No email sending service wired up (email queue exists but not processed)
- TypeScript has ~10 errors in miniyo-router.ts (don't block esbuild build)
- Kimi OAuth code exists but is non-functional
