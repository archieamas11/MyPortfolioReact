import { useCallback, useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SequentialRevealOptions {
  delay?: number;
  onComplete?: () => void;
  replay?: boolean;
  rootMargin?: string;
  threshold?: number;
}

type RegisterFn = (node: HTMLElement | null) => void;

export const useSequentialReveal = (options: SequentialRevealOptions = {}) => {
  const {
    delay = 150,
    threshold = 0.25,
    rootMargin = "0px",
    replay = true,
    onComplete,
  } = options;

  const isMobile = useIsMobile();
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);
  const itemsRef = useRef<Set<HTMLElement>>(new Set());
  const timersRef = useRef<Set<number>>(new Set());
  const animatingRef = useRef(false);
  const hasAnimatedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const registerItem = useCallback<RegisterFn>(
    (node) => {
      if (!node) {
        for (const item of itemsRef.current) {
          if (!item.isConnected) {
            itemsRef.current.delete(item);
          }
        }
        return;
      }

      if (itemsRef.current.has(node)) {
        itemsRef.current.delete(node);
      }

      if (isMobile) {
        node.classList.remove("reveal-item");
        node.classList.add("reveal-item-visible");
      } else {
        node.classList.remove("reveal-item-visible");
        node.classList.add("reveal-item");
      }

      itemsRef.current.add(node);
    },
    [isMobile]
  );

  const clearTimers = useCallback(() => {
    for (const timerId of timersRef.current) {
      window.clearTimeout(timerId);
    }
    timersRef.current.clear();
  }, []);

  const resetItems = useCallback(() => {
    clearTimers();
    for (const node of itemsRef.current) {
      if (node.isConnected) {
        node.classList.remove("reveal-item-visible");
      }
    }
    animatingRef.current = false;
    hasAnimatedRef.current = false;
  }, [clearTimers]);

  const revealItems = useCallback(() => {
    if (animatingRef.current) {
      return;
    }

    clearTimers();

    const items: HTMLElement[] = [];
    for (const node of itemsRef.current) {
      if (node.isConnected) {
        items.push(node);
      }
    }

    if (items.length === 0) {
      animatingRef.current = false;
      hasAnimatedRef.current = true;
      onCompleteRef.current?.();
      return;
    }

    if (delay <= 0) {
      for (const node of items) {
        node.classList.add("reveal-item-visible");
      }

      animatingRef.current = false;
      hasAnimatedRef.current = true;
      onCompleteRef.current?.();
      return;
    }

    animatingRef.current = true;

    for (const [index, node] of items.entries()) {
      const timerId = window.setTimeout(() => {
        if (node.isConnected) {
          node.classList.add("reveal-item-visible");
        }

        timersRef.current.delete(timerId);

        if (index === items.length - 1) {
          animatingRef.current = false;
          hasAnimatedRef.current = true;
          onCompleteRef.current?.();
        }
      }, delay * index);

      timersRef.current.add(timerId);
    }
  }, [delay, clearTimers]);

  useEffect(() => {
    if (!containerEl || typeof window === "undefined" || isMobile) {
      if (isMobile && containerEl) {
        for (const node of itemsRef.current) {
          if (node.isConnected) {
            node.classList.add("reveal-item-visible");
          }
        }
        onCompleteRef.current?.();
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const inView =
            entry.isIntersecting || entry.intersectionRatio >= threshold;

          if (inView) {
            if (replay || !hasAnimatedRef.current) {
              revealItems();
            }
          } else if (!inView && replay) {
            resetItems();
          }
        }
      },
      { threshold: [threshold], rootMargin }
    );

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [
    containerEl,
    threshold,
    rootMargin,
    replay,
    revealItems,
    resetItems,
    clearTimers,
    isMobile,
  ]);

  const containerRef = useCallback((node: HTMLElement | null) => {
    setContainerEl(node);
  }, []);

  const reveal = useCallback(() => {
    if (!isMobile) {
      revealItems();
    }
  }, [isMobile, revealItems]);

  const reset = useCallback(() => {
    if (!isMobile) {
      resetItems();
    }
  }, [isMobile, resetItems]);

  return {
    containerRef,
    registerItem,
    reveal,
    reset,
  };
};
