import { useState } from 'react'
import { YStack, Text, XStack, useTheme } from 'tamagui'
import { TextInput, TextInputProps } from 'react-native'
import { Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'

type PasswordFieldProps = TextInputProps & {
  label?: string
  error?: string
}

export function PasswordField({ label, error, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const theme = useTheme()

  return (
    <YStack gap="$2">
      {label ? <Text color="$muted">{label}</Text> : null}

      <XStack
        alignItems="center"
        borderRadius={20}
        backgroundColor={theme.surfaceGlass?.val ?? 'rgba(255,255,255,0.65)'}
        borderWidth={1}
        borderColor={error ? theme.danger?.val ?? '#EF4444' : theme.border?.val ?? 'rgba(255,255,255,0.6)'}
        height={56}
        paddingRight={16}
      >
        <TextInput
          style={{
            flex: 1,
            paddingLeft: 20,
            paddingRight: 8,
            fontSize: 16,
            color: theme.text?.val,
          }}
          {...props}
          placeholderTextColor={theme.muted?.val}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          selectionColor={theme.primary?.val}
        />

        <Pressable onPress={() => setVisible(!visible)}>
          <Feather name={visible ? 'eye-off' : 'eye'} size={20} color={theme.primary?.val ?? '#5B4FBF'} />
        </Pressable>
      </XStack>

      {error ? (
        <Text color="$danger" fontSize="$4">
          {error}
        </Text>
      ) : null}
    </YStack>
  )
}
