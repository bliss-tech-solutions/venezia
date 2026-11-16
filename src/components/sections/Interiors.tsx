"use client";

import Image from "next/image";
import { Reveal } from "../Reveal";
import { useExplorer } from "../explorer/ExplorerContext";
import { site } from "@/data/project";

const shots = [
  { src: "/images/b/living.jpg", title: "Living & Dining", note: "Drawing room opening to the balcony" },
  { src: "/images/b/kitchen.jpg", title: "Kitchen & Mandir", note: "Dining beside a lit mandir niche" },
];

export function Interiors() {
  const { openLightbox, openPano } = useExplorer();
  return (
    <section id="interiors" className="section interiors">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow eyebrow--line">Interiors</p>
          <h2 className="display">
            Lavishness at <em>every turn.</em>
          </h2>
        </Reveal>

        <div className="interiors__grid">
          {shots.map((s, i) => (
            <Reveal key={s.src} className={`shot shot--${i}`} delay={i * 120}>
              <button
                className="shot__btn"
                onClick={() => openLightbox({ src: s.src, title: s.title, caption: "Representative interior · Artist's impression" })}
              >
                <span className="shot__media">
                  <Image src={s.src} alt={s.title} fill sizes="(max-width: 960px) 100vw, 50vw" />
                </span>
                <span className="shot__cap">
                  <strong>{s.title}</strong>
                  <small>{s.note}</small>
                </span>
              </button>
            </Reveal>
          ))}
          <Reveal className="interiors__quote" delay={200}>
            <p className="quote">&ldquo;{site.interiorLine}&rdquo;</p>
            <button className="btn btn--gold interiors__tour" onClick={() => openPano("living")}>
              Take the 360° tour
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
