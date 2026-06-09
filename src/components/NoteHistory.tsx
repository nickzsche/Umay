import { X, History, RotateCcw, Clock } from 'lucide-react'
import { Note, NoteVersion } from '../types'

interface NoteHistoryProps {
  note: Note
  isOpen: boolean
  onClose: () => void
  onRestore: (version: NoteVersion) => void
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function NoteHistory({
  note,
  isOpen,
  onClose,
  onRestore,
}: NoteHistoryProps) {
  if (!isOpen) return null

  const versions = note.history ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <History size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Version History
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600 truncate max-w-[260px]">
                {note.title}
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

        {/* Version List */}
        <div className="flex-1 overflow-y-auto">
          {versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <Clock size={24} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No version history
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                Previous versions will appear here as you edit
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {versions.map((version, index) => (
                <button
                  key={version.id}
                  onClick={() => onRestore(version)}
                  className="group w-full text-left p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {version.title}
                        </span>
                        {index === 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                        {formatFullDate(version.createdAt)}
                        <span className="ml-2 text-gray-300 dark:text-gray-600">
                          {formatTimestamp(version.createdAt)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {version.content.substring(0, 120)}
                        {version.content.length > 120 ? '...' : ''}
                      </p>
                    </div>
                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                        <RotateCcw size={14} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {versions.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
              Click a version to restore it
            </p>
          </div>
        )}
      </div>
    </div>
  )
}