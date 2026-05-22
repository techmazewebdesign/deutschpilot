# DeutschPilot — Database and Auth Map

> Last updated: 2026-05-20
> Status: Active architecture audit. Migration in planning.
> Do not modify this file without updating it to reflect actual changes.

---

## 1. Authentication System

### Primary: Firebase Auth + Firebase Admin SDK

DeutschPilot uses **Firebase Authentication** as the single source of truth for user identity.

**Client-side flow:**
1. User submits sign-up or sign-in form
2. Firebase client SDK (`firebase/auth`) creates or verifies the user in Firebase Auth
3. Firebase returns an **ID token** to the browser
4. Browser sends ID token to `/api/auth/session` (POST)
5. Server exchanges ID token for a **Firebase session cookie** (`__session`, 14-day expiry, httpOnly)
6. All subsequent server requests are authenticated by verifying `__session` via Firebase Admin SDK

**Session verification:**
- `lib/session.ts` → `getServerSession()` reads `__session` cookie and calls `getAdminAuth().verifySessionCookie()`
- `middleware.ts` checks for presence of `__session` cookie on protected routes

**Role management:**
- Roles (`student`, `teacher`, `admin`) are stored as **Firebase custom claims** on the JWT
- Also mirrored to Firestore `users/{uid}` document for admin queries
- Set via `/api/auth/set-role` (POST) during onboarding

---

## 2. Databases Used

### A. Firebase Firestore

| Property | Value |
|----------|-------|
| Type | NoSQL document database |
| Package | `firebase-admin` (server), `firebase` (client) |
| SDK version | firebase-admin v13, firebase v12 |
| Access | Server-only via Firebase Admin SDK |

**Responsible for:**
- User records (`users/{uid}` collection)
- Admin user management (list, update role, disable, delete)
- Role mirroring alongside Firebase custom claims

**User document shape (`users/{uid}`):**
```
uid: string
email: string
name: string
role: "student" | "teacher" | "admin"
disabled: boolean
level: string | null
goal: string | null
emailVerified: boolean
createdAt: Timestamp
```

---

### B. Supabase (PostgreSQL)

| Property | Value |
|----------|-------|
| Type | Hosted PostgreSQL |
| Package | `@supabase/ssr`, `@supabase/supabase-js` |
| SDK version | @supabase/ssr v0.10, @supabase/supabase-js v2 |
| Access | Server-side via `createServerSupabaseClient()`, client-side via `createClient()` |

**Responsible for:**
- Courses (course metadata, slugs, descriptions, levels)
- Lessons (lesson content, slugs, associated course)
- Exercises (exercise tasks, lesson associations)
- Learning Rooms (room metadata, tasks)
- Placement tests
- Student task progress (`student_task_progress` table — upsert on completion)
- All public-facing learning content

**Key tables (inferred from query patterns):**
- `courses`
- `lessons`
- `exercises`
- `rooms`
- `room_tasks`
- `placement_test_questions`
- `student_task_progress`

---

### C. Prisma + PostgreSQL (Neon) — TRANSITIONAL STATE

| Property | Value |
|----------|-------|
| Type | Hosted PostgreSQL (Neon serverless) |
| Package | `@prisma/client`, `prisma` |
| SDK version | Prisma v5.13 |
| Access | Server-only via `lib/prisma.ts` |

**Currently responsible for:**
- Email/password auth only: `passwordHash`, `emailVerified`, `confirmationCode`, `passwordResetToken`
- User creation during sign-up (`api/auth/signup`)
- Email verification code flow (`api/auth/verify-email`, `api/auth/resend-code`)
- Password reset flow (`api/auth/forgot-password`, `api/auth/reset-password`)

**Not yet active (schema exists, not used):**
- Course, Lesson, Enrollment, Payment, Certificate, Retreat, Message, Notification, AdminNote, BlogPost, Testimonial models exist in schema but are not queried anywhere in the app

**Migration target:**
- Password auth responsibility to be removed once Firebase Auth handles the full sign-up/sign-in flow
- Prisma/Neon may be retained for relational transactional data (enrollments, payments) in a future phase
- `Account`, `Session`, `VerificationToken` models exist solely for NextAuth (currently disabled) and should be removed

---

### D. MongoDB / Mongoose — UNUSED

