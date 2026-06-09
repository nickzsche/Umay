import { useState, useEffect, useCallback, useRef } from 'react'
import { Note } from '../types'
import { X, Clock, Target, Minimize2 } from 'lucide-react'

interface FocusModeProps {
  note: Note
  isOpen: boolean
  onClose: () => void
  onUpdate: (noteId: string, updates: Partial<Note>) => void
  wordCountGoal: number
}

export default function FocusMode({ note, isOpen, onClose, onUpdate, wordCountGoal }: FocusModeProps) {
  const [content, setContent] = useState(note.content)
  const [title, setTitle] = useState(note.title)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const progress = wordCountGoal > 0 ? Math.min(100, (wordCount / wordCountGoal) * 100) : 0

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Auto-save on content change
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      if (content !== note.content || title !== note.title) {
        onUpdate(note.id, { content, title })
      }
    }, 800)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [content, title, note.id, note.content, note.title, onUpdate])

  // Focus textarea on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-950 dark:bg-gray-950">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none text-gray-100 placeholder-gray-600 w-80"
            placeholder="Untitled note..."
          />
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Clock size={14} />
            <span>{readingTime} min read</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {wordCountGoal > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700/50">
              <Target size={14} className="text-primary-400" />
              <span className="text-sm text-gray-300 tabular-nums">
                {wordCount.toLocaleString()} / {wordCountGoal.toLocaleString()}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-all"
            title="Exit focus mode (Esc)"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-all"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {wordCountGoal > 0 && (
        <div className="h-1 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto flex justify-center">
        <div className="w-full max-w-3xl px-8 py-12">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[60vh] bg-transparent resize-none focus:outline-none text-gray-200 text-lg leading-relaxed placeholder-gray-700"
            placeholder="Start writing... Focus mode is on. No distractions."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800/50 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>{wordCount.toLocaleString()} words</span>
          <span className="text-gray-700">|</span>
          <span>{charCount.toLocaleString()} characters</span>
          <span className="text-gray-700">|</span>
          <span>{readingTime} min read</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] font-medium border border-gray-700">ESC</kbd>
          <span>Exit focus mode</span>
        </div>
      </div>
    </div>
  )
}