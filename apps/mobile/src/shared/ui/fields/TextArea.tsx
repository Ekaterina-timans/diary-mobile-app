import { TextArea as TTextArea, YStack, Text } from 'tamagui'

interface TextAreaProps {
  label?: string
  error?: string
  [key: string]: any
}

export function TextArea({ label, error, ...props }: TextAreaProps) {
  return (
    <YStack gap="$2">
      {label ? <Text color="$muted">{label}</Text> : null}

      <TTextArea
        minHeight={120}
        borderRadius={20}
        backgroundColor="$backgroundStrong"
        borderColor={error ? '$danger' : '$border'}
        borderWidth={1}
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
