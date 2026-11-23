"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { elevation, levelBand, levels, pad, totals, unitsOnLevel, type UnitTypeId } from "@/data/project";
import { useExplorer } from "./ExplorerContext";
import { useSiteReady } from "../motion";
import { usePageTransition } from "../site/PageTransition";

const { w: W, h: H, towers } = elevation;
const ease = [0.22, 1, 0.36, 1] as const;

/** Full-screen building with every floor selectable — the site's opening screen. */
export function Hero() {
  const { view, openLevel, filters, setFilters, matches } = useExplorer();
  const [hover, setHover] = useState<number | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const [entering, setEntering] = useState<number | null>(null);
  const ready = useSiteReady();
  const { navigate } = usePageTransition();

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

  const zoomOrigin = useMemo(() => {
    if (entering === null) return undefined;
    const b = levelBand(entering);
    const cx = (towers[0][0] + towers[towers.length - 1][1]) / 2;
    return `${(cx / W) * 100}% ${((b.y + b.h / 2) / H) * 100}%`;
  }, [entering]);

  const hs = hover !== null ? stats.get(hover)! : null;
  const fadeUp = (d: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: entering !== null ? 0 : 1, y: 0 } : undefined,
    transition: { duration: entering !== null ? 0.4 : 1, ease, delay: entering !== null ? 0 : 0.5 + d },
  });

  return (
    <section id="top" className={`hero ${hover !== null ? "hero--hovering" : ""}`} aria-label="Choose your floor">
      <motion.div
        className="hero__stage"
        initial={{ scale: 1.08 }}
        animate={entering !== null ? { scale: 2.3, opacity: 0.3 } : ready ? { scale: 1, opacity: 1 } : undefined}
        transition={
          entering !== null ? { duration: 0.85, ease: [0.7, 0, 0.2, 1] } : { duration: 2.4, ease, delay: 0.1 }
        }
        style={{ transformOrigin: zoomOrigin }}
      >
        <Image
          src={elevation.src}
          alt="The Venezia — four towers above a retail promenade"
          fill
          priority
          sizes="(orientation: portrait) 190vw, 100vw"
          className="hero__img"
        />
        <svg
          className="hero__svg"
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
                onClick={() => enter(l)}
              >
                {towers.map(([x0, x1], i) => (
                  <rect key={i} x={x0} y={b.y + 2} width={x1 - x0} height={b.h - 4} />
                ))}
                <title>{`Level ${pad(l)} — ${s.available} of ${s.total} available`}</title>
              </g>
            );
          })}
        </svg>
      </motion.div>

      <div className="hero__shade" aria-hidden="true" />

      {/* Copy */}
      <div className="hero__copy">
        <motion.p className="eyebrow eyebrow--line" {...fadeUp(0)}>
          Residences · Live availability
        </motion.p>
        <motion.h1 className="hero__title" {...fadeUp(0.1)}>
          Select your <em>floor</em>
        </motion.h1>
        <motion.p className="hero__hint" {...fadeUp(0.25)}>
          <span className="pulse" />
          <span className="hint-mouse">Hover a floor to see availability · click to step inside</span>
          <span className="hint-touch">Tap any floor to step inside</span>
        </motion.p>
      </div>

      {/* Elevator rail */}
      <motion.nav
        className="rail"
        aria-label="Choose a level"
        initial={{ opacity: 0, x: 30 }}
        animate={ready ? { opacity: entering !== null ? 0 : 1, x: 0 } : undefined}
        transition={{ duration: 1, ease, delay: entering !== null ? 0 : 0.9 }}
      >
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
      </motion.nav>

      {/* Filters */}
      <motion.div
        className="filters"
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: entering !== null ? 0 : 1, y: 0 } : undefined}
        transition={{ duration: 1, ease, delay: entering !== null ? 0 : 1.1 }}
      >
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
        <span className="filters__meta">
          {totals.residences} residences · {totals.towers} towers · Levels 1 to 14
        </span>
      </motion.div>

      {/* Floor tooltip: follows the cursor, docks at the top on touch */}
      <AnimatePresence>
        {hover !== null && hs && entering === null && (
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
                <dd className="accent">{hs.available}</dd>
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

      <a href="#plans" className="hero__scroll" aria-label="Scroll to floor plans" onClick={(e) => { e.preventDefault(); navigate(window.location.pathname + "#plans"); }}>
        <span />
      </a>
    </section>
  );
}
