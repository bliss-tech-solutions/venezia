import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/site/Blocks";
import { Gallery } from "@/components/site/Extras";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Exterior renders, amenities, interiors, floor plans and 360° room tours of The Venezia, Adalaj.",
};

export default function GalleryPage() {
  return (
    <main>
      <PageHero
        crumb="Gallery"
        eyebrow="Gallery"
        title={
          <>
            Every angle, <br />
            <em>every room.</em>
          </>
        }
        intro="Exterior renders, amenities, interiors, plans and 360° rooms you can stand inside. Select any image to view it full screen."
        image="/images/b/aerial.jpg"
        position="50% 45%"
      />
      <Gallery />
      <CtaBand />
    </main>
  );
}
