-- Migration 0002: Ensure email_queue and membership_activities tables exist
-- Run: npx drizzle-kit push  OR  mysql -u root -p miniyo < db/migrations/0002_email_queue_membership.sql

CREATE TABLE IF NOT EXISTS `email_queue` (
  `id` serial PRIMARY KEY NOT NULL,
  `recipient` varchar(320) NOT NULL,
  `subject` varchar(500) NOT NULL,
  `body` text NOT NULL,
  `template` varchar(50),
  `status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
  `error` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `sentAt` timestamp
);

CREATE TABLE IF NOT EXISTS `membership_activities` (
  `id` serial PRIMARY KEY NOT NULL,
  `customerId` bigint unsigned NOT NULL,
  `action` enum('register','upgrade','discount_applied','free_shipping_used','order_placed','login') NOT NULL,
  `oldTier` enum('bronze','silver','gold'),
  `newTier` enum('bronze','silver','gold'),
  `details` text,
  `amount` decimal(10,2),
  `createdAt` timestamp NOT NULL DEFAULT (now())
);

-- Index for fast customer activity lookups
CREATE INDEX IF NOT EXISTS `membership_activities_customerId_idx`
  ON `membership_activities` (`customerId`);

-- Index for email queue processing
CREATE INDEX IF NOT EXISTS `email_queue_status_idx`
  ON `email_queue` (`status`);
