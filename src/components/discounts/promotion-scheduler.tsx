'use client';

/**
 * Promotion Scheduler Component
 * Phase 26.2.4: Promotion Campaign Scheduler
 * 
 * Schedule and manage promotional campaigns with calendar view.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, Plus, ChevronLeft, ChevronRight, RefreshCw,
  Clock, Tag, Zap, Ticket
} from 'lucide-react';

// Types for promotions
export interface ScheduledPromotion {
  id: string;
  name: string;
  type: 'DISCOUNT' | 'COUPON' | 'FLASH_SALE' | 'CAMPAIGN';
  startDate: string;
  endDate: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDED';
  description?: string;
}

interface PromotionSchedulerProps {
  onCreatePromotion?: () => void;
  onSelectPromotion?: (promotion: ScheduledPromotion) => void;
  className?: string;
}

export function PromotionScheduler({
  onCreatePromotion,
  onSelectPromotion,
  className,
}: PromotionSchedulerProps) {
  const [promotions, setPromotions] = useState<ScheduledPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch promotions
  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;

      const response = await fetch(`/api/promotions/schedule?year=${year}&month=${month}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setPromotions(data.promotions || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      // Mock data for demo
      setPromotions([
        {
          id: 'promo-1',
          name: 'Holiday Sale',
          type: 'CAMPAIGN',
          startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15).toISOString(),
          endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 25).toISOString(),
          status: 'SCHEDULED',
        },
        {
          id: 'promo-2',
          name: 'Flash Friday',
          type: 'FLASH_SALE',
          startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 20).toISOString(),
          endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 20).toISOString(),
          status: 'SCHEDULED',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  // Navigate months
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DISCOUNT': return <Tag className="h-3 w-3" />;
      case 'COUPON': return <Ticket className="h-3 w-3" />;
      case 'FLASH_SALE': return <Zap className="h-3 w-3" />;
      default: return <CalendarDays className="h-3 w-3" />;
    }
  };

  // Get days in month
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    
    return days;
  };

  // Get promotions for a day
  const getPromotionsForDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return promotions.filter(p => {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return date >= start && date <= end;
    });
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Promotion Calendar</h3>
        </div>
        <Button onClick={onCreatePromotion} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Schedule
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <Button variant="ghost" size="sm" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="p-4">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div
                key={index}
                className={cn(
                  'min-h-[60px] p-1 rounded border border-transparent',
                  day && 'hover:border-border cursor-pointer',
                  day === new Date().getDate() &&
                  currentMonth.getMonth() === new Date().getMonth() &&
                  currentMonth.getFullYear() === new Date().getFullYear() &&
                  'bg-primary/10'
                )}
              >
                {day && (
                  <>
                    <span className="text-xs text-muted-foreground">{day}</span>
                    <div className="space-y-0.5 mt-1">
                      {getPromotionsForDay(day).slice(0, 2).map(promo => (
                        <div
                          key={promo.id}
                          className={cn(
                            'text-[10px] px-1 py-0.5 rounded truncate flex items-center gap-1',
                            promo.type === 'FLASH_SALE' && 'bg-amber-500/20 text-amber-700',
                            promo.type === 'DISCOUNT' && 'bg-blue-500/20 text-blue-700',
                            promo.type === 'COUPON' && 'bg-green-500/20 text-green-700',
                            promo.type === 'CAMPAIGN' && 'bg-purple-500/20 text-purple-700'
                          )}
                          onClick={() => onSelectPromotion?.(promo)}
                        >
                          {getTypeIcon(promo.type)}
                          <span className="truncate">{promo.name}</span>
                        </div>
                      ))}
                      {getPromotionsForDay(day).length > 2 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{getPromotionsForDay(day).length - 2} more
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

