import { useState, useMemo } from 'react'
import { Note } from '../types'
import { X, Archive, Trash2, Tag, Pin, CheckSquare, Square, MinusSquare, FileText, FolderOpen } from 'lucide-react'

interface BatchOperationsProps {
  notes: Note[]
  isOpen: boolean
  onClose: () => void
  onBatchAction: (action: string, noteIds: string[], extra?: string) => void
}

export default function BatchOperations({ notes, isOpen, onClose, onBatchAction }: BatchOperationsProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showTagInput, setShowTagInput] = useState(false)
  const [newTag, setNewTag] = useState('')

  const allSelected = selectedIds.size === notes.length && notes.length > 0
  const someSelected = selectedIds.size > 0 && !allSelected

  const selectedNotes = useMemo(
    () => notes.filter(n => selectedIds.has(n.id)),
    [notes, selectedIds]
  )

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(notes.map(n => n.id)))
    }
  }

  const handleAction = (action: string) => {
    if (selectedIds.size === 0) return
    if (action === 'addTag') {
      setShowTagInput(true)
      return
    }
    onBatchAction(action, Array.from(selectedIds))
    setSelectedIds(new Set())
    onClose()
  }

  const handleAddTag = () => {
    if (!newTag.trim() || selectedIds.size === 0) return
    onBatchAction('addTag', Array.from(selectedIds), newTag.trim())
    setNewTag('')
    setShowTagInput(false)
    setSelectedIds(new Set())
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <CheckSquare size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Batch Operations
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                {selectedIds.size > 0
                  ? `${selectedIds.size} note${selectedIds.size !== 1 ? 's' : ''} selected`
                  : 'Select notes to perform bulk actions'}
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

        {/* Select All Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={selectAll}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {allSelected ? <MinusSquare size={16} /> : someSelected ? <MinusSquare size={16} className="text-primary-500" /> : <Square size={16} />}
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {notes.length} notes available
          </span>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {notes.map(note => {
            const isSelected = selectedIds.has(note.id)
            return (
              <button
                key={note.id}
                onClick={() => toggleSelect(note.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <div className={`flex-shrink-0 ${isSelected ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}`}>
                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium truncate ${isSelected ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
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
                    {note.pinned && <Pin size={10} className="text-amber-500" />}
                    {note.starred && <span className="text-amber-500 text-xs">★</span>}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-600 truncate mt-0.5">
                    {note.content.substring(0, 80)}{note.content.length > 80 ? '...' : ''}
                  </p>
                </div>
                {note.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {note.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="tag-pill text-[10px]">{tag}</span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="text-[10px] text-gray-400 dark:text-gray-600">+{note.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Tag Input */}
        {showTagInput && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-primary-500 flex-shrink-0" />
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Enter tag name..."
                className="input-field flex-1 text-sm"
                autoFocus
              />
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                onClick={() => { setShowTagInput(false); setNewTag('') }}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-600">
                {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'No selection'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction('archive')}
                disabled={selectedIds.size === 0}
                className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Archive size={14} />
                Archive
              </button>
              <button
                onClick={() => handleAction('pin')}
                disabled={selectedIds.size === 0}
                className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Pin size={14} />
                Pin
              </button>
              <button
                onClick={() => handleAction('addTag')}
                disabled={selectedIds.size === 0}
                className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Tag size={14} />
                Add Tag
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete ${selectedIds.size} note${selectedIds.size !== 1 ? 's' : ''}? This cannot be undone.`)) {
                    handleAction('delete')
                  }
                }}
                disabled={selectedIds.size === 0}
                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}