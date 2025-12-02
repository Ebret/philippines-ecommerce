/**
 * TestimonialCard Component
 * Card component to display individual testimonials
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';

interface TestimonialCardProps {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorName: string;
  authorRole?: string;
  companyName?: string;
  thumbnailUrl?: string;
  mediaType?: 'video' | 'photo';
  createdAt: Date | string;
  featured?: boolean;
}

export function TestimonialCard({
  id,
  title,
  content,
  rating,
  authorName,
  authorRole,
  companyName,
  thumbnailUrl,
  mediaType,
  createdAt,
  featured = false,
}: TestimonialCardProps) {
  const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

  const formatTimeAgo = (d: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const timeAgo = formatTimeAgo(date);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-accent' : 'text-muted-foreground/30'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <Link href={`/testimonials/${id}`}>
      <div
        className={`group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-card ${
          featured ? 'ring-2 ring-primary' : ''
        }`}
      >
        {/* Thumbnail */}
        {thumbnailUrl && (
          <div className="relative w-full h-48 bg-muted overflow-hidden">
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {mediaType && (
              <div className="absolute top-2 right-2 bg-foreground/60 text-background px-2 py-1 rounded text-xs font-medium">
                {mediaType === 'video' ? '🎥 Video' : '📷 Photo'}
              </div>
            )}
            {featured && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                ⭐ Featured
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {renderStars(rating)}
            <span className="text-sm text-muted-foreground">({rating}/5)</span>
          </div>

          {/* Content Preview */}
          <p className="text-muted-foreground text-sm line-clamp-2">
            {content}
          </p>

          {/* Author Info */}
          <div className="space-y-1 border-t border-border pt-3">
            <p className="font-medium text-foreground">{authorName}</p>
            {(authorRole || companyName) && (
              <p className="text-sm text-muted-foreground">
                {authorRole && <span>{authorRole}</span>}
                {authorRole && companyName && <span> at </span>}
                {companyName && <span>{companyName}</span>}
              </p>
            )}
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

