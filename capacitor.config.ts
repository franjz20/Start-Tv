import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.starttv.app',
  appName: 'StartTv',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    iosScheme: 'https',
  },
  android: {
    webContentsDebuggingEnabled: true,
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: false,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
