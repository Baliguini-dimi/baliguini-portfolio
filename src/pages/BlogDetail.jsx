import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPostBySlug, getAllPosts } from '../lib/posts'
import PostCard from '../components/blog/PostCard'

function formatDate(dateString) {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loadError, setLoadError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setLoadError(null)
    setPost(null)

    getPostBySlug(slug)
      .then((data) => {
        setPost(data)
        return getAllPosts()
      })
      .then((allPosts) => {
        setRelatedPosts(
          allPosts.filter((p) => p.slug !== slug).slice(0, 2)
        )
      })
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false))
  }, [slug])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <p className="font-mono text-mist text-sm">Chargement...</p>
      </div>
    )
  }

  if (loadError || !post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link to="/blog" className="font-mono text-signal text-sm">
          &larr; Retour au blog
        </Link>
        <p className="font-mono text-mist text-sm mt-6">
          {loadError ?? 'Cet article est introuvable.'}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <Link to="/blog" className="font-mono text-signal text-sm">
        &larr; Retour au blog
      </Link>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-mist mt-6">
        {formatDate(post.published_at) && <span>{formatDate(post.published_at)}</span>}
        {post.categories?.name && <span>{post.categories.name}</span>}
        {post.reading_time_minutes && <span>{post.reading_time_minutes} min de lecture</span>}
      </div>

      <h1 className="font-display font-bold text-3xl mt-3">{post.title}</h1>

      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full rounded-lg mt-8 border border-surface"
        />
      )}

      <div className="font-body text-bone leading-relaxed mt-8 whitespace-pre-wrap">
        {post.content}
      </div>

      {relatedPosts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-surface">
          <h2 className="font-display font-bold text-xl">Articles liés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {relatedPosts.map((related) => (
              <PostCard key={related.id} post={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogDetail