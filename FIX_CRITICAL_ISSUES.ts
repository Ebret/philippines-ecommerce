/**
 * FIX_CRITICAL_ISSUES.ts
 *
 * This script fixes critical database issues:
 * 1. Verifies admin@test.com has ADMIN role
 * 2. Creates vendor profile for seller@test.com
 * 3. Verifies buyer@test.com has BUYER role
 * 4. Ensures all test accounts are properly configured
 *
 * Run with: npx ts-node FIX_CRITICAL_ISSUES.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 FIXING CRITICAL DATABASE ISSUES\n");
  console.log("=" .repeat(50));

  try {
    // Issue 1: Verify admin@test.com
    console.log("\n📋 Issue 1: Checking admin@test.com...");
    let adminUser = await prisma.user.findUnique({
      where: { email: "admin@test.com" },
      include: { profile: true },
    });

    if (!adminUser) {
      console.log("❌ admin@test.com not found in database");
      return;
    }

    console.log(`✅ admin@test.com found`);
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Status: ${adminUser.status}`);
    console.log(`   Email Verified: ${adminUser.emailVerified}`);

    if (adminUser.role !== "ADMIN" && adminUser.role !== "SUPER_ADMIN") {
      console.log("⚠️  Updating role to ADMIN...");
      adminUser = await prisma.user.update({
        where: { email: "admin@test.com" },
        data: { role: "ADMIN" },
        include: { profile: true },
      });
      console.log("✅ Role updated to ADMIN");
    }

    // Issue 2: Create vendor profile for seller@test.com
    console.log("\n📋 Issue 2: Checking seller@test.com vendor profile...");
    let sellerUser = await prisma.user.findUnique({
      where: { email: "seller@test.com" },
      include: { vendor: true, profile: true },
    });

    if (!sellerUser) {
      console.log("❌ seller@test.com not found in database");
      return;
    }

    console.log(`✅ seller@test.com found`);
    console.log(`   ID: ${sellerUser.id}`);
    console.log(`   Role: ${sellerUser.role}`);
    console.log(`   Status: ${sellerUser.status}`);
    console.log(`   Has Vendor Profile: ${!!sellerUser.vendor}`);

    if (sellerUser.role !== "SELLER") {
      console.log("⚠️  Updating role to SELLER...");
      sellerUser = await prisma.user.update({
        where: { email: "seller@test.com" },
        data: { role: "SELLER" },
        include: { vendor: true, profile: true },
      });
      console.log("✅ Role updated to SELLER");
    }

    if (!sellerUser?.vendor) {
      console.log("⚠️  Creating vendor profile...");

      const vendor = await prisma.vendor.create({
        data: {
          userId: sellerUser.id,
          storeName: "Test Seller Store",
          storeSlug: "test-seller-store",
          description: "Test seller store for development",
          status: "APPROVED",
          commissionRate: 5.0,
          subscriptionPlan: "basic",
        },
      });

      console.log("✅ Vendor profile created");
      console.log(`   Vendor ID: ${vendor.id}`);
      console.log(`   Store Name: ${vendor.storeName}`);
      console.log(`   Store Slug: ${vendor.storeSlug}`);
      console.log(`   Status: ${vendor.status}`);
    } else {
      console.log(`✅ Vendor profile exists`);
      console.log(`   Vendor ID: ${sellerUser.vendor.id}`);
      console.log(`   Store Name: ${sellerUser.vendor.storeName}`);
      console.log(`   Status: ${sellerUser.vendor.status}`);
    }

    // Issue 3: Verify buyer@test.com
    console.log("\n📋 Issue 3: Checking buyer@test.com...");
    let buyerUser = await prisma.user.findUnique({
      where: { email: "buyer@test.com" },
      include: { profile: true },
    });

    if (!buyerUser) {
      console.log("❌ buyer@test.com not found in database");
      return;
    }

    console.log(`✅ buyer@test.com found`);
    console.log(`   ID: ${buyerUser.id}`);
    console.log(`   Role: ${buyerUser.role}`);
    console.log(`   Status: ${buyerUser.status}`);

    if (buyerUser.role !== "BUYER") {
      console.log("⚠️  Updating role to BUYER...");
      buyerUser = await prisma.user.update({
        where: { email: "buyer@test.com" },
        data: { role: "BUYER" },
        include: { profile: true },
      });
      console.log("✅ Role updated to BUYER");
    }

    console.log("\n" + "=" .repeat(50));
    console.log("✅ ALL CRITICAL ISSUES FIXED!\n");
    console.log("Summary:");
    console.log("  ✅ admin@test.com: ADMIN role");
    console.log("  ✅ seller@test.com: SELLER role + vendor profile");
    console.log("  ✅ buyer@test.com: BUYER role");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

