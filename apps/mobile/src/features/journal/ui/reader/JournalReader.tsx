import { useEffect, useState } from 'react'
import { JournalDetails } from '../../model/journal.types'
import { getJournal } from '../../model/journal.api'
import { Text, YStack } from 'tamagui'
import { ActivityIndicator, ScrollView } from 'react-native'
import { Card } from '@/src/shared/ui/cards/Card'
import { Button } from '@/src/shared/ui/button/Button'
import { Header } from '@/src/shared/ui/navigation/Header'
import { router } from 'expo-router'

type JournalReaderProps = {
  journalId: string
}

export function JournalReader({ journalId }: JournalReaderProps) {
  const [journal, setJournal] = useState<JournalDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadJournal() {
    try {
      setIsLoading(true)
      setError(null)

      const nextJournal = await getJournal(journalId)
      setJournal(nextJournal)
    } catch {
      setError('Не удалось открыть журнал. Попробуйте ещё раз.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadJournal()
  }, [journalId])

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color="#6B5BFF" />
      </YStack>
    )
  }

  if (error || !journal) {
    return (
      <YStack flex={1} justifyContent="center" gap="$4">
        <Card gap="$3">
          <Text fontSize="$6" fontWeight="700">
            Не удалось открыть журнал
          </Text>
          <Text opacity={0.6}>{error}</Text>
        </Card>

        <Button onPress={() => void loadJournal()}>Повторить</Button>
      </YStack>
    )
  }

  return (
    <YStack flex={1} gap="$4">
      <Header title={journal.title} />

      <Text opacity={0.55}>{journal.folder?.title ?? 'Без папки'}</Text>

      <ScrollView
        contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Text fontSize="$7" fontWeight="800">
          Страницы
        </Text>

        {journal.pages.map((page) => (
          <Card
            key={page.id}
            gap="$1"
            pressStyle={{ opacity: 0.7, scale: 0.98 }}
            onPress={() =>
              router.push({
                pathname: '/journal-pages/[pageId]',
                params: { pageId: page.id },
              })
            }
          >
            <Text fontSize="$6" fontWeight="700">
              Страница {page.pageIndex + 1}
            </Text>

            <Text fontSize="$3" opacity={0.55}>
              Версия {page.revision}
              {page.bookmarkedAt ? ' · Есть закладка' : ''}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </YStack>
  )
}
