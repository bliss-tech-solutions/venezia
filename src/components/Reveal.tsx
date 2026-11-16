"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  as?: "div" | "ol";
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

/** Fades + lifts its children in once they scroll into view. */
export function Reveal({ as = "div", children, className = "", delay = 0, id }: Props) {
  const M = as === "ol" ? motion.ol : motion.div;
  return (
    <M
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
    >
      {children}
    </M>
  );
}
