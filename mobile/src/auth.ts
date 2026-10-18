import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Unsubscribe,
  type User,
} from "firebase/auth";
import { getFirebaseRuntime } from "./firebase";

export const verificationSettings = { url: 'https://www.deutschpilot.de/de/signin?verified=1' };

function friendly(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("invalid-credential")) return "Anmeldung nicht möglich. Wenn du noch kein registriertes Konto hast, registriere dich bitte zuerst.";
  if (code.includes("email-already-in-use")) return "Für diese E-Mail-Adresse gibt es bereits ein Konto.";
  if (code.includes("weak-password")) return "Bitte verwende mindestens acht Zeichen.";
  if (code.includes("invalid-email")) return "Bitte prüfe deine E-Mail-Adresse.";
  if (code.includes("network-request-failed")) return "Keine Verbindung. Die Offline-Lektionen bleiben verfügbar.";
  return error instanceof Error ? error.message : "Die Anmeldung konnte nicht abgeschlossen werden.";
}

export async function watchUser(listener: (user: User | null) => void): Promise<Unsubscribe> {
  const { auth } = await getFirebaseRuntime();
  return onAuthStateChanged(auth, listener);
}

export async function register(email: string, password: string, name: string) {
  try {
    const { auth } = await getFirebaseRuntime();
    const result = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    await updateProfile(result.user, { displayName: name.trim() });
    auth.languageCode = 'de';
    let verificationSent = true;
    try { await sendEmailVerification(result.user, verificationSettings); }
    catch { verificationSent = false; }
    return { user: result.user, verificationSent };
  } catch (error) {
    throw new Error(friendly(error), { cause: error });
  }
}

export async function login(email: string, password: string) {
  try {
    const { auth } = await getFirebaseRuntime();
    const user = (await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)).user;
    await user.reload();
    if (!user.emailVerified) {
      throw new Error("Bitte bestätige zuerst deine E-Mail-Adresse. Wir haben dir einen Bestätigungslink geschickt.");
    }
    return user;
  } catch (error) {
    throw new Error(friendly(error), { cause: error });
  }
}

export async function resetPassword(email: string) {
  const { auth } = await getFirebaseRuntime();
  auth.languageCode = 'de';
  await sendPasswordResetEmail(auth, email.trim().toLowerCase(), verificationSettings).catch((error) => { throw new Error(friendly(error), { cause: error }); });
}

export async function resendVerification() {
  const { auth } = await getFirebaseRuntime();
  if (!auth.currentUser) throw new Error('Bitte melde dich zuerst an.');
  await auth.currentUser.reload();
  if (auth.currentUser.emailVerified) return true;
  auth.languageCode = 'de';
  await sendEmailVerification(auth.currentUser, verificationSettings).catch(error => { throw new Error(friendly(error), { cause: error }); });
  return false;
}

export async function logout() {
  const { auth } = await getFirebaseRuntime();
  await signOut(auth);
}

export async function deleteAccountPermanently(confirmation: string) {
  const { auth, apiBaseUrl } = await getFirebaseRuntime();
  const user = auth.currentUser;
  if (!user) throw new Error("Bitte melde dich erneut an.");
  const response = await fetch(`${apiBaseUrl}/api/account/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${await user.getIdToken()}` },
    body: JSON.stringify({ confirmation }),
  });
  const payload = await response.json().catch(() => ({})) as { error?: string };
  if (response.status === 404) throw new Error('Die Kontolöschung ist auf dem Server noch nicht verfügbar. Dein Konto wurde nicht gelöscht. Bitte kontaktiere info@deutschpilot.de.');
  if (!response.ok) throw new Error(payload.error || "Das Konto konnte nicht gelöscht werden.");
  await signOut(auth).catch(() => undefined);
}
