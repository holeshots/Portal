import { Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ModuleDefinition } from './modulePlaceholders'
import './ModulePlaceholderPage.css'

interface ModulePlaceholderPageProps {
  module: ModuleDefinition
}

export function ModulePlaceholderPage({ module }: ModulePlaceholderPageProps) {
  const Icon = module.icon

  return (
    <section className="module-placeholder-page" aria-labelledby="module-placeholder-title">
      <div className="module-placeholder-icon" aria-hidden="true">
        <Icon size={28} strokeWidth={1.8} />
      </div>
      <span className="module-placeholder-status">
        <Clock3 size={14} aria-hidden="true" />
        Coming soon
      </span>
      <h1 id="module-placeholder-title">{module.title}</h1>
      <p>{module.description}</p>
      <nav className="module-placeholder-links" aria-label={`${module.title} shortcuts`}>
        <Link className="module-placeholder-link is-primary" to="/">
          Back to Dashboard
        </Link>
        <Link className="module-placeholder-link" to="/tickets">
          Open Tickets
        </Link>
      </nav>
    </section>
  )
}
