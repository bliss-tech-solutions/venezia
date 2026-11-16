/* ------------------------------------------------------------------
   THE VENEZIA — editorial content for the marketing pages
   Source: "The Venezia – Brochure FV". Project facts (blocks, levels,
   plans) come from ./project.ts. Anything marked ⚠️ is not in the
   brochure — confirm with the developer before launch.
------------------------------------------------------------------- */

import type { PanoId } from "./project";

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/residences", label: "Residences" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

/** Renders extracted from the brochure (public/images/b). */
export const img = {
  front: "/images/b/front.jpg",
  dusk: "/images/b/dusk.jpg",
  aerial: "/images/b/aerial.jpg",
  balcony: "/images/b/balcony.jpg",
  water: "/images/b/water.jpg",
  clubhouseLawn: "/images/b/clubhouse-lawn.jpg",
  lawn: "/images/b/lawn.jpg",
  clubhouse: "/images/b/clubhouse.jpg",
  games: "/images/b/indoor-games.jpg",
  play: "/images/b/play.jpg",
  cafe: "/images/b/cafe.jpg",
  pickleball: "/images/b/pickleball.jpg",
  cricket: "/images/b/cricket.jpg",
  kitchen: "/images/b/kitchen.jpg",
  living: "/images/b/living.jpg",
  map: "/images/b/map.jpg",
  groundplan: "/images/b/groundplan.jpg",
  waves: "/images/b/waves.jpg",
};

export const developer = {
  name: "RM Enterprise",
  group: "Manek",
  statement: [
    "We believe that a multi-generational investment should reflect the uniqueness it demands.",
    "It is our privilege to deliver eye-catching architecture, spacious luxury and true longevity in our 2 BHK that has no equal. After all, neither do you.",
  ],
  promise: "Not just square feet. We deliver breathing room to all our residents.",
};

export const agencies = [
  { role: "Developer", name: "RM Enterprise" },
  { role: "Architect", name: "Innovatiq Architects" },
  { role: "Structure", name: "Elevateng" },
  { role: "MEP", name: "Public Health Engineering" },
  { role: "Project execution", name: "Niran Infra Pvt. Ltd." },
  { role: "Landscape", name: "Woodpeckers Studio" },
  { role: "Sales agency", name: "Alpha Realty" },
];

export const pillars = [
  {
    n: "01",
    title: "Eye-catching architecture",
    text: "Five slender towers in pale stone and warm timber, framed by planters and a tree-lined promenade on S.G. Highway.",
  },
  {
    n: "02",
    title: "Spacious luxury",
    text: "Every home is a generous 2 BHK with a private foyer, balcony, separate wash area and a 2'0\" wide planter edge.",
  },
  {
    n: "03",
    title: "Room to breathe",
    text: "40% of the land is given to amenities: 21,500 sq ft of gardens, courts and clubhouse for only 280 homes.",
  },
  {
    n: "04",
    title: "True longevity",
    text: "Earthquake-resistant RCC frame, premium fittings and I.S.I. plumbing, specified to last for generations.",
  },
];

/** Project journey: phases only. ⚠️ Update `state` as work progresses. */
export const journey: { phase: string; title: string; text: string; state: "done" | "active" | "next" }[] = [
  { phase: "Phase 01", title: "Vision & design", text: "Architecture by Innovatiq Architects and landscape by Woodpeckers Studio, planned around a central garden court.", state: "done" },
  { phase: "Phase 02", title: "RERA registration", text: "Registered with the Gandhinagar Urban Development Authority (RAA16759/230426/311230).", state: "done" },
  { phase: "Phase 03", title: "Construction", text: "Structure by Elevateng and execution by Niran Infra Pvt. Ltd. across all five towers.", state: "active" },
  { phase: "Phase 04", title: "Finishing", text: "Façade, interiors, landscaping and amenity fit-out.", state: "next" },
  { phase: "Phase 05", title: "Handover", text: "Possession, with the sales team walking every owner through their new home.", state: "next" },
];

