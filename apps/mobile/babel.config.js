module.exports = function (api) {
  api.cache(true)

  // В Jest статическая оптимизация Tamagui не нужна:
  // компоненты получают тему через TamaguiProvider прямо в тесте.
  const isTestEnvironment = process.env.NODE_ENV === 'test'

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      !isTestEnvironment && [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
        },
      ],
      'react-native-reanimated/plugin',
    ].filter(Boolean),
  }
}
