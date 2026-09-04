import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DevicesPage } from './DevicesPage/DevicesPage'
import { MessagesPage } from './MessagesPage/MessagesPage'
import { Microsoft365Page } from './Microsoft365Page/Microsoft365Page'
import { ReportsPage } from './ReportsPage/ReportsPage'
import { SettingsPage } from './SettingsPage/SettingsPage'

describe('demo module pages', () => {
  it('filters managed devices by search and health with a recoverable empty state', async () => {
    const user = userEvent.setup()
    render(<DevicesPage />)

    expect(screen.getByRole('heading', { name: 'Devices', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('ACME-LT-042')).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: 'Search devices' }), 'northstar')
    expect(screen.getByText('NST-SRV-01')).toBeInTheDocument()
    expect(screen.queryByText('ACME-LT-042')).not.toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Health status' }), 'Offline')
    expect(screen.getByRole('heading', { name: 'No devices match this view' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear device filters' }))
    expect(screen.getByText('ACME-LT-042')).toBeInTheDocument()
  })

  it('shows Microsoft 365 tenant capacity, service health, and attention work', () => {
    render(<Microsoft365Page />)

    expect(screen.getByRole('heading', { name: 'Microsoft 365', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('License utilization')).toBeInTheDocument()
    expect(screen.getByText('Exchange Online')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Attention items' })).toBeInTheDocument()
  })

  it('filters the report catalogue by report type and date range', async () => {
    const user = userEvent.setup()
    render(<ReportsPage />)

    await user.selectOptions(screen.getByRole('combobox', { name: 'Report type' }), 'Security')
    expect(screen.getByText('Security posture review')).toBeInTheDocument()
    expect(screen.queryByText('Monthly service review')).not.toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Reporting period' }), '90 days')
    expect(screen.getByText('Showing Security reports for the last 90 days')).toBeInTheDocument()
  })

  it('marks a selected conversation read and validates simulated replies', async () => {
    const user = userEvent.setup()
    render(<MessagesPage />)

    expect(screen.getByText('2 unread')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Open conversation with Priya Nair/ }))
    expect(screen.getByText('1 unread')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Send demo reply' }))
    expect(screen.getByText('Enter a reply before sending.')).toBeInTheDocument()

    await user.type(screen.getByRole('textbox', { name: 'Reply message' }), 'The maintenance window is confirmed.')
    await user.click(screen.getByRole('button', { name: 'Send demo reply' }))
    expect(screen.getAllByText('The maintenance window is confirmed.')).toHaveLength(2)
    expect(screen.getByRole('status')).toHaveTextContent('Demo reply added')
  })

  it('simulates profile and workspace preference updates without persistence', async () => {
    const user = userEvent.setup()
    render(<SettingsPage />)

    await user.clear(screen.getByRole('textbox', { name: 'Display name' }))
    await user.type(screen.getByRole('textbox', { name: 'Display name' }), 'Alex Morgan')
    await user.click(screen.getByRole('checkbox', { name: 'Email service alerts' }))
    await user.click(screen.getByRole('radio', { name: 'Dark' }))
    await user.click(screen.getByRole('button', { name: 'Save demo settings' }))

    expect(screen.getByRole('status')).toHaveTextContent('Demo preferences updated')
  })
})
