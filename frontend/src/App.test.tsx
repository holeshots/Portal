import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import App from './App'

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
})
