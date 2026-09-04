import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import App from './App'
import { AuthenticationContext, type AuthenticationContextValue } from './auth/AuthContext'
import type { NavigationItem } from './types/navigation'

const demoModules = [
  { path: '/devices', title: 'Devices' },
  { path: '/365', title: 'Microsoft 365' },
  { path: '/reports', title: 'Reports' },
  { path: '/messages', title: 'Messages' },
  { path: '/settings', title: 'Settings' },
] as const

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'grid', section: 'Overview' },
  { id: 'tickets', label: 'Tickets', path: '/tickets', icon: 'activity', section: 'Overview' },
  { id: 'devices', label: 'Devices', path: '/devices', icon: 'shopping-bag', section: 'Management' },
  { id: 'clients', label: 'Clients', path: '/clients', icon: 'users', section: 'Management' },
  { id: 'microsoft365', label: 'Microsoft 365', path: '/365', icon: 'package', section: 'Management' },
  { id: 'reports', label: 'Reports', path: '/reports', icon: 'bar-chart', section: 'Workspace' },
  { id: 'messages', label: 'Messages', path: '/messages', icon: 'message-square', section: 'Workspace' },
  { id: 'settings', label: 'Settings', path: '/settings', icon: 'settings', section: 'Workspace' },
]

const signIn = vi.fn().mockResolvedValue(undefined)
const signOut = vi.fn().mockResolvedValue(undefined)
const authenticated: AuthenticationContextValue = {
  status: 'authenticated',
  account: { name: 'Alex Morgan', username: 'alex.morgan@example.com' },
  error: null,
  signIn,
  signOut,
}

const unauthenticated: AuthenticationContextValue = {
  ...authenticated,
  status: 'unauthenticated',
  account: null,
}

function stubNavigation(items: NavigationItem[] = navigationItems) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => items,
  }))
}

function renderAppAt(path: string, authentication = authenticated) {
  return render(
    <AuthenticationContext.Provider value={authentication}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </AuthenticationContext.Provider>,
  )
}

function HistoryControls() {
  const navigate = useNavigate()

  return (
    <>
      <button type="button" onClick={() => navigate(-1)}>Test browser back</button>
      <button type="button" onClick={() => navigate(1)}>Test browser forward</button>
    </>
  )
}

describe('App routing', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders the standalone login route without dashboard chrome', () => {
    renderAppAt('/login', unauthenticated)

    expect(screen.getByRole('heading', { name: 'Continue to your workspace' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Notifications' })).not.toBeInTheDocument()
  })

  it('protects portal routes and preserves the requested destination for sign-in', async () => {
    const user = userEvent.setup()
    renderAppAt('/tickets', unauthenticated)

    expect(screen.getByRole('heading', { name: 'Continue to your workspace' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue with Microsoft' }))
    expect(signIn).toHaveBeenCalledWith('/tickets')
  })

  it('shows a standalone initialization state before rendering protected chrome', () => {
    renderAppAt('/', { ...unauthenticated, status: 'initializing' })

    expect(screen.getByRole('status')).toHaveTextContent('Preparing Microsoft sign-in')
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument()
  })

  it('keeps the dashboard and its navigation chrome at the root route', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))

    renderAppAt('/')

    expect(screen.getByRole('heading', { name: 'Good morning, Alex.' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Loading your workspace…')).not.toBeInTheDocument())
  })

  it('navigates from the sidebar to the routed Tickets workspace', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'grid', section: 'Overview' },
        { id: 'tickets', label: 'Tickets', path: '/tickets', icon: 'activity', section: 'Overview' },
      ],
    }))

    renderAppAt('/')

    await user.click(await screen.findByRole('button', { name: 'Tickets' }))

    expect(screen.getByRole('heading', { name: 'Tickets', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tickets' })).toHaveAttribute('aria-current', 'page')
  })

  it('supports direct navigation to the Tickets route', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))

    renderAppAt('/tickets')

    expect(screen.getByRole('heading', { name: 'Tickets', level: 1 })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Loading your workspace…')).not.toBeInTheDocument())
  })

  it('uses Microsoft logout from the authenticated shell', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))

    renderAppAt('/')

    await user.click(screen.getByRole('button', { name: 'User menu for Alex Morgan' }))
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }))

    expect(signOut).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it.each(demoModules)(
    'supports direct navigation to the $title demo and marks it active',
    async ({ path, title }) => {
      stubNavigation()
      renderAppAt(path)

      expect(screen.getByRole('heading', { name: title, level: 1 })).toBeInTheDocument()
      expect(screen.getByText('Demo data · resets on refresh')).toBeInTheDocument()
      expect(screen.queryByText('Coming soon')).not.toBeInTheDocument()

      const activeItem = await screen.findByRole('button', { name: title })
      expect(activeItem).toHaveAttribute('aria-current', 'page')
    },
  )

  it.each(demoModules)(
    'navigates from the sidebar to the $title demo',
    async ({ title }) => {
      const user = userEvent.setup()
      stubNavigation()
      renderAppAt('/')

      const sidebarItem = await screen.findByRole('button', { name: title })
      await user.click(sidebarItem)

      expect(screen.getByRole('heading', { name: title, level: 1 })).toBeInTheDocument()
      expect(sidebarItem).toHaveAttribute('aria-current', 'page')
    },
  )

  it('preserves direct navigation to the implemented Clients workspace', async () => {
    stubNavigation()
    renderAppAt('/clients')

    expect(screen.getByRole('heading', { name: 'Clients', level: 1 })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Clients' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders an in-portal not-found page with a working return action', async () => {
    const user = userEvent.setup()
    stubNavigation()
    renderAppAt('/unknown-portal-page')

    expect(screen.getByRole('heading', { name: 'Page not found', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { current: 'page' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Return to Dashboard' }))

    expect(screen.getByRole('heading', { name: 'Good morning, Alex.' })).toBeInTheDocument()
  })

  it('preserves module routing through browser back and forward navigation', async () => {
    const user = userEvent.setup()
    stubNavigation()

    render(
      <AuthenticationContext.Provider value={authenticated}>
        <MemoryRouter initialEntries={['/', '/devices']} initialIndex={1}>
          <App />
          <HistoryControls />
        </MemoryRouter>
      </AuthenticationContext.Provider>,
    )

    expect(screen.getByRole('heading', { name: 'Devices', level: 1 })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Test browser back' }))
    expect(screen.getByRole('heading', { name: 'Good morning, Alex.' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Test browser forward' }))
    expect(screen.getByRole('heading', { name: 'Devices', level: 1 })).toBeInTheDocument()
  })
})
