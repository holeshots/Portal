import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  EventType,
  InteractionStatus,
  InteractionType,
  type AccountInfo,
  type EventCallbackFunction,
  type IPublicClientApplication,
} from '@azure/msal-browser'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthenticationProvider } from './AuthenticationProvider'
import { useAuthentication } from './AuthContext'
import {
  MICROSOFT_COMMON_AUTHORITY,
  MICROSOFT_LOGIN_SCOPES,
  createMsalConfiguration,
  missingClientIdMessage,
  normalizeClientId,
  toSafeReturnPath,
  toSafeReturnUrl,
} from './authConfig'

const initializationErrorMessage =
  'Microsoft sign-in could not be initialized. Refresh the page or contact your administrator.'

const msalReactState = vi.hoisted(() => ({
  current: null as unknown as {
    accounts: AccountInfo[]
    inProgress: InteractionStatus
    instance: IPublicClientApplication
  },
}))

vi.mock('@azure/msal-react', () => ({
  MsalProvider: ({ children }: { children: React.ReactNode }) => children,
  useMsal: () => msalReactState.current,
}))

function createAccount(id: string, name: string, loginHint?: string): AccountInfo {
  return {
    environment: 'login.microsoftonline.com',
    homeAccountId: `home-${id}`,
    localAccountId: `local-${id}`,
    loginHint,
    name,
    tenantId: `tenant-${id}`,
    username: `${id}@example.com`,
  }
}

function createMockInstance({
  accounts = [],
  activeAccount = null,
  initialize = vi.fn().mockResolvedValue(undefined),
  redirectResult = null,
}: {
  accounts?: AccountInfo[]
  activeAccount?: AccountInfo | null
  initialize?: ReturnType<typeof vi.fn>
  redirectResult?: { account: AccountInfo } | null
} = {}) {
  let currentActiveAccount = activeAccount
  let eventCallback: EventCallbackFunction | null = null

  const instance = {
    addEventCallback: vi.fn((callback: EventCallbackFunction) => {
      eventCallback = callback
      return 'callback-id'
    }),
    getActiveAccount: vi.fn(() => currentActiveAccount),
    getAllAccounts: vi.fn(() => accounts),
    handleRedirectPromise: vi.fn().mockResolvedValue(redirectResult),
    initialize,
    loginRedirect: vi.fn().mockResolvedValue(undefined),
    logoutRedirect: vi.fn().mockResolvedValue(undefined),
    removeEventCallback: vi.fn(),
    setActiveAccount: vi.fn((account: AccountInfo | null) => {
      currentActiveAccount = account
    }),
  } as unknown as IPublicClientApplication

  msalReactState.current = {
    accounts,
    inProgress: InteractionStatus.None,
    instance,
  }

  return {
    eventCallback: () => eventCallback,
    instance,
  }
}

function AuthenticationProbe() {
  const { account, error, signOut, status } = useAuthentication()

  return (
    <div>
      <p>{status}: {error}</p>
      <span>{account?.name}</span>
      <button type="button" onClick={() => void signOut()}>Sign out probe</button>
    </div>
  )
}

