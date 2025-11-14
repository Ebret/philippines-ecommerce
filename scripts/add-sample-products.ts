import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🛍️ Adding sample products to production database...\n");

  try {
    // Get or create vendor (use first vendor or create one)
    let vendor = await prisma.vendor.findFirst();
    
    if (!vendor) {
      console.log("Creating default vendor...");
      const user = await prisma.user.findFirst({
        where: { role: "SELLER" }
      });

      if (!user) {
        throw new Error("No seller user found. Please create a seller account first.");
      }

      vendor = await prisma.vendor.create({
        data: {
          userId: user.id,
          storeName: "Extreme Life Herbal Store",
          storeSlug: "extreme-life-herbal",
          description: "Premium herbal products for health and wellness",
          status: "APPROVED",
        },
      });
    }

    // Get or create categories
    const categories = await prisma.category.findMany();
    let herbTeaCategory = categories.find(c => c.name === "Herbal Teas");
    let supplementCategory = categories.find(c => c.name === "Supplements");
    let oilCategory = categories.find(c => c.name === "Herbal Oils");

    if (!herbTeaCategory) {
      herbTeaCategory = await prisma.category.create({
        data: {
          name: "Herbal Teas",
          slug: "herbal-teas",
          description: "Premium herbal tea blends",
        },
      });
    }

    if (!supplementCategory) {
      supplementCategory = await prisma.category.create({
        data: {
          name: "Supplements",
          slug: "supplements",
          description: "Natural vitamin and mineral supplements",
        },
      });
    }

    if (!oilCategory) {
      oilCategory = await prisma.category.create({
        data: {
          name: "Herbal Oils",
          slug: "herbal-oils",
          description: "Pure herbal oil extracts",
        },
      });
    }

    // Sample products data
    const sampleProducts = [
      {
        name: "Organic Chamomile Tea",
        slug: "organic-chamomile-tea",
        description: "Relaxing organic chamomile tea blend for better sleep",
        price: 24999,
        category: herbTeaCategory,
      },
      {
        name: "Ginger Turmeric Tea",
        slug: "ginger-turmeric-tea",
        description: "Anti-inflammatory ginger and turmeric blend",
        price: 29999,
        category: herbTeaCategory,
      },
      {
        name: "Vitamin C Supplement",
        slug: "vitamin-c-supplement",
        description: "High-potency vitamin C for immune support",
        price: 34999,
        category: supplementCategory,
      },
      {
        name: "Magnesium Complex",
        slug: "magnesium-complex",
        description: "Complete magnesium complex for muscle relaxation",
        price: 39999,
        category: supplementCategory,
      },
      {
        name: "Eucalyptus Essential Oil",
        slug: "eucalyptus-essential-oil",
        description: "Pure eucalyptus oil for respiratory support",
        price: 44999,
        category: oilCategory,
      },
      {
        name: "Lavender Essential Oil",
        slug: "lavender-essential-oil",
        description: "Calming lavender oil for aromatherapy",
        price: 49999,
        category: oilCategory,
      },
      {
        name: "Peppermint Tea",
        slug: "peppermint-tea",
        description: "Refreshing peppermint tea for digestion",
        price: 19999,
        category: herbTeaCategory,
      },
      {
        name: "Zinc Supplement",
        slug: "zinc-supplement",
        description: "Essential zinc for immune function",
        price: 29999,
        category: supplementCategory,
      },
      {
        name: "Tea Tree Oil",
        slug: "tea-tree-oil",
        description: "Antibacterial tea tree oil for skin care",
        price: 39999,
        category: oilCategory,
      },
      {
        name: "Green Tea Extract",
        slug: "green-tea-extract",
        description: "Concentrated green tea extract for antioxidants",
        price: 34999,
        category: supplementCategory,
      },
    ];

    // Create products
    for (const productData of sampleProducts) {
      const existing = await prisma.product.findUnique({
        where: { slug: productData.slug },
      });

      if (!existing) {
        const product = await prisma.product.create({
          data: {
            name: productData.name,
            slug: productData.slug,
            description: productData.description,
            shortDescription: productData.description.substring(0, 100),
            vendorId: vendor.id,
            categoryId: productData.category.id,
            status: "ACTIVE",
            isFeatured: Math.random() > 0.5,
            images: {
              create: {
                url: `https://via.placeholder.com/500x500?text=${productData.name.replace(/ /g, "+")}`,
                altText: productData.name,
                sortOrder: 1,
              },
            },
            variants: {
              create: {
                name: "Default",
                sku: `SKU-${productData.slug.toUpperCase()}`,
                price: productData.price,
                stockQuantity: Math.floor(Math.random() * 100) + 50,
              },
            },
          },
        });

        console.log(`✅ Created: ${product.name} (₱${(productData.price / 100).toFixed(2)})`);
      } else {
        console.log(`⏭️  Skipped: ${productData.name} (already exists)`);
      }
    }

    console.log("\n✅ Sample products added successfully!");
  } catch (error) {
    console.error("❌ Error adding sample products:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

