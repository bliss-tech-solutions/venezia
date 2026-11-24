"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Elements that manage their own wheel / touch (explorer overlays, 360° viewer, lightbox, menus, EMI calculator). */
const OWN_SCROLL = ["overlay", "pano", "lightbox", "menu", "emi-backdrop", "emi-modal"];

/**
 * Inertial smooth scrolling. Pauses while the preloader runs, while any
 * overlay locks the page, or while the mobile menu is open.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      prevent: (node) =>
        OWN_SCROLL.some((c) => node.classList?.contains(c)) ||
        node.hasAttribute?.("data-lenis-prevent") ||
        Boolean(node.closest?.("[data-lenis-prevent]")),
    });
    const loop = (t: number) => {
      l.raf(t);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    setLenis(l);

    const html = document.documentElement;
    const sync = () => {
      const hold =
        !html.classList.contains("is-ready") ||
        html.classList.contains("is-locked") ||
        html.classList.contains("menu-open");
      if (hold) l.stop();
      else l.start();
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf.current);
      l.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
