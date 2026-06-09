import { useMemo } from 'react'
import { Note } from '../types'
import { Link2, ExternalLink } from 'lucide-react'

interface NoteLinkingProps {
  content: string
  allNotes: Note[]
  onNavigate: (noteId: string) => void
}

const WIKILINK_REGEX = /\[\[([^\]]+)\]\]/g

export function parseWikiLinks(content: string): { title: string; index: number }[] {
  const links: { title: string; index: number }[] = []
  let match: RegExpExecArray | null
  const regex = new RegExp(WIKILINK_REGEX.source, WIKILINK_REGEX.flags)
  while ((match = regex.exec(content)) !== null) {
    links.push({ title: match[1].trim(), index: match.index })
  }
  return links
}

export function findBacklinks(noteTitle: string, allNotes: Note[]): Note[] {
  return allNotes.filter(note => {
    const links = parseWikiLinks(note.content)
    return links.some(link => link.title.toLowerCase() === noteTitle.toLowerCase())
  })
}

export default function NoteLinking({ content, allNotes, onNavigate }: NoteLinkingProps) {
  const links = useMemo(() => parseWikiLinks(content), [content])

  const resolvedLinks = useMemo(() => {
    return links.map(link => {
      const matchedNote = allNotes.find(
        n => n.title.toLowerCase() === link.title.toLowerCase()
      )
      return { ...link, note: matchedNote ?? null }
    })
  }, [links, allNotes])

  if (links.length === 0) return null

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 mb-2">
        <Link2 size={12} />
        Linked References
      </div>
      <div className="flex flex-wrap gap-2">
        {resolvedLinks.map((link, i) => (
          <button
            key={`${link.title}-${i}`}
            onClick={() => link.note && onNavigate(link.note.id)}
            disabled={!link.note}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              link.note
                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20 hover:bg-primary-100 dark:hover:bg-primary-500/20 hover:shadow-sm hover:shadow-primary-500/10 active:scale-95 cursor-pointer'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 cursor-not-allowed line-through'
            }`}
          >
            <ExternalLink size={12} />
            {link.title}
            {!link.note && (
              <span className="text-[10px] opacity-60">(not found)</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}