"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { panoOrder, panos, unitById, unitTypes, type PanoId } from "@/data/project";
import { loadImage, PanoRenderer } from "@/lib/panoRenderer";
import { useExplorer } from "./ExplorerContext";

const ease = [0.22, 1, 0.36, 1] as const;
const DEG = Math.PI / 180;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Status = "loading" | "ready" | "error";

export function PanoViewer() {
  const { pano, openPano, closePano, unitId, enquire } = useExplorer();
  return <AnimatePresence>{pano && <Viewer key="pano" id={pano} unitId={unitId} onSwitch={openPano} onClose={closePano} onEnquire={enquire} />}</AnimatePresence>;
}

function Viewer({
  id,
  unitId,
  onSwitch,
  onClose,
  onEnquire,
}: {
  id: PanoId;
  unitId: string | null;
  onSwitch: (id: PanoId) => void;
  onClose: () => void;
  onEnquire: (unitId?: string) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const compass = useRef<HTMLSpanElement>(null);
  const renderer = useRef<PanoRenderer | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [touched, setTouched] = useState(false);
  const [veil, setVeil] = useState(true);

  // camera state lives in a ref — updated every frame without React renders
  const cam = useRef({ yaw: 0, pitch: 0, fov: 100 * DEG, vYaw: 0, vPitch: 0, tFov: 78 * DEG, idle: 0 });

  const unit = unitId ? unitById(unitId) : undefined;
  const type = unit ? unitTypes[unit.type] : undefined;
  const available = type ? panoOrder.filter((p) => type.rooms.some((r) => r.pano === p)) : panoOrder;
  const roomList = available.length > 0 ? available : panoOrder;
  const room = type?.rooms.find((r) => r.pano === id);
  const meta = panos[id] ?? panos.living;

  // Helper to ensure renderer is created
  const getOrCreateRenderer = () => {
    if (!canvas.current) return null;
    if (!renderer.current) {
      try {
        renderer.current = new PanoRenderer(canvas.current);
      } catch (err) {
        console.error("Failed to initialize PanoRenderer:", err);
        return null;
      }
    }
    return renderer.current;
  };

  // Create renderer once
  useEffect(() => {
    getOrCreateRenderer();
    return () => {
      renderer.current?.dispose();
      renderer.current = null;
    };
  }, []);

  // Load the panorama whenever the room changes
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setVeil(true);

    const fallbacks = [meta.src, meta.remote];
    if (room?.render) fallbacks.push(room.render);

    loadImage(fallbacks)
      .then((img) => {
        if (cancelled) return;
        const r = getOrCreateRenderer();
        if (!r) return setStatus("error");
        r.setImage(img);
        const c = cam.current;
        c.yaw = -0.6;
        c.pitch = -0.04;
        c.fov = 104 * DEG; // start wide, then settle in
        c.tFov = window.innerWidth < 700 ? 88 * DEG : 76 * DEG;
        c.vYaw = 0.012;
        setStatus("ready");
        setTimeout(() => !cancelled && setVeil(false), 60);
      })
      .catch((err) => {
        console.error("Panorama image loading failed:", err);
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, meta.src, meta.remote, room?.render]);

  // Render loop with inertia, smooth zoom and gentle auto-rotate
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const c = cam.current;
      if (!pointer.current) {
        c.yaw += c.vYaw;
        c.pitch += c.vPitch;
        c.vYaw *= 0.92;
        c.vPitch *= 0.9;
        c.idle += dt;
        if (c.idle > 3.5) c.yaw += 0.045 * dt; // slow showcase drift
      }
      c.pitch = clamp(c.pitch, -1.35, 1.35);
      c.fov += (c.tFov - c.fov) * Math.min(1, dt * 4.5);
      renderer.current?.render(c);
      if (compass.current) compass.current.style.transform = `rotate(${(-c.yaw / DEG).toFixed(1)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Pointer / touch / wheel
  const pointer = useRef<{ x: number; y: number; id: number } | null>(null);
  const pinch = useRef<{ d: number; fov: number } | null>(null);
  const touches = useRef(new Map<number, { x: number; y: number }>());

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touches.current.size === 2) {
      const [a, b] = [...touches.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), fov: cam.current.tFov };
      pointer.current = null;
      return;
    }
    pointer.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    cam.current.vYaw = cam.current.vPitch = 0;
    cam.current.idle = 0;
    setTouched(true);
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (touches.current.has(e.pointerId)) touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && touches.current.size === 2) {
      const [a, b] = [...touches.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      cam.current.tFov = clamp(pinch.current.fov * (pinch.current.d / d), 35 * DEG, 100 * DEG);
      return;
    }
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const c = cam.current;
    const k = (c.fov / (canvas.current?.clientHeight || 800)) * 1.1;
    const dYaw = (e.clientX - p.x) * k;
    const dPitch = (e.clientY - p.y) * k;
    c.yaw += dYaw;
    c.pitch += dPitch;
    c.vYaw = dYaw * 0.9;
    c.vPitch = dPitch * 0.9;
    p.x = e.clientX;
    p.y = e.clientY;
  };
  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    touches.current.delete(e.pointerId);
    if (touches.current.size < 2) pinch.current = null;
    if (pointer.current?.id === e.pointerId) pointer.current = null;
    cam.current.idle = 0;
  };

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const c = cam.current;
      c.tFov = clamp(c.tFov + e.deltaY * 0.0012, 35 * DEG, 100 * DEG);
      c.idle = 0;
      setTouched(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const c = cam.current;
      if (e.key === "ArrowLeft") c.vYaw = 0.05;
      if (e.key === "ArrowRight") c.vYaw = -0.05;
      if (e.key === "ArrowUp") c.vPitch = 0.03;
      if (e.key === "ArrowDown") c.vPitch = -0.03;
      if (e.key === "+" || e.key === "=") c.tFov = clamp(c.tFov - 8 * DEG, 35 * DEG, 100 * DEG);
      if (e.key === "-") c.tFov = clamp(c.tFov + 8 * DEG, 35 * DEG, 100 * DEG);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const zoomBy = (deg: number) => {
    const c = cam.current;
    c.tFov = clamp(c.tFov + deg * DEG, 35 * DEG, 100 * DEG);
  };

  const fullscreen = () => {
    const el = document.querySelector(".pano") as HTMLElement | null;
    if (!document.fullscreenElement) el?.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  };

  return (
    <motion.div
      className="pano"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.6, ease }}
      role="dialog"
      aria-label={`360° view — ${meta.title}`}
    >
      <canvas
        ref={canvas}
        className="pano__canvas"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />

      {/* fade between rooms */}
      <motion.div
        className="pano__veil"
        initial={{ opacity: 1 }}
        animate={{ opacity: veil ? 1 : 0 }}
        transition={{ duration: veil ? 0.25 : 1.1, ease }}
      />
      <div className="pano__shade" />

      {/* top bar */}
      <div className="pano__bar">
        <nav className="crumbs" aria-label="Breadcrumb">
          <button onClick={onClose}>{unit ? `Residence ${unit.number}` : "Residence"}</button>
          <span>/</span>
          <strong>{meta.title} · 360°</strong>
        </nav>
        <div className="pano__bar-actions">
          <span className="pano__compass" aria-hidden="true">
            <span ref={compass}>
              <i />
            </span>
          </span>
          <button className="icon-btn" onClick={fullscreen} aria-label="Toggle full screen">
            <svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
          </button>
          <button className="icon-btn" onClick={onClose} aria-label="Back to 3D residence">
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>

      {/* caption */}
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          className="pano__caption"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
        >
          <p className="eyebrow">
            {unit ? `Residence ${unit.number} · ${unitTypes[unit.type].label}` : "Residence"} · 360°
          </p>
          <h2>{meta.title}</h2>
          <p className="pano__note">
            {room ? `${room.dims} · ` : ""}
            {meta.note}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* zoom */}
      <div className="pano__zoom">
        <button className="icon-btn" onClick={() => zoomBy(-10)} aria-label="Zoom in">
          <svg viewBox="0 0 24 24"><path d="M12 6v12M6 12h12" /></svg>
        </button>
        <button className="icon-btn" onClick={() => zoomBy(10)} aria-label="Zoom out">
          <svg viewBox="0 0 24 24"><path d="M6 12h12" /></svg>
        </button>
      </div>

      {/* room switcher */}
      <motion.div
        className="pano__rooms"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease }}
      >
        {roomList.map((p) => {
          const item = panos[p];
          if (!item) return null;
          const matchingRoom = type?.rooms.find((r) => r.pano === p);
          const fallback = matchingRoom?.render || item.remote;
          return (
            <button
              key={p}
              className={`pano__room ${p === id ? "is-on" : ""}`}
              onClick={() => p !== id && onSwitch(p)}
              title={item.title}
            >
              <span className="pano__thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.title}
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback && fallback) {
                      target.dataset.triedFallback = "true";
                      target.src = fallback;
                    }
                  }}
                />
              </span>
              <span>{item.title}</span>
              {p === id && <motion.i layoutId="pano-active" className="pano__room-line" />}
            </button>
          );
        })}
        <button className="btn btn--gold btn--sm pano__enquire" onClick={() => onEnquire(unitId ?? undefined)}>
          Book a visit
        </button>
      </motion.div>

      {/* hint */}
      <AnimatePresence>
        {status === "ready" && !touched && (
          <motion.div
            className="pano__hint"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 1.2, duration: 0.6, ease }}
          >
            <span className="pano__hand" />
            Drag to look around · scroll to zoom
          </motion.div>
        )}
      </AnimatePresence>

      {status === "loading" && (
        <div className="pano__loading">
          <span className="spinner" />
          Loading 360° view
        </div>
      )}
      {status === "error" && (
        <div className="pano__loading">
          <p>This 360° view couldn&rsquo;t be loaded.</p>
          <small>Run <code>npm run fetch-panos</code>, or add your own 2:1 image at <code>public{meta.src}</code>.</small>
        </div>
      )}
    </motion.div>
  );
}
