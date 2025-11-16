import { cn } from '@/lib/utils'

interface GlassEffectLayersProps {
  isChatbotOpen?: boolean
}

const GlassEffectLayers = ({ isChatbotOpen = false }: GlassEffectLayersProps) => (
  <>
    <div
      className={cn(
        'glass-effect bg-secondary/70 absolute inset-0 z-10 overflow-hidden rounded-2xl backdrop-blur-sm',
        isChatbotOpen && 'bg-secondary/90 backdrop-blur-lg',
      )}
    />
  </>
)

export default GlassEffectLayers
