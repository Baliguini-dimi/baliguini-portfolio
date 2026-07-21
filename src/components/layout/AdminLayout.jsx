import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from '../../lib/auth'
import { useAuth } from '../../context/AuthContext'

const adminLinks = [
  { to: '/admin', label: 'Vue d\'ensemble', end: true },
  { to: '/admin/projets', label: 'Projets' },
  { to: '/admin/articles', label: 'Articles' },
  { to: '/admin/newsletter', label: 'Newsletter' },
  { to: '/admin/statistiques', label: 'Statistiques' },
  { to: '/admin/reglages', label: 'Reglages' },
]

function AdminLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `block font-mono text-sm px-3 py-2 rounded transition-colors ${
      isActive ? 'bg-signal text-ink' : 'text-mist hover:text-bone hover:bg-surface'
    }`

  return (
    <div className="min-h-screen bg-ink text-bone flex flex-col md:flex-row">
      <aside className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-surface p-4 md:p-6 md:min-h-screen">
        <p className="font-display font-bold text-lg mb-6 hidden md:block">Administration</p>

        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {adminLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block mt-8 pt-6 border-t border-surface">
          <p className="font-mono text-xs text-mist truncate">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="font-mono text-xs text-mist hover:text-ember transition-colors mt-2"
          >
            Se deconnecter
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout