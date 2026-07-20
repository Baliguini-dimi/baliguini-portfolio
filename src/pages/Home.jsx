import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getFeaturedProjects, getOnlineProjectsCount } from '../lib/projects'
import { getSiteSettings } from '../lib/siteSettings'
import ProjectCard from '../components/projects/ProjectCard'
import SEO, { SITE_URL } from '../components/seo/SEO'

function Home() {
  const location = useLocation()
  const [projects, setProjects] = useState([])
  const [projectCount, setProjectCount] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [location.hash])

  useEffect(() => {
    Promise.all([
      getFeaturedProjects(),
      getOnlineProjectsCount(),
      getSiteSettings(),
    ])
      .then(([featuredProjects, count, siteSettings]) => {
        setProjects(featuredProjects)
        setProjectCount(count)
        setSettings(siteSettings)
      })
      .catch((error) => setLoadError(error.message))
  }, [])

  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24">
        <p className="font-mono text-sm text-ember">{loadError}</p>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24">
        <p className="font-mono text-mist text-sm">Chargement...</p>
      </div>
    )
  }

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Dimitri Nelson Baliguini Demba',
    jobTitle: settings.hero_title,
    url: SITE_URL,
    image: `${SITE_URL}${settings.hero_photo_url}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    sameAs: [
      settings.github_url,
      settings.linkedin_url,
      settings.x_url,
      settings.instagram_url,
    ].filter(Boolean),
  }

  return (
    <div>
      <SEO url="/" structuredData={personSchema} />

      <section className="max-w-6xl mx-auto px-6 py-24 flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight">
            {settings.hero_title}
          </h1>
          <p className="font-body text-mist text-lg mt-4 max-w-xl">
            {settings.hero_bio}
          </p>

          <dl className="flex flex-wrap gap-8 mt-8 justify-center md:justify-start">
            <div>
              <dt className="font-display font-bold text-2xl text-signal">
                {projectCount ?? '—'}
              </dt>
              <dd className="font-mono text-xs text-mist mt-1">projets deployes</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-2xl text-signal">
                {settings.tech_count_label}
              </dt>
              <dd className="font-mono text-xs text-mist mt-1">technologies maitrisees</dd>
            </div>
          </dl>
        </div>

        <div className="shrink-0">
          <img
            src={settings.hero_photo_url}
            alt="Portrait de Dimitri Nelson Baliguini Demba"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-2 border-surface"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="font-display font-bold text-2xl">Projets phares</h2>

        {projects.length === 0 && (
          <p className="font-mono text-mist text-sm mt-4">Chargement...</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="font-display font-bold text-2xl">Derniers articles</h2>
        <p className="font-mono text-mist text-sm mt-2">a construire</p>
      </section>

      <section id="a-propos" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-20">
        <h2 className="font-display font-bold text-2xl">A propos</h2>
        <p className="font-body text-bone leading-relaxed mt-4 max-w-2xl whitespace-pre-wrap">
          {settings.about_text}
        </p>
      </section>

      <section id="contact" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-20">
        <h2 className="font-display font-bold text-2xl">Contact</h2>
        <div className="flex flex-wrap gap-4 mt-6">
          {settings.email && (
            <a
              href={`mailto:${settings.email}`}
              className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
            >
              Email
            </a>
          )}
          {settings.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
            >
              Telephone
            </a>
          )}
          {settings.whatsapp_url && (
            <a
              href={settings.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
            >
              WhatsApp
            </a>
          )}
          {settings.linkedin_url && (
            <a
              href={settings.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-signal border border-signal rounded px-4 py-2 hover:bg-signal hover:text-ink transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home