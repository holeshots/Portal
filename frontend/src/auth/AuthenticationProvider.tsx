import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import {
  EventType,
  InteractionStatus,
  InteractionType,
  PublicClientApplication,
  type AccountInfo,
  type EventMessage,
  type IPublicClientApplication,
} from '@azure/msal-browser'
import { MsalProvider, useMsal } from '@azure/msal-react'
import { AuthenticationContext, type AuthenticationContextValue } from './AuthContext'
import {
  createMsalConfiguration,
  missingClientIdMessage,
  MICROSOFT_LOGIN_SCOPES,
  normalizeClientId,
  toSafeReturnUrl,
} from './authConfig'

const signInErrorMessage =
  'Microsoft sign-in was cancelled or could not be completed. Please try again.'
const signOutErrorMessage = 'We could not sign you out of Microsoft. Please try again.'
const initializationErrorMessage =
  'Microsoft sign-in could not be initialized. Refresh the page or contact your administrator.'

interface AuthenticationProviderProps extends PropsWithChildren {
  clientId?: string
  instance?: IPublicClientApplication
}

function MsalAuthenticationBridge({ children }: PropsWithChildren) {
  const { accounts, inProgress, instance } = useMsal()
  const [error, setError] = useState<string | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<AccountInfo | null>(
    () => instance.getActiveAccount(),
  )
  const account = selectedAccount ?? instance.getActiveAccount() ?? accounts[0] ?? null

  useEffect(() => {
    const callbackId = instance.addEventCallback((message: EventMessage) => {
      if (message.eventType === EventType.LOGIN_SUCCESS) {
        const signedInAccount = message.payload as AccountInfo | null

        if (signedInAccount) {
          instance.setActiveAccount(signedInAccount)
          setSelectedAccount(signedInAccount)
        }

        setError(null)
      }

      if (
        message.eventType === EventType.ACQUIRE_TOKEN_FAILURE
        && message.interactionType === InteractionType.Redirect
      ) {
        setError(signInErrorMessage)
      }
    })

    return () => {
      if (callbackId) instance.removeEventCallback(callbackId)
    }
  }, [instance])

  const signIn = useCallback(async (returnTo: string) => {
    setError(null)

    try {
      await instance.loginRedirect({
        scopes: MICROSOFT_LOGIN_SCOPES,
        redirectStartPage: toSafeReturnUrl(returnTo),
      })
    } catch {
      setError(signInErrorMessage)
      throw new Error(signInErrorMessage)
    }
  }, [instance])

  const signOut = useCallback(async () => {
    setError(null)

    try {
      const idTokenLogoutHint = account?.idTokenClaims?.login_hint
      const logoutHint = account?.loginHint
        ?? (typeof idTokenLogoutHint === 'string' ? idTokenLogoutHint : undefined)

      await instance.logoutRedirect({
        logoutHint,
        postLogoutRedirectUri: window.location.origin,
      })
    } catch {
      setError(signOutErrorMessage)
      throw new Error(signOutErrorMessage)
    }
  }, [account, instance])

  const value = useMemo<AuthenticationContextValue>(() => ({
    status: inProgress === InteractionStatus.None
      ? account ? 'authenticated' : 'unauthenticated'
      : 'initializing',
    account: account ? {
      name: account.name?.trim() || account.username,
      username: account.username,
    } : null,
    error,
    signIn,
    signOut,
  }), [account, error, inProgress, signIn, signOut])

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>
}

function MsalInitializationBoundary({
  children,
  instance,
}: PropsWithChildren<{ instance: IPublicClientApplication }>) {
  const [initializationError, setInitializationError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      try {
        await instance.initialize()
        const redirectResult = await instance.handleRedirectPromise()

        if (redirectResult?.account) {
          instance.setActiveAccount(redirectResult.account)
        }

        if (isMounted) setIsReady(true)
      } catch {
        if (isMounted) setInitializationError(initializationErrorMessage)
      }
    }

    void initialize()

    return () => {
      isMounted = false
    }
  }, [instance])

  const errorValue = useMemo<AuthenticationContextValue>(() => ({
    status: 'configuration-error',
    account: null,
    error: initializationErrorMessage,
    signIn: async () => undefined,
    signOut: async () => undefined,
  }), [])

  const loadingValue = useMemo<AuthenticationContextValue>(() => ({
    status: 'initializing',
    account: null,
    error: null,
    signIn: async () => undefined,
    signOut: async () => undefined,
  }), [])

  if (initializationError) {
    return (
      <AuthenticationContext.Provider value={errorValue}>
        {children}
      </AuthenticationContext.Provider>
    )
  }

  if (!isReady) {
    return (
      <AuthenticationContext.Provider value={loadingValue}>
        {children}
      </AuthenticationContext.Provider>
    )
  }

  return (
    <MsalProvider instance={instance}>
      <MsalAuthenticationBridge>{children}</MsalAuthenticationBridge>
    </MsalProvider>
  )
}

export function AuthenticationProvider({
  children,
  clientId = import.meta.env.VITE_MSAL_CLIENT_ID,
  instance: providedInstance,
}: AuthenticationProviderProps) {
  const normalizedClientId = normalizeClientId(clientId)
  const instance = useMemo(
    () => providedInstance ?? (normalizedClientId
      ? new PublicClientApplication(createMsalConfiguration(normalizedClientId))
      : null),
    [normalizedClientId, providedInstance],
  )

  const configurationErrorValue = useMemo<AuthenticationContextValue>(() => ({
    status: 'configuration-error',
    account: null,
    error: missingClientIdMessage,
    signIn: async () => undefined,
    signOut: async () => undefined,
  }), [])

  if (!instance || (!providedInstance && !normalizedClientId)) {
    return (
      <AuthenticationContext.Provider value={configurationErrorValue}>
        {children}
      </AuthenticationContext.Provider>
    )
  }

  return (
    <MsalInitializationBoundary instance={instance}>
      {children}
    </MsalInitializationBoundary>
  )
}
