import type { Metadata } from "next";
import { PageHero } from "@/components/site/Blocks";
import { Enquire } from "@/components/sections/Enquire";
import { FAQ } from "@/components/site/Extras";
import { Location } from "@/components/home/ScrollSections";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a private visit to The Venezia, B/h. Swarnim Greens, Nr. Narmada Canal, S.G. Highway, Adalaj. Call +91 90700 78700.",
};

export default function ContactPage() {
  return (
    <main>
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
