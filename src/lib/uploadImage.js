import { supabase } from './supabaseClient'
import { validateImageFile, getExtensionForType } from './fileValidation'

export async function uploadProjectImage(file) {
  const validation = await validateImageFile(file)

  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const extension = getExtensionForType(validation.realType)
  const fileName = `${crypto.randomUUID()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from('project-images')
    .upload(fileName, file, {
      contentType: validation.realType,
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Échec de l'upload : ${uploadError.message}`)
  }

  const { data } = supabase.storage
    .from('project-images')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export async function deleteProjectImage(publicUrl) {
  const fileName = publicUrl.split('/').pop()

  const { error } = await supabase.storage
    .from('project-images')
    .remove([fileName])

  if (error) {
    throw new Error(`Échec de la suppression : ${error.message}`)
  }
}