import type { Icon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const GRADIENTS = {
  orange: 'from-orange-400 to-orange-600 text-orange-600',
  green: 'from-green-400 to-green-600 text-green-600',
  teal: 'from-teal-400 to-teal-600 text-teal-600',
  pink: 'from-pink-400 to-rose-600 text-pink-600',
  purple: 'from-purple-400 to-purple-600 text-purple-600',
} as const

export function KpiCard({
  icon: IconCmp,
  color,
  value,
  unit,
  label,
  deltaPct,
  deltaLabel,
  footText,
}: {
  icon: Icon
  color: keyof typeof GRADIENTS
  value: string
  unit?: string
  label: string
  deltaPct?: number
  deltaLabel?: string
  footText?: string
}) {
  const grad = GRADIENTS[color]
  const [fromTo, textColor] = [grad.split(' text-')[0], `text-${grad.split(' text-')[1]}`]
  const up = (deltaPct ?? 0) >= 0

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-card)] shadow-[var(--shadow-md)]">
      <div className="flex items-start justify-between gap-2 p-3.5 pb-3">
        <div>
          <div className="text-xl font-extrabold tabular-nums">
            {value} {unit && <small className="text-xs font-semibold text-[var(--color-muted-foreground)]">{unit}</small>}
          </div>
          <div className="mt-1 text-[11.5px] text-[var(--color-muted-foreground)]">{label}</div>
        </div>
        <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-current/10', textColor)}>
          <IconCmp size={17} className={textColor} weight="bold" />
        </div>
      </div>
      <div className={cn('flex items-center justify-between bg-gradient-to-r px-3.5 py-2 text-[11px] font-bold text-white', fromTo)}>
        {footText ? (
          <span>{footText}</span>
        ) : (
          <>
            <span aria-label={`${up ? 'tăng' : 'giảm'} ${Math.abs(deltaPct ?? 0)}% ${deltaLabel ?? ''}`}>
              {Math.abs(deltaPct ?? 0)}% {deltaLabel}
            </span>
            <span aria-hidden="true">{up ? '▲' : '▼'}</span>
          </>
        )}
      </div>
    </div>
  )
}
