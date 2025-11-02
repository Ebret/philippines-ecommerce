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
  customer: 'bg-blue-100 text-blue-800',
  vendor: 'bg-purple-100 text-purple-800',
  admin: 'bg-red-100 text-red-800',
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
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
        'bg-white rounded-lg shadow-md overflow-hidden border border-gray-200',
        className
      )}
    >
      {/* Header Background */}
      <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600" />

      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-4 -mt-12 mb-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
              {profile.name.charAt(0)}
            </div>
          )}

          <div className="flex-1 pt-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              {profile.verified && (
                <span className="text-blue-600" title="Verified">
                  ✓
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{profile.email}</p>
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
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
          {profile.totalOrders !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.totalOrders}
              </p>
              <p className="text-xs text-gray-600">Orders</p>
            </div>
          )}
          {profile.totalSpent !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                ₱{(profile.totalSpent / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-gray-600">Total Spent</p>
            </div>
          )}
          {profile.rating !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.rating.toFixed(1)}
              </p>
              <p className="text-xs text-gray-600">Rating</p>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="py-4 space-y-2">
          {profile.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-semibold">Phone:</span>
              <span>{profile.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-semibold">Joined:</span>
            <span>{joinedDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
          {onMessage && (
            <button
              onClick={onMessage}
              className="flex-1 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
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
                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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

