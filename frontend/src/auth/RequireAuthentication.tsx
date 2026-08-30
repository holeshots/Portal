import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthentication } from './AuthContext'

export function RequireAuthentication() {
  const { status } = useAuthentication()
  const location = useLocation()

  if (status === 'initializing') {
    return (
      <main className="authentication-status-page">
        <section aria-labelledby="authentication-status-title" role="status">
          <span className="state-pulse" aria-hidden="true" />
          <div>
            <h1 id="authentication-status-title">Preparing Microsoft sign-in</h1>
            <p>Checking your account securely…</p>
          </div>
        </section>
      </main>
    )
  }

  if (status !== 'authenticated') {
    const from = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to="/login" replace state={{ from }} />
  }

  return <Outlet />
}
