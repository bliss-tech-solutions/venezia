"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { blocks, pad, statusLabel, unitById, unitsOnLevel, unitTypes, type PanoId } from "@/data/project";
import { useExplorer } from "./ExplorerContext";
import { Flat3D } from "./Flat3D";

const ease = [0.22, 1, 0.36, 1] as const;

export function ResidenceView() {
  const { view, unitId } = useExplorer();
  return (
    <AnimatePresence>
      {view === "residence" && unitId && unitById(unitId) && <Residence key="residence" unitId={unitId} />}
    </AnimatePresence>
  );
}

function Residence({ unitId }: { unitId: string }) {
  const { openUnit, back, close, enquire, openPano, pano } = useExplorer();
  const unit = unitById(unitId)!;
  const type = unitTypes[unit.type];

  const [mode, setMode] = useState<"3d" | "2d">("3d");
  const [hoverRoom, setHoverRoom] = useState<string | null>(null);
  const [entered, setEntered] = useState<string | null>(null);
  const [request, setRequest] = useState<{ id: string; n: number } | null>(null);

  useEffect(() => {
    if (!pano) setEntered(null);
  }, [pano]);

  const siblings = useMemo(
    () => unitsOnLevel(unit.level).sort((a, b) => a.block.localeCompare(b.block) || a.number - b.number),
    [unit.level],
  );
  const idx = siblings.findIndex((u) => u.id === unit.id);
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
  const next = siblings[(idx + 1) % siblings.length];

  const onEnterRoom = (p: PanoId, roomId: string) => {
    setEntered(roomId);
    openPano(p);
  };

  return (
    <motion.div
      className="overlay residence-view is-open"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="overlay__bar">
        <nav className="crumbs" aria-label="Breadcrumb">
          <button onClick={close}>Building</button>
          <span>/</span>
          <button onClick={back}>Level {pad(unit.level)}</button>
          <span>/</span>
          <strong>Residence {unit.number}</strong>
        </nav>
        <div className="overlay__bar-actions">
          <button className="icon-btn" onClick={() => openUnit(prev.id)} aria-label={`Previous residence ${prev.number}`}>
            <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button className="icon-btn" onClick={() => openUnit(next.id)} aria-label={`Next residence ${next.number}`}>
            <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          <button className="icon-btn" onClick={back} aria-label="Back to floor">
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>

      <div className="residence-view__body">
        <motion.div
          className="residence-view__stage"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.1 }}
        >
          <Flat3D
            key={unit.id}
            type={type}
            mode={mode}
            hoverRoom={hoverRoom}
            focusRoom={entered}
            onHoverRoom={setHoverRoom}
            onEnterRoom={onEnterRoom}
            enterRequest={request}
          />

          <div className="stage-ui">
            <div className="segmented" role="tablist" aria-label="View mode">
              {(["3d", "2d"] as const).map((m) => (
                <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? "is-on" : ""} onClick={() => setMode(m)}>
                  {mode === m && <motion.span layoutId="seg" className="segmented__bg" transition={{ duration: 0.45, ease }} />}
                  <span>{m === "3d" ? "3D Model" : "2D Plan"}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={mode}
                className="stage-ui__hint"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
              >
                <span className="hint-mouse">
                  {mode === "3d" ? "Scroll or drag to rotate · click a room to step inside in 360°" : "Click a room to step inside in 360°"}
                </span>
                <span className="hint-touch">
                  {mode === "3d" ? "Drag to rotate · tap a room for 360°" : "Tap a room for 360°"}
                </span>
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.aside
          className="panel residence-view__panel"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.25 }}
        >
          <p className="eyebrow">
            Block {unit.block} · Level {pad(unit.level)} · {blocks[unit.block].wing}
          </p>
          <h2 className="residence-view__title">
            Residence <em>{unit.number}</em>
          </h2>
          <div className="residence-view__meta">
            <span>
              {type.label} · {type.config}
            </span>
            <span className={`status status--${unit.status}`}>{statusLabel[unit.status]}</span>
          </div>
          <p className="residence-view__tag">{type.tagline}</p>

          <p className="eyebrow panel__sub">Rooms</p>
          <ul className="room-list">
            {type.rooms.map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.04, duration: 0.5, ease }}
              >
                <button
                  className={`${hoverRoom === r.id ? "is-hover" : ""} ${r.pano ? "has-pano" : ""}`}
                  onMouseEnter={() => setHoverRoom(r.id)}
                  onMouseLeave={() => setHoverRoom(null)}
                  onClick={() => r.pano && setRequest({ id: r.id, n: Date.now() })}
                  disabled={!r.pano}
                >
                  <span>
                    {r.name}
                    {r.pano && <b className="badge360">360°</b>}
                  </span>
                  <span>{r.dims}</span>
                </button>
              </motion.li>
            ))}
          </ul>

          <div className="residence-view__actions">
            <button
              className="btn btn--gold"
              onClick={() => setRequest({ id: "drawing", n: Date.now() })}
            >
              Start 360° walkthrough
            </button>
            <button className="btn btn--ghost" onClick={() => enquire(unit.id)} disabled={unit.status === "sold"}>
              {unit.status === "sold" ? "Residence sold" : "Enquire about this residence"}
            </button>
            <a className="btn btn--link" href={type.plan.src} download={`Venezia-${unit.id}-${type.label}.png`}>
              Download plan ↓
            </a>
          </div>
          <p className="fineprint">
            Dimensions from the sales brochure. 3D model is traced from the plan; 360° interiors are artist&rsquo;s
            impressions.
          </p>
        </motion.aside>
      </div>
    </motion.div>
  );
}
