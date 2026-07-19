import { supabase } from './supabaseClient'

export async function getFeaturedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('display_order', { ascending: true })

  if (error) {
    throw new Error(`Impossible de charger les projets phares : ${error.message}`)
  }

  return data
}

export async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*, categories(name, slug)')
    .order('display_order', { ascending: true })

  if (error) {
    throw new Error(`Impossible de charger les projets : ${error.message}`)
  }

  return data
}

export async function getProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('slug', slug)
    .single()

  if (error) {
    throw new Error(`Projet introuvable : ${error.message}`)
  }

  return data
}