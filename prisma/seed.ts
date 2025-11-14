import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // 0. Create test accounts for UI testing
    console.log("👤 Creating test accounts for UI testing...");

    // Admin test account
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@test.com" },
      update: {},
      create: {
        email: "admin@test.com",
        phone: "+639000000001",
        passwordHash: await bcrypt.hash("Admin123!", 10),
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: true,
        phoneVerified: true,
        profile: {
          create: {
            firstName: "Admin",
            lastName: "User",
            gender: "OTHER",
          },
        },
      },
    });
    console.log("✅ Admin account created: admin@test.com / Admin123!");

    // Buyer test account
    const buyerUser = await prisma.user.upsert({
      where: { email: "buyer@test.com" },
      update: {},
      create: {
        email: "buyer@test.com",
        phone: "+639000000002",
        passwordHash: await bcrypt.hash("Buyer123!", 10),
        role: "BUYER",
        status: "ACTIVE",
        emailVerified: true,
        phoneVerified: true,
        profile: {
          create: {
            firstName: "Buyer",
            lastName: "User",
            gender: "OTHER",
          },
        },
      },
    });
    console.log("✅ Buyer account created: buyer@test.com / Buyer123!");

    // Seller test account
    const sellerUser = await prisma.user.upsert({
      where: { email: "seller@test.com" },
      update: {},
      create: {
        email: "seller@test.com",
        phone: "+639000000003",
        passwordHash: await bcrypt.hash("Seller123!", 10),
        role: "SELLER",
        status: "ACTIVE",
        emailVerified: true,
        phoneVerified: true,
        profile: {
          create: {
            firstName: "Seller",
            lastName: "User",
            gender: "OTHER",
          },
        },
      },
    });
    console.log("✅ Seller account created: seller@test.com / Seller123!");

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

    // 5. Create sample addresses for buyer test account
    console.log("📍 Creating sample addresses for buyer...");
    await prisma.address.upsert({
      where: { id: `buyer-address-1` },
      update: {},
      create: {
        id: `buyer-address-1`,
        userId: buyerUser.id,
        type: "SHIPPING",
        recipientName: "Test Buyer",
        phone: "09123456789",
        region: "NCR",
        province: "Metro Manila",
        cityMunicipality: "Manila",
        barangay: "Barangay 1",
        streetAddress: "123 Main Street",
        postalCode: "1000",
        isDefault: true,
      },
    });
    console.log("✅ Sample address created for buyer");

    // 6. Create vendor store for seller test account
    console.log("🏪 Creating vendor store for seller...");
    const sellerVendor = await prisma.vendor.upsert({
      where: { userId: sellerUser.id },
      update: {},
      create: {
        userId: sellerUser.id,
        storeName: "Test Seller Store",
        storeSlug: "test-seller-store",
        description: "Test seller store for UI testing",
        status: "APPROVED",
        profile: {
          create: {
            businessType: "INDIVIDUAL",
            businessName: "Test Seller Business",
            tin: "987654321",
          },
        },
      },
    });
    console.log("✅ Vendor store created for seller");

    // 7. Create sample products for seller
    console.log("🛍️ Creating sample products for seller...");
    const sellerProduct = await prisma.product.create({
      data: {
        name: "Test Seller Product",
        slug: "test-seller-product",
        description: "Sample product for seller testing",
        vendorId: sellerVendor.id,
        categoryId: categories[0].id,
        images: {
          create: {
            url: "https://via.placeholder.com/500x500?text=Test+Product",
            altText: "Test Product",
            sortOrder: 1,
          },
        },
        variants: {
          create: {
            name: "Default",
            sku: "TEST-SELLER-001",
            price: 1999,
            stockQuantity: 50,
          },
        },
      },
    });
    console.log("✅ Sample product created for seller");

    console.log("✅ Database seed completed successfully!");
    console.log(`✅ Created ${products.length} products`);
    console.log(`✅ Created ${categories.length} categories`);
    console.log(`✅ Created 2 vendor stores`);
    console.log("\n📋 TEST ACCOUNTS CREATED:");
    console.log("   Admin:  admin@test.com / Admin123!");
    console.log("   Buyer:  buyer@test.com / Buyer123!");
    console.log("   Seller: seller@test.com / Seller123!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

