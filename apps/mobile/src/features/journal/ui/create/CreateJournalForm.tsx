import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Text, XStack, YStack } from 'tamagui'
import { Button } from '@/src/shared/ui/button/Button'
import { DropdownSelect, type DropdownOption } from '@/src/shared/ui/select/DropdownSelect'
import { TextField } from '@/src/shared/ui/fields/TextField'
import type { CreateJournalPayload, JournalFolder } from '../../model/journal.types'
import { createJournalSchema, type CreateJournalFormValues } from '../../model/journal.schema'
import { JournalModal } from '../common/JournalModal'

type CreateJournalFormProps = {
  visible: boolean
  folders: JournalFolder[]
  fixedFolderId?: string
  onClose: () => void
  onCreate: (payload: CreateJournalPayload) => Promise<void>
}

export function CreateJournalForm({
  visible,
  folders,
  fixedFolderId,
  onClose,
  onCreate,
}: CreateJournalFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateJournalFormValues>({
    resolver: zodResolver(createJournalSchema),
    defaultValues: {
      title: '',
      folderId: null,
    },
  })

  useEffect(() => {
    if (visible) {
      reset({
        title: '',
        folderId: fixedFolderId ?? null,
      })
      setSubmitError(null)
    }
  }, [fixedFolderId, reset, visible])

  const folderOptions: DropdownOption[] = [
    { value: null, label: 'Без папки' },
    ...folders.map((folder) => ({ value: folder.id, label: folder.title })),
  ]
  const fixedFolder = folders.find((folder) => folder.id === fixedFolderId)

  async function handleCreate(values: CreateJournalFormValues) {
    try {
      setSubmitError(null)

      await onCreate(values)
      onClose()
    } catch {
      setSubmitError('Не удалось создать журнал. Попробуйте ещё раз.')
    }
  }

  return (
    <JournalModal visible={visible} title="Новый журнал" onClose={onClose}>
      <YStack gap="$4">
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextField
              autoFocus
              borderRadius={16}
              height={44}
              label="Название"
              maxLength={120}
              paddingHorizontal={12}
              placeholder="Например, Какой хороший день"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message ?? submitError ?? undefined}
            />
          )}
        />

        {fixedFolderId ? (
          <YStack gap="$2">
            <Text color="$muted">Папка</Text>
            <XStack
              alignItems="center"
              backgroundColor="#F7F5FF"
              borderColor="#DDD7FF"
              borderRadius={16}
              borderWidth={1}
              gap="$2"
              padding="$3"
            >
              <Text>{fixedFolder?.title ?? 'Выбранная папка'}</Text>
            </XStack>
          </YStack>
        ) : (
          <Controller
            control={control}
            name="folderId"
            render={({ field: { onChange, value } }) => (
              <DropdownSelect
                label="Папка"
                options={folderOptions}
                placeholder="Без папки"
                value={value}
                onChange={onChange}
              />
            )}
          />
        )}

        <Button disabled={isSubmitting} onPress={handleSubmit(handleCreate)}>
          {isSubmitting ? 'Создаём...' : 'Создать журнал'}
        </Button>
      </YStack>
    </JournalModal>
  )
}
