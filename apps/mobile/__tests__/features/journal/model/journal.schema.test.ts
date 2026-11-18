import { createJournalSchema } from '@/src/features/journal/model/journal.schema'

describe('createJournalSchema', () => {
  test('принимает журнал без папки и убирает пробелы вокруг названия', () => {
    const result = createJournalSchema.parse({
      title: '  Хороший день  ',
      folderId: null,
    })

    expect(result).toEqual({
      title: 'Хороший день',
      folderId: null,
    })
  })

  test('принимает журнал с выбранной папкой', () => {
    const result = createJournalSchema.parse({
      title: 'Моя книга',
      folderId: 'folder-1',
    })

    expect(result).toEqual({
      title: 'Моя книга',
      folderId: 'folder-1',
    })
  })

  test('не принимает название только из пробелов', () => {
    const result = createJournalSchema.safeParse({
      title: '   ',
      folderId: null,
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Введите название журнала')
    }
  })

  test('не принимает название длиннее 120 символов', () => {
    const result = createJournalSchema.safeParse({
      title: 'а'.repeat(121),
      folderId: null,
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Название журнала слишком длинное')
    }
  })
})
