import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthenticationContext, type AuthenticationContextValue } from '../../auth/AuthContext'
import { Header } from './Header'

const signOut = vi.fn().mockResolvedValue(undefined)
const authentication: AuthenticationContextValue = {
  status: 'authenticated',
  account: { name: 'Alex Morgan', username: 'alex.morgan@example.com' },
  error: null,
  signIn: vi.fn().mockResolvedValue(undefined),
  signOut,
}

function renderHeader() {
  return render(
    <AuthenticationContext.Provider value={authentication}>
      <MemoryRouter>
        <Header onOpenMenu={() => undefined} />
      </MemoryRouter>
    </AuthenticationContext.Provider>,
  )
}

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.clearAllMocks()
  })

  it('announces the visible signed-in identity', () => {
    renderHeader()

    expect(screen.getByText('Portal Dashboard')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'User menu for Alex Morgan' })).toHaveTextContent('AM')
  })

  it('opens the profile menu with sensible focus and dismisses it outside', async () => {
    const user = userEvent.setup()
    renderHeader()
    const trigger = screen.getByRole('button', { name: 'User menu for Alex Morgan' })

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument()
    expect(screen.getByText('alex.morgan@example.com')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus()

    await user.click(document.body)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the profile menu with Escape and returns focus to its trigger', async () => {
    const user = userEvent.setup()
    renderHeader()
    const trigger = screen.getByRole('button', { name: 'User menu for Alex Morgan' })

    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('calls Microsoft sign-out and closes the profile menu', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByRole('button', { name: 'User menu for Alex Morgan' }))
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }))

    expect(signOut).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('switches to dark mode and saves the preference', async () => {
    renderHeader()

    const toggle = screen.getByRole('button', { name: 'Switch to dark mode' })
    fireEvent.click(toggle)

    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
      expect(window.localStorage.getItem('theme')).toBe('dark')
    })
  })

  it('restores a saved dark-mode preference', async () => {
    window.localStorage.setItem('theme', 'dark')

    renderHeader()

    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'))
  })
})
