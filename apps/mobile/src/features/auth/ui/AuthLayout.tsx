import { PropsWithChildren } from 'react'
import { YStack, Text } from 'tamagui'
import { Screen } from '@/src/shared/ui/Screen'
import { GlassCard } from '@/src/shared/ui/cards/GlassCard'

export function AuthLayout({
  title,
  subtitle,
  children,
}: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <Screen>
      <YStack flex={1} justifyContent="center" paddingHorizontal="$5" gap="$6">
        {/* Заголовок */}
        <YStack gap="$2">
          <Text fontSize="$9" fontWeight="800" color="$text" letterSpacing={-0.5}>
            {title}
          </Text>
        </YStack>

        {/* Glass Card */}
        <GlassCard>
          <YStack gap="$4">{children}</YStack>
        </GlassCard>
      </YStack>
    </Screen>
  )
}
