import { useState, useCallback } from 'react'
import { Note } from '../types'
import { X, Download, FileText, FileJson, Printer, Copy, Check, File } from 'lucide-react'

interface ExportPanelProps {
  note: Note
  isOpen: boolean
  onClose: () => void
  onExport: (format: string, data: string) => void
}

type ExportFormat = 'markdown' | 'json' | 'pdf' | 'clipboard'

interface FormatOption {
  id: ExportFormat
  label: string
  description: string
  icon: typeof FileText
  color: string
  bgColor: string
}

const formats: FormatOption[] = [
  {
    id: 'markdown',
    label: 'Markdown',
    description: 'Export as .md file with full formatting',
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Structured data with metadata',
    icon: FileJson,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10',
  },
  {
    id: 'pdf',
    label: 'PDF',
    description: 'Print-ready document via browser print',
    icon: Printer,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-500/10',
  },
  {
    id: 'clipboard',
    label: 'Copy to Clipboard',
    description: 'Copy markdown content to clipboard',
    icon: Copy,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
]

function generateMarkdown(note: Note): string {
  const lines: string[] = []
  lines.push(`# ${note.title}`)
  lines.push('')
  if (note.tags.length > 0) {
    lines.push(`Tags: ${note.tags.map(t => `\`${t}\``).join(', ')}`)
    lines.push('')
  }
  lines.push(`Type: ${note.type}`)
  lines.push(`Status: ${note.status}`)
  lines.push(`Created: ${note.createdAt}`)
  lines.push(`Updated: ${note.updatedAt}`)
  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push(note.content)
  return lines.join('\n')
}

function generateJSON(note: Note): string {
  return JSON.stringify(
    {
      id: note.id,
      title: note.title,
      content: note.content,
      type: note.type,
      status: note.status,
      tags: note.tags,
      pinned: note.pinned,
      starred: note.starred,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      wordCount: note.content.trim() ? note.content.trim().split(/\s+/).length : 0,
      readingTime: Math.max(1, Math.ceil((note.content.trim() ? note.content.trim().split(/\s+/).length : 0) / 200)),
    },
    null,
    2
  )
}

export default function ExportPanel({ note, isOpen, onClose, onExport }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown')
  const [copied, setCopied] = useState(false)

  const getPreview = useCallback(() => {
    switch (selectedFormat) {
      case 'markdown':
        return generateMarkdown(note)
      case 'json':
        return generateJSON(note)
      case 'pdf':
        return generateMarkdown(note)
      case 'clipboard':
        return note.content
    }
  }, [selectedFormat, note])

  const handleExport = useCallback(() => {
    if (selectedFormat === 'clipboard') {
      navigator.clipboard.writeText(getPreview())
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        onClose()
      }, 1500)
      return
    }

    if (selectedFormat === 'pdf') {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${note.title}</title>
              <style>
                body { font-family: 'Inter', system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.7; }
                h1 { font-size: 28px; margin-bottom: 8px; }
                h2 { font-size: 22px; margin-top: 24px; }
                h3 { font-size: 18px; margin-top: 20px; }
                code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
                pre { background: #f3f4f6; padding: 16px; border-radius: 8px; overflow-x: auto; }
                .meta { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
                hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
              </style>
            </head>
            <body>
              <h1>${note.title}</h1>
              <div class="meta">
                Type: ${note.type} · Status: ${note.status} · Tags: ${note.tags.join(', ') || 'None'}
              </div>
              <hr />
              <div>${note.content.replace(/\n/g, '<br />')}</div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
      onClose()
      return
    }

    onExport(selectedFormat, getPreview())
  }, [selectedFormat, note, getPreview, onExport, onClose])

  if (!isOpen) return null

  const preview = getPreview()
  const activeFormat = formats.find(f => f.id === selectedFormat)!

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Download size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Export Note
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Choose a format and export "{note.title}"
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

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Format selector */}
          <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700 p-4 space-y-2 bg-gray-50/50 dark:bg-gray-800/50">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-3 px-1">
              Format
            </p>
            {formats.map((format) => {
              const Icon = format.icon
              const isActive = selectedFormat === format.id
              return (
                <button
                  key={format.id}
                  onClick={() => { setSelectedFormat(format.id); setCopied(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 shadow-sm'
                      : 'border border-transparent hover:bg-white/50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${format.bgColor} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={format.color} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {format.label}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-600 truncate">
                      {format.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <activeFormat.icon size={14} className={activeFormat.color} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {activeFormat.label} Preview
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-600 tabular-nums">
                {preview.length.toLocaleString()} chars
              </span>
            </div>
            <div className="flex-1 overflow-auto p-5">
              <pre className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
                {preview}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
            <File size={12} />
            <span>{note.content.trim() ? note.content.trim().split(/\s+/).length : 0} words</span>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span>{note.type}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleExport} className="btn-primary">
              {selectedFormat === 'clipboard' ? (
                <>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </>
              ) : (
                <>
                  <Download size={16} />
                  Export {activeFormat.label}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}