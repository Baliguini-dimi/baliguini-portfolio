import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProjects, deleteProject } from '../../lib/projects'
import { projectStatusLabels } from '../../lib/statusLabels'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

function AdminProjectsList() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  function loadProjects() {
    setIsLoading(true)
    getAllProjects()
      .then(setProjects)
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadProjects()
  }, [])

  async function handleDelete(project) {
    const confirmed = window.confirm(
      `Supprimer définitivement "${project.title}" ? Cette action est irréversible.`
    )
    if (!confirmed) return

    setDeletingId(project.id)
    try {
      await deleteProject(project.id)
      setProjects((current) => current.filter((p) => p.id !== project.id))
    } catch (error) {
      window.alert(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display font-bold text-3xl">Projets</h1>
        <Link
          to="/admin/projets/nouveau"
          className="font-mono text-sm bg-signal text-ink rounded px-4 py-2 hover:opacity-90 transition-opacity"
        >
          + Nouveau projet
        </Link>
      </div>

      {loadError && (
        <p className="font-mono text-sm text-ember mt-6">{loadError}</p>
      )}

      {isLoading && !loadError && (
        <p className="font-mono text-mist text-sm mt-6">Chargement...</p>
      )}

      {!isLoading && !loadError && (
        <div className="mt-8 flex flex-col gap-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between gap-4 bg-surface rounded px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-body text-bone truncate">{project.title}</p>
                <p className="font-mono text-xs text-mist mt-1">
                  {projectStatusLabels[project.status] ?? project.status}
                  {project.featured && ' · mis en avant'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`/admin/projets/${project.id}/modifier`}
                  className="font-mono text-xs text-signal hover:opacity-80"
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(project)}
                  disabled={deletingId === project.id}
                  className="font-mono text-xs text-ember hover:opacity-80 disabled:opacity-50"
                >
                  {deletingId === project.id ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <p className="font-mono text-mist text-sm">Aucun projet pour l'instant.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminProjectsList