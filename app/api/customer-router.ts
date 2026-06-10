// @ts-nocheck
import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

// Client-side customer management router
// For static deployment, this returns mock data
// When server is running, this connects to the database

export const customerRouter = createRouter({
  // Register a new customer
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        password: z.string().min(6),
      })
    )
    .mutation(({ input }) => {
      const customer = {
        id: `cust-${Date.now()}`,
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        membershipTier: "bronze" as const,
        totalOrders: 0,
        totalSpent: 0,
        freeShippingUsed: 0,
        freeShippingMonth: "",
        firstOrderDiscountUsed: false,
        createdAt: new Date().toISOString(),
      };
      return { success: true, customer };
    }),

  // Login
  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(({ input }) => {
      return { success: true, token: "mock-token" };
    }),

  // Get customer profile
  me: publicQuery.query(() => {
    return null;
  }),

  // Update profile
  updateProfile: publicQuery
    .input(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(({ input }) => {
      return { success: true };
    }),

  // Add address
  addAddress: publicQuery
    .input(
      z.object({
        label: z.string(),
        fullName: z.string(),
        phone: z.string(),
        city: z.string(),
        district: z.string().optional(),
        street: z.string(),
        building: z.string().optional(),
        floor: z.string().optional(),
        apartment: z.string().optional(),
        landmark: z.string().optional(),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => {
      const address = {
        id: `addr-${Date.now()}`,
        ...input,
        isDefault: input.isDefault || false,
        createdAt: new Date().toISOString(),
      };
      return { success: true, address };
    }),

  // Add payment method
  addPaymentMethod: publicQuery
    .input(
      z.object({
        type: z.enum(["cod", "wish"]),
        label: z.string().optional(),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => {
      const method = {
        id: `pm-${Date.now()}`,
        ...input,
        isDefault: input.isDefault || false,
        createdAt: new Date().toISOString(),
      };
      return { success: true, method };
    }),
});
