import type { NavigationItem } from '../types/navigation'

export interface NavigationGroup {
  section: string
  items: NavigationItem[]
}

export function groupNavigation(items: NavigationItem[]): NavigationGroup[] {
  const groups = new Map<string, NavigationItem[]>()

  items.forEach((item) => {
    const sectionItems = groups.get(item.section) ?? []
    sectionItems.push(item)
    groups.set(item.section, sectionItems)
  })

  return Array.from(groups, ([section, groupedItems]) => ({
    section,
    items: groupedItems,
  }))
}
