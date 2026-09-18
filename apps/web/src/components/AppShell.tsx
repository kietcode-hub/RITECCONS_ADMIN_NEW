import { Bell, List, Lock, SignOut, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { GROUP_ORDER, hasModuleAccess, MODULES, ROLE_LABEL } from '@/lib/modules'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.fullName
    .split(/[-–]/)[0]
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <button
          aria-label="Đóng menu điều hướng"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-[264px] overflow-y-auto border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-bg)] transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-[var(--color-sidebar-border)] px-4 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-extrabold text-white">
            RM
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--color-sidebar-text-active)]">RMC-MS</div>
            <div className="text-[11px] text-[var(--color-sidebar-text)]">16 module · M01–M16</div>
          </div>
        </div>

        <nav className="pb-4">
          {GROUP_ORDER.map((group) => {
            const items = MODULES.filter((m) => m.group === group)
            if (items.length === 0) return null
            return (
              <div key={group} className="px-2 pt-3.5">
                <div className="px-2.5 pb-1.5 text-[10.5px] font-bold tracking-wider text-[#545C82] uppercase">
                  {group}
                </div>
                {items.map((m) => {
                  const allowed = hasModuleAccess(user?.role, m.code)
                  return (
                    <NavLink
                      key={m.code}
                      to={allowed ? m.path : '#'}
                      onClick={(e) => {
                        if (!allowed) e.preventDefault()
                        else setSidebarOpen(false)
                      }}
                      className={({ isActive }) =>
                        cn(
                          'my-0.5 flex items-center gap-2 rounded-[9px] border-l-[3px] border-transparent px-2.5 py-2 text-[13px] font-semibold text-[var(--color-sidebar-text)]',
                          allowed && 'hover:bg-[var(--color-sidebar-bg-hover)] hover:text-[var(--color-sidebar-text-active)] cursor-pointer',
                          !allowed && 'cursor-not-allowed opacity-50',
                          isActive &&
                            allowed &&
                            'border-[var(--color-sidebar-accent)] bg-[var(--color-sidebar-bg-hover)] text-[var(--color-sidebar-text-active)]',
                        )
                      }
                      aria-disabled={!allowed}
                    >
                      <span className="shrink-0 rounded-[5px] bg-white/[0.06] px-1.5 py-px text-[9.5px] font-extrabold">
                        {m.code}
                      </span>
                      <span className="flex-1 truncate">{m.name}</span>
                      {!allowed ? (
                        <Lock size={11} aria-label="Không có quyền" />
                      ) : m.live ? (
                        <span className="shrink-0 rounded-full bg-teal-100 px-1.5 py-0.5 text-[8.5px] font-extrabold text-teal-700">
                          LIVE
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-red-400/15 px-1.5 py-0.5 text-[8.5px] font-extrabold text-red-400">
                          SOON
                        </span>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            )
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-[264px]">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
          <button
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-[9px] border border-[var(--color-border)] lg:hidden"
            aria-label="Mở menu điều hướng"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <X size={18} /> : <List size={18} />}
          </button>
          <div className="flex-1" />
          <button
            className="grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-[9px] border border-[var(--color-border)]"
            aria-label="Thông báo"
          >
            <Bell size={16} />
          </button>
          <div className="relative">
            <button
              className="flex cursor-pointer items-center gap-1.5 rounded-full py-1 pr-1.5 pl-1 hover:bg-[var(--color-muted)]"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={userMenuOpen}
            >
              <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-xs font-extrabold text-white">
                {initials ?? '--'}
              </span>
              <span className="hidden text-[12.5px] font-bold sm:inline">
                {user?.fullName.split(/[-–]/)[0].trim()}
              </span>
            </button>
            {userMenuOpen && (
              <div className="absolute top-[44px] right-0 z-30 min-w-[210px] overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-lg)]">
                <div className="border-b border-[var(--color-border)] px-3 py-2.5">
                  <div className="text-[12.5px] font-bold">{user?.fullName}</div>
                  <div className="text-[11px] text-[var(--color-muted-foreground)]">
                    {user && ROLE_LABEL[user.role]}
                  </div>
                </div>
                <button
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-[12.5px] hover:bg-[var(--color-muted)]"
                  onClick={handleLogout}
                >
                  <SignOut size={14} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
