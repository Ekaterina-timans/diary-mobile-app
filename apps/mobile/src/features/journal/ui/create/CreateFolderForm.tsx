import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { CreateFolderFormValues, createFolderSchema } from '../../model/journal.schema'
import { zodResolver } from "@hookform/resolvers/zod"
import { JournalModal } from '../common/JournalModal'
import { YStack } from "tamagui"
import { TextField } from "@/src/shared/ui/fields/TextField"
import { Button } from "@/src/shared/ui/button/Button"

type CreateFolderFormProps = {
  visible: boolean
  onClose: () => void
  onCreate: (title: string) => Promise<void>
}

export function CreateFolderForm({
  visible,
  onClose,
  onCreate,
}: CreateFolderFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFolderFormValues>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      title: '',
    },
  })

  useEffect(() => {
    if (visible) {
      reset({ title: '' })
      setSubmitError(null)
    }
  }, [reset, visible])

  async function handleCreate(values: CreateFolderFormValues) {
    try {
      setSubmitError(null)

      await onCreate(values.title)
      onClose()
    } catch {
      setSubmitError('Не удалось создать папку. Попробуйте ещё раз.')
    }
  }

  return (
    <JournalModal
      visible={visible}
      title="Новая папка"
      onClose={onClose}
    >
      <YStack gap="$4">
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextField
              autoFocus
              label="Название"
              maxLength={80}
              placeholder="Например, Май 2026"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message ?? submitError ?? undefined}
            />
          )}
        />

        <Button
          disabled={isSubmitting}
          onPress={handleSubmit(handleCreate)}
        >
          {isSubmitting ? 'Создаём...' : 'Создать папку'}
        </Button>
      </YStack>
    </JournalModal>
  )
}
