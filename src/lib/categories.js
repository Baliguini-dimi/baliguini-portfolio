import { supabase } from './supabaseClient'

function slugifyCategory(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
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

export async function createCategory(name) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: name.trim(), slug: slugifyCategory(name) })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Cette categorie existe deja.')
    }
    throw new Error(`Impossible de creer la categorie : ${error.message}`)
  }

  return data
}

export async function updateCategory(id, name) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name: name.trim(), slug: slugifyCategory(name) })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Cette categorie existe deja.')
    }
    throw new Error(`Impossible de modifier la categorie : ${error.message}`)
  }

  return data
}

export async function deleteCategory(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Impossible de supprimer la categorie : ${error.message}`)
  }
}