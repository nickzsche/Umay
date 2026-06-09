export type NoteType = 'note' | 'task' | 'idea'
export type NoteStatus = 'active' | 'archived' | 'completed'
export type ViewMode = 'grid' | 'kanban' | 'split'
export type SortBy = 'updated' | 'created' | 'title' | 'pinned'

export interface Attachment {
  id: string
  name: string
  type: string
  path: string
  size: number
  createdAt: string
}

export interface Reminder {
  id: string
  noteId: string
  dueDate: string
  message: string
  completed: boolean
}

export interface NoteVersion {
  id: string
  content: string
  title: string
  createdAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  type: NoteType
  status: NoteStatus
  tags: string[]
  pinned: boolean
  starred: boolean
  createdAt: string
  updatedAt: string
  projectId?: string
  attachments?: Attachment[]
  reminders?: Reminder[]
  summary?: string
  aiTags?: string[]
  relatedNoteIds?: string[]
  history?: NoteVersion[]
  readingTime?: number
  wordCount?: number
}

export interface Project {
  id: string
  name: string
  description: string
  color: string
  emoji?: string
  archived: boolean
  createdAt: string
  updatedAt: string
  notes: Note[]
  kanbanColumns?: string[]
}

export interface AppData {
  version: string
  projects: Project[]
  lastUpdated: string
  settings: AppSettings
  dailyNotes: DailyNote[]
  trash: TrashItem[]
}

export interface AppSettings {
  darkMode: boolean
  defaultView: ViewMode
  sortBy: SortBy
  autoSave: boolean
  autoSaveInterval: number
  aiExportTemplate: string
  showArchived: boolean
  focusMode: boolean
  wordCountGoal: number
  customCss?: string
}

export interface DailyNote {
  id: string
  date: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface TrashItem {
  id: string
  type: 'note' | 'project'
  data: Note | Project
  deletedAt: string
  originalProjectId?: string
}

export interface NoteTemplate {
  id: string
  name: string
  type: NoteType
  title: string
  content: string
  tags: string[]
  icon: string
}

export interface AIExportFormat {
  context: string
  requirements: string[]
  constraints: string[]
  references: string[]
  notes: {
    title: string
    content: string
    type: string
    tags: string[]
  }[]
}

export interface ElectronAPI {
  getNotes: () => Promise<AppData>
  saveNotes: (notes: AppData) => Promise<boolean>
  exportNotes: (notes: AppData) => Promise<boolean>
  exportAiPrompt: (prompt: string) => Promise<boolean>
  openFile: () => Promise<string | null>
  saveFile: (data: string, filename: string) => Promise<boolean>
}

export interface SearchResult {
  note: Note
  project: Project
  matches: {
    field: string
    text: string
    index: number
  }[]
}

export interface ShortcutMap {
  [key: string]: () => void
}
