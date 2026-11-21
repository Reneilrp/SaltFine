import { useCallback, useEffect, useState } from 'react'

// Minimal tab routing through the URL hash (#/live, #/records, #/reports)
export function useHashRoute(validIds: string[], fallback: string): [string, (id: string) => void] {
  const read = useCallback(() => {
    const id = window.location.hash.replace(/^#\/?/, '')
    return validIds.includes(id) ? id : fallback
  }, [validIds, fallback])

  const [route, setRoute] = useState<string>(read)

  useEffect(() => {
    const onHashChange = () => setRoute(read())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [read])

  const navigate = useCallback((id: string) => {
    window.location.hash = `/${id}`
  }, [])

  return [route, navigate]
}
