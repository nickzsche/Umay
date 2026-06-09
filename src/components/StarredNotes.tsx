import { X, Star, FileText, CheckSquare, Lightbulb, Folder } from 'lucide-react'
import { Note } from '../types'

interface StarredNoteItem {
  note: Note
  projectName: string
  projectId: string
}

interface StarredNotesProps {
  data: StarredNoteItem[]
  isOpen: boolean
  onClose: () => void
  onSelectNote: (noteId: string, projectId: string) => void
}

const typeIcons = {
  note: FileText,
  task: CheckSquare,
  idea: Lightbulb,
}

const typeBadgeStyles = {
  note: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  task: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  idea: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
}

export default function StarredNotes({
  data,
  isOpen,
  onClose,
  onSelectNote,
}: StarredNotesProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[75vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Star size={16} className="text-white" fill="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Starred Notes
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                {data.length} starred note{data.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <Star size={24} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No starred notes yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                Star important notes to find them quickly
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {data.map(({ note, projectName, projectId }) => {
                const Icon = typeIcons[note.type]
                return (
                  <button
                    key={note.id}
                    onClick={() => {
                      onSelectNote(note.id, projectId)
                      onClose()
                    }}
                    className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/30 group"
                  >
                    <div className="mt-0.5 shrink-0">
                      <Icon
                        size={16}
                        className={
                          note.type === 'note'
                            ? 'text-blue-500'
                            : note.type === 'task'
                            ? 'text-emerald-500'
                            : 'text-amber-500'
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white truncate">
                          {note.title}
                        </span>
                        <span className={`type-badge text-[10px] px-1.5 py-0.5 ${typeBadgeStyles[note.type]}`}>
                          {note.type}
                        </span>
                      </div>
                      {note.content && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {note.content.substring(0, 80)}
                          {note.content.length > 80 ? '...' : ''}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Folder size={10} className="text-gray-400" />
                        <span className="text-xs text-gray-400 dark:text-gray-600">
                          {projectName}
                        </span>
                      </div>
                    </div>
                    <Star
                      size={14}
                      className="text-amber-400 shrink-0 mt-1"
                      fill="currentColor"
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {data.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
              Click a note to navigate to it
            </p>
          </div>
        )}
      </div>
    </div>
  )
}