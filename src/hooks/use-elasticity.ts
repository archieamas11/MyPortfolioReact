import * as React from "react";

type ElasticityMode = "transform" | "individual";

export interface UseElasticityOptions {
  activationZonePx?: number;
  elasticity?: number;
  enabled?: boolean;
  mode?: ElasticityMode;
  transitionMs?: number;
}

const DEFAULTS: Required<
  Pick<
    UseElasticityOptions,
    "enabled" | "elasticity" | "activationZonePx" | "mode" | "transitionMs"
  >
> = {
  enabled: true,
  elasticity: 2,
  activationZonePx: 200,
  mode: "transform",
  transitionMs: 200,
};

function isReducedMotionPreferred() {
  if (typeof window === "undefined") {
    return true;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useElasticity<T extends HTMLElement>(
  targetRef: React.RefObject<T | null>,
  options: UseElasticityOptions = {}
) {
  const { enabled, elasticity, activationZonePx, transitionMs } = {
    ...DEFAULTS,
    ...options,
  };
  const [style, setStyle] = React.useState<React.CSSProperties | undefined>(
    undefined
  );
  const [offset, setOffset] = React.useState<{ x: number; y: number } | null>(
    null
  );
  const [scale, setScale] = React.useState<{ x: number; y: number } | null>(
    null
  );

  const rafRef = React.useRef<number | null>(null);
  const pointerRef = React.useRef<{ x: number; y: number } | null>(null);

  const reset = React.useCallback(() => {
    setStyle((prev) => (prev ? undefined : prev));
    setOffset((prev) => (prev ? null : prev));
    setScale((prev) => (prev ? null : prev));
  }, []);

  const compute = React.useCallback(() => {
    rafRef.current = null;

    if (!enabled || isReducedMotionPreferred()) {
      reset();
      return;
    }

    const el = targetRef.current;
    const p = pointerRef.current;
    if (!(el && p)) {
      reset();
      return;
    }

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = p.x - centerX;
    const deltaY = p.y - centerY;

    // Distance from pointer to element edges (not center)
    const edgeDistanceX = Math.max(0, Math.abs(deltaX) - rect.width / 2);
    const edgeDistanceY = Math.max(0, Math.abs(deltaY) - rect.height / 2);
    const edgeDistance = Math.sqrt(
      edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY
    );

    if (edgeDistance > activationZonePx) {
      reset();
      return;
    }

    const fadeInFactor = 1 - edgeDistance / activationZonePx;
    const centerDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (centerDistance === 0) {
      reset();
      return;
    }

    const normalizedX = deltaX / centerDistance;
    const normalizedY = deltaY / centerDistance;

    const stretchIntensity =
      Math.min(centerDistance / 300, 1) * elasticity * fadeInFactor;
    const scaleX = Math.max(
      0.8,
      1 +
        Math.abs(normalizedX) * stretchIntensity * 0.3 -
        Math.abs(normalizedY) * stretchIntensity * 0.15
    );
    const scaleY = Math.max(
      0.8,
      1 +
        Math.abs(normalizedY) * stretchIntensity * 0.3 -
        Math.abs(normalizedX) * stretchIntensity * 0.15
    );

    const tx = (p.x - centerX) * elasticity * 0.1 * fadeInFactor;
    const ty = (p.y - centerY) * elasticity * 0.1 * fadeInFactor;
    const sx = Math.max(0.8, scaleX);
    const sy = Math.max(0.8, scaleY);

    const next: React.CSSProperties = {
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(${sx}, ${sy})`,
      transition: `transform ${transitionMs}ms ease-out`,
      willChange: "transform",
    } satisfies React.CSSProperties;

    setStyle(next);
    setOffset({ x: tx, y: ty });
    setScale({ x: sx, y: sy });
  }, [activationZonePx, elasticity, enabled, reset, targetRef, transitionMs]);

  React.useEffect(() => {
    if (!enabled || isReducedMotionPreferred()) {
      reset();
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current != null) {
        return;
      }
      rafRef.current = window.requestAnimationFrame(compute);
    };

    const onPointerLeaveWindow = () => {
      pointerRef.current = null;
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      reset();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onPointerLeaveWindow);
    document.addEventListener("mouseleave", onPointerLeaveWindow);

    return () => {
      window.removeEventListener(
        "pointermove",
        onPointerMove as unknown as EventListener
      );
      window.removeEventListener("blur", onPointerLeaveWindow);
      document.removeEventListener("mouseleave", onPointerLeaveWindow);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [compute, enabled, reset]);

  return {
    elasticityStyle: style,
    elasticityOffset: offset,
    elasticityScale: scale,
  };
}
