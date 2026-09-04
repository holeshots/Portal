import { Route, Routes } from 'react-router-dom'
import { RequireAuthentication } from './auth/RequireAuthentication'
import { PortalLayout } from './layouts/PortalLayout'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { ClientsPage } from './pages/ClientsPage/ClientsPage'
import { DevicesPage } from './pages/DevicesPage/DevicesPage'
import { MessagesPage } from './pages/MessagesPage/MessagesPage'
import { Microsoft365Page } from './pages/Microsoft365Page/Microsoft365Page'
import { PageNotFoundPage } from './pages/ModulePlaceholderPage/PageNotFoundPage'
import { ReportsPage } from './pages/ReportsPage/ReportsPage'
import { SettingsPage } from './pages/SettingsPage/SettingsPage'
import { TicketsPage } from './pages/TicketsPage/TicketsPage'
import './styles.css'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuthentication />}>
        <Route element={<PortalLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="365" element={<Microsoft365Page />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<PageNotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
