import { supabase } from './supabaseClient'

const MAX_IMAGES_PER_PROJECT = 4

export async function getProjectImages(projectId) {
  const { data, error } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true })

  if (error) {
    throw new Error(`Impossible de charger la galerie : ${error.message}`)
  }

  return data
}

export async function addProjectImage(projectId, imageUrl) {
  const existing = await getProjectImages(projectId)

  if (existing.length >= MAX_IMAGES_PER_PROJECT) {
    throw new Error(`Maximum ${MAX_IMAGES_PER_PROJECT} images par projet.`)
  }

  const { data, error } = await supabase
    .from('project_images')
    .insert({
      project_id: projectId,
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

export async function deleteProjectImage(id) {
  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Impossible de supprimer l'image : ${error.message}`)
  }
}