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
        backgroundColor="rgba(255,255,255,0.65)"
        borderColor={error ? '#EF4444' : 'rgba(255,255,255,0.6)'}
        borderWidth={1}
        paddingHorizontal={20}
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
