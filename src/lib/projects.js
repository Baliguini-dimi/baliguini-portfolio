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

export async function getProjectById(id) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Projet introuvable : ${error.message}`)
  }

  return data
}

export async function createProject(projectData) {
  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single()

  if (error) {
    throw new Error(`Impossible de creer le projet : ${error.message}`)
  }

  return data
}

export async function updateProject(id, projectData) {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Impossible de modifier le projet : ${error.message}`)
  }

  return data
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Impossible de supprimer le projet : ${error.message}`)
  }
}

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Impossible de charger les categories : ${error.message}`)
  }

  return data
}

export async function getOnlineProjectsCount() {
  const { count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'online')

  if (error) {
    throw new Error(`Impossible de compter les projets : ${error.message}`)
  }

  return count
}

// ---- Ajouts ----

export async function duplicateProject(project) {
  const { id, created_at, updated_at, categories, ...rest } = project

  const duplicate = {
    ...rest,
    slug: `${rest.slug}-copie`,
    title: `${rest.title} (copie)`,
    status: 'draft',
    featured: false,
  }

  return createProject(duplicate)
}

export async function getIncompleteProjects() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabase
    .from('projects')
    .select('id, title, slug, status, cover_image_url, created_at')
    .or(`status.eq.draft,cover_image_url.is.null`)

  if (error) {
    throw new Error(`Impossible de verifier les projets incomplets : ${error.message}`)
  }

  return data.filter((p) => {
    const isOldDraft = p.status === 'draft' && new Date(p.created_at) < thirtyDaysAgo
    const missingImage = !p.cover_image_url
    return isOldDraft || missingImage
  })
}