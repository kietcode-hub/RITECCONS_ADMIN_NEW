import { X } from '@phosphor-icons/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

/**
 * Wrapper mong quanh <dialog> native: trinh duyet lo focus trap, ESC-to-close,
 * va top-layer stacking mien phi (system-controls guideline) thay vi tu dung Radix.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return createPortal(
    <dialog
      ref={ref}
      onClose={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
      onClick={(e) => {
        if (e.target === ref.current) onOpenChange(false)
      }}
      className={cn(
        'w-full max-w-[480px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-0 text-[var(--color-card-foreground)] shadow-[var(--shadow-xl)] backdrop:bg-black/50',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 p-4 pb-2">
        <div>
          <h3 className="text-[15px] font-bold">{title}</h3>
          {description && <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{description}</p>}
        </div>
        <button
          type="button"
          aria-label="Đóng"
          className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
          onClick={() => onOpenChange(false)}
        >
          <X size={14} />
        </button>
      </div>
      <div className="p-4 pt-2">{children}</div>
    </dialog>,
    document.body,
  )
}
