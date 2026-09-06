import { Screen } from '@/src/shared/ui/Screen'
import { GlassCard } from '@/src/shared/ui/cards/GlassCard'
import { Header } from '@/src/shared/ui/navigation/Header'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Pressable, ScrollView, useColorScheme } from 'react-native'
import { Text, useTheme, XStack, YStack } from 'tamagui'

export function Data() {
  const theme = useTheme()
  const isDark = useColorScheme() === 'dark'

  return (
    <Screen>
      <Header title="Данные" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 40,
        }}
      >
        <YStack gap="$5">
          <YStack gap="$1" paddingHorizontal="$1">
            <Text
              color="$text"
              fontSize="$7"
              fontWeight="700"
            >
              Управление данными
            </Text>

            <Text
              color="$muted"
              fontSize="$4"
              lineHeight={20}
            >
              Управляйте данными и своим аккаунтом
            </Text>
          </YStack>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push(
                '/settings/data/delete-account',
              )
            }
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <GlassCard
              variant={isDark ? 'dark' : 'light'}
            >
              <XStack
                alignItems="center"
                gap="$4"
              >
                <YStack
                  width={44}
                  height={44}
                  borderRadius={14}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="$surfaceGlass"
                  borderWidth={1}
                  borderColor="$border"
                >
                  <Feather
                    name="trash-2"
                    size={21}
                    color={theme.danger?.val}
                  />
                </YStack>

                <YStack flex={1} gap="$1">
                  <Text
                    color="$danger"
                    fontSize="$5"
                    fontWeight="600"
                  >
                    Удалить аккаунт
                  </Text>

                  <Text
                    color="$muted"
                    fontSize="$3"
                    lineHeight={18}
                  >
                    Закрыть аккаунт и удалить данные
                  </Text>
                </YStack>

                <Feather
                  name="chevron-right"
                  size={19}
                  color={theme.muted?.val}
                />
              </XStack>
            </GlassCard>
          </Pressable>
        </YStack>
      </ScrollView>
    </Screen>
  )
}
