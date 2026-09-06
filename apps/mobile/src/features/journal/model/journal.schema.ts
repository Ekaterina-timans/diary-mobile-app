import z from 'zod'

export const createFolderSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Введите название папки')
    .max(80, 'Название папки слишком длинное'),
})

export const createJournalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Введите название журнала')
    .max(120, 'Название журнала слишком длинное'),

  folderId: z.string().nullable(),
})

export type CreateFolderFormValues = z.infer<typeof createFolderSchema>
export type CreateJournalFormValues = z.infer<typeof createJournalSchema>
