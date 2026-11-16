"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Logo";
import { useExplorer } from "./explorer/ExplorerContext";
import { TLink } from "./site/PageTransition";
import { Magnetic, ease, easeInOut } from "./motion";
import { nav } from "@/data/content";
import { site } from "@/data/project";

export function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [heroBrand, setHeroBrand] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverLink, setHoverLink] = useState<string | null>(null);
  const { view, close, enquire } = useExplorer();
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 60);
      // on the home page the hero carries the logo; the header shows it once that has scrolled away
      setHeroBrand(window.location.pathname === "/" && y < window.innerHeight * 0.55);
      // hide when scrolling down past the hero, reveal on any upward scroll
      setHidden(y > window.innerHeight * 0.5 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 80) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const go = () => {
    setOpen(false);
    if (view !== "building") close();
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const pill = hoverLink ?? nav.find((n) => isActive(n.href))?.href ?? null;

  return (
    <>
      <header
        className={`header ${heroBrand && !open ? "header--herobrand" : ""} ${solid ? "header--solid" : ""} ${hidden && !open ? "header--hidden" : ""} ${open ? "header--open" : ""}`}
      >
        <TLink href="/" className="header__brand" onClick={go} aria-label="The Venezia — home">
          <Wordmark />
        </TLink>

        <nav className="header__nav" aria-label="Primary" onMouseLeave={() => setHoverLink(null)}>
          {nav.map((l) => (
            <TLink
              key={l.href}
              href={l.href}
              onClick={go}
              onMouseEnter={() => setHoverLink(l.href)}
              className={isActive(l.href) ? "is-active" : ""}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {pill === l.href && <motion.span layoutId="nav-pill" className="header__pill" transition={{ duration: 0.5, ease }} />}
              <span>{l.label}</span>
            </TLink>
          ))}
        </nav>

        <Magnetic className="header__cta-wrap">
          <button className="btn btn--gold btn--sm header__cta" onClick={() => enquire()}>
            <span className="btn__label" data-text="Book a Visit">
              Book a Visit
            </span>
          </button>
        </Magnetic>

        <button
          className="header__burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.7, ease: easeInOut, delay: 0.15 } }}
            transition={{ duration: 0.8, ease: easeInOut }}
          >
            <nav className="menu__nav" aria-label="Menu">
              {nav.map((l, i) => (
                <span className="menu__mask" key={l.href}>
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%", transition: { duration: 0.4, ease } }}
                    transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.06 }}
                    style={{ display: "block" }}
                  >
                    <TLink href={l.href} onClick={go} className={isActive(l.href) ? "is-active" : ""}>
                      <small>{String(i + 1).padStart(2, "0")}</small>
                      {l.label}
                    </TLink>
                  </motion.span>
                </span>
              ))}
            </nav>
            <motion.div
              className="menu__foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.6 }}
            >
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>{site.contact.phone}</a>
              <a href={`tel:${site.contact.phone2.replace(/\s/g, "")}`}>{site.contact.phone2}</a>
              <button
                className="btn btn--gold"
                onClick={() => {
                  setOpen(false);
                  enquire();
                }}
              >
                Book a Private Visit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
