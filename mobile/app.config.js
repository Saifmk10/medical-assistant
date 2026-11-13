module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    'expo-asset',
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
});
