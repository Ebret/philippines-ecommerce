import { prisma } from '@/lib/prisma';

const HERBAL_PRODUCTS = [
  {
    name: 'Premium Herbal Tea Blend',
    slug: 'premium-herbal-tea-blend',
    description: 'A carefully crafted blend of organic herbs for relaxation and wellness. Contains chamomile, lavender, and lemongrass.',
    shortDescription: 'Organic herbal tea blend for relaxation',
    price: 19.99,
    comparePrice: 24.99,
    category: 'Herbal Teas',
    brand: 'Extreme Life',
    condition: 'NEW',
    weight: 0.1,
    sku: 'HT-001',
  },
  {
    name: 'Turmeric & Ginger Supplement',
    slug: 'turmeric-ginger-supplement',
    description: 'Natural anti-inflammatory supplement with turmeric and ginger. Supports joint health and immunity.',
    shortDescription: 'Anti-inflammatory herbal supplement',
    price: 29.99,
    comparePrice: 39.99,
    category: 'Supplements',
    brand: 'Extreme Life',
    condition: 'NEW',
    weight: 0.2,
    sku: 'SUP-001',
  },
  {
    name: 'Pure Herbal Oil Extract',
    slug: 'pure-herbal-oil-extract',
    description: 'Premium herbal oil extract with essential oils. Perfect for massage and aromatherapy.',
    shortDescription: 'Pure herbal oil for massage and aromatherapy',
    price: 39.99,
    comparePrice: 49.99,
    category: 'Oils',
    brand: 'Extreme Life',
    condition: 'NEW',
    weight: 0.15,
    sku: 'OIL-001',
  },
  {
    name: 'Moringa Leaf Powder',
    slug: 'moringa-leaf-powder',
    description: 'Nutrient-rich moringa leaf powder. High in vitamins, minerals, and antioxidants.',
    shortDescription: 'Nutrient-rich superfood powder',
    price: 24.99,
    comparePrice: 34.99,
    category: 'Powders',
    brand: 'Extreme Life',
    condition: 'NEW',
    weight: 0.25,
    sku: 'POW-001',
  },
  {
    name: 'Ginseng Root Extract',
    slug: 'ginseng-root-extract',
    description: 'Premium ginseng root extract for energy and vitality. Supports mental clarity and physical endurance.',
    shortDescription: 'Energy-boosting ginseng extract',
    price: 34.99,
    comparePrice: 44.99,
    category: 'Extracts',
    brand: 'Extreme Life',
    condition: 'NEW',
    weight: 0.1,
    sku: 'EXT-001',
  },
  {
    name: 'Honey & Propolis Blend',
    slug: 'honey-propolis-blend',
    description: 'Raw honey blended with bee propolis. Supports immune system and throat health.',
    shortDescription: 'Immune-boosting honey blend',
    price: 22.99,
    comparePrice: 29.99,
    category: 'Honey Products',
    brand: 'Extreme Life',
    condition: 'NEW',
    weight: 0.3,
    sku: 'HON-001',
  },
];

async function seedProducts() {
  try {
    console.log('Starting product seeding...');

    // Get or create vendor
    let vendor = await prisma.vendor.findFirst();
    if (!vendor) {
      // Create a test user first
      const user = await prisma.user.create({
        data: {
          email: 'vendor@extremelife.com',
          role: 'SELLER',
          emailVerified: true,
          profile: {
            create: {
              firstName: 'Extreme',
              lastName: 'Life Vendor',
            },
          },
        },
      });

      vendor = await prisma.vendor.create({
        data: {
          userId: user.id,
          storeName: 'Extreme Life Herbal',
          storeSlug: 'extreme-life-herbal',
          description: 'Premium herbal products for health and wellness',
          status: 'APPROVED',
          profile: {
            create: {
              businessType: 'CORPORATION',
              businessName: 'Extreme Life Herbal Inc.',
              businessRegistration: 'ELH-2025-001',
              tin: 'TAX-001',
            },
          },
        },
      });
    }

    // Get or create categories
    const categories: Record<string, string> = {};
    const categoryNames = ['Herbal Teas', 'Supplements', 'Oils', 'Powders', 'Extracts', 'Honey Products'];

    for (const catName of categoryNames) {
      let category = await prisma.category.findUnique({
        where: { slug: catName.toLowerCase().replace(/\s+/g, '-') },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: catName,
            slug: catName.toLowerCase().replace(/\s+/g, '-'),
            description: `${catName} category`,
            isActive: true,
          },
        });
      }

      categories[catName] = category.id;
    }

    // Create products
    for (const productData of HERBAL_PRODUCTS) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: productData.slug },
      });

      if (!existingProduct) {
        const product = await prisma.product.create({
          data: {
            name: productData.name,
            slug: productData.slug,
            description: productData.description,
            shortDescription: productData.shortDescription,
            vendorId: vendor.id,
            categoryId: categories[productData.category],
            brand: productData.brand,
            condition: productData.condition as any,
            weight: productData.weight,
            status: 'ACTIVE' as any,
            isFeatured: Math.random() > 0.5,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            reviewCount: Math.floor(Math.random() * 50) + 10,
          },
        });

        // Create variant
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: productData.sku,
            name: productData.name,
            price: productData.price,
            comparePrice: productData.comparePrice,
            stockQuantity: Math.floor(Math.random() * 100) + 50,
            isActive: true,
          },
        });

        // Create placeholder image
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: `https://via.placeholder.com/400x400?text=${encodeURIComponent(productData.name)}`,
            altText: productData.name,
            isPrimary: true,
            sortOrder: 0,
          },
        });

        console.log(`✓ Created product: ${productData.name}`);
      }
    }

    console.log('✓ Product seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();

