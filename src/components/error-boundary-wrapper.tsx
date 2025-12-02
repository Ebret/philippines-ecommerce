'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from './error-boundary';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

/**
 * Client-side wrapper for ErrorBoundary to be used in server components
 */
export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
          console.error('App Error:', error);
          console.error('Error Info:', errorInfo);
        }
        
        // In production, you could send this to an error tracking service
        // Example: sendToErrorTracking(error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

