import { Route, Routes } from 'react-router-dom'
import { PortalLayout } from './layouts/PortalLayout'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { ClientsPage } from './pages/ClientsPage/ClientsPage'
import { ModulePlaceholderPage } from './pages/ModulePlaceholderPage/ModulePlaceholderPage'
import { MODULE_PLACEHOLDERS } from './pages/ModulePlaceholderPage/modulePlaceholders'
import { PageNotFoundPage } from './pages/ModulePlaceholderPage/PageNotFoundPage'
import { TicketsPage } from './pages/TicketsPage/TicketsPage'
import './styles.css'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PortalLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="clients" element={<ClientsPage />} />
        {MODULE_PLACEHOLDERS.map((module) => (
          <Route
            key={module.path}
            path={module.path.slice(1)}
            element={<ModulePlaceholderPage module={module} />}
          />
        ))}
        <Route path="*" element={<PageNotFoundPage />} />
      </Route>
    </Routes>
  )
}
