const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Creating test accounts...");

  try {
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

    console.log("\n✅ Test accounts created successfully!");
    console.log("\n📋 TEST ACCOUNTS:");
    console.log("   Admin:  admin@test.com / Admin123!");
    console.log("   Buyer:  buyer@test.com / Buyer123!");
    console.log("   Seller: seller@test.com / Seller123!");
  } catch (error) {
    console.error("❌ Error creating test accounts:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

