import { YStack, YStackProps } from 'tamagui'

export function Card({ children, ...props }: YStackProps) {
  return (
    <YStack
      backgroundColor="$backgroundStrong"
      borderRadius={20}
      padding="$4"
      borderWidth={1}
      borderColor="$border"
      shadowColor="#000"
      shadowOpacity={0.04}
      shadowRadius={12}
      shadowOffset={{ width: 0, height: 4 }}
      {...props}
    >
      {children}
    </YStack>
  )
}
