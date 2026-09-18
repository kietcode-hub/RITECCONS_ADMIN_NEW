import { ChartLineUp, CurrencyCircleDollar, Receipt, Truck, TrendUp } from '@phosphor-icons/react'
import { useState } from 'react'
import { ApprovalCard } from '@/components/ApprovalCard'
import { KpiCard } from '@/components/KpiCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

type Scope = 'total' | 'cn1' | 'cn2' | 'cn3'

const KPI_BY_SCOPE: Record<Scope, { m3: string; rev: string; price: string; debt: string; margin: string; deltaM3: number; deltaRev: number }> = {
  total: { m3: '1.840', rev: '2,76', price: '1.502', debt: '340', margin: '285', deltaM3: 6.2, deltaRev: 4.8 },
  cn1: { m3: '680', rev: '1,03', price: '1.515', debt: '95', margin: '298', deltaM3: 8.0, deltaRev: 6.5 },
  cn2: { m3: '512', rev: '0,76', price: '1.487', debt: '180', margin: '262', deltaM3: -10.0, deltaRev: -7.2 },
  cn3: { m3: '648', rev: '0,97', price: '1.503', debt: '65', margin: '305', deltaM3: 3.0, deltaRev: 2.1 },
}

const BRANCHES = [
  { key: 'cn1' as Scope, name: 'CN1 — Trung tâm', status: 'ok' as const, m3: '680 m³', pct: 105, price: '1.515k', trips: '4,1', quality: '98%', dso: '41 ngày', note: 'Vượt kế hoạch nhờ 2 công trình lớn đổ móng liên tục trong tuần.' },
  { key: 'cn2' as Scope, name: 'CN2 — Bình Dương', status: 'warn' as const, m3: '512 m³', pct: 82, price: '1.487k', trips: '3,2', quality: '96%', dso: '52 ngày', note: '⚠ 4 chuyến huỷ do sự cố xe (29H-123.45 hỏng bơm thuỷ lực); DSO cao hơn TB công ty 11 ngày.' },
  { key: 'cn3' as Scope, name: 'CN3 — Miền Đông', status: 'ok' as const, m3: '648 m³', pct: 98, price: '1.503k', trips: '3,9', quality: '99%', dso: '38 ngày', note: 'Vận hành ổn định. Giá bán bình quân giảm nhẹ 30 ngày qua.' },
]

const FLEET = [
  { branch: 'CN1 — Trung tâm', mixer: '9/10', mixerPct: 90, pump: '2/2', pumpPct: 100 },
  { branch: 'CN2 — Bình Dương', mixer: '7/9', mixerPct: 78, pump: '1/2', pumpPct: 50, warn: true },
  { branch: 'CN3 — Miền Đông', mixer: '8/9', mixerPct: 89, pump: '2/2', pumpPct: 100 },
]

const ALERTS = [
  { branch: 'CN2', msg: 'Xe 29H-123.45 hỏng bơm thuỷ lực — 2 chuyến đã chuyển sang xe khác.', severity: 'warn' as const },
  { branch: 'CN1', msg: '1 tổ mẫu R28 không đạt cường độ thiết kế — đang điều tra lô cát nhập ngày 05/09.', severity: 'info' as const },
  { branch: 'CN3', msg: 'Tồn xi măng còn 1,4 ngày — đề nghị mua đã được Kế hoạch gửi duyệt.', severity: 'info' as const },
]

// Du lieu minh hoa (khong phai API that - M14/reporting van la placeholder o backend)
const TREND = {
  cn1: [1498, 1502, 1505, 1500, 1508, 1512, 1515],
  cn2: [1520, 1510, 1500, 1495, 1490, 1488, 1487],
  cn3: [1535, 1525, 1515, 1510, 1505, 1500, 1503],
}

