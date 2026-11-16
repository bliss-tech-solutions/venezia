"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  blockOrder,
  blocks,
  LEVEL_MAX,
  LEVEL_MIN,
  pad,
  sitePlan,
  statusLabel,
  unitsOnLevel,
  unitTypes,
} from "@/data/project";
import { useExplorer } from "./ExplorerContext";

const { w: W, h: H } = sitePlan;

const ease = [0.22, 1, 0.36, 1] as const;

export function FloorView() {
  const { view } = useExplorer();
  return <AnimatePresence>{(view === "floor" || view === "residence") && <Floor key="floor" />}</AnimatePresence>;
}

function Floor() {
  const { view, level, setLevel, openUnit, close, matches, filters } = useExplorer();
  const [hover, setHover] = useState<string | null>(null);
  const units = useMemo(() => unitsOnLevel(level), [level]);
  const hovered = units.find((u) => u.id === hover) ?? null;

  const counts = {
    available: units.filter((u) => u.status === "available").length,
    reserved: units.filter((u) => u.status === "reserved").length,
    sold: units.filter((u) => u.status === "sold").length,
  };

  return (
    <motion.div
      className="overlay floor-view is-open"
      aria-hidden={view === "residence"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="overlay__bar">
        <nav className="crumbs" aria-label="Breadcrumb">
          <button onClick={close}>Building</button>
          <span>/</span>
          <strong>Level {pad(level)}</strong>
        </nav>
        <button className="icon-btn" onClick={close} aria-label="Back to building">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div className="floor-view__body">
        <motion.div
          className="floor-view__plan"
          initial={{ opacity: 0, scale: 0.9, rotateX: 18, y: 30 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.1 }}
        >
          <div className="plan-frame" style={{ aspectRatio: `${W} / ${H}` }}>
            <Image src={sitePlan.src} alt={`Typical floor plan — level ${level}`} fill sizes="(max-width: 960px) 100vw, 66vw" className="plan-frame__img" />
            <svg viewBox={`0 0 ${W} ${H}`} className="plan-frame__svg">
              {units.map((u) => {
                const [x0, y0, x1, y1] = u.box;
                const ok = matches(u);
                return (
                  <g
                    key={u.id}
                    className={`unit unit--${u.status} ${ok ? "" : "unit--filtered"} ${hover === u.id ? "unit--hover" : ""}`}
                    onPointerEnter={() => setHover(u.id)}
                    onPointerLeave={() => setHover(null)}
                    onClick={() => openUnit(u.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Residence ${u.number}, block ${u.block}, type ${u.type}, ${statusLabel[u.status]}`}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openUnit(u.id)}
                  >
                    <rect x={x0 + 2} y={y0 + 2} width={x1 - x0 - 4} height={y1 - y0 - 4} rx={3} />
                  </g>
                );
              })}
              {blockOrder.map((b) => (
                <g key={b} className="block-tag" transform={`translate(${blocks[b].label[0]} ${blocks[b].label[1]})`}>
                  <circle r={15} />
                  <text dy="5">{b}</text>
                </g>
              ))}
            </svg>

            {hovered && (
              <div
                className="plan-tip"
                style={{
                  left: `${((hovered.box[0] + hovered.box[2]) / 2 / W) * 100}%`,
                  top: `${(hovered.box[1] / H) * 100}%`,
                }}
              >
                <p className="plan-tip__no">{hovered.number}</p>
                <p>
                  Block {hovered.block} · {unitTypes[hovered.type].label}
                </p>
                <p className={`status status--${hovered.status}`}>{statusLabel[hovered.status]}</p>
              </div>
            )}
          </div>
          <p className="floor-view__note">Select a residence to open it in 3D · North is up</p>
        </motion.div>

        <motion.aside
          className="panel floor-view__panel"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.25 }}
        >
          <div className="level-head">
            <div>
              <p className="eyebrow">Level</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={level}
                  className="level-head__num"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35, ease }}
                >
                  {pad(level)}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="stepper">
              <button onClick={() => setLevel(level + 1)} disabled={level >= LEVEL_MAX} aria-label="Level up">
                <svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" /></svg>
              </button>
              <button onClick={() => setLevel(level - 1)} disabled={level <= LEVEL_MIN} aria-label="Level down">
                <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
              </button>
            </div>
          </div>

          <div className="counts">
            <span><i className="dot dot--available" /> {counts.available} Available</span>
            <span><i className="dot dot--reserved" /> {counts.reserved} Reserved</span>
            <span><i className="dot dot--sold" /> {counts.sold} Sold</span>
          </div>
          {(filters.type !== "all" || filters.availableOnly) && (
            <p className="panel__filter-note">
              Filtered: {filters.type === "all" ? "all types" : `Type ${filters.type}`}
              {filters.availableOnly ? ", available only" : ""}
            </p>
          )}

          <div className="unit-list">
            {blockOrder.map((b) => (
              <div key={b} className="unit-list__block">
                <p className="eyebrow">
                  Block {b} <span>· {blocks[b].wing}</span>
                </p>
                {units
                  .filter((u) => u.block === b)
                  .sort((a, z) => a.number - z.number)
                  .map((u) => (
                    <button
                      key={u.id}
                      className={`unit-row ${hover === u.id ? "is-hover" : ""} ${matches(u) ? "" : "is-filtered"}`}
                      onMouseEnter={() => setHover(u.id)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => openUnit(u.id)}
                    >
                      <span className="unit-row__no">{u.number}</span>
                      <span className="unit-row__type">
                        {unitTypes[u.type].label} · {unitTypes[u.type].config}
                      </span>
                      <span className={`status status--${u.status}`}>{statusLabel[u.status]}</span>
                      <span className="unit-row__go" aria-hidden="true">→</span>
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
