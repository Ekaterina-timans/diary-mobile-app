import { api } from '@/src/shared/api/client'
import {
  CreateJournalFolderPayload,
  CreateJournalPayload,
  Journal,
  JournalDetails,
  JournalFolder,
  JournalPage,
} from './journal.types'

export async function getJournalFolders(): Promise<JournalFolder[]> {
  const { data } = await api.get<JournalFolder[]>('/journal-folders')
  return data
}

export async function getJournals(): Promise<Journal[]> {
  const { data } = await api.get<Journal[]>('/journals')
  return data
}

export async function createJournalFolder(
  payload: CreateJournalFolderPayload,
): Promise<JournalFolder> {
  const { data } = await api.post<JournalFolder>('/journal-folders', payload)
  return data
}

export async function createJournal(payload: CreateJournalPayload): Promise<Journal> {
  const { data } = await api.post<Journal>('/journals', payload)
  return data
}

export async function getJournal(journalId: string): Promise<JournalDetails> {
  const { data } = await api.get<JournalDetails>(`/journals/${journalId}`)
  return data
}

export async function openJournalPage(pageId: string): Promise<JournalPage> {
  const { data } = await api.patch<JournalPage>(`/journal-pages/${pageId}/opened`)
  return data
}