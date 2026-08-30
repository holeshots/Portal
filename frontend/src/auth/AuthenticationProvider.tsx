import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import {
  EventType,
  InteractionStatus,
  InteractionType,
  PublicClientApplication,
  type AuthenticationResult,
  type EventMessage,
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
}

function MsalAuthenticationBridge({ children }: PropsWithChildren) {
  const { accounts, inProgress, instance } = useMsal()
  const [error, setError] = useState<string | null>(null)
  const [initializationFailed, setInitializationFailed] = useState(false)
  const account = instance.getActiveAccount() ?? accounts[0] ?? null

  useEffect(() => {
    const callbackId = instance.addEventCallback((message: EventMessage) => {
      if (message.eventType === EventType.LOGIN_SUCCESS) {
        const result = message.payload as AuthenticationResult | null
        if (result?.account) instance.setActiveAccount(result.account)
        setError(null)
      }

      if (message.eventType === EventType.INITIALIZE_END && message.error) {
        setInitializationFailed(true)
        setError(initializationErrorMessage)
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
      await instance.logoutRedirect({
        account: account ?? undefined,
        postLogoutRedirectUri: window.location.origin,
      })
    } catch {
      setError(signOutErrorMessage)
      throw new Error(signOutErrorMessage)
    }
  }, [account, instance])

  const value = useMemo<AuthenticationContextValue>(() => ({
    status: initializationFailed
      ? 'configuration-error'
      : inProgress === InteractionStatus.None
      ? account ? 'authenticated' : 'unauthenticated'
      : 'initializing',
    account: account ? {
      name: account.name?.trim() || account.username,
      username: account.username,
    } : null,
    error,
    signIn,
    signOut,
  }), [account, error, initializationFailed, inProgress, signIn, signOut])

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>
}

export function AuthenticationProvider({
  children,
  clientId = import.meta.env.VITE_MSAL_CLIENT_ID,
}: AuthenticationProviderProps) {
  const normalizedClientId = normalizeClientId(clientId)
  const instance = useMemo(
    () => normalizedClientId
      ? new PublicClientApplication(createMsalConfiguration(normalizedClientId))
      : null,
    [normalizedClientId],
  )

  const configurationErrorValue = useMemo<AuthenticationContextValue>(() => ({
    status: 'configuration-error',
    account: null,
    error: missingClientIdMessage,
    signIn: async () => undefined,
    signOut: async () => undefined,
  }), [])

  if (!instance) {
    return (
      <AuthenticationContext.Provider value={configurationErrorValue}>
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
