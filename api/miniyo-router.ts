import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  products, productImages, categories, orders, orderItems,
  customers, mediaAssets, cmsSections, siteSettings, auditLogs, emailQueue,
  faqs, promoCodes, wishlistItems, inventoryMovements,
} from "@db/schema";
import { eq, desc, and, sql, count } from "drizzle-orm";
import { env } from "./lib/env";
import { buildOrderNotificationHtml } from "./lib/mailer";

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

      if (input.items.length > 0) {
        await db.insert(orderItems).values(
          input.items.map(item => ({
            orderId,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: String(item.unitPrice),
            lineTotal: String(item.unitPrice * item.quantity),
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

      // Queue notification emails to all staff recipients
      const recipients = env.notifyEmails;
      const htmlBody = buildOrderNotificationHtml({
        orderNumber: input.orderNumber,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        grandTotal: input.grandTotal,
        paymentMethod: input.paymentMethod,
        items: input.items.map(i => ({ productName: i.productName, quantity: i.quantity, unitPrice: i.unitPrice })),
        shippingAddress: input.shippingAddress as Record<string, string> | undefined,
      });

      for (const recipient of recipients) {
        await db.insert(emailQueue).values({
          recipient,
          subject: `🛍️ New Order: ${input.orderNumber} — ${input.customerName} — $${input.grandTotal}`,
          body: `New order ${input.orderNumber} from ${input.customerName}\nPhone: ${input.customerPhone}\nTotal: $${input.grandTotal}\nPayment: ${input.paymentMethod}\n\nView: https://miniyo.store/#/admin`,
          template: "order_notification",
        });
      }

      // Also queue confirmation email to customer if email provided
      if (input.customerEmail) {
        await db.insert(emailQueue).values({
          recipient: input.customerEmail,
          subject: `✅ Your Miniyo order ${input.orderNumber} is confirmed!`,
          body: `Hi ${input.customerName},\n\nThank you for your order! We've received order ${input.orderNumber} and will be in touch shortly.\n\nTotal: $${input.grandTotal}\nPayment: ${input.paymentMethod}\n\nIf you have any questions, reach us on WhatsApp or at admin@miniyo.store\n\nWith love,\nThe Miniyo Team 💛`,
          template: "order_confirmation",
        });
      }

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

      if (input.email) {
        const existing = await db.select().from(customers).where(eq(customers.email, input.email)).limit(1);
        if (existing[0]) return existing[0];
      }

      const [result] = await db.insert(customers).values(input).$returningId();

      if (input.email) {
        await db.insert(emailQueue).values({
          recipient: input.email,
          subject: "Welcome to Miniyo! 💛",
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
  list: publicQuery
    .input(z.object({ key: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.key) {
        return db.select().from(cmsSections).where(eq(cmsSections.sectionKey, input.key)).limit(1);
      }
      return db.select().from(cmsSections).orderBy(cmsSections.sortOrder);
    }),

  getByKey: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return getDb().select().from(cmsSections).where(eq(cmsSections.sectionKey, input.key)).limit(1);
    }),

  update: adminQuery
    .input(z.object({
      id: z.number(),
      data: z.record(z.any()),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(cmsSections).set(input.data).where(eq(cmsSections.id, input.id));
      return db.select().from(cmsSections).where(eq(cmsSections.id, input.id)).limit(1);
    }),
});

// ── Settings ──
const settingsRouter = createRouter({
  getAll: publicQuery.query(async () => {
    return getDb().select().from(siteSettings);
  }),

  getByKey: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return getDb().select().from(siteSettings).where(eq(siteSettings.settingKey, input.key)).limit(1);
    }),

  set: adminQuery
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(siteSettings)
        .values({ settingKey: input.key, settingValue: input.value })
        .onDuplicateKeyUpdate({ set: { settingValue: input.value } });
      return db.select().from(siteSettings).where(eq(siteSettings.settingKey, input.key)).limit(1);
    }),

  setMany: adminQuery
    .input(z.record(z.string()))
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const [key, value] of Object.entries(input)) {
        await db.insert(siteSettings)
          .values({ settingKey: key, settingValue: value })
          .onDuplicateKeyUpdate({ set: { settingValue: value } });
      }
      return db.select().from(siteSettings);
    }),
});

// ── Audit Logs ──
const auditRouter = createRouter({
  list: adminQuery
    .input(z.object({
      entity: z.string().optional(),
      limit: z.number().default(100),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));
      if (input?.entity) {
        query = query.where(eq(auditLogs.entity, input.entity)) as typeof query;
      }
      return query.limit(input?.limit || 100);
    }),

  create: adminQuery
    .input(z.object({
      action: z.string(),
      entity: z.string(),
      entityId: z.string(),
      details: z.string().optional(),
      userName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(auditLogs).values(input).$returningId();
      return db.select().from(auditLogs).where(eq(auditLogs.id, result.id)).limit(1);
    }),
});

// ── Dashboard Stats ──
const statsRouter = createRouter({
  get: adminQuery.query(async () => {
    const db = getDb();
    const [productCount] = await db.select({ count: count() }).from(products);
    const [activeProducts] = await db.select({ count: count() }).from(products).where(eq(products.isActive, true));
    const [orderCount] = await db.select({ count: count() }).from(orders);
    const [customerCount] = await db.select({ count: count() }).from(customers);
    const [pendingWA] = await db.select({ count: count() }).from(orders).where(
      and(eq(orders.orderStatus, "pending_confirmation"), eq(orders.whatsappConfirmed, false))
    );
    const [pendingWish] = await db.select({ count: count() }).from(orders).where(eq(orders.orderStatus, "payment_pending_whish"));
    const [lowStock] = await db.select({ count: count() }).from(products).where(
      sql`${products.stockQuantity} <= 5 AND ${products.stockQuantity} > 0`
    );

    return {
      totalProducts: productCount.count,
      activeProducts: activeProducts.count,
      totalOrders: orderCount.count,
      totalCustomers: customerCount.count,
      pendingWA: pendingWA.count,
      pendingWish: pendingWish.count,
      lowStock: lowStock.count,
    };
  }),
});

