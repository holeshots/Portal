export interface NavigationItem {
  id: string
  label: string
  path: string
  icon: string
  section: string
  badge?: string | null
  children?: NavigationItem[] | null
}
