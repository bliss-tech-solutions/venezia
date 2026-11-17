import wallData from "./walls.json";

/* ------------------------------------------------------------------
   THE VENEZIA — project data
   All dimensions, unit types and block layout are taken from the
   brochure plans. Availability is SAMPLE data generated
   deterministically so the explorer is fully interactive — replace
   `getStatus()` with your CRM / inventory feed before going live.
------------------------------------------------------------------- */

export type UnitTypeId = "A" | "B" | "C";
export type BlockId = "A" | "B" | "C" | "D" | "E";
export type Status = "available" | "reserved" | "sold";

export type Room = {
  id: string;
  name: string;
  dims: string;
  /** hotspot on the plan image, in the image's natural pixels [x0, y0, x1, y1] */
  box: [number, number, number, number];
  /** optional interior render for this room */
  render?: string;
  /** 360° panorama for this room */
  pano?: PanoId;
};

export type PanoId = "living" | "kitchen" | "master" | "bedroom" | "balcony" | "bathroom";

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3LH94kfiThcLHxbg9cgNJYkBbAD/";

/** 360° equirectangular panoramas (2:1). Local files are downloaded by scripts/fetch-panos.mjs;
 *  `remote` is a fallback. Replace with real site photography when available. */
export const panos: Record<PanoId, { src: string; remote: string; title: string; note: string }> = {
  living: { src: "/panos/living.png", remote: CDN + "hf_20261116_091310_e00d2db2-226d-48af-b8cf-4979408d69f5.jpeg", title: "Living Room", note: "Opens to the balcony through full-height glass" },
  kitchen: { src: "/panos/kitchen.png", remote: CDN + "hf_20261116_091310_13000599-7604-4def-a017-f3ce1b22f56f.jpeg", title: "Kitchen & Dining", note: "Modular kitchen with a mandir niche" },
  master: { src: "/panos/master.png", remote: CDN + "hf_20261116_091310_8561a5bb-ab45-412c-93f7-ba77f48c628a.jpeg", title: "Master Bedroom", note: "With attached toilet and planter edge" },
  bedroom: { src: "/panos/bedroom.png", remote: CDN + "hf_20261116_091311_84988225-8b2b-4571-950d-daa12735fb83.jpeg", title: "Bedroom 1", note: "A calm room for study or guests" },
  balcony: { src: "/panos/balcony.png", remote: CDN + "hf_20261116_091311_10c58ee3-508e-4e6b-9e67-a5416348d9e2.jpeg", title: "Balcony", note: "Planted edge with open views" },
  bathroom: { src: "/panos/bathroom.png", remote: CDN + "hf_20261116_091311_10c58ee3-508e-4e6b-9e67-a5416348d9e2.jpeg", title: "Balcony", note: "Planted edge with open views" },
};

export const panoOrder: PanoId[] = ["living", "kitchen", "master", "bedroom", "balcony"];

export type UnitType = {
  id: UnitTypeId;
  label: string;
  config: string;
  plan: { src: string; w: number; h: number };
  tagline: string;
  rooms: Room[];
};

/** Wall rectangles [x, y, w, h] traced from each plan image (scripts in README). */
export const walls = wallData as Record<"a" | "b" | "c", [number, number, number, number][]>;
export const wallsFor = (t: UnitTypeId) => walls[t.toLowerCase() as "a" | "b" | "c"];

export const site = {
  name: "The Venezia",
  short: "Venezia",
  tagline: "Where serenity flows in everyday life",
  description:
    "Architecture that stands out on the skyline, creating a landmark address defined by style and sophistication.",
  intro:
    "RM Enterprise presents exclusive residential towers, thoughtfully designed for generous space and contemporary living. At The Venezia, embrace the luxury your family deserves with the perfect 2 BHK homes.",
  interiorLine:
    "Enter a world where lavishness embraces you at every turn, where luxury becomes your constant companion, and opulence adorns your every step.",
  developer: "RM Enterprise",
  group: "Manek",
  contact: {
    phone: "+91 90700 78700",
    address: "B/h. Swarnim Greens, Nr. Narmada Canal, S.G. Highway, Adalaj – 382421",
    short: "S.G. Highway, Adalaj",
  },
  rera: "RERA: PR/GJ/GANDHINAGAR/GANDHINAGAR/Gandhinagar Urban Development Authority/RAA16759/230426/311230",
  reraShort: "RERA No. RAA16759/230426/311230",
};

/** Headline figures from the brochure. */
export const highlights = [
  { value: 14, suffix: "", pad: 2, label: "Storeys + GF", note: "Ground-floor retail" },
  { value: 5, suffix: "", pad: 2, label: "Iconic towers", note: "Blocks A – E" },
  { value: 280, suffix: "", pad: 0, label: "Residences", note: "All 2 BHK" },
  { value: 15, suffix: "", pad: 2, label: "Retail shops", note: "On S.G. Highway frontage" },
  { value: 30, suffix: "+", pad: 0, label: "Amenities", note: "21,500 sq ft dedicated" },
  { value: 2, suffix: "", pad: 2, label: "Basement levels", note: "Allotted car parking" },
];

