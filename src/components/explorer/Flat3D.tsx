"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { wallsFor, type PanoId, type UnitType } from "@/data/project";

type Props = {
  type: UnitType;
  mode: "3d" | "2d";
  hoverRoom: string | null;
  focusRoom: string | null;
  onHoverRoom: (id: string | null) => void;
  onEnterRoom: (pano: PanoId, roomId: string) => void;
  /** ask the model to fly into a room (e.g. from the side list) */
  enterRequest: { id: string; n: number } | null;
};

const WALL_H = 58; // px in plan space ≈ a cut-away at ~4.5 ft
const DEFAULT_YAW = -32;
const DEFAULT_TILT = 56;

/**
 * A rotatable 3D model of the residence, built from the real plan:
 * the plan image is the floor and each traced wall is extruded as a box.
 * Pure CSS 3D — crisp on every screen, no WebGL needed.
 * Scroll / drag rotates, ⟲ resets.
 */
export function Flat3D({ type, mode, hoverRoom, focusRoom, onHoverRoom, onEnterRoom, enterRequest }: Props) {
  const { w: W, h: H } = type.plan;
  const wallRects = wallsFor(type.id);
  const wrap = useRef<HTMLDivElement>(null);
  const fit = useMotionValue(1);
  const [dragging, setDragging] = useState(false);
  const [diving, setDiving] = useState<string | null>(null);

  // Camera targets → springs
  const yawT = useMotionValue(DEFAULT_YAW - 60);
  const tiltT = useMotionValue(8);
  const yaw = useSpring(yawT, { stiffness: 70, damping: 18, mass: 0.9 });
  const tilt = useSpring(tiltT, { stiffness: 70, damping: 20, mass: 0.9 });
  const wallH = useMotionValue(0);
  const zoom = useMotionValue(0.9);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  const wh = useMotionTemplate`${wallH}px`;
  const negYaw = useTransform(yaw, (v) => -v);
  const negTilt = useTransform(tilt, (v) => -v);
  const scale = useTransform([zoom, fit], ([z, f]: number[]) => z * f);
  const modelTransform = useMotionTemplate`translate(-50%, -50%) rotateX(${tilt}deg) rotateZ(${yaw}deg) scale3d(${scale}, ${scale}, ${scale}) translate(${panX}px, ${panY}px)`;
  // pins always face the camera and keep a constant on-screen size
  const inv = useTransform(scale, (v) => 1 / Math.max(0.2, v));
  const billboard = useMotionTemplate`translate(-50%, -100%) rotateZ(${negYaw}deg) rotateX(${negTilt}deg) scale3d(${inv}, ${inv}, ${inv})`;

  // Fit model to the stage
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      // leave room for the model's diagonal while it rotates
      const k = width < 600 ? 0.8 : 0.64;
      fit.set(Math.min((width * k) / W, (height * 0.66) / H, 1.7));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [W, H, fit]);

  // Intro + mode morph: walls rise out of the plan, camera swings in
  useEffect(() => {
    const t = { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const };
    if (mode === "3d") {
      yawT.set(DEFAULT_YAW);
      tiltT.set(DEFAULT_TILT);
      const a = animate(wallH, WALL_H, { ...t, delay: 0.25 });
      const z = animate(zoom, 1, t);
      return () => {
        a.stop();
        z.stop();
      };
    }
    yawT.set(0);
    tiltT.set(0);
    const a = animate(wallH, 0, { duration: 0.7, ease: [0.7, 0, 0.2, 1] });
    const z = animate(zoom, 1.12, t);
    return () => {
      a.stop();
      z.stop();
    };
  }, [mode, type.id, yawT, tiltT, wallH, zoom]);

  // Scroll to rotate (non-passive so the page never scrolls underneath)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (mode !== "3d" || diving) return;
      if (e.ctrlKey) {
        zoom.set(Math.min(1.8, Math.max(0.7, zoom.get() - e.deltaY * 0.004)));
        return;
      }
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      yawT.set(yawT.get() + d * 0.22);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [mode, diving, yawT, zoom]);

  // Drag to orbit
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const moved = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    moved.current = false;
    if (mode !== "3d" || diving) return;
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    if (!d.moved) {
      d.moved = true;
      moved.current = true;
      setDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    d.x = e.clientX;
    d.y = e.clientY;
    yawT.set(yawT.get() + dx * 0.35);
    tiltT.set(Math.min(74, Math.max(18, tiltT.get() - dy * 0.22)));
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const rotateBy = (deg: number) => yawT.set(yawT.get() + deg);
  const reset = () => {
    yawT.set(Math.round((yawT.get() - DEFAULT_YAW) / 360) * 360 + DEFAULT_YAW);
    tiltT.set(DEFAULT_TILT);
    animate(zoom, 1, { duration: 0.6 });
  };

  // Dive into a room, then hand over to the 360° viewer
  const enterRoom = (roomId: string, pano: PanoId) => {
    if (diving) return;
    const r = type.rooms.find((x) => x.id === roomId)!;
    const cx = (r.box[0] + r.box[2]) / 2;
    const cy = (r.box[1] + r.box[3]) / 2;
    setDiving(roomId);
    const t = { duration: 1.05, ease: [0.7, 0, 0.2, 1] as const };
    animate(panX, W / 2 - cx, t);
    animate(panY, H / 2 - cy, t);
    animate(zoom, 2.6, t);
    tiltT.set(68);
    setTimeout(() => onEnterRoom(pano, roomId), 820);
  };

  useEffect(() => {
    if (!enterRequest) return;
    const r = type.rooms.find((x) => x.id === enterRequest.id);
    if (r?.pano) enterRoom(r.id, r.pano);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterRequest]);

  // Reset the dive once the viewer closes and we are shown again
  useEffect(() => {
    if (focusRoom === null && diving) {
      setDiving(null);
      const t = { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const };
      animate(panX, 0, t);
      animate(panY, 0, t);
      animate(zoom, 1, t);
      tiltT.set(DEFAULT_TILT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRoom]);

  const pinRooms = type.rooms.filter((r) => r.pano);

  return (
    <div
      ref={wrap}
      className={`flat3d ${dragging ? "is-dragging" : ""} ${mode === "2d" ? "is-2d" : ""} ${diving ? "is-diving" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="flat3d__ground" aria-hidden="true" />
      <motion.div
        className="flat3d__model"
        style={{ width: W, height: H, transform: modelTransform, "--wh": wh } as unknown as MotionStyle}
      >
        {/* floor */}
        <div className="flat3d__slab" />
        <img className="flat3d__floor" src={type.plan.src} alt="" draggable={false} />

        {/* room highlights */}
        {type.rooms.map((r) => {
          const on = hoverRoom === r.id || focusRoom === r.id || diving === r.id;
          return (
            <div
              key={r.id}
              className={`flat3d__zone ${on ? "is-on" : ""}`}
              style={{ left: r.box[0], top: r.box[1], width: r.box[2] - r.box[0], height: r.box[3] - r.box[1] }}
              onPointerEnter={() => onHoverRoom(r.id)}
              onPointerLeave={() => onHoverRoom(null)}
              onClick={() => r.pano && !moved.current && enterRoom(r.id, r.pano)}
            />
          );
        })}

        {/* extruded walls */}
        {wallRects.map(([x, y, w, h], i) => (
          <div key={i} className="wall" style={{ left: x, top: y, width: w, height: h }}>
            <i className="wall__top" />
            <i className="wall__n" />
            <i className="wall__s" />
            <i className="wall__w" />
            <i className="wall__e" />
          </div>
        ))}

        {/* room pins */}
        {pinRooms.map((r, i) => {
          const cx = (r.box[0] + r.box[2]) / 2;
          const cy = (r.box[1] + r.box[3]) / 2;
          const on = hoverRoom === r.id;
          return (
            <div key={r.id} className="pin3d" style={{ left: cx, top: cy }}>
              <motion.button
                className={`pin3d__btn ${on ? "is-on" : ""}`}
                style={{ transform: billboard }}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerEnter={() => onHoverRoom(r.id)}
                onPointerLeave={() => onHoverRoom(null)}
                onClick={() => enterRoom(r.id, r.pano!)}
                aria-label={`Enter ${r.name} in 360°`}
              >
                <motion.span
                  className="pin3d__chip"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.08, duration: 0.6 }}
                >
                  <strong>{r.name}</strong>
                  <small>
                    {r.dims} <b>360°</b>
                  </small>
                </motion.span>
                <span className="pin3d__stem" />
                <span className="pin3d__dot" />
              </motion.button>
            </div>
          );
        })}
      </motion.div>

      {/* controls */}
      <div className="flat3d__controls" onPointerDown={(e) => e.stopPropagation()}>
        <button className="icon-btn" onClick={() => rotateBy(-45)} aria-label="Rotate left" disabled={mode !== "3d"}>
          <svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4" /></svg>
        </button>
        <button className="icon-btn" onClick={reset} aria-label="Reset view" disabled={mode !== "3d"}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></svg>
        </button>
        <button className="icon-btn" onClick={() => rotateBy(45)} aria-label="Rotate right" disabled={mode !== "3d"}>
          <svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4" /></svg>
        </button>
      </div>
    </div>
  );
}
