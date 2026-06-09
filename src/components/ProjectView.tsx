import { useState } from 'react'
import { Project, NoteType } from '../types'
import { FileText, CheckSquare, Lightbulb, Plus, Trash2, Calendar, Tag, Search, SlidersHorizontal, Inbox } from 'lucide-react'

interface ProjectViewProps {
  project: Project
  onSelectNote: (id: string) => void
  onAddNote: (type: NoteType) => void
  onDeleteNote: (id: string) => void
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

const statusColors = {
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20',
  archived: 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border border-gray-100 dark:border-gray-500/20',
  completed: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 border border-primary-100 dark:border-primary-500/20',
}

export default function ProjectView({
  project,
  onSelectNote,
  onAddNote,
  onDeleteNote,
}: ProjectViewProps) {
  const [filter, setFilter] = useState<NoteType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotes = project.notes.filter(note => {
    const matchesFilter = filter === 'all' || note.type === filter
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Project Header */}
      <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-4 h-4 rounded-full ring-4 ring-offset-2 dark:ring-offset-gray-950"
            style={{ backgroundColor: project.color, boxShadow: `0 0 0 4px ${project.color}30` }}
          />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {project.name}
          </h2>
        </div>
        {project.description && (
          <p className="text-gray-500 dark:text-gray-400 text-sm ml-7">{project.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3 ml-7 text-xs text-gray-400 dark:text-gray-500 font-medium">
          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            <Calendar size={12} />
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {project.notes.length} notes
          </span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <button onClick={() => onAddNote('note')} className="btn-secondary text-sm shadow-sm">
            <Plus size={14} />
            Note
          </button>
          <button onClick={() => onAddNote('task')} className="btn-secondary text-sm shadow-sm">
            <Plus size={14} />
            Task
          </button>
          <button onClick={() => onAddNote('idea')} className="btn-secondary text-sm shadow-sm">
            <Plus size={14} />
            Idea
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-56 shadow-sm"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as NoteType | 'all')}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm appearance-none"
            >
              <option value="all">All Types</option>
              <option value="note">Notes</option>
              <option value="task">Tasks</option>
              <option value="idea">Ideas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map(note => {
          const Icon = typeIcons[note.type]
          return (
            <div
              key={note.id}
              className="note-card p-5 group relative"
              onClick={() => onSelectNote(note.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`type-badge ${typeColors[note.type]}`}>
                    <Icon size={12} />
                    {note.type}
                  </span>
                  <span className={`status-badge ${statusColors[note.status]}`}>
                    {note.status}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('Delete this note?')) {
                      onDeleteNote(note.id)
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg leading-tight truncate">
                {note.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                {note.content || 'No content'}
              </p>

              {note.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  <Tag size={12} className="text-gray-400" />
                  {note.tags.map(tag => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-400 dark:text-gray-600 font-medium flex items-center gap-1.5">
                <Calendar size={10} />
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </div>
          )
        })}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Inbox size={32} className="text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-xl font-semibold text-gray-400 dark:text-gray-600 mb-2">
            No notes found
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600 max-w-sm mx-auto mb-6">
            {searchQuery ? 'Try adjusting your search or filters' : 'Create your first note to get started with this project'}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => onAddNote('note')} className="btn-secondary text-sm">
              <Plus size={14} />
              Note
            </button>
            <button onClick={() => onAddNote('task')} className="btn-secondary text-sm">
              <Plus size={14} />
              Task
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
