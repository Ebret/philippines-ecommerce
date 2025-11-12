'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { KPIWidget } from './kpi-widget';
import { AnalyticsChart } from './analytics-chart';
import { DataTable } from './data-table';
import { Tabs } from '@/components/ui/tabs';

interface VendorDashboardProps {
  vendorName: string;
  isLoading?: boolean;
  className?: string;
}

const VendorDashboard = React.forwardRef<HTMLDivElement, VendorDashboardProps>(
  ({ vendorName, isLoading = false, className }, ref) => {

    const mockSalesData = [
      { label: 'Mon', value: 12500 },
      { label: 'Tue', value: 15800 },
      { label: 'Wed', value: 14200 },
      { label: 'Thu', value: 18900 },
      { label: 'Fri', value: 22100 },
      { label: 'Sat', value: 25600 },
      { label: 'Sun', value: 19800 },
    ];

    const mockProductData = [
      { id: 1, name: 'Product A', sales: 245, revenue: 122500, rating: 4.5 },
      { id: 2, name: 'Product B', sales: 189, revenue: 94500, rating: 4.2 },
      { id: 3, name: 'Product C', sales: 156, revenue: 78000, rating: 4.8 },
      { id: 4, name: 'Product D', sales: 98, revenue: 49000, rating: 3.9 },
    ];

    const mockOrderData = [
      { id: 'ORD-001', customer: 'Maria Santos', amount: 5200, status: 'Completed', date: '2025-11-01' },
      { id: 'ORD-002', customer: 'Juan Dela Cruz', amount: 3800, status: 'Processing', date: '2025-11-01' },
      { id: 'ORD-003', customer: 'Rosa Garcia', amount: 7500, status: 'Shipped', date: '2025-10-31' },
      { id: 'ORD-004', customer: 'Carlos Reyes', amount: 2900, status: 'Pending', date: '2025-10-31' },
    ];

    return (
      <div ref={ref} className={cn('space-y-6', className)}>
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{vendorName} Dashboard</h1>
          <p className="mt-1 text-neutral-600">Welcome back! Here is your sales overview.</p>
        </div>

        {/* KPI Widgets */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPIWidget
            title="Total Sales"
            value="₱118,900"
            trend={{ value: 12, direction: 'up', label: 'vs last week' }}
            color="success"
            icon="📊"
          />
          <KPIWidget
            title="Total Orders"
            value="1,245"
            trend={{ value: 8, direction: 'up', label: 'vs last week' }}
            color="primary"
            icon="📦"
          />
          <KPIWidget
            title="Avg Rating"
            value="4.6"
            unit="/ 5"
            trend={{ value: 2, direction: 'up', label: 'vs last month' }}
            color="warning"
            icon="⭐"
          />
          <KPIWidget
            title="Conversion Rate"
            value="3.2"
            unit="%"
            trend={{ value: 0.5, direction: 'up', label: 'vs last week' }}
            color="info"
            icon="📈"
          />
        </div>

        {/* Tabs */}
        <Tabs
          items={[
            {
              id: 'overview',
              label: 'Overview',
              content: (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <AnalyticsChart
                    title="Sales This Week"
                    data={mockSalesData}
                    type="bar"
                    currency
                    height={300}
                  />
                  <AnalyticsChart
                    title="Sales by Category"
                    data={[
                      { label: 'Electronics', value: 45000 },
                      { label: 'Fashion', value: 32000 },
                      { label: 'Home', value: 28000 },
                      { label: 'Sports', value: 15900 },
                    ]}
                    type="pie"
                    height={300}
                  />
                </div>
              ),
            },
            {
              id: 'products',
              label: 'Products',
              content: (
                <DataTable
                  columns={[
                    { key: 'name', label: 'Product Name', sortable: true },
                    { key: 'sales', label: 'Sales', sortable: true },
                    {
                      key: 'revenue',
                      label: 'Revenue',
                      render: (value) => `₱${value.toLocaleString()}`,
                    },
                    {
                      key: 'rating',
                      label: 'Rating',
                      render: (value) => `${value} ⭐`,
                    },
                  ]}
                  data={mockProductData}
                  striped
                  hoverable
                />
              ),
            },
            {
              id: 'orders',
              label: 'Recent Orders',
              content: (
                <DataTable
                  columns={[
                    { key: 'id', label: 'Order ID', sortable: true },
                    { key: 'customer', label: 'Customer', sortable: true },
                    {
                      key: 'amount',
                      label: 'Amount',
                      render: (value) => `₱${value.toLocaleString()}`,
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      render: (value) => {
                        const statusColors = {
                          Completed: 'success',
                          Processing: 'info',
                          Shipped: 'warning',
                          Pending: 'secondary',
                        };
                        return (
                          <span className={`text-xs font-medium text-${statusColors[value as keyof typeof statusColors]}-700`}>
                            {value}
                          </span>
                        );
                      },
                    },
                    { key: 'date', label: 'Date', sortable: true },
                  ]}
                  data={mockOrderData}
                  striped
                  hoverable
                />
              ),
            },
          ]}
          defaultTab="overview"
        />
      </div>
    );
  }
);
VendorDashboard.displayName = 'VendorDashboard';

export { VendorDashboard };

