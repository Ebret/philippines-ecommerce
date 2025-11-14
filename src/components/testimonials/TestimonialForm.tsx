/**
 * TestimonialForm Component
 * Form for creating and editing testimonials with validation
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Validation schema
const TestimonialSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters').max(5000, 'Content must be less than 5000 characters'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  authorName: z.string().min(2, 'Author name must be at least 2 characters').max(100, 'Author name must be less than 100 characters'),
  authorEmail: z.string().email('Invalid email address'),
  authorRole: z.string().optional(),
  companyName: z.string().optional(),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  photoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type TestimonialFormData = z.infer<typeof TestimonialSchema>;

interface TestimonialFormProps {
  initialData?: Partial<TestimonialFormData>;
  onSubmit: (data: TestimonialFormData) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function TestimonialForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEditing = false,
}: TestimonialFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(TestimonialSchema),
    defaultValues: initialData || {
      rating: 5,
    },
  });

  const onSubmitHandler = async (data: TestimonialFormData) => {
    try {
      setSubmitError(null);
      await onSubmit(data);
      if (!isEditing) {
        reset();
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6 max-w-2xl">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {submitError}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <Input
          id="title"
          placeholder="Enter testimonial title"
          {...register('title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <Textarea
          id="content"
          placeholder="Enter your testimonial content"
          rows={6}
          {...register('content')}
          className={errors.content ? 'border-red-500' : ''}
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
      </div>

      {/* Rating */}
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
          Rating (1-5) *
        </label>
        <select
          id="rating"
          {...register('rating', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={1}>1 - Poor</option>
          <option value={2}>2 - Fair</option>
          <option value={3}>3 - Good</option>
          <option value={4}>4 - Very Good</option>
          <option value={5}>5 - Excellent</option>
        </select>
        {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
      </div>

      {/* Author Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
            Author Name *
          </label>
          <Input
            id="authorName"
            placeholder="Your name"
            {...register('authorName')}
            className={errors.authorName ? 'border-red-500' : ''}
          />
          {errors.authorName && <p className="text-red-500 text-sm mt-1">{errors.authorName.message}</p>}
        </div>

        <div>
          <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            id="authorEmail"
            type="email"
            placeholder="your@email.com"
            {...register('authorEmail')}
            className={errors.authorEmail ? 'border-red-500' : ''}
          />
          {errors.authorEmail && <p className="text-red-500 text-sm mt-1">{errors.authorEmail.message}</p>}
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="authorRole" className="block text-sm font-medium text-gray-700 mb-2">
            Role/Position
          </label>
          <Input
            id="authorRole"
            placeholder="e.g., Manager, CEO"
            {...register('authorRole')}
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <Input
            id="companyName"
            placeholder="Your company"
            {...register('companyName')}
          />
        </div>
      </div>

      {/* Media URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <Input
            id="videoUrl"
            type="url"
            placeholder="https://example.com/video.mp4"
            {...register('videoUrl')}
            className={errors.videoUrl ? 'border-red-500' : ''}
          />
          {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl.message}</p>}
        </div>

        <div>
          <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Photo URL
          </label>
          <Input
            id="photoUrl"
            type="url"
            placeholder="https://example.com/photo.jpg"
            {...register('photoUrl')}
            className={errors.photoUrl ? 'border-red-500' : ''}
          />
          {errors.photoUrl && <p className="text-red-500 text-sm mt-1">{errors.photoUrl.message}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? 'Submitting...' : isEditing ? 'Update Testimonial' : 'Create Testimonial'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isLoading}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}

