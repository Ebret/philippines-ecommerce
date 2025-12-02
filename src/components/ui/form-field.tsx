'use client';

import React, { useState, useId } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

/**
 * Enhanced Form Field Component
 * 
 * Provides polished form validation feedback with:
 * - Smooth animated transitions for error messages
 * - Visual status indicators (error, success, info)
 * - Accessible labels and descriptions
 * - Dark mode support
 * 
 * @example
 * <FormField
 *   label="Email"
 *   error={errors.email?.message}
 *   success={isValid}
 *   hint="We'll never share your email"
 * >
 *   <Input {...register('email')} />
 * </FormField>
 */

export interface FormFieldProps {
  children: React.ReactNode;
  /** Field label text */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Show success state */
  success?: boolean;
  /** Success message */
  successMessage?: string;
  /** Help text/hint shown below the field */
  hint?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Additional class names */
  className?: string;
  /** Disable animations */
  disableAnimations?: boolean;
}

export function FormField({
  children,
  label,
  error,
  success,
  successMessage = 'Looks good!',
  hint,
  required = false,
  className,
  disableAnimations = false,
}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Determine the current state
  const hasError = Boolean(error);
  const hasSuccess = success && !hasError;
  const showHint = hint && !hasError && !hasSuccess;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            hasError ? 'text-error' : hasSuccess ? 'text-success' : 'text-foreground'
          )}
        >
          {label}
          {required && (
            <span className="text-error ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Input wrapper with visual feedback border */}
      <div className="relative">
        {React.cloneElement(children as React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>, {
          id,
          'aria-describedby': hasError ? errorId : hint ? hintId : undefined,
          'aria-invalid': hasError ? 'true' : undefined,
          className: cn(
            (children as React.ReactElement<{ className?: string }>).props.className,
            hasError && 'border-error focus-visible:ring-error/50',
            hasSuccess && 'border-success focus-visible:ring-success/50'
          ),
        })}

        {/* Status icon indicator */}
        {(hasError || hasSuccess) && (
          <div
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none',
              !disableAnimations && 'animate-in fade-in zoom-in-50 duration-200'
            )}
          >
            {hasError ? (
              <AlertCircle className="w-5 h-5 text-error" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-success" aria-hidden="true" />
            )}
          </div>
        )}
      </div>

      {/* Message area with smooth transitions */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          (hasError || hasSuccess || showHint) ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {/* Error message */}
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className={cn(
              'flex items-center gap-1.5 text-sm text-error',
              !disableAnimations && 'animate-in slide-in-from-top-1 fade-in duration-200'
            )}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}

        {/* Success message */}
        {hasSuccess && successMessage && (
          <p
            className={cn(
              'flex items-center gap-1.5 text-sm text-success',
              !disableAnimations && 'animate-in slide-in-from-top-1 fade-in duration-200'
            )}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{successMessage}</span>
          </p>
        )}

        {/* Hint text */}
        {showHint && (
          <p
            id={hintId}
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Info className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{hint}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default FormField;

