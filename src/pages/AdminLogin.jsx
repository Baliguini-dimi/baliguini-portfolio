import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { signIn } from '../lib/auth'
import { useAuth } from '../context/AuthContext'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!isLoading && isAuthenticated) {
    const redirectTo = location.state?.from ?? '/admin'
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await signIn(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink text-bone flex items-center justify-center">
      <div className="max-w-sm w-full px-6">
        <h1 className="font-display font-bold text-2xl">Connexion administrateur</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="font-mono text-xs text-mist block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-surface rounded px-3 py-2 text-bone focus:outline-none focus:border-signal"
            />
          </div>

          <div>
            <label htmlFor="password" className="font-mono text-xs text-mist block mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-surface rounded px-3 py-2 text-bone focus:outline-none focus:border-signal"
            />
          </div>

          {error && (
            <p className="font-mono text-sm text-ember">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="font-mono text-sm bg-signal text-ink rounded px-4 py-2 mt-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin