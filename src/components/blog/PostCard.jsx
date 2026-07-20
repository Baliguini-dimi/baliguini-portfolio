import { Link } from 'react-router-dom'
import { formatDate } from '../../lib/formatDate'

function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="block bg-surface rounded-lg overflow-hidden border border-surface hover:border-signal transition-colors"
    >
      <div className="aspect-video bg-ink flex items-center justify-center">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-mono text-mist text-xs">Pas d'image</span>
        )}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-mist">
          {post.categories?.name && <span>{post.categories.name}</span>}
          {formatDate(post.published_at) && <span>{formatDate(post.published_at)}</span>}
          {post.reading_time_minutes && <span>{post.reading_time_minutes} min de lecture</span>}
        </div>

        <h3 className="font-display font-bold text-lg text-bone mt-3">{post.title}</h3>

        <p className="font-body text-sm text-mist mt-2 line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Link>
  )
}

export default PostCard