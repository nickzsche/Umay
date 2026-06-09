import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AppData, Project, Note, NoteType, NoteTemplate, ViewMode } from './types'
import { loadData, saveData, createEmptyData, exportAiPrompt } from './storage'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import Sidebar from './components/Sidebar'
import ProjectView from './components/ProjectView'
import NoteEditor from './components/NoteEditor'
import SearchPalette from './components/SearchPalette'
import NoteTemplates from './components/NoteTemplates'
import GlobalAiExport from './components/GlobalAiExport'
import KanbanBoard from './components/KanbanBoard'

import TagsCloud from './components/TagsCloud'
import DailyNotes from './components/DailyNotes'
import AttachmentsPanel from './components/AttachmentsPanel'
import ArchiveView from './components/ArchiveView'
import RemindersPanel from './components/RemindersPanel'
import AiFeatures from './components/AiFeatures'
import TrashView from './components/TrashView'
import QuickNote from './components/QuickNote'
import StarredNotes from './components/StarredNotes'
import FocusMode from './components/FocusMode'
import TableOfContents from './components/TableOfContents'
import ExportPanel from './components/ExportPanel'
import NoteHistory from './components/NoteHistory'
import BacklinksPanel from './components/BacklinksPanel'
import StatisticsDashboard from './components/StatisticsDashboard'
import SmartFolders from './components/SmartFolders'
import BatchOperations from './components/BatchOperations'
import { Plus, Moon, Sun, Search, LayoutGrid, Columns, Sparkles, Command, Star, Copy, Focus, BookOpen, BarChart3, FolderOpen, FileOutput, History } from 'lucide-react'

