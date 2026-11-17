import type { Metadata, Viewport } from "next";
import { Outfit, Manrope } from "next/font/google";
import "./globals.css";
import "./premium.css";
import "./brand.css";
import "./feature.css";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteJsonLd } from "@/components/seo/JsonLd";
import { BASE_KEYWORDS, DEFAULT_DESCRIPTION, DEFAULT_TITLE, NOINDEX, SITE_LOCALE, SITE_NAME, SITE_URL } from "@/lib/seo";

const display = Outfit({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s · ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: BASE_KEYWORDS,
  authors: [{ name: "RM Enterprise" }],
  creator: "RM Enterprise",
  publisher: "RM Enterprise",
  category: "Real Estate",
  alternates: { canonical: "/" },
  robots: NOINDEX
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
      },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  // Google Search Console: set NEXT_PUBLIC_GSC_VERIFICATION to the token from the HTML-tag method
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Adalaj, Gandhinagar",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f2556",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SiteJsonLd />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
