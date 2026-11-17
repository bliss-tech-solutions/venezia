import type { Metadata } from "next";

/* ------------------------------------------------------------------
   SEO — one place for the site's URL, names and per-page metadata.
   Set NEXT_PUBLIC_SITE_URL to the live domain (e.g. https://www.example.com)
   so canonical URLs, the sitemap and share images resolve correctly.
------------------------------------------------------------------- */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/** Set NEXT_PUBLIC_NOINDEX=1 on staging / preview deployments to keep them out of search. */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "1";

export const SITE_NAME = "The Venezia";
export const SITE_LOCALE = "en_IN";

export const DEFAULT_TITLE = "The Venezia — 2 BHK Flats, S.G. Highway, Adalaj, Gandhinagar";
export const DEFAULT_DESCRIPTION =
  "The Venezia by RM Enterprise: 280 premium 2 BHK flats in five towers on S.G. Highway, Adalaj, with 30+ amenities across 21,500 sq ft. RERA registered.";

/** Phrases people actually search for; Google ignores the keywords tag, but other engines still read it. */
export const BASE_KEYWORDS = [
  "The Venezia",
  "The Venezia Adalaj",
  "2 BHK flats in Adalaj",
  "2 BHK flats on SG Highway",
  "2 BHK apartments Gandhinagar",
  "new residential projects in Adalaj",
  "RM Enterprise",
  "Manek",
  "RERA registered flats Gandhinagar",
];

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

type PageSeo = {
  /** used as `<title>` via the layout template "%s · The Venezia" */
  title: string;
  description: string;
  /** route path, e.g. "/amenities" */
  path: string;
  keywords?: string[];
  /** title used on social cards when it should differ from the page title */
  socialTitle?: string;
};

/**
 * Metadata for one page: unique title + description, canonical URL,
 * Open Graph and Twitter card. Share images come from each route's
 * opengraph-image.jpg / twitter-image.jpg files.
 */
export function pageMeta({ title, description, path, keywords = [], socialTitle }: PageSeo): Metadata {
  const social = socialTitle ?? `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    keywords: [...keywords, ...BASE_KEYWORDS],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url: path,
      title: social,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
    },
  };
}
