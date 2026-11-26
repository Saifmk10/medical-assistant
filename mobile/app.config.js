const fs = require('node:fs');
const path = require('node:path');
const { parseEnv } = require('node:util');

module.exports = ({ config }) => {
  const envFile = path.join(__dirname, '..', '.env');
  const rootEnv = fs.existsSync(envFile) ? parseEnv(fs.readFileSync(envFile, 'utf8')) : {};
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || rootEnv.SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || rootEnv.SUPABASE_PUBLISHABLE_KEY;

  if (supabaseKey) {
    const parts = supabaseKey.split('.');
    let role;
    if (parts.length === 3) {
      try {
        role = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')).role;
      } catch {
        throw new Error('The configured Supabase key is malformed.');
      }
    }
    if (supabaseKey.startsWith('sb_secret_') || role === 'service_role') {
      throw new Error('Only a Supabase publishable or legacy anon key may be included in the app.');
    }
  }

  return {
    ...config,
    extra: { ...config.extra, supabaseUrl, supabasePublishableKey: supabaseKey },
    plugins: [
      ...(config.plugins ?? []),
      'expo-asset',
      'expo-secure-store',
      'expo-web-browser',
      'react-native-quick-crypto',
      [
        'react-native-audio-api',
        {
          iosBackgroundMode: false,
          androidPermissions: [],
          androidForegroundService: false,
          androidFSTypes: [],
          disableStaticExternalLibs: true,
        },
      ],
    ],
  };
};
