import { ExplorerTeaser, ResidencesPreview, TourBand } from "@/components/home/HomeSections";
import { AmenityArea, Chapters, Developer, HeroScroll, Location, MoreLight, Spotlights, Statement } from "@/components/home/ScrollSections";
import { CtaBand } from "@/components/site/Blocks";

export default function Home() {
  return (
    <main>
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
