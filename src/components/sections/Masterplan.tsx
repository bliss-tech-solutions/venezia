"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "../Reveal";
import { useExplorer } from "../explorer/ExplorerContext";
import { blockOrder, blocks, sitePlan, units } from "@/data/project";

const { w: W, h: H } = sitePlan;

const amenities = [
  { id: "lawn", name: "Party Lawn", note: "An open green at the heart of the court, with stepping-stone paths and shaded seating.", at: [490, 470] },
  { id: "play", name: "Toddler's Play Area", note: "A soft-surface play garden in clear view of the lawn.", at: [360, 465] },
  { id: "water", name: "Tranquil Water Body", note: "Cascading fountains beside the lavish central foyer.", at: [395, 588] },
  { id: "court", name: "Multipurpose Court", note: "A court for evening games, next to the clubhouse and zula court.", at: [472, 680] },
  { id: "green", name: "Landscape Garden", note: "A continuous tree-lined boundary that wraps the campus in green.", at: [420, 92] },
] as const;

export function Masterplan() {
  const [active, setActive] = useState<string>("lawn");
  const { openLevel } = useExplorer();

  return (
    <section id="masterplan" className="section masterplan">
      <div className="container">
        <Reveal className="section__head section__head--split">
          <div>
            <p className="eyebrow eyebrow--line">Masterplan</p>
            <h2 className="display">
              Five towers around <em>a private garden court.</em>
            </h2>
          </div>
          <p className="section__intro">
            Towers A to E are arranged around a landscaped court, each with a designer granite foyer and two automatic
            lifts. Four residences share each landing.
          </p>
        </Reveal>

        <div className="masterplan__grid">
          <Reveal className="masterplan__map" delay={80}>
            <div className="plan-frame plan-frame--light" style={{ aspectRatio: `${W} / ${H}` }}>
              <Image src={sitePlan.src} alt="Typical floor and site plan of The Venezia" fill sizes="(max-width: 960px) 100vw, 65vw" />
              {amenities.map((a, i) => (
                <button
                  key={a.id}
                  className={`pin ${active === a.id ? "is-on" : ""}`}
                  style={{ left: `${(a.at[0] / W) * 100}%`, top: `${(a.at[1] / H) * 100}%` }}
                  onMouseEnter={() => setActive(a.id)}
                  onFocus={() => setActive(a.id)}
                  onClick={() => setActive(a.id)}
                  aria-label={a.name}
                >
                  {i + 1}
                </button>
              ))}
              {blockOrder.map((b) => (
                <button
                  key={b}
                  className="pin pin--block"
                  style={{ left: `${(blocks[b].label[0] / W) * 100}%`, top: `${(blocks[b].label[1] / H) * 100}%` }}
                  onClick={() => openLevel(14)}
                  aria-label={`Block ${b} — explore floors`}
                  title={`Block ${b} · ${units.filter((u) => u.block === b && u.status === "available").length} available`}
                >
                  {b}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal as="ol" className="amenities" delay={160}>
            {amenities.map((a, i) => (
              <li key={a.id}>
                <button
                  className={active === a.id ? "is-on" : ""}
                  onMouseEnter={() => setActive(a.id)}
                  onClick={() => setActive(a.id)}
                >
                  <span>
                    <strong>{a.name}</strong>
                    <small>{a.note}</small>
                  </span>
                </button>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
