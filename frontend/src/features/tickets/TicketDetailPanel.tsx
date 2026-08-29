import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Clock3, Laptop, MapPin, MessageSquareText, UserRound, UsersRound, X } from 'lucide-react'
import { SeverityIndicator, SlaIndicator, StatusIndicator } from './TicketIndicators'
import {
  TECHNICIANS_BY_TEAM,
  TICKET_SEVERITIES,
  TICKET_STATUSES,
  TICKET_TEAMS,
  type Ticket,
  type TicketSeverity,
  type TicketStatus,
  type TicketTeam,
} from './ticketTypes'
import { formatTicketDateLong } from './ticketUtils'

interface TicketDetailPanelProps {
  ticket: Ticket
  onClose: () => void
  onChangeTeam: (ticketId: string, team: TicketTeam) => void
  onChangeTechnician: (ticketId: string, technician: string) => void
  onChangeStatus: (ticketId: string, status: TicketStatus) => void
  onChangeSeverity: (ticketId: string, severity: TicketSeverity) => void
  onAddInternalNote: (ticketId: string, note: string) => boolean
}

const focusableElementSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function TicketDetailPanel({
  ticket,
  onClose,
  onChangeTeam,
  onChangeTechnician,
  onChangeStatus,
  onChangeSeverity,
  onAddInternalNote,
}: TicketDetailPanelProps) {
  const panelRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const onCloseRef = useRef(onClose)
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    headingRef.current?.focus()
    setNote('')
    setNoteError('')
    setFeedback('')
  }, [ticket.id])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const panel = panelRef.current
      if (!panel) {
        return
      }

      const focusableElements = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableElementSelector),
      )
      const firstFocusableElement = focusableElements[0]
      const lastFocusableElement = focusableElements.at(-1)

      if (!firstFocusableElement || !lastFocusableElement) {
        event.preventDefault()
        headingRef.current?.focus()
        return
      }

      const activeElement = document.activeElement
      const focusIsInsideTabOrder = focusableElements.some(
        (element) => element === activeElement,
      )

      if (
        event.shiftKey &&
        (activeElement === firstFocusableElement || !focusIsInsideTabOrder)
      ) {
        event.preventDefault()
        lastFocusableElement.focus()
      } else if (!event.shiftKey && activeElement === lastFocusableElement) {
        event.preventDefault()
        firstFocusableElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const announce = (message: string) => {
    setFeedback(`${message} This demo change will reset when the page refreshes.`)
  }

  const handleNoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!note.trim()) {
      setNoteError('Write an internal note before adding it to the activity history.')
      return
    }

    if (onAddInternalNote(ticket.id, note)) {
      setNote('')
      setNoteError('')
      announce('Internal note added.')
    }
  }

  const activity = [...ticket.activity].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))

  return (
    <>
      <button
        className="ticket-detail-backdrop"
        aria-label="Close ticket details"
        tabIndex={-1}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        className="ticket-detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-detail-title"
      >
        <header className="ticket-detail-header">
          <div>
            <span className="ticket-number">{ticket.number}</span>
            <h2 id="ticket-detail-title" ref={headingRef} tabIndex={-1}>{ticket.subject}</h2>
            <div className="ticket-detail-indicators">
              <StatusIndicator value={ticket.status} />
              <SeverityIndicator value={ticket.severity} />
              <SlaIndicator value={ticket.slaState} />
            </div>
          </div>
          <button className="detail-close-button" type="button" aria-label={`Close ${ticket.number} details`} onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="ticket-detail-body">
          <section className="ticket-detail-section" aria-labelledby="request-context-title">
            <div className="ticket-section-heading">
              <span className="eyebrow">Request context</span>
              <h3 id="request-context-title">{ticket.client}</h3>
            </div>
            <dl className="ticket-context-grid">
              <div><dt><UserRound size={14} aria-hidden="true" />Requester</dt><dd>{ticket.requester}</dd></div>
              <div><dt><MapPin size={14} aria-hidden="true" />Site</dt><dd>{ticket.site}</dd></div>
              <div><dt><UsersRound size={14} aria-hidden="true" />Assignment</dt><dd>{ticket.assignedTeam}<br /><span>{ticket.technician}</span></dd></div>
              {ticket.relatedDevice && <div><dt><Laptop size={14} aria-hidden="true" />Related device</dt><dd>{ticket.relatedDevice}</dd></div>}
            </dl>
            <div className="ticket-description">
              <h4>Description</h4>
              <p>{ticket.description}</p>
            </div>
          </section>

          <section className="ticket-detail-section" aria-labelledby="sla-context-title">
            <div className="ticket-section-heading">
              <span className="eyebrow">Demo SLA snapshot</span>
              <h3 id="sla-context-title">Service commitments</h3>
            </div>
            <div className="sla-context-grid">
              <div><span>Response due</span><strong>{formatTicketDateLong(ticket.responseDueAt)}</strong></div>
              <div><span>Resolution due</span><strong>{formatTicketDateLong(ticket.resolutionDueAt)}</strong></div>
            </div>
            <p className="ticket-demo-caption"><Clock3 size={13} aria-hidden="true" />Static demo timestamps — no SLA engine is connected.</p>
          </section>

          <section className="ticket-detail-section" aria-labelledby="ticket-actions-title">
            <div className="ticket-section-heading">
              <span className="eyebrow">Simulated actions</span>
              <h3 id="ticket-actions-title">Update ticket</h3>
            </div>
            <div className="ticket-action-grid">
              <label>Assigned team
                <select value={ticket.assignedTeam} onChange={(event) => {
                  const team = event.target.value as TicketTeam
                  onChangeTeam(ticket.id, team)
                  announce(`Assigned team changed to ${team}.`)
                }}>
                  {TICKET_TEAMS.map((team) => <option key={team}>{team}</option>)}
                </select>
              </label>
              <label>Technician
                <select value={ticket.technician} onChange={(event) => {
                  onChangeTechnician(ticket.id, event.target.value)
                  announce(`Technician changed to ${event.target.value}.`)
                }}>
                  {TECHNICIANS_BY_TEAM[ticket.assignedTeam].map((technician) => <option key={technician}>{technician}</option>)}
                </select>
              </label>
              <label>Status
                <select value={ticket.status} onChange={(event) => {
                  const status = event.target.value as TicketStatus
                  onChangeStatus(ticket.id, status)
                  announce(`Status changed to ${status}.`)
                }}>
                  {TICKET_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label>Severity
                <select value={ticket.severity} onChange={(event) => {
                  const severity = event.target.value as TicketSeverity
                  onChangeSeverity(ticket.id, severity)
                  announce(`Severity changed to ${severity}.`)
                }}>
                  {TICKET_SEVERITIES.map((severity) => <option key={severity}>{severity}</option>)}
                </select>
              </label>
            </div>
            {feedback && <p className="ticket-feedback" role="status">{feedback}</p>}
          </section>

          <section className="ticket-detail-section" aria-labelledby="internal-note-title">
            <div className="ticket-section-heading">
              <span className="eyebrow">Team-only context</span>
              <h3 id="internal-note-title">Add internal note</h3>
            </div>
            <form className="internal-note-form" noValidate onSubmit={handleNoteSubmit}>
              <label htmlFor="internal-note">Note</label>
              <textarea
                id="internal-note"
                value={note}
                rows={4}
                placeholder="Document troubleshooting, next steps, or handoff context…"
                aria-invalid={Boolean(noteError)}
                aria-describedby={noteError ? 'internal-note-error' : 'internal-note-help'}
                onChange={(event) => {
                  setNote(event.target.value)
                  if (noteError) setNoteError('')
                }}
              />
              <p id="internal-note-help" className="ticket-demo-caption">Visible only in this local demo activity history.</p>
              {noteError && <p id="internal-note-error" className="field-error"><span aria-hidden="true">!</span>{noteError}</p>}
              <button className="ticket-primary-button" type="submit"><MessageSquareText size={16} aria-hidden="true" />Add internal note</button>
            </form>
          </section>

          <section className="ticket-detail-section" aria-labelledby="activity-title">
            <div className="ticket-section-heading">
              <span className="eyebrow">Latest first</span>
              <h3 id="activity-title">Activity history</h3>
            </div>
            <ol className="ticket-activity-list">
              {activity.map((entry) => (
                <li key={entry.id}>
                  <span className="activity-marker" aria-hidden="true" />
                  <div className="activity-card">
                    <div><strong>{entry.kind}</strong>{entry.internal && <span className="internal-label">Internal</span>}</div>
                    <p>{entry.message}</p>
                    <small>{entry.author} · {formatTicketDateLong(entry.createdAt)}</small>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </aside>
    </>
  )
}
