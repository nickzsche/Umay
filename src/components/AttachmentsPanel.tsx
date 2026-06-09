import { useState, useCallback, useRef } from 'react'
import { Note, Attachment } from '../types'
import { X, FileText, Image, FileCode, File, Trash2, Upload, Paperclip, HardDrive } from 'lucide-react'

interface AttachmentsPanelProps {
  note: Note
  isOpen: boolean
  onClose: () => void
  onAddAttachment: (noteId: string, file: File) => void
  onDeleteAttachment: (noteId: string, attachmentId: string) => void
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return Image
  if (type.includes('javascript') || type.includes('json') || type.includes('xml') || type.includes('html') || type.includes('css')) return FileCode
  return FileText
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getFileExtension(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : ''
}

export default function AttachmentsPanel({
  note,
  isOpen,
  onClose,
  onAddAttachment,
  onDeleteAttachment,
}: AttachmentsPanelProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      files.forEach(file => {
        onAddAttachment(note.id, file)
      })
    },
    [note.id, onAddAttachment]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      files.forEach(file => {
        onAddAttachment(note.id, file)
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [note.id, onAddAttachment]
  )

  const totalSize = (note.attachments ?? []).reduce((sum, a) => sum + a.size, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg mx-4 glass-panel rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Paperclip size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Attachments
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {note.attachments?.length ?? 0} file{(note.attachments?.length ?? 0) !== 1 ? 's' : ''} &middot; {formatFileSize(totalSize)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drop Zone */}
        <div className="px-6 pt-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
                : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors ${
              isDragOver
                ? 'bg-primary-100 dark:bg-primary-800/30'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              <Upload size={20} className={isDragOver ? 'text-primary-500' : 'text-gray-400 dark:text-gray-600'} />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              or click to browse
            </p>
          </div>
        </div>

        {/* File List */}
        <div className="px-6 py-4 max-h-80 overflow-y-auto">
          {(!note.attachments || note.attachments.length === 0) ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                <File size={24} className="text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                No attachments yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                Drop files above to attach them to this note
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {note.attachments.map((attachment: Attachment) => {
                const Icon = getFileIcon(attachment.type)
                const ext = getFileExtension(attachment.name)

                return (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:shadow-primary-500/5 transition-all duration-200 group"
                  >
                    {/* File Icon */}
                    <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {attachment.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {ext && (
                          <span className="text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                            {ext}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 dark:text-gray-600">
                          {formatFileSize(attachment.size)}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-600">
                          {new Date(attachment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDeleteAttachment(note.id, attachment.id)}
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {note.attachments && note.attachments.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
                <HardDrive size={12} />
                <span>{formatFileSize(totalSize)} total</span>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary text-xs !px-3 !py-1.5"
              >
                <Upload size={12} />
                Add More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}