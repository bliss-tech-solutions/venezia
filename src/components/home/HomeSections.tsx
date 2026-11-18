"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FadeUp, Magnetic, ParallaxImage, SplitText, ease } from "../motion";
import { SectionHead } from "../site/Blocks";
import { TLink } from "../site/PageTransition";
import { Arrow } from "../site/Icon";
import { useExplorer } from "../explorer/ExplorerContext";
import { img } from "@/data/content";
import { elevation, levelBand, levels, pad, site, totals, units, unitTypes, type UnitTypeId } from "@/data/project";

/* ================================================================
   04 — Residences: three typologies
   ================================================================ */
const typeIds: UnitTypeId[] = ["A", "B", "C"];

export function ResidencesPreview() {
  const { openUnit, setFilters } = useExplorer();

  const explore = (t: UnitTypeId) => {
    const avail = units.filter((u) => u.type === t && u.status === "available").sort((a, b) => b.level - a.level);
    const first = avail[0] ?? units.find((u) => u.type === t)!;
    setFilters({ type: t, availableOnly: true });
    openUnit(first.id);
  };

  return (
    <section className="section respreview">
      <div className="container">
        <SectionHead
          split
          eyebrow="04 — Residences"
          title={
            <>
              Three plans. <em>One standard.</em>
            </>
          }
          intro="Every home is a considered 2 BHK a private foyer, a generous drawing room opening to the balcony, kitchen with dining, two bedrooms and a dedicated wash area."
        />

        <div className="respreview__feature">
          <ParallaxImage src={img.living} alt="Living and dining room in a Venezia residence" className="respreview__img" sizes="(max-width: 960px) 100vw, 60vw" />
          <FadeUp className="respreview__note" delay={0.2}>
            <p className="eyebrow">Interiors</p>
            <p className="respreview__quote">{site.interiorLine}</p>
          </FadeUp>
        </div>

        <div className="typecards">
          {typeIds.map((id, i) => {
            const t = unitTypes[id];
            const avail = units.filter((u) => u.type === id && u.status === "available").length;
            const total = units.filter((u) => u.type === id).length;
            return (
              <FadeUp key={id} className="typecard" delay={i * 0.12}>
                <button className="typecard__btn" onClick={() => explore(id)} data-cursor="Explore">
                  <span className="typecard__top">
                    <span className="typecard__type">
                      Type <em>{id}</em>
                    </span>
                    <span className="typecard__avail">
                      <i className="dot dot--available" /> {avail} of {total} available
                    </span>
                  </span>
                  <span className="typecard__plan">
                    <Image src={t.plan.src} alt={`${t.label} floor plan`} fill sizes="(max-width: 960px) 90vw, 30vw" />
                  </span>
                  <span className="typecard__meta">
                    <span>{t.config}</span>
                    <span>{t.rooms.find((r) => r.id === "drawing")?.dims} living</span>
                  </span>
                  <span className="typecard__tag">{t.tagline}</span>
                  <span className="typecard__go">
                    Step inside in 3D <Arrow />
                  </span>
                </button>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   05 — Floor explorer teaser (scanning floor highlight)
   ================================================================ */
export function ExplorerTeaser() {
  const [scan, setScan] = useState(9);
  useEffect(() => {
    let i = 0;
    const seq = [9, 12, 6, 14, 4, 10, 1, 13, 3, 11];
    const t = setInterval(() => setScan(seq[++i % seq.length]), 1600);
    return () => clearInterval(t);
  }, []);
  const b = levelBand(scan);
  const { w: W, h: H, towers } = elevation;
  const avail = units.filter((u) => u.level === scan && u.status === "available").length;

  const steps = [
    { n: "01", t: "Choose a floor", d: `Hover the building to see live availability on every level from ${pad(levels[levels.length - 1])} to ${pad(levels[0])}.` },
    { n: "02", t: "Pick a residence", d: "The floor plate opens with all twenty homes colour-coded by status." },
    { n: "03", t: "Step inside", d: "Orbit a 3D model of the plan, then stand in each room in 360°." },
  ];

  return (
    <section className="section teaser">
      <div className="container teaser__grid">
        <div className="teaser__copy">
          <SectionHead
            eyebrow="05 — Interactive explorer"
            title={
              <>
                Find your floor. <em>Then step inside.</em>
              </>
            }
          />
          <ol className="steps">
            {steps.map((s, i) => (
              <FadeUp as="li" key={s.n} delay={i * 0.1}>
                <span className="steps__n">{s.n}</span>
                <div>
                  <strong>{s.t}</strong>
                  <p>{s.d}</p>
                </div>
              </FadeUp>
            ))}
          </ol>
          <FadeUp delay={0.3}>
            <Magnetic>
              <TLink href="/residences" className="btn btn--gold btn--lg">
                Launch the explorer <Arrow />
              </TLink>
            </Magnetic>
          </FadeUp>
        </div>

        <FadeUp className="teaser__visual" delay={0.15}>
          <TLink href="/residences" className="teaser__frame" data-cursor="Explore" aria-label="Open the floor explorer">
            <Image src={elevation.src} alt="" fill sizes="(max-width: 960px) 100vw, 55vw" style={{ objectFit: "cover", objectPosition: "50% 50%" }} />
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="teaser__svg">
              <motion.g animate={{ y: b.y }} transition={{ duration: 0.9, ease }}>
                {towers.map(([x0, x1], i) => (
                  <rect key={i} x={x0} y={2} width={x1 - x0} height={b.h - 4} />
                ))}
              </motion.g>
            </svg>
            <span className="teaser__chip">
              <small>Level</small>
              <motion.strong key={scan} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease }}>
                {pad(scan)}
              </motion.strong>
              <span>
                <i className="dot dot--available" /> {avail} available
              </span>
            </span>
          </TLink>
          <p className="teaser__caption">
            {levels.length} levels · {totals.residences} residences · live availability
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ================================================================
   360° tour band
   ================================================================ */
export function TourBand() {
  const { openPano } = useExplorer();
  return (
    <section className="tour">
      <ParallaxImage src={img.kitchen} alt="Kitchen and dining with mandir niche" className="tour__img" speed={0.1} reveal={false} />
      <div className="tour__shade" />
      <div className="container tour__copy">
        <p className="eyebrow eyebrow--line">Interiors in 360°</p>
        <SplitText as="h2" className="display">
          Stand in the room <em>before it&rsquo;s built.</em>
        </SplitText>
        <FadeUp delay={0.2}>
          <button className="tour__play" onClick={() => openPano("living")} data-cursor="Drag">
            <span className="tour__ring">
              <svg viewBox="0 0 100 100">
                <defs>
                  <path id="circ" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
                </defs>
                <text>
                  <textPath href="#circ">Take the 360° tour · Take the 360° tour ·</textPath>
                </text>
              </svg>
              <b>360°</b>
            </span>
            <span className="tour__label">Five rooms, fully immersive. Drag to look around.</span>
          </button>
        </FadeUp>
      </div>
    </section>
  );
}
