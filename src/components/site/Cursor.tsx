"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Contextual cursor. Over any element with `data-cursor="Label"` a soft
 * disc follows the pointer carrying that label ("View", "Drag", "Explore").
 * The native cursor stays everywhere else, so the explorer remains precise.
 * Fine pointers only.
 */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    if (!mq.matches) return;

    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      if (el.current) el.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as Element | null)?.closest?.("[data-cursor]");
      const l = t?.getAttribute("data-cursor") || null;
      setLabel((prev) => (prev === l ? prev : l));
    };
    const leave = () => setLabel(null);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={el} className={`cursor ${label ? "is-on" : ""}`} aria-hidden="true">
      <span className="cursor__disc">
        <span className="cursor__label">{label}</span>
      </span>
    </div>
  );
}

export function ScrollProgress() {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="progress" aria-hidden="true">
      <span ref={bar} />
    </div>
  );
}
