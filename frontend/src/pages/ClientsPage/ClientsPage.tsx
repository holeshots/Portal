import { ReactNode, useMemo, useState } from 'react'
import {
    Building2,
    ChevronRight,
    CircleCheck,
    Clock3,
    Monitor,
    MoreHorizontal,
    Plus,
    Search,
    Ticket,
    Users
} from 'lucide-react'

import './ClientsPage.css'

type ClientStatus = 'Active' | 'Onboarding' | 'Inactive'

type Microsoft365Status =
    | 'Connected'
    | 'Attention'
    | 'Not Connected'

interface Client {
    id: number
    name: string
    initials: string
    domain: string
    status: ClientStatus
    primaryContact: string
    email: string
    tickets: number
    devices: number
    microsoft365: Microsoft365Status
    lastActivity: string
}

interface StatCardProps {
    icon: ReactNode
    label: string
    value: number
    footer: string
    type: 'green' | 'yellow' | 'blue'
}

export function ClientsPage() {
    const [search, setSearch] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<'All' | ClientStatus>('All')

    const clients: Client[] = [
        {
            id: 1,
            name: 'Acme Corporation',
            initials: 'AC',
            domain: 'acmecorp.com',
            status: 'Active',
            primaryContact: 'John Smith',
            email: 'john@acmecorp.com',
            tickets: 3,
            devices: 24,
            microsoft365: 'Connected',
            lastActivity: '10 mins ago'
        },
        {
            id: 2,
            name: 'Northstar Technologies',
            initials: 'NT',
            domain: 'northstartech.com',
            status: 'Active',
            primaryContact: 'Sarah Lee',
            email: 'sarah@northstartech.com',
            tickets: 0,
            devices: 18,
            microsoft365: 'Connected',
            lastActivity: '2 hours ago'
        },
        {
            id: 3,
            name: 'Apex Builders',
            initials: 'AB',
            domain: 'apexbuilders.com',
            status: 'Onboarding',
            primaryContact: 'Mark Cruz',
            email: 'mark@apexbuilders.com',
            tickets: 5,
            devices: 37,
            microsoft365: 'Attention',
            lastActivity: 'Yesterday'
        },
        {
            id: 4,
            name: 'Delta Logistics',
            initials: 'DL',
            domain: 'deltalogistics.com',
            status: 'Inactive',
            primaryContact: 'Anna Reyes',
            email: 'anna@deltalogistics.com',
            tickets: 0,
            devices: 12,
            microsoft365: 'Not Connected',
            lastActivity: '5 days ago'
        }
    ]

    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            const normalizedSearch = search.toLowerCase()

            const matchesSearch =
                client.name.toLowerCase().includes(normalizedSearch) ||
                client.domain.toLowerCase().includes(normalizedSearch) ||
                client.primaryContact.toLowerCase().includes(normalizedSearch)

            const matchesStatus =
                statusFilter === 'All' ||
                client.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [search, statusFilter])

    const totalClients = clients.length

    const activeClients = clients.filter(
        (client) => client.status === 'Active'
    ).length

    const openTickets = clients.reduce(
        (total, client) => total + client.tickets,
        0
    )

    const managedDevices = clients.reduce(
        (total, client) => total + client.devices,
        0
    )

    const getStatusClass = (status: ClientStatus): string => {
        return status.toLowerCase().replaceAll(' ', '-')
    }

    const getMicrosoftClass = (
        status: Microsoft365Status
    ): string => {
        return status.toLowerCase().replaceAll(' ', '-')
    }

    const handleOpenClient = (client: Client) => {
        console.log('Open client:', client)

        // When React Router is added:
        // navigate(`/clients/${client.id}`)
    }

    return (
        <div className="clients-page">

            {/* Header */}
            <div className="clients-header">
                <div>
                    <p className="page-eyebrow">
                        MANAGEMENT
                    </p>

                    <h1>Clients</h1>

                    <p className="page-description">
                        Manage organizations, contacts,
                        devices and services.
                    </p>
                </div>

                <button
                    type="button"
                    className="add-client-button"
                >
                    <Plus size={18} />
                    Add client
                </button>
            </div>


            {/* Stats */}
            <div className="client-stats">

                <StatCard
                    icon={<Building2 size={20} />}
                    label="Total clients"
                    value={totalClients}
                    footer="All organizations"
                    type="green"
                />

                <StatCard
                    icon={<CircleCheck size={20} />}
                    label="Active clients"
                    value={activeClients}
                    footer="Currently managed"
                    type="green"
                />

                <StatCard
                    icon={<Ticket size={20} />}
                    label="Open tickets"
                    value={openTickets}
                    footer="Across all clients"
                    type="yellow"
                />

                <StatCard
                    icon={<Monitor size={20} />}
                    label="Managed devices"
                    value={managedDevices}
                    footer="Across all clients"
                    type="blue"
                />

            </div>


            {/* Clients List */}
            <div className="clients-card">

                <div className="clients-toolbar">

                    <div>
                        <h2>All clients</h2>

                        <p>
                            {filteredClients.length}{' '}
                            organization
                            {filteredClients.length !== 1
                                ? 's'
                                : ''}
                        </p>
                    </div>

                    <div className="client-actions">

                        <div className="client-search">
                            <Search size={17} />

                            <input
                                type="text"
                                value={search}
                                placeholder="Search clients..."
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />
                        </div>

                        <select
                            className="status-filter"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as
                                        | 'All'
                                        | ClientStatus
                                )
                            }
                        >
                            <option value="All">
                                All statuses
                            </option>

                            <option value="Active">
                                Active
                            </option>

                            <option value="Onboarding">
                                Onboarding
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>
                        </select>

                    </div>

                </div>


                <div className="clients-table-wrapper">

                    <table className="clients-table">

                        <thead>
                            <tr>
                                <th>CLIENT</th>
                                <th>STATUS</th>
                                <th>PRIMARY CONTACT</th>
                                <th>OPEN TICKETS</th>
                                <th>DEVICES</th>
                                <th>MICROSOFT 365</th>
                                <th>LAST ACTIVITY</th>
                                <th />
                            </tr>
                        </thead>

                        <tbody>

                            {filteredClients.map((client) => (

                                <tr
                                    key={client.id}
                                    onClick={() =>
                                        handleOpenClient(client)
                                    }
                                >

                                    <td>
                                        <div className="client-company">

                                            <div className="client-avatar">
                                                {client.initials}
                                            </div>

                                            <div>
                                                <div className="client-name">
                                                    {client.name}
                                                </div>

                                                <div className="client-domain">
                                                    {client.domain}
                                                </div>
                                            </div>

                                        </div>
                                    </td>


                                    <td>
                                        <span
                                            className={
                                                `client-status ${
                                                    getStatusClass(
                                                        client.status
                                                    )
                                                }`
                                            }
                                        >
                                            <span className="status-dot" />

                                            {client.status}
                                        </span>
                                    </td>


                                    <td>
                                        <div className="contact-name">
                                            {client.primaryContact}
                                        </div>

                                        <div className="contact-email">
                                            {client.email}
                                        </div>
                                    </td>


                                    <td>
                                        <div className="metric-cell">
                                            <Ticket size={15} />
                                            {client.tickets}
                                        </div>
                                    </td>


                                    <td>
                                        <div className="metric-cell">
                                            <Monitor size={15} />
                                            {client.devices}
                                        </div>
                                    </td>


                                    <td>
                                        <span
                                            className={
                                                `microsoft-status ${
                                                    getMicrosoftClass(
                                                        client.microsoft365
                                                    )
                                                }`
                                            }
                                        >
                                            {client.microsoft365}
                                        </span>
                                    </td>


                                    <td>
                                        <div className="activity-cell">
                                            <Clock3 size={14} />

                                            {client.lastActivity}
                                        </div>
                                    </td>


                                    <td>
                                        <div className="table-actions">

                                            <button
                                                type="button"
                                                className="more-button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                }}
                                            >
                                                <MoreHorizontal
                                                    size={18}
                                                />
                                            </button>

                                            <ChevronRight
                                                className="row-arrow"
                                                size={18}
                                            />

                                        </div>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>


                    {filteredClients.length === 0 && (

                        <div className="empty-clients">

                            <Users size={36} />

                            <h3>
                                No clients found
                            </h3>

                            <p>
                                Try changing your search or filter.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>
    )
}


function StatCard({
    icon,
    label,
    value,
    footer,
    type
}: StatCardProps) {

    return (
        <div className="stat-card">

            <div className={`stat-icon ${type}`}>
                {icon}
            </div>

            <div className="stat-content">

                <span className="stat-label">
                    {label}
                </span>

                <strong className="stat-value">
                    {value}
                </strong>

                <span className="stat-footer">
                    {footer}
                </span>

            </div>

        </div>
    )
}