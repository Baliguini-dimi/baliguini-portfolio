import { supabase } from './supabaseClient'

const MAX_IMAGES_PER_POST = 4

export async function getPostImages(postId) {
  const { data, error } = await supabase
    .from('post_images')
    .select('*')
    .eq('post_id', postId)
    .order('display_order', { ascending: true })

  if (error) {
    throw new Error(`Impossible de charger la galerie : ${error.message}`)
  }

  return data
}

export async function addPostImage(postId, imageUrl) {
  const existing = await getPostImages(postId)

  if (existing.length >= MAX_IMAGES_PER_POST) {
    throw new Error(`Maximum ${MAX_IMAGES_PER_POST} images par article.`)
  }

  const { data, error } = await supabase
    .from('post_images')
    .insert({
      post_id: postId,
      image_url: imageUrl,
      display_order: existing.length,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Impossible d'ajouter l'image : ${error.message}`)
  }

  return data
}

export async function deletePostImage(id) {
  const { error } = await supabase
    .from('post_images')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Impossible de supprimer l'image : ${error.message}`)
  }
}