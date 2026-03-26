import { createPortal } from 'react-dom'
import React, {
  type ReactNode,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CheckCircle2, Info, type LucideIcon, AlertCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Glass from '@/components/ui/glass/Glass'

type ToastVariant = 'default' | 'success' | 'error' | 'info'

type ToastAnimation = 'slide-from-right' | 'slide-from-left' | 'slide-from-bottom' | 'scale'

type ToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'

export type ToastDefinition = {
  id?: string
  title?: ReactNode
  description?: ReactNode
  variant?: ToastVariant
  duration?: number
  animation?: ToastAnimation
  position?: ToastPosition
  /**
   * Kept for API compatibility with the source component.
   * The Tailwind port intentionally does not replicate the Glass/ripple effect.
   */
  enableLiquidAnimation?: boolean
  onClose?: () => void
}

type ToastRecord = ToastDefinition & {
  id: string
  createdAt: number
  dismissed: boolean
  duration: number
  animation: ToastAnimation
  position: ToastPosition
  variant: ToastVariant
  enableLiquidAnimation: boolean
}

export type ToastProviderProps = PropsWithChildren<{
  duration?: number
  animation?: ToastAnimation
  position?: ToastPosition
  enableLiquidAnimation?: boolean
  portalContainer?: HTMLElement | null
}>

type ToastContextValue = {
  showToast: (toast: ToastDefinition) => string
  dismissToast: (id: string) => void
  clearToasts: () => void
}

const variantClassMap: Record<ToastVariant, string> = {
  default: 'border-white/25 text-white shadow-[0_18px_40px_rgba(15,23,42,0.32)]',
  success:
    'bg-emerald-500/15 text-emerald-50 shadow-[0_18px_40px_rgba(16,185,129,0.28)] glass',
  error: 'bg-rose-500/15 border-rose-400/40 text-rose-50 shadow-[0_18px_40px_rgba(244,63,94,0.30)]',
  info: 'bg-sky-500/15 border-sky-400/40 text-sky-50 shadow-[0_18px_40px_rgba(56,189,248,0.28)]',
}

const variantIconMap: Record<ToastVariant, LucideIcon> = {
  default: AlertCircle,
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const animationDurations: Record<ToastAnimation, number> = {
  'slide-from-right': 220,
  'slide-from-left': 220,
  'slide-from-bottom': 240,
  scale: 200,
}

const positionSorts: Record<ToastPosition, 'asc' | 'desc'> = {
  'top-right': 'desc',
  'top-left': 'desc',
  'top-center': 'desc',
  'bottom-right': 'asc',
  'bottom-left': 'asc',
  'bottom-center': 'asc',
}

const positionClassMap: Record<ToastPosition, string> = {
  'top-right': 'top-6 right-6 flex-col items-end',
  'top-left': 'top-6 left-6 flex-col items-start',
  'top-center': 'top-6 flex-col items-center left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-6 right-6 flex-col items-end',
  'bottom-left': 'bottom-6 left-6 flex-col items-start',
  'bottom-center': 'bottom-6 flex-col items-center left-1/2 -translate-x-1/2',
}

const getTransformClass = (animation: ToastAnimation, phase: 'initial' | 'enter' | 'exit'): string => {
  switch (animation) {
    case 'slide-from-right':
      return phase === 'enter' ? 'translate-x-0' : 'translate-x-6'
    case 'slide-from-left':
      return phase === 'enter' ? 'translate-x-0' : '-translate-x-6'
    case 'slide-from-bottom':
      return phase === 'enter' ? 'translate-y-0' : 'translate-y-6'
    case 'scale':
      if (phase === 'enter') return 'scale-100'
      if (phase === 'exit') return 'scale-90'
      return 'scale-95'
  }
  // Should be unreachable because `animation` is a closed union.
  return phase === 'enter' ? 'translate-x-0' : 'translate-x-6'
}

const ToastContext = createContext<ToastContextValue | null>(null)

const generateToastId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

const ToastCard: React.FC<{
  toast: ToastRecord
  onRemove: (id: string) => void
}> = ({ toast, onRemove }) => {
  const Icon = variantIconMap[toast.variant]
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [phase, setPhase] = useState<'initial' | 'enter' | 'exit'>(() =>
    prefersReducedMotion ? 'enter' : 'initial',
  )
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closed = useRef(false)

  const opacityClass = phase === 'enter' ? 'opacity-100' : 'opacity-0'
  const transformClass = getTransformClass(toast.animation, phase)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setPrefersReducedMotion(mql.matches)
    handleChange()

    if (typeof mql.addEventListener === 'function') mql.addEventListener('change', handleChange)
    else mql.addListener(handleChange)

    return () => {
      if (typeof mql.removeEventListener === 'function') mql.removeEventListener('change', handleChange)
      else mql.removeListener(handleChange)
    }
  }, [])

  useEffect(() => {
    // If reduced motion is enabled, skip entrance animation to avoid a “flash”.
    if (prefersReducedMotion) setPhase('enter')
    else {
      const frame = requestAnimationFrame(() => setPhase('enter'))
      return () => cancelAnimationFrame(frame)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (toast.duration === Infinity) return

    closeTimer.current = setTimeout(() => setPhase('exit'), toast.duration)
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [toast.duration])

  useEffect(() => {
    if (!toast.dismissed) return
    setPhase('exit')
  }, [toast.dismissed])

  useEffect(() => {
    if (phase !== 'exit') return

    if (!closed.current) {
      closed.current = true
      toast.onClose?.()
    }

    const removeDelayMs = prefersReducedMotion ? 0 : animationDurations[toast.animation]

    removeTimer.current = setTimeout(() => {
      onRemove(toast.id)
    }, removeDelayMs)

    return () => {
      if (removeTimer.current) clearTimeout(removeTimer.current)
    }
  }, [onRemove, phase, toast.id, toast.animation, toast.onClose, prefersReducedMotion])

  return (
    <Glass
      role="status"
      aria-live="polite"
      enableLiquidAnimation={toast.enableLiquidAnimation}
      triggerAnimation={phase === 'enter'}
      rootClassName={cn(
        // Card base (applied to the glass container)
        'pointer-events-auto w-full transition-all duration-200 ease-out will-change-transform rounded-lg glass-effect backdrop-blur-xl`',
        variantClassMap[toast.variant],
        opacityClass,
        transformClass,
      )}
    >
      <div className="relative p-3 pr-8">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-5 w-5 items-center justify-center shrink-0 text-current" aria-hidden="true">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            {toast.title && <p className="text-base font-semibold leading-tight">{toast.title}</p>}
            {toast.description && <p className="text-sm leading-snug text-current/80">{toast.description}</p>}
          </div>

          <button
            type="button"
            aria-label="Dismiss toast"
            className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full border border-white/25 bg-white/10 text-sm font-medium text-white transition duration-150 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            onClick={() => setPhase('exit')}
          >
            ×
          </button>
        </div>
      </div>
    </Glass>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  duration = 4000,
  animation = 'slide-from-right',
  position = 'top-right',
  enableLiquidAnimation = true,
  portalContainer,
}) => {
  const [toasts, setToasts] = useState<ToastRecord[]>([])
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (portalContainer) {
      setPortalNode(portalContainer)
      return
    }
    if (typeof document !== 'undefined') setPortalNode(document.body)
  }, [portalContainer])

  const showToast = useCallback(
    (toast: ToastDefinition) => {
      const id = toast.id ?? generateToastId()
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: toast.title,
          description: toast.description,
          variant: toast.variant ?? 'default',
          duration: toast.duration ?? duration,
          animation: toast.animation ?? animation,
          position: toast.position ?? position,
          enableLiquidAnimation: toast.enableLiquidAnimation ?? enableLiquidAnimation,
          onClose: toast.onClose,
          createdAt: Date.now(),
          dismissed: false,
        },
      ])
      return id
    },
    [animation, duration, enableLiquidAnimation, position],
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, dismissed: true } : t)))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts((prev) => prev.map((t) => ({ ...t, dismissed: true })))
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      showToast,
      dismissToast,
      clearToasts,
    }),
    [clearToasts, dismissToast, showToast],
  )

  const toastsByPosition = useMemo(() => {
    const initial: Record<ToastPosition, ToastRecord[]> = {
      'top-left': [],
      'top-right': [],
      'top-center': [],
      'bottom-left': [],
      'bottom-right': [],
      'bottom-center': [],
    }

    return toasts.reduce<Record<ToastPosition, ToastRecord[]>>((acc, toastRecord) => {
      acc[toastRecord.position] ??= []
      acc[toastRecord.position].push(toastRecord)
      return acc
    }, initial)
  }, [toasts])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portalNode &&
        createPortal(
          <>
            {(Object.entries(toastsByPosition) as [ToastPosition, ToastRecord[]][]).map(([toastPosition, items]) => {
              if (!items.length) return null

              const ordered =
                positionSorts[toastPosition] === 'desc'
                  ? [...items].sort((a, b) => b.createdAt - a.createdAt)
                  : [...items].sort((a, b) => a.createdAt - b.createdAt)

              return (
                <div
                  key={toastPosition}
                  className={cn('pointer-events-none fixed z-1100 flex w-fullmax-w-lg gap-3', positionClassMap[toastPosition])}
                >
                  {ordered.map((toast) => (
                    <ToastCard key={toast.id} toast={toast} onRemove={removeToast} />
                  ))}
                </div>
              )
            })}
          </>,
          portalNode,
        )}
    </ToastContext.Provider>
  )
}

