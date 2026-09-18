import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold',
  {
    variants: {
      variant: {
        neutral: 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]',
        info: 'bg-[color-mix(in_srgb,var(--color-accent)_14%,white)] text-[var(--color-accent)]',
        success: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
        warning: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
        destructive: 'bg-[var(--color-destructive-soft)] text-[var(--color-destructive)]',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
