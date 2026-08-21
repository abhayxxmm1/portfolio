import { useEffect, useRef } from "react";

/**
 * Smooth scroll via Lenis. Respects prefers-reduced-motion and disables
 * itself on touch devices (native scroll feels better there anyway).
 *
 * Requires: npm install lenis
 *
 * Usage (top of Portfolio component):
 *   useLenis();
 */
export default function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)")
      .matches;

    if (prefersReduced || isTouch) return;

    let rafId;
    let destroyed = false;

    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
    };
  }, []);

  return lenisRef;
}