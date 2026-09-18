import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiError, useAuth } from '@/lib/auth-context'

const DEMO_ACCOUNTS = [
  { email: 'hung.nvkd@rmc-ms.vn', label: 'Hùng — NVKD (CN3)' },
  { email: 'trang.kt@rmc-ms.vn', label: 'Trang — Kỹ thuật (CN1, CN3)' },
  { email: 'nam.kh@rmc-ms.vn', label: 'Nam — Kế hoạch (CN2)' },
  { email: 'dung.dh@rmc-ms.vn', label: 'Dũng — Điều hành (CN1)' },
  { email: 'ha.kt@rmc-ms.vn', label: 'Chị Hà — Kế toán (toàn công ty)' },
  { email: 'loan.gdcn1@rmc-ms.vn', label: 'Chị Loan — GĐ CN1' },
  { email: 'son.tgd@rmc-ms.vn', label: 'Anh Sơn — Tổng Giám đốc' },
  { email: 'admin@rmc-ms.vn', label: 'IT Admin' },
]

export function LoginPage() {
  const { user, login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0].email)
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    const to = (location.state as { from?: string } | null)?.from ?? '/orders'
    return <Navigate to={to} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/orders', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 0 ? 'Không kết nối được tới API (apps/api có đang chạy ở :3000?)' : err.message)
      } else {
        setError('Không kết nối được tới API — kiểm tra apps/api đã `npm run dev:api` chưa.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="w-full max-w-[380px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-7 shadow-[var(--shadow-md)]">
        <div className="mx-auto mb-3.5 grid h-12 w-12 place-items-center rounded-xl bg-[var(--color-primary)] text-base font-extrabold text-[var(--color-on-primary)]">
          RM
        </div>
        <h1 className="text-center text-lg font-bold">RMC-MS</h1>
        <p className="mb-5 text-center text-xs leading-relaxed text-[var(--color-muted-foreground)]">
          Hệ thống Quản trị Sản xuất – Kinh doanh Bê tông Thương phẩm
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <Label htmlFor="login-email">Tài khoản demo</Label>
            <select
              id="login-email"
              className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
              {DEMO_ACCOUNTS.map((acc) => (
                <option key={acc.email} value={acc.email}>
                  {acc.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <Label htmlFor="login-password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute top-0 right-0 grid h-10 w-10 cursor-pointer place-items-center text-[var(--color-muted-foreground)]"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-3 rounded-[9px] bg-[var(--color-destructive-soft)] px-3 py-2.5 text-xs text-[var(--color-destructive)]"
            >
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </Button>

          <p className="mt-3.5 rounded-[9px] bg-[var(--color-muted)] px-2.5 py-2.5 text-[11px] leading-relaxed text-[var(--color-muted-foreground)]">
            🔒 Đăng nhập thật qua <code>POST /auth/login</code> của apps/api — mật khẩu demo cho mọi tài khoản là{' '}
            <strong>password123</strong>. Menu bên trái sau khi đăng nhập chỉ mở khoá module theo vai trò
            (mô phỏng BRULE-17; quyền thật được kiểm ở tầng service, đây chỉ là gợi ý UI).
          </p>
        </form>
      </div>
    </div>
  )
}
