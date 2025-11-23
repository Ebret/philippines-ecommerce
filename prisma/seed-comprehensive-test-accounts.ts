import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface TestAccount {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "SELLER" | "BUYER";
  phone: string;
}

const testAccounts: TestAccount[] = [
  // Admin Accounts
  {
    email: "admin@test.com",
    password: "Admin123!",
    firstName: "Admin",
    lastName: "User",
    role: "ADMIN",
    phone: "+639000000001",
  },
  {
    email: "admin.content@test.com",
    password: "AdminContent123!",
    firstName: "Content",
    lastName: "Manager",
    role: "ADMIN",
    phone: "+639000000002",
  },
  {
    email: "admin.analytics@test.com",
    password: "AdminAnalytics123!",
    firstName: "Analytics",
    lastName: "Manager",
    role: "ADMIN",
    phone: "+639000000003",
  },
  // Vendor Accounts
  {
    email: "vendor.premium@test.com",
    password: "VendorPremium123!",
    firstName: "Premium",
    lastName: "Vendor",
    role: "SELLER",
    phone: "+639000000004",
  },
  {
    email: "vendor.standard@test.com",
    password: "VendorStandard123!",
    firstName: "Standard",
    lastName: "Vendor",
    role: "SELLER",
    phone: "+639000000005",
  },
  {
    email: "vendor.new@test.com",
    password: "VendorNew123!",
    firstName: "New",
    lastName: "Vendor",
    role: "SELLER",
    phone: "+639000000006",
  },
  // Buyer Accounts
  {
    email: "buyer.premium@test.com",
    password: "BuyerPremium123!",
    firstName: "Premium",
    lastName: "Buyer",
    role: "BUYER",
    phone: "+639000000007",
  },
  {
    email: "buyer.regular@test.com",
    password: "BuyerRegular123!",
    firstName: "Regular",
    lastName: "Buyer",
    role: "BUYER",
    phone: "+639000000008",
  },
  {
    email: "buyer.new@test.com",
    password: "BuyerNew123!",
    firstName: "New",
    lastName: "Buyer",
    role: "BUYER",
    phone: "+639000000009",
  },
  {
    email: "buyer.international@test.com",
    password: "BuyerIntl123!",
    firstName: "International",
    lastName: "Buyer",
    role: "BUYER",
    phone: "+639000000010",
  },
  {
    email: "buyer.bulk@test.com",
    password: "BuyerBulk123!",
    firstName: "Bulk",
    lastName: "Buyer",
    role: "BUYER",
    phone: "+639000000011",
  },
];

async function main() {
  console.log("🌱 Creating comprehensive test accounts...");

  try {
    for (const account of testAccounts) {
      const hashedPassword = await bcrypt.hash(account.password, 10);

      const user = await prisma.user.upsert({
        where: { email: account.email },
        update: {},
        create: {
          email: account.email,
          phone: account.phone,
          passwordHash: hashedPassword,
          role: account.role,
          status: "ACTIVE",
          emailVerified: true,
          phoneVerified: true,
          profile: {
            create: {
              firstName: account.firstName,
              lastName: account.lastName,
              gender: "OTHER",
            },
          },
        },
      });

      console.log(
        `✅ ${account.role} account created: ${account.email} / ${account.password}`
      );
    }

    console.log("\n🎉 All test accounts created successfully!");
    console.log("\n📋 Test Accounts Summary:");
    console.log("- 3 Admin accounts");
    console.log("- 3 Vendor/Seller accounts");
    console.log("- 5 Buyer/Client accounts");
    console.log("\nTotal: 11 test accounts ready for testing");
  } catch (error) {
    console.error("❌ Error creating test accounts:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

