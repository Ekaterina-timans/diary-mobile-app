import { updateJournalPage } from '@/src/features/journal/model/journal.api'
import { JournalPage } from '@/src/features/journal/model/journal.types'
import { syncJournalPageDraft } from '@/src/features/journal/model/journalPageDraftSync'
import {
  getJournalPageDraft,
  markJournalPageDraftSynced,
} from '@/src/features/journal/storage/journalPageDraft.repository'
import { JournalPageDraft } from '@/src/features/journal/storage/journalPageDraft.types'

// Не подключает настоящий модуль API, используй поддельную версию
jest.mock('@/src/features/journal/model/journal.api', () => ({
  // Создаёт пустую поддельную функцию
  updateJournalPage: jest.fn(),
}))

jest.mock('@/src/features/journal/storage/journalPageDraft.repository', () => ({
  getJournalPageDraft: jest.fn(),
  markJournalPageDraftSynced: jest.fn(),
}))

const getJournalPageDraftMock = jest.mocked(getJournalPageDraft)
const updateJournalPageMock = jest.mocked(updateJournalPage)
const markJournalPageDraftSyncedMock = jest.mocked(markJournalPageDraftSynced)

const draft: JournalPageDraft = {
  userId: 'user-1',
  pageId: 'page-1',
  contentJson: {
    type: 'doc',
    content: [{ type: 'paragraph' }],
  },
  contentPlain: 'Мой текст',
  revision: 3,
  updatedAt: '2026-09-28T12:00:00.000Z',
  isDirty: true,
}

// Объединяет все проверки одной функции
describe('syncJournalPageDraft', () => {
  // Запускается перед каждым тестом. Очищает историю вызовов моков, чтобы один тест не влиял на другой
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('не отправляет запрос, если локального черновика нет', async () => {
    getJournalPageDraftMock.mockResolvedValue(null)
    // Настраивает имитацию SQLite: при поиске черновика база будто бы отвечает null
    await expect(syncJournalPageDraft('user-1', 'page-1')).resolves.toBeNull()
    // Вызывает настоящую функцию синхронизации и проверяем, что её Promise завершился значением null
    expect(updateJournalPageMock).not.toHaveBeenCalled()
    expect(markJournalPageDraftSyncedMock).not.toHaveBeenCalled()
  })

  test('не отправляет запрос, если черновик уже синхронизирован', async () => {
    getJournalPageDraftMock.mockResolvedValue({
      ...draft,
      isDirty: false,
    })

    await expect(syncJournalPageDraft('user-1', 'page-1')).resolves.toBeNull()

    expect(updateJournalPageMock).not.toHaveBeenCalled()
    expect(markJournalPageDraftSyncedMock).not.toHaveBeenCalled()
  })

  test('отправляет изменённый черновик и помечает его синхронизированным', async () => {
    const updatePage = {
      revision: 4,
    } as JournalPage

    getJournalPageDraftMock.mockResolvedValue(draft)
    updateJournalPageMock.mockResolvedValue(updatePage)
    // SQLite возвращает изменённый черновик и API успешно сохраняет его и возвращает новую версию страницы
    await expect(syncJournalPageDraft('user-1', 'page-1')).resolves.toBe(updatePage)

    expect(updateJournalPageMock).toHaveBeenCalledWith('page-1', {
      contentJson: draft.contentJson,
      contentPlain: draft.contentPlain,
      expectedRevision: 3, // Ожидаемая версия страницы
    })

    expect(markJournalPageDraftSyncedMock).toHaveBeenCalledWith(
      'user-1',
      'page-1',
      '2026-09-28T12:00:00.000Z',
      4,
    )
  })

  test('не помечает черновик синхронизированным, если API вернул ошибку', async () => {
    getJournalPageDraftMock.mockResolvedValue(draft)
    updateJournalPageMock.mockRejectedValue(new Error('Нет соединения с сервером'))

    await expect(
      syncJournalPageDraft('user-1', 'page-1'),
    ).rejects.toThrow('Нет соединения с сервером')

    expect(markJournalPageDraftSyncedMock).not.toHaveBeenCalled()
  })
})
