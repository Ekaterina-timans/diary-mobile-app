import { YStack } from 'tamagui'

// Это хороший layout-wrapper.
// Он:
// централизует отступы
// даёт единый background
// используется в Home / Journal / Notes / Settings

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <YStack flex={1} padding="$4" gap="$4" backgroundColor="$background">
      {children}
    </YStack>
  )
}
