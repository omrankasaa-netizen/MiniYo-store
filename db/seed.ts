import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { hashPassword } from "../api/local-auth";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@miniyo.store";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Nimc&3477";

async function seed() {
  console.log("Connecting to database...");
  const pool = mysql.createPool(DATABASE_URL);
  const db = drizzle(pool, { schema, mode: "planetscale" });

  // ── 1. Seed Admin User ──
  console.log("Seeding admin user...");
  const existingAdmin = await db.select().from(schema.users)
    .where(eq(schema.users.email, admin@miniyo.store))
    .limit(1);

  if (existingAdmin.length === 0) {
    await db.insert(schema.users).values({
      email: admin@miniyo.store,
      passwordHash: await hashPassword(Nimc#3477),
      name: "Omran",
      phone: "+961 81 38 59 40",
      role: "super_admin",
    });
    console.log(`Admin user created: ${admin@miniyo.store} (super_admin)`);
  } else {
    console.log(`Admin user already exists: ${admin@miniyo.store}`);
  }

  // ── 2. Seed Categories ──
  console.log("Seeding categories...");
  const categoryData = [
    { slug: "bodysuits-rompers", name: "Bodysuits & Rompers", nameAr: "بدلات وأفرولات", sortOrder: 1 },
    { slug: "tops-tshirts", name: "Tops & T-Shirts", nameAr: "قمصان وتي شيرتات", sortOrder: 2 },
    { slug: "bottoms-pants", name: "Bottoms & Pants", nameAr: "سراويل وبناطيل", sortOrder: 3 },
    { slug: "outerwear-jackets", name: "Outerwear & Jackets", nameAr: "معاطف وجاكيتات", sortOrder: 4 },
    { slug: "dresses", name: "Dresses", nameAr: "فساتين", sortOrder: 5 },
    { slug: "sleepwear-pajamas", name: "Sleepwear & Pajamas", nameAr: "ملابس نوم", sortOrder: 6 },
    { slug: "sets-bundles", name: "Sets & Bundles", nameAr: "طقم وهدايا", sortOrder: 7 },
    { slug: "accessories", name: "Accessories", nameAr: "إكسسوارات", sortOrder: 8 },
  ];

  const seededCategories: schema.Category[] = [];
  for (const cat of categoryData) {
    const existing = await db.select().from(schema.categories)
      .where(eq(schema.categories.slug, cat.slug))
      .limit(1);
    if (existing.length === 0) {
      const [result] = await db.insert(schema.categories).values(cat).$returningId();
      const created = await db.select().from(schema.categories)
        .where(eq(schema.categories.id, result.id))
        .limit(1);
      seededCategories.push(created[0]);
    } else {
      seededCategories.push(existing[0]);
    }
  }
  console.log(`Seeded ${seededCategories.length} categories`);

  // ── 3. Seed Products ──
  console.log("Seeding products...");
  const productsData = [
    {
      slug: "bunny-print-bodysuit", sku: "MIN-BOD-001",
      name: "Bunny Print Bodysuit", nameAr: "بدلة بأرنب",
      description: "Soft cotton bodysuit with an adorable bunny print. Perfect for everyday wear and special occasions. Made from 100% organic cotton.",
      descriptionAr: "بدلة قطنية ناعمة بطبعة أرنب رائعة. مثالية للارتداء اليومي والمناسبات الخاصة. مصنوعة من 100٪ قطن عضوي.",
      shortDescription: "Soft cotton bodysuit with bunny print",
      shortDescriptionAr: "بدلة قطنية ناعمة بطبعة أرنب",
      price: "18.00", compareAtPrice: "24.00",
      stockQuantity: 25, gender: "girl" as const, ageGroup: "0-12M",
      categorySlug: "bodysuits-rompers", categoryName: "Bodysuits & Rompers", categoryNameAr: "بدلات وأفرولات",
      isNew: true, isFeatured: true, isBestseller: false, imageUrl: "/images/products/bunny-bodysuit.jpg",
    },
    {
      slug: "stripe-romper", sku: "MIN-ROM-002",
      name: "Stripe Romper", nameAr: "أفرول مخطط",
      description: "Classic striped romper in cream and soft brown. Features snap buttons for easy diaper changes.",
      descriptionAr: "أفرول مخطط كلاسيكي باللونين الكريمي والبني الناعم. يحتوي على أزرار سهلة لتغيير الحفاض.",
      shortDescription: "Classic striped romper with snap buttons",
      shortDescriptionAr: "أفرول مخطط كلاسيكي بأزرار",
      price: "22.00", compareAtPrice: null,
      stockQuantity: 18, gender: "unisex" as const, ageGroup: "0-24M",
      categorySlug: "bodysuits-rompers", categoryName: "Bodysuits & Rompers", categoryNameAr: "بدلات وأفرولات",
      isNew: false, isFeatured: false, isBestseller: true, imageUrl: "/images/products/stripe-romper.jpg",
    },
    {
      slug: "floral-summer-dress", sku: "MIN-DRE-003",
      name: "Floral Summer Dress", nameAr: "فستان صيفي زهري",
      description: "Beautiful floral print dress in soft pastels. Perfect for special occasions and photoshoots.",
      descriptionAr: "فستان بطبعة زهرية جميلة بألوان الباستيل الناعمة. مثالي للمناسبات الخاصة.",
      shortDescription: "Floral print dress in soft pastels",
      shortDescriptionAr: "فستان بطبعة زهرية بألوان الباستيل",
      price: "28.00", compareAtPrice: "35.00",
      stockQuantity: 12, gender: "girl" as const, ageGroup: "6-36M",
      categorySlug: "dresses", categoryName: "Dresses", categoryNameAr: "فساتين",
      isNew: true, isFeatured: true, isBestseller: false, imageUrl: "/images/products/floral-dress.jpg",
    },
    {
      slug: "dino-adventure-tee", sku: "MIN-TOP-004",
      name: "Dino Adventure Tee", nameAr: "تي شيرت ديناصور",
      description: "Fun dinosaur print t-shirt in sage green. Made from soft, breathable cotton.",
      descriptionAr: "تي شيرت بطبعة ديناصور ممتعة باللون الأخضر المريمي. مصنوع من قطن ناعم وقابل للتنفس.",
      shortDescription: "Dinosaur print tee in sage green",
      shortDescriptionAr: "تي شيرت ديناصور بالأخضر المريمي",
      price: "16.00", compareAtPrice: null,
      stockQuantity: 30, gender: "boy" as const, ageGroup: "12-48M",
      categorySlug: "tops-tshirts", categoryName: "Tops & T-Shirts", categoryNameAr: "قمصان وتي شيرتات",
      isNew: false, isFeatured: false, isBestseller: true, imageUrl: "/images/products/dino-tee.jpg",
    },
    {
      slug: "cozy-bear-gift-set", sku: "MIN-SET-005",
      name: "Cozy Bear Gift Set", nameAr: "طقم دب دافئ",
      description: "Adorable 3-piece gift set including bodysuit, pants, and bear-ear hat. Perfect for baby showers.",
      descriptionAr: "طقم هدية من 3 قطع رائع يشمل بدلة وسروال وقبعة أذنين دب. مثالي لحفلات استقبال المولود.",
      shortDescription: "3-piece gift set with bear-ear hat",
      shortDescriptionAr: "طقم هدية 3 قطع بقبعة دب",
      price: "35.00", compareAtPrice: "45.00",
      stockQuantity: 15, gender: "unisex" as const, ageGroup: "0-18M",
      categorySlug: "sets-bundles", categoryName: "Sets & Bundles", categoryNameAr: "طقم وهدايا",
      isNew: true, isFeatured: true, isBestseller: false, imageUrl: "/images/products/cozy-set.jpg",
    },
    {
      slug: "duck-rain-jacket", sku: "MIN-OUT-006",
      name: "Duck Rain Jacket", nameAr: "جاكيت مطر بطة",
      description: "Adorable yellow rain jacket with cute duck face hood. Waterproof and windproof.",
      descriptionAr: "جاكيت مطر أصفر رائع بغطاء رأس بطة. مقاوم للماء والرياح.",
      shortDescription: "Waterproof duck rain jacket",
      shortDescriptionAr: "جاكيت مطر بطة مقاوم للماء",
      price: "32.00", compareAtPrice: null,
      stockQuantity: 8, gender: "unisex" as const, ageGroup: "12-48M",
      categorySlug: "outerwear-jackets", categoryName: "Outerwear & Jackets", categoryNameAr: "معاطف وجاكيتات",
      isNew: false, isFeatured: false, isBestseller: true, imageUrl: "/images/products/rain-jacket.jpg",
    },
    {
      slug: "starlight-sleepwear", sku: "MIN-SLP-007",
      name: "Starlight Sleepwear", nameAr: "ملابس نوم نجوم",
      description: "Soft pastel pink pajama set with star and moon print. Made from cozy cotton blend.",
      descriptionAr: "طقم بيجاما وردي باستيل ناعم بطبعة نجوم وقمر. مصنوع من مزيج قطن دافئ.",
      shortDescription: "Star and moon print pajama set",
      shortDescriptionAr: "طقم بيجاما بطبعة نجوم وقمر",
      price: "20.00", compareAtPrice: "26.00",
      stockQuantity: 20, gender: "girl" as const, ageGroup: "12-48M",
      categorySlug: "sleepwear-pajamas", categoryName: "Sleepwear & Pajamas", categoryNameAr: "ملابس نوم",
      isNew: false, isFeatured: false, isBestseller: false, imageUrl: "/images/products/sleepwear.jpg",
    },
    {
      slug: "soft-knit-cardigan", sku: "MIN-OUT-008",
      name: "Soft Knit Cardigan", nameAr: "كارديجان محبوك ناعم",
      description: "Cream colored soft knit cardigan with wooden buttons. Perfect layering piece for any season.",
      descriptionAr: "كارديجان محبوك ناعم باللون الكريمي بأزرار خشبية. قطعة طبقات مثالية لأي فصل.",
      shortDescription: "Soft knit cardigan with wooden buttons",
      shortDescriptionAr: "كارديجان محبوك ناعم بأزرار خشبية",
      price: "26.00", compareAtPrice: null,
      stockQuantity: 14, gender: "unisex" as const, ageGroup: "0-48M",
      categorySlug: "outerwear-jackets", categoryName: "Outerwear & Jackets", categoryNameAr: "معاطف وجاكيتات",
      isNew: true, isFeatured: false, isBestseller: false, imageUrl: "/images/products/cardigan.jpg",
    },
    {
      slug: "denim-overalls", sku: "MIN-BOT-009",
      name: "Denim Overalls", nameAr: "أوفرول جينز",
      description: "Classic denim overalls with adjustable straps and soft lining. A timeless piece.",
      descriptionAr: "أوفرول جينز كلاسيكي بحمالات قابلة للتعديل وبطانة ناعمة. قطعة خالدة.",
      shortDescription: "Classic denim overalls with soft lining",
      shortDescriptionAr: "أوفرول جينز كلاسيكي ببطانة ناعمة",
      price: "30.00", compareAtPrice: "38.00",
      stockQuantity: 10, gender: "unisex" as const, ageGroup: "6-36M",
      categorySlug: "bottoms-pants", categoryName: "Bottoms & Pants", categoryNameAr: "سراويل وبناطيل",
      isNew: false, isFeatured: false, isBestseller: true, imageUrl: "/images/products/overalls.jpg",
    },
    {
      slug: "cute-hair-accessories", sku: "MIN-ACC-010",
      name: "Cute Hair Accessories Set", nameAr: "طقم إكسسوارات شعر",
      description: "Adorable set of soft headbands, tiny socks, and bow clips. Perfect finishing touch.",
      descriptionAr: "طقم رائع من أربطة شعر ناعمة وجوارب صغيرة ومشابك فيونكة. لمسة نهائية مثالية.",
      shortDescription: "Headbands, socks, and bow clips set",
      shortDescriptionAr: "طقم أربطة شعر وجوارب ومشابك",
      price: "14.00", compareAtPrice: null,
      stockQuantity: 35, gender: "girl" as const, ageGroup: "0-24M",
      categorySlug: "accessories", categoryName: "Accessories", categoryNameAr: "إكسسوارات",
      isNew: true, isFeatured: false, isBestseller: false, imageUrl: "/images/products/accessories.jpg",
    },
  ];

  for (const product of productsData) {
    const existing = await db.select().from(schema.products)
      .where(eq(schema.products.slug, product.slug))
      .limit(1);
    if (existing.length === 0) {
      const [result] = await db.insert(schema.products).values(product).$returningId();
      const created = await db.select().from(schema.products)
        .where(eq(schema.products.id, result.id))
        .limit(1);

      // Add primary image
      if (product.imageUrl) {
        await db.insert(schema.productImages).values({
          productId: created[0].id,
          url: product.imageUrl,
          alt: product.name,
          altAr: product.nameAr,
          isPrimary: true,
          sortOrder: 0,
        });
      }
      console.log(`  Created product: ${product.name}`);
    } else {
      console.log(`  Product exists: ${product.name}`);
    }
  }

  // ── 4. Seed Site Settings ──
  console.log("Seeding site settings...");
  const settings = [
    { settingKey: "storeName", settingValue: "Miniyo" },
    { settingKey: "storeEmail", settingValue: "miniyo.store.lb@gmail.com" },
    { settingKey: "storePhone", settingValue: "+961 81 38 59 40" },
    { settingKey: "whatsappNumber", settingValue: "+96181385940" },
    { settingKey: "currency", settingValue: "USD" },
    { settingKey: "deliveryFee", settingValue: "3" },
    { settingKey: "freeShippingThreshold", settingValue: "50" },
    { settingKey: "localeDefault", settingValue: "en" },
    { settingKey: "codEnabled", settingValue: "true" },
    { settingKey: "wishEnabled", settingValue: "true" },
    { settingKey: "address", settingValue: "Beirut, Lebanon" },
    { settingKey: "shippingRegions", settingValue: JSON.stringify([
      { name: "Beirut", nameAr: "بيروت", fee: 3 },
      { name: "Mount Lebanon", nameAr: "جبل لبنان", fee: 3 },
      { name: "North", nameAr: "الشمال", fee: 4 },
      { name: "South", nameAr: "الجنوب", fee: 4 },
      { name: "Bekaa", nameAr: "البقاع", fee: 5 },
    ]) },
  ];

  for (const setting of settings) {
    const existing = await db.select().from(schema.siteSettings)
      .where(eq(schema.siteSettings.settingKey, setting.settingKey))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(schema.siteSettings).values(setting);
    }
  }
  console.log(`Seeded ${settings.length} site settings`);

  // ── 5. Seed FAQ ──
  console.log("Seeding FAQ...");
  const faqData = [
    { question: "What sizes do you offer?", questionAr: "ما هي المقاسات المتوفرة؟", answer: "We offer sizes from 0-3 months up to 4-5 years. Each product page shows the specific size range available.", answerAr: "نقدم مقاسات من 0-3 أشهر حتى 4-5 سنوات. تظهر صفحة كل منتج نطاق المقاسات المتاح.", category: "general" },
    { question: "Do you ship all over Lebanon?", questionAr: "هل تشحنون لجميع أنحاء لبنان؟", answer: "Yes! We deliver to all regions in Lebanon. Delivery typically takes 1-3 business days depending on your location.", answerAr: "نعم! نوصل لجميع المناطق في لبنان. يستغرق التوصيل عادة 1-3 أيام عمل حسب موقعك.", category: "shipping" },
    { question: "What payment methods do you accept?", questionAr: "ما هي طرق الدفع المقبولة؟", answer: "We accept Cash on Delivery (COD) and Whish money transfers. You can select your preferred method at checkout.", answerAr: "نقبل الدفع عند الاستلام وتحويلات Whish. يمكنك اختيار طريقتك المفضلة عند الدفع.", category: "payment" },
    { question: "Can I return or exchange items?", questionAr: "هل يمكنني إرجاع أو استبدال المنتجات؟", answer: "Yes, unused items in original packaging can be returned or exchanged within 14 days of delivery.", answerAr: "نعم، يمكن إرجاع أو استبدال المنتجات غير المستخدمة في عبوتها الأصلية خلال 14 يوماً من التوصيل.", category: "returns" },
    { question: "How do I track my order?", questionAr: "كيف أتتبع طلبي؟", answer: "You can track your order using your order number and phone number on our Track Order page.", answerAr: "يمكنك تتبع طلبك باستخدام رقم الطلب ورقم الهاتف في صفحة تتبع الطلب.", category: "shipping" },
  ];

  for (const faq of faqData) {
    const existing = await db.select().from(schema.faqs)
      .where(eq(schema.faqs.question, faq.question))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(schema.faqs).values(faq);
    }
  }
  console.log(`Seeded ${faqData.length} FAQs`);

  // ── 6. Seed Promo Code ──
  console.log("Seeding promo codes...");
  const existingPromo = await db.select().from(schema.promoCodes)
    .where(eq(schema.promoCodes.code, "WELCOME15"))
    .limit(1);
  if (existingPromo.length === 0) {
    await db.insert(schema.promoCodes).values({
      code: "WELCOME15",
      name: "Welcome 15% Off",
      type: "percentage",
      value: "15.00",
      scope: "all",
      minOrderAmount: "0",
      validFrom: new Date("2025-01-01"),
      validUntil: new Date("2026-12-31"),
      isActive: true,
      usageLimit: 0, // unlimited
      usageCount: 0,
      autoApply: false,
      description: "15% off your first order",
    });
    console.log("Seeded WELCOME15 promo code");
  }

  await pool.end();
  console.log("\nSeed completed successfully!");
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
