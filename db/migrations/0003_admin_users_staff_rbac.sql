-- Migration: add name, role, isActive to admin_users table
-- Safe to run multiple times (uses IF NOT EXISTS / ALTER IGNORE)

ALTER TABLE `admin_users`
  ADD COLUMN IF NOT EXISTS `name` varchar(255) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS `role` enum('super_admin','admin','staff') NOT NULL DEFAULT 'staff',
  ADD COLUMN IF NOT EXISTS `isActive` boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
