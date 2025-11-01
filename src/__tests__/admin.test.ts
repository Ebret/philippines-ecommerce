import { describe, it, expect } from "vitest";
import {
  calculateTotalRevenue,
  calculateTotalOrders,
  calculateAverageOrderValue,
  calculateConversionRate,
  calculateCustomerRetentionRate,
  calculateGrowthRate,
  calculateUserStats,
  calculateUsersByRole,
  calculateOrderStats,
  calculateOrdersByPaymentStatus,
  calculateRevenueByCategory,
  calculateRevenueByVendor,
  calculateProductStats,
  calculateTopProducts,
  calculateLowStockProducts,
  calculateVendorStats,
  calculateTopVendors,
  calculateCustomerStats,
  calculateTrend,
  calculateTrendPercentage,
  getDateRange,
  filterByDateRange,
  filterByStatus,
  filterByVendor,
  sortByField,
  paginate,
  formatForCSV,
  formatForJSON,
} from "@/lib/admin-utils";
import {
  calculateSalesMetrics,
  calculateSalesByCategory,
  calculateSalesByRegion,
  calculateSalesTrend,
  calculateCustomerMetrics,
  calculateVendorMetrics,
  calculateProductMetrics,
  calculateRevenueMetrics,
  calculateRevenueByPaymentMethod,
  calculateRevenueTrend,
} from "@/lib/analytics-utils";

