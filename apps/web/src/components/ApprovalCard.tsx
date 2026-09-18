import { Check, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'

export interface ApprovalFigure {
  label: string
  value: string
  tone?: 'default' | 'destructive'
}

export function ApprovalCard({
  type,
  title,
  subtitle,
  figures,
  reasonNote,
}: {
  type: string
  title: string
  subtitle: string
  figures: ApprovalFigure[]
  reasonNote?: string
}) {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null)
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null)
  const [note, setNote] = useState('')

  function confirm() {
    if (pendingAction) setDecision(pendingAction)
    setPendingAction(null)
    setNote('')
  }

  const actionLabel = decision === 'approve' ? 'Đã duyệt' : 'Đã từ chối'

  return (
    <Card>
      <CardContent className="p-3.5">
        <Badge variant="warning" className="mb-1.5">
          {type}
        </Badge>
        <div className="text-sm font-bold">{title}</div>
        <div className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">{subtitle}</div>

        <div className="my-2.5 grid grid-cols-2 gap-2 rounded-[10px] bg-[var(--color-muted)] p-2.5 text-xs">
          {figures.map((f) => (
            <div key={f.label}>
              <span className="block text-[11px] text-[var(--color-muted-foreground)]">{f.label}</span>
              <b className={f.tone === 'destructive' ? 'text-[var(--color-destructive)]' : ''}>{f.value}</b>
            </div>
          ))}
        </div>

        {reasonNote && <p className="mb-2.5 text-xs text-[var(--color-muted-foreground)] italic">"{reasonNote}"</p>}

        {decision ? (
          <div
            role="status"
            className={
              'flex items-center gap-2 rounded-[9px] px-2.5 py-2 text-xs font-bold ' +
              (decision === 'approve'
                ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                : 'bg-[var(--color-destructive-soft)] text-[var(--color-destructive)]')
            }
          >
            {decision === 'approve' ? <Check size={14} /> : <X size={14} />} {actionLabel}
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setPendingAction('reject')}>
              Từ chối
            </Button>
            <Button className="flex-1 bg-[var(--color-success)] hover:opacity-90" onClick={() => setPendingAction('approve')}>
              Duyệt
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog
        open={pendingAction !== null}
        onOpenChange={(o) => !o && setPendingAction(null)}
        title={pendingAction === 'approve' ? 'Duyệt đề nghị' : 'Từ chối đề nghị'}
        description={
          pendingAction === 'approve'
            ? 'Ghi chú sẽ được lưu vào nhật ký hệ thống (audit log).'
            : 'Vui lòng ghi rõ lý do từ chối.'
        }
      >
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-foreground)]" htmlFor={`note-${title}`}>
          Ghi chú
        </label>
        <textarea
          id={`note-${title}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] p-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
        />
        <div className="mt-3 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setPendingAction(null)}>
            Huỷ
          </Button>
          <Button
            className={pendingAction === 'approve' ? 'flex-1 bg-[var(--color-success)] hover:opacity-90' : 'flex-1'}
            variant={pendingAction === 'reject' ? 'destructive' : 'default'}
            onClick={confirm}
          >
            Xác nhận
          </Button>
        </div>
      </Dialog>
    </Card>
  )
}
