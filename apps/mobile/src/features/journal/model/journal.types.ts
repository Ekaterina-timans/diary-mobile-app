// Основные модели, которые мобильное приложение получает от API дневника.
export type JournalFolder = {
  id: string
  title: string
  icon: string | null
  color: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  _count: {
    journals: number
  }
}

// Краткая информация о папке, вложенная в ответ о журнале.
export type JournalFolderPreview = Pick<JournalFolder, 'id' | 'title' | 'icon' | 'color'>

export type Journal = {
  id: string
  folderId: string | null
  title: string
  appearance: Record<string, unknown> | null
  sortOrder: number
  pinned: boolean
  pinnedAt: string | null
  lastOpenedAt: string | null
  createdAt: string
  updatedAt: string
  folder: JournalFolderPreview | null
  _count: {
    pages: number
  }
}

// Лёгкая версия страницы для списка страниц внутри журнала.
export type JournalPagePreview = {
  id: string
  pageIndex: number
  bookmarkedAt: string | null
  lastOpenedAt: string | null
  revision: number
  updatedAt: string
}

// Полный журнал для экрана чтения: вместо счётчика содержит реальные страницы.
export type JournalDetails = Omit<Journal, '_count'> & {
  pages: JournalPagePreview[]
}

// Полное содержимое одной страницы. JSON хранит форматирование Tiptap,
// а plain-текст нужен для превью и будущего поиска.
export type JournalPage = {
  id: string
  journalId: string
  pageIndex: number
  contentJson: Record<string, unknown> | null
  contentPlain: string | null
  bookmarkedAt: string | null
  revision: number
  lastOpenedAt: string | null
  createdAt: string
  updatedAt: string
  journal: Pick<Journal, 'id' | 'title' | 'appearance'>
}

// Payload-типы описывают данные, которые приложение отправляет на API.
export type CreateJournalFolderPayload = {
  title: string
  icon?: string
  color?: string
}

export type CreateJournalPayload = {
  title: string
  folderId?: string | null
  appearance?: Record<string, unknown>
}

export type UpdateJournalPagePayload = {
  contentJson: Record<string, unknown>
  contentPlain: string
  expectedRevision: number
}
