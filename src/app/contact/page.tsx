import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/site/Blocks";
import { Enquire } from "@/components/sections/Enquire";
import { FAQ } from "@/components/site/Extras";
import { Location } from "@/components/home/ScrollSections";

export const metadata: Metadata = pageMeta({
  title: "Book a Site Visit — Contact & Location",
  description: "Visit The Venezia, B/h. Swarnim Greens, Nr. Narmada Canal, S.G. Highway, Adalaj 382421. Call +91 90700 78700 to book a site visit with our sales team.",
  path: "/contact",
  socialTitle: "Book a private visit to The Venezia, Adalaj",
  keywords: ["The Venezia contact number", "The Venezia location", "site visit Adalaj flats", "flats near Narmada Canal Adalaj", "flats near Trimandir Adalaj"],
});

export default function ContactPage() {
  return (
    <main>
      <BreadcrumbJsonLd name="Contact" path="/contact" />
      <FaqJsonLd />
      <PageHero
        crumb="Contact"
        eyebrow="Contact & visits"
        title={
          <>
            Let&rsquo;s find <br />
            <em>your home.</em>
          </>
        }
        intro="Tell us a little about what you are looking for and when you would like to visit. We reply within one working day."
        image="/images/b/living.jpg"
        position="50% 50%"
      />
      <Enquire />
      <Location eyebrow="Find us" />
      <FAQ />
    </main>
  );
}
