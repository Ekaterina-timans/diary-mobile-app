import { getJournalPageDraft, markJournalPageDraftSynced } from "../storage/journalPageDraft.repository";
import { updateJournalPage } from "./journal.api";

// Синхронизирует один локальный черновик с сервером. Сначала берёт актуальную
// копию из SQLite, затем передаёт её revision для защиты от конфликтов.
export async function syncJournalPageDraft(userId: string, pageId: string) {
  const draft = await getJournalPageDraft(userId, pageId)

  // Если черновика нет или сервер уже содержит его актуальную версию, ничего не делаем
  if (!draft || !draft.isDirty) {
    return null
  }

  const updatedPage = await updateJournalPage(pageId, {
    contentJson: draft.contentJson,
    contentPlain: draft.contentPlain,
    expectedRevision: draft.revision
  })

  // Снимаем статус несинхронизированного черновика только после успешного ответа сервера
  await markJournalPageDraftSynced(
    userId,
    pageId,
    draft.updatedAt,
    updatedPage.revision
  )

  return updatedPage
}
