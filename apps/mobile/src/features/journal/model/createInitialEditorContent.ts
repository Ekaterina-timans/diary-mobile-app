import type { JournalPage } from './journal.types'

export function createInitialEditorContent(page: JournalPage): Record<string, unknown> {
  if (page.contentJson) {
    return page.contentJson
  }

  if (!page.contentPlain) {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    }
  }

  return {
    type: 'doc',
    content: page.contentPlain.split('\n').map((text) => ({
      type: 'paragraph',
      content: text ? [{ type: 'text', text }] : undefined,
    })),
  }
}
