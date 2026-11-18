import z from 'zod'

// Проверяет форму создания папки до отправки данных на сервер.
export const createFolderSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Введите название папки')
    .max(80, 'Название папки слишком длинное'),
})

// Проверяет форму создания журнала. Папка может не выбираться.
export const createJournalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Введите название журнала')
    .max(120, 'Название журнала слишком длинное'),

  folderId: z.string().nullable(),
})

// Типы полей форм выводятся из схем, чтобы правила валидации и TypeScript не расходились.
export type CreateFolderFormValues = z.infer<typeof createFolderSchema>
export type CreateJournalFormValues = z.infer<typeof createJournalSchema>
