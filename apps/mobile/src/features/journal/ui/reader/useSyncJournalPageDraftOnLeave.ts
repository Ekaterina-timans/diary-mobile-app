import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { syncJournalPageDraft } from '../../model/journalPageDraftSync'

type UseSyncJournalPageDraftOnLeaveProps = {
  userId: string
  pageId: string
  saveCurrentDraft: () => Promise<void>
}

// Перед уходом со страницы сохраняет актуальный текст в SQLite,
// затем отправляет локальный черновик на сервер.
export function useSyncJournalPageDraftOnLeave({
  userId,
  pageId,
  saveCurrentDraft,
}: UseSyncJournalPageDraftOnLeaveProps) {
  useFocusEffect(
    useCallback(() => {
      return () => {
        void saveCurrentDraft()
          .then(() => syncJournalPageDraft(userId, pageId))
          .catch(() => undefined)
      }
    }, [pageId, saveCurrentDraft, userId]),
  )
}
