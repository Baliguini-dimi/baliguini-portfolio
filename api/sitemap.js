import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://baliguini-portfolio.vercel.app'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  )

  const [{ data: projects }, { data: posts }] = await Promise.all([
    supabase.from('projects').select('slug, updated_at').neq('status', 'draft'),
    supabase.from('posts').select('slug, updated_at').eq('status', 'published'),
  ])

  const staticUrls = [
    { loc: '/', priority: '1.0' },
    { loc: '/projets', priority: '0.8' },
    { loc: '/blog', priority: '0.8' },
  ]

  const projectUrls = (projects ?? []).map((p) => ({
    loc: `/projets/${p.slug}`,
    lastmod: p.updated_at,
    priority: '0.6',
  }))

  const postUrls = (posts ?? []).map((p) => ({
    loc: `/blog/${p.slug}`,
    lastmod: p.updated_at,
    priority: '0.6',
  }))

  const allUrls = [...staticUrls, ...projectUrls, ...postUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${new Date(url.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.status(200).send(xml)
}