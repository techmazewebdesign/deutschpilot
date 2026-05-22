import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, type Locale } from "./i18n";

const PROTECTED_PATHS = [
  "/dashboard",
  "/profile",
  "/settings",
  "/lessons",
  "/exercises",
  "/levels",
  "/rooms",
  "/ai-trainer",
  "/admin",
  "/teacher",
];

const intlMiddleware = createIntlMiddleware({ locales, defaultLocale });

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
