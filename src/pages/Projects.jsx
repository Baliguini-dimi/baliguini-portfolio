import { useEffect, useMemo, useState } from 'react'
import { getAllProjects } from '../lib/projects'
import ProjectCard from '../components/projects/ProjectCard'
import SEO from '../components/seo/SEO'
import { usePageView } from '../hooks/usePageView'   // <-- import ajouté

function Projects() {
  const [projects, setProjects] = useState([])
  const [loadError, setLoadError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  usePageView('projects_list')   // <-- appel ajouté

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false))
  }, [])

  const categories = useMemo(() => {
    const unique = new Map()
    projects.forEach((project) => {
      if (project.categories) {
        unique.set(project.categories.slug, project.categories.name)
      }
    })
    return Array.from(unique, ([slug, name]) => ({ slug, name }))
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects
    return projects.filter((project) => project.categories?.slug === activeCategory)
  }, [projects, activeCategory])

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <SEO
        title="Projets"
        description="Projets web et mobile réalisés par Dimitri Nelson Baliguini Demba : marketplace, SaaS, applications de gestion."
        url="/projets"
      />

      <h1 className="font-display font-bold text-3xl">Projets</h1>

      {loadError && (
        <p className="font-mono text-sm text-ember mt-4">{loadError}</p>
      )}

      {!loadError && (
        <>
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === 'all'
                  ? 'border-signal text-signal'
                  : 'border-surface text-mist hover:border-mist'
              }`}
            >
              Tous
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  activeCategory === category.slug
                    ? 'border-signal text-signal'
                    : 'border-surface text-mist hover:border-mist'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {isLoading && (
            <p className="font-mono text-mist text-sm mt-8">Chargement...</p>
          )}

          {!isLoading && filteredProjects.length === 0 && (
            <p className="font-mono text-mist text-sm mt-8">Aucun projet dans cette catégorie.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Projects