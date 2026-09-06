import { Feather } from '@expo/vector-icons'
import { XStack, Text, YStack } from 'tamagui'
import { Card } from '@/src/shared/ui/cards/Card'
import { getPluralForm } from '@/src/shared/utils/getPluralForm'
import type { Journal } from '../../model/journal.types'

type JournalRowProps = {
  journal: Journal
  onPress: () => void
}

export function JournalRow({ journal, onPress }: JournalRowProps) {
  const pageCount = journal._count.pages

  return (
    <Card pressStyle={{ opacity: 0.7, scale: 0.98 }} onPress={onPress}>
      <XStack alignItems="center" gap="$3">
        <YStack
          alignItems="center"
          backgroundColor="#F1EEFF"
          borderRadius={14}
          height={44}
          justifyContent="center"
          width={44}
        >
          <Feather name="book-open" size={20} color="#4F46B5" />
        </YStack>

        <YStack flex={1} gap="$1">
          <Text fontSize="$6" fontWeight="700" numberOfLines={1}>
            {journal.title}
          </Text>
          <Text fontSize="$3" opacity={0.55}>
            {pageCount} {getPluralForm(pageCount, ['страница', 'страницы', 'страниц'])}
          </Text>
        </YStack>

        <Feather name="chevron-right" size={20} color="#999999" />
      </XStack>
    </Card>
  )
}
