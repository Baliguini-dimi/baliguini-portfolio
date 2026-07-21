import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts, deletePost, duplicatePost } from '../../lib/posts'
import { postStatusLabels } from '../../lib/statusLabels'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

function AdminPostsList() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  function loadPosts() {
    setIsLoading(true)
    getAllPosts()
      .then(setPosts)
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleDelete(post) {
    const confirmed = window.confirm(
      `Supprimer définitivement "${post.title}" ? Cette action est irréversible.`
    )
    if (!confirmed) return

    setDeletingId(post.id)
    try {
      await deletePost(post.id)
      setPosts((current) => current.filter((p) => p.id !== post.id))
    } catch (error) {
      window.alert(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleDuplicate(post) {
    try {
      await duplicatePost(post)
      loadPosts()
    } catch (error) {
      window.alert(error.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <AdminPageHeader
        title="Articles"
        action={
          <Link
            to="/admin/articles/nouveau"
            className="font-mono text-sm bg-signal text-ink rounded px-4 py-2 hover:opacity-90 transition-opacity"
          >
            + Nouvel article
          </Link>
        }
      />

      {loadError && (
        <p className="font-mono text-sm text-ember mt-6">{loadError}</p>
      )}

      {isLoading && !loadError && (
        <p className="font-mono text-mist text-sm mt-6">Chargement...</p>
      )}

      {!isLoading && !loadError && (
        <div className="mt-8 flex flex-col gap-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 bg-surface rounded px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-body text-bone truncate">{post.title}</p>
                <p className="font-mono text-xs text-mist mt-1">
                  {post.status ? (postStatusLabels[post.status] ?? post.status) : 'Publié'}
                  {post.featured && ' · mis en avant'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDuplicate(post)}
                  className="font-mono text-xs text-mist hover:text-bone"
                >
                  Dupliquer
                </button>
                <Link
                  to={`/admin/articles/${post.id}/modifier`}
                  className="font-mono text-xs text-signal hover:opacity-80"
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post)}
                  disabled={deletingId === post.id}
                  className="font-mono text-xs text-ember hover:opacity-80 disabled:opacity-50"
                >
                  {deletingId === post.id ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <p className="font-mono text-mist text-sm">Aucun article pour l'instant.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPostsList