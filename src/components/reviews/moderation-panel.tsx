'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RatingStars } from './rating-stars';

interface PendingReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: {
    name: string;
    id: string;
  };
  createdAt: string;
  reason?: string;
  flagCount?: number;
}

interface ModerationPanelProps {
  reviews: PendingReview[];
  isLoading?: boolean;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string, reason: string) => void;
  className?: string;
}

const ModerationPanel = React.forwardRef<HTMLDivElement, ModerationPanelProps>(
  ({ reviews, isLoading = false, onApprove, onReject, className }, ref) => {
    const [selectedReview, setSelectedReview] = React.useState<string | null>(null);
    const [rejectReason, setRejectReason] = React.useState('');

    const handleReject = (reviewId: string) => {
      if (rejectReason.trim()) {
        onReject?.(reviewId, rejectReason);
        setRejectReason('');
        setSelectedReview(null);
      }
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            Review Moderation ({reviews.length})
          </h3>
          <Badge variant="warning">{reviews.length} Pending</Badge>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 py-8 text-center">
            <p className="text-neutral-600">No reviews pending moderation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-neutral-200 bg-white p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-neutral-900">{review.title}</h4>
                      {review.flagCount && review.flagCount > 0 && (
                        <Badge variant="error" className="text-xs">
                          Flagged {review.flagCount}x
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">
                      by {review.author.name} • {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <RatingStars value={review.rating} readOnly showLabel={false} size="sm" />
                </div>

                <p className="mb-3 text-sm text-neutral-700">{review.content}</p>

                {review.reason && (
                  <div className="mb-3 rounded-lg bg-yellow-50 p-2 text-xs text-yellow-800">
                    <strong>Flag Reason:</strong> {review.reason}
                  </div>
                )}

                {selectedReview === review.id ? (
                  <div className="space-y-2 rounded-lg bg-neutral-50 p-3">
                    <label className="block text-xs font-medium text-neutral-700">
                      Rejection Reason
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Explain why this review is being rejected..."
                      rows={3}
                      className="w-full rounded border border-neutral-200 px-2 py-1 text-xs focus:border-primary-600 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedReview(null);
                          setRejectReason('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(review.id)}
                        disabled={!rejectReason.trim()}
                      >
                        Confirm Reject
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onApprove?.(review.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedReview(review.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
ModerationPanel.displayName = 'ModerationPanel';

export { ModerationPanel };