| Property | Value |
|----------|-------|
| Type | NoSQL document database |
| Package | `mongoose` v9 |
| Status | **Installed but completely unused in main project** |

`mongoose` remains in `package.json` as a leftover from an older architecture (visible in the `charming-turing-ad191c` worktree). It has no imports or usage in the current main codebase. Safe to remove from dependencies.

---

## 3. Important Files

### Authentication

| File | Role |
|------|------|
| `lib/firebase.ts` | Initializes Firebase client app, exports `firebaseAuth` and `firebaseDb` |
| `lib/firebase-admin.ts` | Initializes Firebase Admin SDK, exports `getAdminAuth()` and `getAdminDb()` |
| `lib/session.ts` | Server session helper — verifies `__session` cookie via Firebase Admin |
| `lib/auth.ts` | Re-exports `getServerSession` and session types (thin wrapper) |
| `contexts/auth-context.tsx` | Client-side React context — wraps `onAuthStateChanged`, exposes `user` and `signOut` |
| `middleware.ts` | Route protection — checks `__session` cookie, redirects to `/signin` if missing |

### Auth API Routes

| File | Role |
|------|------|
| `app/api/auth/session/route.ts` | POST: exchange Firebase ID token → session cookie. DELETE: clear cookie |
| `app/api/auth/set-role/route.ts` | POST: verify ID token, set custom claim + write Firestore user doc |
| `app/api/auth/signup/route.ts` | POST: create user in Prisma with bcrypt hash + send email code *(legacy — to be replaced)* |
| `app/api/auth/signin/route.ts` | POST: verify password against Prisma hash *(legacy — to be replaced)* |
| `app/api/auth/verify-email/route.ts` | POST: validate 6-digit code in Prisma, mark emailVerified *(legacy — to be replaced)* |
| `app/api/auth/forgot-password/route.ts` | POST: Prisma-based reset token *(legacy — to be replaced)* |
| `app/api/auth/reset-password/route.ts` | POST: Prisma-based reset *(legacy — to be replaced)* |
| `app/api/auth/resend-code/route.ts` | POST: regenerate Prisma confirmation code *(legacy — to be replaced)* |
| `app/api/auth/[...nextauth]/route.ts` | **Returns 404 — NextAuth is disabled** |

### Admin

| File | Role |
|------|------|
| `app/api/admin/users/route.ts` | GET/PATCH/DELETE users — reads/writes Firestore + Firebase Auth custom claims |
| `app/[locale]/admin/page.tsx` | Admin dashboard — counts users from Firestore |
| `components/admin/users-table.tsx` | Admin UI — displays user list from Firestore |

### Learning Content (Supabase)

| File | Role |
|------|------|
| `lib/supabaseClient.ts` | Browser Supabase client factory |
| `lib/supabaseServer.ts` | Server Supabase client factory (cookie-based SSR) |
| `lib/learningRooms.ts` | All room/task/progress queries against Supabase |
| `app/[locale]/courses/page.tsx` | Fetches courses from Supabase |
| `app/[locale]/courses/[slug]/page.tsx` | Fetches single course from Supabase |
| `app/[locale]/lessons/[slug]/page.tsx` | Fetches lesson from Supabase |
| `app/[locale]/exercises/[lessonId]/page.tsx` | Fetches exercises from Supabase |
| `app/[locale]/rooms/[slug]/page.tsx` | Fetches room from Supabase |
| `app/[locale]/placement-test/page.tsx` | Fetches placement test from Supabase |
| `app/[locale]/dashboard/page.tsx` | Fetches dashboard data from Supabase |
| `app/[locale]/dashboard/_actions.ts` | Server actions — progress upsert via Supabase |

### Prisma (Legacy Auth)

| File | Role |
|------|------|
| `lib/prisma.ts` | Prisma client singleton |
| `prisma/schema.prisma` | Full schema — User (auth fields), plus many unused models |

---

## 4. Important Environment Variables

> Never commit real values. Set these in Vercel dashboard or `.env.local` (gitignored).

### Firebase Client (browser-safe, NEXT_PUBLIC_)

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Firebase Admin (server-only, never expose to browser)

