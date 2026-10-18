import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import { getAuth, initializeAuth, type Auth, type Persistence } from "firebase/auth";
import bundledConfig from './firebase-config.json';

const CONFIG_CACHE = "deutschpilot:firebase-config:v1";
const DEFAULT_API = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "https://www.deutschpilot.de";

type MobileConfig = { firebase: FirebaseOptions; apiBaseUrl?: string };
type Runtime = { app: FirebaseApp; auth: Auth; apiBaseUrl: string };
let runtimePromise: Promise<Runtime> | null = null;

function valid(value: unknown): value is MobileConfig {
  if (!value || typeof value !== "object" || !("firebase" in value)) return false;
  const firebase = (value as MobileConfig).firebase;
  return Boolean(firebase.apiKey && firebase.authDomain && firebase.projectId && firebase.appId);
}

async function configuration(): Promise<MobileConfig> {
  // Firebase client configuration is public, exactly as in the web bundle.
  // Bundling it avoids making authentication depend on a separate website route.
  if (valid({ firebase: bundledConfig })) return { firebase: bundledConfig, apiBaseUrl: DEFAULT_API };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${DEFAULT_API}/api/mobile-config`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Configuration unavailable (${response.status})`);
    const value: unknown = await response.json();
    if (!valid(value)) throw new Error("Mobile configuration is incomplete");
    await AsyncStorage.setItem(CONFIG_CACHE, JSON.stringify(value));
    return value;
  } catch (error) {
    const cached = await AsyncStorage.getItem(CONFIG_CACHE);
    if (cached) {
      const value: unknown = JSON.parse(cached);
      if (valid(value)) return value;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function initializeRuntime(): Promise<Runtime> {
  const config = await configuration();
  const app = getApps().length ? getApp() : initializeApp(config.firebase);
  let auth: Auth;
  try {
    const getReactNativePersistence = (FirebaseAuth as unknown as {
      getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
    }).getReactNativePersistence;
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    auth = getAuth(app);
  }
  return { app, auth, apiBaseUrl: config.apiBaseUrl?.replace(/\/$/, "") || DEFAULT_API };
}

export function getFirebaseRuntime() {
  runtimePromise ??= initializeRuntime().catch(error => { runtimePromise = null; throw error; });
  return runtimePromise;
}

export function retryFirebaseRuntime() {
  runtimePromise = null;
  return getFirebaseRuntime();
}
