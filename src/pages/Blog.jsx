import { useEffect, useState } from 'react'
import { getAllPosts } from '../lib/posts'
import PostCard from '../components/blog/PostCard'
import SEO from '../components/seo/SEO'
import { usePageView } from '../hooks/usePageView'   // <-- import ajouté

function Blog() {
  const [posts, setPosts] = useState([])
  const [loadError, setLoadError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  usePageView('blog_list')   // <-- appel ajouté

  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <SEO
        title="Blog"
        description="Articles techniques et retours d'expérience sur le développement web et mobile."
        url="/blog"
      />

      <h1 className="font-display font-bold text-3xl">Blog</h1>

      {loadError && (
        <p className="font-mono text-sm text-ember mt-4">{loadError}</p>
      )}

      {isLoading && !loadError && (
        <p className="font-mono text-mist text-sm mt-8">Chargement...</p>
      )}

      {!isLoading && !loadError && posts.length === 0 && (
        <p className="font-mono text-mist text-sm mt-8">
          Aucun article publié pour le moment.
        </p>
      )}

      {!loadError && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Blog