import { XStack, Text, useTheme } from 'tamagui'
import { Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'

type Props = {
  title: string
  showBack?: boolean
}

export function Header({ title, showBack = true }: Props) {
  const theme = useTheme()

  return (
    <XStack alignItems="center" justifyContent="center" position="relative">
      {showBack && (
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            left: 16,
            padding: 8,
          }}
        >
          <Feather name="chevron-left" size={24} color={theme.text.val} />
        </Pressable>
      )}

      <Text fontSize="$8" fontWeight="700" color="$text">
        {title}
      </Text>
    </XStack>
  )
}