```
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

### Supabase

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
> Note: Only the anon key is used. No service role key is currently in use.

### Prisma / Neon PostgreSQL (legacy auth)

```
DATABASE_URL
DIRECT_URL
```

### Email (Hostinger SMTP)

```
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
MAIL_FROM
CONTACT_RECEIVER
```

### Stripe (not yet active)

```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PUBLISHABLE_KEY
```

### App

```
NEXT_PUBLIC_APP_URL
```

### NextAuth (currently unused — do not add values)

```
NEXTAUTH_SECRET
AUTH_SECRET
NEXTAUTH_URL
AUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

---

## 5. Rules for Future Development

1. **All new authentication logic must use Firebase Auth.** Do not add new Prisma-based password or session logic.

2. **All learning content (courses, lessons, exercises, rooms, progress) must be stored in Supabase.** Do not add new Firestore collections for content.

3. **User profile data belongs in Firestore under `users/{uid}`.** The shape is defined in Section 2A above. Do not create a parallel user table elsewhere.

4. **Session verification on the server must use `getServerSession()` from `lib/session.ts`.** Do not use `prisma.session.findUnique()` or NextAuth `getServerSession` — those systems are disabled.

5. **Do not activate NextAuth.** The `[...nextauth]` route intentionally returns 404. If OAuth (Google login) is needed in the future, it should be added through Firebase Auth providers, not NextAuth.

6. **Do not import `mongoose` or reference MongoDB** in any new code. It is a vestigial dependency.

7. **Admin role checks must read from the Firebase session cookie claims**, not from a Prisma `role` field. Use `getServerSession()` which decodes the Firebase JWT.

8. **Stripe is installed but not wired.** Do not add Stripe logic until the payment architecture is decided. Do not remove it either.

9. **New API routes that need the authenticated user** should call `getServerSession()` from `lib/auth.ts` (or `lib/session.ts` directly) at the top of the handler and return 401/403 if no session.

10. **Do not use `createClient()` (browser Supabase) in Server Components.** Use `createServerSupabaseClient()` instead.

---

## 6. What Claude Must Never Change Without Asking First

- `lib/firebase-admin.ts` — changing this breaks all session verification and admin APIs
- `lib/session.ts` — changing this breaks authentication for all server-side routes
- `middleware.ts` — changing protected paths or cookie name breaks route protection
- `app/api/auth/session/route.ts` — this is the session issuance endpoint; breaking it logs out all users
- `app/api/auth/set-role/route.ts` — this sets Firebase custom claims; wrong claims break role-based access
- `prisma/schema.prisma` — until migration is complete, running `prisma migrate` against production can destroy auth data
- Any file that reads or writes the `__session` cookie
- `FIREBASE_ADMIN_PRIVATE_KEY` format — must preserve `\n` newline escaping

---

## 7. What System to Use for New Features

| Feature type | Use |
|---|---|
| New login / OAuth provider | Firebase Auth (add provider in Firebase Console) |
| New user profile field | Firestore `users/{uid}` document |
| New learning content type | Supabase (new table) |
| New student progress metric | Supabase `student_task_progress` or new Supabase table |
| Admin dashboard data | Firestore collections + Firebase Admin SDK |
| Transactional data (enrollments, payments) | Prisma/Neon — but only after migration plan is finalized |
| File uploads | UploadThing (already installed: `uploadthing`, `@uploadthing/react`) |
| Emails | Nodemailer via SMTP (already wired in `lib/email.ts`) |
| Payments | Stripe — do not implement until architecture review |
| Real-time features (chat, live session status) | Supabase Realtime or Firebase Realtime Database — decision pending |

---

## 8. Known Conflicts (Migration Backlog)

| Conflict | Risk Level | Status |
|----------|-----------|--------|
| Sign-up creates user in both Firebase Auth AND Prisma | High | Needs migration |
| Password verification is in Prisma, not Firebase | High | Needs migration |
| `forgot-password` page uses Firebase `sendPasswordResetEmail` but API route uses Prisma tokens | High | Contradictory flows |
| `emailVerified` tracked in both Prisma and Firebase Auth | Medium | Needs consolidation |
| Prisma schema has `Course`, `Enrollment`, `Payment` models that duplicate Supabase's responsibility | Medium | Dead schema — should be cleaned |
| `Account`, `Session`, `VerificationToken` Prisma models exist for disabled NextAuth | Low | Safe to remove after NextAuth removal confirmed |
| `mongoose` installed with no usage | Low | Safe to remove from package.json |
| Firebase credentials are placeholders in `.env.local` | Critical | Must be filled before any Firebase flow works locally |
