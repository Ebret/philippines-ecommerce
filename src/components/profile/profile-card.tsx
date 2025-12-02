'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'vendor' | 'admin';
  joinDate: Date;
  totalOrders?: number;
  totalSpent?: number;
  rating?: number;
  verified?: boolean;
  status: 'active' | 'inactive' | 'suspended';
}

interface ProfileCardProps {
  profile: UserProfile;
  onEdit?: () => void;
  onMessage?: () => void;
  onFollow?: () => void;
  isFollowing?: boolean;
  className?: string;
}

const roleColors = {
  customer: 'bg-info/10 text-info',
  vendor: 'bg-accent/20 text-accent-foreground',
  admin: 'bg-error/10 text-error',
};

const statusColors = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-muted text-muted-foreground',
  suspended: 'bg-error/10 text-error',
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onEdit,
  onMessage,
  onFollow,
  isFollowing = false,
  className,
}) => {
  const joinedDate = new Date(profile.joinDate).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-lg shadow-md overflow-hidden border border-border',
        className
      )}
    >
      {/* Header Background */}
      <div className="h-24 bg-gradient-to-r from-primary to-primary-dark" />

      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-4 -mt-12 mb-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full border-4 border-card shadow-md object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-card shadow-md bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
              {profile.name.charAt(0)}
            </div>
          )}

          <div className="flex-1 pt-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              {profile.verified && (
                <span className="text-primary" title="Verified">
                  ✓
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="flex gap-2 mt-2">
              <span
                className={cn(
                  'px-2 py-1 rounded text-xs font-semibold',
                  roleColors[profile.role]
                )}
              >
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
              <span
                className={cn(
                  'px-2 py-1 rounded text-xs font-semibold',
                  statusColors[profile.status]
                )}
              >
                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
          {profile.totalOrders !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {profile.totalOrders}
              </p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </div>
          )}
          {profile.totalSpent !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                ₱{(profile.totalSpent / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
          )}
          {profile.rating !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {profile.rating.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="py-4 space-y-2">
          {profile.phone && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <span className="font-semibold">Phone:</span>
              <span>{profile.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-foreground">
            <span className="font-semibold">Joined:</span>
            <span>{joinedDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Edit Profile
            </button>
          )}
          {onMessage && (
            <button
              onClick={onMessage}
              className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
            >
              Message
            </button>
          )}
          {onFollow && (
            <button
              onClick={onFollow}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-semibold transition-colors',
                isFollowing
                  ? 'bg-muted text-foreground hover:bg-muted/80'
                  : 'bg-primary text-primary-foreground hover:bg-primary-dark'
              )}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

