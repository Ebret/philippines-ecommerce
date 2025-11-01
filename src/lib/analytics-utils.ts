/**
 * Analytics Calculation Functions
 * Provides detailed analytics for sales, customers, vendors, products, and revenue
 */

// Sales Analytics
export function calculateSalesMetrics(orders: any[]) {
  const totalSales = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  return {
    totalSales,
    totalRevenue,
    averageOrderValue,
    timestamp: new Date(),
  };
}

export function calculateSalesByCategory(orders: any[]): Record<string, number> {
  const sales: Record<string, number> = {};
  orders.forEach((order) => {
    const category = order.category || "uncategorized";
    sales[category] = (sales[category] || 0) + 1;
  });
  return sales;
}

export function calculateSalesByRegion(orders: any[]): Record<string, number> {
  const sales: Record<string, number> = {};
  orders.forEach((order) => {
    const region = order.region || "unknown";
    sales[region] = (sales[region] || 0) + 1;
  });
  return sales;
}

export function calculateSalesTrend(
  orders: any[],
  period: "day" | "week" | "month" = "day"
): Array<{ date: string; sales: number }> {
  const salesByDate: Record<string, number> = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    let key: string;

    if (period === "day") {
      key = date.toISOString().split("T")[0];
    } else if (period === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0];
    } else {
      key = date.toISOString().substring(0, 7);
    }

    salesByDate[key] = (salesByDate[key] || 0) + 1;
  });

  return Object.entries(salesByDate)
    .map(([date, sales]) => ({ date, sales }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Customer Analytics
export function calculateCustomerMetrics(customers: any[]) {
  const totalCustomers = customers.length;
  const newCustomers = customers.filter((c) => c.isNew).length;
  const returningCustomers = customers.filter((c) => c.isReturning).length;
  const activeCustomers = customers.filter((c) => c.isActive).length;

  return {
    totalCustomers,
    newCustomers,
    returningCustomers,
    activeCustomers,
    retentionRate: totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0,
  };
}

export function calculateCustomerSegmentation(customers: any[]): {
  highValue: number;
  mediumValue: number;
  lowValue: number;
} {
  const avgSpent =
    customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length || 0;

  return {
    highValue: customers.filter((c) => (c.totalSpent || 0) > avgSpent * 1.5).length,
    mediumValue: customers.filter(
      (c) => (c.totalSpent || 0) >= avgSpent * 0.5 && (c.totalSpent || 0) <= avgSpent * 1.5
    ).length,
    lowValue: customers.filter((c) => (c.totalSpent || 0) < avgSpent * 0.5).length,
  };
}

export function calculateCustomerChurn(
  previousCustomers: any[],
  currentCustomers: any[]
): number {
  const previousIds = new Set(previousCustomers.map((c) => c.id));
  const currentIds = new Set(currentCustomers.map((c) => c.id));

  const churned = previousIds.size - [...previousIds].filter((id) => currentIds.has(id)).length;
  return previousIds.size > 0 ? (churned / previousIds.size) * 100 : 0;
}

// Vendor Analytics
export function calculateVendorMetrics(vendors: any[]) {
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "active").length;
  const averageRating =
    vendors.reduce((sum, v) => sum + (v.rating || 0), 0) / vendors.length || 0;
  const totalSales = vendors.reduce((sum, v) => sum + (v.sales || 0), 0);

  return {
    totalVendors,
    activeVendors,
    averageRating,
    totalSales,
  };
}

export function calculateVendorPerformanceRanking(vendors: any[]): any[] {
  return vendors
    .map((vendor) => ({
      ...vendor,
      performanceScore:
        (vendor.rating || 0) * 0.4 +
        (vendor.sales || 0) * 0.3 +
        (vendor.responseRate || 0) * 0.2 +
        (100 - (vendor.returnRate || 0)) * 0.1,
    }))
    .sort((a, b) => b.performanceScore - a.performanceScore);
}

export function calculateVendorGrowth(
  previousVendors: any[],
  currentVendors: any[]
): number {
  const growth = currentVendors.length - previousVendors.length;
  return previousVendors.length > 0 ? (growth / previousVendors.length) * 100 : 0;
}

// Product Analytics
export function calculateProductMetrics(products: any[]) {
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const averageRating =
    products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length || 0;
  const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);

  return {
    totalProducts,
    activeProducts,
    averageRating,
    totalSales,
  };
}

export function calculateProductPerformance(products: any[]): any[] {
  return products
    .map((product) => ({
      ...product,
      performanceScore:
        (product.sales || 0) * 0.5 +
        (product.rating || 0) * 0.3 +
        (product.reviews || 0) * 0.2,
    }))
    .sort((a, b) => b.performanceScore - a.performanceScore);
}

export function calculateProductTrends(products: any[]): {
  trending: any[];
  declining: any[];
  stable: any[];
} {
  const trending = products.filter((p) => (p.salesTrend || 0) > 10);
  const declining = products.filter((p) => (p.salesTrend || 0) < -10);
  const stable = products.filter((p) => (p.salesTrend || 0) >= -10 && (p.salesTrend || 0) <= 10);

  return { trending, declining, stable };
}

// Revenue Analytics
export function calculateRevenueMetrics(orders: any[]) {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalTax = orders.reduce((sum, order) => sum + (order.tax || 0), 0);
  const totalCommission = orders.reduce((sum, order) => sum + (order.commission || 0), 0);
  const netRevenue = totalRevenue - totalCommission;

  return {
    totalRevenue,
    totalTax,
    totalCommission,
    netRevenue,
    averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
  };
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

export function calculateRevenueTrend(
  orders: any[],
  period: "day" | "week" | "month" = "day"
): Array<{ date: string; revenue: number }> {
  const revenueByDate: Record<string, number> = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    let key: string;

    if (period === "day") {
      key = date.toISOString().split("T")[0];
    } else if (period === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0];
    } else {
      key = date.toISOString().substring(0, 7);
    }

    revenueByDate[key] = (revenueByDate[key] || 0) + (order.total || 0);
  });

  return Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Comparison Functions
export function compareMetrics(
  current: Record<string, number>,
  previous: Record<string, number>
): Record<string, { value: number; change: number; changePercent: number }> {
  const comparison: Record<string, any> = {};

  Object.keys(current).forEach((key) => {
    const currentVal = current[key] || 0;
    const previousVal = previous[key] || 0;
    const change = currentVal - previousVal;
    const changePercent = previousVal > 0 ? (change / previousVal) * 100 : 0;

    comparison[key] = {
      value: currentVal,
      change,
      changePercent,
    };
  });

  return comparison;
}

// Aggregation Functions
export function aggregateMetrics(
  metricsArray: any[],
  aggregationType: "sum" | "average" | "max" | "min" = "sum"
): Record<string, number> {
  if (metricsArray.length === 0) return {};

  const keys = Object.keys(metricsArray[0]);
  const result: Record<string, number> = {};

  keys.forEach((key) => {
    const values = metricsArray.map((m) => m[key] || 0).filter((v) => typeof v === "number");

    if (aggregationType === "sum") {
      result[key] = values.reduce((a, b) => a + b, 0);
    } else if (aggregationType === "average") {
      result[key] = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    } else if (aggregationType === "max") {
      result[key] = Math.max(...values);
    } else if (aggregationType === "min") {
      result[key] = Math.min(...values);
    }
  });

  return result;
}

