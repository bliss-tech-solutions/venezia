"use client";

import { Logo } from "../Logo";
import { TLink } from "../site/PageTransition";
import { useLenis } from "../site/SmoothScroll";
import { Magnetic } from "../motion";
import { nav } from "@/data/content";
import { site } from "@/data/project";

export function Footer() {
  const lenis = useLenis();
  const top = () => (lenis ? lenis.scrollTo(0, { duration: 1.8 }) : window.scrollTo({ top: 0, behavior: "smooth" }));

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta">
          <p className="eyebrow">Your address awaits</p>
          <TLink href="/contact#enquire" className="footer__big" data-cursor="Visit">
            <span>Visit the</span> <em>sales gallery</em>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 19 19 5M8 5h11v11" />
            </svg>
          </TLink>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <Logo className="footer__logo" />
            <p className="footer__line">
              {site.tagline}. Developed by {site.developer}, a {site.group} project.
            </p>
          </div>

          <div className="footer__col">
            <p className="eyebrow">Explore</p>
            <nav aria-label="Footer">
              {nav.map((n) => (
                <TLink key={n.href} href={n.href} className="ulink">
                  {n.label}
                </TLink>
              ))}
            </nav>
          </div>

          <div className="footer__col">
            <p className="eyebrow">Sales gallery</p>
            <a className="ulink" href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>
              {site.contact.phone}
            </a>
            <p>{site.contact.address}</p>
          </div>

          <div className="footer__col">
            <p className="eyebrow">Experience</p>
            <TLink href="/residences" className="ulink">
              Select your floor
            </TLink>
            <TLink href="/gallery" className="ulink">
              360° interiors
            </TLink>
            <TLink href="/residences#plans" className="ulink">
              Floor plans
            </TLink>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p title={site.rera}>{site.reraShort}</p>
          <p className="footer__disclaimer">
            All images are artist&rsquo;s impressions. Plans, dimensions and availability are indicative and subject to
            change. This website does not constitute an offer or contract.
          </p>
          <Magnetic>
            <button className="footer__totop" onClick={top} aria-label="Back to top">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
