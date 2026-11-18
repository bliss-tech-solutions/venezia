"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FadeUp, ease } from "../motion";
import { SectionHead } from "./Blocks";
import { Arrow } from "./Icon";
import { useExplorer } from "../explorer/ExplorerContext";
import {
  amenityGroups,
  campusFeatures,
  faqs,
  gallery,
  img,
  specs,
  spotlights,
  type GalleryItem,
} from "@/data/content";
import { site } from "@/data/project";

/* ------------------------------------------------------------------
   Accordion — used by specifications and FAQs
------------------------------------------------------------------- */
export function Accordion({
  items,
  numbered,
}: {
  items: { title: string; text: string }[];
  numbered?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="acc">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <FadeUp
            key={it.title}
            className={`acc__item ${on ? "is-open" : ""}`}
            delay={i * 0.05}
            y={20}
          >
            <button
              className="acc__head"
              onClick={() => setOpen(on ? null : i)}
              aria-expanded={on}
            >
              {numbered && (
                <span className="acc__n">{String(i + 1).padStart(2, "0")}</span>
              )}
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
            <FadeUp
              key={f.title}
              className="campus__item"
              delay={(i % 3) * 0.08}
            >
              <span className="campus__n">
                {String(i + 1).padStart(2, "0")}
              </span>
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
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>
                {site.contact.phone}
              </a>
              .
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
            <FadeUp
              key={sp.name}
              className="spotgrid__card"
              delay={(i % 3) * 0.08}
            >
              <button
                onClick={() =>
                  openLightbox({
                    src: sp.image,
                    title: sp.name,
                    caption: sp.text,
                  })
                }
                data-cursor="View"
              >
                <span className="spotgrid__media">
                  <Image
                    src={sp.image}
                    alt={sp.name}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
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
        <FadeUp delay={0.1}>
          <AmenityTabs />
        </FadeUp>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Amenity tabs: one category at a time, as icon tiles, with a
   proportional summary bar that doubles as navigation.
------------------------------------------------------------------- */
const groupNotes: Record<string, string> = {
  "Leisure & community":
    "Gardens, water and gathering spaces around the central court.",
  "Sport & play": "Courts, a gym and play areas for every age.",
  "Safety & security": "Round-the-clock protection for every resident.",
  "Everyday convenience": "The practical details that make daily life easy.",
};

/* simple line icons on a 24×24 grid, keyed by amenity name */
const amenityIcon: Record<string, React.ReactNode> = {
  "Lavish Central Foyer": <path d="M4 20V9l8-5 8 5v11M9 20v-6h6v6M4 20h16" />,
  "Tranquil Water Body": (
    <path d="M3 15c2 0 2 1.5 4.5 1.5S10 15 12 15s2 1.5 4.5 1.5S19 15 21 15M3 19c2 0 2 1.5 4.5 1.5S10 19 12 19s2 1.5 4.5 1.5S19 19 21 19M12 11V4m0 0c-2 1-3 2.5-3 4m3-4c2 1 3 2.5 3 4" />
  ),
  "Landscape Garden": (
    <path d="M12 21v-7m0 0c-4 0-6-3-6-6 3 0 6 2 6 6Zm0 0c4 0 6-3 6-6-3 0-6 2-6 6ZM4 21h16" />
  ),
  "Banquet Hall": (
    <path d="M4 20h16M6 20v-6m12 6v-6M3 14h18M12 4a6 6 0 0 1 6 6H6a6 6 0 0 1 6-6Zm0 0V3" />
  ),
  "Zula Court": <path d="M5 4h14M8 4v9m8-9v9M6 13h12v3H6zM4 20h16" />,
  "Party Lawn": <path d="M4 20c3-3 13-3 16 0M8 4l1 5m4-6v6m4-5-1 5M7 9h10" />,
  Gazebo: <path d="m3 9 9-5 9 5M5 9v11m14-11v11M3 20h18M9 20v-5h6v5" />,
  "Open Space": (
    <path d="M3 18c3-4 5-6 9-6s6 2 9 6M3 18h18M17 6a2 2 0 1 0 0 .01" />
  ),
  "Satsang Hall": (
    <path d="M12 6a2 2 0 1 0 0 .01M8 21l1.5-7h5L16 21M6 14c2-2 10-2 12 0M7 21h10" />
  ),
  Library: <path d="M5 4h3v16H5zM10 4h3v16h-3zM15.5 5l3 .8-3.6 14.5-3-.8" />,
  "Well Equipped Gymnasium": <path d="M3 12h18M6 8v8M9 9v6M18 8v8m-3-7v6" />,
  "Multipurpose Court": (
    <path d="M3 5h18v14H3zM12 5v14M12 12a3 3 0 1 0 0 .01" />
  ),
  "Box Cricket": (
    <path d="m5 19 9-9m0 0 3-3 2 2-3 3m-2-2 2 2M5 19l-1 1M18 18a2 2 0 1 0 0 .01" />
  ),
  "Indoor Game Zone": (
    <path d="M4 8h16v10H4zM8 13h3m-1.5-1.5v3M15 12.5v.01M17 14.5v.01M9 8l3-4 3 4" />
  ),
  "Toddler's Play Area": (
    <path d="M4 20V8l4-4 4 4v12M12 12h4l4 8M4 20h16M8 12v.01" />
  ),
  "24 × 7 Trained Security": (
    <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Zm-3 9 2 2 4-4" />
  ),
  "24 × 7 CCTV": <path d="m3 8 13-3 2 6-13 3zM6 13l1 3H3M18 9l3 1-1 3" />,
  "Fire Hydrant System": (
    <path d="M8 21h8M9 21V9h6v12M8 9h8M10 9V6a2 2 0 0 1 4 0v3M9 13H6m12 0h-3" />
  ),
  "24 × 7 Water Supply": (
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
  ),
  "2 Basement Car Parking": (
    <path d="M5 16h14v-4l-2-5H7l-2 5v4Zm0-4h14M7 16v2m10-2v2" />
  ),
  "Parcel Zone": (
    <path d="m12 3 8 4v10l-8 4-8-4V7l8-4Zm0 8 8-4m-8 4L4 7m8 4v10" />
  ),
  "Pickup / Drop-off Zone": (
    <path d="M5 17h14v-5l-2-4H7l-2 4v5ZM7 17v2m10-2v2M3 12h18M12 3v3" />
  ),
  "Society Office": (
    <path d="M4 20V6h10v14M14 10h6v10M3 20h18M7 9h2M7 13h2M7 17h2" />
  ),
  "Meter Room": <path d="M6 3h12v18H6zM9 7h6v4H9zM10 15h.01M14 15h.01" />,
  "Service Area": (
    <path d="M14 6a4 4 0 0 0-5 5l-5 5 3 3 5-5a4 4 0 0 0 5-5l-2 2-3-3 2-2Z" />
  ),
  "Store Room": <path d="M4 9 12 4l8 5v11H4zM8 20v-7h8v7M8 16h8" />,
  "Male & Female Washrooms": (
    <path d="M7 5a1.5 1.5 0 1 0 0 .01M17 5a1.5 1.5 0 1 0 0 .01M12 3v18M5 9h4v6H8v5H6v-5H5zM15 9h4l1 6h-2v5h-2v-5h-2z" />
  ),
};

function AmenityTabs() {
  const [active, setActive] = useState(0);
  const g = amenityGroups[active];
  const offset = amenityGroups
    .slice(0, active)
    .reduce((n, x) => n + x.items.length, 0);

  return (
    <div className="atabs">
      <div
        className="atabs__nav"
        role="tablist"
        aria-label="Amenity categories"
      >
        {amenityGroups.map((grp, i) => (
          <button
            key={grp.group}
            role="tab"
            id={`atab-${i}`}
            aria-selected={active === i}
            aria-controls="atab-panel"
            className={`atabs__tab ${active === i ? "is-on" : ""}`}
            onClick={() => setActive(i)}
          >
            {active === i && (
              <motion.span
                layoutId="atab-pill"
                className="atabs__pill"
                transition={{ duration: 0.5, ease }}
              />
            )}
            <span className="atabs__label">{grp.group}</span>
            <span className="atabs__count">
              {String(grp.items.length).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      <div
        className="atabs__panel"
        id="atab-panel"
        role="tabpanel"
        aria-labelledby={`atab-${active}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={g.group}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease }}
          >
            <div className="atabs__head">
              <strong className="atabs__big">
                {String(g.items.length).padStart(2, "0")}
              </strong>
              <div>
                <h3>{g.group}</h3>
                <p>{groupNotes[g.group]}</p>
              </div>
            </div>
            <ul className="atiles">
              {g.items.map((it, i) => (
                <motion.li
                  key={it}
                  className="atile"
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease, delay: 0.05 + i * 0.035 }}
                >
                  <span className="atile__ico">
                    <svg
                      className="atile__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {amenityIcon[it] ?? <path d="M12 4v16M4 12h16" />}
                    </svg>
                  </span>
                  <span className="atile__name">{it}</span>
                  <span className="atile__n">
                    {String(offset + i + 1).padStart(2, "0")}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="atabs__sum">
        <p>
          <strong>{amenityGroups.length} categories</strong> across{" "}
          <strong>21,500 sq ft</strong> of amenities, about 40% of the land
        </p>
        <div className="atabs__bar" aria-hidden="true">
          {amenityGroups.map((grp, i) => (
            <button
              key={grp.group}
              tabIndex={-1}
              className={active === i ? "is-on" : ""}
              style={{ flexGrow: grp.items.length }}
              onClick={() => setActive(i)}
              title={`${grp.group}: ${grp.items.length}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanThumb() {
  const { openLightbox } = useExplorer();
  return (
    <button
      className="planthumb"
      data-cursor="Zoom"
      onClick={() =>
        openLightbox({
          src: img.groundplan,
          title: "Ground floor plan",
          caption:
            "Lawn, water feature, banquet hall, courts and clubhouse around the central court",
        })
      }
    >
      <span className="planthumb__img">
        <Image
          src={img.groundplan}
          alt="Ground floor plan showing the amenity court"
          fill
          sizes="(max-width: 960px) 100vw, 40vw"
          style={{ objectFit: "cover" }}
        />
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
const cats = [
  "All",
  "Exterior",
  "Amenities",
  "Interiors",
  "360°",
  "Plans",
] as const;

export function Gallery() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const { openLightbox, openPano } = useExplorer();
  const list = useMemo(
    () => (cat === "All" ? gallery : gallery.filter((g) => g.cat === cat)),
    [cat],
  );

  const open = (g: GalleryItem) => {
    if (g.pano) openPano(g.pano);
    else
      openLightbox({
        src: g.src,
        title: g.title,
        caption: `${g.cat} · Artist's impression`,
      });
  };

  return (
    <section className="section gallery">
      <div className="container">
        <div
          className="gallery__filters"
          role="tablist"
          aria-label="Filter gallery"
        >
          {cats.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              className={`chip ${cat === c ? "chip--on" : ""}`}
              onClick={() => setCat(c)}
            >
              {cat === c && (
                <motion.span
                  layoutId="gal-chip"
                  className="chip__bg"
                  transition={{ duration: 0.5, ease }}
                />
              )}
              <span>{c}</span>
              <small>
                {c === "All"
                  ? gallery.length
                  : gallery.filter((g) => g.cat === c).length}
              </small>
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
                transition={{
                  duration: 0.7,
                  ease,
                  delay: Math.min(i, 8) * 0.04,
                }}
              >
                <span className="gtile__media">
                  <Image
                    src={g.src}
                    alt={g.title}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
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
