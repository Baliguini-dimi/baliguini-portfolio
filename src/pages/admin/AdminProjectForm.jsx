import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createProject,
  updateProject,
  getProjectById,
} from '../../lib/projects'
import { getAllCategories } from '../../lib/categories'
import { validateProjectForm } from '../../lib/validation'
import { slugify } from '../../lib/slugify'
import ImageUploadField from '../../components/admin/ImageUploadField'
import ProjectGalleryField from '../../components/admin/ProjectGalleryField'   // <-- import ajouté
import { generateProjectDescription } from '../../lib/generateDescription'

const emptyForm = {
  slug: '',
  title: '',
  short_description: '',
  full_description: '',
  category_id: '',
  client_name: '',
  completion_date: '',
  tech_stack: '',
  cover_image_url: '',
  github_url: '',
  live_url: '',
  status: 'draft',
  featured: false,
  display_order: 0,
}

function AdminProjectForm() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    getAllCategories().then(setCategories).catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    if (!isEditMode) return

    getProjectById(id)
      .then((project) => {
        setForm({
          slug: project.slug ?? '',
          title: project.title ?? '',
          short_description: project.short_description ?? '',
          full_description: project.full_description ?? '',
          category_id: project.category_id ?? '',
          client_name: project.client_name ?? '',
          completion_date: project.completion_date ?? '',
          tech_stack: (project.tech_stack ?? []).join(', '),
          cover_image_url: project.cover_image_url ?? '',
          github_url: project.github_url ?? '',
          live_url: project.live_url ?? '',
          status: project.status ?? 'draft',
          featured: project.featured ?? false,
          display_order: project.display_order ?? 0,
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

  async function handleGenerateDescription() {
    if (!form.title.trim()) {
      setError('Renseigne au moins le titre avant de generer une description.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const techArray = form.tech_stack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      const description = await generateProjectDescription(form.title, techArray)
      updateField('short_description', description)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    const validationErrors = validateProjectForm(form)
    setFieldErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setError('Merci de corriger les champs indiqués ci-dessous avant d\'enregistrer.')
      return
    }

    setIsSaving(true)

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      short_description: form.short_description.trim(),
      full_description: form.full_description.trim() || null,
      category_id: form.category_id || null,
      client_name: form.client_name.trim() || null,
      completion_date: form.completion_date || null,
      tech_stack: form.tech_stack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      cover_image_url: form.cover_image_url.trim() || null,
      github_url: form.github_url.trim() || null,
      live_url: form.live_url.trim() || null,
      status: form.status,
      featured: form.featured,
      display_order: Number(form.display_order) || 0,
    }

    try {
      if (isEditMode) {
        await updateProject(id, payload)
      } else {
        await createProject(payload)
      }
      navigate('/admin/projets', { replace: true })
    } catch (err) {
      setError(err.message)
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24">
        <p className="font-mono text-mist text-sm">Chargement...</p>
      </div>
    )
  }

  const inputClass =
    'w-full bg-surface border border-surface rounded px-3 py-2 text-bone focus:outline-none focus:border-signal'
  const labelClass = 'font-mono text-xs text-mist block mb-1'

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <h1 className="font-display font-bold text-3xl">
        {isEditMode ? 'Modifier le projet' : 'Nouveau projet'}
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
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="short_description" className={labelClass}>Description courte *</label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              className="font-mono text-xs text-signal hover:opacity-80 disabled:opacity-50"
            >
              {isGenerating ? 'Generation...' : 'Generer avec IA'}
            </button>
          </div>
          <input
            id="short_description"
            required
            value={form.short_description}
            onChange={(e) => updateField('short_description', e.target.value)}
            className={inputClass}
          />
          {fieldErrors.short_description && (
            <p className="font-mono text-xs text-ember mt-1">{fieldErrors.short_description}</p>
          )}
        </div>

        <div>
          <label htmlFor="full_description" className={labelClass}>Description complète</label>
          <textarea
            id="full_description"
            rows={5}
            value={form.full_description}
            onChange={(e) => updateField('full_description', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="category_id" className={labelClass}>Catégorie</label>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="client_name" className={labelClass}>Client</label>
            <input
              id="client_name"
              value={form.client_name}
              onChange={(e) => updateField('client_name', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="completion_date" className={labelClass}>Date de réalisation</label>
            <input
              id="completion_date"
              type="date"
              value={form.completion_date}
              onChange={(e) => updateField('completion_date', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="tech_stack" className={labelClass}>Stack technique (séparée par des virgules)</label>
          <input
            id="tech_stack"
            value={form.tech_stack}
            onChange={(e) => updateField('tech_stack', e.target.value)}
            placeholder="React, Node.js, Supabase"
            className={inputClass}
          />
        </div>

        <ImageUploadField
          label="Image de couverture"
          value={form.cover_image_url}
          onChange={(url) => updateField('cover_image_url', url)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="github_url" className={labelClass}>Lien GitHub</label>
            <input
              id="github_url"
              value={form.github_url}
              onChange={(e) => updateField('github_url', e.target.value)}
              className={inputClass}
            />
            {fieldErrors.github_url && (
              <p className="font-mono text-xs text-ember mt-1">{fieldErrors.github_url}</p>
            )}
          </div>
          <div>
            <label htmlFor="live_url" className={labelClass}>Lien démo live</label>
            <input
              id="live_url"
              value={form.live_url}
              onChange={(e) => updateField('live_url', e.target.value)}
              className={inputClass}
            />
            {fieldErrors.live_url && (
              <p className="font-mono text-xs text-ember mt-1">{fieldErrors.live_url}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className={labelClass}>Statut</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
              className={inputClass}
            >
              <option value="draft">Brouillon</option>
              <option value="online">En ligne</option>
              <option value="in_progress">En cours</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
          <div>
            <label htmlFor="display_order" className={labelClass}>Ordre d'affichage</label>
            <input
              id="display_order"
              type="number"
              value={form.display_order}
              onChange={(e) => updateField('display_order', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Composant Gallery – affiché uniquement en mode édition (car il nécessite un projet existant) */}
        <ProjectGalleryField projectId={isEditMode ? id : null} />

        <label className="flex items-center gap-2 font-mono text-sm text-mist">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => updateField('featured', e.target.checked)}
          />
          Mettre en avant sur la page d'accueil
        </label>

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
            onClick={() => navigate('/admin/projets')}
            className="font-mono text-sm text-mist hover:text-bone transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProjectForm