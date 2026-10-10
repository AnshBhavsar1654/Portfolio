import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/work", "/contact"];
  return [
    ...statics.map((p) => ({
      url: `${siteUrl.origin}${p === "" ? "/" : p}`,
      changeFrequency: "monthly" as const,
    })),
    ...projects.map((p) => ({
      url: `${siteUrl.origin}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
    })),
  ];
}
