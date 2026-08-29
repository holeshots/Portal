export const TICKET_STATUSES = ['New', 'Assigned', 'In Progress', 'Waiting on Client', 'Resolved', 'Closed'] as const
export const TICKET_SEVERITIES = ['Critical', 'High', 'Medium', 'Low'] as const
export const TICKET_SLA_STATES = ['On Track', 'At Risk', 'Breached', 'Paused'] as const
export const TICKET_TEAMS = ['Service Desk', 'Network Operations', 'Cloud & Identity', 'Field Services'] as const

export type TicketStatus = typeof TICKET_STATUSES[number]
export type TicketSeverity = typeof TICKET_SEVERITIES[number]
export type TicketSlaState = typeof TICKET_SLA_STATES[number]
export type TicketTeam = typeof TICKET_TEAMS[number]

export const TECHNICIANS_BY_TEAM: Record<TicketTeam, readonly string[]> = {
  'Service Desk': ['Maya Santos', 'Ethan Cruz', 'Unassigned'],
  'Network Operations': ['Luis Navarro', 'Priya Shah', 'Unassigned'],
  'Cloud & Identity': ['Ava Chen', 'Noah Williams', 'Unassigned'],
  'Field Services': ['Marco Reyes', 'Sofia Lim', 'Unassigned'],
}

export interface TicketActivity {
  id: string
  kind: 'Created' | 'Assignment' | 'Status' | 'Severity' | 'Internal note' | 'Update'
  message: string
  author: string
  createdAt: string
  internal?: boolean
}

export interface Ticket {
  id: string
  number: string
  subject: string
  client: string
  requester: string
  site: string
  description: string
  assignedTeam: TicketTeam
  technician: string
  status: TicketStatus
  severity: TicketSeverity
  slaState: TicketSlaState
  responseDueAt: string
  resolutionDueAt: string
  createdAt: string
  updatedAt: string
  relatedDevice?: string
  activity: TicketActivity[]
}

export interface TicketFilters {
  search: string
  status: TicketStatus | 'All'
  severity: TicketSeverity | 'All'
  slaState: TicketSlaState | 'All'
}