/** The amenity "chapters" used on the home page, with the brochure's own lines. */
export const chapters = [
  { kicker: "Resort style", title: "amenities", text: "A tranquil water body with cascading fountains greets you at the lavish central foyer.", image: img.water },
  { kicker: "An ode to a healthy", title: "lifestyle.", text: "A party lawn opens onto the clubhouse, with a well-equipped gymnasium on the upper floor.", image: img.clubhouseLawn },
  { kicker: "A vibrant start to your morning,", title: "everyday.", text: "Stepping-stone paths cross a landscaped lawn shaded by flowering trees.", image: img.lawn },
  { kicker: "Live healthy.", title: "live well.", text: "Box cricket, a multipurpose court and a pickleball court, steps from your lift lobby.", image: img.cricket },
];

/** Amenity spotlight cards (home horizontal scroll + amenities page). */
export const spotlights = [
  { name: "Clubhouse & zula court", text: "Pergola swings beside the multipurpose court.", image: img.clubhouse },
  { name: "Indoor game zone", text: "Pool, carrom and chess in a daylit games room.", image: img.games },
  { name: "Toddler's play area", text: "Soft-surface play set in view of the lawn.", image: img.play },
  { name: "Outdoor café deck", text: "Timber deck seating under the trees.", image: img.cafe },
  { name: "Pickleball court", text: "A full court beside the glazed clubhouse.", image: img.pickleball },
  { name: "Box cricket", text: "Netted turf pitch for evening games.", image: img.cricket },
];

/** Full list from the brochure ("Upscaled amenities…"), grouped for the amenities page. */
export const amenityGroups = [
  {
    group: "Leisure & community",
    items: ["Lavish Central Foyer", "Tranquil Water Body", "Landscape Garden", "Banquet Hall", "Zula Court", "Party Lawn", "Gazebo", "Open Space", "Satsang Hall", "Library"],
  },
  {
    group: "Sport & play",
    items: ["Well Equipped Gymnasium", "Multipurpose Court", "Box Cricket", "Indoor Game Zone", "Toddler's Play Area"],
  },
  {
    group: "Safety & security",
    items: ["24 × 7 Trained Security", "24 × 7 CCTV", "Fire Hydrant System"],
  },
  {
    group: "Everyday convenience",
    items: ["24 × 7 Water Supply", "2 Basement Car Parking", "Parcel Zone", "Pickup / Drop-off Zone", "Society Office", "Meter Room", "Service Area", "Store Room", "Male & Female Washrooms"],
  },
];

export const campusFeatures = [
  { title: "Entrance gate", items: ["Elegant entrance gate", "Security cabin", "Well-designed project name plate"] },
  { title: "Lifts", items: ["Two automatic lifts for each block", "Intercom in lift cabin", "Lift with M.S./S.S. cabin"] },
  { title: "Roads", items: ["Well-finished paver block / R.C.C. road"] },
  { title: "Compound wall", items: ["Compound wall around the campus with provision of light points"] },
  { title: "Water tanks", items: ["Underground & overhead water tank in each building"] },
  { title: "Welcoming area", items: ["Designer granite foyer", "Name plate for flat holders", "CCTV with 24-hour recording for residents' safety"] },
];

export const specs = [
  { title: "Structure", text: "Earthquake-resistant R.C.C. frame work with brick masonry wall." },
  { title: "Flooring", text: "Vitrified tile flooring in living, dining and kitchen. Wooden-type tile flooring in the master bedroom." },
  { title: "Kitchen", text: "Granite platform with S.S. sink. Tiles up to lintel level." },
  { title: "Bathroom", text: "Premium-brand bath fittings. Tiles up to lintel level over dado and floor. Wall-hung water closet with seat cover and wall-hung wash basin." },
  { title: "Plumbing & sanitary", text: "I.S.I.-brand CPVC and UPVC plumbing and drainage piping." },
  { title: "Parking", text: "Allotted car park for all units, across two basement levels." },
  { title: "Wall finish", text: "Internal smooth plaster with white putty. External sand-face plaster with paint." },
  { title: "Windows", text: "Anodized / powder-coated aluminium sections with polished granite sills." },
  { title: "Doors", text: "Decorative main door with handle and safety lock. Engineered flush doors of good quality throughout." },
  { title: "Electrification", text: "Modular switches, concealed copper wiring and an M.C.B. in each flat. AC and TV points in the hall and both bedrooms." },
  { title: "Terrace", text: "Open terrace finished with suitable waterproofing and china mosaic for heat reflection." },
];

