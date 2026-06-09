import { useState, useEffect, useCallback } from 'react'
import { Note, Project, NoteType, NoteStatus } from '../types'
import { exportAiPrompt } from '../storage'
import { ArrowLeft, Save, Trash2, Tag, Wand2, Eye, FileEdit, Type, CheckCircle2, Clock, X, Sparkles } from 'lucide-react'

interface NoteEditorProps {
  note: Note
  project: Project
  onUpdate: (noteId: string, updates: Partial<Note>) => void
  onClose: () => void
  onDelete: (noteId: string) => void
}

export default function NoteEditor({
  note,
  project,
  onUpdate,
  onClose,
  onDelete,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [type, setType] = useState<NoteType>(note.type)
  const [status, setStatus] = useState<NoteStatus>(note.status)
  const [tags, setTags] = useState<string[]>(note.tags)
  const [newTag, setNewTag] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showAiExport, setShowAiExport] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  // Auto-save on change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content || type !== note.type || status !== note.status || JSON.stringify(tags) !== JSON.stringify(note.tags)) {
        onUpdate(note.id, { title, content, type, status, tags })
        setIsDirty(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [title, content, type, status, tags, note.id, note.title, note.content, note.type, note.status, note.tags, onUpdate])

  const generateAiPrompt = useCallback(() => {
    const prompt = `# AI Context Export

## Project: ${project.name}
${project.description ? `Description: ${project.description}\n` : ''}

## Current Note
- Title: ${title}
- Type: ${type}
- Status: ${status}
- Tags: ${tags.join(', ')}

## Content
${content}

## Context
This note is part of the "${project.name}" project. 
Project contains ${project.notes.length} notes total.

## AI Instructions
Based on the above context, please analyze and provide insights or help with the following:
- [Your request here]

## Related Notes in Project
${project.notes.filter(n => n.id !== note.id).map(n => `- ${n.title} (${n.type}): ${n.content.substring(0, 100)}...`).join('\n')}
`
    setAiPrompt(prompt)
    setShowAiExport(true)
  }, [project, note, title, content, type, status, tags])

  const handleExportAiPrompt = async () => {
    await exportAiPrompt(aiPrompt)
    setShowAiExport(false)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  // Simple markdown preview
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6 text-gray-900 dark:text-white">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4 text-gray-900 dark:text-white">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl overflow-x-auto mb-4 text-sm font-mono"><code>$1</code></pre>')
      .replace(/\n/gim, '<br />')
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="btn-ghost"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white w-96 placeholder-gray-400"
              placeholder="Note title"
            />
            <span className="text-xs text-gray-400 dark:text-gray-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
              {project.name}
              {isDirty && <span className="text-amber-500">• Unsaved</span>}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`btn-ghost ${showPreview ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : ''}`}
            title={showPreview ? "Edit" : "Preview"}
          >
            {showPreview ? <FileEdit size={18} /> : <Eye size={18} />}
          </button>
          <button
            onClick={generateAiPrompt}
            className="btn-secondary text-sm shadow-sm"
          >
            <Wand2 size={14} />
            AI Export
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this note?')) {
                onDelete(note.id)
                onClose()
              }
            }}
            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all hover:scale-105"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="flex items-center gap-6 px-8 py-3 bg-white/50 dark:bg-gray-900/50 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Type size={14} className="text-gray-400" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as NoteType)}
            className="input-field py-1.5 text-sm w-28"
          >
            <option value="note">Note</option>
            <option value="task">Task</option>
            <option value="idea">Idea</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-gray-400" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as NoteStatus)}
            className="input-field py-1.5 text-sm w-32"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

        <div className="flex items-center gap-2 flex-1">
          <Tag size={14} className="text-gray-400" />
          {tags.map(tag => (
            <span key={tag} className="tag-pill flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              {tag}
              <button
                onClick={() => removeTag(tag)}
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
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              placeholder="Add tag..."
              className="input-field py-1.5 text-sm w-28"
            />
            <button
              onClick={addTag}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors"
            >
              <Sparkles size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {!showPreview ? (
          <div className="flex-1 flex flex-col">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full h-full p-8 bg-transparent resize-none focus:outline-none text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed"
              placeholder="Write your note here... (Markdown supported)

# Heading
**bold** *italic* `code`

```
code block
```"
              spellCheck={false}
            />
            <div className="px-8 py-2 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between">
              <span>{content.length} characters</span>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                Auto-saved
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8">
            <div 
              className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        )}
      </div>

      {/* AI Export Modal */}
      {showAiExport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-3/4 max-w-4xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <Wand2 size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Export Prompt
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-600">Export this note as an AI-readable prompt</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiExport(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-6">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-mono text-sm text-gray-900 dark:text-gray-100 leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setShowAiExport(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleExportAiPrompt}
                className="btn-primary"
              >
                <Save size={16} />
                Export to File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
