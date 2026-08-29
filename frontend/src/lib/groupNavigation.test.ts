import { describe, expect, it } from 'vitest'
import type { NavigationItem } from '../types/navigation'
import { groupNavigation } from './groupNavigation'

describe('groupNavigation', () => {
  it('preserves section and item order from the API', () => {
    const items: NavigationItem[] = [
      { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'grid', section: 'Overview' },
      { id: 'orders', label: 'Orders', path: '/orders', icon: 'bag', section: 'Management' },
      { id: 'products', label: 'Products', path: '/products', icon: 'box', section: 'Management' },
    ]

    expect(groupNavigation(items)).toEqual([
      { section: 'Overview', items: [items[0]] },
      { section: 'Management', items: [items[1], items[2]] },
    ])
  })

  it('returns no groups for an empty navigation response', () => {
    expect(groupNavigation([])).toEqual([])
  })
})
