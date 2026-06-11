-- Migration: add role, name, isActive columns to admin_users table
-- Run once against production DB. Safe to re-run (uses IF NOT EXISTS guards).

ALTER TABLE `admin_users`
  ADD COLUMN IF NOT EXISTS `name` varchar(255) NULL,
  ADD COLUMN IF NOT EXISTS `role` enum('super_admin','admin','staff') NOT NULL DEFAULT 'super_admin',
  ADD COLUMN IF NOT EXISTS `isActive` tinyint(1) NOT NULL DEFAULT 1;
