"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps } from "react";
import { Mark } from "../Logo";
import { nav } from "@/data/content";
import { useLenis } from "./SmoothScroll";

type Phase = "idle" | "cover" | "reveal";
type Ctx = { navigate: (href: string) => void };

const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const COVER_MS = 700;

const labelFor = (path: string) => nav.find((n) => n.href === path)?.label ?? "The Venezia";

function scrollToHash(hash: string, lenis: ReturnType<typeof useLenis>, immediate = false) {
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: -20, immediate, duration: 1.4 });
  else el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  return true;
}

/**
 * Curtain transition between pages: a navy panel rises over the page,
 * the route changes behind it, then the panel lifts away.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const pending = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const reveal = useCallback(() => {
    const target = pending.current;
    pending.current = null;
    const hash = target?.includes("#") ? target.slice(target.indexOf("#")) : window.location.hash;
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true, force: true });
    document.documentElement.classList.remove("is-covering");
    setPhase("reveal");
    if (hash) later(() => scrollToHash(hash, lenis), 650);
    later(() => setPhase("idle"), 1000);
  }, [lenis]);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }
      // Same page: just glide to the anchor / top
      if (url.pathname === window.location.pathname) {
        if (url.hash && scrollToHash(url.hash, lenis)) return;
        if (lenis) lenis.scrollTo(0, { duration: 1.4 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (pending.current) return;
      pending.current = href;
      setLabel(labelFor(url.pathname));
      setPhase("cover");
      document.documentElement.classList.add("is-covering");
      router.prefetch(url.pathname);
      later(() => router.push(url.pathname + url.search, { scroll: false }), COVER_MS);
      // safety: never leave the curtain down
      later(() => pending.current && reveal(), 4000);
    },
    [lenis, router, reveal],
  );

  // Route actually changed → lift the curtain
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (pending.current) {
      requestAnimationFrame(() => reveal());
    } else {
      // back / forward buttons
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div className={`curtain curtain--${phase}`} aria-hidden="true">
        <div className="curtain__panel">
          <div className="curtain__inner">
            <Mark size={44} className="curtain__mark" />
            <p className="curtain__label">{label}</p>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

/** Drop-in <Link> that plays the curtain transition. */
export function TLink({ href, onClick, children, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (rest.target === "_blank") return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
