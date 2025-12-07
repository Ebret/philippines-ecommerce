/**
 * ReviewModeration Component
 * Phase 26.4.3: Product Review Moderation
 * 
 * Features:
 * - Review approval/rejection workflow
 * - Spam detection
 * - Bulk moderation actions
 * - Review analytics
 */

'use client';

import { useState, useMemo } from 'react';
import { 
  MessageSquare, Star, Check, X, Flag, Trash2, 
  Eye, Filter, Search, AlertTriangle, ThumbsUp, ThumbsDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportCount: number;
  createdAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  moderationNote?: string;
}

interface ReviewModerationProps {
  reviews: ProductReview[];
  onApprove: (reviewId: string, note?: string) => void;
  onReject: (reviewId: string, note?: string) => void;
  onFlag: (reviewId: string, reason: string) => void;
  onDelete: (reviewId: string) => void;
  onBulkAction: (reviewIds: string[], action: 'approve' | 'reject' | 'delete') => void;
  className?: string;
}

export function ReviewModeration({
  reviews,
  onApprove,
  onReject,
  onFlag,
  onDelete,
  onBulkAction,
  className,
}: ReviewModerationProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<ProductReview['status'] | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [moderationNote, setModerationNote] = useState('');

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
      const matchesSearch = !searchQuery || 
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [reviews, statusFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    flagged: reviews.filter(r => r.status === 'flagged').length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  }), [reviews]);

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select all filtered
  const selectAll = () => {
    if (selectedIds.size === filteredReviews.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredReviews.map(r => r.id)));
    }
  };

  // Handle bulk action
  const handleBulkAction = (action: 'approve' | 'reject' | 'delete') => {
    onBulkAction(Array.from(selectedIds), action);
    setSelectedIds(new Set());
  };

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4',
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  // Get status badge
  const getStatusBadge = (status: ProductReview['status']) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      flagged: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return (
      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', styles[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Flagged</p>
          <p className="text-2xl font-bold text-orange-600">{stats.flagged}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Avg Rating</p>
          <p className="text-2xl font-bold">{stats.avgRating} ⭐</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected', 'flagged'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')}>
            <Check className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>
            <X className="w-4 h-4 mr-1" />
            Reject
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {/* Select All */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedIds.size === filteredReviews.length && filteredReviews.length > 0}
            onChange={selectAll}
            className="rounded border-border"
          />
          <span className="text-sm">Select all ({filteredReviews.length})</span>
        </label>

        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No reviews found</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div
              key={review.id}
              className={cn(
                'border border-border rounded-lg overflow-hidden',
                selectedIds.has(review.id) && 'ring-2 ring-primary'
              )}
            >
              {/* Review Header */}
              <div className="flex items-center gap-4 p-4 bg-muted/30">
                <input
                  type="checkbox"
                  checked={selectedIds.has(review.id)}
                  onChange={() => toggleSelect(review.id)}
                  className="rounded border-border"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.isVerifiedPurchase && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs">
                        Verified Purchase
                      </span>
                    )}
                    {getStatusBadge(review.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.productName}</p>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(review.createdAt)}</p>
                </div>
              </div>

              {/* Review Content */}
              <div className="p-4">
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-sm text-muted-foreground">{review.content}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded" />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {review.helpfulCount} helpful
                  </span>
                  {review.reportCount > 0 && (
                    <span className="flex items-center gap-1 text-red-500">
                      <Flag className="w-4 h-4" />
                      {review.reportCount} reports
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 p-4 bg-muted/30 border-t border-border">
                {review.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => onApprove(review.id)}>
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onReject(review.id)}>
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={() => onFlag(review.id, 'spam')}>
                  <Flag className="w-4 h-4 mr-1" />
                  Flag
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(review.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

