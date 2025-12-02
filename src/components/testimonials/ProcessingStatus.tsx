/**
 * ProcessingStatus Component
 * Upload and processing progress indicator
 */

'use client';

import { useState, useEffect } from 'react';

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress?: number;
  error?: string;
}

interface ProcessingStatusProps {
  steps: ProcessingStep[];
  isProcessing?: boolean;
  onCancel?: () => void;
  estimatedTime?: number; // in seconds
}

export function ProcessingStatus({
  steps,
  isProcessing = false,
  onCancel,
  estimatedTime,
}: ProcessingStatusProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '⟳';
      case 'error':
        return '✕';
      default:
        return '○';
    }
  };

  const getStepColor = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-primary animate-spin';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const totalSteps = steps.length;
  const overallProgress = (completedSteps / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-foreground">Processing Progress</h3>
          <span className="text-sm text-muted-foreground">
            {completedSteps}/{totalSteps} steps
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Time Info */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Elapsed: {formatTime(elapsedTime)}</span>
          {estimatedTime && (
            <span>Estimated: {formatTime(estimatedTime)}</span>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="space-y-2">
            {/* Step Header */}
            <div className="flex items-center gap-3">
              <span className={`text-xl ${getStepColor(step.status)}`}>
                {getStepIcon(step.status)}
              </span>
              <span className="font-medium text-foreground">{step.name}</span>
              {step.progress !== undefined && step.status === 'in-progress' && (
                <span className="text-sm text-muted-foreground">({step.progress}%)</span>
              )}
            </div>

            {/* Step Progress Bar */}
            {step.progress !== undefined && step.status === 'in-progress' && (
              <div className="ml-8 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            )}

            {/* Error Message */}
            {step.error && (
              <div className="ml-8 p-3 bg-error/10 border border-error/30 rounded text-error text-sm">
                {step.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cancel Button */}
      {isProcessing && onCancel && (
        <div className="flex justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-error hover:bg-error/80 text-white rounded-lg transition-colors"
          >
            Cancel Processing
          </button>
        </div>
      )}

      {/* Completion Message */}
      {!isProcessing && completedSteps === totalSteps && (
        <div className="p-4 bg-success/10 border border-success/30 rounded-lg text-success text-center">
          ✓ Processing completed successfully!
        </div>
      )}

      {/* Error Message */}
      {!isProcessing && steps.some((s) => s.status === 'error') && (
        <div className="p-4 bg-error/10 border border-error/30 rounded-lg text-error text-center">
          ✕ Processing failed. Please try again.
        </div>
      )}
    </div>
  );
}

