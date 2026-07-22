import { supabase } from './supabaseClient'
import { validateDocumentFile, getExtensionForType } from './fileValidation'

export async function uploadDocument(file) {
  const validation = await validateDocumentFile(file)

  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const extension = getExtensionForType(validation.realType)
  const fileName = `${crypto.randomUUID()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      contentType: validation.realType,
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Echec de l'upload : ${uploadError.message}`)
  }

  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName)

  return data.publicUrl
}