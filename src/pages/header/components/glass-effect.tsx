import { GlassSurface } from "@/components/ui/glass-surface";

interface GlassEffectLayersProps {
  isChatbotOpen?: boolean;
  isProjectsVisible?: boolean;
}

const GlassEffectLayers = ({
  isChatbotOpen = false,
  isProjectsVisible = false,
}: GlassEffectLayersProps) => (
  <GlassSurface
    isChatbotOpen={isChatbotOpen}
    isProjectsVisible={isProjectsVisible}
    variant="overlay"
  />
);

export default GlassEffectLayers;
