import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, YStack } from 'tamagui'
import { AuroraBackground } from './background/AuroraBackground'

// Это хороший layout-wrapper.
// Он:
// централизует отступы
// даёт единый background
// используется в Home / Journal / Notes / Settings

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <YStack flex={1}>
        <AuroraBackground />

        {/* Контент поверх */}
        <YStack flex={1} padding="$5" gap="$5">
          {children}
        </YStack>
      </YStack>
    </SafeAreaView>
  )
}
