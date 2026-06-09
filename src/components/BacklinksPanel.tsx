import { useMemo } from 'react'
import { Note, Project } from '../types'
import { findBacklinks } from './NoteLinking'
import { X, ArrowRight, Link2, Folder } from 'lucide-react'

interface BacklinksPanelProps {
  note: Note
  allNotes: Note[]
  allProjects: Project[]
  isOpen: boolean
  onClose: () => void
  onNavigate: (noteId: string) => void
}

export default function BacklinksPanel({
  note,
  allNotes,
  allProjects,
  isOpen,
  onClose,
  onNavigate,
}: BacklinksPanelProps) {
  const backlinks = useMemo(() => {
    const linkingNotes = findBacklinks(note.title, allNotes)
    return linkingNotes.map(n => {
      const project = allProjects.find(p => p.id === n.projectId || p.notes.some(pn => pn.id === n.id))
      return { note: n, projectName: project?.name ?? 'Unknown', projectColor: project?.color ?? '#6b7280' }
    })
  }, [note.title, allNotes, allProjects])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[70vh] flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Link2 size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Backlinks
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Notes that link to <span className="text-primary-500 font-medium">"{note.title}"</span>
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
          {backlinks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mx-auto mb-4">
                <Link2 size={24} className="text-blue-500 dark:text-blue-400" />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                No backlinks yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                Add <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-primary-500 font-mono">[[{note.title}]]</code> to other notes to create links
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {backlinks.map(({ note: linkedNote, projectName, projectColor }) => (
                <button
                  key={linkedNote.id}
                  onClick={() => {
                    onNavigate(linkedNote.id)
                    onClose()
                  }}
                  className="w-full text-left bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 hover:shadow-md hover:shadow-primary-500/5 hover:border-primary-200 dark:hover:border-primary-500/20 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {linkedNote.title}
                        </span>
                        <span className={`type-badge ${
                          linkedNote.type === 'task'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                            : linkedNote.type === 'idea'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                            : 'bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400'
                        }`}>
                          {linkedNote.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Folder size={10} className="text-gray-400" />
                        <span className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: projectColor }} />
                          {projectName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">
                        {linkedNote.content.substring(0, 120)}{linkedNote.content.length > 120 ? '...' : ''}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition-colors mt-1 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {backlinks.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
              {backlinks.length} note{backlinks.length !== 1 ? 's' : ''} link to this note
            </p>
          </div>
        )}
      </div>
    </div>
  )
}