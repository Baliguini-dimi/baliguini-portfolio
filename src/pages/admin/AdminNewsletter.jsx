import { useEffect, useState } from 'react'
import { getAllSubscribers, deleteSubscriber } from '../../lib/newsletter'
import { formatDate } from '../../lib/formatDate'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

function exportToCsv(subscribers) {
  const header = 'email,date_inscription\n'
  const rows = subscribers
    .map((s) => `${s.email},${new Date(s.created_at).toISOString()}`)
    .join('\n')

  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `newsletter-inscrits-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  function loadSubscribers() {
    setIsLoading(true)
    getAllSubscribers()
      .then(setSubscribers)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadSubscribers()
  }, [])

  async function handleDelete(subscriber) {
    const confirmed = window.confirm(`Retirer ${subscriber.email} de la liste ?`)
    if (!confirmed) return

    setDeletingId(subscriber.id)
    try {
      await deleteSubscriber(subscriber.id)
      setSubscribers((current) => current.filter((s) => s.id !== subscriber.id))
    } catch (err) {
      window.alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <AdminPageHeader
        title="Newsletter"
        description={`${subscribers.length} inscrit${subscribers.length > 1 ? 's' : ''}`}
        action={
          subscribers.length > 0 && (
            <button
              type="button"
              onClick={() => exportToCsv(subscribers)}
              className="font-mono text-sm bg-signal text-ink rounded px-4 py-2 hover:opacity-90 transition-opacity"
            >
              Exporter en CSV
            </button>
          )
        }
      />

      {error && (
        <p className="font-mono text-sm text-ember mt-6">{error}</p>
      )}

      {isLoading && !error && (
        <p className="font-mono text-mist text-sm mt-6">Chargement...</p>
      )}

      {!isLoading && !error && (
        <div className="mt-8 flex flex-col gap-2">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="flex items-center justify-between gap-4 bg-surface rounded px-4 py-3"
            >
              <div>
                <p className="font-body text-bone">{subscriber.email}</p>
                <p className="font-mono text-xs text-mist mt-1">
                  Inscrit le {formatDate(subscriber.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(subscriber)}
                disabled={deletingId === subscriber.id}
                className="font-mono text-xs text-ember hover:opacity-80 disabled:opacity-50 shrink-0"
              >
                {deletingId === subscriber.id ? 'Suppression...' : 'Retirer'}
              </button>
            </div>
          ))}

          {subscribers.length === 0 && (
            <p className="font-mono text-mist text-sm">Aucun inscrit pour l'instant.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminNewsletter