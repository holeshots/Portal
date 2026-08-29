import { useState } from 'react'
import { createTicketSeed } from './ticketData'
import type { Ticket, TicketActivity, TicketSeverity, TicketStatus, TicketTeam } from './ticketTypes'

type ActivityKind = TicketActivity['kind']

export function useTicketDemo() {
  const [tickets, setTickets] = useState<Ticket[]>(createTicketSeed)

  const updateTicket = (
    ticketId: string,
    applyChange: (ticket: Ticket) => Ticket,
    kind: ActivityKind,
    describeChange: (before: Ticket, after: Ticket) => string,
  ) => {
    setTickets((current) => current.map((ticket) => {
      if (ticket.id !== ticketId) return ticket

      const now = new Date().toISOString()
      const changed = applyChange(ticket)
      const activity: TicketActivity = {
        id: `${ticket.id}-${now}-${ticket.activity.length}`,
        kind,
        message: describeChange(ticket, changed),
        author: 'Jed Turqueza',
        createdAt: now,
      }

      return { ...changed, updatedAt: now, activity: [...ticket.activity, activity] }
    }))
  }

  const changeTeam = (ticketId: string, team: TicketTeam) => {
    updateTicket(
      ticketId,
      (ticket) => ({ ...ticket, assignedTeam: team, technician: 'Unassigned' }),
      'Assignment',
      (before) => `Assignment moved from ${before.assignedTeam} to ${team}; technician reset to Unassigned.`,
    )
  }

  const changeTechnician = (ticketId: string, technician: string) => {
    updateTicket(
      ticketId,
      (ticket) => ({ ...ticket, technician }),
      'Assignment',
      (before) => `Technician changed from ${before.technician} to ${technician}.`,
    )
  }

  const changeStatus = (ticketId: string, status: TicketStatus) => {
    updateTicket(
      ticketId,
      (ticket) => ({ ...ticket, status }),
      'Status',
      (before) => `Status changed from ${before.status} to ${status}.`,
    )
  }

  const changeSeverity = (ticketId: string, severity: TicketSeverity) => {
    updateTicket(
      ticketId,
      (ticket) => ({ ...ticket, severity }),
      'Severity',
      (before) => `Severity changed from ${before.severity} to ${severity}.`,
    )
  }

  const addInternalNote = (ticketId: string, note: string) => {
    const trimmedNote = note.trim()
    if (!trimmedNote) return false

    setTickets((current) => current.map((ticket) => {
      if (ticket.id !== ticketId) return ticket

      const now = new Date().toISOString()
      return {
        ...ticket,
        updatedAt: now,
        activity: [...ticket.activity, {
          id: `${ticket.id}-${now}-${ticket.activity.length}`,
          kind: 'Internal note',
          message: trimmedNote,
          author: 'Jed Turqueza',
          createdAt: now,
          internal: true,
        }],
      }
    }))

    return true
  }

  return { tickets, changeTeam, changeTechnician, changeStatus, changeSeverity, addInternalNote }
}
