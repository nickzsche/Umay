import { useMemo } from 'react'
import { X, List, Heading1, Heading2, Heading3 } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: 1 | 2 | 3
}

interface TableOfContentsProps {
  content: string
  isOpen: boolean
  onClose: () => void
  onNavigate: (headingId: string) => void
}

const headingIcons = {
  1: Heading1,
  2: Heading2,
  3: Heading3,
}

const headingColors = {
  1: 'text-primary-500',
  2: 'text-primary-400',
  3: 'text-gray-400 dark:text-gray-500',
}

function extractHeadings(content: string): Heading[] {
  const lines = content.split('\n')
  const headings: Heading[] = []

  for (const line of lines) {
    const h1Match = line.match(/^# (.+)$/)
    const h2Match = line.match(/^## (.+)$/)
    const h3Match = line.match(/^### (.+)$/)

    if (h3Match) {
      const text = h3Match[1].trim()
      headings.push({ id: text.toLowerCase().replace(/[^\w]+/g, '-'), text, level: 3 })
    } else if (h2Match) {
      const text = h2Match[1].trim()
      headings.push({ id: text.toLowerCase().replace(/[^\w]+/g, '-'), text, level: 2 })
    } else if (h1Match) {
      const text = h1Match[1].trim()
      headings.push({ id: text.toLowerCase().replace(/[^\w]+/g, '-'), text, level: 1 })
    }
  }

  return headings
}

export default function TableOfContents({ content, isOpen, onClose, onNavigate }: TableOfContentsProps) {
  const headings = useMemo(() => extractHeadings(content), [content])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-80 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <List size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Table of Contents
              </h3>
              <p className="text-[11px] text-gray-400 dark:text-gray-600">
                {headings.length} section{headings.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Headings list */}
        <div className="flex-1 overflow-y-auto py-2">
          {headings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <List size={20} className="text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No headings found</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 text-center">
                Use # ## ### to create headings
              </p>
            </div>
          ) : (
            <nav className="space-y-0.5 px-2">
              {headings.map((heading, index) => {
                const Icon = headingIcons[heading.level]
                const indentClass = heading.level === 1 ? 'pl-3' : heading.level === 2 ? 'pl-7' : 'pl-11'
                return (
                  <button
                    key={`${heading.id}-${index}`}
                    onClick={() => onNavigate(heading.id)}
                    className={`w-full flex items-center gap-2.5 py-2 pr-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/80 group ${indentClass}`}
                  >
                    <Icon size={14} className={`${headingColors[heading.level]} shrink-0`} />
                    <span className={`text-sm truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ${
                      heading.level === 1
                        ? 'font-semibold text-gray-900 dark:text-white'
                        : heading.level === 2
                        ? 'font-medium text-gray-700 dark:text-gray-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {heading.text}
                    </span>
                  </button>
                )
              })}
            </nav>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <p className="text-[11px] text-gray-400 dark:text-gray-600 flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-medium">ESC</kbd>
            Close panel
          </p>
        </div>
      </div>
    </div>
  )
}