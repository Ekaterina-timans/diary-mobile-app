import { useState } from 'react'
import { YStack, Text, XStack } from 'tamagui'
import { TextInput } from 'react-native'
import { Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'

export function PasswordField({ label, error, value, onChangeText, placeholder }: any) {
  const [visible, setVisible] = useState(false)

  return (
    <YStack gap="$2">
      {label ? <Text color="$muted">{label}</Text> : null}

      <XStack
        alignItems="center"
        borderRadius={20}
        backgroundColor="rgba(255,255,255,0.65)"
        borderWidth={1}
        borderColor={error ? '#EF4444' : 'rgba(255,255,255,0.6)'}
        height={56}
        paddingRight={16}
      >
        <TextInput
          style={{
            flex: 1,
            paddingLeft: 20,
            paddingRight: 8,
            fontSize: 16,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
        />

        <Pressable onPress={() => setVisible(!visible)}>
          <Feather name={visible ? 'eye-off' : 'eye'} size={20} color="#5B4FBF" />
        </Pressable>
      </XStack>

      {error ? (
        <Text color="#EF4444" fontSize="$4">
          {error}
        </Text>
      ) : null}
    </YStack>
  )
}
