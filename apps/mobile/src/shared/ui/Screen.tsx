import { YStack } from 'tamagui'

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <YStack flex={1} padding="$4" gap="$4" backgroundColor="$background">
      {children}
    </YStack>
  )
}