describe("Admin Dashboard Utilities", () => {
  describe("KPI Calculations", () => {
    it("should calculate total revenue correctly", () => {
      const orders = [
        { total: 1000 },
        { total: 2000 },
        { total: 3000 },
      ];
      expect(calculateTotalRevenue(orders)).toBe(6000);
    });

    it("should calculate total orders correctly", () => {
      const orders = [{ id: "1" }, { id: "2" }, { id: "3" }];
      expect(calculateTotalOrders(orders)).toBe(3);
    });

    it("should calculate average order value correctly", () => {
      const orders = [
        { total: 1000 },
        { total: 2000 },
        { total: 3000 },
      ];
      expect(calculateAverageOrderValue(orders)).toBe(2000);
    });

    it("should calculate conversion rate correctly", () => {
      expect(calculateConversionRate(1000, 50)).toBe(5);
    });

    it("should calculate customer retention rate correctly", () => {
      expect(calculateCustomerRetentionRate(30, 100)).toBe(30);
    });

    it("should calculate growth rate correctly", () => {
      expect(calculateGrowthRate(150, 100)).toBe(50);
    });

    it("should handle zero division in growth rate", () => {
      expect(calculateGrowthRate(100, 0)).toBe(100);
    });
  });

  describe("User Statistics", () => {
    it("should calculate user stats correctly", () => {
      const users = [
        { status: "active" },
        { status: "active" },
        { status: "inactive" },
        { status: "suspended" },
        { status: "banned" },
      ];
      const stats = calculateUserStats(users);
      expect(stats.total).toBe(5);
      expect(stats.active).toBe(2);
      expect(stats.inactive).toBe(1);
      expect(stats.suspended).toBe(1);
      expect(stats.banned).toBe(1);
    });

    it("should calculate users by role correctly", () => {
      const users = [
        { role: "customer" },
        { role: "customer" },
        { role: "vendor" },
        { role: "admin" },
      ];
      const byRole = calculateUsersByRole(users);
      expect(byRole.customers).toBe(2);
      expect(byRole.vendors).toBe(1);
      expect(byRole.admins).toBe(1);
    });
  });

  describe("Order Statistics", () => {
    it("should calculate order stats correctly", () => {
      const orders = [
        { status: "delivered" },
        { status: "delivered" },
        { status: "shipped" },
        { status: "pending" },
        { status: "cancelled" },
      ];
      const stats = calculateOrderStats(orders);
      expect(stats.total).toBe(5);
      expect(stats.delivered).toBe(2);
      expect(stats.shipped).toBe(1);
      expect(stats.pending).toBe(1);
      expect(stats.cancelled).toBe(1);
    });

    it("should calculate orders by payment status correctly", () => {
      const orders = [
        { paymentStatus: "completed" },
        { paymentStatus: "completed" },
        { paymentStatus: "pending" },
        { paymentStatus: "failed" },
      ];
      const stats = calculateOrdersByPaymentStatus(orders);
      expect(stats.completed).toBe(2);
      expect(stats.pending).toBe(1);
      expect(stats.failed).toBe(1);
    });
  });

  describe("Revenue Analytics", () => {
    it("should calculate revenue by category correctly", () => {
      const orders = [
        { category: "Electronics", total: 5000 },
        { category: "Electronics", total: 3000 },
        { category: "Fashion", total: 2000 },
      ];
      const revenue = calculateRevenueByCategory(orders);
      expect(revenue.Electronics).toBe(8000);
      expect(revenue.Fashion).toBe(2000);
    });

    it("should calculate revenue by vendor correctly", () => {
      const orders = [
        { vendor: "Vendor A", total: 5000 },
        { vendor: "Vendor A", total: 3000 },
        { vendor: "Vendor B", total: 2000 },
      ];
      const revenue = calculateRevenueByVendor(orders);
      expect(revenue["Vendor A"]).toBe(8000);
      expect(revenue["Vendor B"]).toBe(2000);
    });
  });

  describe("Product Statistics", () => {
    it("should calculate product stats correctly", () => {
      const products = [
        { status: "active" },
        { status: "active" },
        { status: "inactive" },
        { status: "archived" },
        { status: "flagged" },
      ];
      const stats = calculateProductStats(products);
      expect(stats.total).toBe(5);
      expect(stats.active).toBe(2);
      expect(stats.inactive).toBe(1);
      expect(stats.archived).toBe(1);
      expect(stats.flagged).toBe(1);
    });

    it("should calculate top products correctly", () => {
      const products = [
        { id: "1", sales: 100 },
        { id: "2", sales: 200 },
        { id: "3", sales: 50 },
      ];
      const top = calculateTopProducts(products, 2);
      expect(top.length).toBe(2);
      expect(top[0].id).toBe("2");
      expect(top[1].id).toBe("1");
    });

    it("should calculate low stock products correctly", () => {
      const products = [
        { id: "1", stock: 5 },
        { id: "2", stock: 15 },
        { id: "3", stock: 8 },
      ];
      const lowStock = calculateLowStockProducts(products, 10);
      expect(lowStock.length).toBe(2);
    });
  });

  describe("Vendor Statistics", () => {
    it("should calculate vendor stats correctly", () => {
      const vendors = [
        { status: "active" },
        { status: "active" },
        { status: "suspended" },
        { status: "banned" },
      ];
      const stats = calculateVendorStats(vendors);
      expect(stats.total).toBe(4);
      expect(stats.active).toBe(2);
      expect(stats.suspended).toBe(1);
      expect(stats.banned).toBe(1);
    });

    it("should calculate top vendors correctly", () => {
      const vendors = [
        { id: "1", sales: 100 },
        { id: "2", sales: 300 },
        { id: "3", sales: 200 },
      ];
      const top = calculateTopVendors(vendors, 2);
      expect(top.length).toBe(2);
      expect(top[0].id).toBe("2");
    });
  });

  describe("Customer Statistics", () => {
    it("should calculate customer stats correctly", () => {
      const customers = [
        { isNew: true, isActive: true, isReturning: false },
        { isNew: false, isActive: true, isReturning: true },
        { isNew: false, isActive: false, isReturning: false },
      ];
      const stats = calculateCustomerStats(customers);
      expect(stats.total).toBe(3);
      expect(stats.new).toBe(1);
      expect(stats.active).toBe(2);
      expect(stats.returning).toBe(1);
    });
  });

  describe("Trend Analysis", () => {
    it("should calculate trend correctly", () => {
      expect(calculateTrend(150, 100)).toBe("up");
      expect(calculateTrend(50, 100)).toBe("down");
      expect(calculateTrend(100, 100)).toBe("stable");
    });

    it("should calculate trend percentage correctly", () => {
      expect(calculateTrendPercentage(150, 100)).toBe(50);
      expect(calculateTrendPercentage(50, 100)).toBe(-50);
    });
  });

  describe("Date Range Functions", () => {
    it("should get date range for day", () => {
      const range = getDateRange("day");
      expect(range.startDate).toBeDefined();
      expect(range.endDate).toBeDefined();
    });

    it("should filter by date range correctly", () => {
      const items = [
        { createdAt: "2024-01-15", value: 100 },
        { createdAt: "2024-01-20", value: 200 },
        { createdAt: "2024-02-01", value: 300 },
      ];
      const filtered = filterByDateRange(
        items,
        new Date("2024-01-01"),
        new Date("2024-01-31"),
        "createdAt"
      );
      expect(filtered.length).toBe(2);
    });
  });

  describe("Filtering Functions", () => {
    it("should filter by status correctly", () => {
      const items = [
        { status: "active" },
        { status: "inactive" },
        { status: "active" },
      ];
      const filtered = filterByStatus(items, "active");
      expect(filtered.length).toBe(2);
    });

    it("should filter by vendor correctly", () => {
      const items = [
        { vendor: "A" },
        { vendor: "B" },
        { vendor: "A" },
      ];
      const filtered = filterByVendor(items, "A");
      expect(filtered.length).toBe(2);
    });
  });

  describe("Sorting Functions", () => {
    it("should sort by field ascending", () => {
      const items = [
        { name: "C" },
        { name: "A" },
        { name: "B" },
      ];
      const sorted = sortByField(items, "name", "asc");
      expect(sorted[0].name).toBe("A");
      expect(sorted[2].name).toBe("C");
    });

    it("should sort by field descending", () => {
      const items = [
        { name: "C" },
        { name: "A" },
        { name: "B" },
      ];
      const sorted = sortByField(items, "name", "desc");
      expect(sorted[0].name).toBe("C");
      expect(sorted[2].name).toBe("A");
    });
  });

  describe("Pagination Functions", () => {
    it("should paginate correctly", () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      const page1 = paginate(items, 10, 0);
      expect(page1.length).toBe(10);
      expect(page1[0].id).toBe(1);

      const page2 = paginate(items, 10, 10);
      expect(page2.length).toBe(10);
      expect(page2[0].id).toBe(11);
    });
  });

  describe("Export Functions", () => {
    it("should format for CSV correctly", () => {
      const data = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];
      const csv = formatForCSV(data);
      expect(csv).toContain("name,age");
      expect(csv).toContain("John");
    });

    it("should format for JSON correctly", () => {
      const data = [
        { name: "John", age: 30 },
      ];
      const json = formatForJSON(data);
      expect(json).toContain("John");
      expect(json).toContain("30");
    });
  });
});

