import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import {
  getTotalVisitors,
  getPageViewsByType,
  getTopProjects,
  getTopPosts,
  getAverageReadingTime,
} from '../../lib/analyticsStats'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

const pageTypeLabels = {
  home: 'Accueil',
  projects_list: 'Liste projets',
  project_detail: 'Detail projet',
  blog_list: 'Liste blog',
  blog_detail: 'Detail article',
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes === 0) return `${remainingSeconds}s`
  return `${minutes}min ${remainingSeconds}s`
}

function AdminAnalytics() {
  const [visitors, setVisitors] = useState(null)
  const [viewsByType, setViewsByType] = useState({})
  const [topProjects, setTopProjects] = useState([])
  const [topPosts, setTopPosts] = useState([])
  const [readingTimes, setReadingTimes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      getTotalVisitors(30),
      getPageViewsByType(30),
      getTopProjects(30),
      getTopPosts(30),
      getAverageReadingTime(30),
    ])
      .then(([v, byType, projects, posts, reading]) => {
        setVisitors(v)
        setViewsByType(byType)
        setTopProjects(projects)
        setTopPosts(posts)
        setReadingTimes(reading)
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24">
        <p className="font-mono text-mist text-sm">Chargement des statistiques...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24">
        <p className="font-mono text-sm text-ember">{error}</p>
      </div>
    )
  }

  const chartData = Object.entries(viewsByType).map(([type, count]) => ({
    name: pageTypeLabels[type] ?? type,
    vues: count,
  }))

  const totalViews = Object.values(viewsByType).reduce((sum, n) => sum + n, 0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <AdminPageHeader title="Statistiques" description="30 derniers jours" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <div className="bg-surface rounded-lg p-6">
          <p className="font-mono text-xs text-mist">Visiteurs uniques</p>
          <p className="font-display font-bold text-3xl text-signal mt-2">{visitors}</p>
        </div>
        <div className="bg-surface rounded-lg p-6">
          <p className="font-mono text-xs text-mist">Pages vues au total</p>
          <p className="font-display font-bold text-3xl text-signal mt-2">{totalViews}</p>
        </div>
      </div>

      <div className="bg-surface rounded-lg p-6 mt-6">
        <p className="font-mono text-xs text-mist mb-4">Vues par type de page</p>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: '#8FA3AE', fontSize: 12 }} />
              <YAxis tick={{ fill: '#8FA3AE', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#16303F', border: 'none', borderRadius: '4px' }}
                labelStyle={{ color: '#F5F7F8' }}
              />
              <Bar dataKey="vues" fill="#2E8B84" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="font-mono text-mist text-sm">Pas encore de donnees.</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div className="bg-surface rounded-lg p-6">
          <p className="font-mono text-xs text-mist mb-4">Projets les plus vus</p>
          {topProjects.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {topProjects.map((item) => (
                <li key={item.slug} className="flex items-center justify-between font-body text-sm">
                  <span className="text-bone">{item.slug}</span>
                  <span className="font-mono text-xs text-signal">{item.views} vues</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-mist text-sm">Pas encore de donnees.</p>
          )}
        </div>

        <div className="bg-surface rounded-lg p-6">
          <p className="font-mono text-xs text-mist mb-4">Articles les plus lus</p>
          {topPosts.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {topPosts.map((item) => (
                <li key={item.slug} className="flex items-center justify-between font-body text-sm">
                  <span className="text-bone">{item.slug}</span>
                  <span className="font-mono text-xs text-signal">{item.views} vues</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-mist text-sm">Pas encore de donnees.</p>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-lg p-6 mt-6">
        <p className="font-mono text-xs text-mist mb-4">Temps de lecture moyen par article</p>
        {readingTimes.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {readingTimes.map((item) => (
              <li key={item.slug} className="flex items-center justify-between font-body text-sm">
                <span className="text-bone">{item.slug}</span>
                <span className="font-mono text-xs text-signal">
                  {formatDuration(item.averageSeconds)} ({item.sampleCount} lectures)
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-mono text-mist text-sm">Pas encore de donnees.</p>
        )}
      </div>
    </div>
  )
}

export default AdminAnalytics