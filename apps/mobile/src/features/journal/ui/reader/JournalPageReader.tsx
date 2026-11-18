import { useEffect, useState } from 'react'
import { JournalPage } from '../../model/journal.types'
import { openJournalPage } from '../../model/journal.api'
import { Text, YStack } from 'tamagui'
import { ActivityIndicator } from 'react-native'
import { Card } from '@/src/shared/ui/cards/Card'
import { Button } from '@/src/shared/ui/button/Button'
import { Header } from '@/src/shared/ui/navigation/Header'
import { JournalPageEditor } from '../editor/JournalPageEditor'
import { useAuthStore } from '@/src/features/auth/authStore'
import { getJournalPageDraft } from '../../storage/journalPageDraft.repository'

type JournalPageReaderProps = {
  pageId: string
}

export function JournalPageReader({ pageId }: JournalPageReaderProps) {
  const userId = useAuthStore((state) => state.user?.id)
  const [page, setPage] = useState<JournalPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadPage() {
    if (!userId) {
      setError('Не удалось определить текущего пользователя.')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const [serverPage, draft] = await Promise.all([
        openJournalPage(pageId),
        getJournalPageDraft(userId, pageId),
      ])

      if (draft?.isDirty) {
        setPage({
          ...serverPage,
          contentJson: draft.contentJson,
          contentPlain: draft.contentPlain,
          revision: draft.revision,
        })
        return
      }

      setPage(serverPage)
    } catch {
      setError('Не удалось открыть страницу. Попробуйте ещё раз.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPage()
  }, [pageId, userId])

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color="#6B5BFF" />
      </YStack>
    )
  }

  if (error || !page || !userId) {
    return (
      <YStack flex={1} justifyContent="center" gap="$4">
        <Card gap="$3">
          <Text fontSize="$6" fontWeight="700">
            Не удалось открыть страницу
          </Text>
          <Text opacity={0.6}>{error}</Text>
        </Card>

        <Button onPress={() => void loadPage()}>Повторить</Button>
      </YStack>
    )
  }

  return (
    <YStack flex={1} gap="$4">
      <Header title={page.journal.title} />

      <Text fontSize="$5" opacity={0.55}>
        Страница {page.pageIndex + 1}
      </Text>

      <JournalPageEditor page={page} userId={userId} />
    </YStack>
  )
}
