import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/site/Blocks";
import { AmenityList, AmenitySpotlights, CampusFeatures } from "@/components/site/Extras";
import { AmenityArea, Chapters } from "@/components/home/ScrollSections";
import { Masterplan } from "@/components/sections/Masterplan";
import { Retail } from "@/components/sections/Retail";

export const metadata: Metadata = {
  title: "Amenities",
  description:
    "30+ resort-style amenities across 21,500 sq ft: water body, party lawn, clubhouse, gymnasium, box cricket, multipurpose court, banquet and satsang halls.",
};

export default function AmenitiesPage() {
  return (
    <main>
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
