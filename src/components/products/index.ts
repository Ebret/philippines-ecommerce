/**
 * Product Management Components
 * Phase 26.4: Additional Product Features
 * 
 * Exports all product management components for easy importing
 */

// Phase 26.4.1: Product Variant Management
export { VariantManager } from './variant-manager';
export type { ProductVariant, VariantAttribute } from './variant-manager';

// Phase 26.4.2: Category & Tag Management
export { CategoryTagManager } from './category-tag-manager';
export type { Category, ProductTag } from './category-tag-manager';

// Phase 26.4.3: Product Review Moderation
export { ReviewModeration } from './review-moderation';
export type { ProductReview, ReviewStats } from './review-moderation';

// Phase 26.4.4: Product Comparison
export { ProductComparison } from './product-comparison';
export type { ComparisonProduct } from './product-comparison';

// Phase 26.4.5: Product Import/Export
export { ProductImportExport } from './product-import-export';
export type { ImportProduct, ImportResult } from './product-import-export';

// Phase 26.4.6: Product Duplication
export { ProductDuplicator } from './product-duplicator';
export type { DuplicateProduct, DuplicationOptions } from './product-duplicator';

// Phase 26.4.7: Advanced Search & Filtering
export { AdvancedProductSearch } from './advanced-product-search';
export type { SearchFilters, SavedFilter } from './advanced-product-search';

// Phase 26.4.8: Product Analytics
export { ProductAnalytics } from './product-analytics';
export type { ProductMetrics, AnalyticsSummary } from './product-analytics';

