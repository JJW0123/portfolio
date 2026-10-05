import type { MetadataRoute } from "next";
import { getVisibleProjects } from "@/lib/project";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 1 },
    ...getVisibleProjects().map((project) => ({ url: `${SITE_URL}/projects/${project.slug}/`, priority: 0.8 })),
  ];
}
