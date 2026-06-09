import { useState, useMemo } from 'react'
import { Project, NoteType } from '../types'
import { generateProjectAiPrompt } from '../storage'
import { X, Download, Folder, FileText, CheckSquare, Lightbulb, Eye, Sparkles } from 'lucide-react'

interface GlobalAiExportProps {
  isOpen: boolean
  onClose: () => void
  project: Project
  onExport: (prompt: string) => void
}

const noteTypeLabels: Record<NoteType, string> = {
  note: 'Notes',
  task: 'Tasks',
  idea: 'Ideas',
}

const noteTypeIcons: Record<NoteType, typeof FileText> = {
  note: FileText,
  task: CheckSquare,
  idea: Lightbulb,
}

const noteTypeColors: Record<NoteType, string> = {
  note: 'text-blue-500',
  task: 'text-emerald-500',
  idea: 'text-amber-500',
}

export default function GlobalAiExport({ isOpen, onClose, project, onExport }: GlobalAiExportProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(project.id)
  const [selectedTypes, setSelectedTypes] = useState<Record<NoteType, boolean>>({
    note: true,
    task: true,
    idea: true,
  })

  // We need access to all projects for the dropdown, but the prop only gives us one project.
  // For now, we use the provided project as the default and allow filtering within it.
  const filteredNotes = useMemo(() => {
    return project.notes.filter((note) => selectedTypes[note.type])
  }, [project.notes, selectedTypes])

  const generatedPrompt = useMemo(() => {
    return generateProjectAiPrompt(project, filteredNotes)
  }, [project, filteredNotes])

  const toggleType = (type: NoteType) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const handleExport = () => {
    onExport(generatedPrompt)
  }

  if (!isOpen) return null

  const noteTypeCounts = project.notes.reduce(
    (acc, note) => {
      acc[note.type] = (acc[note.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

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
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Export
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Export project as an AI-ready prompt
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
          {/* Sidebar - Filters */}
          <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700 p-5 space-y-5 bg-gray-50/50 dark:bg-gray-800/50">
            {/* Project Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Folder size={14} className="inline mr-1.5 -mt-0.5" />
                Project
              </label>
              <div className="input-field flex items-center gap-2 cursor-default">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {project.name}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-600 ml-auto">
                  {project.notes.length} notes
                </span>
              </div>
            </div>

            {/* Note Type Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Eye size={14} className="inline mr-1.5 -mt-0.5" />
                Include Types
              </label>
              <div className="space-y-2">
                {(Object.keys(noteTypeLabels) as NoteType[]).map((type) => {
                  const Icon = noteTypeIcons[type]
                  const count = noteTypeCounts[type] || 0
                  const isChecked = selectedTypes[type]
                  return (
                    <label
                      key={type}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 shadow-sm'
                          : 'bg-gray-100/50 dark:bg-gray-800/30 border border-transparent opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleType(type)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-primary-500 border-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <Icon size={16} className={noteTypeColors[type]} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                        {noteTypeLabels[type]}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-600 tabular-nums">
                        {count}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Exporting <span className="font-semibold text-gray-600 dark:text-gray-400">{filteredNotes.length}</span> of{' '}
                {project.notes.length} notes
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated Prompt Preview
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-600 tabular-nums">
                {generatedPrompt.length.toLocaleString()} chars
              </span>
            </div>
            <div className="flex-1 overflow-hidden p-5">
              <textarea
                value={generatedPrompt}
                readOnly
                className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 resize-none focus:outline-none font-mono text-sm text-gray-900 dark:text-gray-100 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleExport} className="btn-primary">
            <Download size={16} />
            Export to File
          </button>
        </div>
      </div>
    </div>
  )
}