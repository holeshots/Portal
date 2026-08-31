import { createContext, useContext } from 'react'

export type AuthenticationStatus =
  | 'initializing'
  | 'unauthenticated'
  | 'authenticated'
  | 'configuration-error'

export interface PortalAccount {
  name: string
  username: string
}

export interface AuthenticationContextValue {
  status: AuthenticationStatus
  account: PortalAccount | null
  error: string | null
  signIn: (returnTo: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthenticationContext = createContext<AuthenticationContextValue | null>(null)

export function useAuthentication() {
  const context = useContext(AuthenticationContext)

  if (!context) {
    throw new Error('useAuthentication must be used within an AuthenticationProvider.')
  }

  return context
}

export function getAccountDisplayName(account: PortalAccount | null) {
  return account?.name.trim() || account?.username.trim() || 'Microsoft account'
}

export function getAccountGivenName(account: PortalAccount | null) {
  return getAccountDisplayName(account).split(/\s+/)[0]
}

export function getAccountInitials(account: PortalAccount | null) {
  const displayName = getAccountDisplayName(account)
  const parts = displayName.split(/\s+/).filter(Boolean)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts.at(-1)?.[0] ?? ''}`.toUpperCase()
}
