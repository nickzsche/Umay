import { useCallback } from 'react'
import { Check, Square } from 'lucide-react'

interface TaskChecklistProps {
  content: string
  onToggle: (updatedContent: string) => void
}

interface ParsedLine {
  id: number
  checked: boolean
  text: string
  prefix: string
  suffix: string
}

function parseChecklist(content: string): ParsedLine[] {
  const lines = content.split('\n')
  let id = 0
  const parsed: ParsedLine[] = []

  for (const line of lines) {
    const match = line.match(/^(\s*[-*]?\s*)\[([ xX])\](.*)$/)
    if (match) {
      parsed.push({
        id: id++,
        checked: match[2] !== ' ',
        text: match[3].trimStart(),
        prefix: match[1],
        suffix: '',
      })
    }
  }

  return parsed
}

function toggleLine(content: string, lineIndex: number): string {
  const lines = content.split('\n')
  let checkIndex = 0

  return lines
    .map((line) => {
      const match = line.match(/^(\s*[-*]?\s*)\[([ xX])\](.*)$/)
      if (match) {
        if (checkIndex === lineIndex) {
          const newState = match[2] === ' ' ? 'x' : ' '
          return `${match[1]}[${newState}]${match[3]}`
        }
        checkIndex++
      }
      return line
    })
    .join('\n')
}

export default function TaskChecklist({ content, onToggle }: TaskChecklistProps) {
  const items = parseChecklist(content)

  const handleToggle = useCallback(
    (index: number) => {
      const updated = toggleLine(content, index)
      onToggle(updated)
    },
    [content, onToggle]
  )

  if (items.length === 0) return null

  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleToggle(item.id)}
          className={`group flex items-start gap-3 w-full text-left px-3 py-2 rounded-xl transition-all duration-200 ${
            item.checked
              ? 'bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
              : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="mt-0.5 shrink-0">
            {item.checked ? (
              <div className="w-[18px] h-[18px] rounded-md bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-500/25">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            ) : (
              <div className="w-[18px] h-[18px] rounded-md border-2 border-gray-300 dark:border-gray-600 group-hover:border-primary-400 dark:group-hover:border-primary-500 transition-colors" />
            )}
          </span>
          <span
            className={`flex-1 text-sm leading-relaxed transition-all duration-200 ${
              item.checked
                ? 'text-gray-400 dark:text-gray-500 line-through decoration-gray-300 dark:decoration-gray-600'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {item.text}
          </span>
        </button>
      ))}
    </div>
  )
}