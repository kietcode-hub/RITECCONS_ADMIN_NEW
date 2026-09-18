import { CheckCircle, Clock, XCircle } from '@phosphor-icons/react'
import { type Order, OrderStatus, PumpMethod } from '@rmc-ms/shared-types'
import { useEffect, useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { api, ApiError } from '@/lib/api'

const STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: 'Nháp',
  [OrderStatus.PENDING_CONFIRM]: 'Chờ xác nhận',
  [OrderStatus.CONFIRMED]: 'Đã xác nhận',
  [OrderStatus.IN_PROGRESS]: 'Đang thực hiện',
  [OrderStatus.COMPLETED]: 'Hoàn thành',
  [OrderStatus.ON_HOLD]: 'Tạm dừng',
  [OrderStatus.CANCELLED]: 'Huỷ',
}

const STATUS_VARIANT: Record<OrderStatus, 'neutral' | 'info' | 'success' | 'warning' | 'destructive'> = {
  [OrderStatus.DRAFT]: 'neutral',
  [OrderStatus.PENDING_CONFIRM]: 'warning',
  [OrderStatus.CONFIRMED]: 'info',
  [OrderStatus.IN_PROGRESS]: 'info',
  [OrderStatus.COMPLETED]: 'success',
  [OrderStatus.ON_HOLD]: 'neutral',
  [OrderStatus.CANCELLED]: 'destructive',
}

const PUMP_LABEL: Record<PumpMethod, string> = {
  [PumpMethod.BOOM_PUMP]: 'Bơm cần',
  [PumpMethod.LINE_PUMP]: 'Bơm tĩnh',
  [PumpMethod.DIRECT_DISCHARGE]: 'Xả trực tiếp',
}

