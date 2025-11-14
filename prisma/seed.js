const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // 1. Create test vendor user
    console.log("📝 Creating vendor user...");
    const vendorUser = await prisma.user.upsert({
      where: { email: "vendor@extremelifeherbal.com" },
      update: {},
      create: {
        email: "vendor@extremelifeherbal.com",
        phone: "+639123456789",
        passwordHash: await bcrypt.hash("password123", 10),
        role: "SELLER",
        status: "ACTIVE",
        emailVerified: true,
        phoneVerified: true,
        profile: {
          create: {
            firstName: "Extreme",
            lastName: "Vendor",
            gender: "OTHER",
          },
        },
      },
    });

    // 2. Create vendor store
    console.log("🏪 Creating vendor store...");
    const vendor = await prisma.vendor.upsert({
      where: { userId: vendorUser.id },
      update: {},
      create: {
        userId: vendorUser.id,
        storeName: "Extreme Life Herbal",
        storeSlug: "extreme-life-herbal",
        description: "Premium herbal products for your health and wellness",
        status: "APPROVED",
        profile: {
          create: {
            businessType: "INDIVIDUAL",
            businessName: "Extreme Life Herbal",
            tin: "123456789",
          },
        },
      },
    });

    // 3. Create product categories
    console.log("📂 Creating product categories...");
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: "herbal-tea" },
        update: {},
        create: {
          name: "Herbal Tea",
          slug: "herbal-tea",
          description: "Premium herbal tea blends",
          imageUrl: "https://via.placeholder.com/300x300?text=Herbal+Tea",
        },
      }),
      prisma.category.upsert({
        where: { slug: "supplements" },
        update: {},
        create: {
          name: "Supplements",
          slug: "supplements",
          description: "Natural vitamin and mineral supplements",
          imageUrl: "https://via.placeholder.com/300x300?text=Supplements",
        },
      }),
      prisma.category.upsert({
        where: { slug: "oils" },
        update: {},
        create: {
          name: "Herbal Oils",
          slug: "oils",
          description: "Pure herbal oil extracts",
          imageUrl: "https://via.placeholder.com/300x300?text=Herbal+Oils",
        },
      }),
    ]);

    // 4. Create sample products
    console.log("🛍️ Creating sample products...");
    const products = [
      {
        name: "Premium Herbal Tea Blend",
        slug: "premium-herbal-tea-blend",
        description: "Organic herbal tea blend with natural ingredients",
        price: 1999,
        category: categories[0],
      },
      {
        name: "Natural Vitamin Supplement",
        slug: "natural-vitamin-supplement",
        description: "Complete vitamin and mineral complex",
        price: 2999,
        category: categories[1],
      },
      {
        name: "Pure Herbal Oil Extract",
        slug: "pure-herbal-oil-extract",
        description: "100% pure herbal oil for wellness",
        price: 3999,
        category: categories[2],
      },
      {
        name: "Ginger Turmeric Tea",
        slug: "ginger-turmeric-tea",
        description: "Anti-inflammatory herbal tea",
        price: 1599,
        category: categories[0],
      },
      {
        name: "Immune Boost Supplement",
        slug: "immune-boost-supplement",
        description: "Strengthen your immune system naturally",
        price: 2499,
        category: categories[1],
      },
      {
        name: "Lavender Essential Oil",
        slug: "lavender-essential-oil",
        description: "Relaxing lavender oil for aromatherapy",
        price: 1299,
        category: categories[2],
      },
      {
        name: "Chamomile Sleep Tea",
        slug: "chamomile-sleep-tea",
        description: "Calming tea for better sleep",
        price: 1799,
        category: categories[0],
      },
      {
        name: "Calcium & Magnesium",
        slug: "calcium-magnesium",
        description: "Bone health supplement",
        price: 2199,
        category: categories[1],
      },
      {
        name: "Peppermint Oil",
        slug: "peppermint-oil",
        description: "Cooling peppermint oil for wellness",
        price: 1499,
        category: categories[2],
      },
      {
        name: "Green Tea Extract",
        slug: "green-tea-extract",
        description: "Antioxidant-rich green tea",
        price: 1899,
        category: categories[0],
      },
    ];

    for (const productData of products) {
      await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: {
          vendorId: vendor.id,
          categoryId: productData.category.id,
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          shortDescription: productData.description.substring(0, 50),
          status: "ACTIVE",
          isFeatured: Math.random() > 0.5,
          images: {
            create: {
              url: "https://via.placeholder.com/500x500?text=" + productData.name.replace(/ /g, "+"),
              altText: productData.name,
              sortOrder: 1,
            },
          },
          variants: {
            create: {
              name: "Default",
              sku: `SKU-${productData.slug.toUpperCase()}`,
              price: productData.price,
              stockQuantity: Math.floor(Math.random() * 100) + 10,
            },
          },
        },
      });
    }

    console.log("✅ Database seed completed successfully!");
    console.log(`✅ Created ${products.length} products`);
    console.log(`✅ Created ${categories.length} categories`);
    console.log(`✅ Created 1 vendor store`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

