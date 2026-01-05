import { Button, Card, Text, YStack } from 'tamagui'
import { Screen } from '@/src/shared/ui/Screen'
import { Title } from '@/src/shared/ui/Title'
import { useAuthStore } from '@/src/features/auth/authStore'

export default function SettingsScreen() {
  const isReady = useAuthStore((s) => s.isReady)
  const isAuthed = useAuthStore((s) => s.isAuthed)
  const user = useAuthStore((s) => s.user)
  const signInDev = useAuthStore((s) => s.signInDev)
  const signOut = useAuthStore((s) => s.signOut)

  return (
    <Screen>
      <Title>Settings</Title>

      <Card padded bordered>
        <YStack gap="$2">
          <Text>isReady: {String(isReady)}</Text>
          <Text>isAuthed: {String(isAuthed)}</Text>
          <Text>User: {user ? user.email : 'null'}</Text>
        </YStack>
      </Card>

      {!isAuthed ? (
        <Button onPress={() => signInDev()}>Sign in (dev)</Button>
      ) : (
        <Button onPress={() => signOut()}>Sign out</Button>
      )}
    </Screen>
  )
}
