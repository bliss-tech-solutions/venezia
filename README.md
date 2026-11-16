# The Venezia — Interactive Residences Website

A premium, interactive sales website for **The Venezia**, built with **Next.js 15 (App Router), React 19, TypeScript and Framer Motion**. The 3D model uses CSS 3D and the 360° viewer uses raw WebGL, so no heavy 3D libraries are needed and it runs smoothly on phones.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Requires Node 18.18+ (Node 20+ recommended). Fonts (Cormorant Garamond + Manrope) load through `next/font/google`, so the first build needs internet access.

## Pages

| Route | What's on it |
|---|---|
| `/` | Pinned hero (the dusk render opens out of an arched window), "live uncompromisingly" + brochure figures, "More light · More life" reveal, stacked amenity chapters, 21,500 sq ft / 40% section, horizontal amenity gallery, residence types, explorer teaser, 360° band, location, developer & agencies |
| `/about` | RM Enterprise / Manek story, promise, four principles, agencies, project journey |
| `/residences` | The floor explorer (below), floor plans, interiors, specifications, campus features |
| `/amenities` | 21,500 sq ft section, amenity chapters, photo cards, the full 30+ list with ground-floor plan, campus features, masterplan, retail |
| `/gallery` | Filterable gallery; photos open the lightbox, 360° tiles open the panorama viewer |
| `/contact` | Enquiry form, location with travel times, FAQ |

**Content source.** Copy, figures, specifications, amenities, agencies, travel times, address, phone numbers and RERA number come from *The Venezia – Brochure FV*. The renders in `public/images/b/` were extracted from the brochure. Editorial content lives in `src/data/content.ts`, and project facts in `src/data/project.ts`.

**Logo.** The official logo is traced to vector in `public/brand/venezia-logo.svg` (wing mark alone: `venezia-mark.svg`). In code it is `<Logo />` / `<Mark />` from `src/components/Logo.tsx`; colour follows `currentColor`, and `<Logo animate />` reveals it part by part. The parts live in `src/components/brand/logoPaths.ts`.

**3D floor.** `public/images/floor-3d.jpg` is a representative render (labelled as an artist's impression on the page). Room hotspots are percentages in `spots` in `src/components/home/Feature.tsx`.

**Type system.** `src/app/brand.css` defines one scale (`--t-micro` … `--t-hero`) and every `font-size` in the site uses it. Display type is Outfit (light geometric sans, close to the brochure), body is Manrope. Accent words are coloured (`--sky` on dark, `--sky-ink` on light), never italic.

**Motion.** Lenis smooth scrolling, a curtain between pages, and scroll-linked sections built with Framer Motion. Use `useRange()` from `src/components/motion` (not `useTransform` with keyframe arrays) for scroll-linked opacity and clip-path: Framer Motion 12 hands those to a native scroll timeline that ignores the offsets of pinned sections.

**Still to confirm before launch:** the sales email address (not in the brochure, so none is shown), the project-journey status in `content.ts`, and live availability (see below).

## The experience

1. **Select-floor hero**: the opening screen of `/residences` is the full building, and every residential level (01–14) can be clicked. There is an elevator rail, Type A, B and C filters, "Available only", and a tooltip that follows the cursor.
2. **Choose a floor**: hover any of levels 01–14 to see live counts, then click it. The camera dives into that floor and the typical floor plan opens with all 20 flats colour-coded.
3. **3D flat**: picking a flat opens a **rotatable 3D model** built from its real plan. The plan is the floor and every traced wall is extruded, so the walls rise out of the plan when it opens. **Scroll rotates it**, drag orbits it (including on touch), and ⟲ ⌖ ⟳ buttons are provided. You can also switch between **3D Model** and **2D Plan**.
4. **360° rooms**: click a room pin (Living, Kitchen + Dining, both bedrooms, Balcony). The camera flies into that room, and then an immersive **360° viewer** opens. Drag or swipe to look around, scroll or pinch to zoom; the view has inertia and drifts slowly when idle. You can also go full screen, switch rooms, or book a visit.

**Deep links:** `/residences?level=9`, `/residences?unit=D-903` and `/residences?unit=D-903&room=master` (they work on any page). `Esc` steps back one level.

## 360° panoramas

`public/panos/*.jpg` are 2:1 equirectangular images, generated to match the brochure interiors. `npm run dev` and `npm run build` download them automatically through `scripts/fetch-panos.mjs`. **To use real site photography,** drop your own 2:1 panoramas in with the same names; existing files are never overwritten. The viewer is a dependency-free WebGL renderer (`src/lib/panoRenderer.ts`).

## 3D model

Walls are rectangles traced from the plan images and stored in `src/data/walls.json`. They were detected as dark wall strokes and then split into horizontal and vertical runs. If you swap in a new plan, re-trace it with the same approach or edit the JSON by hand. Each entry is `[x, y, width, height]` in plan-image pixels.

## Brand colours

The palette is set in `:root` at the top of `src/app/globals.css`: navy `#0f2556`, white, and deep navy-dark (`#0a1430`). Light sections use white with navy accents; dark sections use navy-dark with white accents.

## Where things live

```
src/
  app/
    layout.tsx           fonts, metadata
    page.tsx             page composition
    globals.css          the whole design system (tokens, components, responsive)
    api/enquire/route.ts enquiry endpoint (connect it to your CRM)
  data/project.ts        ← ALL project data: unit types, room sizes, plan hotspots,
                           block layout, elevation geometry, contact details
  components/
    explorer/            ExplorerContext, Hero, FloorView, ResidenceView, Flat3D, PanoViewer, Lightbox
  lib/panoRenderer.ts    WebGL equirectangular renderer
  data/walls.json        traced wall geometry for the 3D model
    sections/            Story, Plans, Masterplan, Interiors, Retail, Enquire, Footer
    Header, Preloader, Logo, Reveal
public/images/           elevation, site plan, unit plans, interiors, retail strip
```

## Before going live, update these

- **Availability is sample data.** Statuses come from a seeded generator, `getStatus()` in `src/data/project.ts`. Replace it with your inventory feed. A simple map such as `{ "D-903": "sold" }` or a fetch in a server component will do.
- **Contact details and RERA number** are from the brochure (`site` in `src/data/project.ts`). Add a sales email there if you want one shown.
- **Enquiries:** `src/app/api/enquire/route.ts` currently only logs leads. Connect it to email (Resend, SES) or your CRM.
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` so the Open Graph image resolves correctly.
- **Amenity notes:** the Masterplan pins are read from the site plan drawing. Check the wording with the project team.

## Swapping images

To swap an image, replace the file in `public/images/` and keep the same name. If you use a different elevation render, update `elevation.towers`, `topY` and `floorH` in `project.ts` so the floor hotspots line up. These are measured in the image's own pixel coordinates. The same applies to the plan hotspots (`box` values).
