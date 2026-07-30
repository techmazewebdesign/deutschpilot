import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, type Locale } from "./i18n";

const PROTECTED_PATHS = [
  "/dashboard",
  "/profile",
  "/settings",
  "/lessons",
  "/exercises",
  // "/levels" and the "/rooms" overview are public (discovery/SEO pages);
  // individual rooms — and their lessons/quizzes — still require sign-in.
  "/rooms/",
  "/ai-trainer",
  "/admin",
  "/teacher",
];

// localeDetection: false — always default to German for unprefixed visits,
// regardless of the visitor's browser language. Without this, next-intl's
// default Accept-Language-based detection would send English-browser
// visitors to /en automatically, undermining "German by default."
const intlMiddleware = createIntlMiddleware({ locales, defaultLocale, localeDetection: false });

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = (localeMatch?.[1] as Locale) ?? defaultLocale;
  const pathWithoutLocale = localeMatch
    ? pathname.slice(locale.length + 1) || "/"
    : pathname;

  const isProtected = PROTECTED_PATHS.some((p) =>
    pathWithoutLocale.startsWith(p)
  );

  if (isProtected) {
    const sessionCookie = req.cookies.get("__session");
    if (!sessionCookie) {
      return NextResponse.redirect(new URL(`/${locale}/signin`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
