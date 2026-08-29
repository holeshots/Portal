import { useRef, useState, type FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle'
import { completeDemoSignIn } from './demoLogin'
import './LoginPage.css'

interface LoginErrors {
  email?: string
  password?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {}

  if (!email.trim()) {
    errors.email = 'Enter your work email address.'
  } else if (!emailPattern.test(email.trim())) {
    errors.email = 'Enter a valid email address, such as name@company.com.'
  }

  if (!password) errors.password = 'Enter your password.'

  return errors
}

export function LoginPage() {
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateLogin(email, password)
    setErrors(nextErrors)

    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }

    if (nextErrors.password) {
      passwordRef.current?.focus()
      return
    }

    completeDemoSignIn(navigate)
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-label="Acrivos Portal introduction">
        <div className="login-story-content">
          <div className="login-brand login-brand-on-dark">
            <span className="login-brand-mark" aria-hidden="true"><span /><span /></span>
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
            <span className="login-brand-mark" aria-hidden="true"><span /><span /></span>
            <span>Acrivos Portal</span>
          </div>
          <ThemeToggle className="login-theme-toggle" />
        </div>

        <div className="login-form-shell">
          <div className="login-heading">
            <span className="login-heading-icon" aria-hidden="true"><LockKeyhole size={19} /></span>
            <span className="eyebrow">Welcome back</span>
            <h1 id="login-title">Sign in to your workspace</h1>
            <p>Enter your details to continue to Acrivos Portal.</p>
          </div>

          <form className="login-form" noValidate onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">Work email</label>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="name@company.com"
                value={email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (errors.email) setErrors((current) => ({ ...current, email: undefined }))
                }}
              />
              {errors.email && <p className="field-error" id="email-error"><span aria-hidden="true">!</span>{errors.email}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrap">
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (errors.password) setErrors((current) => ({ ...current, password: undefined }))
                  }}
                />
                <button
                  className="password-toggle"
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
              {errors.password && <p className="field-error" id="password-error"><span aria-hidden="true">!</span>{errors.password}</p>}
            </div>

            <div className="login-form-options">
              <label className="remember-option">
                <input type="checkbox" name="remember" />
                <span>Remember me</span>
              </label>
              <button
                className="forgot-password-button"
                type="button"
                onClick={() => setForgotPasswordMessage('Password recovery will be available when authentication is connected.')}
              >
                Forgot password?
              </button>
            </div>

            {forgotPasswordMessage && <p className="demo-feedback" role="status">{forgotPasswordMessage}</p>}

            <button className="login-submit" type="submit">Sign in</button>
            <p className="login-demo-note">Demo preview only — authentication is not connected yet.</p>
          </form>
        </div>

        <p className="login-help">Need help? Contact your workspace administrator.</p>
      </section>
    </main>
  )
}
