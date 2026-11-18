// Локальная версия страницы, которая позволяет не потерять изменения без сети.
// isDirty показывает, что этот черновик ещё нужно отправить на сервер.
export type JournalPageDraft = {
  userId: string
  pageId: string
  contentJson: Record<string, unknown>
  contentPlain: string
  revision: number
  updatedAt: string
  isDirty: boolean
}
