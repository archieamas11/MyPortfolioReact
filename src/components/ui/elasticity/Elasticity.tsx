import type React from "react";
import type { GlassEdgeReflectProps } from "@/components/ui/glass-edge-reflect/glass-edge-reflect";
import { GlassSurface } from "@/components/ui/glass-surface";

type ElasticityMode = "transform" | "individual";

interface ElasticityOptions {
  mode?: ElasticityMode;
}

type ElasticityProps = {
  children: React.ReactElement<React.ComponentPropsWithoutRef<"div">>;
  enabled?: boolean;
  elasticity?: number;
  activationZonePx?: number;
  transitionMs?: number;
  /**
   * When true the element is assumed to be centred via
   * `top:50%; left:50%; transform:translate(-50%,-50%)`.
   * The elastic translate is composited on top of that centering offset so the
   * element doesn't jump away from its intended position. This is just workaround hehe
   */
  preserveCenteredTranslate?: boolean;
  /** Default is true. If false it will disable the flass reflect effect */
  withGlassEdgeReflect?: boolean;
  glassEdgeReflectProps?: Omit<
    GlassEdgeReflectProps,
    "children" | "asChild" | "className" | "style"
  >;
} & Omit<ElasticityOptions, "mode"> & {
    mode?: ElasticityMode;
    className?: string;
    style?: React.CSSProperties;
  };

export function Elasticity({
  children,
  enabled = true,
  elasticity = 0.15,
  activationZonePx = 200,
  transitionMs,
  preserveCenteredTranslate = false,
  mode = "transform",
  withGlassEdgeReflect = true,
  glassEdgeReflectProps,
  className,
  style,
}: ElasticityProps) {
  return (
    <GlassSurface
      activationZonePx={activationZonePx}
      asChild
      className={className}
      edgeReflect={withGlassEdgeReflect}
      elasticity={elasticity}
      elasticityEnabled={enabled}
      enabled={enabled}
      mode={mode}
      preserveCenteredTranslate={preserveCenteredTranslate}
      style={style}
      transitionMs={transitionMs}
      variant="interactive"
      {...glassEdgeReflectProps}
    >
      {children}
    </GlassSurface>
  );
}
