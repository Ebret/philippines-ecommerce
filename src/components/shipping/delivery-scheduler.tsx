'use client';

import React, { useState } from 'react';
import { format, addDays, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns';
import {
  Calendar,
  Clock,
  Sun,
  Sunset,
  Moon,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertCircle,
} from 'lucide-react';

// Time slot type
export type TimeSlotType = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'ANYTIME';

// Time slot configuration
const TIME_SLOT_CONFIG: Record<TimeSlotType, { label: string; time: string; icon: React.ElementType; color: string }> = {
  MORNING: { label: 'Morning', time: '8:00 AM - 12:00 PM', icon: Sun, color: 'text-amber-500' },
  AFTERNOON: { label: 'Afternoon', time: '12:00 PM - 5:00 PM', icon: Sunset, color: 'text-orange-500' },
  EVENING: { label: 'Evening', time: '5:00 PM - 9:00 PM', icon: Moon, color: 'text-indigo-500' },
  ANYTIME: { label: 'Anytime', time: 'All day', icon: Clock, color: 'text-gray-500' },
};

// Delivery schedule interface
export interface DeliverySchedule {
  date: string;
  timeSlot: TimeSlotType;
  specialInstructions?: string;
}

// Available slot interface
export interface AvailableSlot {
  date: string;
  slots: TimeSlotType[];
  isHoliday?: boolean;
  holidayName?: string;
}

export interface DeliverySchedulerProps {
  availableSlots: AvailableSlot[];
  selectedSchedule?: DeliverySchedule;
  onSelect: (schedule: DeliverySchedule) => void;
  minDate?: Date;
  maxDate?: Date;
  isLoading?: boolean;
  className?: string;
}

/**
 * DeliveryScheduler - Schedule delivery date and time slot
 */
export function DeliveryScheduler({
  availableSlots,
  selectedSchedule,
  onSelect,
  minDate = new Date(),
  maxDate = addDays(new Date(), 14),
  isLoading = false,
  className = '',
}: DeliverySchedulerProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfDay(minDate));
  const [specialInstructions, setSpecialInstructions] = useState(selectedSchedule?.specialInstructions || '');

  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Navigate weeks
  const goToPreviousWeek = () => {
    const newStart = addDays(currentWeekStart, -7);
    if (!isBefore(newStart, startOfDay(minDate))) {
      setCurrentWeekStart(newStart);
    }
  };

  const goToNextWeek = () => {
    const newStart = addDays(currentWeekStart, 7);
    if (!isAfter(newStart, maxDate)) {
      setCurrentWeekStart(newStart);
    }
  };

  // Check if date is available
  const getAvailableSlot = (date: Date): AvailableSlot | undefined => {
    return availableSlots.find(slot => isSameDay(new Date(slot.date), date));
  };

  // Handle date selection
  const handleDateSelect = (date: Date, slot: TimeSlotType) => {
    onSelect({
      date: format(date, 'yyyy-MM-dd'),
      timeSlot: slot,
      specialInstructions,
    });
  };

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Schedule Delivery</h3>
          <p className="text-sm text-muted-foreground">Choose your preferred delivery date and time</p>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button
          onClick={goToPreviousWeek}
          disabled={isBefore(addDays(currentWeekStart, -7), startOfDay(minDate))}
          className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium text-foreground">
          {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
        </span>
        <button
          onClick={goToNextWeek}
          disabled={isAfter(addDays(currentWeekStart, 7), maxDate)}
          className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Date Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDates.map((date) => {
            const availableSlot = getAvailableSlot(date);
            const isAvailable = availableSlot && availableSlot.slots.length > 0;
            const isSelected = selectedSchedule && isSameDay(new Date(selectedSchedule.date), date);
            const isPast = isBefore(date, startOfDay(new Date()));

            return (
              <div
                key={date.toISOString()}
                className={`text-center p-2 rounded-lg transition-colors ${
                  isPast ? 'opacity-50 cursor-not-allowed' :
                  isSelected ? 'bg-primary text-primary-foreground' :
                  isAvailable ? 'bg-muted hover:bg-muted/80 cursor-pointer' :
                  'bg-muted/30 cursor-not-allowed'
                }`}
              >
                <p className="text-xs text-muted-foreground">{format(date, 'EEE')}</p>
                <p className={`text-lg font-semibold ${isSelected ? 'text-primary-foreground' : ''}`}>
                  {format(date, 'd')}
                </p>
                {availableSlot?.isHoliday && (
                  <p className="text-xs text-red-500 truncate">{availableSlot.holidayName}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Time Slots */}
        {selectedSchedule && (
          <div className="mt-4">
            <h4 className="font-medium text-foreground mb-3">Select Time Slot</h4>
            <div className="grid grid-cols-2 gap-3">
              {(() => {
                const availableSlot = getAvailableSlot(new Date(selectedSchedule.date));
                const slots = availableSlot?.slots || [];

                return (Object.entries(TIME_SLOT_CONFIG) as [TimeSlotType, typeof TIME_SLOT_CONFIG[TimeSlotType]][]).map(([slot, config]) => {
                  const isAvailable = slots.includes(slot);
                  const isSelected = selectedSchedule.timeSlot === slot;
                  const Icon = config.icon;

                  return (
                    <button
                      key={slot}
                      onClick={() => isAvailable && handleDateSelect(new Date(selectedSchedule.date), slot)}
                      disabled={!isAvailable}
                      className={`p-3 rounded-lg border transition-colors text-left ${
                        isSelected ? 'border-primary bg-primary/5' :
                        isAvailable ? 'border-border hover:border-primary/50' :
                        'border-border opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${config.color}`} />
                        <span className="font-medium text-foreground">{config.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-primary ml-auto" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{config.time}</p>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Special Instructions */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => {
              setSpecialInstructions(e.target.value);
              if (selectedSchedule) {
                onSelect({ ...selectedSchedule, specialInstructions: e.target.value });
              }
            }}
            placeholder="E.g., Leave at the gate, call before delivery..."
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            rows={2}
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-muted/30 border-t border-border">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="w-4 h-4 mt-0.5" />
          <p>Delivery schedules are subject to availability. You will receive a confirmation once your order is dispatched.</p>
        </div>
      </div>
    </div>
  );
}

export { TIME_SLOT_CONFIG };

