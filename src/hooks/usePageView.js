import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'
import { useAuth } from '../context/AuthContext'

export function usePageView(pageType, referenceSlug = null) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading || isAuthenticated) return
    trackPageView(pageType, location.pathname, referenceSlug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, location.pathname, referenceSlug])
}