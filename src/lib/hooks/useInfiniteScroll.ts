"use client";

import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  onIntersect: () => void;
  disabled?: boolean;
  rootRef?: React.RefObject<HTMLElement | null>;
}

export function useInfiniteScroll({
  onIntersect,
  disabled = false,
  rootRef,
}: UseInfiniteScrollProps) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled) return;
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        root: rootRef?.current ?? null,
        threshold: 0,
      }
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [onIntersect, disabled, rootRef]);

  return targetRef;
}
