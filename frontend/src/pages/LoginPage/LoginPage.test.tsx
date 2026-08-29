import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './LoginPage'

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<h1>Dashboard preview</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders a focused login experience with persistent field labels', () => {
    renderLogin()

    expect(screen.getByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()
    expect(screen.getByLabelText('Work email')).toHaveAttribute('autocomplete', 'email')
    expect(screen.getByLabelText('Password')).toHaveAttribute('autocomplete', 'current-password')
    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Forgot password?' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Notifications' })).not.toBeInTheDocument()
  })

  it('shows actionable required-field errors and focuses the first invalid field', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    const email = screen.getByLabelText('Work email')
    const password = screen.getByLabelText('Password')
    expect(screen.getByText('Enter your work email address.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(password).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveFocus()
  })

  it('validates the email format with a useful example', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Work email'), 'not-an-email')
    await user.type(screen.getByLabelText('Password'), 'demo-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Enter a valid email address, such as name@company.com.')).toBeInTheDocument()
    expect(screen.getByLabelText('Work email')).toHaveFocus()
  })

  it('supports keyboard navigation and toggles password visibility with Enter', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toHaveFocus()
    await user.tab()
    expect(screen.getByLabelText('Work email')).toHaveFocus()
    await user.tab()
    expect(screen.getByLabelText('Password')).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('navigates to the dashboard preview after a valid demo submission', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Work email'), 'jed@acrivos.example')
    await user.type(screen.getByLabelText('Password'), 'demo-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByRole('heading', { name: 'Dashboard preview' })).toBeInTheDocument()
  })

  it('announces clearly that password recovery is not connected yet', async () => {
    const user = userEvent.setup()
    renderLogin()
    const forgotPassword = screen.getByRole('button', { name: 'Forgot password?' })

    forgotPassword.focus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('status')).toHaveTextContent(
      'Password recovery will be available when authentication is connected.',
    )
  })
})
