import { useState, useEffect, useRef, useCallback } from 'react'
import { AppData, SearchResult } from '../types'
import { searchAllNotes } from '../storage'
import { Search, FileText, CheckSquare, Lightbulb, Folder, ArrowRight, Hash } from 'lucide-react'

interface SearchPaletteProps {
  isOpen: boolean
  onClose: () => void
  onSelectNote: (noteId: string, projectId: string) => void
  data: AppData
}

const typeIcons = {
  note: FileText,
  task: CheckSquare,
  idea: Lightbulb,
}

const typeColors = {
  note: 'text-blue-500',
  task: 'text-emerald-500',
  idea: 'text-amber-500',
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)
  if (index === -1) return text

  return (
    <>
      {text.substring(0, index)}
      <mark className="bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded px-0.5">
        {text.substring(index, index + query.length)}
      </mark>
      {text.substring(index + query.length)}
    </>
  )
}

export default function SearchPalette({ isOpen, onClose, onSelectNote, data }: SearchPaletteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchAllNotes(data, query)
      setResults(searchResults)
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query, data])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        const result = results[selectedIndex]
        onSelectNote(result.note.id, result.project.id)
        onClose()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    },
    [results, selectedIndex, onSelectNote, onClose]
  )

  useEffect(() => {
    const selectedItem = listRef.current?.children[selectedIndex] as HTMLElement | undefined
    selectedItem?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[60vh]">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <Search size={20} className="text-gray-400 dark:text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search notes, tasks, ideas..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white text-lg placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="flex-1 overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                <Search size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No results found</p>
              <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Try a different search term</p>
            </div>
          )}

          {!query.trim() && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                <Search size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Start typing to search</p>
              <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                Search across all notes, tasks, and ideas
              </p>
            </div>
          )}

          {results.map((result, index) => {
            const Icon = typeIcons[result.note.type]
            return (
              <button
                key={`${result.note.id}-${index}`}
                onClick={() => {
                  onSelectNote(result.note.id, result.project.id)
                  onClose()
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors ${
                  index === selectedIndex
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className={`mt-0.5 ${typeColors[result.note.type]}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {highlightMatch(result.note.title, query)}
                    </span>
                    <span className={`type-badge text-[10px] px-1.5 py-0.5 ${
                      result.note.type === 'note'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                        : result.note.type === 'task'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                    }`}>
                      {result.note.type}
                    </span>
                  </div>
                  {result.matches[0] && result.matches[0].field === 'content' && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {highlightMatch(
                        result.matches[0].text.length > 80
                          ? result.matches[0].text.substring(0, 80) + '...'
                          : result.matches[0].text,
                        query
                      )}
                    </p>
                  )}
                  {result.matches.some((m) => m.field === 'tag') && (
                    <div className="flex items-center gap-1 mt-1">
                      <Hash size={10} className="text-gray-400" />
                      {result.matches
                        .filter((m) => m.field === 'tag')
                        .map((m) => (
                          <span key={m.text} className="tag-pill text-[10px]">
                            {highlightMatch(m.text, query)}
                          </span>
                        ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Folder size={10} className="text-gray-400" />
                    <span className="text-xs text-gray-400 dark:text-gray-600">
                      {result.project.name}
                    </span>
                  </div>
                </div>
                {index === selectedIndex && (
                  <ArrowRight size={16} className="text-primary-500 mt-2 shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="flex items-center gap-4 px-5 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-xs text-gray-400 dark:text-gray-600">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-medium">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-medium">↵</kbd>
              Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-medium">ESC</kbd>
              Close
            </span>
            <span className="ml-auto">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}