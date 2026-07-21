import { useEffect, useRef } from 'react'
import { trackReadingTime } from '../lib/analytics'
import { useAuth } from '../context/AuthContext'

export function useReadingTime(postSlug) {
  const { isAuthenticated, isLoading } = useAuth()
  const startTimeRef = useRef(null)

  useEffect(() => {
    if (isLoading || isAuthenticated || !postSlug) return

    startTimeRef.current = Date.now()

    return () => {
      const secondsSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
      trackReadingTime(postSlug, secondsSpent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, postSlug])
}