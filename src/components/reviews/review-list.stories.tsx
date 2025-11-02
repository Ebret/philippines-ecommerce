import type { Meta, StoryObj } from '@storybook/react';
import { ReviewList } from './review-list';

const meta = {
  title: 'Components/Reviews/ReviewList',
  component: ReviewList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReviewList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockReviews = [
  {
    id: 'review-1',
    rating: 5,
    title: 'Excellent Product!',
    content: 'This product exceeded my expectations. Highly recommended!',
    author: { name: 'Maria Santos', id: 'user-1' },
    createdAt: '2025-11-01',
    helpfulCount: 12,
    unhelpfulCount: 1,
    isVerifiedPurchase: true,
  },
  {
    id: 'review-2',
    rating: 4,
    title: 'Very Good',
    content: 'Great quality and fast delivery. Very satisfied with my purchase.',
    author: { name: 'Juan Dela Cruz', id: 'user-2' },
    createdAt: '2025-10-28',
    helpfulCount: 8,
    unhelpfulCount: 0,
    isVerifiedPurchase: true,
  },
  {
    id: 'review-3',
    rating: 3,
    title: 'Average',
    content: 'It is okay, nothing special. Does what it is supposed to do.',
    author: { name: 'Rosa Garcia', id: 'user-3' },
    createdAt: '2025-10-25',
    helpfulCount: 5,
    unhelpfulCount: 2,
    isVerifiedPurchase: true,
  },
];

export const Default: Story = {
  args: {
    reviews: mockReviews,
    sortBy: 'recent',
    currentPage: 1,
    totalPages: 3,
  },
};

export const WithPagination: Story = {
  args: {
    reviews: mockReviews,
    sortBy: 'recent',
    currentPage: 2,
    totalPages: 5,
  },
};

export const SortedByHelpful: Story = {
  args: {
    reviews: mockReviews,
    sortBy: 'helpful',
    currentPage: 1,
    totalPages: 1,
  },
};

export const SortedByRatingHigh: Story = {
  args: {
    reviews: mockReviews,
    sortBy: 'rating-high',
    currentPage: 1,
    totalPages: 1,
  },
};

export const Loading: Story = {
  args: {
    reviews: [],
    isLoading: true,
    sortBy: 'recent',
    currentPage: 1,
    totalPages: 1,
  },
};

export const Empty: Story = {
  args: {
    reviews: [],
    isLoading: false,
    sortBy: 'recent',
    currentPage: 1,
    totalPages: 1,
  },
};

export const SingleReview: Story = {
  args: {
    reviews: [mockReviews[0]],
    sortBy: 'recent',
    currentPage: 1,
    totalPages: 1,
  },
};

export const ManyReviews: Story = {
  args: {
    reviews: Array.from({ length: 10 }, (_, i) => ({
      ...mockReviews[i % mockReviews.length],
      id: `review-${i}`,
    })),
    sortBy: 'recent',
    currentPage: 1,
    totalPages: 2,
  },
};

