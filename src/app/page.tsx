import type { Metadata } from "next";
import { ResidenceJsonLd } from "@/components/seo/JsonLd";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageMeta } from "@/lib/seo";
import { ExplorerTeaser, ResidencesPreview, TourBand } from "@/components/home/HomeSections";
import { AmenityArea, Chapters, Developer, HeroScroll, Location, MoreLight, Spotlights, Statement } from "@/components/home/ScrollSections";
import { CtaBand } from "@/components/site/Blocks";

export const metadata: Metadata = {
  ...pageMeta({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
    socialTitle: "The Venezia — where serenity flows in everyday life",
    keywords: ["flats in Adalaj", "apartments on SG Highway Gandhinagar", "2 BHK near Narmada Canal", "shops for sale SG Highway Adalaj"],
  }),
  // the home page uses the full title, not the "%s · The Venezia" template
  title: { absolute: DEFAULT_TITLE },
};

export default function Home() {
  return (
    <main>
      <ResidenceJsonLd />
      <HeroScroll />
      <Statement />
      <MoreLight />
      <Chapters />
      <AmenityArea />
      <Spotlights />
      <ResidencesPreview />
      <ExplorerTeaser />
      <TourBand />
      <Location />
      <Developer />
      <CtaBand />
    </main>
  );
}
