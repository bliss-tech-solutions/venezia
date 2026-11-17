"use client";

import { FlyLogo } from "./FlyLogo";
import Image from "next/image";
import { motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Counter, FadeUp, Magnetic, SplitText, ease, useRange, useSiteReady } from "../motion";
import { TLink, usePageTransition } from "../site/PageTransition";
import { Arrow } from "../site/Icon";
import { SectionHead } from "../site/Blocks";
import { useExplorer } from "../explorer/ExplorerContext";
import { agencies, chapters, developer, img, neighbourhood, spotlights } from "@/data/content";
import { highlights, site, totals } from "@/data/project";

/* ================================================================
   Wave — the brochure's flowing-water motif, drifting slowly
   ================================================================ */
export function Waves({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const d1 = "M0 60 C 150 20 300 100 450 60 S 750 20 900 60 S 1200 100 1350 60 S 1650 20 1800 60 V 160 H 0 Z";
  const d2 = "M0 80 C 150 50 300 120 450 80 S 750 40 900 80 S 1200 120 1350 80 S 1650 50 1800 80 V 160 H 0 Z";
  const d3 = "M0 100 C 150 80 300 130 450 100 S 750 70 900 100 S 1200 130 1350 100 S 1650 80 1800 100 V 160 H 0 Z";
  return (
    <div className={`waves waves--${tone} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1800 160" preserveAspectRatio="none" className="waves__l1">
        <path d={d1} />
      </svg>
      <svg viewBox="0 0 1800 160" preserveAspectRatio="none" className="waves__l2">
        <path d={d2} />
      </svg>
      <svg viewBox="0 0 1800 160" preserveAspectRatio="none" className="waves__l3">
        <path d={d3} />
      </svg>
    </div>
  );
}

/* ================================================================
   01 — Pinned hero, after the brochure cover: the official logo
   over an arched window onto the dusk render. Scrolling opens the
   arch to a full-bleed view and hands over to the headline.
   ================================================================ */
export function HeroScroll() {
  const ref = useRef<HTMLElement>(null);
  const ready = useSiteReady();
  const { enquire } = useExplorer();
  const { navigate } = usePageTransition();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const set = () => setNarrow(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const clip = useRange(
    p,
    [0, 0.6],
    narrow
      ? ["inset(14% 14% 38% 14% round 999px 999px 14px 14px)", "inset(0% 0% 0% 0% round 0px 0px 0px 0px)"]
      : ["inset(13% 37.5% 30% 37.5% round 999px 999px 16px 16px)", "inset(0% 0% 0% 0% round 0px 0px 0px 0px)"],
  );
  const imgScale = useRange(p, [0, 0.65], [1.3, 1]);
  const frameO = useRange(p, [0, 0.18], [1, 0]);
  const brandO = useRange(p, [0.04, 0.32], [1, 0]);
  const brandY = useRange(p, [0, 0.4], [0, -60]);
  const sideO = useRange(p, [0, 0.12], [1, 0]);
  const bgScale = useRange(p, [0, 1], [1, 1.2]);
  const shade = useRange(p, [0.42, 0.75], [0, 1]);
  const finalO = useRange(p, [0.6, 0.8], [0, 1]);
  const finalY = useRange(p, [0.6, 0.84], [40, 0]);
  const finalPE = useTransform(p, (v) => (v > 0.64 ? "auto" : "none"));

  const show = (d: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.2, ease, delay: d },
  });

  return (
    <section ref={ref} className="shero" aria-label="The Venezia">
      <div className="shero__stage">
        <motion.div className="shero__bg" style={{ scale: bgScale }}>
          <Image src={img.waves} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        </motion.div>

        {/* outline arch echoing the window */}
        <motion.div
          className="shero__frame"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.8, ease, delay: 0.5 }}
          aria-hidden="true"
        >
          <motion.span style={{ opacity: frameO }} />
        </motion.div>

        <motion.div
          className="shero__window"
          style={{ clipPath: clip }}
          initial={{ opacity: 0, y: 60 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.6, ease, delay: 0.15 }}
        >
          <motion.div className="shero__img" style={{ scale: imgScale }}>
            <div className="shero__breathe">
              <Image
                src={img.dusk}
                alt="The Venezia towers at dusk, lit above the S.G. Highway promenade"
                fill
                priority
                sizes="100vw"
                style={{ objectFit: "cover", objectPosition: "50% 40%" }}
              />
            </div>
          </motion.div>
          <div className="shero__inner-shade" />
          <motion.div className="shero__shade" style={{ opacity: shade }} />
        </motion.div>

        {/* brochure-cover line: tagline on a vertical hairline */}
        <motion.div className="shero__side shero__side--right" style={{ opacity: sideO }}>
          <motion.p {...show(1.3)}>
            where serenity
            <br />
            <em>flows</em> in everyday
            <br />
            life
          </motion.p>
          <motion.i
            initial={{ scaleY: 0 }}
            animate={ready ? { scaleY: 1 } : undefined}
            transition={{ duration: 1.6, ease, delay: 1.1 }}
          />
        </motion.div>
        <motion.div className="shero__side shero__side--left" style={{ opacity: sideO }}>
          <motion.p {...show(1.4)}>
            <span>S.G. Highway</span>
            <span>Adalaj, Gandhinagar</span>
          </motion.p>
        </motion.div>

        <div className="shero__brand">
          <h1 className="sr-only">The Venezia: 2 BHK residences on S.G. Highway, Adalaj</h1>
          {/* the logo itself is drawn by <FlyLogo>, which lands here and then flies to the navbar */}
          <div className="shero__logo shero__slot" data-logo-slot="hero" />
          <motion.div style={{ opacity: brandO, y: brandY }}>
            <motion.p className="shero__sub" {...show(1.25)}>
              2 BHK Residences <i /> Retail <i /> 30+ Amenities
            </motion.p>
          </motion.div>
        </div>
        <FlyLogo heroRef={ref} />

        <motion.div className="shero__final container" style={{ opacity: finalO, y: finalY, pointerEvents: finalPE }}>
          <div className="shero__final-copy">
            <p className="eyebrow eyebrow--line">S.G. Highway, Adalaj</p>
            <h2 className="shero__headline">
              Architecture that stands out <em>on the skyline.</em>
            </h2>
          </div>
          <div className="shero__final-side">
            <dl className="shero__facts">
              <div>
                <dd>{totals.residences}</dd>
                <dt>Residences</dt>
              </div>
              <div>
                <dd>05</dd>
                <dt>Towers</dt>
              </div>
              <div>
                <dd>14</dd>
                <dt>Storeys + GF</dt>
              </div>
            </dl>
            <div className="shero__actions">
              <Magnetic>
                <TLink href="/residences" className="btn btn--gold">
                  Select your floor <Arrow />
                </TLink>
              </Magnetic>
              <button className="btn btn--ghost" onClick={() => enquire()}>
                Book a visit
              </button>
            </div>
          </div>
        </motion.div>

        <motion.a
          href="#address"
          className="shero__cue"
          style={{ opacity: sideO }}
          onClick={(e) => {
            e.preventDefault();
            navigate("/#address");
          }}
        >
          <motion.span {...show(1.6)}>Scroll</motion.span>
          <i />
        </motion.a>
      </div>
    </section>
  );
}

/* ================================================================
   02 — "live uncompromisingly" + brochure highlights
   ================================================================ */
export function Statement() {
  return (
    <section id="address" className="section statement">
      <div className="container">
        <div className="statement__grid">
          <div>
            <FadeUp y={16}>
              <p className="eyebrow eyebrow--line">01 — The address</p>
            </FadeUp>
            <SplitText as="h2" className="display statement__title">
              live <br />
              <em>uncompromisingly</em>
            </SplitText>
          </div>
          <FadeUp className="statement__copy" delay={0.15}>
            <p className="lead">{site.intro}</p>
            <TLink href="/about" className="btn btn--link">
              About the developer <Arrow />
            </TLink>
          </FadeUp>
        </div>

        <dl className="hl">
          {highlights.map((h, i) => (
            <FadeUp key={h.label} className="hl__item" delay={(i % 3) * 0.1}>
              <dd>
                <Counter to={h.value} pad={h.pad} suffix={h.suffix} />
              </dd>
              <dt>{h.label}</dt>
              <motion.i
                className="hl__bar"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease, delay: 0.3 + (i % 3) * 0.1 }}
              />
              <small>{h.note}</small>
            </FadeUp>
          ))}
        </dl>
      </div>
      <Waves tone="dark" className="statement__waves" />
    </section>
  );
}

/* ================================================================
   03 — More light · More life: the balcony view opens between the
   two halves of the headline.
   ================================================================ */
export function MoreLight() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useRange(p, [0, 0.6], ["inset(26% 30% 26% 30% round 12px)", "inset(0% 0% 0% 0% round 0px)"]);
  const scale = useRange(p, [0, 0.7], [1.25, 1]);
  const leftX = useRange(p, [0, 0.6], ["0vw", "-38vw"]);
  const rightX = useRange(p, [0, 0.6], ["0vw", "38vw"]);
  const wordsO = useRange(p, [0.4, 0.6], [1, 0]);
  const capO = useRange(p, [0.62, 0.8], [0, 1]);
  const capY = useRange(p, [0.62, 0.85], [40, 0]);
  const shade = useRange(p, [0.55, 0.8], [0, 1]);

  return (
    <section ref={ref} className="mlight">
      <div className="mlight__stage">
        <motion.div className="mlight__img" style={{ clipPath: clip }}>
          <motion.div className="mlight__inner" style={{ scale }}>
            <Image src={img.balcony} alt="A balcony looking over the landscaped garden court" fill sizes="100vw" style={{ objectFit: "cover" }} />
          </motion.div>
          <motion.div className="mlight__shade" style={{ opacity: shade }} />
        </motion.div>

        <motion.div className="mlight__words" style={{ opacity: wordsO }} aria-hidden="true">
          <motion.span style={{ x: leftX }}>More light</motion.span>
          <motion.span style={{ x: rightX }}>
            <em>More life</em>
          </motion.span>
        </motion.div>

        <motion.div className="mlight__cap container" style={{ opacity: capO, y: capY }}>
          <p className="eyebrow eyebrow--line">More light · More life</p>
          <h2 className="display">
            Not just square feet. <em>Breathing room</em> for every resident.
          </h2>
          <p className="mlight__text">
            Every residence opens to a balcony and a 2&prime;0&Prime; wide planter edge, looking over the landscaped court
            rather than the street.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   04 — Amenity chapters: full-screen cards that stack as you scroll
   ================================================================ */
function Chapter({ c, i, n }: { c: (typeof chapters)[number]; i: number; n: number }) {
  const ref = useRef<HTMLElement>(null);
  const dwell = useRef<HTMLDivElement>(null);
  // the dwell spacer holds this card full-screen; once it has passed, the next card slides over
  const { scrollYProgress: p } = useScroll({ target: dwell, offset: ["end end", "end start"] });
  const scale = useRange(p, [0, 1], [1, i === n - 1 ? 1 : 0.88]);
  const dim = useRange(p, [0, 1], [0, i === n - 1 ? 0 : 0.7]);
  const imgY = useRange(p, [0, 1], ["0%", "12%"]);
  const enter = useScroll({ target: ref, offset: ["start end", "start start"] }).scrollYProgress;
  const imgScale = useRange(enter, [0, 1], [1.25, 1.05]);

  return (
    <>
    <section ref={ref} className="chap" style={{ zIndex: i + 1 }}>
      <motion.div className="chap__card" style={{ scale }}>
        <motion.div className="chap__media" style={{ y: imgY, scale: imgScale }}>
          <Image src={c.image} alt={`${c.kicker} ${c.title}`} fill sizes="100vw" style={{ objectFit: "cover" }} />
        </motion.div>
        <div className="chap__shade" />
        <motion.div className="chap__dim" style={{ opacity: dim }} />
        <div className="container chap__copy">
          <span className="chap__count">
            {String(i + 1).padStart(2, "0")} <i /> {String(n).padStart(2, "0")}
          </span>
          <div className="chap__head">
            <FadeUp y={24}>
              <p className="chap__kicker">{c.kicker}</p>
            </FadeUp>
            <SplitText as="h3" className="chap__title" stagger={0.04}>
              {c.title}
            </SplitText>
          </div>
          <FadeUp className="chap__text" delay={0.2}>
            <p>{c.text}</p>
          </FadeUp>
        </div>
      </motion.div>
    </section>
    <div ref={dwell} className="chap__dwell" aria-hidden="true" />
    </>
  );
}

export function Chapters() {
  return (
    <div className="chapters">
      {chapters.map((c, i) => (
        <Chapter key={c.title} c={c} i={i} n={chapters.length} />
      ))}
    </div>
  );
}

/* ================================================================
   05 — 21,500 sq ft: counter, 40% ring and parallax mosaic
   ================================================================ */
function Ring({ value }: { value: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <svg ref={ref} className="ring" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r={r} className="ring__track" />
      <motion.circle
        cx="60"
        cy="60"
        r={r}
        className="ring__value"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={inView ? { strokeDashoffset: c * (1 - value / 100) } : undefined}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
    </svg>
  );
}

function Column({ p, range, images }: { p: MotionValue<number>; range: [string, string]; images: { src: string; alt: string }[] }) {
  const y = useRange(p, [0, 1], range);
  return (
    <motion.div className="mosaic__col" style={{ y }}>
      {images.map((im) => (
        <div className="mosaic__tile" key={im.src}>
          <Image src={im.src} alt={im.alt} fill sizes="(max-width: 960px) 50vw, 25vw" style={{ objectFit: "cover" }} />
        </div>
      ))}
    </motion.div>
  );
}

export function AmenityArea() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <section ref={ref} className="section area">
      <div className="container area__grid">
        <div className="area__copy">
          <FadeUp y={16}>
            <p className="eyebrow eyebrow--line">02 — Upscaled amenities</p>
          </FadeUp>
          <div className="area__num">
            <Counter to={21500} duration={2.4} />
            <span>sq ft</span>
          </div>
          <FadeUp delay={0.1}>
            <p className="area__label">of amenities, for only {totals.residences} homes.</p>
          </FadeUp>
          <FadeUp className="area__ringrow" delay={0.2}>
            <div className="area__ring">
              <Ring value={40} />
              <strong>40%</strong>
            </div>
            <p>
              of the land is given to amenities: a lawn, water body, clubhouse, courts and gardens, set inside the five towers
              and away from the road.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <TLink href="/amenities" className="btn btn--ghost btn--lg">
              See all 30+ amenities <Arrow />
            </TLink>
          </FadeUp>
        </div>
        <div className="mosaic" aria-hidden="false">
          <Column
            p={p}
            range={["8%", "-12%"]}
            images={[
              { src: img.games, alt: "Indoor game zone" },
              { src: img.cafe, alt: "Outdoor café deck" },
            ]}
          />
          <Column
            p={p}
            range={["-6%", "10%"]}
            images={[
              { src: img.play, alt: "Toddler's play area" },
              { src: img.clubhouse, alt: "Clubhouse and zula court" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   06 — Spotlight amenities: pinned horizontal scroll
   ================================================================ */
export function Spotlights() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const x = useRange(scrollYProgress, [0, 1], [0, -dist]);
  const barX = useRange(scrollYProgress, [0, 1], [0, 1]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(spotlights.length - 1, Math.floor(v * spotlights.length))));

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      // pinned at every width: vertical scroll drives the track sideways
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={wrap} className="spot" style={{ height: dist ? `calc(100svh + ${dist}px)` : undefined }}>
      <div className="spot__sticky">
        <div className="container spot__head">
          <div>
            <p className="eyebrow eyebrow--line">03 — Everyday luxuries</p>
            <SplitText as="h2" className="display">
              An extension of home, <em>beyond its walls.</em>
            </SplitText>
          </div>
          <p className="spot__count" aria-hidden="true">
            <strong>{String(active + 1).padStart(2, "0")}</strong> / {String(spotlights.length).padStart(2, "0")}
          </p>
        </div>

        <motion.div ref={track} className="spot__track" style={{ x }}>
          {spotlights.map((s, i) => (
            <article key={s.name} className="scard" data-cursor="View">
              <div className="scard__media">
                <Image src={s.image} alt={s.name} fill sizes="(max-width: 960px) 80vw, 34vw" style={{ objectFit: "cover" }} />
              </div>
              <div className="scard__body">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </div>
            </article>
          ))}
          <TLink href="/amenities" className="scard scard--more" data-cursor="Open">
            <span>
              All <strong>30+</strong>
              <br />
              amenities
            </span>
            <Arrow />
          </TLink>
        </motion.div>

        <div className="container spot__progress" aria-hidden="true">
          <motion.span style={{ scaleX: barX }} />
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Location — brochure map with a live pin + nearby times
   ================================================================ */
export function Location({ eyebrow = "06 — Prime location" }: { eyebrow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useRange(scrollYProgress, [0, 1], [1.15, 1]);
  return (
    <section className="section loc">
      <div className="container loc__grid">
        <div>
          <SectionHead
            eyebrow={eyebrow}
            title={
              <>
                prime mark <em>location</em>
              </>
            }
            intro="A landmark address in the most soulful area of Adalaj, offering the ultimate connectivity to all your lifestyle needs. A bounty of necessities and entertainment just around the corner."
          />
          <div className="loc__list">
            {neighbourhood.map((g, gi) => (
              <FadeUp key={g.group} className="loc__group" delay={gi * 0.08}>
                <p className="eyebrow">{g.group}</p>
                <ul>
                  {g.items.map((it) => (
                    <li key={it.name}>
                      <span>{it.name}</span>
                      <i />
                      <strong>
                        <Counter to={it.time} duration={1.4} /> min
                      </strong>
                    </li>
                  ))}
                </ul>
              </FadeUp>
            ))}
          </div>
        </div>
        <FadeUp className="loc__mapwrap" delay={0.15}>
          <div ref={ref} className="loc__map">
            <motion.div className="loc__mapimg" style={{ scale }}>
              <Image src={img.map} alt="Location map: The Venezia beside the Narmada Canal off S.G. Highway, Adalaj" fill sizes="(max-width: 960px) 100vw, 55vw" style={{ objectFit: "cover" }} />
            </motion.div>
          </div>
          <address className="loc__addr">
            <strong>The Venezia</strong>
            {site.contact.address}
          </address>
        </FadeUp>
      </div>
    </section>
  );
}

/* ================================================================
   Developer — "A project by Manek", agencies
   ================================================================ */
export function Developer() {
  return (
    <section className="section dev">
      <div className="dev__bg" aria-hidden="true">
        <Image src={img.waves} alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
      </div>
      <div className="container">
        <FadeUp y={16} className="dev__by">
          <p className="eyebrow">A project by</p>
          <p className="dev__group">{developer.group.toUpperCase()}</p>
        </FadeUp>
        <SplitText as="p" className="dev__quote" stagger={0.025}>
          {developer.statement.join(" ")}
        </SplitText>

        <div className="agencies">
          <FadeUp y={16}>
            <p className="eyebrow eyebrow--line">With state-of-the-art agencies</p>
          </FadeUp>
          <ul>
            {agencies.map((a, i) => (
              <FadeUp as="li" key={a.role} delay={i * 0.06} className={i === 0 ? "is-lead" : ""}>
                <span>{a.role}</span>
                <strong>{a.name}</strong>
              </FadeUp>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
