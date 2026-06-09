import { useMemo } from 'react'
import { FileText, Type, Clock, Target } from 'lucide-react'

interface WordCountProps {
  content: string
  goal?: number
}

export default function WordCount({ content, goal = 0 }: WordCountProps) {
  const stats = useMemo(() => {
    const text = content.trim()
    const words = text ? text.split(/\s+/).length : 0
    const chars = content.length
    const charsNoSpaces = content.replace(/\s/g, '').length
    const sentences = text ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0
    const paragraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0
    const readingTime = Math.max(1, Math.ceil(words / 200))
    const speakingTime = Math.max(1, Math.ceil(words / 130))

    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime }
  }, [content])

  const progress = goal > 0 ? Math.min(100, (stats.words / goal) * 100) : 0
  const isGoalMet = goal > 0 && stats.words >= goal

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
      {/* Goal progress */}
      {goal > 0 && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target size={14} className={isGoalMet ? 'text-emerald-500' : 'text-primary-500'} />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {isGoalMet ? 'Goal reached!' : 'Word goal'}
              </span>
            </div>
            <span className={`text-xs font-semibold tabular-nums ${isGoalMet ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {stats.words.toLocaleString()} / {goal.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isGoalMet
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  : 'bg-gradient-to-r from-primary-500 to-primary-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-gray-100 dark:bg-gray-700/50">
        <div className="bg-white dark:bg-gray-800 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={12} className="text-primary-500" />
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Words</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
            {stats.words.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Type size={12} className="text-blue-500" />
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Characters</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
            {stats.chars.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={12} className="text-amber-500" />
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Read time</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
            {stats.readingTime} <span className="text-xs font-medium text-gray-400 dark:text-gray-500">min</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={12} className="text-emerald-500" />
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Paragraphs</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
            {stats.paragraphs}
          </p>
        </div>
      </div>

      {/* Footer detail */}
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-600">
          <span>{stats.sentences} sentences</span>
          <span>{stats.charsNoSpaces.toLocaleString()} chars (no spaces)</span>
          <span>{stats.speakingTime} min speak</span>
        </div>
      </div>
    </div>
  )
}