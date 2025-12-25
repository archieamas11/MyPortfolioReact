import { cn } from '@/lib/utils'

interface GlassEffectLayersProps {
  isChatbotOpen?: boolean
  isProjectsVisible?: boolean
}

const GlassEffectLayers = ({ isChatbotOpen = false, isProjectsVisible = false }: GlassEffectLayersProps) => (
  <>
    <div
      className={cn(
        'glass-effect absolute inset-0 z-10 overflow-hidden rounded-2xl backdrop-blur-3xl transition-all duration-500',
        isChatbotOpen && 'bg-secondary/90 backdrop-blur-lg',
        isProjectsVisible && !isChatbotOpen && 'bg-secondary/80',
      )}
    />
  </>
)

export default GlassEffectLayers
