import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../../lib/auth'
import { useAuth } from '../../context/AuthContext'

function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl">Administration</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="font-mono text-sm text-mist hover:text-ember transition-colors"
        >
          Se déconnecter
        </button>
      </div>

      <p className="font-mono text-mist text-sm mt-4">
        Connecté en tant que {user?.email}
      </p>

      <div className="flex gap-4 mt-8">
        <Link
          to="/admin/projets"
          className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
        >
          Gérer les projets
        </Link>
        <Link
          to="/admin/articles"
          className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
        >
          Gérer les articles
        </Link>
        <Link
          to="/admin/reglages"
          className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
        >
          Reglages du site
        </Link>
        <Link
          to="/admin/statistiques"
          className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
        >
          Statistiques
        </Link>
        {/* Nouveau lien vers la newsletter */}
        <Link
          to="/admin/newsletter"
          className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
        >
          Newsletter
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard