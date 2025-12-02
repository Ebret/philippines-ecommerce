import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input component variants for different validation states
 */
const inputVariants = {
  default: "border-input hover:border-primary/40 focus-visible:border-primary focus-visible:ring-primary/50",
  error: "border-error hover:border-error/80 focus-visible:border-error focus-visible:ring-error/50 pr-10",
  success: "border-success hover:border-success/80 focus-visible:border-success focus-visible:ring-success/50 pr-10",
} as const;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Validation state variant */
  variant?: keyof typeof inputVariants;
}

/**
 * Enhanced Input Component
 *
 * Features:
 * - Smooth transition animations on focus and hover
 * - Validation state variants (default, error, success)
 * - Accessible focus indicators
 * - Dark mode support
 *
 * @example
 * <Input placeholder="Email" variant="error" />
 * <Input placeholder="Name" variant="success" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => (
    <input
      type={type}
      className={cn(
        // Base styles
        "flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground ring-offset-background",
        // Transition for smooth animations
        "transition-all duration-200 ease-out",
        // File input styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Placeholder styles
        "placeholder:text-muted-foreground",
        // Focus styles
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        // Disabled styles
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Variant styles
        inputVariants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input, inputVariants }

