import { supabase } from './supabaseClient'

export async function subscribeToNewsletter(email) {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: email.trim().toLowerCase() })

  if (error) {
    if (error.code === '23505') {
      throw new Error('Cette adresse est deja inscrite a la newsletter.')
    }
    throw new Error(`Impossible de finaliser l'inscription : ${error.message}`)
  }

  // Notification secondaire : on ne bloque pas l'inscription
  fetch('/api/notify-subscriber', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  }).catch(() => {
    // Échec silencieux – ne jamais interrompre le flux d'inscription
  })
}

export async function getAllSubscribers() {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Impossible de charger les inscrits : ${error.message}`)
  }

  return data
}

export async function deleteSubscriber(id) {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Impossible de supprimer l'inscrit : ${error.message}`)
  }
}