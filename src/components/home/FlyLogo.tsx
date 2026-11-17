"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "../Logo";
import { useSiteReady } from "../motion";

/**
 * One logo that travels through the home page opening:
 *   splash screen  →  (splash lifts)  →  hero  →  (scroll)  →  navbar
 *
 * It is a single fixed element placed every frame over three measured
 * slots: [data-logo-slot="preloader"], [data-logo-slot="hero"] and the
 * header's own logo. When it reaches the navbar it hands over to the
 * real header logo (html.logo-docked) and comes back if you scroll up.
 */

type R = { x: number; y: number; w: number };

const rectOf = (sel: string): R | null => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width > 0 ? { x: r.left, y: r.top, w: r.width } : null;
};
const lerp = (a: R, b: R, t: number): R => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t });
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const FLY_MS = 1300;
/** share of the hero's scroll length over which the logo travels to the navbar */
const SCROLL_SHARE = 0.3;

export function FlyLogo({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const node = useRef<HTMLDivElement>(null);
  const [intro, setIntro] = useState<boolean | null>(null);
  const ready = useSiteReady();

  // Was the splash screen up when the home page mounted?
  useEffect(() => {
    setIntro(!document.documentElement.classList.contains("is-ready"));
  }, []);

  useEffect(() => {
    if (intro === null) return;
    const html = document.documentElement;
    let phase: "intro" | "fly" | "scroll" = intro ? "intro" : "scroll";
    let from: R | null = null;
    let t0 = 0;
    let raf = 0;
    let docked: boolean | null = null;

    const scrollTarget = () => {
      const hero = rectOf('[data-logo-slot="hero"]');
      const nav = rectOf(".header__brand .logo");
      if (!hero || !nav) return null;
      const sec = heroRef.current;
      const dist = sec ? Math.max(220, (sec.offsetHeight - window.innerHeight) * SCROLL_SHARE) : window.innerHeight * 0.5;
      const s = Math.min(1, Math.max(0, window.scrollY / dist));
      return { r: lerp(hero, nav, easeInOut(s)), s };
    };

    const startFlight = () => {
      if (phase !== "intro" || !html.classList.contains("is-ready")) return;
      from = rectOf('[data-logo-slot="preloader"]') ?? from;
      phase = "fly";
      t0 = performance.now();
    };
    const mo = new MutationObserver(startFlight);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    const setDocked = (d: boolean) => {
      if (d === docked) return;
      docked = d;
      html.classList.toggle("logo-docked", d);
    };
    html.classList.add("logo-flying");

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const el = node.current;
      if (!el) return;
      let r: R | null = null;
      let s = 0;

      if (phase === "intro") {
        r = rectOf('[data-logo-slot="preloader"]');
        if (r) from = r;
      } else {
        const t = scrollTarget();
        if (!t) return;
        s = t.s;
        if (phase === "fly" && from) {
          const k = Math.min(1, (now - t0) / FLY_MS);
          r = lerp(from, t.r, easeInOut(k));
          if (k >= 1) {
            phase = "scroll";
            el.classList.remove("is-intro");
          }
        } else {
          r = t.r;
        }
      }
      if (!r) return;

      setDocked(phase === "scroll" && s >= 1);
      el.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
      el.style.width = `${r.w}px`;
      el.classList.add("is-placed");
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      html.classList.remove("logo-flying", "logo-docked");
    };
  }, [intro, heroRef]);

  if (intro === null) return null;

  return createPortal(
    <div ref={node} className={`flylogo ${intro ? "is-intro" : ""}`} aria-hidden="true">
      {/* with the splash: reveal straight away; arriving from another page: reveal once the curtain lifts */}
      <Logo animate play={intro ? true : ready} delay={intro ? 0.15 : 0.3} />
    </div>,
    document.body,
  );
}
