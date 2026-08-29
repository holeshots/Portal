import { useEffect, useRef, useState } from 'react'
import { Bell, LogOut, Menu, Search, UserCog } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'

interface HeaderProps {
  onOpenMenu: () => void
}

export function Header({ onOpenMenu }: HeaderProps) {
  const navigate = useNavigate()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const profileTriggerRef = useRef<HTMLButtonElement>(null)
  const signOutRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isProfileMenuOpen) return

    signOutRef.current?.focus()

    const handlePointerDown = (event: PointerEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      setIsProfileMenuOpen(false)
      profileTriggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileMenuOpen])

  const handleSignOut = () => {
    setIsProfileMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={onOpenMenu}>
        <Menu size={21} />
      </button>
      <div className="topbar-title">
        <span className="eyebrow">Workspace</span>
        <strong>Acrivos Portal</strong>
      </div>
      <div className="topbar-actions">
        <button className="search-trigger" aria-label="Search">
          <Search size={17} />
          <span>Search anything</span>
          <kbd>⌘ K</kbd>
        </button>
        <ThemeToggle />
        <button className="icon-button notification-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
        <div className="profile-menu-container" ref={profileMenuRef}>
          <button
            ref={profileTriggerRef}
            className="header-avatar"
            type="button"
            aria-label="User menu for Jed Turqueza"
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
            aria-controls="header-profile-menu"
            onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
          >
            JT
          </button>
          {isProfileMenuOpen && (
            <div
              id="header-profile-menu"
              className="profile-menu"
              role="menu"
              aria-label="User account"
            >
              <div className="profile-menu-identity">
                <strong>Jed Turqueza</strong>
                <span>MSP Administrator</span>
              </div>
              <div className="profile-menu-separator" role="separator" />
              <button
                ref={signOutRef}
                className="profile-menu-item"
                type="button"
                role="menuitem"
              >
                <UserCog size={16} aria-hidden="true" />
                Account Settings
              </button>
              <button
                ref={signOutRef}
                className="profile-menu-item"
                type="button"
                role="menuitem"
                onClick={handleSignOut}
              >
                <LogOut size={16} aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
