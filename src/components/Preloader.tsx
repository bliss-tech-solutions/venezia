"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

/** Branded intro: the wing mark draws itself while a counter runs, then the curtain lifts. */
export function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const home = usePathname() === "/";

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 200 : 1700;
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);

    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // ease-out, but hold at 92% until the page has loaded
      const eased = 1 - Math.pow(1 - p, 3);
      const value = loaded ? eased : Math.min(eased, 0.92);
      setPct(Math.round(value * 100));
      if (value < 1) raf = requestAnimationFrame(tick);
      else {
        setDone(true);
        document.documentElement.classList.add("is-ready");
        setTimeout(() => setGone(true), 1100);
      }
    };
    raf = requestAnimationFrame(tick);
    // never block longer than 5s
    const safety = setTimeout(() => (loaded = true), 5000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`preloader ${done ? "preloader--out" : ""}`} aria-hidden="true">
      <div className="preloader__inner">
        {home ? (
          <div className="preloader__logo preloader__slot" data-logo-slot="preloader" />
        ) : (
          <Logo animate className="preloader__logo" />
        )}
        <div className="preloader__bar">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <p className="preloader__pct">{String(pct).padStart(3, "0")}</p>
      </div>
    </div>
  );
}
