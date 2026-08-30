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

function parseSafeReturnUrl(returnTo: string, origin: string) {
  const portalOrigin = new URL(origin).origin
  const fallback = new URL('/', portalOrigin)

  if (!returnTo.startsWith('/') || returnTo.startsWith('//') || returnTo.includes('\\')) {
    return fallback
  }

  const path = returnTo.split(/[?#]/, 1)[0]

  if (/%(?:25)*(?:2f|5c)/i.test(path)) {
    return fallback
  }

  try {
    const decodedPath = decodeURIComponent(path)

    if (decodedPath.startsWith('//') || decodedPath.includes('\\')) {
      return fallback
    }

    const candidate = new URL(returnTo, portalOrigin)
    return candidate.origin === portalOrigin ? candidate : fallback
  } catch {
    return fallback
  }
}

export function toSafeReturnPath(returnTo: string, origin = window.location.origin) {
  const safeUrl = parseSafeReturnUrl(returnTo, origin)
  return `${safeUrl.pathname}${safeUrl.search}${safeUrl.hash}`
}

export function toSafeReturnUrl(returnTo: string, origin = window.location.origin) {
  return parseSafeReturnUrl(returnTo, origin).href
}
