import { Link } from 'react-router-dom'
import { projectStatusLabels } from '../../lib/statusLabels'

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projets/${project.slug}`}
      className="block bg-surface rounded-lg overflow-hidden border border-surface hover:border-signal transition-colors"
    >
      <div className="aspect-video bg-ink flex items-center justify-center">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-mono text-mist text-xs">Pas d'image</span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display font-bold text-lg text-bone">{project.title}</h3>
          {project.status !== 'online' && (
            <span className="font-mono text-xs text-ember shrink-0">
              {projectStatusLabels[project.status] ?? project.status}
            </span>
          )}
        </div>

        <p className="font-body text-sm text-mist mt-2 line-clamp-2">
          {project.short_description}
        </p>

        {project.tech_stack?.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-4">
            {project.tech_stack.map((tech) => (
              <li
                key={tech}
                className="font-mono text-xs text-mist bg-ink px-2 py-1 rounded"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}

export default ProjectCard