import { createInitialEditorContent } from '@/src/features/journal/model/createInitialEditorContent'
import { JournalPage } from '@/src/features/journal/model/journal.types'

function createPage(overrides: Partial<JournalPage> = {}): JournalPage {
  return {
    id: 'page-1',
    journalId: 'journal-1',
    pageIndex: 0,
    contentJson: null,
    contentPlain: null,
    bookmarkedAt: null,
    revision: 1,
    lastOpenedAt: null,
    createdAt: '2026-09-28T00:00:00.000Z',
    updatedAt: '2026-09-28T00:00:00.000Z',
    journal: {
      id: 'journal-1',
      title: 'Мой журнал',
      appearance: null,
    },
    ...overrides,
  }
}

describe('createInitialEditorContent', () => {
  test('возвращает сохранённый JSON-документ без изменений', () => {
    const contentJson = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Готовый текст' }],
        },
      ],
    }

    const page = createPage({
      contentJson,
      contentPlain: 'Готовый текст',
    })

    expect(createInitialEditorContent(page)).toBe(contentJson)
  })
})

test('создаёт пустой документ для новой страницы', () => {
  const page = createPage()

  expect(createInitialEditorContent(page)).toEqual({
    type: 'doc',
    content: [{ type: 'paragraph' }],
  })
})

test('преобразует простой текст в отдельные абзацы Tiptap', () => {
  const page = createPage({
    contentPlain: 'Первая запись\n\nТретья запись',
  })

  expect(createInitialEditorContent(page)).toEqual({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Первая запись' }],
      },
      {
        type: 'paragraph',
        content: undefined,
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Третья запись' }],
      },
    ],
  })
})
