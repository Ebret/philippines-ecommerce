import type { Meta, StoryObj } from '@storybook/react';
import { ReviewCard } from './review-card';

const meta = {
  title: 'Components/Reviews/ReviewCard',
  component: ReviewCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'review-1',
    rating: 4,
    title: 'Great Product!',
    content:
      'This product exceeded my expectations. The quality is excellent and it arrived quickly. Highly recommended!',
    author: {
      name: 'Maria Santos',
      id: 'user-1',
    },
    createdAt: '2025-11-01',
    helpfulCount: 12,
    unhelpfulCount: 1,
    isVerifiedPurchase: true,
  },
};

export const HighRating: Story = {
  args: {
    id: 'review-2',
    rating: 5,
    title: 'Perfect!',
    content: 'Absolutely perfect! This is exactly what I was looking for. Best purchase ever!',
    author: {
      name: 'Juan Dela Cruz',
      id: 'user-2',
    },
    createdAt: '2025-10-28',
    helpfulCount: 45,
    unhelpfulCount: 2,
    isVerifiedPurchase: true,
  },
};

export const LowRating: Story = {
  args: {
    id: 'review-3',
    rating: 2,
    title: 'Not as described',
    content:
      'The product quality is not as described in the listing. It broke after a few days of use.',
    author: {
      name: 'Rosa Garcia',
      id: 'user-3',
    },
    createdAt: '2025-10-25',
    helpfulCount: 23,
    unhelpfulCount: 5,
    isVerifiedPurchase: true,
  },
};

export const WithoutVerification: Story = {
  args: {
    id: 'review-4',
    rating: 3,
    title: 'Average product',
    content: 'It is okay, nothing special. Does what it is supposed to do.',
    author: {
      name: 'Anonymous User',
      id: 'user-4',
    },
    createdAt: '2025-10-20',
    helpfulCount: 5,
    unhelpfulCount: 2,
    isVerifiedPurchase: false,
  },
};

export const ManyHelpfulVotes: Story = {
  args: {
    id: 'review-5',
    rating: 5,
    title: 'Everyone should buy this!',
    content:
      'This is the best product I have ever purchased. It is worth every peso. I have already recommended it to all my friends and family.',
    author: {
      name: 'Carlos Reyes',
      id: 'user-5',
    },
    createdAt: '2025-10-15',
    helpfulCount: 156,
    unhelpfulCount: 3,
    isVerifiedPurchase: true,
  },
};

export const LongReview: Story = {
  args: {
    id: 'review-6',
    rating: 4,
    title: 'Detailed Review',
    content: `This product is really good. I have been using it for about a month now and I am very satisfied with my purchase. 
    
The quality is excellent and it is very durable. The design is sleek and modern. It fits perfectly in my home. 
    
The only minor issue is that the instructions could be clearer, but overall it is a great product. I would definitely recommend it to anyone looking for something like this. 
    
Highly satisfied with my purchase and the customer service was excellent as well.`,
    author: {
      name: 'Ana Fernandez',
      id: 'user-6',
    },
    createdAt: '2025-10-10',
    helpfulCount: 34,
    unhelpfulCount: 1,
    isVerifiedPurchase: true,
  },
};

