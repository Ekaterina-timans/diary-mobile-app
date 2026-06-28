import { Card } from '@/src/shared/ui/cards/Card'
import { router } from 'expo-router'
import { Text, XStack, YStack } from 'tamagui'
import { SETTINGS_ITEMS } from './settings.config'
import { Screen } from '@/src/shared/ui/Screen'
import { Feather } from '@expo/vector-icons'

function SettingsItem({ title, route, icon }: any) {
  return (
    <Card pressStyle={{ opacity: 0.7, scale: 0.98 }} onPress={() => router.push(route)}>
      <XStack alignItems="center" justifyContent="space-between">
        <XStack alignItems="center" gap="$3">
          <Feather name={icon} size={20} color="#6B5BFF" />
          <Text fontSize="$6" fontWeight="600">
            {title}
          </Text>
        </XStack>
        <Feather name="chevron-right" size={18} color="#999" />
      </XStack>
    </Card>
  )
}

export function Settings() {
  return (
    <Screen>
      <YStack gap="$4" marginTop="$4">
        {SETTINGS_ITEMS.map((item) => (
          <SettingsItem key={item.key} icon={item.icon} title={item.title} route={item.route} />
        ))}
      </YStack>
    </Screen>
  )
}
