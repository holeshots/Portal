import type { Ticket, TicketFilters } from './ticketTypes'

export const initialTicketFilters: TicketFilters = {
  search: '',
  status: 'All',
  severity: 'All',
  slaState: 'All',
}

export function filterTickets(tickets: Ticket[], filters: TicketFilters): Ticket[] {
  const search = filters.search.trim().toLocaleLowerCase()

  return tickets.filter((ticket) => {
    const searchable = [ticket.number, ticket.subject, ticket.client, ticket.requester]
      .join(' ')
      .toLocaleLowerCase()

    return (!search || searchable.includes(search))
      && (filters.status === 'All' || ticket.status === filters.status)
      && (filters.severity === 'All' || ticket.severity === filters.severity)
      && (filters.slaState === 'All' || ticket.slaState === filters.slaState)
  })
}

export function formatTicketDate(value: string): string {
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date(value))
}

export function formatTicketDateLong(value: string): string {
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date(value))
}
