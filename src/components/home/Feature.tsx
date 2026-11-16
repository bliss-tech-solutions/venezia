"use client";

import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { FadeUp, SplitText, ease, useRange } from "../motion";
import { TLink } from "../site/PageTransition";
import { Arrow } from "../site/Icon";

/** Room callouts on /images/floor-3d.jpg, as % of the image. */
const spots = [
  { id: "living", label: "Living room", note: "Opens to the balcony", x: 74, y: 58 },
  { id: "dining", label: "Dining", note: "Beside the kitchen island", x: 50, y: 48 },
  { id: "kitchen", label: "Kitchen", note: "Island with prep sink", x: 40, y: 58 },
  { id: "master", label: "Master bedroom", note: "With attached toilet", x: 42, y: 24 },
  { id: "bed", label: "Bedroom", note: "Calm, garden-facing", x: 62, y: 36 },
  { id: "balcony", label: "Balcony", note: "Planted edge", x: 81, y: 40 },
];

/**
 * A representative 3D cut-away of a residence. The image tilts up as it
 * scrolls in and the room callouts can be hovered or tapped.
 */
export function FloorShowcase({ eyebrow = "A 3D walk-through" }: { eyebrow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useRange(p, [0, 1], [24, 0]);
  const scale = useRange(p, [0, 1], [0.86, 1]);
  const pinsO = useRange(p, [0.75, 1], [0, 1]);

  return (
    <section className="section showcase">
      <div className="container">
        <div className="showcase__head">
          <div>
            <FadeUp y={16}>
              <p className="eyebrow eyebrow--line">{eyebrow}</p>
            </FadeUp>
            <SplitText as="h2" className="display">
              Walk through <em>before you visit.</em>
            </SplitText>
          </div>
          <FadeUp delay={0.15} className="showcase__intro">
            <p>
              A private foyer opens to living, dining and kitchen, with both bedrooms set away from the entrance and a
              balcony along the planted edge.
            </p>
            <TLink href="/residences" className="btn btn--link">
              Explore every plan in 3D <Arrow />
            </TLink>
          </FadeUp>
        </div>

        <div ref={ref} className="showcase__stage">
          <motion.div className="showcase__frame" style={{ rotateX, scale }}>
            <Image
              src="/images/floor-3d.jpg"
              alt="Representative 3D cut-away of a 2 BHK residence"
              fill
              sizes="(max-width: 960px) 100vw, 1200px"
              style={{ objectFit: "cover" }}
            />
            <motion.div className="showcase__pins" style={{ opacity: pinsO }}>
              {spots.map((s) => (
                <button
                  key={s.id}
                  className={`spin ${active === s.id ? "is-on" : ""}`}
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  onMouseEnter={() => setActive(s.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(s.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive((a) => (a === s.id ? null : s.id))}
                  aria-label={`${s.label}: ${s.note}`}
                >
                  <span className="spin__dot" />
                  <motion.span
                    className="spin__card"
                    initial={false}
                    animate={{ opacity: active === s.id ? 1 : 0, y: active === s.id ? 0 : 6 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <strong>{s.label}</strong>
                    <small>{s.note}</small>
                  </motion.span>
                </button>
              ))}
            </motion.div>
          </motion.div>
          <p className="showcase__note">Representative 3D view. Actual layouts follow the Type A, B and C plans.</p>
        </div>
      </div>
    </section>
  );
}
