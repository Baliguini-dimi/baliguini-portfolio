import { supabase } from './supabaseClient'
import { getSessionId } from './session'

export async function trackPageView(pageType, path, referenceSlug = null) {
  try {
    await supabase.from('page_views').insert({
      path,
      page_type: pageType,
      reference_slug: referenceSlug,
      session_id: getSessionId(),
    })
  } catch {
    // Ne jamais bloquer l'affichage du site si le suivi echoue
  }
}

export async function trackReadingTime(postSlug, secondsSpent) {
  if (secondsSpent < 5) return // ignore les passages trop courts pour etre significatifs

  try {
    await supabase.from('reading_events').insert({
      post_slug: postSlug,
      session_id: getSessionId(),
      seconds_spent: secondsSpent,
    })
  } catch {
    // Idem, ne jamais bloquer l'affichage
  }
}