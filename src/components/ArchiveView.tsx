import { useState } from 'react'
import { AppData } from '../types'
import { Archive, RotateCcw, Trash2, X, Folder, FileText, CheckSquare, Lightbulb } from 'lucide-react'

interface ArchiveViewProps {
  data: AppData
  isOpen: boolean
  onClose: () => void
  onRestore: (id: string, type: 'project' | 'note') => void
  onDelete: (id: string, type: 'project' | 'note') => void
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

export default function ArchiveView({
  data,
  isOpen,
  onClose,
  onRestore,
  onDelete,
}: ArchiveViewProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'notes'>('projects')

  const archivedProjects = data.projects.filter(p => p.archived)
  const archivedNotes = data.projects
    .flatMap(p => p.notes.filter(n => n.status === 'archived').map(n => ({ ...n, projectName: p.name, projectColor: p.color })))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg shadow-gray-500/25">
              <Archive size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Archive
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Restore or permanently delete archived items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 px-6 pt-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            <Folder size={14} />
            Projects
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === 'projects'
                ? 'bg-primary-100 dark:bg-primary-800/30 text-primary-600 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {archivedProjects.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            <FileText size={14} />
            Notes
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === 'notes'
                ? 'bg-primary-100 dark:bg-primary-800/30 text-primary-600 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {archivedNotes.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {activeTab === 'projects' && (
            <>
              {archivedProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-4">
                    <Folder size={24} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                    No archived projects
                  </p>
                </div>
              ) : (
                archivedProjects.map(project => (
                  <div
                    key={project.id}
                    className="note-card p-4 flex items-center gap-4 group"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-offset-2 dark:ring-offset-gray-800"
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {project.name}
                      </h4>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {project.notes.length} notes · Archived
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => onRestore(project.id, 'project')}
                        className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                        title="Restore project"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Permanently delete this project? This cannot be undone.')) {
                            onDelete(project.id, 'project')
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                        title="Permanently delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'notes' && (
            <>
              {archivedNotes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                    No archived notes
                  </p>
                </div>
              ) : (
                archivedNotes.map(note => {
                  const Icon = typeIcons[note.type]
                  return (
                    <div
                      key={note.id}
                      className="note-card p-4 flex items-center gap-4 group"
                    >
                      <span className={`type-badge ${typeColors[note.type]}`}>
                        <Icon size={12} />
                        {note.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                          {note.title}
                        </h4>
                        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: note.projectColor }} />
                          {note.projectName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => onRestore(note.id, 'note')}
                          className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                          title="Restore note"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Permanently delete this note? This cannot be undone.')) {
                              onDelete(note.id, 'note')
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                          title="Permanently delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}