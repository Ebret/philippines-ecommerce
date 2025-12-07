'use client';

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  Package,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Truck,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
} from 'lucide-react';
import { OrderStatusBadge, PaymentStatusBadge, OrderStatus, PaymentStatus } from './order-status-badge';

// Admin order interface
export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  currency: string;
  itemCount: number;
  vendorName: string;
  createdAt: string;
}

// Dashboard statistics
export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface AdminOrderDashboardProps {
  orders: AdminOrder[];
  stats: OrderStats;
  isLoading?: boolean;
  onViewOrder?: (orderId: string) => void;
  onEditOrder?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => Promise<void>;
  onExport?: (format: 'csv' | 'json') => void;
  onRefresh?: () => void;
  className?: string;
}

// Status options for bulk actions
const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

/**
 * AdminOrderDashboard - Admin dashboard for managing orders
 */
export function AdminOrderDashboard({
  orders,
  stats,
  isLoading = false,
  onViewOrder,
  onEditOrder,
  onUpdateStatus,
  onExport,
  onRefresh,
  className = '',
}: AdminOrderDashboardProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'PHP') => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency }).format(amount);
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'ALL') {
      result = result.filter((order) => order.status === statusFilter);
    }
    
    result.sort((a, b) => {
      const aVal = sortBy === 'amount' ? a.totalAmount : new Date(a.createdAt).getTime();
      const bVal = sortBy === 'amount' ? b.totalAmount : new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(paginatedOrders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // Handle select single
  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  // Stats cards data
  const statsCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Processing', value: stats.processingOrders, icon: Package, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Shipped', value: stats.shippedOrders, icon: Truck, color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="rounded-lg border border-border bg-card p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
            className="p-2 rounded-lg border border-border bg-background"
          >
            <option value="ALL">All Status</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={() => onExport('csv')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                </th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Order</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Payment</th>
                <th className="p-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading orders...</td></tr>
              ) : paginatedOrders.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No orders found</td></tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-foreground">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.itemCount} items</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </td>
                    <td className="p-3"><OrderStatusBadge status={order.status} size="sm" /></td>
                    <td className="p-3"><PaymentStatusBadge status={order.paymentStatus} size="sm" /></td>
                    <td className="p-3 text-right font-medium">{formatCurrency(order.totalAmount, order.currency)}</td>
                    <td className="p-3 text-sm text-muted-foreground">{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        {onViewOrder && (
                          <button onClick={() => onViewOrder(order.id)} className="p-1.5 rounded hover:bg-muted" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEditOrder && (
                          <button onClick={() => onEditOrder(order.id)} className="p-1.5 rounded hover:bg-muted" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded text-sm ${currentPage === page ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

