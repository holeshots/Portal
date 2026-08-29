import {
  BarChart3,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface ModuleDefinition {
  path: `/${string}`
  title: string
  description: string
  icon: LucideIcon
}

export const MODULE_PLACEHOLDERS: readonly ModuleDefinition[] = [
  {
    path: '/devices',
    title: 'Devices',
    description: 'A future workspace for managed endpoints, network equipment, and device health across client environments.',
    icon: ShoppingBag,
  },
  {
    path: '/clients',
    title: 'Clients',
    description: 'A future home for client organizations, sites, contacts, and the service context your team relies on.',
    icon: Users,
  },
  {
    path: '/365',
    title: 'Microsoft 365',
    description: 'A future workspace for tenant, license, user, and Microsoft 365 service context across clients.',
    icon: Package,
  },
  {
    path: '/reports',
    title: 'Reports',
    description: 'A future home for operational, SLA, and service-performance insights across your MSP portfolio.',
    icon: BarChart3,
  },
  {
    path: '/messages',
    title: 'Messages',
    description: 'A future workspace for client conversations and service communications connected to operational work.',
    icon: MessageSquare,
  },
  {
    path: '/settings',
    title: 'Settings',
    description: 'A future home for portal preferences, team configuration, and workspace administration.',
    icon: Settings,
  },
]
