"use client";

import Image from "next/image";
import { useExplorer } from "./ExplorerContext";

export function Lightbox() {
  const { lightbox, closeLightbox, enquire, unitId, view } = useExplorer();
  return (
    <div className={`lightbox ${lightbox ? "is-open" : ""}`} aria-hidden={!lightbox} onClick={closeLightbox}>
      {lightbox && (
        <>
          <div className="lightbox__media">
            <Image key={lightbox.src} src={lightbox.src} alt={lightbox.title} fill sizes="100vw" className="lightbox__img" />
          </div>
          <div className="lightbox__shade" />
          <div className="lightbox__caption" onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow">{lightbox.caption}</p>
            <h3>{lightbox.title}</h3>
          </div>
          <div className="lightbox__actions" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn--ghost btn--sm" onClick={closeLightbox}>
              {view === "residence" ? "← Back to plan" : "Close"}
            </button>
            <button className="btn btn--gold btn--sm" onClick={() => enquire(unitId ?? undefined)}>
              Book a private visit
            </button>
          </div>
          <button className="icon-btn lightbox__close" onClick={closeLightbox} aria-label="Close">
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </>
      )}
    </div>
  );
}
