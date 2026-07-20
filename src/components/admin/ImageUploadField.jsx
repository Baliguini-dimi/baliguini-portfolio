import { useRef, useState } from 'react'
import { uploadProjectImage } from '../../lib/uploadImage'

function ImageUploadField({ label, value, onChange }) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      const publicUrl = await uploadProjectImage(file)
      onChange(publicUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  function handleRemove() {
    onChange('')
  }

  const labelClass = 'font-mono text-xs text-mist block mb-1'

  return (
    <div>
      <label className={labelClass}>{label}</label>

      {value ? (
        <div className="flex items-center gap-4">
          <img
            src={value}
            alt="Aperçu"
            className="w-24 h-24 object-cover rounded border border-surface"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="font-mono text-xs text-ember hover:opacity-80"
          >
            Retirer l'image
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
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

      <p className="font-mono text-xs text-mist/60 mt-2">
        JPEG, PNG ou WEBP — 5 Mo maximum.
      </p>
    </div>
  )
}

export default ImageUploadField