export default function App() {
  const [data, setData] = useState<AppData>(createEmptyData())
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showSearch, setShowSearch] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showGlobalAiExport, setShowGlobalAiExport] = useState(false)
  const [showTagsCloud, setShowTagsCloud] = useState(false)
  const [showDailyNotes, setShowDailyNotes] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [showReminders, setShowReminders] = useState(false)
  const [showAiFeatures, setShowAiFeatures] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const [splitView, setSplitView] = useState(false)
  const [showQuickNote, setShowQuickNote] = useState(false)
  const [showStarred, setShowStarred] = useState(false)
  const [showFocusMode, setShowFocusMode] = useState(false)
  const [showToc, setShowToc] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showBacklinks, setShowBacklinks] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showSmartFolders, setShowSmartFolders] = useState(false)
  const [showBatch, setShowBatch] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })
  const [loading, setLoading] = useState(true)

  // Load data on mount
  useEffect(() => {
    const init = async () => {
      try {
        const loaded = await loadData()
        setData(loaded)
        if (loaded.projects.length > 0) {
          setSelectedProjectId(loaded.projects[0].id)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // Auto-save
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        saveData(data)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [data, loading])

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  const selectedProject = data.projects.find(p => p.id === selectedProjectId)
  const selectedNote = selectedProject?.notes.find(n => n.id === selectedNoteId)

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+k': () => setShowSearch(true),
    'cmd+n': () => selectedProjectId && addNote('note'),
    'cmd+shift+p': () => addProject(),
    'cmd+s': () => saveData(data),
    'cmd+t': () => setShowTemplates(true),
    'cmd+shift+e': () => setShowGlobalAiExport(true),
    'cmd+shift+a': () => setShowArchive(true),
    'cmd+shift+r': () => setShowReminders(true),
    'cmd+shift+d': () => setShowDailyNotes(true),
    'cmd+shift+x': () => setShowTrash(true),
    'cmd+shift+i': () => setShowAiFeatures(true),
    'cmd+shift+g': () => setShowTagsCloud(true),
    'cmd+shift+v': () => setSplitView(!splitView),
    'cmd+shift+k': () => selectedProject && setViewMode(viewMode === 'grid' ? 'kanban' : 'grid'),
    'cmd+shift+n': () => setShowQuickNote(true),
    'cmd+shift+f': () => setShowFocusMode(true),
    'cmd+shift+h': () => setShowHistory(true),
    'cmd+shift+b': () => setShowBacklinks(true),
    'cmd+shift+s': () => setShowStats(true),
    'cmd+shift+m': () => setShowSmartFolders(true),
    'cmd+shift+o': () => setShowExport(true),
    'cmd+shift+l': () => setShowStarred(true),
    'cmd+shift+t': () => setShowToc(true),
    'cmd+shift+u': () => setShowBatch(true),
    'escape': () => {
      setShowSearch(false)
      setShowTemplates(false)
      setShowGlobalAiExport(false)
      setShowTagsCloud(false)
      setShowDailyNotes(false)
      setShowAttachments(false)
      setShowArchive(false)
      setShowReminders(false)
      setShowAiFeatures(false)
      setShowTrash(false)
      setShowQuickNote(false)
      setShowStarred(false)
      setShowFocusMode(false)
      setShowToc(false)
      setShowExport(false)
      setShowHistory(false)
      setShowBacklinks(false)
      setShowStats(false)
      setShowSmartFolders(false)
      setShowBatch(false)
      if (splitView) setSplitView(false)
    },
  })

  const addProject = useCallback(() => {
    const newProject: Project = {
      id: uuidv4(),
      name: 'New Project',
      description: '',
      color: '#3b82f6',
      emoji: '📁',
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
    }
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
      lastUpdated: new Date().toISOString(),
    }))
    setSelectedProjectId(newProject.id)
    setSelectedNoteId(null)
  }, [])

  const addNote = useCallback((type: NoteType = 'note', template?: NoteTemplate) => {
    if (!selectedProjectId) return
    const newNote: Note = {
      id: uuidv4(),
      title: template?.title || 'New Note',
      content: template?.content || '',
      type: template?.type || type,
      status: 'active',
      tags: template?.tags || [],
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: selectedProjectId,
    }
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === selectedProjectId
          ? { ...p, notes: [...p.notes, newNote], updatedAt: new Date().toISOString() }
          : p
      ),
      lastUpdated: new Date().toISOString(),
    }))
    setSelectedNoteId(newNote.id)
    setShowTemplates(false)
  }, [selectedProjectId])

  const updateNote = useCallback((noteId: string, updates: Partial<Note>) => {
    if (!selectedProjectId) return
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === selectedProjectId
          ? {
              ...p,
              notes: p.notes.map(n =>
                n.id === noteId
                  ? { ...n, ...updates, updatedAt: new Date().toISOString() }
                  : n
              ),
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
      lastUpdated: new Date().toISOString(),
    }))
  }, [selectedProjectId])

  const deleteNote = useCallback((noteId: string) => {
    if (!selectedProjectId) return
    const note = selectedProject?.notes.find(n => n.id === noteId)
    if (note) {
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p =>
          p.id === selectedProjectId
            ? { ...p, notes: p.notes.filter(n => n.id !== noteId), updatedAt: new Date().toISOString() }
            : p
        ),
        trash: [...prev.trash, { id: noteId, type: 'note', data: note, deletedAt: new Date().toISOString(), originalProjectId: selectedProjectId }],
        lastUpdated: new Date().toISOString(),
      }))
    }
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null)
    }
  }, [selectedProjectId, selectedProject, selectedNoteId])

  const _archiveNote = useCallback((noteId: string) => {
    if (!selectedProjectId) return
    updateNote(noteId, { status: 'archived' })
  }, [selectedProjectId, updateNote])
  void _archiveNote

  const restoreFromTrash = useCallback((itemId: string) => {
    const item = data.trash.find(t => t.id === itemId)
    if (!item) return
    
    if (item.type === 'note' && item.originalProjectId) {
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p =>
          p.id === item.originalProjectId
            ? { ...p, notes: [...p.notes, item.data as Note], updatedAt: new Date().toISOString() }
            : p
        ),
        trash: prev.trash.filter(t => t.id !== itemId),
        lastUpdated: new Date().toISOString(),
      }))
    } else if (item.type === 'project') {
      setData(prev => ({
        ...prev,
        projects: [...prev.projects, item.data as Project],
        trash: prev.trash.filter(t => t.id !== itemId),
        lastUpdated: new Date().toISOString(),
      }))
    }
  }, [data.trash])

  const deleteProject = useCallback((projectId: string) => {
    const project = data.projects.find(p => p.id === projectId)
    if (project) {
      setData(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== projectId),
        trash: [...prev.trash, { id: projectId, type: 'project', data: project, deletedAt: new Date().toISOString() }],
        lastUpdated: new Date().toISOString(),
      }))
    }
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null)
      setSelectedNoteId(null)
    }
  }, [data.projects, selectedProjectId])

  const updateDailyNote = useCallback((dailyNoteId: string, content: string) => {
    setData(prev => ({
      ...prev,
      dailyNotes: prev.dailyNotes.map(dn =>
        dn.id === dailyNoteId
          ? { ...dn, content, updatedAt: new Date().toISOString() }
          : dn
      ),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const addReminder = useCallback((noteId: string, reminder: { dueDate: string; message: string; completed: boolean }) => {
    const newReminder = { id: uuidv4(), noteId, ...reminder }
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === selectedProjectId
          ? {
              ...p,
              notes: p.notes.map(n =>
                n.id === noteId
                  ? { ...n, reminders: [...(n.reminders || []), newReminder as any] }
                  : n
              ),
            }
          : p
      ),
      lastUpdated: new Date().toISOString(),
    }))
  }, [selectedProjectId])

  const emptyTrash = useCallback(() => {
    setData(prev => ({
      ...prev,
      trash: [],
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const permanentDelete = useCallback((itemId: string) => {
    setData(prev => ({
      ...prev,
      trash: prev.trash.filter(t => t.id !== itemId),
      lastUpdated: new Date().toISOString(),
    }))
  }, [])

  const handleSearchSelect = useCallback((noteId: string, projectId: string) => {
    setSelectedProjectId(projectId)
    setSelectedNoteId(noteId)
    setShowSearch(false)
  }, [])

  const handleTemplateSelect = useCallback((template: NoteTemplate) => {
    addNote(template.type, template)
  }, [addNote])

  const handleTagSelect = useCallback((_tag: string) => {
    setShowTagsCloud(false)
  }, [])

  const allNotes = data.projects.flatMap(p => p.notes)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        projects={data.projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onAddProject={addProject}
        onDeleteProject={deleteProject}
        onShowArchive={() => setShowArchive(true)}
        onShowTrash={() => setShowTrash(true)}
        onShowDailyNotes={() => setShowDailyNotes(true)}
        onShowTags={() => setShowTagsCloud(true)}
        onShowReminders={() => setShowReminders(true)}
        onShowAi={() => setShowAiFeatures(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="drag-region flex items-center justify-between px-8 pt-10 pb-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm shadow-black/5">
          <div className="flex items-center gap-4 no-drag">
            {selectedProject && (
              <div className="w-3 h-3 rounded-full ring-4 ring-offset-2 dark:ring-offset-gray-900" style={{ backgroundColor: selectedProject.color, boxShadow: `0 0 0 4px ${selectedProject.color}30` }} />
            )}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedProject?.name || 'Select a Project'}
            </h1>
            {selectedProject && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addNote('note')}
                  className="btn-primary text-sm shadow-lg shadow-primary-500/20"
                >
                  <Plus size={14} />
                  New Note
                </button>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="btn-secondary text-sm"
                  title="Templates (Cmd+T)"
                >
                  <Command size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 no-drag">
            {selectedProject && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'kanban' : 'grid')}
                  className="btn-ghost"
                  title={viewMode === 'grid' ? 'Kanban View' : 'Grid View'}
                >
                  {viewMode === 'grid' ? <LayoutGrid size={18} /> : <Columns size={18} />}
                </button>
                <button
                  onClick={() => setSplitView(!splitView)}
                  className={`btn-ghost ${splitView ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : ''}`}
                  title="Split View (Cmd+Shift+V)"
                >
                  <Columns size={18} />
                </button>
                <button
                  onClick={() => setShowGlobalAiExport(true)}
                  className="btn-ghost"
                  title="AI Export (Cmd+Shift+E)"
                >
                  <Sparkles size={18} />
                </button>
              </div>
            )}
            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
            <button
              onClick={() => setShowQuickNote(true)}
              className="btn-ghost"
              title="Quick Note (Cmd+Shift+N)"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => setShowStarred(true)}
              className="btn-ghost"
              title="Starred Notes (Cmd+Shift+L)"
            >
              <Star size={18} />
            </button>
            <button
              onClick={() => setShowStats(true)}
              className="btn-ghost"
              title="Statistics (Cmd+Shift+S)"
            >
              <BarChart3 size={18} />
            </button>
            <button
              onClick={() => setShowSmartFolders(true)}
              className="btn-ghost"
              title="Smart Folders (Cmd+Shift+M)"
            >
              <FolderOpen size={18} />
            </button>
            <button
              onClick={() => setShowSearch(true)}
              className="btn-ghost"
              title="Search (Cmd+K)"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105 shadow-sm"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-gray-600" />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {selectedProject && !selectedNote && !splitView && (
            <>
              {viewMode === 'grid' && (
                <ProjectView
                  project={selectedProject}
                  onSelectNote={setSelectedNoteId}
                  onAddNote={addNote}
                  onDeleteNote={deleteNote}
                />
              )}
              {viewMode === 'kanban' && (
                <KanbanBoard
                  project={selectedProject}
                  onUpdateNote={updateNote}
                  onSelectNote={setSelectedNoteId}
                />
              )}
            </>
          )}
          {selectedNote && selectedProject && !splitView && (
            <NoteEditor
              note={selectedNote}
              project={selectedProject}
              onUpdate={updateNote}
              onClose={() => setSelectedNoteId(null)}
              onDelete={deleteNote}
              onShowFocus={() => setShowFocusMode(true)}
              onShowToc={() => setShowToc(true)}
              onShowExport={() => setShowExport(true)}
              onShowHistory={() => setShowHistory(true)}
              onShowBacklinks={() => setShowBacklinks(true)}
              onDuplicate={(note) => {
                if (selectedProjectId) {
                  const dup = { ...note, id: crypto.randomUUID(), title: note.title + ' (Copy)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
                  setData(prev => ({
                    ...prev,
                    projects: prev.projects.map(p =>
                      p.id === selectedProjectId
                        ? { ...p, notes: [...p.notes, dup] }
                        : p
                    ),
                  }))
                  setSelectedNoteId(dup.id)
                }
              }}
              onToggleStar={() => {
                updateNote(selectedNote.id, { starred: !selectedNote.starred })
              }}
            />
          )}
          {selectedProject && splitView && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 dark:text-gray-600">Split View - Select two notes to compare</p>
                <button onClick={() => setSplitView(false)} className="btn-secondary mt-4">
                  Close Split View
                </button>
              </div>
            </div>
          )}
          {!selectedProject && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <span className="text-4xl">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-400 dark:text-gray-600 mb-3">No project selected</h2>
                <p className="text-sm text-gray-400 dark:text-gray-600 mb-6 max-w-sm mx-auto">
                  Create a new project to start organizing your notes and ideas
                </p>
                <button onClick={addProject} className="btn-primary shadow-lg shadow-primary-500/20">
                  <Plus size={16} />
                  Create Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SearchPalette
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectNote={handleSearchSelect}
        data={data}
      />
      
      <NoteTemplates
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleTemplateSelect}
      />
      
      {selectedProject && (
        <GlobalAiExport
          isOpen={showGlobalAiExport}
          onClose={() => setShowGlobalAiExport(false)}
          project={selectedProject}
          onExport={(prompt) => {
            exportAiPrompt(prompt)
            setShowGlobalAiExport(false)
          }}
        />
      )}
      
      <TagsCloud
        data={data}
        isOpen={showTagsCloud}
        onClose={() => setShowTagsCloud(false)}
        onSelectTag={handleTagSelect}
      />
      
      <DailyNotes
        data={data}
        onUpdateDailyNote={updateDailyNote}
        isOpen={showDailyNotes}
        onClose={() => setShowDailyNotes(false)}
      />
      
      {selectedNote && (
        <AttachmentsPanel
          note={selectedNote}
          isOpen={showAttachments}
          onClose={() => setShowAttachments(false)}
          onAddAttachment={(_noteId, file) => {
            if (selectedNote) {
              const newAttachment: import('./types').Attachment = {
                id: crypto.randomUUID(),
                name: file.name,
                type: file.type,
                path: '',
                size: file.size,
                createdAt: new Date().toISOString()
              }
              updateNote(selectedNote.id, { attachments: [...(selectedNote.attachments || []), newAttachment] })
            }
          }}
          onDeleteAttachment={(_noteId, attachmentId) => {
            if (selectedNote) {
              updateNote(selectedNote.id, { attachments: (selectedNote.attachments || []).filter(a => a.id !== attachmentId) })
            }
          }}
        />
      )}
      
      <ArchiveView
        data={data}
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        onRestore={restoreFromTrash}
        onDelete={permanentDelete}
      />
      
      <RemindersPanel
        data={data}
        isOpen={showReminders}
        onClose={() => setShowReminders(false)}
        onAddReminder={addReminder}
        onCompleteReminder={(reminderId) => {
          if (selectedNote) {
            updateNote(selectedNote.id, {
              reminders: (selectedNote.reminders || []).map(r =>
                r.id === reminderId ? { ...r, completed: true } : r
              )
            })
          }
        }}
        onDeleteReminder={(reminderId) => {
          if (selectedNote) {
            updateNote(selectedNote.id, {
              reminders: (selectedNote.reminders || []).filter(r => r.id !== reminderId)
            })
          }
        }}
      />
      
      {selectedNote && (
        <AiFeatures
          note={selectedNote}
          allNotes={allNotes}
          isOpen={showAiFeatures}
          onClose={() => setShowAiFeatures(false)}
          onAddTags={(tags) => updateNote(selectedNote.id, { tags: [...new Set([...selectedNote.tags, ...tags])] })}
          onUpdateSummary={(summary) => updateNote(selectedNote.id, { summary })}
        />
      )}
      
      <TrashView
        trash={data.trash}
        isOpen={showTrash}
        onClose={() => setShowTrash(false)}
        onRestore={restoreFromTrash}
        onEmptyTrash={emptyTrash}
        onDeletePermanent={permanentDelete}
      />

      <QuickNote
        isOpen={showQuickNote}
        onClose={() => setShowQuickNote(false)}
        onSave={(note) => {
          if (selectedProjectId) {
            const newNote = { ...note, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            setData(prev => ({
              ...prev,
              projects: prev.projects.map(p =>
                p.id === selectedProjectId
                  ? { ...p, notes: [...p.notes, newNote] }
                  : p
              ),
            }))
          }
          setShowQuickNote(false)
        }}
        projects={data.projects}
      />

      <StarredNotes
        data={data}
        isOpen={showStarred}
        onClose={() => setShowStarred(false)}
        onSelectNote={(noteId, projectId) => {
          setSelectedProjectId(projectId)
          setSelectedNoteId(noteId)
          setShowStarred(false)
        }}
      />

      {selectedNote && (
        <FocusMode
          note={selectedNote}
          isOpen={showFocusMode}
          onClose={() => setShowFocusMode(false)}
          onUpdate={(content) => updateNote(selectedNote.id, { content })}
          wordCountGoal={data.settings.wordCountGoal || 500}
        />
      )}

      {selectedNote && (
        <TableOfContents
          content={selectedNote.content}
          isOpen={showToc}
          onClose={() => setShowToc(false)}
          onNavigate={() => {}}
        />
      )}

      {selectedNote && (
        <ExportPanel
          note={selectedNote}
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          onExport={(format, content) => {
            const blob = new Blob([content], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${selectedNote.title}.${format}`
            a.click()
            URL.revokeObjectURL(url)
          }}
        />
      )}

      {selectedNote && (
        <NoteHistory
          note={selectedNote}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onRestore={(version) => {
            updateNote(selectedNote.id, { content: version.content, title: version.title })
          }}
        />
      )}

      {selectedNote && (
        <BacklinksPanel
          note={selectedNote}
          allNotes={allNotes}
          isOpen={showBacklinks}
          onClose={() => setShowBacklinks(false)}
          onNavigate={(noteId, projectId) => {
            setSelectedProjectId(projectId)
            setSelectedNoteId(noteId)
            setShowBacklinks(false)
          }}
        />
      )}

      <StatisticsDashboard
        data={data}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />

      <SmartFolders
        data={data}
        isOpen={showSmartFolders}
        onClose={() => setShowSmartFolders(false)}
        onSelectNote={(noteId, projectId) => {
          setSelectedProjectId(projectId)
          setSelectedNoteId(noteId)
          setShowSmartFolders(false)
        }}
      />

      {selectedProject && (
        <BatchOperations
          notes={selectedProject.notes}
          isOpen={showBatch}
          onClose={() => setShowBatch(false)}
          onBatchAction={(action, noteIds) => {
            noteIds.forEach(id => {
              if (action === 'delete') deleteNote(id)
              else if (action === 'archive') updateNote(id, { status: 'archived' })
              else if (action === 'pin') updateNote(id, { pinned: true })
            })
          }}
        />
      )}
    </div>
  )
}
