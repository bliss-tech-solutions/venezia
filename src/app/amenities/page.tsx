import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { PageHero, CtaBand } from "@/components/site/Blocks";
import { AmenityList, AmenitySpotlights, CampusFeatures } from "@/components/site/Extras";
import { AmenityArea, Chapters } from "@/components/home/ScrollSections";
import { Masterplan } from "@/components/sections/Masterplan";
import { Retail } from "@/components/sections/Retail";

export const metadata: Metadata = pageMeta({
  title: "30+ Amenities across 21,500 sq ft",
  description: "Resort-style amenities at The Venezia, Adalaj: water body, party lawn, clubhouse, gym, box cricket, banquet and satsang halls, across 21,500 sq ft.",
  path: "/amenities",
  socialTitle: "The Venezia — 30+ resort-style amenities across 21,500 sq ft",
  keywords: ["flats with clubhouse Adalaj", "gated community amenities Gandhinagar", "2 BHK with gym and garden", "box cricket society Gandhinagar"],
});

export default function AmenitiesPage() {
  return (
    <main>
      <BreadcrumbJsonLd name="Amenities" path="/amenities" />
      <PageHero
        crumb="Amenities"
        eyebrow="Resort-style amenities"
        title={
          <>
            Live healthy. <br />
            <em>Live well.</em>
          </>
        }
        intro="Embellished with the perfect blend of practicality and splendour: an extension of cherished moments beyond the walls of your home."
        image="/images/b/water.jpg"
        position="50% 60%"
      />
      <AmenityArea />
      <Chapters />
      <AmenitySpotlights />
      <AmenityList />
      <CampusFeatures />
      <Masterplan />
      <Retail />
      <CtaBand />
    </main>
  );
}
