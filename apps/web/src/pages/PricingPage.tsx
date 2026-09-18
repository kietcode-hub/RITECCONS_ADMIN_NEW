import { ApprovalCard } from '@/components/ApprovalCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const PRICES = [
  { mac: 'M200', floor: '1.180.000', list: '1.280.000', from: '01/09/2026', to: '31/12/2026', branch: 'CN1, CN2, CN3', active: true },
  { mac: 'M250', floor: '1.310.000', list: '1.400.000', from: '01/09/2026', to: '31/12/2026', branch: 'CN1, CN2, CN3', active: true },
  { mac: 'M300', floor: '1.450.000', list: '1.550.000', from: '01/09/2026', to: '31/12/2026', branch: 'CN1, CN3', active: true },
  { mac: 'M350', floor: '1.600.000', list: '1.700.000', from: '01/06/2026', to: '31/08/2026', branch: 'CN2', active: false },
]

export function PricingPage() {
  return (
    <div className="space-y-4">
      <p className="rounded-[9px] bg-[var(--color-muted)] px-3 py-2 text-xs text-[var(--color-muted-foreground)]">
        Dữ liệu minh hoạ — <code>apps/api/src/modules/pricing</code> (M03) hiện là placeholder. Luồng phê duyệt giá
        dưới sàn dùng chung <code>ApprovalCard</code> với M14 Dashboard theo{' '}
        <code>design-system/rmc-ms/pages/pricing-m03.md</code>.
      </p>

      <Tabs defaultValue="prices">
        <TabsList>
          <TabsTrigger value="prices">Bảng giá theo mác bê tông</TabsTrigger>
          <TabsTrigger value="approvals">Báo giá đang chờ duyệt</TabsTrigger>
        </TabsList>

        <TabsContent value="prices">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mác bê tông</TableHead>
                    <TableHead>Giá sàn (₫/m³)</TableHead>
                    <TableHead>Giá niêm yết (₫/m³)</TableHead>
                    <TableHead>Hiệu lực</TableHead>
                    <TableHead>Chi nhánh áp dụng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PRICES.map((p) => (
                    <TableRow key={p.mac} className="cursor-pointer hover:bg-[var(--color-muted)]">
                      <TableCell className="font-bold">{p.mac}</TableCell>
                      <TableCell className="tabular-nums">{p.floor}</TableCell>
                      <TableCell className="tabular-nums">{p.list}</TableCell>
                      <TableCell className="text-xs text-[var(--color-muted-foreground)]">
                        {p.from} – {p.to}
                      </TableCell>
                      <TableCell className="text-xs">{p.branch}</TableCell>
                      <TableCell>
                        <Badge variant={p.active ? 'success' : 'neutral'}>{p.active ? 'Đang áp dụng' : 'Hết hạn'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ApprovalCard
              type="Giá dưới sàn — sâu"
              title="Công ty TNHH Xây dựng ABC"
              subtitle="CN3 · NVKD: Nguyễn Văn Hùng · Vinhomes GĐ2"
              figures={[
                { label: 'Giá đề xuất', value: '1.120.000 đ/m³' },
                { label: 'Giá sàn', value: '1.150.000 đ/m³', tone: 'destructive' },
                { label: 'Chênh lệch', value: '−2,6%', tone: 'destructive' },
                { label: 'Khối lượng', value: '800 m³' },
              ]}
              reasonNote="Khách chiến lược, cam kết 3 công trình tiếp theo trong quý."
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
