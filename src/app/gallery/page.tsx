import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { PageHero, CtaBand } from "@/components/site/Blocks";
import { Gallery } from "@/components/site/Extras";

export const metadata: Metadata = pageMeta({
  title: "Photos, 3D Renders & 360° Tours",
  description: "See The Venezia on S.G. Highway, Adalaj: exterior renders, amenities, interiors, floor plans and 360° room tours of the 2 BHK residences.",
  path: "/gallery",
  socialTitle: "The Venezia gallery — every angle, every room",
  keywords: ["The Venezia photos", "The Venezia Adalaj images", "2 BHK interior photos", "360 tour 2 BHK"],
});

export default function GalleryPage() {
  return (
    <main>
      <BreadcrumbJsonLd name="Gallery" path="/gallery" />
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
