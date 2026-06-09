import { useState, useRef } from 'react'
import { Project, Note, NoteStatus } from '../types'
import { FileText, CheckSquare, Lightbulb, GripVertical, Tag, Calendar, Plus } from 'lucide-react'

interface KanbanBoardProps {
  project: Project
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void
  onSelectNote: (noteId: string) => void
}

const typeIcons = {
  note: FileText,
  task: CheckSquare,
  idea: Lightbulb,
}

const typeColors = {
  note: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20',
  task: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20',
  idea: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20',
}

type KanbanColumn = {
  id: NoteStatus
  title: string
  emoji: string
  headerBg: string
  headerText: string
  dotColor: string
}

const columns: KanbanColumn[] = [
  {
    id: 'active',
    title: 'Todo',
    emoji: '📋',
    headerBg: 'bg-blue-50 dark:bg-blue-500/10',
    headerText: 'text-blue-700 dark:text-blue-400',
    dotColor: 'bg-blue-500',
  },
  {
    id: 'archived',
    title: 'Doing',
    emoji: '🔨',
    headerBg: 'bg-amber-50 dark:bg-amber-500/10',
    headerText: 'text-amber-700 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  {
    id: 'completed',
    title: 'Done',
    emoji: '✅',
    headerBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    headerText: 'text-emerald-700 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
]

export default function KanbanBoard({ project, onUpdateNote, onSelectNote }: KanbanBoardProps) {
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const dragCounterRef = useRef<Record<string, number>>({})

  const getNotesForColumn = (status: NoteStatus) => {
    return project.notes.filter((note) => note.status === status)
  }

  const handleDragStart = (noteId: string) => {
    setDraggedNoteId(noteId)
  }

  const handleDragEnd = () => {
    setDraggedNoteId(null)
    setDragOverColumn(null)
    dragCounterRef.current = {}
  }

  const handleDragEnter = (columnId: string) => {
    if (!dragCounterRef.current[columnId]) {
      dragCounterRef.current[columnId] = 0
    }
    dragCounterRef.current[columnId]++
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (columnId: string) => {
    if (!dragCounterRef.current[columnId]) {
      dragCounterRef.current[columnId] = 0
    }
    dragCounterRef.current[columnId]--
    if (dragCounterRef.current[columnId] <= 0) {
      dragCounterRef.current[columnId] = 0
      if (dragOverColumn === columnId) {
        setDragOverColumn(null)
      }
    }
  }

  const handleDrop = (columnId: string) => {
    if (draggedNoteId) {
      onUpdateNote(draggedNoteId, { status: columnId as NoteStatus })
    }
    setDraggedNoteId(null)
    setDragOverColumn(null)
    dragCounterRef.current = {}
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Board Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full ring-4 ring-offset-2 dark:ring-offset-gray-950"
            style={{ backgroundColor: project.color, boxShadow: `0 0 0 4px ${project.color}30` }}
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {project.name}
          </h2>
          <span className="text-sm text-gray-400 dark:text-gray-600 font-medium">
            Kanban Board
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600 font-medium">
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {project.notes.length} total
          </span>
        </div>
      </div>

      {/* Columns */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-5 h-full min-h-0">
          {columns.map((column) => {
            const notes = getNotesForColumn(column.id)
            const isDragOver = dragOverColumn === column.id

            return (
              <div
                key={column.id}
                className={`flex-1 min-w-[280px] max-w-[400px] flex flex-col rounded-2xl border-2 transition-all duration-200 ${
                  isDragOver
                    ? 'border-primary-400 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                    : 'border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30'
                }`}
                onDragEnter={(e) => {
                  e.preventDefault()
                  handleDragEnter(column.id)
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => {
                  e.preventDefault()
                  handleDragLeave(column.id)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  handleDrop(column.id)
                }}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${column.headerBg}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{column.emoji}</span>
                    <h3 className={`font-semibold ${column.headerText}`}>
                      {column.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${column.headerBg} ${column.headerText}`}>
                      {notes.length}
                    </span>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {notes.map((note) => {
                    const Icon = typeIcons[note.type]
                    const isDragging = draggedNoteId === note.id

                    return (
                      <div
                        key={note.id}
                        draggable
                        onDragStart={() => handleDragStart(note.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectNote(note.id)}
                        className={`note-card p-4 cursor-grab active:cursor-grabbing group ${
                          isDragging ? 'opacity-50 scale-95' : ''
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <GripVertical size={14} className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className={`type-badge ${typeColors[note.type]}`}>
                              <Icon size={12} />
                              {note.type}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 leading-snug line-clamp-2">
                          {note.title}
                        </h4>

                        {/* Content Preview */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                          {note.content.substring(0, 120).replace(/[#*`\n]/g, ' ').trim() || 'No content'}
                        </p>

                        {/* Tags */}
                        {note.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap mb-3">
                            <Tag size={10} className="text-gray-400 shrink-0" />
                            {note.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="tag-pill text-[10px]">
                                {tag}
                              </span>
                            ))}
                            {note.tags.length > 3 && (
                              <span className="text-[10px] text-gray-400 dark:text-gray-600">
                                +{note.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-600 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                          {note.pinned && (
                            <span className="text-primary-500">📌 Pinned</span>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Empty State */}
                  {notes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <Plus size={20} className="text-gray-400 dark:text-gray-600" />
                      </div>
                      <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                        No items
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                        Drag notes here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}