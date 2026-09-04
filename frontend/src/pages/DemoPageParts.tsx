import type { ReactNode } from 'react'

export function DemoHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="demo-page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><span className="demo-mode-label">Demo data · resets on refresh</span></header>
}

export function Summary({ icon, label, value, detail, tone = 'neutral' }: { icon: ReactNode; label: string; value: string; detail: string; tone?: string }) {
  return <article><span className={`demo-summary-icon is-${tone}`} aria-hidden="true">{icon}</span><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article>
}

export function Status({ label, tone }: { label: string; tone: string }) {
  return <span className={`demo-status is-${tone}`}><span aria-hidden="true">●</span>{label}</span>
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return <div className="demo-empty"><span aria-hidden="true">{icon}</span><h3>{title}</h3><p>{body}</p>{action}</div>
}
