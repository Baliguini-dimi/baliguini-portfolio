import { supabase } from './supabaseClient'

export async function getTotalVisitors(daysBack = 30) {
  const since = new Date()
  since.setDate(since.getDate() - daysBack)

  const { data, error } = await supabase
    .from('page_views')
    .select('session_id')
    .gte('created_at', since.toISOString())

  if (error) {
    throw new Error(`Impossible de charger les visiteurs : ${error.message}`)
  }

  const uniqueSessions = new Set(data.map((row) => row.session_id))
  return uniqueSessions.size
}

export async function getPageViewsByType(daysBack = 30) {
  const since = new Date()
  since.setDate(since.getDate() - daysBack)

  const { data, error } = await supabase
    .from('page_views')
    .select('page_type')
    .gte('created_at', since.toISOString())

  if (error) {
    throw new Error(`Impossible de charger les vues : ${error.message}`)
  }

  const counts = {}
  data.forEach((row) => {
    counts[row.page_type] = (counts[row.page_type] ?? 0) + 1
  })

  return counts
}

export async function getTopProjects(daysBack = 30, limit = 5) {
  const since = new Date()
  since.setDate(since.getDate() - daysBack)

  const { data, error } = await supabase
    .from('page_views')
    .select('reference_slug')
    .eq('page_type', 'project_detail')
    .gte('created_at', since.toISOString())

  if (error) {
    throw new Error(`Impossible de charger le classement des projets : ${error.message}`)
  }

  const counts = {}
  data.forEach((row) => {
    if (row.reference_slug) {
      counts[row.reference_slug] = (counts[row.reference_slug] ?? 0) + 1
    }
  })

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug, views]) => ({ slug, views }))
}

export async function getTopPosts(daysBack = 30, limit = 5) {
  const since = new Date()
  since.setDate(since.getDate() - daysBack)

  const { data, error } = await supabase
    .from('page_views')
    .select('reference_slug')
    .eq('page_type', 'blog_detail')
    .gte('created_at', since.toISOString())

  if (error) {
    throw new Error(`Impossible de charger le classement des articles : ${error.message}`)
  }

  const counts = {}
  data.forEach((row) => {
    if (row.reference_slug) {
      counts[row.reference_slug] = (counts[row.reference_slug] ?? 0) + 1
    }
  })

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug, views]) => ({ slug, views }))
}

export async function getAverageReadingTime(daysBack = 30) {
  const since = new Date()
  since.setDate(since.getDate() - daysBack)

  const { data, error } = await supabase
    .from('reading_events')
    .select('post_slug, seconds_spent')
    .gte('created_at', since.toISOString())

  if (error) {
    throw new Error(`Impossible de charger le temps de lecture : ${error.message}`)
  }

  const grouped = {}
  data.forEach((row) => {
    if (!grouped[row.post_slug]) grouped[row.post_slug] = []
    grouped[row.post_slug].push(row.seconds_spent)
  })

  return Object.entries(grouped).map(([slug, times]) => ({
    slug,
    averageSeconds: Math.round(times.reduce((sum, t) => sum + t, 0) / times.length),
    sampleCount: times.length,
  }))
}