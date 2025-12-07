/**
 * Product Analytics API
 * Phase 26.4.8: Product Analytics
 * 
 * Endpoints:
 * - GET: Get product analytics
 */

import { NextRequest, NextResponse } from 'next/server';

// GET - Get product analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const to = searchParams.get('to') || new Date().toISOString().split('T')[0];
    const sortBy = searchParams.get('sortBy') || 'revenue';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Mock analytics data - in production, aggregate from database
    const products = [
      {
        id: 'prod-1',
        name: 'Herbal Tea Blend',
        image: '/images/tea-1.jpg',
        views: 15420,
        addToCart: 2850,
        purchases: 1245,
        revenue: 372255,
        rating: 4.8,
        reviewCount: 156,
        conversionRate: 8.07,
        trend: 12.5,
      },
      {
        id: 'prod-2',
        name: 'Essential Oil Set',
        image: '/images/oil-1.jpg',
        views: 12350,
        addToCart: 2100,
        purchases: 890,
        revenue: 533110,
        rating: 4.6,
        reviewCount: 98,
        conversionRate: 7.21,
        trend: 8.3,
      },
      {
        id: 'prod-3',
        name: 'Herbal Capsules',
        image: '/images/capsule-1.jpg',
        views: 9870,
        addToCart: 1650,
        purchases: 720,
        revenue: 359280,
        rating: 4.5,
        reviewCount: 87,
        conversionRate: 7.29,
        trend: -2.1,
      },
      {
        id: 'prod-4',
        name: 'Organic Honey',
        image: '/images/honey-1.jpg',
        views: 8540,
        addToCart: 1420,
        purchases: 650,
        revenue: 194350,
        rating: 4.9,
        reviewCount: 124,
        conversionRate: 7.61,
        trend: 15.8,
      },
      {
        id: 'prod-5',
        name: 'Herbal Soap Set',
        image: '/images/soap-1.jpg',
        views: 7230,
        addToCart: 980,
        purchases: 420,
        revenue: 125580,
        rating: 4.4,
        reviewCount: 65,
        conversionRate: 5.81,
        trend: -5.2,
      },
    ];

    // Sort products
    const sorted = [...products].sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a] as number;
      const bVal = b[sortBy as keyof typeof b] as number;
      return bVal - aVal;
    }).slice(0, limit);

    // Calculate summary
    const summary = {
      totalViews: products.reduce((sum, p) => sum + p.views, 0),
      totalRevenue: products.reduce((sum, p) => sum + p.revenue, 0),
      totalOrders: products.reduce((sum, p) => sum + p.purchases, 0),
      avgConversionRate: products.reduce((sum, p) => sum + p.conversionRate, 0) / products.length,
      viewsTrend: 8.5,
      revenueTrend: 12.3,
      ordersTrend: 6.7,
      conversionTrend: 2.1,
    };

    return NextResponse.json({
      success: true,
      data: {
        products: sorted,
        summary,
        dateRange: { from, to },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

