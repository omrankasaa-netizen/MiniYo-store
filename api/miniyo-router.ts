import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  products, productImages, categories, orders, orderItems,
  customers, mediaAssets, cmsSections, siteSettings, auditLogs, emailQueue,
  faqs, promoCodes, wishlistItems, inventoryMovements,
} from "@db/schema";
import { eq, desc, and, sql, count } from "drizzle-orm";
import { sendMail, buildOrderNotificationHtml } from "./lib/mailer";
import { env } from "./lib/env";

// ── Products ──
const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        isNew: z.boolean().optional(),
        isBestseller: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        sale: z.boolean().optional(),
        gender: z.string().optional(),
        sort: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(products);

      if (input?.category) {
        query = query.where(eq(products.categorySlug, input.category)) as typeof query;
      }
      if (input?.search) {
        query = query.where(
          sql`${products.name} LIKE ${"%" + input.search + "%"} OR ${products.nameAr} LIKE ${"%" + input.search + "%"}`
        ) as typeof query;
      }
      if (input?.isNew) query = query.where(eq(products.isNew, true)) as typeof query;
      if (input?.isBestseller) query = query.where(eq(products.isBestseller, true)) as typeof query;
      if (input?.isFeatured) query = query.where(eq(products.isFeatured, true)) as typeof query;
      if (input?.sale) query = query.where(sql`${products.compareAtPrice} IS NOT NULL`) as typeof query;
      if (input?.gender) query = query.where(eq(products.gender, input.gender as "boy" | "girl" | "unisex")) as typeof query;

      if (input?.sort === "price-asc") query = query.orderBy(products.price) as typeof query;
      else if (input?.sort === "price-desc") query = query.orderBy(desc(products.price)) as typeof query;
      else query = query.orderBy(desc(products.createdAt)) as typeof query;

      return query;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const product = await db.select().from(products).where(eq(products.slug, input.slug)).limit(1);
      if (!product[0]) return null;
      const images = await db.select().from(productImages).where(eq(productImages.productId, product[0].id));
      return { ...product[0], images };
    }),

  create: adminQuery
    .input(z.object({
      slug: z.string(), sku: z.string(), name: z.string(), nameAr: z.string(),
      description: z.string().optional(), descriptionAr: z.string().optional(),
      price: z.number(), compareAtPrice: z.number().optional(),
      stockQuantity: z.number().default(0),
      categoryId: z.number().optional(), categorySlug: z.string().optional(),
      categoryName: z.string().optional(), categoryNameAr: z.string().optional(),
      gender: z.enum(["boy", "girl", "unisex"]).optional(),
      ageGroup: z.string().optional(), material: z.string().optional(),
      careInstructions: z.string().optional(), weight: z.number().optional(),
      dimensions: z.string().optional(), tags: z.string().optional(),
      colors: z.any().optional(), sizes: z.any().optional(),
      isActive: z.boolean().default(true), isNew: z.boolean().default(false),
      isFeatured: z.boolean().default(false), isBestseller: z.boolean().default(false),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(products).values(input).$returningId();
      return db.select().from(products).where(eq(products.id, result.id)).limit(1);
    }),

  update: adminQuery
    .input(z.object({
      id: z.number(),
      data: z.record(z.any()),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(products).set(input.data).where(eq(products.id, input.id));
      return db.select().from(products).where(eq(products.id, input.id)).limit(1);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(productImages).where(eq(productImages.productId, input.id));
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),

  addImage: adminQuery
    .input(z.object({
      productId: z.number(),
      url: z.string(),
      alt: z.string().optional(),
      altAr: z.string().optional(),
      isPrimary: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(productImages).values(input).$returningId();
      return db.select().from(productImages).where(eq(productImages.id, result.id)).limit(1);
    }),

  deleteImage: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(productImages).where(eq(productImages.id, input.id));
      return { success: true };
    }),
});

