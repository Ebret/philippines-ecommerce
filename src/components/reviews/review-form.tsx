'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { RatingStars } from './rating-stars';
import { Button } from '@/components/ui/button';

interface ReviewFormProps {
  productId: string;
  onSubmit?: (data: {
    rating: number;
    title: string;
    content: string;
    images?: string[];
  }) => void;
  isLoading?: boolean;
  className?: string;
}

const ReviewForm = React.forwardRef<HTMLFormElement, ReviewFormProps>(
  ({ productId, onSubmit, isLoading = false, className }, ref) => {
    const [rating, setRating] = React.useState(0);
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [images, setImages] = React.useState<string[]>([]);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validateForm = () => {
      const newErrors: Record<string, string> = {};

      if (rating === 0) {
        newErrors.rating = 'Please select a rating';
      }
      if (!title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!content.trim()) {
        newErrors.content = 'Review content is required';
      }
      if (content.trim().length < 10) {
        newErrors.content = 'Review must be at least 10 characters';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (validateForm()) {
        onSubmit?.({
          rating,
          title,
          content,
          images: images.length > 0 ? images : undefined,
        });

        // Reset form
        setRating(0);
        setTitle('');
        setContent('');
        setImages([]);
      }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
        setImages([...images, ...newImages].slice(0, 5)); // Max 5 images
      }
    };

    const removeImage = (index: number) => {
      setImages(images.filter((_, i) => i !== index));
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn('space-y-4 rounded-lg border border-neutral-200 bg-white p-6', className)}
      >
        <h3 className="text-lg font-semibold text-neutral-900">Write a Review</h3>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Rating *
          </label>
          <RatingStars
            value={rating}
            interactive
            readOnly={false}
            onRatingChange={setRating}
            size="lg"
          />
          {errors.rating && <p className="mt-1 text-xs text-red-600">{errors.rating}</p>}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
            Review Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none"
            maxLength={100}
          />
          <p className="mt-1 text-xs text-neutral-500">{title.length}/100</p>
          {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-2">
            Review Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your detailed experience with this product"
            rows={5}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none resize-none"
            maxLength={1000}
          />
          <p className="mt-1 text-xs text-neutral-500">{content.length}/1000</p>
          {errors.content && <p className="text-xs text-red-600">{errors.content}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Add Images (Optional - Max 5)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={images.length >= 5}
              className="hidden"
            />
            <label
              htmlFor="images"
              className={cn(
                'rounded-lg border-2 border-dashed border-neutral-300 px-4 py-2 text-sm font-medium transition-colors',
                images.length < 5
                  ? 'cursor-pointer hover:border-primary-600 hover:bg-primary-50'
                  : 'cursor-not-allowed opacity-50'
              )}
            >
              Choose Images
            </label>
            <span className="text-xs text-neutral-500">{images.length}/5</span>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    );
  }
);
ReviewForm.displayName = 'ReviewForm';

export { ReviewForm };

