import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const authHeader = req.headers.authorization

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Non autorise' })
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const now = new Date().toISOString()

  const { data: duePosts, error: fetchError } = await supabase
    .from('posts')
    .select('id, title')
    .eq('status', 'draft')
    .not('scheduled_for', 'is', null)
    .lte('scheduled_for', now)

  if (fetchError) {
    return res.status(500).json({ error: fetchError.message })
  }

  if (!duePosts || duePosts.length === 0) {
    return res.status(200).json({ published: 0 })
  }

  const { error: updateError } = await supabase
    .from('posts')
    .update({ status: 'published', published_at: now })
    .in('id', duePosts.map((p) => p.id))

  if (updateError) {
    return res.status(500).json({ error: updateError.message })
  }

  return res.status(200).json({ published: duePosts.length, titles: duePosts.map((p) => p.title) })
}