const LIVING = "/images/b/living.jpg";
const KITCHEN = "/images/b/kitchen.jpg";

export const unitTypes: Record<UnitTypeId, UnitType> = {
  A: {
    id: "A",
    label: "Type A",
    config: "2 BHK",
    plan: { src: "/images/plan-a.png", w: 551, h: 434 },
    tagline: "A wide frontage of living, both bedrooms opening to a planted edge.",
    rooms: [
      { id: "drawing", name: "Drawing Room", dims: `11'0" × 17'0"`, box: [355, 100, 492, 325], render: LIVING, pano: "living" },
      { id: "kitchen", name: "Kitchen + Dining", dims: `10'0" × 14'0"`, box: [226, 215, 355, 385], render: KITCHEN, pano: "kitchen" },
      { id: "bed1", name: "Bedroom 1", dims: `10'0" × 10'6"`, box: [225, 70, 352, 205], pano: "bedroom" },
      { id: "bed2", name: "Bedroom 2 · Master", dims: `13'0" × 10'6"`, box: [60, 70, 222, 205], pano: "master" },
      { id: "balcony", name: "Balcony", dims: `11'0" × 5'0"`, box: [355, 70, 492, 100], pano: "balcony" },
      { id: "atoilet", name: "Attached Toilet", dims: `4'6" × 8'2"`, box: [58, 205, 115, 300] },
      { id: "ctoilet", name: "Common Toilet", dims: `4'6" × 8'2"`, box: [118, 205, 176, 300] },
      { id: "wash", name: "Wash", dims: `8'4" × 5'6"`, box: [118, 312, 224, 385] },
      { id: "store", name: "Store", dims: `3'4" × 4'6"`, box: [348, 330, 393, 385] },
      { id: "foyer", name: "Private Foyer", dims: `8'0" × 4'8"`, box: [396, 330, 494, 385] },
    ],
  },
  B: {
    id: "B",
    label: "Type B",
    config: "2 BHK",
    plan: { src: "/images/plan-b.png", w: 552, h: 410 },
    tagline: "A stepped corner plan with a larger principal suite set apart for privacy.",
    rooms: [
      { id: "drawing", name: "Drawing Room", dims: `11'0" × 17'0"`, box: [42, 95, 176, 305], render: LIVING, pano: "living" },
      { id: "kitchen", name: "Kitchen + Dining", dims: `10'0" × 14'0"`, box: [182, 190, 355, 340], render: KITCHEN, pano: "kitchen" },
      { id: "bed1", name: "Bedroom 1", dims: `10'0" × 10'6"`, box: [182, 45, 300, 185], pano: "bedroom" },
      { id: "bed2", name: "Bedroom 2 · Master", dims: `12'6" × 11'0"`, box: [358, 85, 515, 235], pano: "master" },
      { id: "balcony", name: "Balcony", dims: `11'0" × 5'0"`, box: [42, 52, 176, 95], pano: "balcony" },
      { id: "atoilet", name: "Attached Toilet", dims: `8'0" × 4'6"`, box: [418, 235, 515, 300] },
      { id: "ctoilet", name: "Common Toilet", dims: `4'2" × 7'5"`, box: [302, 95, 355, 185] },
      { id: "wash", name: "Wash", dims: `8'4" × 5'6"`, box: [305, 300, 413, 370] },
      { id: "store", name: "Store", dims: `3'4" × 4'6"`, box: [138, 305, 180, 345] },
      { id: "foyer", name: "Private Foyer", dims: `8'0" × 4'8"`, box: [42, 305, 135, 370] },
    ],
  },
  C: {
    id: "C",
    label: "Type C",
    config: "2 BHK",
    plan: { src: "/images/plan-c.png", w: 548, h: 532 },
    tagline: "A deep, gallery-like living room framed by a full-height balcony edge.",
    rooms: [
      { id: "drawing", name: "Drawing Room", dims: `17'0" × 11'0"`, box: [188, 57, 395, 175], render: LIVING, pano: "living" },
      { id: "kitchen", name: "Kitchen + Dining", dims: `14'0" × 10'0"`, box: [285, 178, 435, 320], render: KITCHEN, pano: "kitchen" },
      { id: "bed1", name: "Bedroom 1", dims: `10'6" × 10'0"`, box: [148, 178, 282, 320], pano: "bedroom" },
      { id: "bed2", name: "Bedroom 2 · Master", dims: `13'0" × 10'6"`, box: [97, 322, 278, 458], pano: "master" },
      { id: "balcony", name: "Balcony", dims: `5'0" × 11'0"`, box: [148, 60, 185, 175], pano: "balcony" },
      { id: "atoilet", name: "Attached Toilet", dims: `8'1" × 4'6"`, box: [280, 380, 383, 455] },
      { id: "ctoilet", name: "Common Toilet", dims: `4'6" × 5'9"`, box: [323, 322, 390, 378] },
      { id: "wash", name: "Wash", dims: `5'6" × 7'0"`, box: [392, 322, 455, 405] },
      { id: "store", name: "Store", dims: `4'6" × 2'0"`, box: [397, 172, 455, 195] },
      { id: "foyer", name: "Private Foyer", dims: `4'10" × 5'2"`, box: [397, 57, 455, 120] },
    ],
  },
};

