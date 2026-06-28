import { Input, YStack, Text } from 'tamagui'

interface TextFieldProps {
  label?: string
  error?: string
  [key: string]: any
}

export function TextField({ label, error, ...props }: TextFieldProps) {
  return (
    <YStack gap="$2">
      {label ? <Text color="$muted">{label}</Text> : null}

      <Input
        height={56}
        borderRadius={20}
        backgroundColor="$surfaceGlass"
        borderColor={error ? '$danger' : '$border'}
        borderWidth={1}
        paddingHorizontal={20}
        color="$text"
        placeholderTextColor="$muted"
        focusStyle={{
          borderColor: '$primary',
        }}
        {...props}
      />

      {error ? (
        <Text color="$danger" fontSize="$4">
          {error}
        </Text>
      ) : null}
    </YStack>
  )
}
