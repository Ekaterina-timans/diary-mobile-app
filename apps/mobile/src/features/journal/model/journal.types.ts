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

export type JournalPagePreview = {
  id: string
  pageIndex: number
  bookmarkedAt: string | null
  lastOpenedAt: string | null
  revision: number
  updatedAt: string
}

export type JournalDetails = Omit<Journal, '_count'> & {
  pages: JournalPagePreview[]
}

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
