import { Route, Routes } from 'react-router-dom'
import { PortalLayout } from './layouts/PortalLayout'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { TicketsPage } from './pages/TicketsPage/TicketsPage'
import './styles.css'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PortalLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tickets" element={<TicketsPage />} />
      </Route>
    </Routes>
  )
}
