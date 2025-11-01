import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Generate a URL-friendly slug from store name
 */
export function generateVendorSlug(storeName: string): string {
  return storeName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

/**
 * Check if vendor slug is unique
 */
export async function isVendorSlugUnique(slug: string, excludeVendorId?: string): Promise<boolean> {
  const existing = await prisma.vendor.findFirst({
    where: {
      storeSlug: slug,
      ...(excludeVendorId && { id: { not: excludeVendorId } }),
    },
  });
  return !existing;
}

/**
 * Get vendor with all relations
 */
export async function getVendorWithRelations(vendorId: string) {
  return prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          status: true,
        },
      },
      profile: true,
      products: {
        select: {
          id: true,
          name: true,
          status: true,
          totalSales: true,
        },
        take: 5,
      },
    },
  });
}

/**
 * Calculate vendor commission from order total
 */
export function calculateCommission(
  orderTotal: Decimal | number,
  commissionRate: Decimal | number
): Decimal {
  const total = typeof orderTotal === "number" ? new Decimal(orderTotal) : orderTotal;
  const rate = typeof commissionRate === "number" ? new Decimal(commissionRate) : commissionRate;
  return total.mul(rate).div(100);
}

/**
 * Calculate vendor earnings (order total - commission)
 */
export function calculateVendorEarnings(
  orderTotal: Decimal | number,
  commissionRate: Decimal | number
): Decimal {
  const total = typeof orderTotal === "number" ? new Decimal(orderTotal) : orderTotal;
  const commission = calculateCommission(total, commissionRate);
  return total.sub(commission);
}

/**
 * Get vendor statistics
 */
export async function getVendorStats(vendorId: string) {
  const [totalProducts, activeProducts, totalSales, totalOrders, avgRating] = await Promise.all([
    prisma.product.count({
      where: { vendorId },
    }),
    prisma.product.count({
      where: { vendorId, status: "ACTIVE" },
    }),
    prisma.product.aggregate({
      where: { vendorId },
      _sum: { totalSales: true },
    }),
    prisma.order.count({
      where: { vendorId },
    }),
    prisma.product.aggregate({
      where: { vendorId },
      _avg: { rating: true },
    }),
  ]);

  return {
    totalProducts,
    activeProducts,
    totalSales: totalSales._sum.totalSales || 0,
    totalOrders,
    avgRating: avgRating._avg.rating || 0,
  };
}

/**
 * Get vendor earnings summary
 */
export async function getVendorEarnings(vendorId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await prisma.order.findMany({
    where: {
      vendorId,
      createdAt: { gte: startDate },
      status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
    },
    include: {
      vendor: {
        select: { commissionRate: true },
      },
    },
  });

  let totalEarnings = new Decimal(0);
  let totalCommission = new Decimal(0);

  for (const order of orders) {
    const commission = calculateCommission(order.total, order.vendor.commissionRate);
    const earnings = calculateVendorEarnings(order.total, order.vendor.commissionRate);
    totalCommission = totalCommission.add(commission);
    totalEarnings = totalEarnings.add(earnings);
  }

  return {
    totalEarnings: totalEarnings.toNumber(),
    totalCommission: totalCommission.toNumber(),
    orderCount: orders.length,
    period: `Last ${days} days`,
  };
}

/**
 * Get vendor dashboard data
 */
export async function getVendorDashboard(vendorId: string) {
  const [stats, earnings, recentOrders, topProducts] = await Promise.all([
    getVendorStats(vendorId),
    getVendorEarnings(vendorId, 30),
    prisma.order.findMany({
      where: { vendorId },
      include: {
        user: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      where: { vendorId, status: "ACTIVE" },
      orderBy: { totalSales: "desc" },
      take: 5,
    }),
  ]);

  return {
    stats,
    earnings,
    recentOrders,
    topProducts,
  };
}

/**
 * Update vendor status
 */
export async function updateVendorStatus(
  vendorId: string,
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED"
) {
  return prisma.vendor.update({
    where: { id: vendorId },
    data: { status },
  });
}

/**
 * Get pending vendors for approval
 */
export async function getPendingVendors(limit: number = 20, offset: number = 0) {
  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where: { status: "PENDING" },
      include: {
        user: { select: { email: true, phone: true } },
        profile: true,
      },
      orderBy: { createdAt: "asc" },
      skip: offset,
      take: limit,
    }),
    prisma.vendor.count({ where: { status: "PENDING" } }),
  ]);

  return { vendors, total };
}

/**
 * Get vendor by slug
 */
export async function getVendorBySlug(slug: string) {
  return prisma.vendor.findUnique({
    where: { storeSlug: slug },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
        },
      },
      profile: true,
      products: {
        where: { status: "ACTIVE" },
        select: {
          id: true,
          name: true,
          slug: true,
          rating: true,
          totalSales: true,
        },
        take: 10,
      },
    },
  });
}

/**
 * Search vendors
 */
export async function searchVendors(
  query?: string,
  status?: string,
  minRating?: number,
  limit: number = 20,
  offset: number = 0
) {
  const where: any = {};

  if (query) {
    where.OR = [
      { storeName: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (minRating !== undefined) {
    where.rating = { gte: minRating };
  }

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      include: {
        user: { select: { email: true } },
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.vendor.count({ where }),
  ]);

  return { vendors, total };
}

/**
 * Get vendor commission history
 */
export async function getVendorCommissionHistory(vendorId: string, limit: number = 50) {
  const orders = await prisma.order.findMany({
    where: { vendorId },
    include: {
      vendor: { select: { commissionRate: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return orders.map((order) => ({
    orderId: order.id,
    orderTotal: order.total.toNumber(),
    commissionRate: order.vendor.commissionRate.toNumber(),
    commission: calculateCommission(order.total, order.vendor.commissionRate).toNumber(),
    earnings: calculateVendorEarnings(order.total, order.vendor.commissionRate).toNumber(),
    status: order.status,
    date: order.createdAt,
  }));
}

