export type GoogleSignInConfig = { iosClientId?: string; webClientId?: string; androidConfigured?: boolean };

// androidConfigured is set only after the package/certificate OAuth registration is verified.
export function canUseGoogleSignIn(platform: string, config: GoogleSignInConfig): boolean {
  if (platform === 'web') return true;
  if (platform !== 'android') return false;
  return config.androidConfigured === true && typeof config.webClientId === 'string'
    && /^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/.test(config.webClientId);
}
