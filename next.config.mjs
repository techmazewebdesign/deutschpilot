import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "utfs.io", "uploadthing.com"],
  },
  experimental: {
    typedRoutes: false,
    serverComponentsExternalPackages: ["firebase-admin"],
  },
};

export default withNextIntl(nextConfig);
// build-cache-bust: force a clean Vercel build after Production env var changes (Firebase config)
// rebuild-2: Firebase env vars re-applied via `vercel env add --force` from .env.local
