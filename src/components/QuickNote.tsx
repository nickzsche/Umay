import { useState, useEffect, useRef } from 'react'
import { Project } from '../types'
import { X, Save, Tag, FolderOpen, Zap } from 'lucide-react'

interface QuickNoteProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: { title: string; content: string; tags: string[]; projectId: string }) => void
  projects: Project[]
}

export default function QuickNote({ isOpen, onClose, onSave, projects }: QuickNoteProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTitle('')
      setContent('')
      setTags([])
      setNewTag('')
      setProjectId(projects[0]?.id ?? '')
      setTimeout(() => titleRef.current?.focus(), 100)
    }
  }, [isOpen, projects])

  const handleAddTag = () => {
    const trimmed = newTag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return
    onSave({
      title: title.trim() || 'Untitled Quick Note',
      content,
      tags,
      projectId,
    })
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      handleSave()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Note
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Capture a thought instantly
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

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="input-field w-full text-base font-semibold"
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            rows={6}
            className="input-field w-full resize-none font-mono text-sm leading-relaxed"
          />

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              <Tag size={12} />
              Tags
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map(tag => (
                <span key={tag} className="tag-pill flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag..."
                  className="input-field py-1.5 text-sm w-28"
                />
              </div>
            </div>
          </div>

          {/* Project Selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              <FolderOpen size={12} />
              Project
            </div>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="input-field w-full"
            >
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.emoji ? `${project.emoji} ` : ''}{project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <span className="text-xs text-gray-400 dark:text-gray-600">
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-medium">⌘</kbd>
            {' + '}
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-medium">Enter</kbd>
            {' to save'}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn-secondary text-sm">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary text-sm"
            >
              <Save size={14} />
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}