/* ---------------- Site plan (typical floor) ---------------- */

export const sitePlan = { src: "/images/siteplan.png", w: 1112, h: 793 };

type Slot = { pos: 1 | 2 | 3 | 4; type: UnitTypeId; box: [number, number, number, number] };

export const blocks: Record<BlockId, { id: BlockId; wing: string; label: [number, number]; slots: Slot[] }> = {
  D: {
    id: "D",
    wing: "West wing",
    label: [205, 264],
    slots: [
      { pos: 3, type: "A", box: [122, 140, 205, 245] },
      { pos: 4, type: "A", box: [205, 140, 282, 245] },
      { pos: 2, type: "A", box: [122, 283, 205, 388] },
      { pos: 1, type: "B", box: [205, 283, 282, 388] },
    ],
  },
  E: {
    id: "E",
    wing: "West wing",
    label: [205, 530],
    slots: [
      { pos: 3, type: "A", box: [122, 405, 205, 512] },
      { pos: 4, type: "B", box: [205, 405, 282, 512] },
      { pos: 2, type: "A", box: [122, 548, 205, 660] },
      { pos: 1, type: "A", box: [205, 548, 282, 660] },
    ],
  },
  C: {
    id: "C",
    wing: "North court",
    label: [451, 245],
    slots: [
      { pos: 3, type: "C", box: [355, 138, 451, 228] },
      { pos: 4, type: "C", box: [451, 138, 547, 228] },
      { pos: 2, type: "C", box: [355, 262, 451, 352] },
      { pos: 1, type: "C", box: [451, 262, 547, 352] },
    ],
  },
  B: {
    id: "B",
    wing: "East wing",
    label: [705, 264],
    slots: [
      { pos: 1, type: "A", box: [625, 140, 705, 245] },
      { pos: 2, type: "A", box: [705, 140, 785, 245] },
      { pos: 4, type: "A", box: [625, 283, 705, 395] },
      { pos: 3, type: "A", box: [705, 283, 785, 395] },
    ],
  },
  A: {
    id: "A",
    wing: "East wing",
    label: [705, 530],
    slots: [
      { pos: 1, type: "B", box: [625, 405, 705, 512] },
      { pos: 2, type: "A", box: [705, 405, 785, 512] },
      { pos: 4, type: "A", box: [625, 548, 705, 665] },
      { pos: 3, type: "A", box: [705, 548, 785, 665] },
    ],
  },
};

export const blockOrder: BlockId[] = ["A", "B", "C", "D", "E"];

/* ---------------- Levels ---------------- */

export const LEVEL_MIN = 1;
export const LEVEL_MAX = 14;
export const levels = Array.from({ length: LEVEL_MAX - LEVEL_MIN + 1 }, (_, i) => LEVEL_MAX - i); // 14 → 1

/* Elevation image geometry (natural pixels of /images/elevation.jpg) */
export const elevation = {
  src: "/images/elevation.jpg",
  w: 2576,
  h: 1811,
  towers: [
    [482, 785],
    [875, 1150],
    [1210, 1498],
    [1604, 1874],
  ] as [number, number][],
  topY: 430,
  floorH: 78.8,
};

export function levelBand(level: number) {
  const y = elevation.topY + (LEVEL_MAX - level) * elevation.floorH;
  return { y, h: elevation.floorH };
}

/* ---------------- Units ---------------- */

export type Unit = {
  id: string; // e.g. "D-903"
  number: number; // 903
  level: number;
  block: BlockId;
  type: UnitTypeId;
  box: [number, number, number, number];
  status: Status;
};

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/** SAMPLE availability — replace with live inventory. */
function getStatus(id: string, level: number): Status {
  const r = hash(id + "venezia");
  const soldBias = level < 6 ? 0.12 : level > 11 ? 0.08 : 0;
  if (r < 0.24 + soldBias) return "sold";
  if (r < 0.38 + soldBias) return "reserved";
  return "available";
}

export const units: Unit[] = levels.flatMap((level) =>
  blockOrder.flatMap((b) =>
    blocks[b].slots.map((s) => {
      const number = level * 100 + s.pos;
      const id = `${b}-${number}`;
      return { id, number, level, block: b, type: s.type, box: s.box, status: getStatus(id, level) };
    }),
  ),
);

export const unitById = (id: string) => units.find((u) => u.id === id);
export const unitsOnLevel = (level: number) => units.filter((u) => u.level === level);

export const totals = {
  towers: blockOrder.length,
  levels: levels.length,
  residences: units.length,
  perFloor: units.length / levels.length,
};

export const statusLabel: Record<Status, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export const pad = (n: number) => String(n).padStart(2, "0");
