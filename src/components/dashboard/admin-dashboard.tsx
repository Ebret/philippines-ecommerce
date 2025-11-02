'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { KPIWidget } from './kpi-widget';
import { AnalyticsChart } from './analytics-chart';
import { DataTable } from './data-table';
import { Tabs } from '@/components/ui/tabs';

interface AdminDashboardProps {
  isLoading?: boolean;
  className?: string;
}

const AdminDashboard = React.forwardRef<HTMLDivElement, AdminDashboardProps>(
  ({ isLoading = false, className }, ref) => {
    const [activeTab, setActiveTab] = React.useState('overview');

    const mockRevenueData = [
      { label: 'Week 1', value: 125000 },
      { label: 'Week 2', value: 158000 },
      { label: 'Week 3', value: 142000 },
      { label: 'Week 4', value: 189000 },
    ];

    const mockUserData = [
      { id: 1, name: 'Maria Santos', email: 'maria@example.com', role: 'Customer', status: 'Active' },
      { id: 2, name: 'Juan Dela Cruz', email: 'juan@example.com', role: 'Vendor', status: 'Active' },
      { id: 3, name: 'Rosa Garcia', email: 'rosa@example.com', role: 'Customer', status: 'Inactive' },
      { id: 4, name: 'Carlos Reyes', email: 'carlos@example.com', role: 'Admin', status: 'Active' },
    ];

    const mockVendorData = [
      { id: 1, name: 'Tech Store', sales: 45000, products: 156, rating: 4.7 },
      { id: 2, name: 'Fashion Hub', sales: 32000, products: 89, rating: 4.5 },
      { id: 3, name: 'Home Essentials', sales: 28000, products: 234, rating: 4.3 },
      { id: 4, name: 'Sports Zone', sales: 15900, products: 67, rating: 4.8 },
    ];

    return (
      <div ref={ref} className={cn('space-y-6', className)}>
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="mt-1 text-neutral-600">System overview and management tools</p>
        </div>

        {/* KPI Widgets */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPIWidget
            title="Total Revenue"
            value="₱614,000"
            trend={{ value: 15, direction: 'up', label: 'vs last month' }}
            color="success"
            icon="💰"
          />
          <KPIWidget
            title="Total Users"
            value="12,456"
            trend={{ value: 8, direction: 'up', label: 'vs last month' }}
            color="primary"
            icon="👥"
          />
          <KPIWidget
            title="Active Vendors"
            value="342"
            trend={{ value: 5, direction: 'up', label: 'vs last month' }}
            color="warning"
            icon="🏪"
          />
          <KPIWidget
            title="System Health"
            value="99.8"
            unit="%"
            trend={{ value: 0.2, direction: 'up', label: 'uptime' }}
            color="info"
            icon="✅"
          />
        </div>

        {/* Tabs */}
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'vendors', label: 'Vendors' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AnalyticsChart
              title="Revenue Trend"
              data={mockRevenueData}
              type="line"
              currency
              height={300}
            />
            <AnalyticsChart
              title="Platform Distribution"
              data={[
                { label: 'Customers', value: 8500 },
                { label: 'Vendors', value: 342 },
                { label: 'Admins', value: 12 },
              ]}
              type="pie"
              height={300}
            />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <DataTable
            columns={[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'role', label: 'Role', sortable: true },
              {
                key: 'status',
                label: 'Status',
                render: (value) => (
                  <span
                    className={cn(
                      'inline-block rounded-full px-2 py-1 text-xs font-medium',
                      value === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-neutral-100 text-neutral-800'
                    )}
                  >
                    {value}
                  </span>
                ),
              },
            ]}
            data={mockUserData}
            striped
            hoverable
          />
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <DataTable
            columns={[
              { key: 'name', label: 'Vendor Name', sortable: true },
              {
                key: 'sales',
                label: 'Total Sales',
                render: (value) => `₱${value.toLocaleString()}`,
              },
              { key: 'products', label: 'Products', sortable: true },
              {
                key: 'rating',
                label: 'Rating',
                render: (value) => `${value} ⭐`,
              },
            ]}
            data={mockVendorData}
            striped
            hoverable
          />
        )}
      </div>
    );
  }
);
AdminDashboard.displayName = 'AdminDashboard';

export { AdminDashboard };

