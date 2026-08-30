import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthenticationProvider } from './AuthenticationProvider'
import { useAuthentication } from './AuthContext'
import {
  MICROSOFT_COMMON_AUTHORITY,
  MICROSOFT_LOGIN_SCOPES,
  createMsalConfiguration,
  missingClientIdMessage,
  normalizeClientId,
  toSafeReturnUrl,
} from './authConfig'

function AuthenticationProbe() {
  const { error, status } = useAuthentication()
  return <p>{status}: {error}</p>
}

describe('MSAL configuration and provider boundary', () => {
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

  it('keeps return navigation on the current origin', () => {
    expect(toSafeReturnUrl('/tickets?status=New', 'https://portal.example.com')).toBe(
      'https://portal.example.com/tickets?status=New',
    )
    expect(toSafeReturnUrl('//malicious.example/path', 'https://portal.example.com')).toBe(
      'https://portal.example.com/',
    )
  })
})
