import { TrashItem } from '../types'
import { Trash2, RotateCcw, X, Folder, FileText, AlertTriangle, Clock } from 'lucide-react'

interface TrashViewProps {
  trash: TrashItem[]
  isOpen: boolean
  onClose: () => void
  onRestore: (id: string) => void
  onEmptyTrash: () => void
  onDeletePermanent: (id: string) => void
}

export default function TrashView({
  trash,
  isOpen,
  onClose,
  onRestore,
  onEmptyTrash,
  onDeletePermanent,
}: TrashViewProps) {
  const getDaysRemaining = (deletedAt: string): number => {
    const deleted = new Date(deletedAt)
    const now = new Date()
    const diffMs = deleted.getTime() + 30 * 24 * 60 * 60 * 1000 - now.getTime()
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  }

  const getDaysColor = (days: number): string => {
    if (days <= 3) return 'text-red-600 dark:text-red-400'
    if (days <= 7) return 'text-amber-600 dark:text-amber-400'
    return 'text-gray-500 dark:text-gray-400'
  }

  const getDaysBg = (days: number): string => {
    if (days <= 3) return 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20'
    if (days <= 7) return 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20'
    return 'bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700/50'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/25">
              <Trash2 size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Trash
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                {trash.length} item{trash.length !== 1 ? 's' : ''} · Items are permanently deleted after 30 days
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {trash.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Permanently delete all items in trash? This cannot be undone.')) {
                    onEmptyTrash()
                  }
                }}
                className="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Empty Trash
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {trash.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Trash2 size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-xl font-semibold text-gray-400 dark:text-gray-600 mb-2">
                Trash is empty
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-600 max-w-sm mx-auto">
                Deleted notes and projects will appear here for 30 days before permanent removal
              </p>
            </div>
          ) : (
            trash.map(item => {
              const daysRemaining = getDaysRemaining(item.deletedAt)
              const isNote = item.type === 'note'
              const itemData = item.data as any
              const projectName = item.originalProjectId
                ? 'Unknown project'
                : ''

              return (
                <div
                  key={item.id}
                  className={`rounded-xl p-4 border flex items-start gap-4 group hover:shadow-md hover:shadow-primary-500/5 transition-all ${getDaysBg(daysRemaining)}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isNote
                      ? 'bg-blue-50 dark:bg-blue-500/10'
                      : 'bg-purple-50 dark:bg-purple-500/10'
                  }`}>
                    {isNote ? (
                      <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Folder size={18} className="text-purple-600 dark:text-purple-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {itemData.name || itemData.title}
                      </h4>
                      <span className={`type-badge ${
                        isNote
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
                          : 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20'
                      }`}>
                        {item.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Clock size={10} />
                        Deleted {new Date(item.deletedAt).toLocaleDateString()}
                      </span>
                      {projectName && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          from {projectName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {daysRemaining <= 3 && (
                        <AlertTriangle size={12} className="text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${getDaysColor(daysRemaining)}`}>
                        {daysRemaining === 0
                          ? 'Deleting today'
                          : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                    <button
                      onClick={() => onRestore(item.id)}
                      className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                      title="Restore"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Permanently delete this item? This cannot be undone.')) {
                          onDeletePermanent(item.id)
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
        </div>

        {/* Footer */}
        {trash.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-gray-600">
                {trash.length} item{trash.length !== 1 ? 's' : ''} in trash
              </p>
              <button
                onClick={() => {
                  if (confirm('Permanently delete all items in trash? This cannot be undone.')) {
                    onEmptyTrash()
                  }
                }}
                className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
              >
                <Trash2 size={10} />
                Empty Trash
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}