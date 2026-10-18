import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirebaseRuntime } from './firebase';
export async function loginWithGoogle() {
  const { auth } = await getFirebaseRuntime();
  try { return (await signInWithPopup(auth, new GoogleAuthProvider())).user; }
  catch (error) {
    const code = (error as { code?: string }).code;
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
    throw error;
  }
}
export async function loginWithApple() {
  const { auth } = await getFirebaseRuntime();
  return (await signInWithPopup(auth, new OAuthProvider('apple.com'))).user;
}
