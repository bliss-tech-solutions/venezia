import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/explorer/Hero";
import { Plans } from "@/components/sections/Plans";
import { FloorShowcase } from "@/components/home/Feature";
import { Interiors } from "@/components/sections/Interiors";
import { CampusFeatures, Specifications } from "@/components/site/Extras";
import { CtaBand } from "@/components/site/Blocks";

export const metadata: Metadata = pageMeta({
  title: "2 BHK Floor Plans & Live Availability",
  description: "Choose any of 14 floors at The Venezia, Adalaj and see live availability for 280 2 BHK homes. Compare Type A, B and C plans, then tour each in 3D and 360°.",
  path: "/residences",
  socialTitle: "Select your floor at The Venezia — 2 BHK plans in 3D & 360°",
  keywords: ["2 BHK floor plan", "2 BHK flats for sale Adalaj", "2 BHK flat SG Highway Gandhinagar", "flat availability", "3D floor plan", "360 virtual tour flat"],
});

export default function ResidencesPage() {
  return (
    <main>
      <BreadcrumbJsonLd name="Residences" path="/residences" />
      <Hero />
      <Plans />
      <FloorShowcase eyebrow="A 3D walk-through" />
      <Interiors />
      <Specifications />
      <CampusFeatures />
      <CtaBand
        title={
          <>
            Found the <em>one?</em>
          </>
        }
        text="Reserve a time with our sales team to walk through the sample residence and talk through availability and payment plans."
      />
    </main>
  );
}
