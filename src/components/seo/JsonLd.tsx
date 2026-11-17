import { amenityGroups, faqs, img } from "@/data/content";
import { site, totals } from "@/data/project";
import { DEFAULT_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";

/* ------------------------------------------------------------------
   Structured data (schema.org JSON-LD). Facts come from the brochure
   data in src/data — nothing here is invented.
------------------------------------------------------------------- */

type Json = Record<string, unknown>;

function Script({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; "<" is escaped so the payload can't close the tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const ORG_ID = absoluteUrl("/#organization");
const SITE_ID = absoluteUrl("/#website");
const PLACE_ID = absoluteUrl("/#residence");

const address = {
  "@type": "PostalAddress",
  streetAddress: "B/h. Swarnim Greens, Nr. Narmada Canal, S.G. Highway",
  addressLocality: "Adalaj",
  addressRegion: "Gujarat",
  postalCode: "382421",
  addressCountry: "IN",
};

const phones = [site.contact.phone];

/** Site-wide: the developer and the website. Rendered once in the root layout. */
export function SiteJsonLd() {
  return (
    <Script
      data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": ORG_ID,
          name: site.developer,
          url: absoluteUrl("/"),
          logo: absoluteUrl("/brand/venezia-logo.png"),
          parentOrganization: { "@type": "Organization", name: site.group },
          address,
          contactPoint: phones.map((telephone) => ({
            "@type": "ContactPoint",
            telephone: telephone.replace(/\s/g, ""),
            contactType: "sales",
            areaServed: "IN",
            availableLanguage: ["en", "hi", "gu"],
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": SITE_ID,
          name: SITE_NAME,
          url: absoluteUrl("/"),
          inLanguage: "en-IN",
          publisher: { "@id": ORG_ID },
        },
      ]}
    />
  );
}

/** Home page: the project itself. */
export function ResidenceJsonLd() {
  const amenities = amenityGroups.flatMap((g) => g.items);
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "ApartmentComplex",
        "@id": PLACE_ID,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        url: absoluteUrl("/"),
        image: [img.dusk, img.front, img.aerial, img.living].map((p) => absoluteUrl(p)),
        address,
        telephone: site.contact.phone.replace(/\s/g, ""),
        numberOfAccommodationUnits: totals.residences,
        numberOfBedrooms: 2,
        petsAllowed: false,
        amenityFeature: amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
        containedInPlace: { "@type": "Place", name: "Adalaj, Gandhinagar, Gujarat" },
        brand: { "@id": ORG_ID },
        identifier: { "@type": "PropertyValue", propertyID: "RERA", value: site.rera.replace(/^RERA:\s*/, "") },
      }}
    />
  );
}

/** Inner pages: Home › Page breadcrumb (matches the visible breadcrumb). */
export function BreadcrumbJsonLd({ name, path }: { name: string; path: string }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) },
        ],
      }}
    />
  );
}

/** Contact page: the FAQs shown on that page. */
export function FaqJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}
