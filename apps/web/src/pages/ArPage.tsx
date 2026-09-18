import { CheckCircle, CurrencyCircleDollar, Receipt, Wallet } from '@phosphor-icons/react'
import { KpiCard } from '@/components/KpiCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const INVOICES = [
  { no: 'HD-2026-0512', date: '01/09/2026', due: '01/10/2026', overdue: 0, status: 'success' as const, statusLabel: 'Đã thu' },
  { no: 'HD-2026-0498', date: '20/08/2026', due: '19/09/2026', overdue: 12, status: 'destructive' as const, statusLabel: 'Quá hạn 12 ngày' },
  { no: 'HD-2026-0470', date: '05/08/2026', due: '04/09/2026', overdue: 0, status: 'success' as const, statusLabel: 'Đã thu' },
]

const PAYMENTS = [
  { label: 'HD-2026-0512', onTime: true, date: '28/09/2026' },
  { label: 'HD-2026-0498', onTime: false, date: 'Chưa thu' },
  { label: 'HD-2026-0470', onTime: true, date: '02/09/2026' },
]

export function ArPage() {
  return (
    <div className="space-y-4">
      <p className="rounded-[9px] bg-[var(--color-muted)] px-3 py-2 text-xs text-[var(--color-muted-foreground)]">
        Dữ liệu minh hoạ — <code>apps/api/src/modules/ar</code> (M13) hiện là placeholder. Không dùng khái niệm
        "ví/subscription" — công nợ gắn với hạn mức tín dụng (BRULE-02) và hợp đồng, xem{' '}
        <code>design-system/rmc-ms/pages/ar-customer-m13.md</code>.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Công ty TNHH Xây dựng ABC</CardTitle>
          <p className="text-xs text-[var(--color-muted-foreground)]">Mã KH: KH-000182 · CN3 · NVKD: Nguyễn Văn Hùng</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <KpiCard icon={Wallet} color="teal" value="1,5" unit="tỷ ₫" label="Hạn mức tín dụng" footText="theo hợp đồng" />
        <KpiCard icon={CurrencyCircleDollar} color="orange" value="700" unit="tr ₫" label="Dư nợ hiện tại" footText="46,7% hạn mức" />
        <KpiCard icon={CheckCircle} color="green" value="800" unit="tr ₫" label="Khả dụng" footText="hạn mức − dư nợ" />
        <KpiCard icon={Receipt} color="pink" value="41" unit="ngày" label="DSO" footText="trung bình 3 tháng" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Công nợ / Hoá đơn</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hoá đơn</TableHead>
                <TableHead>Ngày phát hành</TableHead>
                <TableHead>Hạn thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((inv) => (
                <TableRow key={inv.no}>
                  <TableCell className="font-mono font-bold">{inv.no}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{inv.due}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status}>{inv.statusLabel}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 pt-0">
          {PAYMENTS.map((p) => (
            <div key={p.label} className="flex items-center justify-between border-b border-[var(--color-border)] py-2 text-sm last:border-0">
              <span className="font-mono">{p.label}</span>
              {p.onTime ? (
                <span className="flex items-center gap-1 text-xs font-bold text-[var(--color-success)]">
                  <CheckCircle size={14} weight="fill" /> Đúng hạn — {p.date}
                </span>
              ) : (
                <span className="text-xs font-bold text-[var(--color-destructive)]">{p.date}</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
