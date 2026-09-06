import { Feather } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'
import { Card } from '@/src/shared/ui/cards/Card'
import { getPluralForm } from '@/src/shared/utils/getPluralForm'
import type { Journal, JournalFolder } from '../../model/journal.types'
import { JournalRow } from '../list/JournalRow'

type JournalFolderSectionProps = {
  folder: JournalFolder
  journals: Journal[]
  onCreateJournal: (folderId: string) => void
  onOpenJournal: (journalId: string) => void
}

/*
* Отрисовывает одну папку: её иконку, название, количество журналов и список журналов внутри. 
*/
export function JournalFolderSection({
  folder,
  journals,
  onCreateJournal,
  onOpenJournal
}: JournalFolderSectionProps) {
  return (
    <Card backgroundColor="#FBFAFF" borderColor="#DDD7FF" gap="$3" padding="$3">
      <XStack alignItems="center" gap="$3">
        <YStack
          alignItems="center"
          backgroundColor="#F1EEFF"
          borderRadius={14}
          height={42}
          justifyContent="center"
          width={42}
        >
          {folder.icon ? (
            <Text fontSize="$5">{folder.icon}</Text>
          ) : (
            <Feather name="folder" size={20} color={folder.color ?? '#4F46B5'} />
          )}
        </YStack>

        <YStack flex={1} gap="$1">
          <Text fontSize="$6" fontWeight="700" numberOfLines={1}>
            {folder.title}
          </Text>
          <Text fontSize="$3" opacity={0.5}>
            {journals.length} {getPluralForm(journals.length, ['журнал', 'журнала', 'журналов'])}
          </Text>
        </YStack>

        <Pressable
          accessibilityLabel={`Создать журнал в папке ${folder.title}`}
          hitSlop={10}
          onPress={() => onCreateJournal(folder.id)}
        >
          <YStack
            alignItems="center"
            backgroundColor="#F1EEFF"
            borderRadius={12}
            height={36}
            justifyContent="center"
            width={36}
          >
            <Feather name="plus" size={20} color="#4F46B5" />
          </YStack>
        </Pressable>
      </XStack>

      {journals.map((journal) => (
        <JournalRow
          key={journal.id}
          journal={journal}
          onPress={() => onOpenJournal(journal.id)}
        />
      ))}
    </Card>
  )
}
