import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getFeaturedProjects } from '../lib/projects'
import ProjectCard from '../components/projects/ProjectCard'
import SEO, { SITE_URL } from '../components/seo/SEO'

function Home() {
  const location = useLocation()
  const [projects, setProjects] = useState([])
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
    getFeaturedProjects()
      .then(setProjects)
      .catch((error) => setLoadError(error.message))
  }, [])

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Dimitri Nelson Baliguini Demba',
    jobTitle: 'Développeur Web & Mobile',
    url: SITE_URL,
    image: `${SITE_URL}/images/dimitri-hero.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    sameAs: [
      'https://github.com/Baliguini-dimi',
      'https://www.linkedin.com/in/dimitri-nelson-baligini-demba-4b17b32ba',
      'https://x.com/baliguini_fils',
      'https://www.instagram.com/dems_nb/',
    ],
  }

  return (
    <div>
      <SEO url="/" structuredData={personSchema} />

      <section className="max-w-6xl mx-auto px-6 py-24 flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight">
            Développeur Web &amp; Mobile
          </h1>
          <p className="font-body text-mist text-lg mt-4 max-w-xl">
            Développeur web et mobile basé à Abidjan. Je conçois des applications
            complètes, du cahier des charges jusqu'au déploiement.
          </p>

          <dl className="flex flex-wrap gap-8 mt-8 justify-center md:justify-start">
            <div>
              <dt className="font-display font-bold text-2xl text-signal">4</dt>
              <dd className="font-mono text-xs text-mist mt-1">projets déployés</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-2xl text-signal">5+</dt>
              <dd className="font-mono text-xs text-mist mt-1">technologies maîtrisées</dd>
            </div>
          </dl>
        </div>

        <div className="shrink-0">
          <img
            src="/images/dimitri-hero.png"
            alt="Portrait de Dimitri Nelson Baliguini Demba"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-2 border-surface"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="font-display font-bold text-2xl">Projets phares</h2>

        {loadError && (
          <p className="font-mono text-sm text-ember mt-4">{loadError}</p>
        )}

        {!loadError && projects.length === 0 && (
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
        <p className="font-mono text-mist text-sm mt-2">à construire</p>
      </section>

      <section id="a-propos" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-20">
        <h2 className="font-display font-bold text-2xl">À propos</h2>
        <p className="font-mono text-mist text-sm mt-2">à construire</p>
      </section>

      <section id="contact" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-20">
        <h2 className="font-display font-bold text-2xl">Contact</h2>
        <p className="font-mono text-mist text-sm mt-2">à construire</p>
      </section>
    </div>
  )
}

export default Home