export const neighbourhood = [
  {
    group: "Landmarks",
    items: [
      { name: "Trimandir", time: 2 },
      { name: "Narmada Canal", time: 2 },
      { name: "Adani Shantigram", time: 5 },
      { name: "Vaishnodevi Circle", time: 10 },
    ],
  },
  {
    group: "Health",
    items: [
      { name: "Divine Multi Speciality Hospital", time: 8 },
      { name: "KD Hospital", time: 10 },
    ],
  },
  {
    group: "Shopping & leisure",
    items: [
      { name: "Swagat Holiday Mall", time: 8 },
      { name: "D-Mart", time: 10 },
      { name: "Connplex Cinemas (Signature)", time: 12 },
    ],
  },
];

export type GalleryItem = {
  src: string;
  title: string;
  cat: "Exterior" | "Amenities" | "Interiors" | "360°" | "Plans";
  pano?: PanoId;
};

export const gallery: GalleryItem[] = [
  { src: img.dusk, title: "The Venezia at dusk", cat: "Exterior" },
  { src: img.water, title: "Tranquil water body", cat: "Amenities" },
  { src: img.living, title: "Living & dining", cat: "Interiors" },
  { src: img.front, title: "Front elevation", cat: "Exterior" },
  { src: img.clubhouseLawn, title: "Clubhouse & party lawn", cat: "Amenities" },
  { src: "/panos/living.jpg", title: "Living room · 360°", cat: "360°", pano: "living" },
  { src: img.kitchen, title: "Kitchen & mandir", cat: "Interiors" },
  { src: img.aerial, title: "Campus from above", cat: "Exterior" },
  { src: img.balcony, title: "Balcony over the garden", cat: "Interiors" },
  { src: img.lawn, title: "Landscaped lawn", cat: "Amenities" },
  { src: "/panos/master.jpg", title: "Master bedroom · 360°", cat: "360°", pano: "master" },
  { src: img.games, title: "Indoor game zone", cat: "Amenities" },
  { src: img.play, title: "Toddler's play area", cat: "Amenities" },
  { src: img.groundplan, title: "Ground floor plan", cat: "Plans" },
  { src: img.cafe, title: "Outdoor café deck", cat: "Amenities" },
  { src: "/panos/balcony.jpg", title: "Balcony · 360°", cat: "360°", pano: "balcony" },
  { src: img.pickleball, title: "Pickleball court", cat: "Amenities" },
  { src: img.cricket, title: "Box cricket", cat: "Amenities" },
  { src: "/images/plan-a.png", title: "Type A residence", cat: "Plans" },
  { src: "/panos/kitchen.jpg", title: "Kitchen & dining · 360°", cat: "360°", pano: "kitchen" },
  { src: "/images/plan-b.png", title: "Type B residence", cat: "Plans" },
  { src: img.clubhouse, title: "Clubhouse & zula court", cat: "Amenities" },
  { src: "/images/plan-c.png", title: "Type C residence", cat: "Plans" },
  { src: "/panos/bedroom.jpg", title: "Bedroom · 360°", cat: "360°", pano: "bedroom" },
];

export const faqs = [
  {
    q: "Where is The Venezia?",
    a: "B/h. Swarnim Greens, near the Narmada Canal, S.G. Highway, Adalaj – 382421. Trimandir and the Narmada Canal are two minutes away, Adani Shantigram five.",
  },
  {
    q: "What configurations are available?",
    a: "Every residence is a 2 BHK, offered in three plan typologies: Type A, Type B (a stepped corner plan) and Type C (a deep, gallery-like living room). Each has a private foyer, balcony, kitchen with dining and a separate wash area.",
  },
  {
    q: "How big is the project?",
    a: "280 residences in five towers of 14 storeys above a ground floor, with 15 retail shops on the road frontage and two basement levels of parking.",
  },
  {
    q: "What amenities are included?",
    a: "More than 30, across 21,500 sq ft — about 40% of the land. They include a water body, landscaped lawn, banquet and satsang halls, gymnasium, box cricket, multipurpose court, indoor games, library and a toddler's play area.",
  },
  {
    q: "Is the project RERA registered?",
    a: "Yes. RERA No. PR/GJ/GANDHINAGAR/GANDHINAGAR/Gandhinagar Urban Development Authority/RAA16759/230426/311230.",
  },
  {
    q: "How do I book a site visit?",
    a: "Use the enquiry form or call +91 90700 78700 / +91 90990 75185. We will walk you through the sample residence, current availability and payment plans.",
  },
];
