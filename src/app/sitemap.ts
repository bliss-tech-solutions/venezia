import type { MetadataRoute } from "next";
import { img } from "@/data/content";
import { absoluteUrl } from "@/lib/seo";

/** Every public page, with its key images so they can appear in Google Images. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    images: string[],
  ): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
    images: images.map((src) => absoluteUrl(src)),
  });

  return [
    page("/", 1, "weekly", [img.dusk, img.front, img.aerial, img.balcony]),
    page("/residences", 0.9, "daily", [img.living, img.kitchen, "/images/plan-a.png", "/images/plan-b.png", "/images/plan-c.png", "/images/floor-3d.jpg"]),
    page("/amenities", 0.8, "monthly", [img.water, img.clubhouseLawn, img.lawn, img.games, img.play, img.cricket, img.groundplan]),
    page("/gallery", 0.7, "monthly", [img.dusk, img.aerial, img.cafe, img.pickleball, img.clubhouse]),
    page("/about", 0.6, "monthly", [img.front]),
    page("/contact", 0.8, "monthly", [img.map]),
  ];
}
