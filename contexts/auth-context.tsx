"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useRouter, useParams } from "next/navigation";
import { firebaseAuth } from "@/lib/firebase";

export type UserRole = "student" | "teacher" | "admin";

export interface UserProfile {
  uid: string;          // Firebase UID
  supabaseId: string;   // Supabase profiles.id (uuid) — used as FK in DB tables
  fullName: string;
  email: string;
  role: UserRole;
  germanLevel?: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  profileError: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  profileError: null,
  signOut: async () => {},
});

const isDev = process.env.NODE_ENV === "development";
const ALLOWED_ROLES: UserRole[] = ["student", "teacher", "admin"];

function isSafeRole(r: unknown): r is UserRole {
  return typeof r === "string" && ALLOWED_ROLES.includes(r as UserRole);
}

/**
 * Try to get a fresh ID token with custom claims.
 * Falls back to the cached token if a network error occurs.
 * NEVER throws — always returns a string (possibly empty) and an optional claim role.
 */
async function safeGetIdToken(
  firebaseUser: User
): Promise<{ token: string; claimRole: string | null }> {
  // Step 1: try force-refresh (gets latest custom claims)
  try {
    const result = await firebaseUser.getIdTokenResult(true);
    return {
      token: result.token,
      claimRole: (result.claims.role as string) ?? null,
    };
  } catch (err) {
    // Network failed — log in dev, then fall back to cached token
    if (isDev) {
      const code = (err as { code?: string }).code ?? "unknown";
      console.warn(`[auth] Token force-refresh failed (${code}) — using cached token as fallback.`);
    }
  }

  // Step 2: fall back to cached token (no network needed)
  try {
    const result = await firebaseUser.getIdTokenResult(false);
    return {
      token: result.token,
      claimRole: (result.claims.role as string) ?? null,
    };
  } catch (err) {
    if (isDev) console.warn("[auth] Cached token read also failed:", err);
  }

  // Step 3: last resort — raw token string (no claims available)
  try {
    const token = await firebaseUser.getIdToken(false);
    return { token, claimRole: null };
  } catch {
    return { token: "", claimRole: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        if (isDev) console.log("[auth] No user.");
        setUser(null);
        setProfile(null);
        setRole(null);
        setProfileError(null);
        setLoading(false);
        return;
      }

      if (isDev) console.log("[auth] Firebase user:", firebaseUser.email);
      setUser(firebaseUser);

      // ── Step 1: Get ID token (never crashes the app) ─────────────────────
      const { token, claimRole } = await safeGetIdToken(firebaseUser);
      if (isDev) console.log("[auth] Token claim role:", claimRole ?? "(none)");

      // ── Step 2: Fetch Supabase profile (authoritative role source) ────────
      // Priority: Supabase profile.role > Firebase custom claim role > null
      // Pass Authorization header so the route works even without a session cookie
      // (e.g. right after signup before the __session cookie is written).
      try {
        const headers: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const res = await fetch("/api/auth/profile", { headers });

        if (res.ok) {
          const { profile: sbProfile } = (await res.json()) as {
            profile: {
              id: string;
              firebase_uid: string;
              email: string;
              full_name: string;
              role: string;
              german_level: string | null;
            };
          };

          const resolvedRole = isSafeRole(sbProfile.role) ? sbProfile.role : "student";

          setProfile({
            uid: firebaseUser.uid,
            supabaseId: sbProfile.id,
            fullName: sbProfile.full_name || firebaseUser.displayName || "",
            email: sbProfile.email || firebaseUser.email || "",
            role: resolvedRole,
            germanLevel: sbProfile.german_level,
          });
          setRole(resolvedRole);
          setProfileError(null);

          if (isDev) {
            console.log(`[auth] ✓ Profile loaded  supabaseId=${sbProfile.id}  role=${resolvedRole}`);
          }
        } else if (res.status === 401) {
          // Not authenticated server-side — session cookie not yet set.
          // This happens right after signup before the user completes signin.
          if (isDev) console.log("[auth] 401 from profile API — session cookie not yet set.");
          const fallbackRole = isSafeRole(claimRole) ? claimRole : "student";
          setRole(fallbackRole);
          setProfile({
            uid: firebaseUser.uid,
            supabaseId: "",
            fullName: firebaseUser.displayName ?? "",
            email: firebaseUser.email ?? "",
            role: fallbackRole,
          });
          setProfileError(null);
        } else {
          // Profile API returned an unexpected error
          const errBody = await res.json().catch(() => ({})) as { error?: string };
          const msg = errBody.error ?? `Profile API returned ${res.status}`;
          console.error("[auth] ✗ Profile API error:", msg);
          setProfile(null);
          setRole(null);
          setProfileError(
            "We could not load your profile. Please sign out and sign in again."
          );
        }
      } catch (err) {
        // Network error hitting /api/auth/profile
        if (isDev) console.warn("[auth] Profile fetch failed (network?):", err);
        // Fall back to Firebase token claims — better than crashing
        const fallbackRole = isSafeRole(claimRole) ? claimRole : null;
        setRole(fallbackRole);
        setProfile(
          fallbackRole
            ? {
                uid: firebaseUser.uid,
                supabaseId: "",
                fullName: firebaseUser.displayName ?? "",
                email: firebaseUser.email ?? "",
                role: fallbackRole,
              }
            : null
        );
        setProfileError(
          fallbackRole
            ? null
            : "We could not load your profile. Please sign out and sign in again."
        );
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = useCallback(async () => {
    if (isDev) console.log("[auth] Signing out...");
    try { await firebaseSignOut(firebaseAuth); } catch { /* ignore */ }
    try { await fetch("/api/auth/session", { method: "DELETE" }); } catch { /* ignore */ }
    setUser(null);
    setProfile(null);
    setRole(null);
    setProfileError(null);
    router.push(`/${locale}`);
    router.refresh();
  }, [router, locale]);

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, profileError, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/** Returns the correct dashboard path for a given role */
export function dashboardPath(locale: string, role: UserRole | null): string {
  if (role === "admin") return `/${locale}/admin`;
  if (role === "teacher") return `/${locale}/teacher/dashboard`;
  return `/${locale}/student/dashboard`;
}
