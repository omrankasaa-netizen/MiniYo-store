/**
 * useAdminPermissions
 * -------------------
 * Returns a set of boolean permission flags derived from the current admin's role.
 *
 * Role capabilities:
 *   super_admin  — full access (all flags true)
 *   admin        — can manage orders + products (edit/update), but NO delete, NO settings
 *   staff        — order status updates + product stock only, NO create/delete/settings
 *
 * Usage:
 *   const { canDelete, canEditSettings, canCreateProducts } = useAdminPermissions()
 */

import { useMemo } from 'react'
import { trpc } from '@/lib/trpc'

export type AdminRole = 'super_admin' | 'admin' | 'staff'

export interface AdminPermissions {
  role: AdminRole
  /** Can delete any entity (products, categories, orders…) */
  canDelete: boolean
  /** Can access & save Settings tabs */
  canEditSettings: boolean
  /** Can create new products */
  canCreateProducts: boolean
  /** Can edit product details (price, description, images…) */
  canEditProducts: boolean
  /** Can update product stock */
  canUpdateStock: boolean
  /** Can update order status */
  canUpdateOrders: boolean
  /** Can create new staff members */
  canManageStaff: boolean
}

const PERMISSIONS: Record<AdminRole, Omit<AdminPermissions, 'role'>> = {
  super_admin: {
    canDelete: true,
    canEditSettings: true,
    canCreateProducts: true,
    canEditProducts: true,
    canUpdateStock: true,
    canUpdateOrders: true,
    canManageStaff: true,
  },
  admin: {
    canDelete: false,
    canEditSettings: false,
    canCreateProducts: true,
    canEditProducts: true,
    canUpdateStock: true,
    canUpdateOrders: true,
    canManageStaff: false,
  },
  staff: {
    canDelete: false,
    canEditSettings: false,
    canCreateProducts: false,
    canEditProducts: false,
    canUpdateStock: true,
    canUpdateOrders: true,
    canManageStaff: false,
  },
}

export function useAdminPermissions(): AdminPermissions {
  const { data: me } = trpc.adminAuth.me.useQuery()
  return useMemo(() => {
    const role: AdminRole = (me?.role as AdminRole) ?? 'super_admin'
    return { role, ...PERMISSIONS[role] }
  }, [me?.role])
}
