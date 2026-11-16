"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "../Reveal";
import { useExplorer } from "../explorer/ExplorerContext";
import { units, unitTypes, type UnitTypeId } from "@/data/project";

const ids: UnitTypeId[] = ["A", "B", "C"];

export function Plans() {
  const [active, setActive] = useState<UnitTypeId>("A");
  const { openUnit, setFilters } = useExplorer();
  const t = unitTypes[active];
  const ofType = units.filter((u) => u.type === active);
  const available = ofType.filter((u) => u.status === "available");

  const explore = () => {
    const first = available.sort((a, b) => b.level - a.level)[0] ?? ofType[0];
    setFilters({ type: active, availableOnly: true });
    openUnit(first.id);
  };

  return (
    <section id="plans" className="section plans">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow eyebrow--line">Floor plans</p>
          <h2 className="display">
            Three plans. <em>One</em> standard.
          </h2>
          <p className="section__intro">
            Every residence at The Venezia is a considered 2 BHK — a private foyer, a generous drawing room opening to the
            balcony, kitchen with dining, two bedrooms and a dedicated wash area.
          </p>
        </Reveal>

        <Reveal className="tabs" delay={80}>
          {ids.map((id) => (
            <button
              key={id}
              className={`tabs__btn ${active === id ? "is-on" : ""}`}
              onClick={() => setActive(id)}
              aria-pressed={active === id}
            >
              <span className="tabs__type">Type {id}</span>
              <span className="tabs__meta">{units.filter((u) => u.type === id).length} residences</span>
            </button>
          ))}
        </Reveal>

        <div className="plans__grid" key={active}>
          <div className="plans__figure">
            <div className="plans__img" style={{ aspectRatio: `${t.plan.w} / ${t.plan.h}` }}>
              <Image src={t.plan.src} alt={`${t.label} unit plan`} fill sizes="(max-width: 960px) 100vw, 55vw" />
            </div>
          </div>

          <div className="plans__info">
            <p className="eyebrow">
              {t.config} · {t.label}
            </p>
            <h3 className="plans__title">{t.tagline}</h3>
            <table className="spec">
              <tbody>
                {t.rooms.map((r) => (
                  <tr key={r.id}>
                    <th scope="row">{r.name}</th>
                    <td>{r.dims}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="plans__cta">
              <button className="btn btn--gold" onClick={explore}>
                View available {t.label} residences
              </button>
              <span className="plans__avail">
                <i className="dot dot--available" /> {available.length} available
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