const emptyForm = {
  branchId: 'CN3',
  siteId: '',
  pourDateTime: '',
  volumeM3: '60',
  estimatedValue: '90000000',
  pumpMethod: PumpMethod.BOOM_PUMP as PumpMethod,
  siteContactName: '',
  siteContactPhone: '',
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [ruleError, setRuleError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  async function loadOrders() {
    setListLoading(true)
    setListError(null)
    try {
      const data = await api.get<Order[]>('/orders')
      setOrders(data)
    } catch (err) {
      setListError(err instanceof ApiError ? err.message : 'Không tải được danh sách đơn hàng')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setRuleError(null)
    setSuccessMsg(null)
    setSubmitting(true)
    try {
      const created = await api.post<Order>('/orders', {
        branchId: form.branchId,
        customerId: 'cust-001', // demo: khach hang duy nhat co ho so han muc trong OrderService in-memory
        siteId: form.siteId,
        pourDateTime: new Date(form.pourDateTime).toISOString(),
        volumeM3: Number(form.volumeM3),
        estimatedValue: Number(form.estimatedValue),
        pumpMethod: form.pumpMethod,
        siteContactName: form.siteContactName,
        siteContactPhone: form.siteContactPhone,
      })
      setSuccessMsg(`Đã tạo đơn ${created.orderNo}`)
      setForm(emptyForm)
      await loadOrders()
    } catch (err) {
      setRuleError(err instanceof ApiError ? err.message : 'Không tạo được đơn hàng')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Đơn hàng</CardTitle>
          <span className="text-[11px] text-[var(--color-muted-foreground)]">{orders.length} đơn</span>
        </CardHeader>
        <CardContent className="pt-0">
          {listLoading && <p className="py-6 text-center text-sm text-[var(--color-muted-foreground)]">Đang tải…</p>}
          {listError && (
            <p className="rounded-[9px] bg-[var(--color-destructive-soft)] px-3 py-2.5 text-xs text-[var(--color-destructive)]">
              {listError}
            </p>
          )}
          {!listLoading && !listError && orders.length === 0 && (
            <p className="py-6 text-center text-sm text-[var(--color-muted-foreground)]">
              Chưa có đơn hàng nào trong phạm vi chi nhánh của bạn. Tạo đơn đầu tiên ở form bên phải.
            </p>
          )}
          <ul>
            {orders.map((o) => (
              <li
                key={o.id}
                className="flex items-center gap-2.5 border-b border-[var(--color-border)] py-2.5 text-[12.5px] last:border-0"
              >
                <span className="w-[150px] shrink-0 font-mono font-bold tabular-nums">
                  {o.orderNo}
                  {o.isUrgent && (
                    <Badge variant="destructive" className="ml-1.5 align-middle">
                      Gấp
                    </Badge>
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-[var(--color-muted-foreground)]">
                  {o.siteId} · {o.branchId}
                </span>
                <span className="w-16 shrink-0 text-right font-mono font-bold tabular-nums">{o.volumeM3} m³</span>
                <Badge variant={STATUS_VARIANT[o.status]}>{STATUS_LABEL[o.status]}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tạo đơn mới</CardTitle>
          <p className="text-[11px] text-[var(--color-muted-foreground)]">
            Gửi thật tới <code>POST /orders</code> — backend kiểm tra BRULE-02 (hạn mức công nợ) trước khi tạo.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="branch">Chi nhánh</Label>
                <Select
                  id="branch"
                  value={form.branchId}
                  onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                >
                  <option value="CN1">CN1 — Trung tâm</option>
                  <option value="CN2">CN2 — Bình Dương</option>
                  <option value="CN3">CN3 — Miền Đông</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="site">Mã công trình (siteId)</Label>
                <Input
                  id="site"
                  required
                  placeholder="site-vinhomes-gd2"
                  value={form.siteId}
                  onChange={(e) => setForm({ ...form, siteId: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="pour">Ngày giờ đổ</Label>
                <Input
                  id="pour"
                  type="datetime-local"
                  required
                  value={form.pourDateTime}
                  onChange={(e) => setForm({ ...form, pourDateTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="vol">Khối lượng (m³)</Label>
                <Input
                  id="vol"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  required
                  className="tabular-nums"
                  value={form.volumeM3}
                  onChange={(e) => setForm({ ...form, volumeM3: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="value">Giá trị đơn ước tính (₫)</Label>
                <Input
                  id="value"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  required
                  className="tabular-nums"
                  value={form.estimatedValue}
                  onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pump">Phương thức</Label>
                <Select
                  id="pump"
                  value={form.pumpMethod}
                  onChange={(e) => setForm({ ...form, pumpMethod: e.target.value as PumpMethod })}
                >
                  {Object.values(PumpMethod).map((pm) => (
                    <option key={pm} value={pm}>
                      {PUMP_LABEL[pm]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="contact-name">Người liên hệ công trình</Label>
                <Input
                  id="contact-name"
                  required
                  value={form.siteContactName}
                  onChange={(e) => setForm({ ...form, siteContactName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">SĐT liên hệ</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  required
                  value={form.siteContactPhone}
                  onChange={(e) => setForm({ ...form, siteContactPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5 border-t border-dashed border-[var(--color-border)] pt-3">
              <RuleRow ok label="Hợp đồng còn hiệu lực" detail="(demo: chưa nối module Hợp đồng)" />
              <RuleRow
                ok={!ruleError}
                pending={submitting}
                label="Hạn mức công nợ khả dụng"
                detail={ruleError ? undefined : 'kiểm tra thật khi bấm Tạo đơn (BRULE-02)'}
              />
              <RuleRow ok label="Năng lực trạm & xe" detail="(demo: chưa nối module Kế hoạch)" />
              <RuleRow ok label="Cấp phối đã được duyệt" detail="(demo: chưa nối module Cấp phối)" />
            </div>

            {ruleError && (
              <div role="alert" aria-live="polite" className="rounded-[9px] bg-[var(--color-destructive-soft)] px-3 py-2.5 text-xs text-[var(--color-destructive)]">
                {ruleError}
              </div>
            )}
            {successMsg && (
              <div role="status" aria-live="polite" className="rounded-[9px] bg-[var(--color-success-soft)] px-3 py-2.5 text-xs text-[var(--color-success)]">
                {successMsg}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Đang tạo…' : 'Tạo đơn'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function RuleRow({ ok, pending, label, detail }: { ok: boolean; pending?: boolean; label: string; detail?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-dashed border-[var(--color-border)] py-1.5 text-[12.5px] last:border-0">
      {pending ? (
        <Clock size={18} className="shrink-0 text-[var(--color-muted-foreground)]" weight="fill" />
      ) : ok ? (
        <CheckCircle size={18} className="shrink-0 text-[var(--color-success)]" weight="fill" />
      ) : (
        <XCircle size={18} className="shrink-0 text-[var(--color-destructive)]" weight="fill" />
      )}
      <span>{label}</span>
      {detail && <span className="ml-auto text-[11px] text-[var(--color-muted-foreground)]">{detail}</span>}
    </div>
  )
}
