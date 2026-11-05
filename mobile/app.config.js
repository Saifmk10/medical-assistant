const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const isProduction = process.env.NODE_ENV === 'production' || process.env.EAS_BUILD_PROFILE === 'production';

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    geminiApiKey: isProduction ? null : process.env.GEMINI_API_KEY ?? null,
  },
  plugins: [...(config.plugins ?? []), 'expo-asset'],
});