export function DashboardPage() {
  const [scope, setScope] = useState<Scope>('total')
  const [openBranch, setOpenBranch] = useState<Scope | null>(null)
  const kpi = KPI_BY_SCOPE[scope]

  return (
    <div className="space-y-4">
      <p className="rounded-[9px] bg-[var(--color-muted)] px-3 py-2 text-xs text-[var(--color-muted-foreground)]">
        Dữ liệu minh hoạ — <code>apps/api/src/modules/reporting</code> (M14) hiện là placeholder, chưa có API thật để
        nối. Xem <code>design-system/rmc-ms/pages/dashboard.md</code> cho spec đầy đủ.
      </p>

      <div className="flex flex-wrap gap-1.5">
        {(['total', 'cn1', 'cn2', 'cn3'] as Scope[]).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={cn(
              'cursor-pointer rounded-[8px] border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold',
              scope === s ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'bg-[var(--color-card)]',
            )}
          >
            {s === 'total' ? 'Toàn công ty' : s.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard icon={Truck} color="orange" value={kpi.m3} unit="m³" label="Sản lượng" deltaPct={kpi.deltaM3} deltaLabel="so hôm trước" />
        <KpiCard icon={CurrencyCircleDollar} color="green" value={kpi.rev} unit="tỷ ₫" label="Doanh thu" deltaPct={kpi.deltaRev} deltaLabel="so hôm trước" />
        <KpiCard icon={TrendUp} color="teal" value={kpi.price} unit="k ₫" label="Giá bán bình quân/m³" deltaPct={-1.8} deltaLabel="30 ngày" />
        <KpiCard icon={Receipt} color="pink" value={kpi.debt} unit="tr ₫" label="Công nợ quá hạn" footText="12 khách hàng" />
        <KpiCard icon={ChartLineUp} color="purple" value={kpi.margin} unit="k ₫" label="Biên LN gộp/m³ (ước tính)" footText="giá bán − giá thành sơ bộ" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>So sánh chi nhánh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {BRANCHES.map((b) => {
            const open = openBranch === b.key
            return (
              <button
                key={b.key}
                onClick={() => setOpenBranch(open ? null : b.key)}
                aria-expanded={open}
                className={cn(
                  'w-full cursor-pointer rounded-[var(--radius-md)] border border-l-4 p-3 text-left',
                  b.status === 'ok' ? 'border-l-[var(--color-success)]' : 'border-l-[var(--color-destructive)]',
                  'border-[var(--color-border)]',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold">
                    {b.name}
                    <Badge variant={b.status === 'ok' ? 'success' : 'destructive'}>
                      {b.status === 'ok' ? (b.pct >= 100 ? 'Đạt KH' : 'Sát KH') : `Thấp hơn KH ${100 - b.pct}%`}
                    </Badge>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-extrabold tabular-nums">{b.m3}</span>
                    <span className="text-[11.5px] text-[var(--color-muted-foreground)]">{b.pct}% kế hoạch</span>
                  </span>
                </div>
                <div className="my-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-muted)]">
                  <span
                    className={cn('block h-full rounded-full', b.status === 'ok' ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-destructive)]')}
                    style={{ width: `${Math.min(b.pct, 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-[11px] text-[var(--color-muted-foreground)]">
                  <div>
                    Giá BQ/m³<b className="block text-[12.5px] text-[var(--color-foreground)]">{b.price}</b>
                  </div>
                  <div>
                    Chuyến/xe/ngày<b className="block text-[12.5px] text-[var(--color-foreground)]">{b.trips}</b>
                  </div>
                  <div>
                    Mẫu đạt<b className="block text-[12.5px] text-[var(--color-foreground)]">{b.quality}</b>
                  </div>
                  <div>
                    DSO<b className="block text-[12.5px] text-[var(--color-foreground)]">{b.dso}</b>
                  </div>
                </div>
                {open && <p className="mt-2.5 border-t border-dashed border-[var(--color-border)] pt-2.5 text-xs text-[var(--color-muted-foreground)]">{b.note}</p>}
              </button>
            )
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng giá bán bình quân/m³ (7 ngày)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-2 flex gap-3.5 text-[11px] text-[var(--color-muted-foreground)]">
              <span className="flex items-center gap-1"><i className="inline-block h-0.5 w-2.5 bg-[var(--color-primary)]" />CN1</span>
              <span className="flex items-center gap-1"><i className="inline-block h-0.5 w-2.5 bg-[var(--color-muted-foreground)]" />CN2</span>
              <span className="flex items-center gap-1"><i className="inline-block h-0.5 w-2.5 bg-[var(--color-accent)]" />CN3</span>
            </div>
            <TrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nguồn lực đội xe — 3 chi nhánh</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chi nhánh</TableHead>
                  <TableHead>Xe mixer</TableHead>
                  <TableHead>Xe bơm</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FLEET.map((f) => (
                  <TableRow key={f.branch}>
                    <TableCell>{f.branch}</TableCell>
                    <TableCell className="tabular-nums">{f.mixer}</TableCell>
                    <TableCell className={cn('tabular-nums', f.warn && 'text-[var(--color-destructive)] font-bold')}>{f.pump}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chờ duyệt</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 pt-0 sm:grid-cols-2">
          <ApprovalCard
            type="Giá dưới sàn — sâu"
            title="Công ty TNHH Xây dựng ABC"
            subtitle="CN3 · NVKD: Nguyễn Văn Hùng"
            figures={[
              { label: 'Giá đề xuất', value: '1.120.000 đ/m³' },
              { label: 'Giá sàn', value: '1.150.000 đ/m³', tone: 'destructive' },
              { label: 'Chênh lệch', value: '−2,6%', tone: 'destructive' },
              { label: 'Khối lượng', value: '800 m³' },
            ]}
            reasonNote="Khách chiến lược, cam kết 3 công trình tiếp theo trong quý."
          />
          <ApprovalCard
            type="Hạn mức công nợ"
            title="Công ty CP Đầu tư XYZ"
            subtitle="CN1 · NVKD: Trần Thị Mai"
            figures={[
              { label: 'Hạn mức hiện tại', value: '1,5 tỷ ₫' },
              { label: 'Hạn mức đề xuất', value: '3,0 tỷ ₫' },
              { label: 'Lịch sử thanh toán', value: 'Đúng hạn 95%' },
              { label: 'Số ngày nợ', value: '45 ngày' },
            ]}
            reasonNote="Khách mở rộng dự án, 2 công trình đang chạy đúng tiến độ thanh toán."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cảnh báo vận hành hôm nay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 pt-0">
          {ALERTS.map((a, i) => (
            <div key={i} className="flex gap-2.5 border-b border-[var(--color-border)] py-2.5 text-xs last:border-0">
              <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', a.severity === 'warn' ? 'bg-[var(--color-destructive)]' : 'bg-[var(--color-warning)]')} />
              <div>
                <span className="mr-1 font-bold text-[var(--color-muted-foreground)]">{a.branch}</span>
                {a.msg}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function TrendChart() {
  const all = [...TREND.cn1, ...TREND.cn2, ...TREND.cn3]
  const min = Math.min(...all) - 5
  const max = Math.max(...all) + 5
  const toPoints = (vals: number[]) =>
    vals.map((v, i) => `${10 + (i * 280) / (vals.length - 1)},${97 - ((v - min) / (max - min)) * 82}`).join(' ')

  return (
    <svg viewBox="0 0 300 100" width="100%" height="140" preserveAspectRatio="none" role="img" aria-label="Biểu đồ xu hướng giá bán bình quân theo m3 của 3 chi nhánh trong 7 ngày qua">
      <line x1="10" y1="97" x2="290" y2="97" stroke="var(--color-border)" strokeWidth="1" />
      <polyline points={toPoints(TREND.cn1)} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={toPoints(TREND.cn2)} fill="none" stroke="var(--color-muted-foreground)" strokeWidth="2.5" strokeDasharray="1 5" strokeLinecap="round" />
      <polyline points={toPoints(TREND.cn3)} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