describe("Analytics Utilities", () => {
  describe("Sales Analytics", () => {
    it("should calculate sales metrics correctly", () => {
      const orders = [
        { total: 1000 },
        { total: 2000 },
      ];
      const metrics = calculateSalesMetrics(orders);
      expect(metrics.totalSales).toBe(2);
      expect(metrics.totalRevenue).toBe(3000);
      expect(metrics.averageOrderValue).toBe(1500);
    });

    it("should calculate sales by category correctly", () => {
      const orders = [
        { category: "Electronics", total: 5000 },
        { category: "Fashion", total: 2000 },
      ];
      const sales = calculateSalesByCategory(orders);
      expect(sales.Electronics).toBe(1);
      expect(sales.Fashion).toBe(1);
    });
  });

  describe("Customer Analytics", () => {
    it("should calculate customer metrics correctly", () => {
      const customers = [
        { isNew: true, isReturning: false, isActive: true },
        { isNew: false, isReturning: true, isActive: true },
      ];
      const metrics = calculateCustomerMetrics(customers);
      expect(metrics.totalCustomers).toBe(2);
      expect(metrics.newCustomers).toBe(1);
      expect(metrics.returningCustomers).toBe(1);
    });
  });

  describe("Vendor Analytics", () => {
    it("should calculate vendor metrics correctly", () => {
      const vendors = [
        { rating: 4.5, sales: 100 },
        { rating: 4.0, sales: 200 },
      ];
      const metrics = calculateVendorMetrics(vendors);
      expect(metrics.totalVendors).toBe(2);
      expect(metrics.totalSales).toBe(300);
    });
  });

  describe("Product Analytics", () => {
    it("should calculate product metrics correctly", () => {
      const products = [
        { rating: 4.5, sales: 100 },
        { rating: 4.0, sales: 200 },
      ];
      const metrics = calculateProductMetrics(products);
      expect(metrics.totalProducts).toBe(2);
      expect(metrics.totalSales).toBe(300);
    });
  });

  describe("Revenue Analytics", () => {
    it("should calculate revenue metrics correctly", () => {
      const orders = [
        { total: 1000, tax: 120, commission: 100 },
        { total: 2000, tax: 240, commission: 200 },
      ];
      const metrics = calculateRevenueMetrics(orders);
      expect(metrics.totalRevenue).toBe(3000);
      expect(metrics.totalTax).toBe(360);
      expect(metrics.totalCommission).toBe(300);
      expect(metrics.netRevenue).toBe(2700);
    });

    it("should calculate revenue by payment method correctly", () => {
      const orders = [
        { paymentMethod: "GCash", total: 5000 },
        { paymentMethod: "PayMaya", total: 3000 },
      ];
      const revenue = calculateRevenueByPaymentMethod(orders);
      expect(revenue.GCash).toBe(5000);
      expect(revenue.PayMaya).toBe(3000);
    });
  });
});

