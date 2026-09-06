import { Feather } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { Text, useTheme, XStack, YStack } from 'tamagui'

const KEY_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
] as const

type PinKeypadProps = {
  onDigitPress: (digit: string) => void
  onDeletePress: () => void
  disabled?: boolean
}

export function PinKeypad({
  onDigitPress,
  onDeletePress,
  disabled = false,
}: PinKeypadProps) {
  const theme = useTheme()

  function renderDigit(digit: string) {
    return (
      <Pressable
        key={digit}
        accessibilityRole="button"
        accessibilityLabel={`Цифра ${digit}`}
        disabled={disabled}
        onPress={() => onDigitPress(digit)}
        style={({ pressed }) => ({
          width: 72,
          height: 72,
          borderRadius: 36,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.surfaceGlass?.val,
          borderWidth: 1,
          borderColor: theme.border?.val,
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        })}
      >
        <Text color="$text" fontSize={28} fontWeight="600">
          {digit}
        </Text>
      </Pressable>
    )
  }

  return (
    <YStack gap="$3" alignItems="center">
      {KEY_ROWS.map((row) => (
        <XStack key={row.join('')} gap="$5">
          {row.map(renderDigit)}
        </XStack>
      ))}

      <XStack gap="$5" alignItems="center">
        <YStack width={72} height={72} />
        {renderDigit('0')}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Удалить последнюю цифру"
          disabled={disabled}
          onPress={onDeletePress}
          style={({ pressed }) => ({
            width: 72,
            height: 72,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.5 : pressed ? 0.6 : 1,
          })}
        >
          <Feather name="delete" size={27} color={theme.text?.val} />
        </Pressable>
      </XStack>
    </YStack>
  )
}
