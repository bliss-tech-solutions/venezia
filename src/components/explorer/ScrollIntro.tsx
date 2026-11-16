"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { elevation, levelBand, levels, pad, totals, unitsOnLevel, type UnitTypeId } from "@/data/project";
import { useExplorer } from "./ExplorerContext";

const { w: W, h: H, towers } = elevation;
const ease = [0.22, 1, 0.36, 1] as const;

/** A caption that fades in and out over a slice of the scroll. */
function Chapter({
  p,
  range,
  className,
  children,
}: {
  p: MotionValue<number>;
  range: [number, number];
  className?: string;
  children: React.ReactNode;
}) {
  const [a, b] = range;
  const opacity = useTransform(p, [a, a + 0.05, b - 0.05, b], [0, 1, 1, 0]);
  const y = useTransform(p, [a, b], [40, -40]);
  return (
    <motion.div className={`chapter ${className ?? ""}`} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

export function ScrollIntro() {
  const { view, openLevel, filters, setFilters, matches } = useExplorer();
  const track = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const [entering, setEntering] = useState<number | null>(null);
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait) and (max-width: 900px)");
    const set = () => setPortrait(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  /* ---------- Scroll choreography ---------- */
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 32, restDelta: 0.0005 });

  const endScale = portrait ? 1.14 : 1.2;
  const camScale = useTransform(p, [0, 0.75], [1, endScale]);
  const camY = useTransform(p, [0, 0.75], ["7%", "0%"]);
  const veil = useTransform(p, [0, 0.3, 0.7], [0.62, 0.3, 0]);
  const sat = useTransform(p, [0, 0.4], [0.75, 1]);
  const filter = useMotionTemplate`saturate(${sat})`;

  const titleOpacity = useTransform(p, [0, 0.12], [1, 0]);
  const titleScale = useTransform(p, [0, 0.14], [1, 1.35]);
  const titleSpacing = useTransform(p, [0, 0.14], [0.08, 0.32]);
  const letterSpacing = useMotionTemplate`${titleSpacing}em`;
  const cueOpacity = useTransform(p, [0, 0.05], [1, 0]);

  const uiOpacity = useTransform(p, [0.74, 0.84], [0, 1]);
  const uiY = useTransform(p, [0.74, 0.84], [24, 0]);
  const progressScale = useTransform(scrollYProgress, [0, 0.82], [0, 1]);

  useMotionValueEvent(p, "change", (v) => {
    const r = v > 0.78;
    setReady((cur) => (cur === r ? cur : r));
  });

  // ---------- Floor data ----------
  const stats = useMemo(() => {
    const map = new Map<number, { total: number; available: number; matching: number }>();
    for (const l of levels) {
      const us = unitsOnLevel(l);
      map.set(l, {
        total: us.length,
        available: us.filter((u) => u.status === "available").length,
        matching: us.filter((u) => matches(u)).length,
      });
    }
    return map;
  }, [matches]);
  const filtering = filters.type !== "all" || filters.availableOnly;

  useEffect(() => {
    if (view === "building") {
      const t = setTimeout(() => setEntering(null), 60);
      return () => clearTimeout(t);
    }
  }, [view]);

  const enter = (level: number) => {
    if (entering !== null) return;
    setEntering(level);
    setHover(null);
    setTip(null);
    setTimeout(() => openLevel(level), 750);
  };

  const skip = () => {
    const el = track.current;
    if (!el) return;
    const end = el.offsetTop + el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: end, behavior: "smooth" });
  };

  const zoomOrigin = useMemo(() => {
    if (entering === null) return undefined;
    const b = levelBand(entering);
    const cx = (towers[0][0] + towers[towers.length - 1][1]) / 2;
    return `${(cx / W) * 100}% ${((b.y + b.h / 2) / H) * 100}%`;
  }, [entering]);

  const hs = hover !== null ? stats.get(hover)! : null;

  return (
    <section id="top" ref={track} className="intro" aria-label="The Venezia — explore the building">
      <div className="intro__sticky">
        {/* camera */}
        <motion.div className="intro__camera" style={{ scale: camScale, y: camY, filter }}>
          <motion.div
            className="intro__stage"
            animate={entering !== null ? { scale: 2.3, opacity: 0.25 } : { scale: 1, opacity: 1 }}
            transition={{ duration: entering !== null ? 0.85 : 0.6, ease: [0.7, 0, 0.2, 1] }}
            style={{ transformOrigin: zoomOrigin }}
          >
            <Image
              src={elevation.src}
              alt="The Venezia — four towers above a retail promenade"
              fill
              priority
              sizes="(orientation: portrait) 190vw, 120vw"
              className="intro__img"
            />
            <svg
              className={`intro__svg ${ready ? "is-ready" : ""}`}
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              onPointerLeave={() => {
                setHover(null);
                setTip(null);
              }}
            >
              {levels.map((l) => {
                const b = levelBand(l);
                const s = stats.get(l)!;
                const dim = filtering && s.matching === 0;
                return (
                  <g
                    key={l}
                    className={`floor ${hover === l ? "floor--active" : ""} ${dim ? "floor--dim" : ""} ${
                      filtering && !dim ? "floor--match" : ""
                    }`}
                    onPointerEnter={() => setHover(l)}
                    onPointerMove={(e) => e.pointerType === "mouse" && setTip({ x: e.clientX, y: e.clientY })}
                    onClick={() => ready && enter(l)}
                  >
                    {towers.map(([x0, x1], i) => (
                      <rect key={i} x={x0} y={b.y + 2} width={x1 - x0} height={b.h - 4} />
                    ))}
                  </g>
                );
              })}
            </svg>
          </motion.div>
        </motion.div>

        <motion.div className="intro__veil" style={{ opacity: veil }} aria-hidden="true" />
        <div className="intro__shade" aria-hidden="true" />

        {/* Opening title */}
        <motion.div className="intro__title" style={{ opacity: titleOpacity, scale: titleScale }}>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 1, ease }}
          >
            2 BHK Residences · Retail Promenade
          </motion.p>
          <motion.h1
            style={{ letterSpacing }}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.7, duration: 1.4, ease }}
          >
            <span>The</span> Venezia
          </motion.h1>
        </motion.div>

        <motion.div className="intro__cue-wrap" style={{ opacity: cueOpacity }}>
          <motion.button
            className="intro__cue"
            onClick={skip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
          >
            <span className="intro__cue-line" />
            Scroll to approach
          </motion.button>
        </motion.div>

        {/* Story chapters */}
        <Chapter p={p} range={[0.14, 0.42]} className="chapter--left">
          <p className="eyebrow">The Address</p>
          <p className="chapter__big">
            Architecture that stands out <em>on the skyline.</em>
          </p>
          <p className="chapter__small">A landmark address defined by style and sophistication.</p>
        </Chapter>
        <Chapter p={p} range={[0.42, 0.72]} className="chapter--right">
          <dl className="chapter__stats">
            <div>
              <dt>Residential levels</dt>
              <dd>{totals.levels}</dd>
            </div>
            <div>
              <dt>Residences</dt>
              <dd>{totals.residences}</dd>
            </div>
            <div>
              <dt>Blocks</dt>
              <dd>{totals.towers}</dd>
            </div>
          </dl>
        </Chapter>

        {/* Explorer UI */}
        <motion.div
          className={`intro__ui ${ready ? "is-ready" : ""}`}
          style={{ opacity: uiOpacity, y: uiY }}
        >
          <div className="intro__prompt">
            <p className="eyebrow">Select your floor</p>
            <p className="intro__prompt-title">
              Choose a level, <em>then a residence.</em>
            </p>
            <p className="hero__hint">
              <span className="pulse" />
              <span className="hint-mouse">Hover a floor for availability · click to enter</span>
              <span className="hint-touch">Tap any floor to enter</span>
            </p>
          </div>

          <nav className="rail" aria-label="Choose a level">
            <p className="eyebrow rail__title">
              Level <span>Avail.</span>
            </p>
            <ul>
              {levels.map((l) => {
                const s = stats.get(l)!;
                const dim = filtering && s.matching === 0;
                const val = filtering ? s.matching : s.available;
                return (
                  <li key={l}>
                    <button
                      className={`rail__btn ${hover === l ? "is-active" : ""} ${dim ? "is-dim" : ""}`}
                      onMouseEnter={() => setHover(l)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(l)}
                      onBlur={() => setHover(null)}
                      onClick={() => enter(l)}
                      tabIndex={ready ? 0 : -1}
                    >
                      <span className="rail__num">{pad(l)}</span>
                      <span className="rail__bar">
                        <span style={{ transform: `scaleX(${val / s.total})` }} />
                      </span>
                      <span className="rail__avail">{val}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="filters">
            <div className="filters__group" role="radiogroup" aria-label="Residence type">
              {(["all", "A", "B", "C"] as const).map((t) => (
                <button
                  key={t}
                  role="radio"
                  aria-checked={filters.type === t}
                  className={`chip ${filters.type === t ? "chip--on" : ""}`}
                  onClick={() => setFilters({ ...filters, type: t as UnitTypeId | "all" })}
                >
                  {filters.type === t && <motion.span layoutId="chip-bg" className="chip__bg" />}
                  <span>{t === "all" ? "All" : `Type ${t}`}</span>
                </button>
              ))}
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
              />
              <span className="toggle__ui" />
              Available only
            </label>
          </div>
        </motion.div>

        {/* Cursor tooltip */}
        <AnimatePresence>
          {ready && hover !== null && hs && entering === null && (
            <motion.div
              key="tip"
              className={`floor-tip ${tip ? "" : "floor-tip--docked"}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease }}
              style={
                tip
                  ? {
                      left: Math.min(tip.x + 22, (typeof window !== "undefined" ? window.innerWidth : 1600) - 230),
                      top: tip.y,
                    }
                  : undefined
              }
            >
              <p className="eyebrow">Level</p>
              <p className="floor-tip__num">{pad(hover)}</p>
              <dl>
                <div>
                  <dt>Residences</dt>
                  <dd>{hs.total}</dd>
                </div>
                <div>
                  <dt>Available</dt>
                  <dd className="gold">{hs.available}</dd>
                </div>
                {filtering && (
                  <div>
                    <dt>Matching</dt>
                    <dd>{hs.matching}</dd>
                  </div>
                )}
              </dl>
              <span className="floor-tip__cta">Click to explore →</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* scroll progress */}
        <div className="intro__progress" aria-hidden="true">
          <motion.span style={{ scaleY: progressScale }} />
        </div>
        <motion.button className="intro__skip" onClick={skip} style={{ opacity: cueOpacity }}>
          Skip intro
        </motion.button>
      </div>
    </section>
  );
}
