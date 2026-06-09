import { Copy } from 'lucide-react'
import { Note } from '../types'

interface DuplicateNoteProps {
  note: Note
  onDuplicate: (note: Note) => void
}

export default function DuplicateNote({ note, onDuplicate }: DuplicateNoteProps) {
  const handleDuplicate = () => {
    onDuplicate(note)
  }

  return (
    <button
      onClick={handleDuplicate}
      className="btn-ghost flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
      title={`Duplicate "${note.title}"`}
    >
      <Copy size={15} />
      <span>Duplicate</span>
    </button>
  )
}