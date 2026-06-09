import { useState, useMemo } from 'react'
import { AppData, Note } from '../types'
import { X, Clock, CheckCircle2, Star, FileText, Tag, FolderOpen, ArrowRight } from 'lucide-react'

interface NoteWithProject extends Note {
  projectName: string
  projectColor: string
}

interface SmartFoldersProps {
  data: AppData
  isOpen: boolean
  onClose: () => void
  onSelectNote: (note: Note) => void
}

interface SmartFolder {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  count: number
  notes: NoteWithProject[]
}

export default function SmartFolders({ data, isOpen, onClose, onSelectNote }: SmartFoldersProps) {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)

  const folders = useMemo(() => {
    const allNotes = data.projects.flatMap(p =>
      p.notes.map(n => ({ ...n, projectName: p.name, projectColor: p.color }))
    )
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recent = allNotes.filter(n => new Date(n.createdAt) >= sevenDaysAgo)
    const tasksDue = allNotes.filter(n => n.type === 'task' && n.status === 'active')
    const starred = allNotes.filter(n => n.starred)
    const longNotes = allNotes.filter(n => (n.wordCount ?? n.content.split(/\s+/).filter(Boolean).length) > 500)
    const untagged = allNotes.filter(n => n.tags.length === 0)

    return [
      {
        id: 'recent',
        label: 'Recent Notes',
        icon: <Clock size={16} />,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-500/10',
        borderColor: 'border-blue-200 dark:border-blue-500/20',
        count: recent.length,
        notes: recent,
      },
      {
        id: 'tasks',
        label: 'Tasks Due',
        icon: <CheckCircle2 size={16} />,
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-500/10',
        borderColor: 'border-amber-200 dark:border-amber-500/20',
        count: tasksDue.length,
        notes: tasksDue,
      },
      {
        id: 'starred',
        label: 'Starred Notes',
        icon: <Star size={16} />,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-500/10',
        borderColor: 'border-yellow-200 dark:border-yellow-500/20',
        count: starred.length,
        notes: starred,
      },
      {
        id: 'long',
        label: 'Long Notes',
        icon: <FileText size={16} />,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
        borderColor: 'border-emerald-200 dark:border-emerald-500/20',
        count: longNotes.length,
        notes: longNotes,
      },
      {
        id: 'untagged',
        label: 'Untagged Notes',
        icon: <Tag size={16} />,
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-500/10',
        borderColor: 'border-rose-200 dark:border-rose-500/20',
        count: untagged.length,
        notes: untagged,
      },
    ] as SmartFolder[]
  }, [data])

  const activeFolder = folders.find(f => f.id === activeFolderId) ?? null

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <FolderOpen size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Smart Folders
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Filtered views of your notes
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!activeFolder ? (
            <div className="space-y-3">
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolderId(folder.id)}
                  className={`w-full text-left ${folder.bgColor} border ${folder.borderColor} rounded-xl p-4 hover:shadow-md transition-all duration-200 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={folder.color}>{folder.icon}</div>
                      <div>
                        <p className={`text-sm font-semibold ${folder.color}`}>{folder.label}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                          {folder.count} note{folder.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${folder.color}`}>{folder.count}</span>
                      <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setActiveFolderId(null)}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
              >
                <ArrowRight size={14} className="rotate-180" />
                Back to folders
              </button>
              <div className="flex items-center gap-2 mb-4">
                <div className={activeFolder.color}>{activeFolder.icon}</div>
                <h4 className={`text-base font-semibold ${activeFolder.color}`}>{activeFolder.label}</h4>
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {activeFolder.notes.length} note{activeFolder.notes.length !== 1 ? 's' : ''}
                </span>
              </div>
              {activeFolder.notes.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 rounded-2xl ${activeFolder.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <div className={activeFolder.color}>{activeFolder.icon}</div>
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                    No notes in this folder
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeFolder.notes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => {
                        onSelectNote(note)
                        onClose()
                      }}
                      className="w-full text-left bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 hover:shadow-md hover:shadow-primary-500/5 hover:border-primary-200 dark:hover:border-primary-500/20 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                              {note.title}
                            </span>
                            <span className={`type-badge ${
                              note.type === 'task'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                : note.type === 'idea'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                : 'bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400'
                            }`}>
                              {note.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: note.projectColor }} />
                            <span className="text-xs text-gray-400 dark:text-gray-600">{note.projectName}</span>
                            {note.tags.length > 0 && (
                              <div className="flex items-center gap-1">
                                {note.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="tag-pill text-[10px]">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}