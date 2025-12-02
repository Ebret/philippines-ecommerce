'use client';

import { useState, useCallback, useMemo } from 'react';

/**
 * Validation rule type
 */
export interface ValidationRule {
  /** Validation function - returns error message or null if valid */
  validate: (value: string) => string | null;
  /** When to run this validation */
  trigger?: 'blur' | 'change' | 'submit';
}

/**
 * Field validation state
 */
export interface FieldState {
  value: string;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
}

/**
 * Form validation options
 */
export interface UseFormValidationOptions<T extends Record<string, string>> {
  /** Initial form values */
  initialValues: T;
  /** Validation rules for each field */
  rules?: Partial<Record<keyof T, ValidationRule[]>>;
  /** Validate on blur (default: true) */
  validateOnBlur?: boolean;
  /** Validate on change (default: false) */
  validateOnChange?: boolean;
}

/**
 * Form validation return type
 */
export interface UseFormValidationReturn<T extends Record<string, string>> {
  /** Current form values */
  values: T;
  /** Field states with errors, touched, dirty flags */
  fields: Record<keyof T, FieldState>;
  /** Whether the entire form is valid */
  isValid: boolean;
  /** Whether any field has been touched */
  isTouched: boolean;
  /** Whether any field has been modified */
  isDirty: boolean;
  /** Set a field value */
  setValue: (field: keyof T, value: string) => void;
  /** Set field as touched (on blur) */
  setTouched: (field: keyof T) => void;
  /** Validate a single field */
  validateField: (field: keyof T) => string | null;
  /** Validate all fields */
  validateAll: () => boolean;
  /** Reset form to initial values */
  reset: () => void;
  /** Get props for an input field */
  getFieldProps: (field: keyof T) => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
  };
  /** Get validation state for a field */
  getFieldState: (field: keyof T) => {
    error: string | null;
    success: boolean;
    variant: 'default' | 'error' | 'success';
  };
}

/**
 * Custom hook for form validation with smooth transitions
 * 
 * Features:
 * - Real-time validation on blur and/or change
 * - Field-level and form-level validation
 * - Touched and dirty state tracking
 * - Easy integration with Input/Textarea components
 * 
 * @example
 * const { values, getFieldProps, getFieldState, validateAll } = useFormValidation({
 *   initialValues: { email: '', password: '' },
 *   rules: {
 *     email: [{ validate: (v) => !v.includes('@') ? 'Invalid email' : null }],
 *     password: [{ validate: (v) => v.length < 8 ? 'Min 8 characters' : null }],
 *   },
 * });
 */
export function useFormValidation<T extends Record<string, string>>({
  initialValues,
  rules = {},
  validateOnBlur = true,
  validateOnChange = false,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  // Initialize field states
  const createInitialFieldStates = useCallback(() => {
    const states: Record<string, FieldState> = {};
    for (const key of Object.keys(initialValues)) {
      states[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
        dirty: false,
        valid: true,
      };
    }
    return states as Record<keyof T, FieldState>;
  }, [initialValues]);

  const [fieldStates, setFieldStates] = useState<Record<keyof T, FieldState>>(
    createInitialFieldStates
  );

  // Validate a single field
  const validateField = useCallback(
    (field: keyof T): string | null => {
      const fieldRules = rules[field];
      if (!fieldRules) return null;

      const value = fieldStates[field].value;
      for (const rule of fieldRules) {
        const error = rule.validate(value);
        if (error) return error;
      }
      return null;
    },
    [rules, fieldStates]
  );

  // Set field value
  const setValue = useCallback(
    (field: keyof T, value: string) => {
      setFieldStates((prev) => {
        const newState = { ...prev };
        newState[field] = {
          ...newState[field],
          value,
          dirty: value !== initialValues[field],
        };

        // Validate on change if enabled
        if (validateOnChange) {
          const error = validateField(field);
          newState[field].error = error;
          newState[field].valid = !error;
        }

        return newState;
      });
    },
    [initialValues, validateOnChange, validateField]
  );

  // Set field as touched
  const setTouched = useCallback(
    (field: keyof T) => {
      setFieldStates((prev) => {
        const newState = { ...prev };
        newState[field] = { ...newState[field], touched: true };

        // Validate on blur if enabled
        if (validateOnBlur) {
          const error = validateField(field);
          newState[field].error = error;
          newState[field].valid = !error;
        }

        return newState;
      });
    },
    [validateOnBlur, validateField]
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    let isValid = true;
    setFieldStates((prev) => {
      const newState = { ...prev };
      for (const field of Object.keys(newState) as Array<keyof T>) {
        const fieldRules = rules[field];
        if (fieldRules) {
          for (const rule of fieldRules) {
            const error = rule.validate(newState[field].value);
            if (error) {
              newState[field] = { ...newState[field], error, valid: false, touched: true };
              isValid = false;
              break;
            }
          }
          if (!newState[field].error) {
            newState[field] = { ...newState[field], error: null, valid: true };
          }
        }
      }
      return newState;
    });
    return isValid;
  }, [rules]);

  // Reset form
  const reset = useCallback(() => {
    setFieldStates(createInitialFieldStates());
  }, [createInitialFieldStates]);

  // Get field props for input binding
  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: fieldStates[field].value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(field, e.target.value);
      },
      onBlur: () => setTouched(field),
    }),
    [fieldStates, setValue, setTouched]
  );

  // Get field validation state
  const getFieldState = useCallback(
    (field: keyof T) => {
      const state = fieldStates[field];
      const hasError = state.touched && state.error;
      const hasSuccess = state.touched && state.dirty && !state.error;
      return {
        error: hasError ? state.error : null,
        success: hasSuccess,
        variant: (hasError ? 'error' : hasSuccess ? 'success' : 'default') as 'default' | 'error' | 'success',
      };
    },
    [fieldStates]
  );

  // Computed values
  const values = useMemo(() => {
    const v: Record<string, string> = {};
    for (const key of Object.keys(fieldStates)) {
      v[key] = fieldStates[key as keyof T].value;
    }
    return v as T;
  }, [fieldStates]);

  const isValid = useMemo(
    () => Object.values(fieldStates).every((f) => f.valid),
    [fieldStates]
  );

  const isTouched = useMemo(
    () => Object.values(fieldStates).some((f) => f.touched),
    [fieldStates]
  );

  const isDirty = useMemo(
    () => Object.values(fieldStates).some((f) => f.dirty),
    [fieldStates]
  );

  return {
    values,
    fields: fieldStates,
    isValid,
    isTouched,
    isDirty,
    setValue,
    setTouched,
    validateField,
    validateAll,
    reset,
    getFieldProps,
    getFieldState,
  };
}

export default useFormValidation;
