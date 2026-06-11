/**
 * useOrderNotification.ts
 * ------------------------
 * React hook — call triggerOrderNotification(order) immediately after a
 * successful order submission to notify staff by email and/or WhatsApp.
 *
 * Usage in CheckoutPage (or wherever you call adminStore.addOrder):
 *
 *   import { useOrderNotification } from '@/hooks/useOrderNotification'
 *   const { triggerOrderNotification } = useOrderNotification()
 *
 *   // Inside handlePlaceOrder, after adminStore.addOrder(newOrder):
 *   triggerOrderNotification(newOrder)
 */

import { useCallback } from 'react'
import {
  sendOrderNotification,
  DEFAULT_NOTIFICATION_SETTINGS,
  type OrderNotificationPayload,
} from '@/lib/orderNotification'
import { useAdminStore } from '@/stores/adminStore'

export function useOrderNotification() {
  const adminStore = useAdminStore()

  const triggerOrderNotification = useCallback(
    async (order: OrderNotificationPayload) => {
      try {
        // Read settings from adminStore if available, otherwise use defaults
        const settings =
          (adminStore as any).notificationSettings ?? DEFAULT_NOTIFICATION_SETTINGS
        await sendOrderNotification(order, settings)
      } catch (err) {
        // Non-fatal — order was placed successfully; notification failure
        // should not block the customer or show an error.
        console.warn('[Miniyo] Order notification failed (non-fatal):', err)
      }
    },
    [adminStore]
  )

  return { triggerOrderNotification }
}
