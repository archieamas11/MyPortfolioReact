import { useSyncExternalStore } from 'react'

const PROJECTS_ID = 'projects'

function getSnapshot(): Element | null {
  if (typeof document === 'undefined') return null
  return document.getElementById(PROJECTS_ID)
}

function getServerSnapshot(): null {
  return null
}

/**
 * Subscribe to DOM readiness so we re-check when the projects element may have mounted.
 * The element is rendered by a sibling component, so it may not exist on first render.
 */
function subscribe(callback: () => void): () => void {
  if (typeof document === 'undefined') return () => {}

  if (document.readyState !== 'loading') {
    requestAnimationFrame(callback)
    return () => {}
  }

  const onReady = () => {
    requestAnimationFrame(callback)
  }
  document.addEventListener('DOMContentLoaded', onReady)
  return () => document.removeEventListener('DOMContentLoaded', onReady)
}

/**
 * Returns the #projects DOM element without causing a mount flash.
 * Uses useSyncExternalStore to avoid the useEffect(setState, []) pattern
 * which triggers a re-render after paint and causes a visible flicker.
 */
export function useProjectsElement(): Element | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
