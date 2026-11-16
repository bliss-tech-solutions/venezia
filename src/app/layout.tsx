import type { Metadata, Viewport } from "next";
import { Outfit, Manrope } from "next/font/google";
import "./globals.css";
import "./premium.css";
import "./brand.css";
import "./feature.css";
import { SiteShell } from "@/components/site/SiteShell";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "The Venezia — 2 BHK Residences, S.G. Highway, Adalaj", template: "%s · The Venezia" },
  description:
    "280 premium 2 BHK residences in five towers on S.G. Highway, Adalaj, with 30+ amenities across 21,500 sq ft. Explore every floor with live availability, 3D plans and 360° interiors.",
  openGraph: {
    title: "The Venezia",
    description: "Where serenity flows in everyday life. 2 BHK residences on S.G. Highway, Adalaj.",
    images: ["/images/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f2556",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
