import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getOnlineProjectsCount, getIncompleteProjects } from '../../lib/projects'
import { getTotalVisitors } from '../../lib/analyticsStats'
import { getAllSubscribers } from '../../lib/newsletter'
import { getIncompletePosts } from '../../lib/posts'

function AdminDashboard() {
  const { user } = useAuth()
  const [projectCount, setProjectCount] = useState(null)
  const [visitors, setVisitors] = useState(null)
  const [subscriberCount, setSubscriberCount] = useState(null)
  const [incompleteProjects, setIncompleteProjects] = useState([])
  const [incompletePosts, setIncompletePosts] = useState([])

  useEffect(() => {
    getOnlineProjectsCount().then(setProjectCount).catch(() => setProjectCount(null))
    getTotalVisitors(30).then(setVisitors).catch(() => setVisitors(null))
    getAllSubscribers().then((subs) => setSubscriberCount(subs.length)).catch(() => setSubscriberCount(null))
    getIncompleteProjects().then(setIncompleteProjects).catch(() => setIncompleteProjects([]))
    getIncompletePosts().then(setIncompletePosts).catch(() => setIncompletePosts([]))
  }, [])

  const hasIncomplete = incompleteProjects.length > 0 || incompletePosts.length > 0

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h1 className="font-display font-bold text-3xl">Vue d'ensemble</h1>
      <p className="font-mono text-mist text-sm mt-2">
        Connecte en tant que {user?.email}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <Link to="/admin/projets" className="bg-surface rounded-lg p-6 hover:bg-surface/70 transition-colors">
          <p className="font-mono text-xs text-mist">Projets en ligne</p>
          <p className="font-display font-bold text-3xl text-signal mt-2">
            {projectCount ?? '—'}
          </p>
        </Link>

        <Link to="/admin/statistiques" className="bg-surface rounded-lg p-6 hover:bg-surface/70 transition-colors">
          <p className="font-mono text-xs text-mist">Visiteurs (30 jours)</p>
          <p className="font-display font-bold text-3xl text-signal mt-2">
            {visitors ?? '—'}
          </p>
        </Link>

        <Link to="/admin/newsletter" className="bg-surface rounded-lg p-6 hover:bg-surface/70 transition-colors">
          <p className="font-mono text-xs text-mist">Inscrits newsletter</p>
          <p className="font-display font-bold text-3xl text-signal mt-2">
            {subscriberCount ?? '—'}
          </p>
        </Link>
      </div>

      {hasIncomplete && (
        <div className="bg-surface border border-ember rounded-lg p-6 mt-6">
          <p className="font-mono text-sm text-ember">A completer</p>

          {incompleteProjects.length > 0 && (
            <div className="mt-4">
              <p className="font-mono text-xs text-mist mb-2">Projets</p>
              <ul className="flex flex-col gap-1">
                {incompleteProjects.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/admin/projets/${p.id}/modifier`}
                      className="font-body text-sm text-bone hover:text-signal"
                    >
                      {p.title} — {!p.cover_image_url ? 'sans image' : 'brouillon ancien'}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {incompletePosts.length > 0 && (
            <div className="mt-4">
              <p className="font-mono text-xs text-mist mb-2">Articles</p>
              <ul className="flex flex-col gap-1">
                {incompletePosts.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/admin/articles/${p.id}/modifier`}
                      className="font-body text-sm text-bone hover:text-signal"
                    >
                      {p.title} — {!p.category_id ? 'sans categorie' : 'brouillon ancien'}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard