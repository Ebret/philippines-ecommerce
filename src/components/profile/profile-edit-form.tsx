'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  province?: string;
  zipCode?: string;
}

interface ProfileEditFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    if (formData.zipCode && !/^\d{4,6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid zip code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('bg-card text-card-foreground rounded-lg shadow-md border border-border p-6 space-y-6', className)}
    >
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary',
                errors.name ? 'border-error' : 'border-border'
              )}
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary',
                errors.email ? 'border-error' : 'border-border'
              )}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary',
                errors.phone ? 'border-error' : 'border-border'
              )}
            />
            {errors.phone && (
              <p className="text-error text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          disabled={isSubmitting || isLoading}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Address Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Province
            </label>
            <input
              type="text"
              name="province"
              value={formData.province || ''}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode || ''}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary',
                errors.zipCode ? 'border-error' : 'border-border'
              )}
            />
            {errors.zipCode && (
              <p className="text-error text-sm mt-1">{errors.zipCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {isSubmitting || isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg font-semibold hover:bg-muted/80 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

