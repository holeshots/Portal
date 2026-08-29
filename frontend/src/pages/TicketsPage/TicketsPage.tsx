import { useMemo, useRef, useState } from 'react'
import { AlertTriangle, CircleDot, Inbox, ListFilter, Search, ShieldAlert, TicketCheck, UserRound } from 'lucide-react'
import { TicketDetailPanel } from '../../features/tickets/TicketDetailPanel'
import { SeverityIndicator, SlaIndicator, StatusIndicator } from '../../features/tickets/TicketIndicators'
import {
  TICKET_SEVERITIES,
  TICKET_SLA_STATES,
  TICKET_STATUSES,
  type TicketFilters,
  type TicketSeverity,
  type TicketSlaState,
  type TicketStatus,
} from '../../features/tickets/ticketTypes'
import { filterTickets, formatTicketDate, initialTicketFilters } from '../../features/tickets/ticketUtils'
import { useTicketDemo } from '../../features/tickets/useTicketDemo'
import './TicketsPage.css'

export function TicketsPage() {
  const {
    tickets,
    changeTeam,
    changeTechnician,
    changeStatus,
    changeSeverity,
    addInternalNote,
  } = useTicketDemo()
  const [filters, setFilters] = useState<TicketFilters>(initialTicketFilters)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const filteredTickets = useMemo(() => filterTickets(tickets, filters), [tickets, filters])
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId)
  const hasActiveFilters = filters.search.trim() !== ''
    || filters.status !== 'All'
    || filters.severity !== 'All'
    || filters.slaState !== 'All'

  const counts = {
    open: tickets.filter((ticket) => ticket.status !== 'Resolved' && ticket.status !== 'Closed').length,
    critical: tickets.filter((ticket) => ticket.severity === 'Critical' && ticket.status !== 'Closed').length,
    attention: tickets.filter((ticket) => ticket.slaState === 'At Risk' || ticket.slaState === 'Breached').length,
    unassigned: tickets.filter((ticket) => ticket.technician === 'Unassigned').length,
  }

  const updateFilter = <Key extends keyof TicketFilters>(key: Key, value: TicketFilters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const closeDetail = () => {
    setSelectedTicketId(null)
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }

  return (
    <div className="tickets-page">
      <header className="tickets-page-header">
        <div>
          <span className="eyebrow">Service operations</span>
          <h1>Tickets</h1>
          <p>Prioritize client impact, protect service commitments, and keep every handoff visible.</p>
        </div>
        <span className="demo-mode-label"><CircleDot size={14} aria-hidden="true" />Demo data · resets on refresh</span>
      </header>

      <section className="ticket-summary-grid" aria-label="Ticket queue summary">
        <article><span className="ticket-summary-icon summary-open"><Inbox size={19} aria-hidden="true" /></span><div><span>Open queue</span><strong>{counts.open}</strong><small>Needs operational ownership</small></div></article>
        <article><span className="ticket-summary-icon summary-critical"><ShieldAlert size={19} aria-hidden="true" /></span><div><span>Critical impact</span><strong>{counts.critical}</strong><small>Active client-impacting work</small></div></article>
        <article><span className="ticket-summary-icon summary-risk"><AlertTriangle size={19} aria-hidden="true" /></span><div><span>SLA attention</span><strong>{counts.attention}</strong><small>At risk or breached</small></div></article>
        <article><span className="ticket-summary-icon summary-unassigned"><UserRound size={19} aria-hidden="true" /></span><div><span>Unassigned</span><strong>{counts.unassigned}</strong><small>Technician ownership needed</small></div></article>
      </section>

      <section className="ticket-queue-card" aria-labelledby="ticket-queue-title">
        <div className="ticket-queue-heading">
          <div>
            <span className="eyebrow">Live operations view</span>
            <h2 id="ticket-queue-title">Service queue</h2>
          </div>
          <span className="queue-result-count" aria-live="polite">{filteredTickets.length} of {tickets.length} tickets</span>
        </div>

        <div className="ticket-filters" role="search" aria-label="Filter tickets">
          <label className="ticket-search-field">
            <span>Search tickets</span>
            <div><Search size={17} aria-hidden="true" /><input value={filters.search} placeholder="Number, subject, client, requester" onChange={(event) => updateFilter('search', event.target.value)} /></div>
          </label>
          <label><span>Status</span><select value={filters.status} onChange={(event) => updateFilter('status', event.target.value as TicketStatus | 'All')}><option>All</option>{TICKET_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label><span>Severity</span><select value={filters.severity} onChange={(event) => updateFilter('severity', event.target.value as TicketSeverity | 'All')}><option>All</option>{TICKET_SEVERITIES.map((severity) => <option key={severity}>{severity}</option>)}</select></label>
          <label><span>SLA</span><select value={filters.slaState} onChange={(event) => updateFilter('slaState', event.target.value as TicketSlaState | 'All')}><option>All</option>{TICKET_SLA_STATES.map((sla) => <option key={sla}>{sla}</option>)}</select></label>
          <button className="clear-filter-button" type="button" disabled={!hasActiveFilters} onClick={() => setFilters(initialTicketFilters)}><ListFilter size={15} aria-hidden="true" />Clear filters</button>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="ticket-table-wrap">
            <table className="ticket-table">
              <thead><tr><th>Ticket</th><th>Status</th><th>Severity</th><th>SLA</th><th>Assignment</th><th>Updated</th></tr></thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td data-label="Ticket">
                      <button
                        className="ticket-open-button"
                        type="button"
                        aria-label={`Open ${ticket.number}: ${ticket.subject}`}
                        onClick={(event) => {
                          lastTriggerRef.current = event.currentTarget
                          setSelectedTicketId(ticket.id)
                        }}
                      >
                        <span className="ticket-number">{ticket.number}</span>
                        <strong>{ticket.subject}</strong>
                        <small>{ticket.client} · {ticket.requester}</small>
                      </button>
                    </td>
                    <td data-label="Status"><StatusIndicator value={ticket.status} /></td>
                    <td data-label="Severity"><SeverityIndicator value={ticket.severity} /></td>
                    <td data-label="SLA"><SlaIndicator value={ticket.slaState} /></td>
                    <td data-label="Assignment"><span className="ticket-assignment">{ticket.technician}<small>{ticket.assignedTeam}</small></span></td>
                    <td data-label="Updated"><time dateTime={ticket.updatedAt}>{formatTicketDate(ticket.updatedAt)}</time></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ticket-empty-state">
            <span><TicketCheck size={24} aria-hidden="true" /></span>
            <h3>No tickets match this view</h3>
            <p>Try a broader search or clear the current queue filters.</p>
            <button className="ticket-secondary-button" type="button" onClick={() => setFilters(initialTicketFilters)}>Clear filters</button>
          </div>
        )}
      </section>

      {selectedTicket && (
        <TicketDetailPanel
          ticket={selectedTicket}
          onClose={closeDetail}
          onChangeTeam={changeTeam}
          onChangeTechnician={changeTechnician}
          onChangeStatus={changeStatus}
          onChangeSeverity={changeSeverity}
          onAddInternalNote={addInternalNote}
        />
      )}
    </div>
  )
}
