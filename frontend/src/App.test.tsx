import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import App from './App'
import { MODULE_PLACEHOLDERS } from './pages/ModulePlaceholderPage/modulePlaceholders'
import type { NavigationItem } from './types/navigation'

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

function stubNavigation(items: NavigationItem[] = navigationItems) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => items,
  }))
}

function renderAppAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
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
  afterEach(() => vi.unstubAllGlobals())

  it('renders the standalone login route without dashboard chrome', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Notifications' })).not.toBeInTheDocument()
  })

  it('keeps the dashboard and its navigation chrome at the root route', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Good morning, Jed.' })).toBeInTheDocument()
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

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('button', { name: 'Tickets' }))

    expect(screen.getByRole('heading', { name: 'Tickets', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tickets' })).toHaveAttribute('aria-current', 'page')
  })

  it('supports direct navigation to the Tickets route', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))

    render(
      <MemoryRouter initialEntries={['/tickets']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Tickets', level: 1 })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Loading your workspace…')).not.toBeInTheDocument())
  })

  it('signs out to the standalone login route without portal chrome', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'User menu for Jed Turqueza' }))
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }))

    expect(screen.getByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Notifications' })).not.toBeInTheDocument()
  })

  it.each(MODULE_PLACEHOLDERS)(
    'supports direct navigation to $path and marks $title active',
    async ({ path, title }) => {
      stubNavigation()
      renderAppAt(path)

      expect(screen.getByRole('heading', { name: title, level: 1 })).toBeInTheDocument()
      expect(screen.getByText('Coming soon')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Back to Dashboard' })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: 'Open Tickets' })).toHaveAttribute('href', '/tickets')

      const activeItem = await screen.findByRole('button', { name: title })
      expect(activeItem).toHaveAttribute('aria-current', 'page')
    },
  )

  it.each(MODULE_PLACEHOLDERS)(
    'navigates from the sidebar to the $title placeholder',
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

  it('renders an in-portal not-found page with a working return action', async () => {
    const user = userEvent.setup()
    stubNavigation()
    renderAppAt('/unknown-portal-page')

    expect(screen.getByRole('heading', { name: 'Page not found', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { current: 'page' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Return to Dashboard' }))

    expect(screen.getByRole('heading', { name: 'Good morning, Jed.' })).toBeInTheDocument()
  })

  it('preserves module routing through browser back and forward navigation', async () => {
    const user = userEvent.setup()
    stubNavigation()

    render(
      <MemoryRouter initialEntries={['/', '/devices']} initialIndex={1}>
        <App />
        <HistoryControls />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Devices', level: 1 })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Test browser back' }))
    expect(screen.getByRole('heading', { name: 'Good morning, Jed.' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Test browser forward' }))
    expect(screen.getByRole('heading', { name: 'Devices', level: 1 })).toBeInTheDocument()
  })
})
