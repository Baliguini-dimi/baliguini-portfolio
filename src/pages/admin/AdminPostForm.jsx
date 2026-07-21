import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import {
  createPost,
  updatePost,
  getPostById,
} from '../../lib/posts'
import { getAllCategories } from '../../lib/projects'
import { validatePostForm } from '../../lib/validation'
import { slugify } from '../../lib/slugify'
import ImageUploadField from '../../components/admin/ImageUploadField'

const emptyForm = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  category_id: '',
  cover_image_url: '',
  reading_time_minutes: '',
  status: 'draft',
}

function estimateReadingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function AdminPostForm() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    getAllCategories().then(setCategories).catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    if (!isEditMode) return

    getPostById(id)
      .then((post) => {
        setForm({
          slug: post.slug ?? '',
          title: post.title ?? '',
          excerpt: post.excerpt ?? '',
          content: post.content ?? '',
          category_id: post.category_id ?? '',
          cover_image_url: post.cover_image_url ?? '',
          reading_time_minutes: post.reading_time_minutes ?? '',
          status: post.status ?? 'draft',
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [id, isEditMode])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleTitleChange(value) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: isEditMode ? current.slug : slugify(value),
    }))
  }

  function handleAutoReadingTime() {
    updateField('reading_time_minutes', String(estimateReadingTime(form.content)))
  }

  // ---- Ajout : effet avec debounce pour le temps de lecture automatique ----
  useEffect(() => {
    if (!form.content) return
    const timeout = setTimeout(() => {
      updateField('reading_time_minutes', String(estimateReadingTime(form.content)))
    }, 1000)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.content])

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    const validationErrors = validatePostForm(form)
    setFieldErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setError("Merci de corriger les champs indiques ci-dessous avant d'enregistrer.")
      return
    }

    setIsSaving(true)

    const isPublishing = form.status === 'published'

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      category_id: form.category_id || null,
      cover_image_url: form.cover_image_url.trim() || null,
      reading_time_minutes: form.reading_time_minutes
        ? Number(form.reading_time_minutes)
        : null,
      status: form.status,
      published_at: isPublishing ? new Date().toISOString() : null,
    }

    try {
      if (isEditMode) {
        await updatePost(id, payload)
      } else {
        await createPost(payload)
      }
      navigate('/admin/articles', { replace: true })
    } catch (err) {
      setError(err.message)
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <p className="font-mono text-mist text-sm">Chargement...</p>
      </div>
    )
  }

  const inputClass =
    'w-full bg-surface border border-surface rounded px-3 py-2 text-bone focus:outline-none focus:border-signal'
  const labelClass = 'font-mono text-xs text-mist block mb-1'

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="font-display font-bold text-3xl">
        {isEditMode ? "Modifier l'article" : 'Nouvel article'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="title" className={labelClass}>Titre *</label>
          <input
            id="title"
            required
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={inputClass}
          />
          {fieldErrors.title && (
            <p className="font-mono text-xs text-ember mt-1">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>Slug (URL) *</label>
          <input
            id="slug"
            required
            value={form.slug}
            onChange={(e) => updateField('slug', slugify(e.target.value))}
            className={inputClass}
          />
          {fieldErrors.slug && (
            <p className="font-mono text-xs text-ember mt-1">{fieldErrors.slug}</p>
          )}
        </div>

        <div>
          <label htmlFor="excerpt" className={labelClass}>Extrait *</label>
          <textarea
            id="excerpt"
            required
            rows={2}
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            className={inputClass}
          />
          {fieldErrors.excerpt && (
            <p className="font-mono text-xs text-ember mt-1">{fieldErrors.excerpt}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="content" className={labelClass}>Contenu (Markdown) *</label>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="font-mono text-xs text-signal hover:opacity-80"
            >
              {showPreview ? "Voir l'editeur" : 'Apercu'}
            </button>
          </div>

          {showPreview ? (
            <div className="bg-surface border border-surface rounded px-4 py-3 min-h-[16rem] prose-content">
              <ReactMarkdown>{form.content || '*Rien a previsualiser*'}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              id="content"
              required
              rows={16}
              value={form.content}
              onChange={(e) => updateField('content', e.target.value)}
              className={`${inputClass} font-mono text-sm`}
              placeholder="## Titre de section&#10;&#10;Texte en **gras**, en *italique*, ou une [liste de liens](https://exemple.com)."
            />
          )}
          {fieldErrors.content && (
            <p className="font-mono text-xs text-ember mt-1">{fieldErrors.content}</p>
          )}
        </div>

        <div>
          <label htmlFor="category_id" className={labelClass}>Categorie</label>
          <select
            id="category_id"
            value={form.category_id}
            onChange={(e) => updateField('category_id', e.target.value)}
            className={inputClass}
          >
            <option value="">— Aucune —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <ImageUploadField
          label="Image de couverture"
          value={form.cover_image_url}
          onChange={(url) => updateField('cover_image_url', url)}
        />

        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="reading_time_minutes" className={labelClass}>
              Temps de lecture (minutes)
            </label>
            <input
              id="reading_time_minutes"
              type="number"
              min="1"
              value={form.reading_time_minutes}
              onChange={(e) => updateField('reading_time_minutes', e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={handleAutoReadingTime}
            className="font-mono text-xs text-signal hover:opacity-80 pb-2"
          >
            Estimer depuis le contenu
          </button>
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>Statut</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => updateField('status', e.target.value)}
            className={inputClass}
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publie</option>
          </select>
          <p className="font-mono text-xs text-mist mt-1">
            Passer en "Publie" enregistre la date de publication a maintenant.
          </p>
        </div>

        {error && (
          <p className="font-mono text-sm text-ember">{error}</p>
        )}

        <div className="flex gap-4 mt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="font-mono text-sm bg-signal text-ink rounded px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="font-mono text-sm text-mist hover:text-bone transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminPostForm