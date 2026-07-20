import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Dimitri Nelson Baliguini Demba'
const SITE_URL = 'https://baliguini-portfolio.vercel.app'
const DEFAULT_DESCRIPTION =
  "Développeur web et mobile basé à Abidjan. Je conçois des applications complètes, du cahier des charges jusqu'au déploiement."
const DEFAULT_IMAGE = `${SITE_URL}/images/dimitri-hero.png`

function SEO({ title, description, image, url, type = 'website', structuredData }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Développeur Web & Mobile`
  const metaDescription = description || DEFAULT_DESCRIPTION
  const metaImage = image || DEFAULT_IMAGE
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEO
export { SITE_URL, SITE_NAME }