import { supabase } from './supabaseClient'

export async function getRecentPosts(limit = 3) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(name, slug)')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Impossible de charger les articles : ${error.message}`)
  }

  return data
}

export async function getAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(name, slug)')
    .order('published_at', { ascending: false })

  if (error) {
    throw new Error(`Impossible de charger les articles : ${error.message}`)
  }

  return data
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .single()

  if (error) {
    throw new Error(`Article introuvable : ${error.message}`)
  }

  return data
}