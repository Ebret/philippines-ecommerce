/**
 * Admin Dashboard & Analytics Utility Functions
 * Provides KPI calculations, analytics aggregation, and admin operations
 */

// KPI Calculation Functions
export function calculateTotalRevenue(orders: any[]): number {
  return orders.reduce((sum, order) => sum + (order.total || 0), 0);
}

export function calculateTotalOrders(orders: any[]): number {
  return orders.length;
}

export function calculateAverageOrderValue(orders: any[]): number {
  if (orders.length === 0) return 0;
  return calculateTotalRevenue(orders) / orders.length;
}

export function calculateConversionRate(
  visitors: number,
  orders: number
): number {
  if (visitors === 0) return 0;
  return (orders / visitors) * 100;
}

export function calculateCustomerRetentionRate(
  returningCustomers: number,
  totalCustomers: number
): number {
  if (totalCustomers === 0) return 0;
  return (returningCustomers / totalCustomers) * 100;
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// User Statistics Functions
export function calculateUserStats(users: any[]): {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  banned: number;
} {
  return {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    banned: users.filter((u) => u.status === "banned").length,
  };
}

export function calculateUsersByRole(users: any[]): {
  customers: number;
  vendors: number;
  admins: number;
} {
  return {
    customers: users.filter((u) => u.role === "customer").length,
    vendors: users.filter((u) => u.role === "vendor").length,
    admins: users.filter((u) => u.role === "admin").length,
  };
}

// Order Analytics Functions
export function calculateOrderStats(orders: any[]): {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
} {
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    returned: orders.filter((o) => o.status === "returned").length,
  };
}

export function calculateOrdersByPaymentStatus(orders: any[]): {
  pending: number;
  completed: number;
  failed: number;
} {
  return {
    pending: orders.filter((o) => o.paymentStatus === "pending").length,
    completed: orders.filter((o) => o.paymentStatus === "completed").length,
    failed: orders.filter((o) => o.paymentStatus === "failed").length,
  };
}

// Revenue Analytics Functions
export function calculateRevenueByCategory(orders: any[]): Record<string, number> {
  const revenue: Record<string, number> = {};
  orders.forEach((order) => {
    const category = order.category || "uncategorized";
    revenue[category] = (revenue[category] || 0) + (order.total || 0);
  });
  return revenue;
}

export function calculateRevenueByVendor(orders: any[]): Record<string, number> {
  const revenue: Record<string, number> = {};
  orders.forEach((order) => {
    const vendor = order.vendor || "unknown";
    revenue[vendor] = (revenue[vendor] || 0) + (order.total || 0);
  });
  return revenue;
}

export function calculateRevenueByPaymentMethod(
  orders: any[]
): Record<string, number> {
  const revenue: Record<string, number> = {};
  orders.forEach((order) => {
    const method = order.paymentMethod || "unknown";
    revenue[method] = (revenue[method] || 0) + (order.total || 0);
  });
  return revenue;
}

// Product Analytics Functions
export function calculateProductStats(products: any[]): {
  total: number;
  active: number;
  inactive: number;
  archived: number;
  flagged: number;
} {
  return {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    inactive: products.filter((p) => p.status === "inactive").length,
    archived: products.filter((p) => p.status === "archived").length,
    flagged: products.filter((p) => p.status === "flagged").length,
  };
}

export function calculateTopProducts(
  products: any[],
  limit: number = 10
): any[] {
  return products
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, limit);
}

export function calculateLowStockProducts(
  products: any[],
  threshold: number = 10
): any[] {
  return products.filter((p) => (p.stock || 0) <= threshold);
}

// Vendor Analytics Functions
export function calculateVendorStats(vendors: any[]): {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  banned: number;
} {
  return {
    total: vendors.length,
    active: vendors.filter((v) => v.status === "active").length,
    inactive: vendors.filter((v) => v.status === "inactive").length,
    suspended: vendors.filter((v) => v.status === "suspended").length,
    banned: vendors.filter((v) => v.status === "banned").length,
  };
}

export function calculateTopVendors(
  vendors: any[],
  limit: number = 10
): any[] {
  return vendors
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, limit);
}

export function calculateVendorPerformance(vendor: any): {
  rating: number;
  sales: number;
  revenue: number;
  orders: number;
  responseTime: number;
  returnRate: number;
} {
  return {
    rating: vendor.rating || 0,
    sales: vendor.sales || 0,
    revenue: vendor.revenue || 0,
    orders: vendor.orders || 0,
    responseTime: vendor.responseTime || 0,
    returnRate: vendor.returnRate || 0,
  };
}

// Customer Analytics Functions
export function calculateCustomerStats(customers: any[]): {
  total: number;
  new: number;
  active: number;
  returning: number;
  inactive: number;
} {
  return {
    total: customers.length,
    new: customers.filter((c) => c.isNew).length,
    active: customers.filter((c) => c.isActive).length,
    returning: customers.filter((c) => c.isReturning).length,
    inactive: customers.filter((c) => !c.isActive).length,
  };
}

export function calculateCustomerLifetimeValue(customer: any): number {
  return customer.totalSpent || 0;
}

export function calculateAverageCustomerLifetimeValue(
  customers: any[]
): number {
  if (customers.length === 0) return 0;
  const total = customers.reduce(
    (sum, c) => sum + (c.totalSpent || 0),
    0
  );
  return total / customers.length;
}

// Trend Analysis Functions
export function calculateTrend(
  current: number,
  previous: number
): "up" | "down" | "stable" {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "stable";
}

export function calculateTrendPercentage(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Date Range Functions
export function getDateRange(
  period: "day" | "week" | "month" | "quarter" | "year"
): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case "day":
      startDate.setDate(endDate.getDate() - 1);
      break;
    case "week":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "quarter":
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case "year":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }

  return { startDate, endDate };
}

// Filtering Functions
export function filterByDateRange(
  items: any[],
  startDate: Date,
  endDate: Date,
  dateField: string = "createdAt"
): any[] {
  return items.filter((item) => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

export function filterByStatus(items: any[], status: string): any[] {
  return items.filter((item) => item.status === status);
}

export function filterByVendor(items: any[], vendor: string): any[] {
  return items.filter((item) => item.vendor === vendor);
}

export function filterByCategory(items: any[], category: string): any[] {
  return items.filter((item) => item.category === category);
}

// Sorting Functions
export function sortByField(
  items: any[],
  field: string,
  order: "asc" | "desc" = "asc"
): any[] {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// Pagination Functions
export function paginate(
  items: any[],
  limit: number = 10,
  offset: number = 0
): any[] {
  return items.slice(offset, offset + limit);
}

// Export Functions
export function formatForCSV(data: any[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers.map((header) => JSON.stringify(item[header] || "")).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export function formatForJSON(data: any[]): string {
  return JSON.stringify(data, null, 2);
}

