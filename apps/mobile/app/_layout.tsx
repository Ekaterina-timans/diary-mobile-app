import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/src/shared/ui/useColorScheme'
import { useAuthStore } from '@/src/features/auth/authStore'
import { TamaguiProvider } from 'tamagui'
import { tamaguiConfig } from '@/tamagui.config'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  const bootstrap = useAuthStore((s) => s.bootstrap)
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (!loaded) return
    ;(async () => {
      await bootstrap()
      await SplashScreen.hideAsync()
    })()
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TamaguiProvider
        config={tamaguiConfig}
        defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </TamaguiProvider>
    </ThemeProvider>
  )
}
