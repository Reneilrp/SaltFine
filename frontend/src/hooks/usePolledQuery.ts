import { useEffect, useRef, useState } from 'react'

export interface QueryState<T> {
  data: T | undefined
  loading: boolean
  error: Error | unknown | null
}

export function usePolledQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  { intervalMs = 0, signature }: { intervalMs?: number; signature?: (data: T) => string | number } = {},
): QueryState<T> {
  const [state, setState] = useState<QueryState<T>>({ data: undefined, loading: true, error: null })
  const fetcherRef = useRef(fetcher)
  const signatureRef = useRef(signature)

  useEffect(() => {
    fetcherRef.current = fetcher
    signatureRef.current = signature
  })

  useEffect(() => {
    let cancelled = false
    let lastSignature: unknown = Symbol('none')

    setState((previous) => ({ ...previous, loading: true }))

    async function run() {
      try {
        const data = await fetcherRef.current()
        if (cancelled) return
        const next = signatureRef.current ? signatureRef.current(data) : Symbol('always-new')
        if (next === lastSignature) return
        lastSignature = next
        setState({ data, loading: false, error: null })
      } catch (error) {
        if (!cancelled) setState((previous) => ({ ...previous, loading: false, error }))
      }
    }

    run()
    const id = intervalMs ? setInterval(run, intervalMs) : null

    return () => {
      cancelled = true
      if (id) clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, intervalMs])

  return state
}
