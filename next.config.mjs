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
