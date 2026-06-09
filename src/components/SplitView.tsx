import { useState, useCallback } from 'react'
import { Project, Note } from '../types'
import { X, FileText, CheckSquare, Lightbulb, Pin, GripVertical } from 'lucide-react'

interface SplitViewProps {
  project: Project
  selectedNoteIds: [string, string]
  onUpdateNote: (id: string, updates: Partial<Note>) => void
  onCloseSplit: () => void
}

const typeIcons = {
  note: FileText,
  task: CheckSquare,
  idea: Lightbulb,
}

const typeColors = {
  note: 'text-blue-500',
  task: 'text-emerald-500',
  idea: 'text-amber-500',
}

export default function SplitView({
  project,
  selectedNoteIds,
  onUpdateNote,
  onCloseSplit,
}: SplitViewProps) {
  const [activePane, setActivePane] = useState<'left' | 'right'>('left')
  const [editContent, setEditContent] = useState<Record<string, string>>({})

  const note1 = project.notes.find(n => n.id === selectedNoteIds[0])
  const note2 = project.notes.find(n => n.id === selectedNoteIds[1])

  const handleContentChange = useCallback(
    (noteId: string, content: string) => {
      setEditContent(prev => ({ ...prev, [noteId]: content }))
    },
    []
  )

  const handleBlur = useCallback(
    (noteId: string) => {
      const content = editContent[noteId]
      if (content !== undefined) {
        onUpdateNote(noteId, { content })
      }
    },
    [editContent, onUpdateNote]
  )

  const renderPane = (note: Note | undefined, side: 'left' | 'right') => {
    if (!note) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
              Select a note from the list
            </p>
          </div>
        </div>
      )
    }

    const Icon = typeIcons[note.type]
    const colorClass = typeColors[note.type]

    return (
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          activePane === side
            ? 'ring-2 ring-primary-500/30 dark:ring-primary-400/20'
            : ''
        }`}
        onClick={() => setActivePane(side)}
      >
        {/* Pane Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/60">
          <Icon size={16} className={colorClass} />
          <input
            className="flex-1 bg-transparent text-sm font-semibold text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-400"
            value={note.title}
            onChange={e => onUpdateNote(note.id, { title: e.target.value })}
            placeholder="Note title..."
          />
          {note.pinned && <Pin size={14} className="text-primary-500 fill-primary-500" />}
        </div>

        {/* Pane Editor */}
        <textarea
          className="flex-1 p-4 bg-white dark:bg-gray-800/40 text-sm text-gray-700 dark:text-gray-300 resize-none focus:outline-none leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-600"
          value={editContent[note.id] ?? note.content}
          onChange={e => handleContentChange(note.id, e.target.value)}
          onBlur={() => handleBlur(note.id)}
          placeholder="Start writing..."
        />

        {/* Pane Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="flex items-center gap-2">
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag-pill text-[10px]">
                {tag}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-gray-400 dark:text-gray-600">
            {note.content.length} chars
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Split View Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Split View
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {project.name}
          </span>
        </div>
        <button
          onClick={onCloseSplit}
          className="btn-ghost p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Note List Sidebar */}
        <div className="w-56 border-r border-gray-200 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 overflow-y-auto">
          <div className="p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 mb-3 px-2">
              Notes
            </p>
            <div className="space-y-1">
              {project.notes.map(note => {
                const Icon = typeIcons[note.type]
                const isSelected =
                  note.id === selectedNoteIds[0] || note.id === selectedNoteIds[1]
                return (
                  <button
                    key={note.id}
                    className={`w-full text-left sidebar-item text-sm ${
                      isSelected
                        ? 'active !text-xs !py-2.5'
                        : '!text-xs !py-2.5'
                    }`}
                    onClick={() => {
                      // This would need parent handler to swap notes
                    }}
                  >
                    <Icon size={12} className={typeColors[note.type]} />
                    <span className="truncate">{note.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Split Panes */}
        <div className="flex-1 flex">
          {renderPane(note1, 'left')}

          {/* Divider */}
          <div className="w-px bg-gray-200 dark:bg-gray-700/50 relative group">
            <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
              <div className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 dark:bg-gray-700 cursor-col-resize">
                <GripVertical size={12} className="text-gray-400" />
              </div>
            </div>
          </div>

          {renderPane(note2, 'right')}
        </div>
      </div>
    </div>
  )
}