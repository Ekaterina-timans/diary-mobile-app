import { api } from '@/src/shared/api/client'
import {
  CreateJournalFolderPayload,
  CreateJournalPayload,
  Journal,
  JournalDetails,
  JournalFolder,
  JournalPage,
  UpdateJournalPagePayload,
} from './journal.types'

// Методы этого файла сопоставляют действия дневника с HTTP-эндпоинтами API.

// Загружает папки пользователя вместе с количеством журналов в каждой из них.
export async function getJournalFolders(): Promise<JournalFolder[]> {
  const { data } = await api.get<JournalFolder[]>('/journal-folders')
  return data
}

// Загружает журналы пользователя, включая журналы без папки.
export async function getJournals(): Promise<Journal[]> {
  const { data } = await api.get<Journal[]>('/journals')
  return data
}

// Создаёт папку, в которую затем можно помещать журналы.
export async function createJournalFolder(
  payload: CreateJournalFolderPayload,
): Promise<JournalFolder> {
  const { data } = await api.post<JournalFolder>('/journal-folders', payload)
  return data
}

// Создаёт журнал. Поле folderId может быть null, поэтому папка необязательна.
export async function createJournal(payload: CreateJournalPayload): Promise<Journal> {
  const { data } = await api.post<Journal>('/journals', payload)
  return data
}

// Загружает журнал и список его страниц для экрана чтения.
export async function getJournal(journalId: string): Promise<JournalDetails> {
  const { data } = await api.get<JournalDetails>(`/journals/${journalId}`)
  return data
}

// Открывает страницу и обновляет на сервере время её последнего просмотра.
export async function openJournalPage(pageId: string): Promise<JournalPage> {
  const { data } = await api.patch<JournalPage>(`/journal-pages/${pageId}/opened`)
  return data
}
// Отправляет локально сохранённый текст страницы в основную базу данных.
// expectedRevision защищает от молчаливой перезаписи данных с другого устройства.
export async function updateJournalPage(pageId: string, payload: UpdateJournalPagePayload): Promise<JournalPage> {
  const { data } = await api.patch<JournalPage>(`/journal-pages/${pageId}`, payload)
  return data
}
