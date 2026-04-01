import { cn } from '@/lib/utils'

interface GlassEffectLayersProps {
  isChatbotOpen?: boolean
  isProjectsVisible?: boolean
}

const GlassEffectLayers = ({ isChatbotOpen = false, isProjectsVisible = false }: GlassEffectLayersProps) => (
  <div
    className={cn(
      'glass-effect absolute inset-0 z-10 overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-500',
      isChatbotOpen && 'bg-secondary/50 backdrop-blur-3xl',
      isProjectsVisible && !isChatbotOpen && 'bg-secondary/80',
    )}
  />
)

export default GlassEffectLayers
