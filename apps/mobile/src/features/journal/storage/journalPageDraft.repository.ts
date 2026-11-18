import { getDatabase } from '@/src/shared/database/database'
import { JournalPageDraft } from './journalPageDraft.types'

type JournalPageDraftRow = {
  user_id: string
  page_id: string
  content_json: string
  content_plain: string
  revision: number
  updated_at: string
  is_dirty: number
}

// Не даёт нескольким параллельным вызовам повторно создавать одну SQLite-таблицу.
let tablePromise: Promise<void> | null = null

// Один раз создаёт таблицу локальных черновиков перед чтением или записью.
function ensureJournalPageDraftTable() {
  if (!tablePromise) {
    tablePromise = getDatabase().then((database) =>
      database.execAsync(`
        CREATE TABLE IF NOT EXISTS journal_page_drafts (
          user_id TEXT NOT NULL,
          page_id TEXT NOT NULL,
          content_json TEXT NOT NULL,
          content_plain TEXT NOT NULL,
          revision INTEGER NOT NULL,
          updated_at TEXT NOT NULL,
          is_dirty INTEGER NOT NULL,
          PRIMARY KEY (user_id, page_id)
        );
      `),
    )
  }

  return tablePromise
}

// Преобразует строку SQLite в тип черновика, который использует приложение.
function mapJournalPageDraft(row: JournalPageDraftRow): JournalPageDraft {
  return {
    userId: row.user_id,
    pageId: row.page_id,
    contentJson: JSON.parse(row.content_json) as Record<string, unknown>,
    contentPlain: row.content_plain,
    revision: row.revision,
    updatedAt: row.updated_at,
    isDirty: row.is_dirty === 1,
  }
}

// Создаёт новый черновик или обновляет существующий после изменения страницы.
// MAX для revision не позволяет поздней локальной записи затереть ревизию,
// которую сервер уже увеличил после предыдущей синхронизации.
export async function saveJournalPageDraft(draft: JournalPageDraft) {
  await ensureJournalPageDraftTable()

  const database = await getDatabase()

  await database.runAsync(
    `
      INSERT INTO journal_page_drafts (
        user_id,
        page_id,
        content_json,
        content_plain,
        revision,
        updated_at,
        is_dirty
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, page_id) DO UPDATE SET
        content_json = excluded.content_json,
        content_plain = excluded.content_plain,
        revision = MAX(journal_page_drafts.revision, excluded.revision),
        updated_at = excluded.updated_at,
        is_dirty = excluded.is_dirty;
    `,
    draft.userId,
    draft.pageId,
    JSON.stringify(draft.contentJson),
    draft.contentPlain,
    draft.revision,
    draft.updatedAt,
    draft.isDirty ? 1 : 0,
  )
}

// Возвращает локальный черновик конкретной страницы текущего пользователя.
export async function getJournalPageDraft(userId: string, pageId: string) {
  await ensureJournalPageDraftTable()

  const database = await getDatabase()
  const row = await database.getFirstAsync<JournalPageDraftRow>(
    `
      SELECT *
      FROM journal_page_drafts
      WHERE user_id = ? AND page_id = ?;
    `,
    userId,
    pageId,
  )

  return row ? mapJournalPageDraft(row) : null
}

// Возвращает все черновики пользователя, которые ещё не синхронизированы с сервером.
export async function getPendingJournalPageDrafts(userId: string) {
  await ensureJournalPageDraftTable()

  const database = await getDatabase()

  const rows = await database.getAllAsync<JournalPageDraftRow>(
    `
      SELECT *
      FROM journal_page_drafts
      WHERE user_id = ? AND is_dirty = 1
      ORDER BY updated_at ASC;
    `,
    userId,
  )

  return rows.map(mapJournalPageDraft)
}

// Обновляет ревизию черновика после ответа сервера и отмечает его синхронизированным,
// только если пользователь не успел изменить текст во время отправки.
export async function markJournalPageDraftSynced(
  userId: string,
  pageId: string,
  updatedAt: string,
  revision: number,
) {
  await ensureJournalPageDraftTable()

  const database = await getDatabase()

  await database.runAsync(
    `
      UPDATE journal_page_drafts
      SET
        revision = ?,
        is_dirty = CASE
          WHEN updated_at = ? THEN 0
          ELSE is_dirty
        END
      WHERE user_id = ? AND page_id = ?;
    `,
    revision,
    updatedAt,
    userId,
    pageId,
  )
}
