import { z } from "zod";

// Product Status and Condition enums
export const ProductStatusEnum = z.enum([
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "OUT_OF_STOCK",
]);

export const ProductConditionEnum = z.enum(["NEW", "USED", "REFURBISHED"]);

// Category validation schema
export const CategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const CategoryUpdateSchema = CategorySchema.partial();

// Product validation schema
export const ProductSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  categoryId: z.string().optional(),
  status: ProductStatusEnum.default("DRAFT"),
  isFeatured: z.boolean().default(false),
  isDigital: z.boolean().default(false),
  weight: z.number().positive().optional(),
  dimensions: z.record(z.string(), z.any()).optional(),
  brand: z.string().max(255).optional(),
  model: z.string().max(255).optional(),
  condition: ProductConditionEnum.default("NEW"),
  warrantyPeriod: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
});

export const ProductUpdateSchema = ProductSchema.partial();

// Product Variant validation schema
export const ProductVariantSchema = z.object({
  sku: z.string().min(1).max(255),
  barcode: z.string().max(255).optional(),
  name: z.string().max(255).optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stockQuantity: z.number().int().nonnegative().default(0),
  lowStockThreshold: z.number().int().nonnegative().default(10),
  weight: z.number().positive().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().default(true),
});

export const ProductVariantUpdateSchema = ProductVariantSchema.partial();

// Product Image validation schema
export const ProductImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().max(255).optional(),
  sortOrder: z.number().int().default(0),
  isPrimary: z.boolean().default(false),
  variantId: z.string().optional(),
});

export const ProductImageUpdateSchema = ProductImageSchema.partial();

// Product Translation validation schema
export const ProductTranslationSchema = z.object({
  language: z.string().length(2),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
});

// Category Translation validation schema
export const CategoryTranslationSchema = z.object({
  language: z.string().length(2),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

// Search and filter schema
export const ProductSearchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  vendorId: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  minRating: z.number().min(0).max(5).optional(),
  condition: ProductConditionEnum.optional(),
  isFeatured: z.boolean().optional(),
  status: ProductStatusEnum.optional(),
  sortBy: z
    .enum(["newest", "price_asc", "price_desc", "rating", "sales"])
    .default("newest"),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type Category = z.infer<typeof CategorySchema>;
export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type ProductVariantUpdate = z.infer<typeof ProductVariantUpdateSchema>;
export type ProductImage = z.infer<typeof ProductImageSchema>;
export type ProductImageUpdate = z.infer<typeof ProductImageUpdateSchema>;
export type ProductTranslation = z.infer<typeof ProductTranslationSchema>;
export type CategoryTranslation = z.infer<typeof CategoryTranslationSchema>;
export type ProductSearch = z.infer<typeof ProductSearchSchema>;

