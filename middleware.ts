import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n";

const publicPages = [
  "/",
  "/kurse",
  "/retreats",
  "/community",
  "/uber-uns",
  "/magazin",
  "/login",
  "/register",
  "/kontakt",
];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
});

export default function middleware(req: NextRequest) {
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
