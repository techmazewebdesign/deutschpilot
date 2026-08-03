import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Routes are locale-prefixed (/de/..., /en/...), so private areas need
// wildcard patterns — a bare "/dashboard/" would never match "/de/dashboard".
const disallow = [
  "/api/",
  "/*/dashboard",
  "/*/admin",
  "/*/teacher",
  "/*/student",
  "/*/settings",
  "/*/profile",
  "/*/login",
  "/*/signin",
  "/*/signup",
  "/*/forgot-password",
  "/*/reset-password",
  "/*/verify-email",
  "/*/exercises/",
  "/*/certificates",
  "/*/progress-overview",
  "/*/ai-trainer",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
