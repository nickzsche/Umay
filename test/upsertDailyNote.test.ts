import { test, expect } from 'bun:test'
import { upsertDailyNote } from '../src/storage.ts'
import type { AppData } from '../src/types.ts'

const base = (): AppData => ({
  version: '2.0',
  projects: [],
  lastUpdated: '2026-01-01T00:00:00.000Z',
  settings: {
    darkMode: false,
    defaultView: 'grid',
    sortBy: 'updated',
    autoSave: true,
    autoSaveInterval: 500,
    aiExportTemplate: 'default',
    showArchived: false,
  },
  dailyNotes: [],
  trash: [],
})

test('creates a daily note when none exists for the date', () => {
  const next = upsertDailyNote(base(), '2026-06-15', 'hello')
  expect(next.dailyNotes).toHaveLength(1)
  expect(next.dailyNotes[0]).toMatchObject({
    id: 'daily-2026-06-15',
    date: '2026-06-15',
    content: 'hello',
  })
})

test('updates an existing note instead of duplicating it (regression)', () => {
  const once = upsertDailyNote(base(), '2026-06-15', 'first')
  const twice = upsertDailyNote(once, '2026-06-15', 'second')
  expect(twice.dailyNotes).toHaveLength(1)
  expect(twice.dailyNotes[0].content).toBe('second')
  expect(twice.dailyNotes[0].createdAt).toBe(once.dailyNotes[0].createdAt)
})
