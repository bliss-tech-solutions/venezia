"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FadeUp, ease } from "../motion";
import { SectionHead } from "./Blocks";
import { Arrow } from "./Icon";
import { useExplorer } from "../explorer/ExplorerContext";
import { amenityGroups, campusFeatures, faqs, gallery, img, specs, spotlights, type GalleryItem } from "@/data/content";
import { site } from "@/data/project";

/* ------------------------------------------------------------------
   Accordion — used by specifications and FAQs
------------------------------------------------------------------- */
export function Accordion({ items, numbered }: { items: { title: string; text: string }[]; numbered?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="acc">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <FadeUp key={it.title} className={`acc__item ${on ? "is-open" : ""}`} delay={i * 0.05} y={20}>
            <button className="acc__head" onClick={() => setOpen(on ? null : i)} aria-expanded={on}>
              {numbered && <span className="acc__n">{String(i + 1).padStart(2, "0")}</span>}
              <span className="acc__title">{it.title}</span>
              <span className="acc__icon" aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  className="acc__body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                >
                  <p>{it.text}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeUp>
        );
      })}
    </div>
  );
}

export function Specifications() {
  return (
    <section id="specifications" className="section specs">
      <div className="container specs__grid">
        <SectionHead
          eyebrow="Specifications"
          title={
            <>
              Finished with <em>care</em>, room by room.
            </>
          }
          intro="The schedule of finishes from the project brochure. The final specification is as per the sale agreement."
        />
        <Accordion numbered items={specs} />
      </div>
    </section>
  );
}

export function CampusFeatures() {
  return (
    <section className="section campus">
      <div className="container">
        <SectionHead
          split
          eyebrow="Campus features"
          title={
            <>
              Built-in <em>peace of mind.</em>
            </>
          }
          intro="From the gate to your front door: two automatic lifts per block, a designer granite foyer and CCTV with 24-hour recording."
        />
        <div className="campus__grid">
          {campusFeatures.map((f, i) => (
            <FadeUp key={f.title} className="campus__item" delay={(i % 3) * 0.08}>
              <span className="campus__n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{f.title}</h3>
              <ul>
                {f.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section className="section faq">
      <div className="container specs__grid">
        <SectionHead
          eyebrow="Questions"
          title={
            <>
              Good to <em>know.</em>
            </>
          }
          intro={
            <>
              Can&rsquo;t find what you&rsquo;re looking for? Call us on{" "}
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>{site.contact.phone}</a>.
            </>
          }
        />
        <Accordion items={faqs.map((f) => ({ title: f.q, text: f.a }))} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Amenities page: spotlight cards + the full brochure list
------------------------------------------------------------------- */
export function AmenitySpotlights() {
  const { openLightbox } = useExplorer();
  return (
    <section className="section spotgrid">
      <div className="container">
        <SectionHead
          split
          eyebrow="Upscaled amenities"
          title={
            <>
              Practicality and <em>splendour</em>, blended.
            </>
          }
          intro="An extension of cherished moments beyond the walls of your home: 21,500 sq ft of amenities, about 40% of the land, for only 280 residences."
        />
        <div className="spotgrid__cards">
          {spotlights.map((sp, i) => (
            <FadeUp key={sp.name} className="spotgrid__card" delay={(i % 3) * 0.08}>
              <button onClick={() => openLightbox({ src: sp.image, title: sp.name, caption: sp.text })} data-cursor="View">
                <span className="spotgrid__media">
                  <Image src={sp.image} alt={sp.name} fill sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                </span>
                <span className="spotgrid__cap">
                  <strong>{sp.name}</strong>
                  <small>{sp.text}</small>
                </span>
              </button>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AmenityList() {
  let n = 0;
  return (
    <section className="section alist">
      <div className="container alist__grid">
        <div className="alist__head">
          <SectionHead
            eyebrow="The complete list"
            title={
              <>
                30+ reasons <em>to stay in.</em>
              </>
            }
          />
          <FadeUp className="alist__plan" delay={0.1}>
            <PlanThumb />
          </FadeUp>
        </div>
        <div className="alist__groups">
          {amenityGroups.map((g) => (
            <div key={g.group} className="alist__group">
              <FadeUp y={16}>
                <p className="eyebrow">{g.group}</p>
              </FadeUp>
              <ul>
                {g.items.map((it) => {
                  n += 1;
                  return (
                    <FadeUp as="li" key={it} y={16} delay={(n % 4) * 0.04}>
                      <span>{String(n).padStart(2, "0")}</span>
                      {it}
                    </FadeUp>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanThumb() {
  const { openLightbox } = useExplorer();
  return (
    <button
      className="planthumb"
      data-cursor="Zoom"
      onClick={() => openLightbox({ src: img.groundplan, title: "Ground floor plan", caption: "Lawn, water feature, banquet hall, courts and clubhouse around the central court" })}
    >
      <span className="planthumb__img">
        <Image src={img.groundplan} alt="Ground floor plan showing the amenity court" fill sizes="(max-width: 960px) 100vw, 40vw" style={{ objectFit: "cover" }} />
      </span>
      <span className="planthumb__cap">
        View the ground floor plan <Arrow />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------
   Gallery: filterable masonry; photos open the lightbox, 360° tiles
   open the panorama viewer.
------------------------------------------------------------------- */
const cats = ["All", "Exterior", "Amenities", "Interiors", "360°", "Plans"] as const;

export function Gallery() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const { openLightbox, openPano } = useExplorer();
  const list = useMemo(() => (cat === "All" ? gallery : gallery.filter((g) => g.cat === cat)), [cat]);

  const open = (g: GalleryItem) => {
    if (g.pano) openPano(g.pano);
    else openLightbox({ src: g.src, title: g.title, caption: `${g.cat} · Artist's impression` });
  };

  return (
    <section className="section gallery">
      <div className="container">
        <div className="gallery__filters" role="tablist" aria-label="Filter gallery">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={`chip ${cat === c ? "chip--on" : ""}`} onClick={() => setCat(c)}>
              {cat === c && <motion.span layoutId="gal-chip" className="chip__bg" transition={{ duration: 0.5, ease }} />}
              <span>{c}</span>
              <small>{c === "All" ? gallery.length : gallery.filter((g) => g.cat === c).length}</small>
            </button>
          ))}
        </div>

        <motion.div layout className="gallery__grid">
          <AnimatePresence mode="popLayout">
            {list.map((g, i) => (
              <motion.button
                layout
                key={g.src}
                className={`gtile gtile--${g.cat === "Plans" ? "plan" : g.pano ? "pano" : "photo"}`}
                onClick={() => open(g)}
                data-cursor={g.pano ? "Drag" : "View"}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.7, ease, delay: Math.min(i, 8) * 0.04 }}
              >
                <span className="gtile__media">
                  <Image src={g.src} alt={g.title} fill sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </span>
                {g.pano && <span className="gtile__badge">360°</span>}
                <span className="gtile__cap">
                  <small>{g.cat}</small>
                  <strong>{g.title}</strong>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
