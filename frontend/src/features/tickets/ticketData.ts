import type { Ticket } from './ticketTypes'

export const seedTickets: readonly Ticket[] = [
  {
    id: 't-1048', number: 'INC-1048', subject: 'Core switch intermittently dropping uplinks', client: 'Northstar Logistics', requester: 'Dana Villanueva', site: 'Pasig Distribution Hub',
    description: 'Warehouse users lose connectivity for two to four minutes several times per hour. Monitoring shows uplink flaps on the core stack.',
    assignedTeam: 'Network Operations', technician: 'Luis Navarro', status: 'In Progress', severity: 'Critical', slaState: 'At Risk',
    responseDueAt: '2026-08-29T02:30:00+08:00', resolutionDueAt: '2026-08-29T06:00:00+08:00', createdAt: '2026-08-29T01:42:00+08:00', updatedAt: '2026-08-29T03:18:00+08:00', relatedDevice: 'NSL-PSG-CORE-SW01',
    activity: [
      { id: 'a-1048-1', kind: 'Created', message: 'Ticket created from the service desk escalation.', author: 'Maya Santos', createdAt: '2026-08-29T01:42:00+08:00' },
      { id: 'a-1048-2', kind: 'Assignment', message: 'Assigned to Network Operations and Luis Navarro.', author: 'Jed Turqueza', createdAt: '2026-08-29T01:55:00+08:00' },
      { id: 'a-1048-3', kind: 'Update', message: 'Correlated the drops with CRC errors on uplink port 1/1/48. Replacement optic is being staged.', author: 'Luis Navarro', createdAt: '2026-08-29T03:18:00+08:00' },
    ],
  },
  {
    id: 't-1047', number: 'SR-1047', subject: 'New starter Microsoft 365 access', client: 'Harbor & Finch Legal', requester: 'Carla Mendoza', site: 'BGC Main Office',
    description: 'Provision standard Microsoft 365 access and the Litigation shared mailbox for a new associate starting Monday.',
    assignedTeam: 'Cloud & Identity', technician: 'Ava Chen', status: 'Assigned', severity: 'Medium', slaState: 'On Track',
    responseDueAt: '2026-08-29T10:00:00+08:00', resolutionDueAt: '2026-09-01T09:00:00+08:00', createdAt: '2026-08-28T16:22:00+08:00', updatedAt: '2026-08-29T08:10:00+08:00',
    activity: [
      { id: 'a-1047-1', kind: 'Created', message: 'Service request submitted through the client portal.', author: 'Carla Mendoza', createdAt: '2026-08-28T16:22:00+08:00' },
      { id: 'a-1047-2', kind: 'Assignment', message: 'Assigned to Cloud & Identity and Ava Chen.', author: 'Maya Santos', createdAt: '2026-08-29T08:10:00+08:00' },
    ],
  },
  {
    id: 't-1046', number: 'INC-1046', subject: 'Accounting application fails after update', client: 'Vela Manufacturing', requester: 'Ramon Co', site: 'Laguna Plant',
    description: 'The accounting client closes immediately after yesterday’s Windows update on three finance workstations.',
    assignedTeam: 'Service Desk', technician: 'Ethan Cruz', status: 'Waiting on Client', severity: 'High', slaState: 'Paused',
    responseDueAt: '2026-08-28T15:00:00+08:00', resolutionDueAt: '2026-08-29T13:00:00+08:00', createdAt: '2026-08-28T13:45:00+08:00', updatedAt: '2026-08-28T17:26:00+08:00', relatedDevice: 'VEL-LAG-FIN-023',
    activity: [
      { id: 'a-1046-1', kind: 'Created', message: 'Incident reported by the finance team.', author: 'Ramon Co', createdAt: '2026-08-28T13:45:00+08:00' },
      { id: 'a-1046-2', kind: 'Status', message: 'Status changed from In Progress to Waiting on Client.', author: 'Ethan Cruz', createdAt: '2026-08-28T17:26:00+08:00' },
    ],
  },
  {
    id: 't-1045', number: 'INC-1045', subject: 'VPN authentication failures for remote team', client: 'Summit Architecture', requester: 'Inez Garcia', site: 'Makati Studio',
    description: 'Six remote designers receive repeated authentication failures when connecting to the corporate VPN.',
    assignedTeam: 'Network Operations', technician: 'Priya Shah', status: 'In Progress', severity: 'High', slaState: 'Breached',
    responseDueAt: '2026-08-28T09:30:00+08:00', resolutionDueAt: '2026-08-28T14:00:00+08:00', createdAt: '2026-08-28T08:52:00+08:00', updatedAt: '2026-08-29T07:40:00+08:00', relatedDevice: 'SUM-MKT-FW01',
    activity: [
      { id: 'a-1045-1', kind: 'Created', message: 'Incident created from monitoring correlation and user reports.', author: 'Service Desk', createdAt: '2026-08-28T08:52:00+08:00' },
      { id: 'a-1045-2', kind: 'Update', message: 'Authentication logs point to an expired RADIUS certificate chain.', author: 'Priya Shah', createdAt: '2026-08-29T07:40:00+08:00' },
    ],
  },
  {
    id: 't-1044', number: 'SR-1044', subject: 'Install approved design software', client: 'Summit Architecture', requester: 'Paolo Reyes', site: 'Cebu Satellite Office',
    description: 'Install the approved CAD plugin on two newly issued design laptops before the afternoon client workshop.',
    assignedTeam: 'Field Services', technician: 'Sofia Lim', status: 'Resolved', severity: 'Low', slaState: 'On Track',
    responseDueAt: '2026-08-27T13:00:00+08:00', resolutionDueAt: '2026-08-28T12:00:00+08:00', createdAt: '2026-08-27T11:16:00+08:00', updatedAt: '2026-08-28T10:32:00+08:00', relatedDevice: 'SUM-CEB-LT-014',
    activity: [
      { id: 'a-1044-1', kind: 'Created', message: 'Software installation request received.', author: 'Paolo Reyes', createdAt: '2026-08-27T11:16:00+08:00' },
      { id: 'a-1044-2', kind: 'Status', message: 'Installation completed and requester validation received.', author: 'Sofia Lim', createdAt: '2026-08-28T10:32:00+08:00' },
    ],
  },
  {
    id: 't-1043', number: 'INC-1043', subject: 'Shared printer unavailable on second floor', client: 'Cedar Grove Clinics', requester: 'Dr. Leah Tan', site: 'Quezon City Clinic',
    description: 'Clinical staff cannot reach the second-floor multifunction printer from any workstation.',
    assignedTeam: 'Field Services', technician: 'Unassigned', status: 'New', severity: 'Medium', slaState: 'At Risk',
    responseDueAt: '2026-08-29T09:30:00+08:00', resolutionDueAt: '2026-08-29T16:00:00+08:00', createdAt: '2026-08-29T08:36:00+08:00', updatedAt: '2026-08-29T08:36:00+08:00', relatedDevice: 'CGC-QC-PRN-02',
    activity: [{ id: 'a-1043-1', kind: 'Created', message: 'Ticket created from a phone request.', author: 'Maya Santos', createdAt: '2026-08-29T08:36:00+08:00' }],
  },
  {
    id: 't-1042', number: 'INC-1042', subject: 'Endpoint protection alert on executive laptop', client: 'Northstar Logistics', requester: 'Miguel Torres', site: 'Ortigas Head Office',
    description: 'Endpoint protection quarantined a suspicious PowerShell payload. Device remains isolated pending review.',
    assignedTeam: 'Service Desk', technician: 'Maya Santos', status: 'Assigned', severity: 'Critical', slaState: 'On Track',
    responseDueAt: '2026-08-29T09:05:00+08:00', resolutionDueAt: '2026-08-29T12:00:00+08:00', createdAt: '2026-08-29T08:47:00+08:00', updatedAt: '2026-08-29T08:58:00+08:00', relatedDevice: 'NSL-ORT-LT-001',
    activity: [
      { id: 'a-1042-1', kind: 'Created', message: 'Ticket generated from an endpoint security alert.', author: 'Monitoring', createdAt: '2026-08-29T08:47:00+08:00' },
      { id: 'a-1042-2', kind: 'Assignment', message: 'Assigned to Service Desk and Maya Santos for triage.', author: 'Jed Turqueza', createdAt: '2026-08-29T08:58:00+08:00' },
    ],
  },
  {
    id: 't-1041', number: 'SR-1041', subject: 'Distribution list membership update', client: 'Harbor & Finch Legal', requester: 'Nico Flores', site: 'BGC Main Office',
    description: 'Add two new paralegals to the Case Updates distribution list and remove a former contractor.',
    assignedTeam: 'Cloud & Identity', technician: 'Noah Williams', status: 'Closed', severity: 'Low', slaState: 'On Track',
    responseDueAt: '2026-08-27T11:00:00+08:00', resolutionDueAt: '2026-08-27T17:00:00+08:00', createdAt: '2026-08-27T09:12:00+08:00', updatedAt: '2026-08-27T15:04:00+08:00',
    activity: [
      { id: 'a-1041-1', kind: 'Created', message: 'Access change request submitted.', author: 'Nico Flores', createdAt: '2026-08-27T09:12:00+08:00' },
      { id: 'a-1041-2', kind: 'Status', message: 'Request completed, verified, and closed.', author: 'Noah Williams', createdAt: '2026-08-27T15:04:00+08:00' },
    ],
  },
  {
    id: 't-1040', number: 'INC-1040', subject: 'Meeting room display shows no signal', client: 'Vela Manufacturing', requester: 'Anne Bautista', site: 'Laguna Plant',
    description: 'The operations meeting room display reports no signal from the room PC before the daily production review.',
    assignedTeam: 'Field Services', technician: 'Marco Reyes', status: 'In Progress', severity: 'Medium', slaState: 'On Track',
    responseDueAt: '2026-08-29T10:00:00+08:00', resolutionDueAt: '2026-08-29T15:00:00+08:00', createdAt: '2026-08-29T08:14:00+08:00', updatedAt: '2026-08-29T09:02:00+08:00', relatedDevice: 'VEL-LAG-MR-PC02',
    activity: [
      { id: 'a-1040-1', kind: 'Created', message: 'Incident reported by operations.', author: 'Anne Bautista', createdAt: '2026-08-29T08:14:00+08:00' },
      { id: 'a-1040-2', kind: 'Status', message: 'On-site diagnostics started.', author: 'Marco Reyes', createdAt: '2026-08-29T09:02:00+08:00' },
    ],
  },
  {
    id: 't-1039', number: 'INC-1039', subject: 'Guest Wi-Fi captive portal not loading', client: 'Cedar Grove Clinics', requester: 'Mara De Leon', site: 'Taguig Clinic',
    description: 'Patients can join the guest SSID but the captive portal does not load, preventing internet access.',
    assignedTeam: 'Network Operations', technician: 'Unassigned', status: 'New', severity: 'Low', slaState: 'On Track',
    responseDueAt: '2026-08-29T13:00:00+08:00', resolutionDueAt: '2026-08-30T12:00:00+08:00', createdAt: '2026-08-29T09:08:00+08:00', updatedAt: '2026-08-29T09:08:00+08:00',
    activity: [{ id: 'a-1039-1', kind: 'Created', message: 'Ticket submitted through the client portal.', author: 'Mara De Leon', createdAt: '2026-08-29T09:08:00+08:00' }],
  },
]

export function createTicketSeed(): Ticket[] {
  return seedTickets.map((ticket) => ({ ...ticket, activity: ticket.activity.map((entry) => ({ ...entry })) }))
}
