import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/site/Blocks";
import { AboutStory, Journey, Manifesto, Pillars } from "@/components/about/AboutSections";
import { Developer } from "@/components/home/ScrollSections";

export const metadata: Metadata = {
  title: "About Us",
  description: "RM Enterprise, a Manek project: the developer and agencies behind The Venezia, S.G. Highway, Adalaj.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        crumb="About"
        eyebrow="About us"
        title={
          <>
            A home that has <br />
            <em>no equal.</em>
          </>
        }
        intro="RM Enterprise presents The Venezia: exclusive residential towers on S.G. Highway, Adalaj, designed for generous space and contemporary living."
        image="/images/b/front.jpg"
        position="50% 30%"
      />
      <AboutStory />
      <Manifesto />
      <Pillars />
      <Developer />
      <Journey />
      <CtaBand
        title={
          <>
            Meet the <em>team.</em>
          </>
        }
        text="Visit the sales gallery to see the sample residence, review the specification and ask us anything about the project."
      />
    </main>
  );
}
