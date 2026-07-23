import { useEffect, useState } from 'react'
import { getProjectImages, addProjectImage, deleteProjectImage } from '../../lib/projectImages'
import { uploadProjectImage } from '../../lib/uploadImage'

const MAX_IMAGES = 4

function ProjectGalleryField({ projectId }) {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  function loadImages() {
    getProjectImages(projectId)
      .then(setImages)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (projectId) loadImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      const publicUrl = await uploadProjectImage(file)
      await addProjectImage(projectId, publicUrl)
      loadImages()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  async function handleDelete(imageId) {
    try {
      await deleteProjectImage(imageId)
      setImages((current) => current.filter((img) => img.id !== imageId))
    } catch (err) {
      window.alert(err.message)
    }
  }

  if (!projectId) {
    return (
      <div>
        <p className="font-mono text-xs text-mist block mb-1">Galerie d'images</p>
        <p className="font-mono text-xs text-mist/60">
          Enregistre d'abord le projet une premiere fois pour pouvoir ajouter des images de galerie.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="font-mono text-xs text-mist block mb-1">
        Galerie d'images ({images.length}/{MAX_IMAGES})
      </p>

      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <img
                src={image.image_url}
                alt=""
                className="w-full h-24 object-cover rounded border border-surface"
              />
              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                className="absolute top-1 right-1 bg-ink/80 text-ember text-xs font-mono rounded px-1.5 py-0.5 hover:bg-ink"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < MAX_IMAGES && (
        <div className="mt-3">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="font-mono text-xs text-mist file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-surface file:bg-surface file:text-bone file:font-mono file:text-xs hover:file:border-signal file:cursor-pointer disabled:opacity-50"
          />
          {isUploading && (
            <p className="font-mono text-xs text-mist mt-2">Envoi en cours...</p>
          )}
        </div>
      )}

      {error && (
        <p className="font-mono text-xs text-ember mt-2">{error}</p>
      )}
    </div>
  )
}

export default ProjectGalleryField