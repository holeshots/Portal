import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header onOpenMenu={() => undefined} />
    </MemoryRouter>,
  )
}

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('announces the visible signed-in identity', () => {
    renderHeader()

    expect(screen.getByRole('button', { name: 'User menu for Jed Turqueza' })).toHaveTextContent('JT')
  })

  it('opens the profile menu with sensible focus and dismisses it outside', async () => {
    const user = userEvent.setup()
    renderHeader()
    const trigger = screen.getByRole('button', { name: 'User menu for Jed Turqueza' })

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Jed Turqueza')).toBeInTheDocument()
    expect(screen.getByText('MSP Administrator')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus()

    await user.click(document.body)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the profile menu with Escape and returns focus to its trigger', async () => {
    const user = userEvent.setup()
    renderHeader()
    const trigger = screen.getByRole('button', { name: 'User menu for Jed Turqueza' })

    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
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
