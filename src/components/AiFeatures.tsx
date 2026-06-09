import { useState } from 'react'
import { Note } from '../types'
import { summarizeNote, suggestTags, getRelatedNotes } from '../storage'
import { Sparkles, Tag, FileText, X, Plus, ArrowRight, Wand2, Link } from 'lucide-react'

type AiTab = 'summarize' | 'tags' | 'related'

interface AiFeaturesProps {
  note: Note
  allNotes: Note[]
  isOpen: boolean
  onClose: () => void
  onAddTags: (tags: string[]) => void
  onUpdateSummary: (summary: string) => void
}

export default function AiFeatures({
  note,
  allNotes,
  isOpen,
  onClose,
  onAddTags,
  onUpdateSummary,
}: AiFeaturesProps) {
  const [activeTab, setActiveTab] = useState<AiTab>('summarize')
  const [summary, setSummary] = useState<string | null>(null)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [hasSuggestedTags, setHasSuggestedTags] = useState(false)
  const [relatedNotes, setRelatedNotes] = useState<{ id: string; title: string; score: number }[]>([])
  const [hasRelated, setHasRelated] = useState(false)

  const tabs: { id: AiTab; label: string; icon: typeof Sparkles }[] = [
    { id: 'summarize', label: 'Summarize', icon: Wand2 },
    { id: 'tags', label: 'Suggest Tags', icon: Tag },
    { id: 'related', label: 'Related Notes', icon: Link },
  ]

  const handleSummarize = () => {
    setIsSummarizing(true)
    // Simulate async AI operation
    setTimeout(() => {
      const result = summarizeNote(note.content)
      setSummary(result)
      onUpdateSummary(result)
      setIsSummarizing(false)
    }, 600)
  }

  const handleSuggestTags = () => {
    const tags = suggestTags(note.content, note.tags)
    setSuggestedTags(tags)
    setHasSuggestedTags(true)
  }

  const handleFindRelated = () => {
    const relatedIds = getRelatedNotes(note, allNotes, 5)
    const related = relatedIds.map(id => {
      const found = allNotes.find(n => n.id === id)
      return found ? { id: found.id, title: found.title, score: 0 } : { id, title: 'Unknown', score: 0 }
    })
    // Calculate scores for display
    const noteWords = new Set(note.content.toLowerCase().split(/\s+/).filter(w => w.length > 3))
    const noteTags = new Set(note.tags.map(t => t.toLowerCase()))
    const scored = related.map(r => {
      const found = allNotes.find(n => n.id === r.id)
      if (!found) return { ...r, score: 0 }
      const nWords = new Set(found.content.toLowerCase().split(/\s+/).filter(w => w.length > 3))
      const nTags = new Set(found.tags.map(t => t.toLowerCase()))
      const wordOverlap = [...noteWords].filter(w => nWords.has(w)).length
      const tagOverlap = [...noteTags].filter(t => nTags.has(t)).length
      return { ...r, score: wordOverlap * 2 + tagOverlap * 10 }
    })
    setRelatedNotes(scored)
    setHasRelated(true)
  }

  const handleAddTag = (tag: string) => {
    onAddTags([...note.tags, tag])
    setSuggestedTags(prev => prev.filter(t => t !== tag))
  }

  const handleAddAllTags = () => {
    onAddTags([...note.tags, ...suggestedTags])
    setSuggestedTags([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Features
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600 truncate max-w-xs">
                {note.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Summarize Tab */}
          {activeTab === 'summarize' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate a concise summary of your note content.
                </p>
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="btn-primary text-sm shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 size={14} className={isSummarizing ? 'animate-spin' : ''} />
                  {isSummarizing ? 'Summarizing...' : 'Summarize'}
                </button>
              </div>

              {summary ? (
                <div className="bg-gradient-to-br from-primary-50 to-primary-50/50 dark:from-primary-900/10 dark:to-primary-900/5 border border-primary-100 dark:border-primary-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-primary-500" />
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                      AI Summary
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {summary}
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                    Click "Summarize" to generate a summary
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Suggest Tags Tab */}
          {activeTab === 'tags' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get AI-suggested tags based on your note content.
                </p>
                <button
                  onClick={handleSuggestTags}
                  className="btn-primary text-sm shadow-lg shadow-primary-500/20"
                >
                  <Tag size={14} />
                  Suggest Tags
                </button>
              </div>

              {/* Current Tags */}
              {note.tags.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Current Tags
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {note.tags.map(tag => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Tags */}
              {hasSuggestedTags && (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Suggested Tags
                    </span>
                    {suggestedTags.length > 1 && (
                      <button
                        onClick={handleAddAllTags}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
                      >
                        Add all
                        <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {suggestedTags.length > 0 ? suggestedTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="tag-pill flex items-center gap-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-500/30 transition-colors cursor-pointer"
                      >
                        <Plus size={10} />
                        {tag}
                      </button>
                    )) : (
                      <p className="text-sm text-gray-400 dark:text-gray-600">
                        No new tags to suggest — your note is well-tagged!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!hasSuggestedTags && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-4">
                    <Tag size={24} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                    Click "Suggest Tags" to get AI recommendations
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Related Notes Tab */}
          {activeTab === 'related' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Find notes related to this one by content similarity.
                </p>
                <button
                  onClick={handleFindRelated}
                  className="btn-primary text-sm shadow-lg shadow-primary-500/20"
                >
                  <Link size={14} />
                  Find Related
                </button>
              </div>

              {hasRelated && (
                <div className="space-y-2">
                  {relatedNotes.length > 0 ? relatedNotes.map(item => (
                    <div
                      key={item.id}
                      className="note-card p-4 flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/20 dark:to-primary-800/10 flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Relevance score: {item.score}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
                            style={{ width: `${Math.min(100, (item.score / (relatedNotes[0]?.score || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-4">
                        <Link size={24} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                        No related notes found
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!hasRelated && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-4">
                    <Link size={24} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                    Click "Find Related" to discover similar notes
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}