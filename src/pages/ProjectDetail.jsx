import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProjectBySlug } from '../lib/projects'
import SEO from '../components/seo/SEO'

const statusLabels = {
  online: 'En ligne',
  in_progress: 'En cours',
  archived: 'Archivé',
}

function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setLoadError(null)
    getProjectBySlug(slug)
      .then(setProject)
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false))
  }, [slug])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <p className="font-mono text-mist text-sm">Chargement...</p>
      </div>
    )
  }

  if (loadError || !project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <Link to="/projets" className="font-mono text-signal text-sm">
          &larr; Retour aux projets
        </Link>
        <p className="font-mono text-mist text-sm mt-6">
          {loadError ?? 'Ce projet est introuvable.'}
        </p>
      </div>
    )
  }

  const formattedDate = project.completion_date
    ? new Date(project.completion_date).getFullYear()
    : null

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <SEO
        title={project.title}
        description={project.short_description}
        image={project.cover_image_url}
        url={`/projets/${project.slug}`}
        type="article"
      />

      <Link to="/projets" className="font-mono text-signal text-sm">
        &larr; Retour aux projets
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="font-display font-bold text-3xl">{project.title}</h1>
        {project.status !== 'online' && (
          <span className="font-mono text-xs text-ember border border-ember rounded-full px-2 py-0.5">
            {statusLabels[project.status] ?? project.status}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 font-mono text-sm text-mist">
        {project.categories?.name && <span>{project.categories.name}</span>}
        {formattedDate && <span>{formattedDate}</span>}
        {project.client_name && <span>{project.client_name}</span>}
      </div>

      {project.cover_image_url && (
        <img
          src={project.cover_image_url}
          alt={project.title}
          className="w-full rounded-lg mt-8 border border-surface"
        />
      )}

      {project.full_description && (
        <p className="font-body text-bone leading-relaxed mt-8">
          {project.full_description}
        </p>
      )}

      {project.tech_stack?.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-8">
          {project.tech_stack.map((tech) => (
            <li
              key={tech}
              className="font-mono text-xs text-mist bg-surface px-3 py-1.5 rounded"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}

      {project.project_images?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
          {project.project_images
            .sort((a, b) => a.display_order - b.display_order)
            .map((image) => (
              <img
                key={image.id}
                src={image.image_url}
                alt={image.alt_text ?? project.title}
                className="w-full h-40 object-cover rounded border border-surface"
              />
            ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-10">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
          >
            Code source
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
          >
            Démo live
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectDetail