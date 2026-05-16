import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, type Locale } from "./i18n";

/** Routes that require an active Supabase session */
const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings", "/lessons", "/exercises"];

const intlMiddleware = createIntlMiddleware({ locales, defaultLocale });

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Extract locale prefix (e.g. "de" from "/de/dashboard")
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = (localeMatch?.[1] as Locale) ?? defaultLocale;
  const pathWithoutLocale = localeMatch
    ? pathname.slice(locale.length + 1) || "/"
    : pathname;

  const isProtected = PROTECTED_PATHS.some((p) =>
    pathWithoutLocale.startsWith(p)
  );

  if (isProtected) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return req.cookies.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
