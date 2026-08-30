import { BrowserCacheLocation, type Configuration } from '@azure/msal-browser'

export const MICROSOFT_COMMON_AUTHORITY = 'https://login.microsoftonline.com/common'
export const MICROSOFT_LOGIN_SCOPES = ['openid', 'profile', 'email']

export const missingClientIdMessage =
  'Microsoft sign-in is not configured for this portal. Ask your administrator to add the Microsoft Entra application client ID.'

export function normalizeClientId(clientId: string | undefined) {
  const normalized = clientId?.trim()
  return normalized || null
}

export function createMsalConfiguration(clientId: string, origin = window.location.origin): Configuration {
  return {
    auth: {
      clientId,
      authority: MICROSOFT_COMMON_AUTHORITY,
      redirectUri: origin,
      postLogoutRedirectUri: origin,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
    },
    system: {
      loggerOptions: {
        loggerCallback: () => undefined,
        piiLoggingEnabled: false,
      },
    },
  }
}

export function toSafeReturnUrl(returnTo: string, origin = window.location.origin) {
  const safePath = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/'
  return new URL(safePath, origin).href
}
