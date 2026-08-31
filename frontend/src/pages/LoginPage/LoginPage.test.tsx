import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  AuthenticationContext,
  type AuthenticationContextValue,
} from '../../auth/AuthContext'
import { missingClientIdMessage } from '../../auth/authConfig'
import { LoginPage } from './LoginPage'

const signedOutAuthentication: AuthenticationContextValue = {
  status: 'unauthenticated',
  account: null,
  error: null,
  signIn: vi.fn().mockResolvedValue(undefined),
  signOut: vi.fn().mockResolvedValue(undefined),
}

function renderLogin(
  authentication: AuthenticationContextValue = signedOutAuthentication,
  initialEntry: string | { pathname: string; state?: unknown } = '/login',
) {
  return render(
    <AuthenticationContext.Provider value={authentication}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<h1>Dashboard preview</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthenticationContext.Provider>,
  )
}

describe('LoginPage Microsoft sign-in boundary', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.clearAllMocks()
  })

  it('renders one signed-out Microsoft flow without credential fields or portal chrome', () => {
    const { container } = renderLogin()

    expect(screen.getByRole('heading', { name: 'Continue to your workspace' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue with Microsoft' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument()
    expect(screen.getAllByText('Portal Dashboard')).toHaveLength(2)
    expect(screen.getByRole('region', { name: 'Portal Dashboard introduction' })).toBeInTheDocument()
    expect(container.querySelector('.login-page img')).not.toBeInTheDocument()
  })

  it('announces MSAL initialization and prevents a second interaction', () => {
    renderLogin({ ...signedOutAuthentication, status: 'initializing' })

    expect(screen.getByRole('status')).toHaveTextContent('Checking your Microsoft session…')
    expect(screen.queryByRole('button', { name: 'Continue with Microsoft' })).not.toBeInTheDocument()
  })

  it('shows an accessible configuration error without fake fallback authentication', () => {
    renderLogin({
      ...signedOutAuthentication,
      status: 'configuration-error',
      error: missingClientIdMessage,
    })

    expect(screen.getByRole('alert')).toHaveTextContent(missingClientIdMessage)
    expect(screen.getByRole('button', { name: 'Continue with Microsoft' })).toBeDisabled()
  })

  it('starts redirect sign-in with the protected destination', async () => {
    const user = userEvent.setup()
    const signIn = vi.fn().mockResolvedValue(undefined)
    renderLogin(
      { ...signedOutAuthentication, signIn },
      { pathname: '/login', state: { from: '/tickets?status=New' } },
    )

    await user.click(screen.getByRole('button', { name: 'Continue with Microsoft' }))

    expect(signIn).toHaveBeenCalledWith('/tickets?status=New')
    expect(screen.getByRole('button', { name: 'Redirecting to Microsoft…' })).toBeDisabled()
  })

  it('falls back to the dashboard for a suspicious return path', async () => {
    const user = userEvent.setup()
    const signIn = vi.fn().mockResolvedValue(undefined)
    renderLogin(
      { ...signedOutAuthentication, signIn },
      { pathname: '/login', state: { from: '/%5C%5Cmalicious.example/path' } },
    )

    await user.click(screen.getByRole('button', { name: 'Continue with Microsoft' }))

    expect(signIn).toHaveBeenCalledWith('/')
  })

  it('supports keyboard activation and displays a cancelled or failed sign-in message', async () => {
    const user = userEvent.setup()
    const error = 'Microsoft sign-in was cancelled or could not be completed. Please try again.'
    renderLogin({ ...signedOutAuthentication, error })

    await user.tab()
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Continue with Microsoft' })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(signedOutAuthentication.signIn).toHaveBeenCalledWith('/')
    expect(screen.getByRole('alert')).toHaveTextContent(error)
  })

  it('redirects an authenticated account away from the login route', () => {
    renderLogin({
      ...signedOutAuthentication,
      status: 'authenticated',
      account: { name: 'Alex Morgan', username: 'alex@example.com' },
    })

    expect(screen.getByRole('heading', { name: 'Dashboard preview' })).toBeInTheDocument()
  })
})
