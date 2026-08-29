import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { TicketsPage } from './TicketsPage'

function renderTickets() {
  return render(<MemoryRouter><TicketsPage /></MemoryRouter>)
}

describe('TicketsPage', () => {
  it('searches the operations queue and provides a recoverable empty state', async () => {
    const user = userEvent.setup()
    renderTickets()
    const search = screen.getByLabelText('Search tickets')

    await user.type(search, 'INC-1048')
    expect(screen.getByText('1 of 10 tickets')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Open INC-1048/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Open SR-1047/ })).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'ticket-that-does-not-exist')
    expect(screen.getByRole('heading', { name: 'No tickets match this view' })).toBeInTheDocument()

    const emptyState = screen.getByRole('heading', { name: 'No tickets match this view' }).parentElement!
    await user.click(within(emptyState).getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('10 of 10 tickets')).toBeInTheDocument()
  })

  it('combines status, severity, and SLA filters', async () => {
    const user = userEvent.setup()
    renderTickets()

    await user.selectOptions(screen.getByLabelText('Status'), 'In Progress')
    await user.selectOptions(screen.getByLabelText('Severity'), 'High')
    await user.selectOptions(screen.getByLabelText('SLA'), 'Breached')

    expect(screen.getByText('1 of 10 tickets')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Open INC-1045/ })).toBeInTheDocument()
  })

  it('opens complete ticket details and returns focus to the queue row when closed', async () => {
    const user = userEvent.setup()
    renderTickets()
    const opener = screen.getByRole('button', { name: /Open INC-1048/ })

    await user.click(opener)

    expect(screen.getByRole('heading', { name: 'Core switch intermittently dropping uplinks' })).toHaveFocus()
    expect(screen.getByText('Pasig Distribution Hub')).toBeInTheDocument()
    expect(screen.getByText('NSL-PSG-CORE-SW01')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Activity history' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close INC-1048 details' }))
    expect(opener).toHaveFocus()
  })

  it('closes the ticket detail dialog with Escape and returns focus to its trigger', async () => {
    const user = userEvent.setup()
    renderTickets()
    const opener = screen.getByRole('button', { name: /Open INC-1048/ })

    await user.click(opener)

    const dialog = screen.getByRole('dialog', {
      name: 'Core switch intermittently dropping uplinks',
    })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(document.body).toHaveStyle({ overflow: 'hidden' })

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('contains forward and reverse tab focus within the ticket detail dialog', async () => {
    const user = userEvent.setup()
    renderTickets()

    await user.click(screen.getByRole('button', { name: /Open INC-1048/ }))

    const dialog = screen.getByRole('dialog', {
      name: 'Core switch intermittently dropping uplinks',
    })
    const closeButton = within(dialog).getByRole('button', {
      name: 'Close INC-1048 details',
    })
    const addNoteButton = within(dialog).getByRole('button', {
      name: 'Add internal note',
    })

    expect(
      within(dialog).getByRole('heading', {
        name: 'Core switch intermittently dropping uplinks',
      }),
    ).toHaveFocus()

    await user.tab({ shift: true })
    expect(addNoteButton).toHaveFocus()

    await user.tab()
    expect(closeButton).toHaveFocus()

    await user.tab({ shift: true })
    expect(addNoteButton).toHaveFocus()
  })

  it('logs assignment, status, and severity changes in the ticket story', async () => {
    const user = userEvent.setup()
    renderTickets()
    await user.click(screen.getByRole('button', { name: /Open INC-1048/ }))

    const updateSection = screen.getByRole('heading', { name: 'Update ticket' }).closest('section')!

    await user.selectOptions(within(updateSection).getByLabelText('Assigned team'), 'Field Services')
    expect(within(updateSection).getByLabelText('Technician')).toHaveValue('Unassigned')
    await user.selectOptions(within(updateSection).getByLabelText('Technician'), 'Sofia Lim')
    await user.selectOptions(within(updateSection).getByLabelText('Status'), 'Resolved')
    await user.selectOptions(within(updateSection).getByLabelText('Severity'), 'High')

    const activity = screen.getByRole('heading', { name: 'Activity history' }).closest('section')!
    expect(within(activity).getByText(/Assignment moved from Network Operations to Field Services/)).toBeInTheDocument()
    expect(within(activity).getByText('Technician changed from Unassigned to Sofia Lim.')).toBeInTheDocument()
    expect(within(activity).getByText('Status changed from In Progress to Resolved.')).toBeInTheDocument()
    expect(within(activity).getByText('Severity changed from Critical to High.')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Severity changed to High')
  })

  it('validates and adds an internal note to activity history', async () => {
    const user = userEvent.setup()
    renderTickets()
    await user.click(screen.getByRole('button', { name: /Open INC-1048/ }))

    await user.click(screen.getByRole('button', { name: 'Add internal note' }))
    expect(screen.getByText('Write an internal note before adding it to the activity history.')).toBeInTheDocument()

    const note = screen.getByLabelText('Note')
    await user.type(note, 'Replacement optic dispatched; coordinate a 10:30 AM maintenance window.')
    await user.click(screen.getByRole('button', { name: 'Add internal note' }))

    expect(note).toHaveValue('')
    expect(screen.getByText('Replacement optic dispatched; coordinate a 10:30 AM maintenance window.')).toBeInTheDocument()
    expect(screen.getByText('Internal')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Internal note added')
  })
})
