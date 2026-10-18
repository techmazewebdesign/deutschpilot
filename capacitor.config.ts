import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Legacy local preview only. The store application now lives in mobile/
  // as a standalone Expo/React Native product using de.deutschpilot.app.
  appId: 'de.deutschpilot.legacy.preview',
  appName: 'DeutschPilot Legacy Preview',
  webDir: 'capacitor-shell',
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
