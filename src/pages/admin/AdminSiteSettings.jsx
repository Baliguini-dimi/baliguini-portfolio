import { useEffect, useState } from 'react'
import { getSiteSettings, updateSiteSettings } from '../../lib/siteSettings'
import ImageUploadField from '../../components/admin/ImageUploadField'
import DocumentUploadField from '../../components/admin/DocumentUploadField'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

function AdminSiteSettings() {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  function updateField(field, value) {
    setSettings((current) => ({ ...current, [field]: value }))
    setSuccessMessage(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSaving(true)

    const { id, updated_at, ...payload } = settings

    try {
      const updated = await updateSiteSettings(id, payload)
      setSettings(updated)
      setSuccessMessage('Reglages enregistres avec succes.')
    } catch (err) {
      setError(err.message)
    } finally {
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

  if (!settings) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24">
        <p className="font-mono text-sm text-ember">{error}</p>
      </div>
    )
  }

  const inputClass =
    'w-full bg-surface border border-surface rounded px-3 py-2 text-bone focus:outline-none focus:border-signal'
  const labelClass = 'font-mono text-xs text-mist block mb-1'

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <AdminPageHeader title="Reglages du site" />

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <div className="pt-2">
          <h2 className="font-display font-bold text-lg text-mist">Hero</h2>
        </div>

        <ImageUploadField
          label="Photo de profil"
          value={settings.hero_photo_url}
          onChange={(url) => updateField('hero_photo_url', url)}
        />

        <div>
          <label htmlFor="hero_title" className={labelClass}>Titre professionnel</label>
          <input
            id="hero_title"
            required
            value={settings.hero_title}
            onChange={(e) => updateField('hero_title', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="hero_bio" className={labelClass}>Accroche courte</label>
          <textarea
            id="hero_bio"
            required
            rows={3}
            value={settings.hero_bio}
            onChange={(e) => updateField('hero_bio', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="tech_count_label" className={labelClass}>
            Technologies maitrisees (ex: 5+)
          </label>
          <input
            id="tech_count_label"
            value={settings.tech_count_label}
            onChange={(e) => updateField('tech_count_label', e.target.value)}
            className={inputClass}
          />
          <p className="font-mono text-xs text-mist/60 mt-1">
            Le nombre de projets deployes est calcule automatiquement, non modifiable ici.
          </p>
        </div>

        <div className="pt-4 border-t border-surface">
          <h2 className="font-display font-bold text-lg text-mist">A propos</h2>
        </div>

        <div>
          <label htmlFor="about_text" className={labelClass}>Texte complet</label>
          <textarea
            id="about_text"
            required
            rows={6}
            value={settings.about_text}
            onChange={(e) => updateField('about_text', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Nouvelle section Documents */}
        <div className="pt-4 border-t border-surface">
          <h2 className="font-display font-bold text-lg text-mist">Documents</h2>
        </div>

        <DocumentUploadField
          label="CV (PDF)"
          value={settings.cv_url}
          onChange={(url) => updateField('cv_url', url)}
          accept="application/pdf"
          hint="Format PDF uniquement — 20 Mo maximum."
        />

        <DocumentUploadField
          label="Diplomes (ZIP)"
          value={settings.diplomas_zip_url}
          onChange={(url) => updateField('diplomas_zip_url', url)}
          accept="application/zip"
          hint="Fichier ZIP regroupant tous les diplomes — 20 Mo maximum."
        />

        <div className="pt-4 border-t border-surface">
          <h2 className="font-display font-bold text-lg text-mist">Contact</h2>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email"
            type="email"
            value={settings.email ?? ''}
            onChange={(e) => updateField('email', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>Telephone (format international, ex: +2250779917447)</label>
          <input
            id="phone"
            value={settings.phone ?? ''}
            onChange={(e) => updateField('phone', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="whatsapp_url" className={labelClass}>Lien WhatsApp</label>
          <input
            id="whatsapp_url"
            value={settings.whatsapp_url ?? ''}
            onChange={(e) => updateField('whatsapp_url', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="github_url" className={labelClass}>GitHub</label>
          <input
            id="github_url"
            value={settings.github_url ?? ''}
            onChange={(e) => updateField('github_url', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="linkedin_url" className={labelClass}>LinkedIn</label>
          <input
            id="linkedin_url"
            value={settings.linkedin_url ?? ''}
            onChange={(e) => updateField('linkedin_url', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="instagram_url" className={labelClass}>Instagram</label>
          <input
            id="instagram_url"
            value={settings.instagram_url ?? ''}
            onChange={(e) => updateField('instagram_url', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="x_url" className={labelClass}>X (Twitter)</label>
          <input
            id="x_url"
            value={settings.x_url ?? ''}
            onChange={(e) => updateField('x_url', e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="font-mono text-sm text-ember">{error}</p>
        )}

        {successMessage && (
          <p className="font-mono text-sm text-signal">{successMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="font-mono text-sm bg-signal text-ink rounded px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50 self-start"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}

export default AdminSiteSettings