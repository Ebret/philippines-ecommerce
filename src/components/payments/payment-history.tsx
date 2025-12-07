'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  History,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  RefreshCw,
} from 'lucide-react';
import {
  PaymentTransaction,
  PaymentStatusType,
  PaymentMethodType,
  PaymentStatusBadge,
  PaymentMethodBadge,
} from './payment-status-tracker';

// Filter options
const STATUS_OPTIONS: { value: PaymentStatusType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const METHOD_OPTIONS: { value: PaymentMethodType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Methods' },
  { value: 'GCASH', label: 'GCash' },
  { value: 'PAYMAYA', label: 'PayMaya' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'COD', label: 'Cash on Delivery' },
];

export interface PaymentHistoryProps {
  transactions: PaymentTransaction[];
  onViewTransaction?: (id: string) => void;
  onDownloadReceipt?: (id: string) => void;
  onRequestRefund?: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * PaymentHistory - Display payment transaction history
 */
export function PaymentHistory({
  transactions,
  onViewTransaction,
  onDownloadReceipt,
  onRequestRefund,
  isLoading = false,
  className = '',
}: PaymentHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusType | 'ALL'>('ALL');
  const [methodFilter, setMethodFilter] = useState<PaymentMethodType | 'ALL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((t) => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (methodFilter !== 'ALL' && t.method !== methodFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          t.transactionId.toLowerCase().includes(query) ||
          t.referenceCode.toLowerCase().includes(query) ||
          t.orderNumber.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Calculate totals
  const totalAmount = filteredTransactions
    .filter((t) => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Payment History</h3>
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                {totalAmount > 0 && ` • ₱${totalAmount.toLocaleString()} total`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
          >
            {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by transaction ID, reference, or order..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PaymentStatusType | 'ALL')}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as PaymentMethodType | 'ALL')}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {METHOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-border">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <History className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const isExpanded = expandedId === transaction.id;
            const canRefund = transaction.status === 'COMPLETED' && !transaction.refundAmount;

            return (
              <div key={transaction.id} className="hover:bg-muted/30 transition-colors">
                {/* Main Row */}
                <div
                  className="p-4 flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : transaction.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-foreground">{transaction.transactionId}</span>
                      <PaymentStatusBadge status={transaction.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Order #{transaction.orderNumber}</span>
                      <span>•</span>
                      <span>{format(new Date(transaction.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₱{transaction.totalAmount.toLocaleString()}</p>
                    <PaymentMethodBadge method={transaction.method} size="sm" showIcon={false} />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="p-4 rounded-lg bg-muted/30 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Reference Code</span>
                          <p className="font-mono text-foreground">{transaction.referenceCode}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount</span>
                          <p className="text-foreground">₱{transaction.amount.toLocaleString()}</p>
                        </div>
                        {transaction.processingFee > 0 && (
                          <div>
                            <span className="text-muted-foreground">Processing Fee</span>
                            <p className="text-foreground">₱{transaction.processingFee.toLocaleString()}</p>
                          </div>
                        )}
                        {transaction.processedAt && (
                          <div>
                            <span className="text-muted-foreground">Processed</span>
                            <p className="text-foreground">{format(new Date(transaction.processedAt), 'MMM d, yyyy h:mm a')}</p>
                          </div>
                        )}
                        {transaction.refundAmount && (
                          <div>
                            <span className="text-muted-foreground">Refunded</span>
                            <p className="text-purple-600 dark:text-purple-400">₱{transaction.refundAmount.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                      {transaction.failureReason && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Failure: {transaction.failureReason}
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        {onViewTransaction && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onViewTransaction(transaction.id); }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View
                          </button>
                        )}
                        {onDownloadReceipt && transaction.status === 'COMPLETED' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDownloadReceipt(transaction.id); }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            Receipt
                          </button>
                        )}
                        {onRequestRefund && canRefund && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onRequestRefund(transaction.id); }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Refund
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

export { STATUS_OPTIONS, METHOD_OPTIONS };