describe('MSAL configuration and provider boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses the common authority, session storage, and origin-based redirects', () => {
    const configuration = createMsalConfiguration(
      '11111111-1111-1111-1111-111111111111',
      'https://portal.example.com',
    )

    expect(configuration.auth).toMatchObject({
      clientId: '11111111-1111-1111-1111-111111111111',
      authority: MICROSOFT_COMMON_AUTHORITY,
      redirectUri: 'https://portal.example.com',
      postLogoutRedirectUri: 'https://portal.example.com',
    })
    expect(configuration.cache?.cacheLocation).toBe('sessionStorage')
    expect(configuration.system?.loggerOptions?.piiLoggingEnabled).toBe(false)
    expect(MICROSOFT_LOGIN_SCOPES).toEqual(['openid', 'profile', 'email'])
    expect(MICROSOFT_LOGIN_SCOPES).not.toContain('User.Read')
  })

  it('rejects missing configuration before constructing MSAL', () => {
    render(
      <AuthenticationProvider clientId="   ">
        <AuthenticationProbe />
      </AuthenticationProvider>,
    )

    expect(screen.getByText(new RegExp(missingClientIdMessage))).toHaveTextContent(
      `configuration-error: ${missingClientIdMessage}`,
    )
    expect(normalizeClientId(undefined)).toBeNull()
  })

  it.each([
    ['//malicious.example/path', '/'],
    ['/\\malicious.example/path', '/'],
    ['/%5C%5Cmalicious.example/path', '/'],
    ['/%255C%255Cmalicious.example/path', '/'],
    ['/%2F%2Fmalicious.example/path', '/'],
    ['https://malicious.example/path', '/'],
    ['/%E0%A4%A', '/'],
    ['/', '/'],
    ['/tickets?status=New#queue', '/tickets?status=New#queue'],
    ['/?next=https://malicious.example/path', '/?next=https://malicious.example/path'],
  ])('normalizes return path %s to %s on the portal origin', (returnTo, expectedPath) => {
    expect(toSafeReturnPath(returnTo, 'https://portal.example.com')).toBe(expectedPath)
    expect(toSafeReturnUrl(returnTo, 'https://portal.example.com')).toBe(
      `https://portal.example.com${expectedPath}`,
    )
  })

  it('sets the AccountInfo from LOGIN_SUCCESS active when multiple accounts are cached', async () => {
    const cachedAccount = createAccount('cached', 'Cached User')
    const selectedAccount = createAccount('selected', 'Selected User')
    const { eventCallback, instance } = createMockInstance({
      accounts: [cachedAccount, selectedAccount],
      activeAccount: cachedAccount,
    })

    render(
      <AuthenticationProvider instance={instance}>
        <AuthenticationProbe />
      </AuthenticationProvider>,
    )

    await screen.findByText('Cached User')

    act(() => {
      eventCallback()?.({
        correlationId: 'login-correlation',
        error: null,
        eventType: EventType.LOGIN_SUCCESS,
        interactionType: InteractionType.Redirect,
        payload: selectedAccount,
        timestamp: Date.now(),
      })
    })

    expect(instance.setActiveAccount).toHaveBeenCalledWith(selectedAccount)
    expect(screen.getByText('Selected User')).toBeInTheDocument()
  })

  it('clears all portal accounts on logout while retaining the selected Microsoft session hint', async () => {
    const user = userEvent.setup()
    const selectedAccount = createAccount('selected', 'Selected User', 'opaque-login-hint')
    const otherAccount = createAccount('other', 'Other User')
    const { instance } = createMockInstance({
      accounts: [otherAccount, selectedAccount],
      activeAccount: selectedAccount,
    })

    render(
      <AuthenticationProvider instance={instance}>
        <AuthenticationProbe />
      </AuthenticationProvider>,
    )

    await screen.findByText('Selected User')
    await user.click(screen.getByRole('button', { name: 'Sign out probe' }))

    await waitFor(() => {
      expect(instance.logoutRedirect).toHaveBeenCalledWith({
        logoutHint: 'opaque-login-hint',
        postLogoutRedirectUri: window.location.origin,
      })
    })
    expect(instance.logoutRedirect).not.toHaveBeenCalledWith(
      expect.objectContaining({ account: expect.anything() }),
    )
  })

  it('exposes an actionable error when MSAL initialization rejects', async () => {
    const initialize = vi.fn().mockRejectedValue(new Error('startup failed'))
    const { instance } = createMockInstance({ initialize })

    render(
      <AuthenticationProvider instance={instance}>
        <AuthenticationProbe />
      </AuthenticationProvider>,
    )

    expect(screen.getByText(/^initializing:/)).toBeInTheDocument()
    expect(await screen.findByText(new RegExp(initializationErrorMessage))).toHaveTextContent(
      `configuration-error: ${initializationErrorMessage}`,
    )
    expect(instance.handleRedirectPromise).not.toHaveBeenCalled()
  })

  it('exposes an actionable error when redirect handling rejects during startup', async () => {
    const { instance } = createMockInstance()
    vi.mocked(instance.handleRedirectPromise).mockRejectedValue(new Error('redirect failed'))

    render(
      <AuthenticationProvider instance={instance}>
        <AuthenticationProbe />
      </AuthenticationProvider>,
    )

    expect(await screen.findByText(new RegExp(initializationErrorMessage))).toHaveTextContent(
      `configuration-error: ${initializationErrorMessage}`,
    )
  })
})
