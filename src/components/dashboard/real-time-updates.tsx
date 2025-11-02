import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Pause, Play, AlertCircle } from 'lucide-react';

export interface RealTimeData {
  id: string;
  timestamp: Date;
  value: any;
}

export interface RealTimeUpdatesProps {
  onFetchData: () => Promise<RealTimeData[]>;
  refreshInterval?: number; // in milliseconds
  autoStart?: boolean;
  onDataUpdate?: (data: RealTimeData[]) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

export const RealTimeUpdates: React.FC<RealTimeUpdatesProps> = ({
  onFetchData,
  refreshInterval = 5000,
  autoStart = true,
  onDataUpdate,
  onError,
  disabled = false,
  className = '',
}) => {
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [data, setData] = useState<RealTimeData[]>([]);

  const fetchData = useCallback(async () => {
    if (disabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const newData = await onFetchData();
      setData(newData);
      setLastUpdate(new Date());
      setUpdateCount((prev) => prev + 1);
      onDataUpdate?.(newData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onFetchData, onDataUpdate, onError, disabled]);

  useEffect(() => {
    if (!isRunning || disabled) return;

    // Fetch immediately on start
    fetchData();

    // Set up interval
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [isRunning, refreshInterval, fetchData, disabled]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleManualRefresh = () => {
    fetchData();
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusColor = (): string => {
    if (error) return 'text-red-600';
    if (isLoading) return 'text-yellow-600';
    if (isRunning) return 'text-green-600';
    return 'text-gray-600';
  };

  const getStatusLabel = (): string => {
    if (error) return 'Error';
    if (isLoading) return 'Updating...';
    if (isRunning) return 'Live';
    return 'Paused';
  };

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Last Update Time */}
      <div className="text-xs text-gray-600">
        Last: {formatTime(lastUpdate)}
      </div>

      {/* Update Count */}
      <div className="text-xs text-gray-600">
        Updates: {updateCount}
      </div>

      {/* Manual Refresh Button */}
      <button
        onClick={handleManualRefresh}
        disabled={disabled || isLoading}
        className="p-1 text-gray-600 hover:text-blue-600 disabled:text-gray-400 transition-colors"
        aria-label="Refresh data"
        title="Refresh now"
      >
        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={handleToggle}
        disabled={disabled}
        className="p-1 text-gray-600 hover:text-blue-600 disabled:text-gray-400 transition-colors"
        aria-label={isRunning ? 'Pause updates' : 'Resume updates'}
        title={isRunning ? 'Pause' : 'Resume'}
      >
        {isRunning ? <Pause size={16} /> : <Play size={16} />}
      </button>

      {/* Error Indicator */}
      {error && (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle size={16} />
          <span className="text-xs">{error.message}</span>
        </div>
      )}
    </div>
  );
};

export default RealTimeUpdates;

