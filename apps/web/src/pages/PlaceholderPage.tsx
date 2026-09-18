import { Wrench } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

export function PlaceholderPage({
  code,
  name,
  desc,
  folder,
}: {
  code: string
  name: string
  desc: string
  folder: string
}) {
  return (
    <div className="mx-auto mt-8 max-w-[560px] text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]">
        <Wrench size={24} />
      </div>
      <Badge variant="neutral">Chưa triển khai — placeholder</Badge>
      <h3 className="mt-2.5 text-[17px] font-bold">
        {code} · {name}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">{desc}</p>
      <p className="mt-3.5 text-[11.5px] text-[var(--color-muted-foreground)]">
        Trong code: <code>apps/api/src/modules/{folder}</code> hiện là <code>@Module({'{}'})</code> rỗng —
        xem <code>apps/api/src/modules/order</code> làm mẫu khi triển khai.
      </p>
    </div>
  )
}
