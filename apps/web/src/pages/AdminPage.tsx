import { Plus } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROLE_LABEL } from '@/lib/modules'
import { UserRole } from '@rmc-ms/shared-types'

const SEED_USERS = [
  { name: 'Hùng - NVKD', email: 'hung.nvkd@rmc-ms.vn', role: UserRole.SALES_REP, branches: ['CN3'] },
  { name: 'Trang - Kỹ thuật', email: 'trang.kt@rmc-ms.vn', role: UserRole.TECHNICAL_STAFF, branches: ['CN1', 'CN3'] },
  { name: 'Nam - Kế hoạch', email: 'nam.kh@rmc-ms.vn', role: UserRole.PLANNING_STAFF, branches: ['CN2'] },
  { name: 'Dũng - Điều hành', email: 'dung.dh@rmc-ms.vn', role: UserRole.DISPATCHER, branches: ['CN1'] },
  { name: 'Chị Hà - Kế toán', email: 'ha.kt@rmc-ms.vn', role: UserRole.ACCOUNTANT, branches: ['Toàn công ty'] },
  { name: 'Chị Loan - GĐ CN1', email: 'loan.gdcn1@rmc-ms.vn', role: UserRole.BRANCH_MANAGER, branches: ['CN1'] },
  { name: 'Anh Sơn - TGĐ', email: 'son.tgd@rmc-ms.vn', role: UserRole.EXECUTIVE, branches: ['Toàn công ty'] },
  { name: 'IT Admin', email: 'admin@rmc-ms.vn', role: UserRole.ADMIN, branches: ['Toàn công ty'] },
]

const DELEGATIONS = [
  { from: 'Trang — Kỹ thuật CN3', to: 'Kỹ thuật CN1', scope: 'Phê duyệt cấp phối (M06)', from_: '10/09/2026', to_: '20/09/2026', active: true },
]

export function AdminPage() {
  const [addOpen, setAddOpen] = useState(false)
  const [delegateOpen, setDelegateOpen] = useState(false)

  function handleAddUser(e: FormEvent) {
    e.preventDefault()
    setAddOpen(false)
  }
  function handleDelegate(e: FormEvent) {
    e.preventDefault()
    setDelegateOpen(false)
  }

  return (
    <div className="space-y-4">
      <p className="rounded-[9px] bg-[var(--color-muted)] px-3 py-2 text-xs text-[var(--color-muted-foreground)]">
        Danh sách người dùng hiển thị đúng 8 tài khoản demo seed trong <code>AuthService</code>. Thêm/sửa ở đây mới
        chỉ là UI demo — <code>apps/api/src/modules/admin</code> (M01) chưa có API tạo user thật.
      </p>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="delegation">Uỷ quyền</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Người dùng ({SEED_USERS.length})</CardTitle>
              <Button size="sm" onClick={() => setAddOpen(true)}>
                <Plus size={14} /> Thêm người dùng
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Chi nhánh phụ trách</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SEED_USERS.map((u) => (
                    <TableRow key={u.email}>
                      <TableCell className="flex items-center gap-2 font-bold">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-muted)] text-[10.5px] font-bold text-[var(--color-muted-foreground)]">
                          {u.name.split(' ')[0][0]}
                        </span>
                        {u.name}
                      </TableCell>
                      <TableCell className="text-xs text-[var(--color-muted-foreground)]">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="info">{ROLE_LABEL[u.role]}</Badge>
                      </TableCell>
                      <TableCell className="flex flex-wrap gap-1">
                        {u.branches.map((b) => (
                          <Badge key={b} variant="neutral">
                            {b}
                          </Badge>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delegation">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Uỷ quyền</CardTitle>
              <Button size="sm" onClick={() => setDelegateOpen(true)}>
                <Plus size={14} /> Tạo uỷ quyền
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người uỷ quyền</TableHead>
                    <TableHead>Người nhận</TableHead>
                    <TableHead>Phạm vi</TableHead>
                    <TableHead>Từ / đến</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DELEGATIONS.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell>{d.from}</TableCell>
                      <TableCell>{d.to}</TableCell>
                      <TableCell className="text-xs">{d.scope}</TableCell>
                      <TableCell className="text-xs text-[var(--color-muted-foreground)]">
                        {d.from_} – {d.to_}
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.active ? 'success' : 'neutral'}>{d.active ? 'Đang hiệu lực' : 'Hết hạn'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardContent className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">
              Chưa có audit log thật — cần <code>apps/api/src/common</code> ghi log theo hành động (xem CLAUDE.md phần
              BranchScopeExceptionFilter làm điểm khởi đầu tương tự).
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={addOpen} onOpenChange={setAddOpen} title="Thêm người dùng" description="Tài khoản sẽ nhận email kích hoạt và bắt buộc đổi mật khẩu lần đầu (FR-M01-02).">
        <form onSubmit={handleAddUser} className="space-y-3">
          <div>
            <Label htmlFor="nu-name">Họ tên</Label>
            <Input id="nu-name" placeholder="Nguyễn Văn A" required />
          </div>
          <div>
            <Label htmlFor="nu-contact">Email / SĐT</Label>
            <Input id="nu-contact" placeholder="ten@rmc-ms.vn" required />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setAddOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" className="flex-1">
              Tạo tài khoản
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={delegateOpen}
        onOpenChange={setDelegateOpen}
        title="Uỷ quyền tạm thời"
        description="Bắt buộc vì Kỹ thuật/Kế hoạch chỉ 1 người/chi nhánh (BRULE-19: không uỷ quyền chuyển tiếp)."
      >
        <form onSubmit={handleDelegate} className="space-y-3">
          <div>
            <Label htmlFor="dg-from">Người uỷ quyền</Label>
            <Input id="dg-from" placeholder="Trang — Kỹ thuật CN3" required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="dg-from-date">Từ ngày</Label>
              <Input id="dg-from-date" type="date" required />
            </div>
            <div>
              <Label htmlFor="dg-to-date">Đến ngày</Label>
              <Input id="dg-to-date" type="date" required />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setDelegateOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" className="flex-1">
              Tạo uỷ quyền
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
