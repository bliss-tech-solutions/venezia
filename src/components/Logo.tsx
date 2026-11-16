"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { LOGO_VIEWBOX, WING_VIEWBOX, letterKeys, logoPaths as P } from "./logoPaths";

const ease = [0.22, 1, 0.36, 1] as const;

type LogoProps = {
  className?: string;
  /** play the reveal: rules draw, wing unfolds, letters rise */
  animate?: boolean;
  /** start the reveal (defaults to true when `animate` is set) */
  play?: boolean;
  /** delay before the reveal, in seconds */
  delay?: number;
  title?: string;
};

/**
 * The official The Venezia logo (vector trace of the supplied artwork).
 * Colour follows `currentColor`, so it works on navy and on white.
 */
export function Logo({ className = "", animate, play = true, delay = 0, title = "The Venezia" }: LogoProps) {
  const on = !animate || play;
  const clipId = `logo-clip-${useId().replace(/:/g, "")}`;
  const t = (d: number, dur = 1.2) => ({ duration: dur, ease, delay: delay + d });

  return (
    <svg className={`logo ${className}`} viewBox={LOGO_VIEWBOX} fill="currentColor" fillRule="evenodd" role="img" aria-label={title}>
      <title>{title}</title>

      {/* THE */}
      <motion.path
        d={P.the}
        initial={animate ? { opacity: 0, x: -24 } : false}
        animate={on ? { opacity: 1, x: 0 } : undefined}
        transition={t(0.35)}
      />

      {/* the two rules draw outward from the wing */}
      <motion.path
        d={P.ruleL}
        style={{ transformBox: "fill-box", transformOrigin: "100% 50%" }}
        initial={animate ? { scaleX: 0 } : false}
        animate={on ? { scaleX: 1 } : undefined}
        transition={t(0.25, 1.4)}
      />
      <motion.path
        d={P.ruleR}
        style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
        initial={animate ? { scaleX: 0 } : false}
        animate={on ? { scaleX: 1 } : undefined}
        transition={t(0.25, 1.4)}
      />

      {/* wing unfolds from its tip */}
      <motion.path
        d={P.wing}
        className="logo__wing"
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        initial={animate ? { opacity: 0, scaleY: 0.2, scaleX: 0.6 } : false}
        animate={on ? { opacity: 1, scaleY: 1, scaleX: 1 } : undefined}
        transition={t(0, 1.5)}
      />

      {/* Venezia: letters rise through a mask at the baseline */}
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="132" width="860" height="152" />
        </clipPath>
      </defs>
      <g clipPath={animate ? `url(#${clipId})` : undefined}>
        {letterKeys.map((k, i) => (
          <motion.path
            key={k}
            d={P[k]}
            initial={animate ? { y: 170 } : false}
            animate={on ? { y: 0 } : undefined}
            transition={t(0.45 + i * 0.07, 1.3)}
          />
        ))}
      </g>
    </svg>
  );
}

/** The wing on its own, for compact places (curtain, favicon-sized marks). */
export function Mark({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <svg className={`mark ${className}`} width={size} height={size} viewBox={WING_VIEWBOX} fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d={P.wing} />
    </svg>
  );
}

/** Header lock-up: the full logo at navigation size. */
export function Wordmark() {
  return <Logo className="wordmark" />;
}
