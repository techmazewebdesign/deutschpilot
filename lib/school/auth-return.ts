/** Only the school workspace is an approved post-login override. No arbitrary URL parsing. */
export function schoolReturnTarget(value: unknown, locale: string): string | null {
  if (locale !== "de" && locale !== "en") return null;
  return value === `/${locale}/school` ? value : null;
}

export function signInDestination(locale: string, role: string, returnTo?: unknown): string {
  const school = schoolReturnTarget(returnTo, locale);
  if (school) return school;
  if (role === "admin") return `/${locale}/admin`;
  if (role === "teacher") return `/${locale}/teacher`;
  return `/${locale}/rooms`;
}

export function schoolSignInUrl(locale: string): string {
  return `/${locale}/signin?returnTo=${encodeURIComponent(`/${locale}/school`)}`;
}
