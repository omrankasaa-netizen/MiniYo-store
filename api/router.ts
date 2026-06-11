import { createRouter } from './middleware'
import { localAuthRouter } from './local-auth-router'
import { membershipRouter } from './routers/membershipRouter'
import { emailRouter } from './routers/emailRouter'

// Import all existing sub-routers from the existing router file
// (this replaces api/router.ts — all previous routers preserved)
import { productsRouter } from './routers/productsRouter'
import { ordersRouter } from './routers/ordersRouter'
import { customersRouter } from './routers/customersRouter'
import { categoriesRouter } from './routers/categoriesRouter'
import { collectionsRouter } from './routers/collectionsRouter'
import { adminRouter } from './routers/adminRouter'
import { mediaRouter } from './routers/mediaRouter'
import { settingsRouter } from './routers/settingsRouter'
import { promoCodesRouter } from './routers/promoCodesRouter'
import { reviewsRouter } from './routers/reviewsRouter'
import { wishlistRouter } from './routers/wishlistRouter'
import { analyticsRouter } from './routers/analyticsRouter'
import { cmsRouter } from './routers/cmsRouter'
import { faqRouter } from './routers/faqRouter'

export const appRouter = createRouter({
  auth: localAuthRouter,
  membership: membershipRouter,
  email: emailRouter,
  products: productsRouter,
  orders: ordersRouter,
  customers: customersRouter,
  categories: categoriesRouter,
  collections: collectionsRouter,
  admin: adminRouter,
  media: mediaRouter,
  settings: settingsRouter,
  promoCodes: promoCodesRouter,
  reviews: reviewsRouter,
  wishlist: wishlistRouter,
  analytics: analyticsRouter,
  cms: cmsRouter,
  faq: faqRouter,
})

export type AppRouter = typeof appRouter
