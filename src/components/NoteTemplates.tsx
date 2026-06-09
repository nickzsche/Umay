import { useState } from 'react'
import { NoteTemplate } from '../types'
import { NOTE_TEMPLATES } from '../storage'
import { X, FileText, CheckSquare, Lightbulb, Plus } from 'lucide-react'

interface NoteTemplatesProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: NoteTemplate) => void
}

const typeIcons = {
  note: FileText,
  task: CheckSquare,
  idea: Lightbulb,
}

const typeColors = {
  note: {
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-500',
    hover: 'hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-blue-500/10',
  },
  task: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: 'text-emerald-500',
    hover: 'hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-emerald-500/10',
  },
  idea: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    icon: 'text-amber-500',
    hover: 'hover:border-amber-300 dark:hover:border-amber-500/40 hover:shadow-amber-500/10',
  },
}

export default function NoteTemplates({ isOpen, onClose, onSelectTemplate }: NoteTemplatesProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Plus size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                New from Template
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Choose a template to get started quickly
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

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {NOTE_TEMPLATES.map((template) => {
              const colors = typeColors[template.type]
              const Icon = typeIcons[template.type]
              const isHovered = hoveredId === template.id

              return (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template)
                    onClose()
                  }}
                  onMouseEnter={() => setHoveredId(template.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-200 ${colors.border} ${colors.hover} hover:shadow-lg hover:-translate-y-0.5 bg-white dark:bg-gray-800/50`}
                >
                  {/* Icon & Type Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center text-2xl`}>
                      {template.icon}
                    </div>
                    <span className={`type-badge ${colors.bg} ${colors.text} border ${colors.border}`}>
                      <Icon size={12} />
                      {template.type}
                    </span>
                  </div>

                  {/* Name */}
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5">
                    {template.name}
                  </h4>

                  {/* Preview */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                    {template.content.substring(0, 100).replace(/[#*`\n]/g, ' ').trim()}...
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {template.tags.map((tag) => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Hover overlay */}
                  {isHovered && (
                    <div className="absolute inset-0 rounded-2xl bg-primary-500/5 dark:bg-primary-500/10 pointer-events-none" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
            Click a template to create a new note with pre-filled content
          </p>
        </div>
      </div>
    </div>
  )
}