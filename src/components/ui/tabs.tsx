import React from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  onChange,
  variant = 'default',
}) => {
  const [activeTab, setActiveTab] = React.useState(
    defaultTab || items[0]?.id || ''
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeItem = items.find((item) => item.id === activeTab);

  const tabButtonClasses = {
    default: (isActive: boolean) =>
      cn(
        'px-4 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'border-b-2 border-primary-600 text-primary-600'
          : 'text-neutral-600 hover:text-neutral-900'
      ),
    pills: (isActive: boolean) =>
      cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary-600 text-white'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
      ),
    underline: (isActive: boolean) =>
      cn(
        'px-4 py-2 text-sm font-medium transition-colors relative',
        isActive
          ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600'
          : 'text-neutral-600 hover:text-neutral-900'
      ),
  };

  return (
    <div className="w-full">
      {/* Tab List */}
      <div
        className={cn(
          'flex gap-2',
          variant === 'default' && 'border-b border-neutral-200'
        )}
        role="tablist"
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            disabled={item.disabled}
            className={cn(
              tabButtonClasses[variant](activeTab === item.id),
              item.disabled && 'cursor-not-allowed opacity-50'
            )}
            role="tab"
            aria-selected={activeTab === item.id}
            aria-controls={`panel-${item.id}`}
          >
            {item.icon && <span className="mr-2 inline-block">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeItem && (
        <div
          id={`panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={activeItem.id}
          className="mt-4"
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
};

export { Tabs };

