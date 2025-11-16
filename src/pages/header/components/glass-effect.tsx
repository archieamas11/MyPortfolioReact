import { cn } from '@/lib/utils'

interface GlassEffectLayersProps {
  isChatbotOpen?: boolean
}

const GlassEffectLayers = ({ isChatbotOpen = false }: GlassEffectLayersProps) => (
  <>
    <div
      className={cn(
        'glass-effect absolute inset-0 z-10 overflow-hidden rounded-2xl backdrop-blur-lg',
        isChatbotOpen && 'bg-secondary/50 backdrop-blur-lg',
      )}
    />
  </>
)

export default GlassEffectLayers
