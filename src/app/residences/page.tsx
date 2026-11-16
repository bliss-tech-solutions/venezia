import type { Metadata } from "next";
import { Hero } from "@/components/explorer/Hero";
import { Plans } from "@/components/sections/Plans";
import { FloorShowcase } from "@/components/home/Feature";
import { Interiors } from "@/components/sections/Interiors";
import { CampusFeatures, Specifications } from "@/components/site/Extras";
import { CtaBand } from "@/components/site/Blocks";

export const metadata: Metadata = {
  title: "Residences",
  description:
    "Choose any of 14 floors at The Venezia, see live availability for all 280 homes, then open a 3D model and 360° tour of every 2 BHK residence.",
};

export default function ResidencesPage() {
  return (
    <main>
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
