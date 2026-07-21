import { useState } from 'react'
import { subscribeToNewsletter } from '../../lib/newsletter'
import { validateEmail } from '../../lib/validation'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    const validationError = validateEmail(email)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    try {
      await subscribeToNewsletter(email)
      setIsSubscribed(true)
      setEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className="bg-surface rounded-lg p-6 border border-signal">
        <p className="font-mono text-sm text-signal">
          Inscription confirmee. Merci !
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg p-6">
      <p className="font-display font-bold text-lg text-bone">
        Recevoir les prochains articles
      </p>
      <p className="font-body text-sm text-mist mt-1">
        Un email occasionnel, pas de spam.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          disabled={isSubmitting}
          className="flex-1 bg-ink border border-surface rounded px-3 py-2 text-bone focus:outline-none focus:border-signal disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="font-mono text-sm bg-signal text-ink rounded px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
        >
          {isSubmitting ? 'Envoi...' : "S'inscrire"}
        </button>
      </form>

      {error && (
        <p className="font-mono text-xs text-ember mt-2">{error}</p>
      )}
    </div>
  )
}

export default NewsletterForm