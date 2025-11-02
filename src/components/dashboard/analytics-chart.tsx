'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnalyticsChartProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  currency?: boolean;
  className?: string;
}

const AnalyticsChart = React.forwardRef<HTMLDivElement, AnalyticsChartProps>(
  (
    {
      title,
      data,
      type = 'bar',
      height = 300,
      showLegend = true,
      showGrid = true,
      currency = false,
      className,
    },
    ref
  ) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    const formatValue = (value: number) => {
      if (currency) {
        return `₱${(value / 1000).toFixed(1)}k`;
      }
      return value.toLocaleString();
    };

    const getBarHeight = (value: number) => {
      return ((value - minValue) / range) * 100;
    };

    return (
      <div ref={ref} className={cn('rounded-lg border border-neutral-200 bg-white p-4', className)}>
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">{title}</h3>

        {type === 'bar' && (
          <div style={{ height: `${height}px` }} className="flex items-end gap-2">
            {data.map((point, index) => (
              <div key={index} className="flex-1">
                <div className="flex h-full flex-col justify-end">
                  <div
                    className={cn(
                      'w-full rounded-t transition-all hover:opacity-80',
                      point.color || 'bg-primary-600'
                    )}
                    style={{ height: `${getBarHeight(point.value)}%` }}
                    title={`${point.label}: ${formatValue(point.value)}`}
                  />
                </div>
                <p className="mt-2 text-center text-xs text-neutral-600">{point.label}</p>
              </div>
            ))}
          </div>
        )}

        {type === 'line' && (
          <svg width="100%" height={height} className="mt-4">
            {showGrid && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <line
                    key={`grid-${i}`}
                    x1="0"
                    y1={(height / 4) * i}
                    x2="100%"
                    y2={(height / 4) * i}
                    stroke="#e5e7eb"
                    strokeDasharray="4"
                  />
                ))}
              </>
            )}
            <polyline
              points={data
                .map((point, index) => {
                  const x = (index / (data.length - 1 || 1)) * 100 + '%';
                  const y = height - (getBarHeight(point.value) / 100) * height;
                  return `${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
          </svg>
        )}

        {type === 'pie' && (
          <div className="flex items-center justify-center gap-8">
            <div className="relative h-48 w-48">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {data.map((point, index) => {
                  const total = data.reduce((sum, d) => sum + d.value, 0);
                  const percentage = (point.value / total) * 100;
                  const startAngle = data
                    .slice(0, index)
                    .reduce((sum, d) => sum + (d.value / total) * 360, 0);
                  const endAngle = startAngle + (percentage / 100) * 360;

                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;

                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);

                  const largeArc = percentage > 50 ? 1 : 0;

                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={point.color || `hsl(${(index * 360) / data.length}, 70%, 60%)`}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
            {showLegend && (
              <div className="space-y-2">
                {data.map((point, index) => {
                  const total = data.reduce((sum, d) => sum + d.value, 0);
                  const percentage = ((point.value / total) * 100).toFixed(1);
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            point.color || `hsl(${(index * 360) / data.length}, 70%, 60%)`,
                        }}
                      />
                      <span className="text-sm text-neutral-700">
                        {point.label}: {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {showLegend && type !== 'pie' && (
          <div className="mt-4 flex flex-wrap gap-4 border-t border-neutral-200 pt-4">
            {data.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: point.color || '#3b82f6' }}
                />
                <span className="text-xs text-neutral-600">
                  {point.label}: {formatValue(point.value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
AnalyticsChart.displayName = 'AnalyticsChart';

export { AnalyticsChart };

