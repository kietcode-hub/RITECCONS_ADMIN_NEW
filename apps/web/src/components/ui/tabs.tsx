import { createContext, useContext, useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsCtx {
  value: string
  setValue: (v: string) => void
  baseId: string
}
const Ctx = createContext<TabsCtx | undefined>(undefined)

function useTabsCtx() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Tabs.* must be used within <Tabs>')
  return ctx
}

export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string
  children: ReactNode
  className?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const baseId = useId()
  return (
    <Ctx.Provider value={{ value, setValue, baseId }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  )
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex gap-0.5 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-muted)] p-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useTabsCtx()
  const active = ctx.value === value
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      onClick={() => ctx.setValue(value)}
      className={cn(
        'cursor-pointer rounded-[7px] px-3 py-1.5 text-xs font-semibold text-[var(--color-muted-foreground)]',
        active && 'bg-[var(--color-primary)] text-[var(--color-on-primary)]',
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useTabsCtx()
  if (ctx.value !== value) return null
  return (
    <div role="tabpanel" id={`${ctx.baseId}-panel-${value}`} aria-labelledby={`${ctx.baseId}-tab-${value}`} className="mt-3">
      {children}
    </div>
  )
}
