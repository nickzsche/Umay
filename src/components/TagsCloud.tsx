import { useMemo } from 'react'
import { AppData } from '../types'
import { X, Hash, TrendingUp } from 'lucide-react'

interface TagsCloudProps {
  data: AppData
  isOpen: boolean
  onClose: () => void
  onSelectTag: (tag: string) => void
}

const tagColorPalette = [
  'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
  'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
  'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
  'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
  'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 border-violet-200 dark:border-violet-500/20',
  'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20',
  'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20',
  'bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400 border-pink-200 dark:border-pink-500/20',
  'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20',
  'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20',
]

export default function TagsCloud({
  data,
  isOpen,
  onClose,
  onSelectTag,
}: TagsCloudProps) {
  const tagStats = useMemo(() => {
    const freq: Record<string, number> = {}
    data.projects.forEach(project => {
      project.notes.forEach(note => {
        note.tags.forEach(tag => {
          freq[tag] = (freq[tag] || 0) + 1
        })
      })
    })
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }))
  }, [data])

  const maxCount = tagStats.length > 0 ? tagStats[0].count : 1

  const getTagSize = (count: number) => {
    const ratio = count / maxCount
    if (ratio > 0.8) return 'text-2xl font-bold'
    if (ratio > 0.6) return 'text-xl font-semibold'
    if (ratio > 0.4) return 'text-lg font-medium'
    if (ratio > 0.2) return 'text-base font-medium'
    return 'text-sm font-normal'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 glass-panel rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Hash size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Tags Cloud
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {tagStats.length} tags across {data.projects.length} projects
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

        {/* Tag Cloud */}
        <div className="p-6">
          {tagStats.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Hash size={24} className="text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                No tags found. Add tags to your notes to see them here.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 justify-center">
              {tagStats.map(({ tag, count }, index) => (
                <button
                  key={tag}
                  onClick={() => {
                    onSelectTag(tag)
                    onClose()
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 hover:scale-110 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 ${getTagSize(count)} ${tagColorPalette[index % tagColorPalette.length]}`}
                >
                  <Hash size={12} />
                  {tag}
                  <span className="text-[10px] opacity-60 font-normal">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Top Tags */}
        {tagStats.length > 0 && (
          <div className="px-6 pb-6">
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-primary-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                  Most Used
                </p>
              </div>
              <div className="space-y-2">
                {tagStats.slice(0, 5).map(({ tag, count }, index) => (
                  <div
                    key={tag}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-xs font-bold text-gray-300 dark:text-gray-600 w-4 text-right">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {tag}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-600">
                          {count} note{count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}