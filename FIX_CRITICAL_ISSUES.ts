/**
 * FIX_CRITICAL_ISSUES.ts
 * 
 * This script fixes two critical issues:
 * 1. Verifies admin@test.com has ADMIN role
 * 2. Creates vendor profile for seller@test.com
 * 
 * Run with: npx ts-node FIX_CRITICAL_ISSUES.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Fixing critical issues...\n");

  try {
    // Issue 1: Verify admin@test.com has ADMIN role
    console.log("📋 Issue 1: Checking admin@test.com role...");
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@test.com" },
      include: { profile: true },
    });

    if (!adminUser) {
      console.log("❌ admin@test.com not found in database");
      return;
    }

    console.log(`✅ admin@test.com found`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Status: ${adminUser.status}`);
    console.log(`   Email Verified: ${adminUser.emailVerified}`);

    if (adminUser.role !== "ADMIN" && adminUser.role !== "SUPER_ADMIN") {
      console.log("⚠️  WARNING: admin@test.com does not have ADMIN role!");
      console.log("   Updating role to ADMIN...");
      await prisma.user.update({
        where: { email: "admin@test.com" },
        data: { role: "ADMIN" },
      });
      console.log("✅ Role updated to ADMIN");
    }

    // Issue 2: Create vendor profile for seller@test.com
    console.log("\n📋 Issue 2: Checking seller@test.com vendor profile...");
    const sellerUser = await prisma.user.findUnique({
      where: { email: "seller@test.com" },
      include: { vendor: true, profile: true },
    });

    if (!sellerUser) {
      console.log("❌ seller@test.com not found in database");
      return;
    }

    console.log(`✅ seller@test.com found`);
    console.log(`   Role: ${sellerUser.role}`);
    console.log(`   Has Vendor Profile: ${!!sellerUser.vendor}`);

    if (!sellerUser.vendor) {
      console.log("⚠️  WARNING: seller@test.com does not have vendor profile!");
      console.log("   Creating vendor profile...");

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
    } else {
      console.log(`✅ Vendor profile exists`);
      console.log(`   Vendor ID: ${sellerUser.vendor.id}`);
      console.log(`   Store Name: ${sellerUser.vendor.storeName}`);
      console.log(`   Status: ${sellerUser.vendor.status}`);
    }

    console.log("\n✅ All critical issues fixed!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

