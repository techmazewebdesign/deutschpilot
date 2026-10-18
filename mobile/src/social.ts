import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, OAuthProvider } from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { getFirebaseRuntime } from './firebase';
import config from './google-config.json';

GoogleSignin.configure({ iosClientId: config.iosClientId });
export async function loginWithGoogle() {
  // Always start a fresh provider session so the native chooser is shown.
  // Firebase sign-out alone does not clear Google Sign-In's cached account.
  try { await GoogleSignin.signOut(); } catch { /* no cached Google session */ }
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) return null;
  if (!response.data.idToken) throw new Error('Google hat keine Anmeldung bestätigt. Bitte erneut versuchen.');
  const { auth } = await getFirebaseRuntime();
  return (await signInWithCredential(auth, GoogleAuthProvider.credential(response.data.idToken))).user;
}
export async function loginWithApple() {
  const nonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
  const response = await AppleAuthentication.signInAsync({ requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL, AppleAuthentication.AppleAuthenticationScope.FULL_NAME], nonce: hashedNonce });
  if (!response.identityToken) throw new Error('Apple hat keine Anmeldung bestätigt.');
  const { auth } = await getFirebaseRuntime();
  return (await signInWithCredential(auth, new OAuthProvider('apple.com').credential({ idToken: response.identityToken, rawNonce: nonce }))).user;
}
