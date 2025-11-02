import type { Meta, StoryObj } from '@storybook/react';
import { RatingStars } from './rating-stars';

const meta = {
  title: 'Components/Reviews/RatingStars',
  component: RatingStars,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RatingStars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 4,
    readOnly: true,
    showLabel: true,
  },
};

export const Interactive: Story = {
  args: {
    value: 0,
    interactive: true,
    readOnly: false,
    showLabel: true,
  },
};

export const SmallSize: Story = {
  args: {
    value: 3.5,
    size: 'sm',
    readOnly: true,
    showLabel: true,
  },
};

export const LargeSize: Story = {
  args: {
    value: 5,
    size: 'lg',
    interactive: true,
    readOnly: false,
    showLabel: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    value: 4.5,
    readOnly: true,
    showLabel: false,
  },
};

export const FullRating: Story = {
  args: {
    value: 5,
    readOnly: true,
    showLabel: true,
  },
};

