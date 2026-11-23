import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Venezia — 2 BHK Residences, Adalaj",
    short_name: "The Venezia",
    description: "The Venezia by RM Enterprise: 280 premium 2 BHK flats in five towers on S.G. Highway, Adalaj, with 30+ amenities across 21,500 sq ft. RERA registered.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1430",
    theme_color: "#0f2556",
    lang: "en-IN",
    categories: ["lifestyle", "business"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
