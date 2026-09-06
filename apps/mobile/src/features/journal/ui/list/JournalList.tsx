import { Feather } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'
import { Button } from '@/src/shared/ui/button/Button'
import { Card } from '@/src/shared/ui/cards/Card'
import { createJournal, createJournalFolder, getJournalFolders, getJournals } from '../../model/journal.api'
import type { CreateJournalPayload, Journal, JournalFolder } from '../../model/journal.types'
import { CreateFolderForm } from '../create/CreateFolderForm'
import { CreateJournalForm } from '../create/CreateJournalForm'
import { CreateMenu } from '../create/CreateMenu'
import { EmptyJournalState } from './EmptyJournalState'
import { JournalFolderSection } from '../folders/JournalFolderSection'
import { JournalRow } from './JournalRow'

/*
* Загружает данные с сервера, хранит их в состоянии, показывает загрузку, ошибку, 
* пустой список или сами папки и журналы.
*/
export function JournalList() {
  const [folders, setFolders] = useState<JournalFolder[]>([])
  const [journals, setJournals] = useState<Journal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createMode, setCreateMode] = useState<'menu' | 'folder' | 'journal' | null>(null)
  const [fixedFolderId, setFixedFolderId] = useState<string | undefined>(undefined)

  async function loadJournalData() {
    try {
      setError(null)

      const [nextFolders, nextJournals] = await Promise.all([
        getJournalFolders(),
        getJournals(),
      ])

      setFolders(nextFolders)
      setJournals(nextJournals)
    } catch {
      setError('Не удалось загрузить дневники. Проверьте подключение к серверу.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateFolder(title: string) {
    await createJournalFolder({ title })
    await loadJournalData()
  }

  async function handleCreateJournal(payload: CreateJournalPayload) {
    await createJournal(payload)
    await loadJournalData()
  }

  function openCreateJournal(folderId?: string) {
    setFixedFolderId(folderId)
    setCreateMode('journal')
  }

  function closeCreateModal() {
    setCreateMode(null)
    setFixedFolderId(undefined)
  }

  function openJournal(journalId: string) {
    router.push({
      pathname: '/journals/[journalId]',
      params: { journalId }
    })
  }

  useFocusEffect(
    useCallback(() => {
      void loadJournalData()
    }, []),
  )

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color="#6B5BFF" />
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" gap="$4">
        <Card gap="$3">
          <Text fontSize="$6" fontWeight="700">
            Не удалось открыть дневник
          </Text>
          <Text opacity={0.6}>{error}</Text>
        </Card>

        <Button onPress={() => void loadJournalData()}>Повторить</Button>
      </YStack>
    )
  }

  const unfiledJournals = journals.filter((journal) => journal.folderId === null)
  const hasContent = folders.length > 0 || unfiledJournals.length > 0

  return (
    <YStack flex={1} gap="$4">
      <XStack alignItems="center" justifyContent="space-between">
        <YStack flex={1} gap="$1">
          <Text fontSize="$10" fontWeight="800">
            Дневник
          </Text>
          <Text opacity={0.55}>
            Ваше личное пространство для мыслей и историй
          </Text>
        </YStack>

        <Pressable
          accessibilityLabel="Создать журнал или папку"
          onPress={() => setCreateMode('menu')}
        >
          <XStack
            alignItems="center"
            backgroundColor="#F1EEFF"
            borderColor="#DDD7FF"
            borderRadius={14}
            borderWidth={1}
            gap="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
          >
            <Feather name="plus" size={18} color="#4F46B5" />
            <Text color="#4F46B5" fontSize="$4" fontWeight="700">
              Создать
            </Text>
          </XStack>
        </Pressable>
      </XStack>

      {hasContent ? (
        <ScrollView
          contentContainerStyle={{ gap: 14, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {folders.map((folder) => (
            <JournalFolderSection
              key={folder.id}
              folder={folder}
              journals={journals.filter((journal) => journal.folderId === folder.id)}
              onCreateJournal={openCreateJournal}
              onOpenJournal={openJournal}
            />
          ))}

          {unfiledJournals.length > 0 && (
            <YStack gap="$3">
              <XStack alignItems="center" gap="$2">
                <Feather name="book" size={20} color="#6B5BFF" />
                <Text fontSize="$6" fontWeight="700">
                  Без папки
                </Text>
              </XStack>

              {unfiledJournals.map((journal) => (
                <JournalRow
                  key={journal.id}
                  journal={journal}
                  onPress={() => openJournal(journal.id)}
                />
              ))}
            </YStack>
          )}
        </ScrollView>
      ) : (
        <EmptyJournalState />
      )}

      <CreateMenu
        visible={createMode === 'menu'}
        onClose={closeCreateModal}
        onCreateJournal={() => openCreateJournal()}
        onCreateFolder={() => setCreateMode('folder')}
      />

      <CreateFolderForm
        visible={createMode === 'folder'}
        onClose={closeCreateModal}
        onCreate={handleCreateFolder}
      />

      <CreateJournalForm
        visible={createMode === 'journal'}
        folders={folders}
        fixedFolderId={fixedFolderId}
        onClose={closeCreateModal}
        onCreate={handleCreateJournal}
      />
    </YStack>
  )
}
