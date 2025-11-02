import type { Meta, StoryObj } from '@storybook/react';
import { RealTimeUpdates } from './real-time-updates';

const meta = {
  title: 'Components/Dashboard/RealTimeUpdates',
  component: RealTimeUpdates,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RealTimeUpdates>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockFetchData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: '1', timestamp: new Date(), value: Math.random() * 100 },
    { id: '2', timestamp: new Date(), value: Math.random() * 100 },
  ];
};

const mockFetchSalesData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: 'sales', timestamp: new Date(), value: Math.floor(Math.random() * 100000) },
  ];
};

const mockFetchOrderData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: 'orders', timestamp: new Date(), value: Math.floor(Math.random() * 500) },
  ];
};

const mockFetchWithError = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  throw new Error('Failed to fetch data');
};

export const Default: Story = {
  args: {
    onFetchData: mockFetchData,
    refreshInterval: 5000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Data updated:', data);
    },
  },
};

export const AutoStartEnabled: Story = {
  args: {
    onFetchData: mockFetchData,
    refreshInterval: 5000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Auto-started data update:', data);
    },
  },
};

export const AutoStartDisabled: Story = {
  args: {
    onFetchData: mockFetchData,
    refreshInterval: 5000,
    autoStart: false,
    onDataUpdate: (data) => {
      console.log('Manual data update:', data);
    },
  },
};

export const FastRefresh: Story = {
  args: {
    onFetchData: mockFetchData,
    refreshInterval: 2000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Fast refresh data:', data);
    },
  },
};

export const SlowRefresh: Story = {
  args: {
    onFetchData: mockFetchData,
    refreshInterval: 10000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Slow refresh data:', data);
    },
  },
};

export const SalesMonitoring: Story = {
  args: {
    onFetchData: mockFetchSalesData,
    refreshInterval: 5000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Sales data updated:', data);
    },
  },
};

export const OrderTracking: Story = {
  args: {
    onFetchData: mockFetchOrderData,
    refreshInterval: 3000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Order data updated:', data);
    },
  },
};

export const WithErrorHandling: Story = {
  args: {
    onFetchData: mockFetchWithError,
    refreshInterval: 5000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Data updated:', data);
    },
    onError: (error) => {
      console.error('Error fetching data:', error.message);
    },
  },
};

export const Disabled: Story = {
  args: {
    onFetchData: mockFetchData,
    refreshInterval: 5000,
    autoStart: false,
    disabled: true,
  },
};

export const InventoryMonitoring: Story = {
  args: {
    onFetchData: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        { id: 'inventory', timestamp: new Date(), value: Math.floor(Math.random() * 10000) },
      ];
    },
    refreshInterval: 5000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Inventory data updated:', data);
    },
  },
};

export const CustomerActivityMonitoring: Story = {
  args: {
    onFetchData: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        { id: 'active-users', timestamp: new Date(), value: Math.floor(Math.random() * 1000) },
      ];
    },
    refreshInterval: 3000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Customer activity updated:', data);
    },
  },
};

export const PerformanceMetrics: Story = {
  args: {
    onFetchData: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        { id: 'cpu', timestamp: new Date(), value: Math.random() * 100 },
        { id: 'memory', timestamp: new Date(), value: Math.random() * 100 },
        { id: 'disk', timestamp: new Date(), value: Math.random() * 100 },
      ];
    },
    refreshInterval: 5000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Performance metrics updated:', data);
    },
  },
};

export const DashboardLiveData: Story = {
  args: {
    onFetchData: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        { id: 'sales', timestamp: new Date(), value: Math.floor(Math.random() * 100000) },
        { id: 'orders', timestamp: new Date(), value: Math.floor(Math.random() * 500) },
        { id: 'customers', timestamp: new Date(), value: Math.floor(Math.random() * 1000) },
      ];
    },
    refreshInterval: 5000,
    autoStart: true,
    onDataUpdate: (data) => {
      console.log('Dashboard live data updated:', data);
    },
  },
};

