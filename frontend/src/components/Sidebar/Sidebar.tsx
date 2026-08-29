import { useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { groupNavigation } from '../../lib/groupNavigation'
import acrivosLogo from '../../assets/acrivos-logo-icon.webp'
import type { NavigationItem } from '../../types/navigation'

interface SidebarProps {
  items: NavigationItem[]
  isCollapsed: boolean
  isMobileOpen: boolean
  onToggle: () => void
  onClose: () => void
}

const icons: Record<string, LucideIcon> = {
  activity: Activity,
  'bar-chart': BarChart3,
  grid: Grid2X2,
  'message-square': MessageSquare,
  package: Package,
  settings: Settings,
  'shopping-bag': ShoppingBag,
  users: Users,
}

export function Sidebar({ items, isCollapsed, isMobileOpen, onToggle, onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const groups = groupNavigation(items)

  const selectItem = (item: NavigationItem) => {
    navigate(item.path)
    onClose()
  }

  return (
    <>
      <button
        className={`sidebar-backdrop ${isMobileOpen ? 'is-visible' : ''}`}
        aria-label="Close navigation"
        tabIndex={isMobileOpen ? 0 : -1}
        onClick={onClose}
      />
      <aside className={`sidebar ${isCollapsed ? 'is-collapsed' : ''} ${isMobileOpen ? 'is-open' : ''}`}>
        <div className="sidebar-brand">
          <img
            className="brand-logo-image"
            src={acrivosLogo}
            alt=""
            aria-hidden="true"
            width="2048"
            height="2048"
          />
          <span className="brand-name">Acrivos Portal</span>
          <button className="mobile-close" aria-label="Close navigation" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {groups.map((group) => (
            <div className="nav-section" key={group.section}>
              <p className="nav-section-label">{group.section}</p>
              <ul>
                {group.items.map((item) => {
                  const Icon = icons[item.icon] ?? Grid2X2
                  const isActive = location.pathname === item.path

                  return (
                    <li key={item.id}>
                      <button
                        className={`nav-item ${isActive ? 'is-active' : ''}`}
                        aria-label={item.label}
                        aria-current={isActive ? 'page' : undefined}
                        title={isCollapsed ? item.label : undefined}
                        onClick={() => selectItem(item)}
                      >
                        <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                        <span className="nav-item-label">{item.label}</span>
                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar" aria-hidden="true">JT</div>
          <div className="user-details">
            <strong>Jed Turqueza</strong>
            <span>MSP Administrator</span>
          </div>
          <span className="status-dot" title="Online" />
        </div>

        <button
          className="sidebar-toggle"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggle}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  )
}