// ── Categories ──
const categoryRouter = createRouter({
  list: publicQuery.query(async () => {
    return getDb().select().from(categories).orderBy(categories.sortOrder);
  }),

  create: adminQuery
    .input(z.object({
      slug: z.string(), name: z.string(), nameAr: z.string(),
      image: z.string().optional(), sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(categories).values(input).$returningId();
      return db.select().from(categories).where(eq(categories.id, result.id)).limit(1);
    }),

  update: adminQuery
    .input(z.object({ id: z.number(), data: z.record(z.any()) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(categories).set(input.data).where(eq(categories.id, input.id));
      return db.select().from(categories).where(eq(categories.id, input.id)).limit(1);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});

// ── Orders ──
const orderRouter = createRouter({
  list: publicQuery
    .input(z.object({
      status: z.string().optional(),
      paymentMethod: z.string().optional(),
      search: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(orders);

      if (input?.status) {
        query = query.where(eq(orders.orderStatus, input.status as any)) as typeof query;
      }
      if (input?.paymentMethod) {
        query = query.where(eq(orders.paymentMethod, input.paymentMethod as any)) as typeof query;
      }
      if (input?.search) {
        query = query.where(
          sql`${orders.customerName} LIKE ${"%" + input.search + "%"} OR ${orders.orderNumber} LIKE ${"%" + input.search + "%"}`
        ) as typeof query;
      }

      return query.orderBy(desc(orders.createdAt));
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const order = await db.select().from(orders).where(eq(orders.id, input.id)).limit(1);
      if (!order[0]) return null;
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, input.id));
      return { ...order[0], items };
    }),

  create: publicQuery
    .input(z.object({
      orderNumber: z.string(),
      customerName: z.string(),
      customerEmail: z.string().optional(),
      customerPhone: z.string(),
      subtotal: z.number(),
      deliveryFee: z.number().default(0),
      grandTotal: z.number(),
      paymentMethod: z.enum(["cod", "wish", "card"]).default("cod"),
      shippingAddress: z.any().optional(),
      customerNotes: z.string().optional(),
      items: z.array(z.object({
        productId: z.number(),
        productName: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
        sku: z.string().optional(),
        color: z.string().optional(),
        size: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(orders).values({
        ...input,
        subtotal: String(input.subtotal),
        deliveryFee: String(input.deliveryFee),
        grandTotal: String(input.grandTotal),
      }).$returningId();

      const orderId = result.id;

      // Insert order items
      if (input.items.length > 0) {
        await db.insert(orderItems).values(
          input.items.map(item => ({
            orderId,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: String(item.unitPrice),
            sku: item.sku,
            color: item.color,
            size: item.size,
          }))
        );
      }

      // Decrement stock
      for (const item of input.items) {
        await db.update(products)
          .set({ stockQuantity: sql`${products.stockQuantity} - ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }

      // Build styled HTML for the notification email
      const htmlBody = buildOrderNotificationHtml({
        orderNumber: input.orderNumber,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        grandTotal: input.grandTotal,
        paymentMethod: input.paymentMethod,
        shippingAddress: input.shippingAddress,
        items: input.items.map(i => ({
          productName: i.productName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          color: i.color,
          size: i.size,
        })),
        customerNotes: input.customerNotes,
      });

      // Queue notification email — worker picks it up within 60s
      // Fan-out to all NOTIFICATION_EMAILS is handled in the worker
      await db.insert(emailQueue).values({
        recipient: env.notificationEmails[0] ?? "Management@miniyo.store",
        subject: `🛍️ New Order: ${input.orderNumber} — ${input.customerName} ($${input.grandTotal})`,
        body: `New order ${input.orderNumber} from ${input.customerName}\nPhone: ${input.customerPhone}\nTotal: $${input.grandTotal}\nPayment: ${input.paymentMethod}`,
        htmlBody,
        template: "order_notification",
      } as any);

      return db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    }),

  updateStatus: adminQuery
    .input(z.object({
      id: z.number(),
      orderStatus: z.enum([
        "draft", "pending_confirmation", "payment_pending_whish",
        "confirmed", "packed", "out_for_delivery", "delivered",
        "cancelled", "refunded",
      ]).optional(),
      paymentStatus: z.enum(["pending", "verified", "failed", "refunded"]).optional(),
      whatsappConfirmed: z.boolean().optional(),
      internalNotes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      await db.update(orders).set(updates).where(eq(orders.id, id));
      return db.select().from(orders).where(eq(orders.id, id)).limit(1);
    }),
});

// ── Customers ──
const customerRouter = createRouter({
  list: publicQuery
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.search) {
        return db.select().from(customers).where(
          sql`${customers.name} LIKE ${"%" + input.search + "%"} OR ${customers.email} LIKE ${"%" + input.search + "%"}`
        ).orderBy(desc(customers.createdAt));
      }
      return db.select().from(customers).orderBy(desc(customers.createdAt));
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getDb().select().from(customers).where(eq(customers.id, input.id)).limit(1);
    }),

  create: publicQuery
    .input(z.object({
      name: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      type: z.enum(["registered", "guest"]).default("guest"),
      addresses: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if customer with this email already exists
      if (input.email) {
        const existing = await db.select().from(customers).where(eq(customers.email, input.email)).limit(1);
        if (existing[0]) {
          return existing[0];
        }
      }

      const [result] = await db.insert(customers).values(input).$returningId();

      // Queue welcome email
      if (input.email) {
        await db.insert(emailQueue).values({
          recipient: input.email,
          subject: "Welcome to Miniyo! 🛍️",
          body: `Hi ${input.name},\n\nWelcome to Miniyo! We're so excited to have you join our family of happy parents across Lebanon.\n\nShop our curated collection: https://miniyo.store\n\nWith love,\nThe Miniyo Team`,
          template: "welcome",
        });
      }

      return db.select().from(customers).where(eq(customers.id, result.id)).limit(1);
    }),

  update: adminQuery
    .input(z.object({ id: z.number(), data: z.record(z.any()) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(customers).set(input.data).where(eq(customers.id, input.id));
      return db.select().from(customers).where(eq(customers.id, input.id)).limit(1);
    }),
});

// ── Media ──
const mediaRouter = createRouter({
  list: publicQuery
    .input(z.object({ type: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.type) {
        return db.select().from(mediaAssets).where(eq(mediaAssets.type, input.type as any)).orderBy(desc(mediaAssets.uploadedAt));
      }
      return db.select().from(mediaAssets).orderBy(desc(mediaAssets.uploadedAt));
    }),

  create: adminQuery
    .input(z.object({
      type: z.enum(["product", "logo", "hero", "brand_kit", "sticker", "cms"]).default("product"),
      url: z.string(),
      name: z.string(),
      altEn: z.string().optional(),
      altAr: z.string().optional(),
      assignedTo: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(mediaAssets).values(input).$returningId();
      return db.select().from(mediaAssets).where(eq(mediaAssets.id, result.id)).limit(1);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(mediaAssets).where(eq(mediaAssets.id, input.id));
      return { success: true };
    }),
});

// ── CMS ──
const cmsRouter = createRouter({
  list: publicQuery.query(async () => {
    return getDb().select().from(cmsSections).orderBy(cmsSections.sortOrder);
  }),

  upsert: adminQuery
    .input(z.object({
      key: z.string(),
      title: z.string().optional(),
      titleAr: z.string().optional(),
      body: z.string().optional(),
      bodyAr: z.string().optional(),
      imageUrl: z.string().optional(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().default(0),
      meta: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(cmsSections).where(eq(cmsSections.key, input.key)).limit(1);
      if (existing[0]) {
        await db.update(cmsSections).set(input).where(eq(cmsSections.key, input.key));
      } else {
        await db.insert(cmsSections).values(input);
      }
      return db.select().from(cmsSections).where(eq(cmsSections.key, input.key)).limit(1);
    }),

  delete: adminQuery
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      await getDb().delete(cmsSections).where(eq(cmsSections.key, input.key));
      return { success: true };
    }),
});

// ── Site Settings ──
const siteSettingsRouter = createRouter({
  get: publicQuery.query(async () => {
    const rows = await getDb().select().from(siteSettings);
    return Object.fromEntries(rows.map(r => [r.key, r.value]));
  }),

  set: adminQuery
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, input.key)).limit(1);
      if (existing[0]) {
        await db.update(siteSettings).set({ value: input.value }).where(eq(siteSettings.key, input.key));
      } else {
        await db.insert(siteSettings).values(input);
      }
      return { key: input.key, value: input.value };
    }),

  setBulk: adminQuery
    .input(z.array(z.object({ key: z.string(), value: z.string() })))
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const { key, value } of input) {
        const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
        if (existing[0]) {
          await db.update(siteSettings).set({ value }).where(eq(siteSettings.key, key));
        } else {
          await db.insert(siteSettings).values({ key, value });
        }
      }
      return { saved: input.length };
    }),
});

// ── FAQs ──
const faqRouter = createRouter({
  list: publicQuery.query(async () => {
    return getDb().select().from(faqs).orderBy(faqs.sortOrder);
  }),

  create: adminQuery
    .input(z.object({
      question: z.string(), questionAr: z.string(),
      answer: z.string(), answerAr: z.string(),
      category: z.string().optional(), sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(faqs).values(input).$returningId();
      return db.select().from(faqs).where(eq(faqs.id, result.id)).limit(1);
    }),

  update: adminQuery
    .input(z.object({ id: z.number(), data: z.record(z.any()) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(faqs).set(input.data).where(eq(faqs.id, input.id));
      return db.select().from(faqs).where(eq(faqs.id, input.id)).limit(1);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(faqs).where(eq(faqs.id, input.id));
      return { success: true };
    }),
});

// ── Promo Codes ──
const promoRouter = createRouter({
  list: adminQuery.query(async () => {
    return getDb().select().from(promoCodes).orderBy(desc(promoCodes.createdAt));
  }),

  create: adminQuery
    .input(z.object({
      code: z.string(), discountType: z.string(), discountValue: z.number(),
      minOrderAmount: z.number().default(0), maxDiscount: z.number().optional(),
      validFrom: z.string().optional(), validUntil: z.string().optional(),
      usageLimit: z.number().optional(), isActive: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(promoCodes).values(input).$returningId();
      return db.select().from(promoCodes).where(eq(promoCodes.id, result.id)).limit(1);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(promoCodes).where(eq(promoCodes.id, input.id));
      return { success: true };
    }),
});

// ── Audit Logs ──
const auditRouter = createRouter({
  list: adminQuery
    .input(z.object({ limit: z.number().default(100) }).optional())
    .query(async ({ input }) => {
      return getDb().select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(input?.limit ?? 100);
    }),

  create: adminQuery
    .input(z.object({
      action: z.string(), entity: z.string(),
      entityId: z.number().optional(), details: z.string().optional(),
      user: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(auditLogs).values(input).$returningId();
      return db.select().from(auditLogs).where(eq(auditLogs.id, result.id)).limit(1);
    }),
});

// ── Inventory Movements ──
const inventoryRouter = createRouter({
  list: adminQuery
    .input(z.object({ productId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.productId) {
        return db.select().from(inventoryMovements)
          .where(eq(inventoryMovements.productId, input.productId))
          .orderBy(desc(inventoryMovements.createdAt));
      }
      return db.select().from(inventoryMovements).orderBy(desc(inventoryMovements.createdAt)).limit(200);
    }),

  create: adminQuery
    .input(z.object({
      productId: z.number(), movementType: z.string(),
      quantity: z.number(), reason: z.string().optional(),
      reference: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(inventoryMovements).values(input).$returningId();

      // Also update the product stock
      if (input.movementType === "in") {
        await db.update(products)
          .set({ stockQuantity: sql`${products.stockQuantity} + ${input.quantity}` })
          .where(eq(products.id, input.productId));
      } else if (input.movementType === "out" || input.movementType === "adjustment") {
        await db.update(products)
          .set({ stockQuantity: sql`${products.stockQuantity} - ${input.quantity}` })
          .where(eq(products.id, input.productId));
      }

      return db.select().from(inventoryMovements).where(eq(inventoryMovements.id, result.id)).limit(1);
    }),
});

// ── Wishlist ──
const wishlistRouter = createRouter({
  get: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      return getDb().select().from(wishlistItems).where(eq(wishlistItems.sessionId, input.sessionId));
    }),

  add: publicQuery
    .input(z.object({ sessionId: z.string(), productId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(wishlistItems)
        .where(and(eq(wishlistItems.sessionId, input.sessionId), eq(wishlistItems.productId, input.productId)))
        .limit(1);
      if (existing[0]) return existing[0];
      const [result] = await db.insert(wishlistItems).values(input).$returningId();
      return db.select().from(wishlistItems).where(eq(wishlistItems.id, result.id)).limit(1);
    }),

  remove: publicQuery
    .input(z.object({ sessionId: z.string(), productId: z.number() }))
    .mutation(async ({ input }) => {
      await getDb().delete(wishlistItems)
        .where(and(eq(wishlistItems.sessionId, input.sessionId), eq(wishlistItems.productId, input.productId)));
      return { success: true };
    }),
});

// ── Stats (Admin Dashboard) ──
const statsRouter = createRouter({
  summary: adminQuery.query(async () => {
    const db = getDb();
    const [orderCount] = await db.select({ count: count() }).from(orders);
    const [productCount] = await db.select({ count: count() }).from(products);
    const [customerCount] = await db.select({ count: count() }).from(customers);
    const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);
    return {
      totalOrders: orderCount.count,
      totalProducts: productCount.count,
      totalCustomers: customerCount.count,
      recentOrders,
    };
  }),
});

// ── Root Router ──
export const appRouter = createRouter({
  products: productRouter,
  categories: categoryRouter,
  orders: orderRouter,
  customers: customerRouter,
  media: mediaRouter,
  cms: cmsRouter,
  siteSettings: siteSettingsRouter,
  faqs: faqRouter,
  promos: promoRouter,
  audit: auditRouter,
  inventory: inventoryRouter,
  wishlist: wishlistRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
