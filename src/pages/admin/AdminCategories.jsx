import { useEffect, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../lib/categories'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newName, setNewName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  function loadCategories() {
    setIsLoading(true)
    getAllCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleCreate(event) {
    event.preventDefault()
    if (!newName.trim()) return

    setError(null)
    setIsCreating(true)
    try {
      await createCategory(newName)
      setNewName('')
      loadCategories()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  function startEditing(category) {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  async function handleUpdate(event) {
    event.preventDefault()
    if (!editingName.trim()) return

    setError(null)
    try {
      await updateCategory(editingId, editingName)
      setEditingId(null)
      loadCategories()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `Supprimer la categorie "${category.name}" ? Les projets/articles associes n'en auront plus.`
    )
    if (!confirmed) return

    setDeletingId(category.id)
    try {
      await deleteCategory(category.id)
      setCategories((current) => current.filter((c) => c.id !== category.id))
    } catch (err) {
      window.alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass =
    'flex-1 bg-surface border border-surface rounded px-3 py-2 text-bone focus:outline-none focus:border-signal'

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <AdminPageHeader
        title="Categories"
        description="Utilisees pour classer les projets et les articles."
      />

      <form onSubmit={handleCreate} className="flex gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nouvelle categorie (ex: Reseau / Infrastructure)"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={isCreating}
          className="font-mono text-sm bg-signal text-ink rounded px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
        >
          {isCreating ? 'Ajout...' : '+ Ajouter'}
        </button>
      </form>

      {error && (
        <p className="font-mono text-sm text-ember mt-4">{error}</p>
      )}

      {isLoading ? (
        <p className="font-mono text-mist text-sm mt-6">Chargement...</p>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-4 bg-surface rounded px-4 py-3"
            >
              {editingId === category.id ? (
                <form onSubmit={handleUpdate} className="flex gap-3 flex-1">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className={inputClass}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="font-mono text-xs text-signal hover:opacity-80"
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="font-mono text-xs text-mist hover:text-bone"
                  >
                    Annuler
                  </button>
                </form>
              ) : (
                <>
                  <span className="font-body text-bone">{category.name}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditing(category)}
                      className="font-mono text-xs text-signal hover:opacity-80"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      disabled={deletingId === category.id}
                      className="font-mono text-xs text-ember hover:opacity-80 disabled:opacity-50"
                    >
                      {deletingId === category.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {categories.length === 0 && (
            <p className="font-mono text-mist text-sm">Aucune categorie pour l'instant.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminCategories