import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { PageHero, CtaBand } from "@/components/site/Blocks";
import { AboutStory, Journey, Manifesto, Pillars } from "@/components/about/AboutSections";
import { Developer } from "@/components/home/ScrollSections";

export const metadata: Metadata = pageMeta({
  title: "About the Developer — RM Enterprise",
  description: "Meet RM Enterprise, a Manek project, and the agencies behind The Venezia, Adalaj: eye-catching architecture, spacious 2 BHK homes and true longevity.",
  path: "/about",
  socialTitle: "About The Venezia — a home that has no equal",
  keywords: ["RM Enterprise Gandhinagar", "Manek builders", "Innovatiq Architects", "real estate developer Adalaj"],
});

export default function AboutPage() {
  return (
    <main>
      <BreadcrumbJsonLd name="About" path="/about" />
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
