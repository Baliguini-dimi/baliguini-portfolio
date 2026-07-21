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

export async function getPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Article introuvable : ${error.message}`)
  }

  return data
}

export async function createPost(postData) {
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single()

  if (error) {
    throw new Error(`Impossible de créer l'article : ${error.message}`)
  }

  return data
}

export async function updatePost(id, postData) {
  const { data, error } = await supabase
    .from('posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Impossible de modifier l'article : ${error.message}`)
  }

  return data
}

export async function deletePost(id) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Impossible de supprimer l'article : ${error.message}`)
  }
}

// ---- Ajouts ----

export async function duplicatePost(post) {
  const { id, created_at, updated_at, published_at, categories, ...rest } = post

  const duplicate = {
    ...rest,
    slug: `${rest.slug}-copie`,
    title: `${rest.title} (copie)`,
    status: 'draft',
  }

  return createPost(duplicate)
}

export async function getIncompletePosts() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, status, category_id, created_at')
    .or(`status.eq.draft,category_id.is.null`)

  if (error) {
    throw new Error(`Impossible de verifier les articles incomplets : ${error.message}`)
  }

  return data.filter((p) => {
    const isOldDraft = p.status === 'draft' && new Date(p.created_at) < thirtyDaysAgo
    const missingCategory = !p.category_id
    return isOldDraft || missingCategory
  })
}