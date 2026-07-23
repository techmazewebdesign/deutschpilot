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
// rebuild-3: added FIREBASE_ADMIN_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY to Vercel — these were
// never set before, causing getAdminAuth() to throw "missing env vars" on every signup,
// masked as "Invalid or expired ID token." by app/api/auth/set-role/route.ts's catch block.
