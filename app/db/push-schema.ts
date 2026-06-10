import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL!;

async function pushSchema() {
  console.log("Pushing schema to database...");
  const pool = mysql.createPool(DATABASE_URL);

  // Drop all existing tables in correct order (foreign keys)
  const dropTables = [
    "DROP TABLE IF EXISTS admin_users",
    "DROP TABLE IF EXISTS membership_activities",
    "DROP TABLE IF EXISTS email_queue",
    "DROP TABLE IF EXISTS audit_logs",
    "DROP TABLE IF EXISTS site_settings",
    "DROP TABLE IF EXISTS faqs",
    "DROP TABLE IF EXISTS cms_sections",
    "DROP TABLE IF EXISTS media_assets",
    "DROP TABLE IF EXISTS promo_codes",
    "DROP TABLE IF EXISTS wishlist_items",
    "DROP TABLE IF EXISTS customer_addresses",
    "DROP TABLE IF EXISTS customers",
    "DROP TABLE IF EXISTS inventory_movements",
    "DROP TABLE IF EXISTS order_status_history",
    "DROP TABLE IF EXISTS order_items",
    "DROP TABLE IF EXISTS orders",
    "DROP TABLE IF EXISTS reviews",
    "DROP TABLE IF EXISTS product_variants",
    "DROP TABLE IF EXISTS product_images",
    "DROP TABLE IF EXISTS products",
    "DROP TABLE IF EXISTS collections",
    "DROP TABLE IF EXISTS categories",
    "DROP TABLE IF EXISTS users",
  ];

  for (const drop of dropTables) {
    try {
      await pool.execute(drop);
      console.log(`  ${drop}`);
    } catch (err: any) {
      console.log(`  ${drop} - ${err.message}`);
    }
  }

  const queries = [
    // Users
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      unionId VARCHAR(255) UNIQUE,
      email VARCHAR(320) UNIQUE,
      passwordHash VARCHAR(255),
      name VARCHAR(255),
      avatar TEXT,
      phone VARCHAR(50),
      role ENUM('customer','staff','admin','super_admin') NOT NULL DEFAULT 'customer',
      isActive BOOLEAN NOT NULL DEFAULT true,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      lastSignInAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Categories
    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      nameAr VARCHAR(255) NOT NULL,
      description TEXT,
      descriptionAr TEXT,
      image TEXT,
      sortOrder INT NOT NULL DEFAULT 0,
      isActive BOOLEAN NOT NULL DEFAULT true,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Collections
    `CREATE TABLE IF NOT EXISTS collections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      nameAr VARCHAR(255) NOT NULL,
      description TEXT,
      descriptionAr TEXT,
      image TEXT,
      sortOrder INT NOT NULL DEFAULT 0,
      isActive BOOLEAN NOT NULL DEFAULT true,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Products
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(200) NOT NULL UNIQUE,
      sku VARCHAR(100) NOT NULL,
      name VARCHAR(500) NOT NULL,
      nameAr VARCHAR(500) NOT NULL,
      description TEXT,
      descriptionAr TEXT,
      shortDescription TEXT,
      shortDescriptionAr TEXT,
      price DECIMAL(10,2) NOT NULL,
      compareAtPrice DECIMAL(10,2),
      stockQuantity INT NOT NULL DEFAULT 0,
      reservedQuantity INT NOT NULL DEFAULT 0,
      categoryId INT UNSIGNED,
      categorySlug VARCHAR(100),
      categoryName VARCHAR(255),
      categoryNameAr VARCHAR(255),
      collectionId INT UNSIGNED,
      gender ENUM('boy','girl','unisex') DEFAULT 'unisex',
      ageGroup VARCHAR(100),
      material VARCHAR(255),
      careInstructions TEXT,
      weight DECIMAL(6,2),
      dimensions VARCHAR(100),
      tags TEXT,
      colors JSON,
      sizes JSON,
      isActive BOOLEAN NOT NULL DEFAULT true,
      isNew BOOLEAN NOT NULL DEFAULT false,
      isFeatured BOOLEAN NOT NULL DEFAULT false,
      isBestseller BOOLEAN NOT NULL DEFAULT false,
      imageUrl TEXT,
      seoTitle VARCHAR(255),
      seoTitleAr VARCHAR(255),
      seoDescription TEXT,
      seoDescriptionAr TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_category_id (categoryId),
      INDEX idx_status (isActive),
      INDEX idx_slug (slug)
    )`,

    // Product Images
    `CREATE TABLE IF NOT EXISTS product_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productId INT UNSIGNED NOT NULL,
      url TEXT NOT NULL,
      alt VARCHAR(255),
      altAr VARCHAR(255),
      isPrimary BOOLEAN NOT NULL DEFAULT false,
      sortOrder INT NOT NULL DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_product_id (productId)
    )`,

    // Product Variants
    `CREATE TABLE IF NOT EXISTS product_variants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productId INT UNSIGNED NOT NULL,
      sku VARCHAR(100) NOT NULL UNIQUE,
      price DECIMAL(10,2),
      qtyOnHand INT NOT NULL DEFAULT 0,
      qtyReserved INT NOT NULL DEFAULT 0,
      option1 VARCHAR(100),
      option2 VARCHAR(100),
      isActive BOOLEAN NOT NULL DEFAULT true,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_product_id (productId)
    )`,

    // Reviews
    `CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productId INT UNSIGNED NOT NULL,
      userId INT UNSIGNED,
      customerName VARCHAR(255) NOT NULL,
      rating INT NOT NULL,
      title VARCHAR(255),
      body TEXT NOT NULL,
      isVerified BOOLEAN NOT NULL DEFAULT false,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_product_id (productId)
    )`,

    // Orders
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderNumber VARCHAR(50) NOT NULL UNIQUE,
      userId INT UNSIGNED,
      customerName VARCHAR(255) NOT NULL,
      customerEmail VARCHAR(320),
      customerPhone VARCHAR(50) NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      discountTotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      discountReason VARCHAR(255),
      deliveryFee DECIMAL(10,2) NOT NULL DEFAULT 0,
      grandTotal DECIMAL(10,2) NOT NULL,
      paymentMethod ENUM('cod','wish','card') NOT NULL DEFAULT 'cod',
      paymentStatus ENUM('pending','verified','failed','refunded') NOT NULL DEFAULT 'pending',
      orderStatus ENUM('draft','pending_confirmation','payment_pending_whish','confirmed','packed','out_for_delivery','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending_confirmation',
      whatsappConfirmed BOOLEAN NOT NULL DEFAULT false,
      whatsappConfirmedAt TIMESTAMP,
      whatsappConfirmedBy VARCHAR(255),
      paymentVerifiedAt TIMESTAMP,
      paymentVerifiedBy VARCHAR(255),
      shippingAddress JSON,
      internalNotes TEXT,
      customerNotes TEXT,
      promoCode VARCHAR(50),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (userId),
      INDEX idx_order_status (orderStatus)
    )`,

    // Order Items
    `CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderId INT UNSIGNED NOT NULL,
      productId INT UNSIGNED NOT NULL,
      productName VARCHAR(500) NOT NULL,
      productNameAr VARCHAR(500),
      variantName VARCHAR(200),
      quantity INT NOT NULL,
      unitPrice DECIMAL(10,2) NOT NULL,
      lineTotal DECIMAL(10,2) NOT NULL,
      sku VARCHAR(100),
      color VARCHAR(100),
      size VARCHAR(100),
      imageUrl TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Order Status History
    `CREATE TABLE IF NOT EXISTS order_status_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderId INT UNSIGNED NOT NULL,
      status VARCHAR(50) NOT NULL,
      note TEXT,
      changedBy VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Inventory Movements
    `CREATE TABLE IF NOT EXISTS inventory_movements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productId INT UNSIGNED NOT NULL,
      variantId INT UNSIGNED,
      type ENUM('sale','restock','adjustment','return','cancel') NOT NULL,
      quantity INT NOT NULL,
      previousStock INT NOT NULL,
      newStock INT NOT NULL,
      reason VARCHAR(255),
      orderNumber VARCHAR(50),
      changedBy VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Customers
    `CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(320) NOT NULL UNIQUE,
      phone VARCHAR(50),
      passwordHash VARCHAR(255),
      type ENUM('registered','guest') NOT NULL DEFAULT 'registered',
      membershipTier ENUM('bronze','silver','gold') NOT NULL DEFAULT 'bronze',
      totalOrders INT NOT NULL DEFAULT 0,
      totalSpent DECIMAL(10,2) NOT NULL DEFAULT 0,
      freeShippingUsed INT NOT NULL DEFAULT 0,
      freeShippingMonth VARCHAR(7) DEFAULT '',
      firstOrderDiscountUsed BOOLEAN NOT NULL DEFAULT false,
      lastOrderDate TIMESTAMP,
      notes TEXT,
      tags TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Customer Addresses
    `CREATE TABLE IF NOT EXISTS customer_addresses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customerId INT UNSIGNED NOT NULL,
      label VARCHAR(50) NOT NULL,
      fullName VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      city VARCHAR(100) NOT NULL,
      district VARCHAR(100),
      street VARCHAR(255) NOT NULL,
      building VARCHAR(50),
      floor VARCHAR(20),
      apartment VARCHAR(20),
      landmark VARCHAR(255),
      isDefault BOOLEAN NOT NULL DEFAULT false,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Wishlist Items
    `CREATE TABLE IF NOT EXISTS wishlist_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT UNSIGNED NOT NULL,
      productId INT UNSIGNED NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_wishlist (userId, productId)
    )`,

    // Promo Codes
    `CREATE TABLE IF NOT EXISTS promo_codes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      type ENUM('percentage','fixed_amount','flash_sale') NOT NULL,
      value DECIMAL(10,2) NOT NULL,
      scope ENUM('all','category','product') NOT NULL DEFAULT 'all',
      minOrderAmount DECIMAL(10,2) NOT NULL DEFAULT 0,
      maxDiscount DECIMAL(10,2),
      validFrom TIMESTAMP NOT NULL,
      validUntil TIMESTAMP NOT NULL,
      isActive BOOLEAN NOT NULL DEFAULT true,
      usageLimit INT NOT NULL DEFAULT 0,
      usageCount INT NOT NULL DEFAULT 0,
      autoApply BOOLEAN NOT NULL DEFAULT false,
      description TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Media Assets
    `CREATE TABLE IF NOT EXISTS media_assets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type ENUM('product','logo','logo_transparent','favicon','hero','footer','brand_kit','sticker','cms') NOT NULL DEFAULT 'product',
      url TEXT NOT NULL,
      name VARCHAR(255) NOT NULL,
      assignedTo VARCHAR(50),
      altEn VARCHAR(255),
      altAr VARCHAR(255),
      uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // CMS Sections
    `CREATE TABLE IF NOT EXISTS cms_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sectionKey VARCHAR(50) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      titleAr VARCHAR(255) NOT NULL,
      body TEXT,
      bodyAr TEXT,
      imageUrl TEXT,
      isActive BOOLEAN NOT NULL DEFAULT true,
      sortOrder INT NOT NULL DEFAULT 0,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // FAQ
    `CREATE TABLE IF NOT EXISTS faqs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question VARCHAR(500) NOT NULL,
      questionAr VARCHAR(500) NOT NULL,
      answer TEXT NOT NULL,
      answerAr TEXT NOT NULL,
      category VARCHAR(100) NOT NULL DEFAULT 'general',
      sortOrder INT NOT NULL DEFAULT 0,
      isActive BOOLEAN NOT NULL DEFAULT true,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Site Settings
    `CREATE TABLE IF NOT EXISTS site_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      settingKey VARCHAR(100) NOT NULL UNIQUE,
      settingValue TEXT,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Audit Logs
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      action VARCHAR(100) NOT NULL,
      entity VARCHAR(100) NOT NULL,
      entityId VARCHAR(255) NOT NULL,
      details TEXT,
      userName VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Email Queue
    `CREATE TABLE IF NOT EXISTS email_queue (
      id INT AUTO_INCREMENT PRIMARY KEY,
      recipient VARCHAR(320) NOT NULL,
      subject VARCHAR(500) NOT NULL,
      body TEXT NOT NULL,
      template VARCHAR(50),
      status ENUM('pending','sent','failed') NOT NULL DEFAULT 'pending',
      error TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sentAt TIMESTAMP
    )`,

    // Admin Users
    `CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(320) NOT NULL UNIQUE,
      passwordHash VARCHAR(255),
      passwordSetAt TIMESTAMP NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Membership Activities
    `CREATE TABLE IF NOT EXISTS membership_activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customerId INT UNSIGNED NOT NULL,
      action ENUM('register','upgrade','discount_applied','free_shipping_used','order_placed','login') NOT NULL,
      oldTier ENUM('bronze','silver','gold'),
      newTier ENUM('bronze','silver','gold'),
      details TEXT,
      amount DECIMAL(10,2),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const query of queries) {
    try {
      await pool.execute(query);
    } catch (err: any) {
      console.error(`  Failed: ${err.sqlMessage || err.message}`);
      throw err;
    }
  }

  // Seed initial admin user if none exist
  const [rows] = await pool.execute<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) AS count FROM admin_users"
  );
  const adminCount = rows[0].count as number;

  if (adminCount === 0) {
    console.log("Seeding initial admin user...");
    const passwordHash = await bcrypt.hash("Admin@12345", 12);
    await pool.execute(
      "INSERT INTO admin_users (email, passwordHash, passwordSetAt) VALUES (?, ?, NOW())",
      ["admin@miniyo.store", passwordHash]
    );
    console.log("  Admin user created: admin@miniyo.store");
  } else {
    console.log("Admin user already exists, skipping seed.");
  }

  await pool.end();
  console.log("Schema pushed successfully!");
}

pushSchema().catch((e) => {
  console.error("Schema push failed:", e);
  process.exit(1);
});
