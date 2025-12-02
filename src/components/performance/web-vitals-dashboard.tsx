'use client';

import { useWebVitals, formatMetricValue, getMetricDescription, WEB_VITALS_THRESHOLDS } from '@/hooks/use-web-vitals';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RefreshCw, Activity, Gauge, Clock, Layout, MousePointer, Zap } from 'lucide-react';

/**
 * Web Vitals Dashboard Component
 * 
 * Displays Core Web Vitals metrics with visual indicators:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */

const metricIcons: Record<string, React.ReactNode> = {
  LCP: <Gauge className="w-5 h-5" />,
  CLS: <Layout className="w-5 h-5" />,
  FCP: <Zap className="w-5 h-5" />,
  TTFB: <Clock className="w-5 h-5" />,
  INP: <MousePointer className="w-5 h-5" />,
};

const ratingColors = {
  good: 'text-success bg-success/10 border-success/30',
  'needs-improvement': 'text-warning bg-warning/10 border-warning/30',
  poor: 'text-error bg-error/10 border-error/30',
};

const ratingBadgeVariants = {
  good: 'inStock' as const,
  'needs-improvement': 'accent' as const,
  poor: 'discount' as const,
};

interface WebVitalsDashboardProps {
  className?: string;
  compact?: boolean;
}

export function WebVitalsDashboard({ className, compact = false }: WebVitalsDashboardProps) {
  const { metrics, isLoading, overallScore, refresh } = useWebVitals();

  // Core Web Vitals order (FID deprecated in web-vitals v5, replaced by INP)
  const metricOrder = ['LCP', 'CLS', 'INP', 'FCP', 'TTFB'];
  const sortedMetrics = metricOrder
    .filter((name) => metrics[name])
    .map((name) => metrics[name]);

  return (
    <Card className={cn('p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Web Vitals</h2>
            <p className="text-sm text-muted-foreground">Core performance metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {overallScore && (
            <Badge variant={ratingBadgeVariants[overallScore]} size="sm">
              {overallScore === 'good' ? 'Excellent' : overallScore === 'needs-improvement' ? 'Needs Work' : 'Poor'}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
            {!compact && 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && sortedMetrics.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Collecting metrics...</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      {sortedMetrics.length > 0 && (
        <div className={cn(
          'grid gap-4',
          compact ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}>
          {sortedMetrics.map((metric) => (
            <MetricCard key={metric.name} metric={metric} compact={compact} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sortedMetrics.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No metrics collected yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Interact with the page to collect performance data
          </p>
        </div>
      )}
    </Card>
  );
}

interface MetricCardProps {
  metric: {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  compact?: boolean;
}

function MetricCard({ metric, compact }: MetricCardProps) {
  const thresholds = WEB_VITALS_THRESHOLDS[metric.name as keyof typeof WEB_VITALS_THRESHOLDS];
  const percentage = Math.min((metric.value / thresholds.poor) * 100, 100);

  return (
    <div className={cn('p-4 rounded-lg border', ratingColors[metric.rating])}>
      <div className="flex items-center gap-2 mb-2">
        {metricIcons[metric.name]}
        <span className="font-medium">{metric.name}</span>
      </div>
      <div className="text-2xl font-bold mb-1">
        {formatMetricValue(metric.name, metric.value)}
      </div>
      {!compact && (
        <>
          <p className="text-xs opacity-80 mb-3">
            {getMetricDescription(metric.name)}
          </p>
          {/* Progress bar */}
          <div className="h-2 bg-background/50 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                metric.rating === 'good' && 'bg-success',
                metric.rating === 'needs-improvement' && 'bg-warning',
                metric.rating === 'poor' && 'bg-error'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 opacity-60">
            <span>Good: ≤{metric.name === 'CLS' ? thresholds.good : `${thresholds.good}ms`}</span>
            <span>Poor: &gt;{metric.name === 'CLS' ? thresholds.poor : `${thresholds.poor}ms`}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default WebVitalsDashboard;