// ── Email Queue ──
const emailRouter = createRouter({
  queue: adminQuery.query(async () => {
    return getDb().select().from(emailQueue).orderBy(desc(emailQueue.createdAt)).limit(200);
  }),

  sendOrderNotification: publicQuery
    .input(z.object({
      orderNumber: z.string(),
      customerName: z.string(),
      customerPhone: z.string(),
      grandTotal: z.number(),
      paymentMethod: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const recipients = env.notifyEmails;
      for (const recipient of recipients) {
        await db.insert(emailQueue).values({
          recipient,
          subject: `🛍️ New Order: ${input.orderNumber}`,
          body: `A new order has been placed:\n\nOrder: ${input.orderNumber}\nCustomer: ${input.customerName}\nPhone: ${input.customerPhone}\nTotal: $${input.grandTotal}\nPayment: ${input.paymentMethod}`,
          template: "order_notification",
        });
      }
      return { success: true };
    }),

  sendWelcome: publicQuery
    .input(z.object({ email: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(emailQueue).values({
        recipient: input.email,
        subject: "Welcome to Miniyo! 💛",
        body: `Hi ${input.name},\n\nWelcome to Miniyo! We're so excited to have you join our family of happy parents across Lebanon.\n\nShop our curated collection: https://miniyo.store\n\nWith love,\nThe Miniyo Team`,
        template: "welcome",
      });
      return { success: true };
    }),
});

// ── FAQ ──
const faqRouter = createRouter({
  list: publicQuery
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.category) {
        return db.select().from(faqs)
          .where(eq(faqs.category, input.category))
          .orderBy(faqs.sortOrder);
      }
      return db.select().from(faqs).orderBy(faqs.sortOrder);
    }),
});

// ── Wishlist ──
const wishlistRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    const db = getDb();
    return db.select().from(wishlistItems)
      .where(eq(wishlistItems.userId, ctx.user.id))
      .orderBy(desc(wishlistItems.createdAt));
  }),

  add: publicQuery
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Login required");
      const db = getDb();
      await db.insert(wishlistItems).values({
        userId: ctx.user.id,
        productId: input.productId,
      }).onDuplicateKeyUpdate({ set: {} });
      return { success: true };
    }),

  remove: publicQuery
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Login required");
      const db = getDb();
      await db.delete(wishlistItems)
        .where(and(
          eq(wishlistItems.userId, ctx.user.id),
          eq(wishlistItems.productId, input.productId)
        ));
      return { success: true };
    }),
});

// ── Promo Code ──
const promoRouter = createRouter({
  validate: publicQuery
    .input(z.object({ code: z.string(), orderTotal: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const code = await db.select().from(promoCodes)
        .where(eq(promoCodes.code, input.code.toUpperCase()))
        .limit(1);
      if (!code[0]) return { valid: false, reason: "Invalid code" };

      const promo = code[0];
      if (!promo.isActive) return { valid: false, reason: "Code is inactive" };
      if (new Date() > promo.validUntil) return { valid: false, reason: "Code expired" };
      if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
        return { valid: false, reason: "Usage limit reached" };
      }
      if (input.orderTotal && Number(promo.minOrderAmount) > 0 && input.orderTotal < Number(promo.minOrderAmount)) {
        return { valid: false, reason: `Minimum order $${promo.minOrderAmount} required` };
      }

      return {
        valid: true,
        name: promo.name,
        type: promo.type,
        value: Number(promo.value),
        maxDiscount: promo.maxDiscount ? Number(promo.maxDiscount) : undefined,
      };
    }),
});

// ── Inventory ──
const inventoryRouter = createRouter({
  movements: adminQuery
    .input(z.object({ productId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.productId) {
        return db.select().from(inventoryMovements)
          .where(eq(inventoryMovements.productId, input.productId))
          .orderBy(desc(inventoryMovements.createdAt));
      }
      return db.select().from(inventoryMovements).orderBy(desc(inventoryMovements.createdAt));
    }),

  adjust: adminQuery
    .input(z.object({
      productId: z.number(),
      quantity: z.number(),
      reason: z.string(),
      type: z.enum(["restock", "adjustment"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const product = await db.select().from(products)
        .where(eq(products.id, input.productId))
        .limit(1);
      if (!product[0]) throw new Error("Product not found");

      const previousStock = product[0].stockQuantity;
      const newStock = Math.max(0, previousStock + input.quantity);

      await db.update(products)
        .set({ stockQuantity: newStock })
        .where(eq(products.id, input.productId));

      await db.insert(inventoryMovements).values({
        productId: input.productId,
        type: input.type,
        quantity: input.quantity,
        previousStock,
        newStock,
        reason: input.reason,
      });

      return { previousStock, newStock };
    }),
});

// ── Combined Miniyo Router ──
export const miniyoRouter = createRouter({
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
  customer: customerRouter,
  media: mediaRouter,
  cms: cmsRouter,
  settings: settingsRouter,
  audit: auditRouter,
  stats: statsRouter,
  email: emailRouter,
  faq: faqRouter,
  wishlist: wishlistRouter,
  promo: promoRouter,
  inventory: inventoryRouter,
});
