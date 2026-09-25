import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { loadBackbone, type BackboneStore } from './backbone'

type BackboneState = {
  status: 'loading' | 'ready' | 'error'
  store: BackboneStore | null
  error: string | null
}

const BackboneContext = createContext<BackboneState>({
  status: 'loading',
  store: null,
  error: null,
})

export function BackboneProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BackboneState>({
    status: 'loading',
    store: null,
    error: null,
  })

  useEffect(() => {
    let active = true
    loadBackbone()
      .then((store) => {
        if (active) setState({ status: 'ready', store, error: null })
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: 'error',
            store: null,
            error: error instanceof Error ? error.message : 'Unable to load prototype data.',
          })
        }
      })
    return () => { active = false }
  }, [])

  return <BackboneContext.Provider value={state}>{children}</BackboneContext.Provider>
}

export function useBackbone() {
  return useContext(BackboneContext)
}
