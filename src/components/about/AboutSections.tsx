"use client";

import { motion, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { FadeUp, ParallaxImage, ScrollText, ease, useRange } from "../motion";
import { SectionHead } from "../site/Blocks";
import { developer, img, journey, pillars } from "@/data/content";
import { site } from "@/data/project";

export function AboutStory() {
  return (
    <section className="section astory">
      <div className="container astory__grid">
        <div className="astory__text">
          <SectionHead
            eyebrow="Who we are"
            title={
              <>
                Exclusive towers, <em>generous living.</em>
              </>
            }
          />
          <FadeUp delay={0.1}>
            <p className="lead">{site.intro}</p>
          </FadeUp>
          {developer.statement.map((p, i) => (
            <FadeUp key={i} delay={0.2 + i * 0.1}>
              <p className="astory__p">{p}</p>
            </FadeUp>
          ))}
        </div>
        <div className="astory__collage">
          <ParallaxImage
            src={img.front}
            alt="Front elevation of The Venezia"
            className="astory__img astory__img--a"
            sizes="(max-width: 960px) 100vw, 40vw"
            position="50% 45%"
          />
          <ParallaxImage
            src={img.living}
            alt="Living room interior"
            className="astory__img astory__img--b"
            sizes="(max-width: 960px) 70vw, 25vw"
            speed={0.22}
          />
          <FadeUp className="astory__badge" delay={0.3}>
            <strong>{developer.name}</strong>
            <span>A {developer.group} project</span>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function Manifesto() {
  return (
    <section className="section manifesto">
      <div className="container">
        <p className="eyebrow eyebrow--line">Our promise</p>
        <ScrollText className="manifesto__text" text={developer.promise} />
      </div>
    </section>
  );
}

export function Pillars() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section pillars">
      <div className="container">
        <SectionHead
          split
          eyebrow="What we stand for"
          title={
            <>
              Four promises, <em>one address.</em>
            </>
          }
          intro="Eye-catching architecture, spacious luxury and true longevity in a 2 BHK that has no equal."
        />
        <div className="pillars__row">
          {pillars.map((p, i) => (
            <motion.button
              key={p.n}
              className={`pillar ${open === i ? "is-open" : ""}`}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
              aria-expanded={open === i}
              layout
              transition={{ duration: 0.7, ease }}
            >
              <span className="pillar__n">{p.n}</span>
              <span className="pillar__title">{p.title}</span>
              <motion.span
                className="pillar__text"
                initial={false}
                animate={{ opacity: open === i ? 1 : 0, y: open === i ? 0 : 16 }}
                transition={{ duration: 0.6, ease, delay: open === i ? 0.2 : 0 }}
              >
                {p.text}
              </motion.span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.5"] });
  const fill = useRange(scrollYProgress, [0, 1], [0, 1]);
  const label = { done: "Complete", active: "In progress", next: "Upcoming" };
  return (
    <section className="section journey">
      <div className="container journey__grid">
        <div className="journey__head">
          <SectionHead
            eyebrow="Project journey"
            title={
              <>
                From drawing board <em>to doorstep.</em>
              </>
            }
            intro="Where The Venezia stands today, and what comes next. Our sales team shares detailed progress updates with every owner."
          />
        </div>
        <ol ref={ref} className="timeline">
          <span className="timeline__rail" aria-hidden="true">
            <motion.span style={{ scaleY: fill }} />
          </span>
          {journey.map((j, i) => (
            <FadeUp as="li" key={j.phase} className={`timeline__item is-${j.state}`} delay={i * 0.05}>
              <span className="timeline__dot" />
              <div className="timeline__meta">
                <span>{j.phase}</span>
                <span className={`timeline__state is-${j.state}`}>{label[j.state]}</span>
              </div>
              <h3>{j.title}</h3>
              <p>{j.text}</p>
            </FadeUp>
          ))}
        </ol>
      </div>
    </section>
  );
}
