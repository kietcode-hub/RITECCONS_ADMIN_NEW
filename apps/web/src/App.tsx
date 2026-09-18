import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthProvider } from '@/lib/auth-context'
import { MODULES } from '@/lib/modules'
import { AdminPage } from '@/pages/AdminPage'
import { ArPage } from '@/pages/ArPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { PricingPage } from '@/pages/PricingPage'

const PAGE_BY_CODE: Record<string, ReactNode> = {
  M05: <OrdersPage />,
  M14: <DashboardPage />,
  M03: <PricingPage />,
  M13: <ArPage />,
  M01: <AdminPage />,
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/orders" replace />} />
          {MODULES.map((m) => (
            <Route
              key={m.path}
              path={m.path}
              element={
                PAGE_BY_CODE[m.code] ?? (
                  <PlaceholderPage code={m.code} name={m.name} desc={m.desc} folder={m.folder} />
                )
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/orders" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
