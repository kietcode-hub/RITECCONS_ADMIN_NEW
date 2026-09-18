import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Native <select> styled to match the design system.
 * Deliberately not a custom Radix-style listbox: for RMC-MS's short,
 * well-known option lists (branch, mac be tong, role...) the native
 * control gets free keyboard nav, screen reader support, and mobile
 * picker UI with far less code (see `system-controls` guideline).
 */
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm text-[var(--color-foreground)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
        className,
      )}
      {...props}
    />
  )
}
