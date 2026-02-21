import { YStack, YStackProps } from 'tamagui'

export function Surface({ children, ...props }: YStackProps) {
  return (
    <YStack backgroundColor="$backgroundStrong" borderRadius={16} {...props}>
      {children}
    </YStack>
  )
}
