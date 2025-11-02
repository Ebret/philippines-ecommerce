import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './search-bar';

const meta = {
  title: 'Search/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSuggestions = [
  'Wireless Headphones',
  'Wireless Mouse',
  'Wireless Keyboard',
  'Wireless Charger',
  'Wireless Speaker',
  'Wireless Earbuds',
  'Wireless Router',
  'Wireless Adapter',
];

export const Default: Story = {
  args: {
    placeholder: 'Search products...',
    suggestions: mockSuggestions,
    onSearch: (query) => console.log('Search:', query),
  },
};

export const WithSuggestions: Story = {
  args: {
    placeholder: 'Search products...',
    suggestions: mockSuggestions,
    onSearch: (query) => console.log('Search:', query),
    onSuggestionSelect: (suggestion) => console.log('Selected:', suggestion),
  },
};

export const Loading: Story = {
  args: {
    placeholder: 'Search products...',
    suggestions: mockSuggestions,
    isLoading: true,
    onSearch: (query) => console.log('Search:', query),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Find your favorite items...',
    suggestions: mockSuggestions,
    onSearch: (query) => console.log('Search:', query),
  },
};

