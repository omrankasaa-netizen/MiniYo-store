import { relations } from "drizzle-orm";
import {
  users, products, productImages, productVariants, reviews,
  orders, orderItems, orderStatusHistory, categories, collections,
  customers, customerAddresses, wishlistItems, inventoryMovements,
} from "./schema";

// ── User Relations ──
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  wishlistItems: many(wishlistItems),
}));

// ── Category Relations ──
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// ── Collection Relations ──
export const collectionsRelations = relations(collections, ({ many }) => ({
  products: many(products),
}));

// ── Product Relations ──
export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  variants: many(productVariants),
  reviews: many(reviews),
}));

// ── Product Image Relations ──
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

// ── Product Variant Relations ──
export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
}));

// ── Review Relations ──
export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
}));

// ── Order Relations ──
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
}));

// ── Order Item Relations ──
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));

// ── Order Status History Relations ──
export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, { fields: [orderStatusHistory.orderId], references: [orders.id] }),
}));

// ── Customer Relations ──
export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(customerAddresses),
}));

// ── Customer Address Relations ──
export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
  customer: one(customers, { fields: [customerAddresses.customerId], references: [customers.id] }),
}));

// ── Wishlist Item Relations ──
export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, { fields: [wishlistItems.userId], references: [users.id] }),
}));

// ── Inventory Movement Relations ──
export const inventoryMovementsRelations = relations(inventoryMovements, ({ one }) => ({
  product: one(products, { fields: [inventoryMovements.productId], references: [products.id] }),
}));
