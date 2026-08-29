import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import type { NavigationItem } from '../../types/navigation'
import { Sidebar } from './Sidebar'

const items: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'grid', section: 'Overview' },
  { id: 'orders', label: 'Orders', path: '/orders', icon: 'shopping-bag', section: 'Management', badge: '12' },
]

function renderSidebar(onToggle = () => undefined, initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Sidebar items={items} isCollapsed={false} isMobileOpen onToggle={onToggle} onClose={() => undefined} />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  it('renders grouped navigation and marks the dashboard as current', () => {
    const { container } = renderSidebar()

    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Management')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(container.querySelector('.brand-logo-image')).toHaveAttribute('alt', '')
  })

  it('exposes an accessible collapse control', () => {
    const onToggle = vi.fn()
    renderSidebar(onToggle)

    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }))

    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('derives the active item from the routed location', () => {
    renderSidebar(() => undefined, '/orders')

    expect(screen.getByRole('button', { name: 'Orders' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  })
})
