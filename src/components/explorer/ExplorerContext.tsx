"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { LEVEL_MAX, LEVEL_MIN, panos, unitById, type PanoId, type Status, type UnitTypeId } from "@/data/project";
import { usePageTransition } from "../site/PageTransition";

export type View = "building" | "floor" | "residence";

export type Filters = {
  type: UnitTypeId | "all";
  availableOnly: boolean;
};

type Lightbox = { src: string; title: string; caption?: string } | null;

type Ctx = {
  view: View;
  level: number;
  unitId: string | null;
  filters: Filters;
  lightbox: Lightbox;
  enquiryUnit: string | null;
  pano: PanoId | null;
  openPano: (id: PanoId) => void;
  closePano: () => void;
  setFilters: (f: Filters) => void;
  openLevel: (level: number) => void;
  openUnit: (unitId: string) => void;
  back: () => void;
  close: () => void;
  setLevel: (level: number) => void;
  openLightbox: (l: NonNullable<Lightbox>) => void;
  closeLightbox: () => void;
  enquire: (unitId?: string) => void;
  matches: (u: { type: UnitTypeId; status: Status }) => boolean;
};

const ExplorerContext = createContext<Ctx | null>(null);

export function useExplorer() {
  const ctx = useContext(ExplorerContext);
  if (!ctx) throw new Error("useExplorer must be used inside <ExplorerProvider>");
  return ctx;
}

const clampLevel = (n: number) => Math.min(LEVEL_MAX, Math.max(LEVEL_MIN, n));

export function ExplorerProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>("building");
  const [level, setLevelState] = useState<number>(LEVEL_MAX);
  const [unitId, setUnitId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ type: "all", availableOnly: false });
  const [lightbox, setLightbox] = useState<Lightbox>(null);
  const [enquiryUnit, setEnquiryUnit] = useState<string | null>(null);
  const [pano, setPano] = useState<PanoId | null>(null);
  const hydrated = useRef(false);
  const { navigate } = usePageTransition();

  // Deep links: /?level=9 or /?unit=D-903
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const u = p.get("unit");
    const l = p.get("level");
    const r = p.get("room");
    if (u && unitById(u)) {
      const unit = unitById(u)!;
      setLevelState(unit.level);
      setUnitId(unit.id);
      setView("residence");
      if (r && r in panos) setPano(r as PanoId);
    } else if (l && !Number.isNaN(Number(l))) {
      setLevelState(clampLevel(Number(l)));
      setView("floor");
    }
    hydrated.current = true;
  }, []);

  // Keep URL shareable without adding history noise
  useEffect(() => {
    if (!hydrated.current) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("level");
    url.searchParams.delete("unit");
    url.searchParams.delete("room");
    if (view === "floor") url.searchParams.set("level", String(level));
    if (view === "residence" && unitId) url.searchParams.set("unit", unitId);
    if (view === "residence" && pano) url.searchParams.set("room", pano);
    window.history.replaceState(null, "", url.toString());
  }, [view, level, unitId, pano]);

  // Lock page scroll while an overlay is open
  useEffect(() => {
    const locked = view !== "building" || !!lightbox || !!pano;
    document.documentElement.classList.toggle("is-locked", locked);
  }, [view, lightbox, pano]);

  const openLevel = useCallback((l: number) => {
    setLevelState(clampLevel(l));
    setUnitId(null);
    setView("floor");
  }, []);

  const openUnit = useCallback((id: string) => {
    const u = unitById(id);
    if (!u) return;
    setLevelState(u.level);
    setUnitId(u.id);
    setPano(null);
    setView("residence");
  }, []);

  const back = useCallback(() => {
    setPano(null);
    setView((v) => (v === "residence" ? "floor" : "building"));
  }, []);

  const close = useCallback(() => {
    setPano(null);
    setView("building");
    setUnitId(null);
  }, []);

  const enquire = useCallback((id?: string) => {
    setEnquiryUnit(id ?? null);
    setPano(null);
    setView("building");
    setLightbox(null);
    requestAnimationFrame(() => {
      // Form on this page → glide to it; otherwise go to the contact page
      if (document.getElementById("enquire")) navigate(window.location.pathname + "#enquire");
      else navigate("/contact#enquire");
    });
  }, [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightbox) setLightbox(null);
      else if (pano) setPano(null);
      else if (view !== "building") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, pano, view, back]);

  const matches = useCallback(
    (u: { type: UnitTypeId; status: Status }) =>
      (filters.type === "all" || u.type === filters.type) && (!filters.availableOnly || u.status === "available"),
    [filters],
  );

  const value = useMemo<Ctx>(
    () => ({
      view,
      level,
      unitId,
      filters,
      lightbox,
      enquiryUnit,
      pano,
      openPano: (id) => setPano(id),
      closePano: () => setPano(null),
      setFilters,
      openLevel,
      openUnit,
      back,
      close,
      setLevel: (l) => setLevelState(clampLevel(l)),
      openLightbox: (l) => setLightbox(l),
      closeLightbox: () => setLightbox(null),
      enquire,
      matches,
    }),
    [view, level, unitId, filters, lightbox, enquiryUnit, pano, openLevel, openUnit, back, close, enquire, matches],
  );

  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>;
}
