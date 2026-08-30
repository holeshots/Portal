import { useState } from 'react'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthentication } from '../../auth/AuthContext'
import acrivosLogo from '../../assets/acrivos-logo-icon.webp'
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle'
import './LoginPage.css'

interface LoginLocationState {
  from?: string
}

function getReturnPath(state: unknown) {
  const from = (state as LoginLocationState | null)?.from
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/'
}

export function LoginPage() {
  const { error, signIn, status } = useAuthentication()
  const location = useLocation()
  const [isStartingSignIn, setIsStartingSignIn] = useState(false)
  const returnTo = getReturnPath(location.state)

  if (status === 'authenticated') {
    return <Navigate to={returnTo} replace />
  }

  const handleSignIn = async () => {
    setIsStartingSignIn(true)

    try {
      await signIn(returnTo)
    } catch {
      setIsStartingSignIn(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-label="Acrivos Portal introduction">
        <div className="login-story-content">
          <div className="login-brand login-brand-on-dark">
            <img
              className="brand-logo-image"
              src={acrivosLogo}
              alt=""
              aria-hidden="true"
              width="2048"
              height="2048"
            />
            <span>Acrivos Portal</span>
          </div>
          <div className="login-story-copy">
            <span className="login-story-kicker"><ShieldCheck size={15} aria-hidden="true" /> Operations, in focus</span>
            <h2>Clear work.<br />Confident decisions.</h2>
            <p>One dependable workspace for reports, approvals, and the work that keeps your team moving.</p>
          </div>
          <p className="login-story-footnote">Built for focused, secure operations.</p>
        </div>
        <span className="login-orbit login-orbit-one" aria-hidden="true" />
        <span className="login-orbit login-orbit-two" aria-hidden="true" />
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-panel-header">
          <div className="login-brand login-brand-compact">
            <img
              className="brand-logo-image"
              src={acrivosLogo}
              alt=""
              aria-hidden="true"
              width="2048"
              height="2048"
            />
            <span>Acrivos Portal</span>
          </div>
          <ThemeToggle className="login-theme-toggle" />
        </div>

        <div className="login-form-shell">
          <div className="login-heading">
            <span className="login-heading-icon" aria-hidden="true"><LockKeyhole size={19} /></span>
            <span className="eyebrow">Welcome back</span>
            <h1 id="login-title">Continue to your workspace</h1>
            <p>Use your Microsoft account to securely continue to Acrivos Portal.</p>
          </div>

          <div className="microsoft-login-flow">
            {error && (
              <div className="login-auth-error" role="alert">
                <strong>Unable to continue</strong>
                <span>{error}</span>
              </div>
            )}

            {status === 'initializing' ? (
              <div className="login-auth-progress" role="status">
                <span className="state-pulse" aria-hidden="true" />
                Checking your Microsoft session…
              </div>
            ) : (
              <button
                className="microsoft-login-button"
                type="button"
                disabled={status === 'configuration-error' || isStartingSignIn}
                onClick={() => void handleSignIn()}
              >
                <span className="microsoft-mark" aria-hidden="true">
                  <span /><span /><span /><span />
                </span>
                {isStartingSignIn ? 'Redirecting to Microsoft…' : 'Continue with Microsoft'}
              </button>
            )}

            <p className="login-security-note">
              Microsoft handles your credentials. Acrivos Portal does not store your password.
            </p>
          </div>
        </div>

        <p className="login-help">Need help? Contact your workspace administrator.</p>
      </section>
    </main>
  )
}
