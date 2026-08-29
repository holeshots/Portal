import { CircleHelp } from 'lucide-react'
import { Link } from 'react-router-dom'
import './ModulePlaceholderPage.css'

export function PageNotFoundPage() {
  return (
    <section className="module-placeholder-page not-found-page" aria-labelledby="not-found-title">
      <div className="module-placeholder-icon" aria-hidden="true">
        <CircleHelp size={28} strokeWidth={1.8} />
      </div>
      <span className="module-placeholder-status">Portal navigation</span>
      <h1 id="not-found-title">Page not found</h1>
      <p>The portal page you requested does not exist. Return to a working area to continue.</p>
      <nav className="module-placeholder-links" aria-label="Page not found shortcuts">
        <Link className="module-placeholder-link is-primary" to="/">
          Return to Dashboard
        </Link>
        <Link className="module-placeholder-link" to="/tickets">
          Open Tickets
        </Link>
      </nav>
    </section>
  )
}
