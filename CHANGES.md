# DeutschPilot – Translation & Language Menu Fix

## What changed

### 1. Languages reduced to English + German only
- **`i18n.ts`**: `locales` reduced to `["de", "en"]`. The whole `PLACEHOLDER_LOCALES` + `deepMerge` system was removed — it was the root cause of the "Tamil → Persian" feeling. The placeholder files only had `comingSoon` + `hero` keys, so visiting `/ta`, `/fa`, `/hi`, or `/ar` would show mostly English text with a few words in the chosen language. The pages looked nearly identical, which made the language switcher feel broken.
- **`navigation.tsx`**: `languages` array reduced to just `en` + `de`. Other tweaks below.
- **`middleware.ts`**: imports `locales` from `i18n.ts`, so it now automatically only accepts `de` and `en`.

### 2. Translation parity fixed
Before the fix:
- `admin.analytics` existed in EN but was missing in DE (would crash the admin page in German).
- `community.preview` existed in DE but was missing in EN.

After: both files have exactly 205 keys, perfectly matched.

### 3. Translation polish (English)
- `nav.about`: "About Us" → "About" (cleaner in a nav bar)
- `nav.login`: "Login" → "Sign in" (consistent with `auth.login`)
- `nav.logout`: "Logout" → "Sign out"
- `hero.title`: "Your Path. Your Future." → "Your way. Your future." (avoids the religious "Path" connotation; sentence case)
- `hero.subtitle`: cleaner em-dash, removed "rapid"
- `hero.cta2`: "Determine your level" → "Find your level" (more natural)
- `hero.rating`: trimmed
- `courses.levels.A2.label`: "Basics" → "Elementary" (matches CEFR conventions)
- `courses.levels.B2.label`: "Advanced" → "Upper-Intermediate"; `C1`: "Competent" → "Advanced"
- `auth.forgotPassword`: "Forgot password?" → "Forgot your password?"
- `auth.noAccount`: "No account yet?" → "Don't have an account yet?"
- `admin.enrollments`: spelling normalised to en-GB ("Enrolments") — change back to "Enrollments" if you prefer en-US
- `admin.newSignups`: "New signups" → "New sign-ups"
- `placementTest.levelSaved`: removed the "!"
- Various sentence-case fixes (titles were inconsistently Title Case)

### 4. Translation polish (German)
- `nav.login`: "Login" → "Anmelden" (more natural in German)
- `nav.academy`: "Online Akademie" → "Online-Akademie" (correct Bindestrich)
- `hero.cta2`: "Dein Niveau bestimmen" → "Niveau bestimmen" (consistent with EN)
- `stats.students`: "Zufriedene Teilnehmer" → "Zufriedene Teilnehmer:innen" (matches the gendered "Lehrer:innen" used in features)
- `stats.levels`: "Kurslevel" → "Kursniveaus" (consistent with `nav.levels`)
- `courses.levels.A1.label`: "Anfänger" → "Anfänger:in" (consistent gendering)
- `testimonials.items.jonas.text`: "der Lehrer" → "Lehrer:innen" (the original referred to multiple teachers anyway)
- `retreats.features.duration`: "7 Tage Intensivkurs" → "7-tägiger Intensivkurs" (proper German)
- `retreats.features.networking`: "Networking & Community" → "Netzwerk & Community"
- `studentJourney.title`: "Vom Anfänger zum Experten" → "Vom Anfänger zum Profi" (less stiff)
- `community.cta`: "Community beitreten" → "Der Community beitreten" (grammatically correct)
- `admin.users`: "Benutzer" → "Benutzer:innen" (consistent gendering)
- `admin.analytics`: added ("Auswertungen")
- `placementTest.subtitle`: "~5 Minuten" → "ca. 5 Minuten" (more natural German)
- `placementTest.loginToSave`: comma added for correct German punctuation
- `metadata.title`: added Bindestrich → "Premium-Deutschkurse"

### 5. navigation.tsx clean-ups (small)
- Removed the `locale === "de" ? "Dashboard" : "Dashboard"` ternary (both branches were identical).
- Replaced the hardcoded "Abmelden" / "Sign out" ternary with `t("logout")`.
- Replaced the hardcoded "Language" mobile-menu header with a `locale === "de" ? "Sprache" : "Language"` ternary. (It's outside the `nav` namespace, so I didn't add a new key — but if you'd like, I can add `nav.languageLabel` to both JSON files instead.)

---

## What to do on your machine

```bash
cd /path/to/windsurf-project

# 1. Replace the five files
#    (back up old ones first if you want)
cp /downloads/i18n.ts        ./i18n.ts
cp /downloads/middleware.ts  ./middleware.ts
cp /downloads/navigation.tsx ./components/navigation.tsx
cp /downloads/en.json        ./messages/en.json
cp /downloads/de.json        ./messages/de.json

# 2. (Optional) Remove the now-unused placeholder message files
rm messages/ar.json messages/fa.json messages/hi.json messages/ta.json

# 3. Clear Next.js cache and restart
rm -rf .next
npm run dev
```

---

## Things I noticed but did NOT change (flagged for you to decide)

1. **Logo filename typo** in `navigation.tsx` line 81:
   `/Images/Deurschpilot_logo.png` — note "Deur**s**chpilot" has the letters out of order. If this file literally exists with that exact misspelling, leave it. Otherwise rename either the file or the path. Check with:
   ```bash
   ls public/Images/ | grep -i pilot
   ```

2. **Tagline under logo** in `navigation.tsx` is hardcoded as `"Sprache. Zukunft. Du."` — this stays in German even on the English site. If you want it to switch, use `t("tagline")` from the `footer` namespace (or add a new `nav.tagline` key in both files).

3. **`app/[locale]/admin/page.tsx`** is still referenced — verify it doesn't read any of the removed `PLACEHOLDER_LOCALES` / `isPlaceholderLocale` exports. (They were removed from `i18n.ts`.) Search:
   ```bash
   grep -rn "PLACEHOLDER_LOCALES\|isPlaceholderLocale" .
   ```
   If any file uses them, let me know and I'll patch it.

4. **`app/[locale]/layout.tsx`** still imports `RTL_LOCALES` — I kept that export as an empty array so the import doesn't break. If you want, you can also delete the `dir={dir}` logic in the layout since there are no RTL locales.

5. **`comingSoon` namespace**: it existed only in the four removed placeholder files. If any page references it (probably none, but check), it can be deleted too.
