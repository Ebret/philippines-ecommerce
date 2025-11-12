import { z } from "zod";

// Admin Dashboard Schemas
export const DashboardQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: z.enum(["day", "week", "month", "quarter", "year"]).optional(),
  timezone: z.string().optional(),
});

export const KPIQuerySchema = z.object({
  period: z.enum(["day", "week", "month", "quarter", "year"]).optional(),
  compareWithPrevious: z.boolean().optional(),
});

export const AnalyticsFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  category: z.string().optional(),
  vendor: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.enum(["date", "amount", "count", "rating"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: z.number().min(1).max(1000).optional(),
  offset: z.number().min(0).optional(),
});

// User Management Schemas
export const UserStatusUpdateSchema = z.object({
  status: z.enum(["active", "inactive", "suspended", "banned"]),
  reason: z.string().optional(),
});

export const UserBanSchema = z.object({
  reason: z.string().min(10),
  duration: z.enum(["permanent", "7days", "30days", "90days"]),
  notifyUser: z.boolean().optional(),
});

export const UserFilterSchema = z.object({
  role: z.enum(["customer", "vendor", "admin"]).optional(),
  status: z.enum(["active", "inactive", "suspended", "banned"]).optional(),
  joinedFrom: z.string().datetime().optional(),
  joinedTo: z.string().datetime().optional(),
  searchTerm: z.string().optional(),
  sortBy: z.enum(["createdAt", "name", "email", "orders"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Order Management Schemas
export const OrderStatusUpdateSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
  ]),
  notes: z.string().optional(),
});

export const OrderFilterSchema = z.object({
  status: z.string().optional(),
  vendor: z.string().optional(),
  customer: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  paymentStatus: z.enum(["pending", "completed", "failed"]).optional(),
});

// Product Management Schemas
export const ProductStatusUpdateSchema = z.object({
  status: z.enum(["active", "inactive", "archived", "flagged"]),
  reason: z.string().optional(),
});

export const ProductFilterSchema = z.object({
  status: z.string().optional(),
  vendor: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRating: z.number().min(0).max(5).optional(),
  searchTerm: z.string().optional(),
  sortBy: z.enum(["name", "price", "rating", "sales", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Vendor Management Schemas
export const VendorStatusUpdateSchema = z.object({
  status: z.enum(["active", "inactive", "suspended", "banned"]),
  reason: z.string().optional(),
});

export const VendorSuspendSchema = z.object({
  reason: z.string().min(10),
  duration: z.enum(["temporary", "permanent"]),
  notifyVendor: z.boolean().optional(),
});

export const VendorFilterSchema = z.object({
  status: z.enum(["active", "inactive", "suspended", "banned"]).optional(),
  verificationStatus: z.enum(["pending", "verified", "rejected"]).optional(),
  minRating: z.number().min(0).max(5).optional(),
  minSales: z.number().optional(),
  joinedFrom: z.string().datetime().optional(),
  joinedTo: z.string().datetime().optional(),
  searchTerm: z.string().optional(),
});

// Report Generation Schemas
export const ReportGenerationSchema = z.object({
  type: z.enum(["sales", "revenue", "customers", "products", "vendors"]),
  period: z.enum(["day", "week", "month", "quarter", "year"]),
  format: z.enum(["pdf", "csv", "excel", "json"]),
  includeCharts: z.boolean().optional(),
  includeComparisons: z.boolean().optional(),
});

export const ReportFilterSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  category: z.string().optional(),
  vendor: z.string().optional(),
  region: z.string().optional(),
});

// Analytics Query Schemas
export const SalesAnalyticsQuerySchema = z.object({
  period: z.enum(["day", "week", "month", "quarter", "year"]),
  groupBy: z.enum(["date", "category", "vendor", "region"]).optional(),
  compareWithPrevious: z.boolean().optional(),
});

export const CustomerAnalyticsQuerySchema = z.object({
  period: z.enum(["day", "week", "month", "quarter", "year"]),
  metrics: z.array(z.enum(["new", "active", "returning", "churn"])).optional(),
});

export const RevenueAnalyticsQuerySchema = z.object({
  period: z.enum(["day", "week", "month", "quarter", "year"]),
  includeBreakdown: z.boolean().optional(),
  includeTax: z.boolean().optional(),
});

// System Monitoring Schemas
export const SystemHealthQuerySchema = z.object({
  includeDetails: z.boolean().optional(),
});

export const AuditLogFilterSchema = z.object({
  action: z.string().optional(),
  admin: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(["date", "action", "admin"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Export Schemas
export const DataExportSchema = z.object({
  dataType: z.enum([
    "users",
    "orders",
    "products",
    "vendors",
    "transactions",
    "reviews",
  ]),
  format: z.enum(["csv", "excel", "json"]),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  filters: z.record(z.string(), z.any()).optional(),
});

// Type exports
export type DashboardQuery = z.infer<typeof DashboardQuerySchema>;
export type KPIQuery = z.infer<typeof KPIQuerySchema>;
export type AnalyticsFilter = z.infer<typeof AnalyticsFilterSchema>;
export type UserStatusUpdate = z.infer<typeof UserStatusUpdateSchema>;
export type UserBan = z.infer<typeof UserBanSchema>;
export type UserFilter = z.infer<typeof UserFilterSchema>;
export type OrderStatusUpdate = z.infer<typeof OrderStatusUpdateSchema>;
export type OrderFilter = z.infer<typeof OrderFilterSchema>;
export type ProductStatusUpdate = z.infer<typeof ProductStatusUpdateSchema>;
export type ProductFilter = z.infer<typeof ProductFilterSchema>;
export type VendorStatusUpdate = z.infer<typeof VendorStatusUpdateSchema>;
export type VendorSuspend = z.infer<typeof VendorSuspendSchema>;
export type VendorFilter = z.infer<typeof VendorFilterSchema>;
export type ReportGeneration = z.infer<typeof ReportGenerationSchema>;
export type ReportFilter = z.infer<typeof ReportFilterSchema>;
export type SalesAnalyticsQuery = z.infer<typeof SalesAnalyticsQuerySchema>;
export type CustomerAnalyticsQuery = z.infer<typeof CustomerAnalyticsQuerySchema>;
export type RevenueAnalyticsQuery = z.infer<typeof RevenueAnalyticsQuerySchema>;
export type SystemHealthQuery = z.infer<typeof SystemHealthQuerySchema>;
export type AuditLogFilter = z.infer<typeof AuditLogFilterSchema>;
export type DataExport = z.infer<typeof DataExportSchema>;

