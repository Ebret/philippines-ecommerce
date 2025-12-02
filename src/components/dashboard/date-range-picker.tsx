import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DateRangePickerProps {
  onDateRangeChange: (range: DateRange) => void;
  initialRange?: DateRange;
  disabled?: boolean;
  className?: string;
}

const PRESET_RANGES = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This month', days: 'month' },
  { label: 'Last month', days: 'lastMonth' },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
  initialRange,
  disabled = false,
  className = '',
}) => {
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const defaultEnd = today;

  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(initialRange?.startDate || defaultStart);
  const [endDate, setEndDate] = useState(initialRange?.endDate || defaultEnd);
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth()));
  const [selectingEnd, setSelectingEnd] = useState(false);

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const applyPreset = (days: number | string) => {
    let start = new Date();
    let end = new Date();

    if (days === 0) {
      start = new Date();
      end = new Date();
    } else if (days === 'month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = today;
    } else if (days === 'lastMonth') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (typeof days === 'number') {
      start = new Date(today);
      start.setDate(start.getDate() - days);
      end = today;
    }

    setStartDate(start);
    setEndDate(end);
    onDateRangeChange({ startDate: start, endDate: end });
    setIsOpen(false);
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (!selectingEnd) {
      setStartDate(selectedDate);
      setSelectingEnd(true);
    } else {
      if (selectedDate < startDate) {
        setEndDate(startDate);
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
      setSelectingEnd(false);
      onDateRangeChange({ startDate, endDate: selectedDate });
    }
  };

  const handleApply = () => {
    onDateRangeChange({ startDate, endDate });
    setIsOpen(false);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isInRange = date >= startDate && date <= endDate;
      const isStart = date.toDateString() === startDate.toDateString();
      const isEnd = date.toDateString() === endDate.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-2 text-sm rounded transition-colors ${
            isStart || isEnd
              ? 'bg-primary text-primary-foreground font-semibold'
              : isInRange
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-muted text-foreground'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Select date range"
      >
        <Calendar size={18} />
        <span className="text-sm">
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-card text-card-foreground rounded-lg shadow-lg border border-border z-50 p-4">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Select Date Range</h3>

          {/* Preset Ranges */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            {PRESET_RANGES.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset.days)}
                className="py-2 px-3 text-sm bg-muted text-foreground rounded hover:bg-muted/80 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
                className="p-1 hover:bg-background rounded transition-colors text-foreground"
              >
                <ChevronLeft size={18} />
              </button>
              <h4 className="font-semibold text-foreground">
                {currentMonth.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h4>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
                className="p-1 hover:bg-background rounded transition-colors text-foreground"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>

          {/* Selected Range Display */}
          <div className="mb-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>From:</strong> {formatDate(startDate)}
            </p>
            <p className="text-sm text-foreground">
              <strong>To:</strong> {formatDate(endDate)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="flex-1 py-2 px-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Apply
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 px-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

