import type { Meta, StoryObj } from '@storybook/react';
import { ModerationPanel } from './moderation-panel';

const meta = {
  title: 'Components/Reviews/ModerationPanel',
  component: ModerationPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ModerationPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPendingReviews = [
  {
    id: 'pending-1',
    rating: 1,
    title: 'Spam Review',
    content: 'Buy cheap products here at our website',
    author: { name: 'Spammer User', id: 'spam-1' },
    createdAt: '2025-11-01T10:30:00',
    flagCount: 3,
    reason: 'Spam content detected',
  },
  {
    id: 'pending-2',
    rating: 5,
    title: 'Great Product',
    content: 'This is a legitimate review about the product quality',
    author: { name: 'Real User', id: 'user-1' },
    createdAt: '2025-11-01T09:15:00',
    flagCount: 0,
  },
  {
    id: 'pending-3',
    rating: 2,
    title: 'Inappropriate Language',
    content: 'This product is [inappropriate content]',
    author: { name: 'Flagged User', id: 'user-2' },
    createdAt: '2025-11-01T08:00:00',
    flagCount: 2,
    reason: 'Inappropriate language',
  },
];

export const Default: Story = {
  args: {
    reviews: mockPendingReviews,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    reviews: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    reviews: [],
    isLoading: false,
  },
};

export const SingleReview: Story = {
  args: {
    reviews: [mockPendingReviews[0]],
    isLoading: false,
  },
};

export const HighlyFlagged: Story = {
  args: {
    reviews: [
      {
        id: 'pending-4',
        rating: 1,
        title: 'Highly Flagged Review',
        content: 'This review has been flagged multiple times by users',
        author: { name: 'Suspicious User', id: 'user-3' },
        createdAt: '2025-11-01T07:00:00',
        flagCount: 10,
        reason: 'Multiple flags for inappropriate content',
      },
    ],
    isLoading: false,
  },
};

export const ManyPending: Story = {
  args: {
    reviews: Array.from({ length: 8 }, (_, i) => ({
      ...mockPendingReviews[i % mockPendingReviews.length],
      id: `pending-${i}`,
    })),
    isLoading: false,
  },
};

export const NoFlags: Story = {
  args: {
    reviews: [
      {
        id: 'pending-5',
        rating: 4,
        title: 'Good Product',
        content: 'This is a legitimate review without any flags',
        author: { name: 'Trusted User', id: 'user-4' },
        createdAt: '2025-11-01T06:00:00',
        flagCount: 0,
      },
    ],
    isLoading: false,
  },
};

