import { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import { Sidebar } from '../components/Sidebar/Sidebar'
import type { NavigationItem } from '../types/navigation'

export function PortalLayout() {
  const [items, setItems] = useState<NavigationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const loadNavigation = useCallback(() => {
    setIsLoading(true)
    setHasError(false)

    fetch('/api/navigation')
      .then((response) => {
        if (!response.ok) throw new Error('Navigation request failed')
        return response.json() as Promise<NavigationItem[]>
      })
      .then(setItems)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    loadNavigation()
  }, [loadNavigation, reloadKey])

  return (
    <div className={`app-shell ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        items={items}
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggle={() => setIsCollapsed((value) => !value)}
        onClose={() => setIsMobileOpen(false)}
      />
      <div className="app-column">
        <Header onOpenMenu={() => setIsMobileOpen(true)} />
        <main className="main-content">
          {isLoading && (
            <div className="navigation-state" role="status">
              <span className="state-pulse" /> Loading your workspace…
            </div>
          )}
          {hasError && (
            <div className="navigation-state is-error" role="alert">
              The navigation service is unavailable.
              <button onClick={() => setReloadKey((value) => value + 1)}>Try again</button>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
