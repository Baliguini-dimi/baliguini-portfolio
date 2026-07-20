import { supabase } from './supabaseClient'

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  if (error) {
    throw new Error(`Impossible de charger les reglages du site : ${error.message}`)
  }

  return data
}

export async function updateSiteSettings(id, settingsData) {
  const { data, error } = await supabase
    .from('site_settings')
    .update(settingsData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Impossible de mettre a jour les reglages : ${error.message}`)
  }

  return data
}