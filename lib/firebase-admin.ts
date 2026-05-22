import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const REQUIRED_ADMIN_ENV_VARS = [
  "FIREBASE_ADMIN_PROJECT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
] as const;

for (const key of REQUIRED_ADMIN_ENV_VARS) {
  const val = process.env[key];
  if (!val || val.includes("your_") || val.includes("xxxxx")) {
    console.error(
      `[firebase-admin] Missing or placeholder env var: ${key}. ` +
        "Download a service account JSON from Firebase Console → Project Settings → Service accounts and set these values in .env.local."
    );
  }
}

let _app: App | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    const missing = [
      !projectId && "FIREBASE_ADMIN_PROJECT_ID",
      !clientEmail && "FIREBASE_ADMIN_CLIENT_EMAIL",
      !rawKey && "FIREBASE_ADMIN_PRIVATE_KEY",
    ].filter(Boolean);
    throw new Error(`[firebase-admin] Missing env vars: ${missing.join(", ")}`);
  }

  const privateKey = rawKey.replace(/\\n/g, "\n");

  try {
    _app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    console.log("[firebase-admin] Initialized for project:", projectId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[firebase-admin] initializeApp failed:", msg);
    throw new Error(`[firebase-admin] initializeApp failed: ${msg}`);
  }

  return _app;
}

export function getAdminAuth(): Auth {
  if (!_auth) _auth = getAuth(getAdminApp());
  return _auth;
}

export function getAdminDb(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}
