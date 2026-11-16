"use client";

import Image from "next/image";
import {
  animate,
  motion,
  transform,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Children, isValidElement, useEffect, useRef, useState, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-linked mapping computed on the main thread.
 * Framer Motion 12 hands opacity / clip-path mappings of a `useScroll`
 * value to a native ScrollTimeline, which ignores the target offsets on
 * pinned sections. The function form of useTransform opts out of that.
 */
export function useRange<T>(p: MotionValue<number>, input: number[], output: T[]): MotionValue<T> {
  return useTransform(p, (v: number) => transform(v, input, output) as T);
}
export const easeInOut = [0.7, 0, 0.2, 1] as const;

/* ------------------------------------------------------------------
   useSiteReady — true once the preloader has lifted (first visit) or
   immediately on later client-side navigations.
------------------------------------------------------------------- */
export function useSiteReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const check = () => html.classList.contains("is-ready") && !html.classList.contains("is-covering");
    if (check()) {
      setReady(true);
      return;
    }
    const mo = new MutationObserver(() => {
      if (check()) {
        setReady(true);
        mo.disconnect();
      }
    });
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return ready;
}

/* ------------------------------------------------------------------
   SplitText — each word rises out of its own mask.
   Accepts plain strings and inline elements (<em>, <br/>), so
   headings keep their italic accents.
------------------------------------------------------------------- */
type SplitProps = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  /** animate on mount (gated by preloader) instead of on scroll */
  onMount?: boolean;
};

export function SplitText({ children, as = "h2", className = "", delay = 0, stagger = 0.06, onMount }: SplitProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const ready = useSiteReady();
  const reduce = useReducedMotion();
  const show = onMount ? ready : inView && ready;

  let i = 0;
  const words = (node: ReactNode, wrap?: (c: ReactNode, k: string) => ReactNode): ReactNode[] => {
    const out: ReactNode[] = [];
    Children.forEach(node, (child) => {
      if (typeof child === "string" || typeof child === "number") {
        String(child)
          .split(/(\s+)/)
          .forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) {
              out.push(" ");
              return;
            }
            const idx = i++;
            const inner = (
              <motion.span
                className="split__word"
                initial={reduce ? false : { y: "110%", rotate: 4 }}
                animate={show || reduce ? { y: "0%", rotate: 0 } : undefined}
                transition={{ duration: 1.1, ease, delay: delay + idx * stagger }}
              >
                {w}
              </motion.span>
            );
            out.push(
              <span className="split__mask" key={`w${idx}`}>
                {wrap ? wrap(inner, `i${idx}`) : inner}
              </span>,
            );
          });
      } else if (isValidElement(child)) {
        const el = child as React.ReactElement<{ children?: ReactNode }>;
        if (el.type === "br") {
          out.push(<br key={`br${i++}`} />);
          return;
        }
        const Tag = el.type as React.ElementType;
        out.push(...words(el.props.children, (c, k) => <Tag key={k}>{c}</Tag>));
      }
    });
    return out;
  };

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={`split ${className}`}>
      {words(children)}
    </Tag>
  );
}

/* ------------------------------------------------------------------
   FadeUp — the workhorse reveal for blocks of content.
------------------------------------------------------------------- */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 40,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "ul" | "article";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </M>
  );
}

/* ------------------------------------------------------------------
   ParallaxImage — image drifts against the scroll inside its frame,
   revealed with a clip-path wipe when it first enters.
------------------------------------------------------------------- */
export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.14,
  sizes = "100vw",
  priority,
  reveal = true,
  position,
  cursor,
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  sizes?: string;
  priority?: boolean;
  reveal?: boolean;
  position?: string;
  cursor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useRange(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  return (
    <motion.div
      ref={ref}
      className={`pimg ${className}`}
      data-cursor={cursor}
      initial={reveal && !reduce ? { clipPath: "inset(12% 8% 12% 8%)" } : false}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.5, ease: easeInOut }}
    >
      <motion.div className="pimg__inner" style={reduce ? undefined : { y, scale: 1 + speed * 2 }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: "cover", objectPosition: position }} />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Counter — counts up once it scrolls into view.
------------------------------------------------------------------- */
export function Counter({ to, duration = 2, pad = 0, suffix = "" }: { to: number; duration?: number; pad?: number; suffix?: string }) {
  const fmt = (n: number) => (n >= 1000 ? n.toLocaleString("en-IN") : String(n).padStart(pad, "0"));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref} className="counter">
      {fmt(v)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------
   Magnetic — the child leans toward the pointer.
------------------------------------------------------------------- */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.span ref={ref} className={`magnetic ${className ?? ""}`} style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------
   ScrollText — words light up one by one as the block scrolls past.
------------------------------------------------------------------- */
function Word({ p, range, children }: { p: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useRange(p, range, [0.16, 1]);
  return (
    <motion.span className="stext__word" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

export function ScrollText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const list = text.split(" ");
  return (
    <p ref={ref} className={`stext ${className}`}>
      {list.map((w, i) => {
        const a = i / list.length;
        return (
          <Word key={i} p={scrollYProgress} range={[a, a + 1 / list.length]}>
            {w + " "}
          </Word>
        );
      })}
    </p>
  );
}

/* ------------------------------------------------------------------
   LineDraw — a hairline that draws itself in.
------------------------------------------------------------------- */
export function Hairline({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.span
      className={`hairline ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: easeInOut, delay }}
    />
  );
}
