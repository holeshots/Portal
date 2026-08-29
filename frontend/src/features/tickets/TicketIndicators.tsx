import { AlertCircle, CircleCheck, CirclePause, CircleX, Clock3, Flame, Gauge, ShieldAlert } from 'lucide-react'
import type { TicketSeverity, TicketSlaState, TicketStatus } from './ticketTypes'

const statusIcons = {
  New: AlertCircle,
  Assigned: CircleCheck,
  'In Progress': Clock3,
  'Waiting on Client': CirclePause,
  Resolved: CircleCheck,
  Closed: CircleX,
} satisfies Record<TicketStatus, typeof AlertCircle>

const severityIcons = {
  Critical: Flame,
  High: ShieldAlert,
  Medium: Gauge,
  Low: CircleCheck,
} satisfies Record<TicketSeverity, typeof AlertCircle>

const slaIcons = {
  'On Track': CircleCheck,
  'At Risk': Clock3,
  Breached: AlertCircle,
  Paused: CirclePause,
} satisfies Record<TicketSlaState, typeof AlertCircle>

interface IndicatorProps {
  value: string
  icon: typeof AlertCircle
  kind: 'status' | 'severity' | 'sla'
}

function Indicator({ value, icon: Icon, kind }: IndicatorProps) {
  const classValue = value.toLowerCase().replaceAll(' ', '-')
  return (
    <span className={`ticket-indicator ${kind}-${classValue}`}>
      <Icon size={13} strokeWidth={2} aria-hidden="true" />
      {value}
    </span>
  )
}

export function StatusIndicator({ value }: { value: TicketStatus }) {
  return <Indicator value={value} icon={statusIcons[value]} kind="status" />
}

export function SeverityIndicator({ value }: { value: TicketSeverity }) {
  return <Indicator value={value} icon={severityIcons[value]} kind="severity" />
}

export function SlaIndicator({ value }: { value: TicketSlaState }) {
  return <Indicator value={value} icon={slaIcons[value]} kind="sla" />
}
