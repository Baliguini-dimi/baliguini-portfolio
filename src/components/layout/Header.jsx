import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'

const pageLinks = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/projets', label: 'Projets' },
  { to: '/blog', label: 'Blog' },
]

const anchorLinks = [
  { hash: '#a-propos', label: 'À propos' },
  { hash: '#contact', label: 'Contact' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setMenuOpen(false)

  const anchorClassName =
    'font-body text-sm text-mist hover:text-bone transition-colors'

  return (
    <header className="border-b border-surface bg-ink/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-bone text-lg" onClick={closeMenu}>
          Dimitri Baliguini
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {pageLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `font-body text-sm transition-colors ${
                  isActive ? 'text-signal' : 'text-mist hover:text-bone'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {anchorLinks.map((link) => (
            <Link key={link.hash} to={`/${link.hash}`} className={anchorClassName}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bouton hamburger mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          className="md:hidden text-bone p-2 -mr-2"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Nav mobile dépliée */}
      {menuOpen && (
        <nav className="md:hidden border-t border-surface px-6 py-4 flex flex-col gap-4">
          {pageLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMenu}
              className={({ isActive }) =>
                `font-body text-sm transition-colors ${
                  isActive ? 'text-signal' : 'text-mist hover:text-bone'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {anchorLinks.map((link) => (
            <Link
              key={link.hash}
              to={`/${link.hash}`}
              onClick={closeMenu}
              className={anchorClassName}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Header