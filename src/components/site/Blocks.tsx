"use client";

import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { FadeUp, Magnetic, SplitText, ease, useRange, useSiteReady } from "../motion";
import { TLink } from "./PageTransition";
import { Arrow } from "./Icon";
import { useExplorer } from "../explorer/ExplorerContext";

/* ------------------------------------------------------------------
   PageHero — inner-page opener: parallax image, split headline,
   breadcrumb, and a scroll cue.
------------------------------------------------------------------- */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  position = "center",
  crumb,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  image: string;
  position?: string;
  crumb: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const ready = useSiteReady();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useRange(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useRange(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="phero">
      <motion.div
        className="phero__media"
        style={{ y }}
        initial={{ scale: 1.18 }}
        animate={ready ? { scale: 1.04 } : undefined}
        transition={{ duration: 2.4, ease }}
      >
        <Image src={image} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: position }} />
      </motion.div>
      <div className="phero__shade" />
      <motion.div className="container phero__copy" style={{ opacity: fade }}>
        <motion.p
          className="crumb"
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          <TLink href="/">Home</TLink>
          <i />
          <span>{crumb}</span>
        </motion.p>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease, delay: 0.3 }}
        >
          {eyebrow}
        </motion.p>
        <SplitText as="h1" className="phero__title" onMount delay={0.35}>
          {title}
        </SplitText>
        {intro && (
          <motion.p
            className="phero__intro"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease, delay: 0.85 }}
          >
            {intro}
          </motion.p>
        )}
      </motion.div>
      <div className="phero__cue" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   SectionHead — eyebrow, split headline, optional intro.
------------------------------------------------------------------- */
export function SectionHead({
  eyebrow,
  title,
  intro,
  split,
  className = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  split?: boolean;
  className?: string;
}) {
  return (
    <div className={`section__head ${split ? "section__head--split" : ""} ${className}`}>
      <div>
        <FadeUp y={16}>
          <p className="eyebrow eyebrow--line">{eyebrow}</p>
        </FadeUp>
        <SplitText as="h2" className="display">
          {title}
        </SplitText>
      </div>
      {intro && (
        <FadeUp delay={0.2}>
          <p className="section__intro">{intro}</p>
        </FadeUp>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   CtaBand — closing call to action used at the foot of every page.
------------------------------------------------------------------- */
export function CtaBand({
  title = (
    <>
      See it <em>in person.</em>
    </>
  ),
  text = "Walk through the sample residence, see live availability and talk payment plans with our team, at a time that suits you.",
}: {
  title?: React.ReactNode;
  text?: string;
}) {
  const { enquire } = useExplorer();
  return (
    <section className="ctaband">
      <div className="ctaband__bg">
        <Image src="/images/b/dusk.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 40%" }} />
      </div>
      <div className="container ctaband__inner">
        <FadeUp y={16}>
          <p className="eyebrow eyebrow--line">Private visit</p>
        </FadeUp>
        <SplitText as="h2" className="ctaband__title">
          {title}
        </SplitText>
        <FadeUp delay={0.2}>
          <p className="ctaband__text">{text}</p>
        </FadeUp>
        <FadeUp delay={0.3} className="ctaband__actions">
          <Magnetic>
            <button className="btn btn--gold btn--lg" onClick={() => enquire()}>
              Book a private visit <Arrow />
            </button>
          </Magnetic>
          <TLink href="/residences" className="btn btn--ghost btn--lg">
            Explore residences
          </TLink>
        </FadeUp>
      </div>
    </section>
  );
}
