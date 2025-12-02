import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Textarea component variants for different validation states
 */
const textareaVariants = {
  default: "border-input hover:border-primary/40 focus-visible:border-primary focus-visible:ring-primary/50",
  error: "border-error hover:border-error/80 focus-visible:border-error focus-visible:ring-error/50",
  success: "border-success hover:border-success/80 focus-visible:border-success focus-visible:ring-success/50",
} as const;

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Validation state variant */
  variant?: keyof typeof textareaVariants;
}

/**
 * Enhanced Textarea Component
 *
 * Features:
 * - Smooth transition animations on focus and hover
 * - Validation state variants (default, error, success)
 * - Accessible focus indicators
 * - Dark mode support
 * - Auto-resize support via CSS
 *
 * @example
 * <Textarea placeholder="Message" variant="error" />
 * <Textarea placeholder="Bio" variant="success" />
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        // Base styles
        "flex min-h-[80px] w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground ring-offset-background",
        // Transition for smooth animations
        "transition-all duration-200 ease-out",
        // Placeholder styles
        "placeholder:text-muted-foreground",
        // Focus styles
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        // Disabled styles
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Resize behavior
        "resize-y",
        // Variant styles
        textareaVariants[variant],
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }

