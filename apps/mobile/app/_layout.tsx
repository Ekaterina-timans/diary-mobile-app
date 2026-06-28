import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/src/shared/ui/useColorScheme'
import { useAuthStore } from '@/src/features/auth/authStore'
import { TamaguiProvider } from 'tamagui'
import { tamaguiConfig } from '@/tamagui.config'
import { BiometricLock } from '@/src/features/auth/ui/BiometricLock'

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
  const isReady = useAuthStore((s) => s.isReady)
  const isAuthed = useAuthStore((s) => s.isAuthed)

  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (!isReady) return

    const inAuthGroup = segments[0] === 'auth'

    if (!isAuthed && !inAuthGroup) {
      router.replace('/auth/login')
    }

    if (isAuthed && inAuthGroup) {
      router.replace('/(tabs)/home')
    }
  }, [isReady, isAuthed, segments, router])

  if (!isReady) return null

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TamaguiProvider
        config={tamaguiConfig}
        defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
      >
        <BiometricLock active={isAuthed}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
          </Stack>
        </BiometricLock>
      </TamaguiProvider>
    </ThemeProvider>
  )
}
