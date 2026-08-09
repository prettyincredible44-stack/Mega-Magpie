import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.magpie.solitaire',
  appName: 'Magpie Solitaire',
  webDir: 'dist',
  ios: {
    backgroundColor: '#0f172a',
    scrollEnabled: false,
    allowsLinkPreview: false,
    limitsNavigationsToRootDomain: true,
    preferredContentMode: 'mobile',
  },
};

export default config;
