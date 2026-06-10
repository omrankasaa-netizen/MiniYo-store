import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  boolean,
  mysqlEnum,
  bigint,
  json,
  index,
} from "drizzle-orm/mysql-core";

// ── Users (Local auth + OAuth) ──
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  phone: varchar("phone", { length: 50 }),
  role: mysqlEnum("role", ["customer", "staff", "admin", "super_admin"]).default("customer").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Categories ──
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  description: text("description"),
  descriptionAr: text("descriptionAr"),
  image: text("image"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;

// ── Collections ──
export const collections = mysqlTable("collections", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  description: text("description"),
  descriptionAr: text("descriptionAr"),
  image: text("image"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Collection = typeof collections.$inferSelect;

// ── Products ──
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  sku: varchar("sku", { length: 100 }).notNull(),
  name: varchar("name", { length: 500 }).notNull(),
  nameAr: varchar("nameAr", { length: 500 }).notNull(),
  description: text("description"),
  descriptionAr: text("descriptionAr"),
  shortDescription: text("shortDescription"),
  shortDescriptionAr: text("shortDescriptionAr"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compareAtPrice", { precision: 10, scale: 2 }),
  stockQuantity: int("stockQuantity").default(0).notNull(),
  reservedQuantity: int("reservedQuantity").default(0).notNull(),
  categoryId: bigint("categoryId", { mode: "number", unsigned: true }),
  categorySlug: varchar("categorySlug", { length: 100 }),
  categoryName: varchar("categoryName", { length: 255 }),
  categoryNameAr: varchar("categoryNameAr", { length: 255 }),
  collectionId: bigint("collectionId", { mode: "number", unsigned: true }),
  gender: mysqlEnum("gender", ["boy", "girl", "unisex"]).default("unisex"),
  ageGroup: varchar("ageGroup", { length: 100 }),
  material: varchar("material", { length: 255 }),
  careInstructions: text("careInstructions"),
  weight: decimal("weight", { precision: 6, scale: 2 }),
  dimensions: varchar("dimensions", { length: 100 }),
  tags: text("tags"),
  colors: json("colors"),
  sizes: json("sizes"),
  isActive: boolean("isActive").default(true).notNull(),
  isNew: boolean("isNew").default(false).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isBestseller: boolean("isBestseller").default(false).notNull(),
  imageUrl: text("imageUrl"),
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoTitleAr: varchar("seoTitleAr", { length: 255 }),
  seoDescription: text("seoDescription"),
  seoDescriptionAr: text("seoDescriptionAr"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ── Product Images ──
export const productImages = mysqlTable("product_images", {
  id: serial("id").primaryKey(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 255 }),
  altAr: varchar("altAr", { length: 255 }),
  isPrimary: boolean("isPrimary").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductImage = typeof productImages.$inferSelect;

// ── Product Variants ──
export const productVariants = mysqlTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }),
  qtyOnHand: int("qtyOnHand").default(0).notNull(),
  qtyReserved: int("qtyReserved").default(0).notNull(),
  option1: varchar("option1", { length: 100 }),
  option2: varchar("option2", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductVariant = typeof productVariants.$inferSelect;

// ── Reviews ──
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  rating: int("rating").notNull(),
  title: varchar("title", { length: 255 }),
  body: text("body").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;

// ── Orders ──
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 50 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountTotal: decimal("discountTotal", { precision: 10, scale: 2 }).default("0").notNull(),
  discountReason: varchar("discountReason", { length: 255 }),
  deliveryFee: decimal("deliveryFee", { precision: 10, scale: 2 }).default("0").notNull(),
  grandTotal: decimal("grandTotal", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cod", "wish", "card"]).default("cod").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "verified", "failed", "refunded"]).default("pending").notNull(),
  orderStatus: mysqlEnum("orderStatus", [
    "draft",
    "pending_confirmation",
    "payment_pending_whish",
    "confirmed",
    "packed",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "refunded",
  ]).default("pending_confirmation").notNull(),
  whatsappConfirmed: boolean("whatsappConfirmed").default(false).notNull(),
  whatsappConfirmedAt: timestamp("whatsappConfirmedAt"),
  whatsappConfirmedBy: varchar("whatsappConfirmedBy", { length: 255 }),
  paymentVerifiedAt: timestamp("paymentVerifiedAt"),
  paymentVerifiedBy: varchar("paymentVerifiedBy", { length: 255 }),
  shippingAddress: json("shippingAddress"),
  internalNotes: text("internalNotes"),
  customerNotes: text("customerNotes"),
  promoCode: varchar("promoCode", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Order = typeof orders.$inferSelect;

// ── Order Items ──
export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  productName: varchar("productName", { length: 500 }).notNull(),
  productNameAr: varchar("productNameAr", { length: 500 }),
  variantName: varchar("variantName", { length: 200 }),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  lineTotal: decimal("lineTotal", { precision: 10, scale: 2 }).notNull(),
  sku: varchar("sku", { length: 100 }),
  color: varchar("color", { length: 100 }),
  size: varchar("size", { length: 100 }),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;

// ── Order Status History ──
export const orderStatusHistory = mysqlTable("order_status_history", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  note: text("note"),
  changedBy: varchar("changedBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;

// ── Inventory Movements ──
export const inventoryMovements = mysqlTable("inventory_movements", {
  id: serial("id").primaryKey(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  variantId: bigint("variantId", { mode: "number", unsigned: true }),
  type: mysqlEnum("type", ["sale", "restock", "adjustment", "return", "cancel"]).notNull(),
  quantity: int("quantity").notNull(),
  previousStock: int("previousStock").notNull(),
  newStock: int("newStock").notNull(),
  reason: varchar("reason", { length: 255 }),
  orderNumber: varchar("orderNumber", { length: 50 }),
  changedBy: varchar("changedBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InventoryMovement = typeof inventoryMovements.$inferSelect;

// ── Customers ──
export const customers = mysqlTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  type: mysqlEnum("type", ["registered", "guest"]).default("registered").notNull(),
  membershipTier: mysqlEnum("membershipTier", ["bronze", "silver", "gold"]).default("bronze").notNull(),
  totalOrders: int("totalOrders").default(0).notNull(),
  totalSpent: decimal("totalSpent", { precision: 10, scale: 2 }).default("0").notNull(),
  freeShippingUsed: int("freeShippingUsed").default(0).notNull(),
  freeShippingMonth: varchar("freeShippingMonth", { length: 7 }).default(""),
  firstOrderDiscountUsed: boolean("firstOrderDiscountUsed").default(false).notNull(),
  lastOrderDate: timestamp("lastOrderDate"),
  notes: text("notes"),
  tags: text("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Customer = typeof customers.$inferSelect;

// ── Customer Addresses ──
export const customerAddresses = mysqlTable("customer_addresses", {
  id: serial("id").primaryKey(),
  customerId: bigint("customerId", { mode: "number", unsigned: true }).notNull(),
  label: varchar("label", { length: 50 }).notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  city: varchar("city", { length: 100 }).notNull(),
  district: varchar("district", { length: 100 }),
  street: varchar("street", { length: 255 }).notNull(),
  building: varchar("building", { length: 50 }),
  floor: varchar("floor", { length: 20 }),
  apartment: varchar("apartment", { length: 20 }),
  landmark: varchar("landmark", { length: 255 }),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomerAddress = typeof customerAddresses.$inferSelect;

// ── Wishlist Items ──
export const wishlistItems = mysqlTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("wishlist_user_product_idx").on(table.userId, table.productId),
]);

export type WishlistItem = typeof wishlistItems.$inferSelect;

// ── Promo Codes ──
export const promoCodes = mysqlTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["percentage", "fixed_amount", "flash_sale"]).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  scope: mysqlEnum("scope", ["all", "category", "product"]).default("all").notNull(),
  minOrderAmount: decimal("minOrderAmount", { precision: 10, scale: 2 }).default("0").notNull(),
  maxDiscount: decimal("maxDiscount", { precision: 10, scale: 2 }),
  validFrom: timestamp("validFrom").notNull(),
  validUntil: timestamp("validUntil").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  usageLimit: int("usageLimit").default(0).notNull(),
  usageCount: int("usageCount").default(0).notNull(),
  autoApply: boolean("autoApply").default(false).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PromoCode = typeof promoCodes.$inferSelect;

// ── Media Assets ──
export const mediaAssets = mysqlTable("media_assets", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", ["product", "logo", "logo_transparent", "favicon", "hero", "footer", "brand_kit", "sticker", "cms"]).default("product").notNull(),
  url: text("url").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  assignedTo: varchar("assignedTo", { length: 50 }),
  altEn: varchar("altEn", { length: 255 }),
  altAr: varchar("altAr", { length: 255 }),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type MediaAsset = typeof mediaAssets.$inferSelect;

// ── CMS Sections ──
export const cmsSections = mysqlTable("cms_sections", {
  id: serial("id").primaryKey(),
  sectionKey: varchar("sectionKey", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  body: text("body"),
  bodyAr: text("bodyAr"),
  imageUrl: text("imageUrl"),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type CmsSection = typeof cmsSections.$inferSelect;

// ── FAQ ──
export const faqs = mysqlTable("faqs", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 500 }).notNull(),
  questionAr: varchar("questionAr", { length: 500 }).notNull(),
  answer: text("answer").notNull(),
  answerAr: text("answerAr").notNull(),
  category: varchar("category", { length: 100 }).default("general").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FAQ = typeof faqs.$inferSelect;

// ── Site Settings ──
export const siteSettings = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type SiteSetting = typeof siteSettings.$inferSelect;

// ── Audit Logs ──
export const auditLogs = mysqlTable("audit_logs", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 100 }).notNull(),
  entity: varchar("entity", { length: 100 }).notNull(),
  entityId: varchar("entityId", { length: 255 }).notNull(),
  details: text("details"),
  userName: varchar("userName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;

// ── Email Queue ──
export const emailQueue = mysqlTable("email_queue", {
  id: serial("id").primaryKey(),
  recipient: varchar("recipient", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  body: text("body").notNull(),
  template: varchar("template", { length: 50 }),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  error: text("error"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  sentAt: timestamp("sentAt"),
});

export type EmailQueue = typeof emailQueue.$inferSelect;

// ── Admin Users ──
export const adminUsers = mysqlTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  passwordSetAt: timestamp("passwordSetAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

// ── Membership Activities ──
export const membershipActivities = mysqlTable("membership_activities", {
  id: serial("id").primaryKey(),
  customerId: bigint("customerId", { mode: "number", unsigned: true }).notNull(),
  action: mysqlEnum("action", ["register", "upgrade", "discount_applied", "free_shipping_used", "order_placed", "login"]).notNull(),
  oldTier: mysqlEnum("oldTier", ["bronze", "silver", "gold"]),
  newTier: mysqlEnum("newTier", ["bronze", "silver", "gold"]),
  details: text("details"),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MembershipActivity = typeof membershipActivities.$inferSelect;
