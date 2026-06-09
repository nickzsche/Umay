import { useMemo } from 'react'
import { AppData } from '../types'
import { X, BarChart3, FolderOpen, FileText, CheckSquare, Tag, TrendingUp, Calendar, Hash, Activity } from 'lucide-react'

interface StatisticsDashboardProps {
  data: AppData
  isOpen: boolean
  onClose: () => void
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function StatisticsDashboard({ data, isOpen, onClose }: StatisticsDashboardProps) {
  const stats = useMemo(() => {
    const allNotes = data.projects.flatMap(p => p.notes)
    const totalProjects = data.projects.filter(p => !p.archived).length
    const totalNotes = allNotes.length
    const totalTasks = allNotes.filter(n => n.type === 'task').length
    const totalArchived = allNotes.filter(n => n.status === 'archived').length

    // Notes by type
    const byType: Record<string, number> = {}
    allNotes.forEach(n => { byType[n.type] = (byType[n.type] || 0) + 1 })

    // Top tags
    const tagFreq: Record<string, number> = {}
    allNotes.forEach(n => n.tags.forEach(t => { tagFreq[t] = (tagFreq[t] || 0) + 1 }))
    const topTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 8)

    // Activity this week
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const activityByDay: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().split('T')[0]
      activityByDay[key] = 0
    }
    allNotes.forEach(n => {
      const created = n.createdAt.split('T')[0]
      if (activityByDay.hasOwnProperty(created)) {
        activityByDay[created]++
      }
    })

    // Average note length
    const totalWords = allNotes.reduce((sum, n) => sum + (n.wordCount ?? n.content.split(/\s+/).filter(Boolean).length), 0)
    const avgLength = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0

    // Starred count
    const starredCount = allNotes.filter(n => n.starred).length
    const pinnedCount = allNotes.filter(n => n.pinned).length

    return { totalProjects, totalNotes, totalTasks, totalArchived, byType, topTags, activityByDay, avgLength, starredCount, pinnedCount }
  }, [data])

  const maxActivity = Math.max(...Object.values(stats.activityByDay), 1)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <BarChart3 size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Statistics
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Overview of your notes and projects
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Projects', value: stats.totalProjects, icon: FolderOpen, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/25' },
              { label: 'Notes', value: stats.totalNotes, icon: FileText, color: 'from-primary-500 to-primary-600', shadow: 'shadow-primary-500/25' },
              { label: 'Tasks', value: stats.totalTasks, icon: CheckSquare, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/25' },
              { label: 'Archived', value: stats.totalArchived, icon: Activity, color: 'from-gray-500 to-gray-600', shadow: 'shadow-gray-500/25' },
            ].map(({ label, value, icon: Icon, color, shadow }) => (
              <div key={label} className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 hover:shadow-lg hover:shadow-gray-500/5 transition-all duration-200">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${shadow} mb-3`}>
                  <Icon size={14} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-400 dark:text-gray-600 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Notes by Type */}
          <div className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={14} className="text-primary-500" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notes by Type</p>
            </div>
            <div className="space-y-3">
              {[
                { type: 'note', label: 'Notes', count: stats.byType['note'] || 0, color: 'bg-gray-500', bg: 'bg-gray-100 dark:bg-gray-700' },
                { type: 'task', label: 'Tasks', count: stats.byType['task'] || 0, color: 'bg-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                { type: 'idea', label: 'Ideas', count: stats.byType['idea'] || 0, color: 'bg-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
              ].map(({ type, label, count, color, bg }) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-14 text-right">{label}</span>
                  <div className={`flex-1 h-6 ${bg} rounded-lg overflow-hidden`}>
                    <div
                      className={`h-full ${color} rounded-lg transition-all duration-500 flex items-center px-2`}
                      style={{ width: stats.totalNotes > 0 ? `${Math.max((count / stats.totalNotes) * 100, count > 0 ? 8 : 0)}%` : '0%' }}
                    >
                      {count > 0 && <span className="text-[10px] font-bold text-white">{count}</span>}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Two columns: Top Tags + Activity */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top Tags */}
            <div className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={14} className="text-violet-500" />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Top Tags</p>
              </div>
              {stats.topTags.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-600 text-center py-4">No tags yet</p>
              ) : (
                <div className="space-y-2.5">
                  {stats.topTags.map(([tag, count], i) => (
                    <div key={tag} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-300 dark:text-gray-600 w-4 text-right">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <Hash size={10} className="text-gray-400" />
                            {tag}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-600">{count}</span>
                        </div>
                        <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-500"
                            style={{ width: `${(count / (stats.topTags[0]?.[1] as number || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity This Week */}
            <div className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={14} className="text-emerald-500" />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">This Week</p>
              </div>
              <div className="flex items-end gap-1.5 h-28">
                {Object.entries(stats.activityByDay).map(([date, count]) => {
                  const d = new Date(date)
                  const dayLabel = dayNames[d.getDay()]
                  const height = maxActivity > 0 ? (count / maxActivity) * 100 : 0
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{count}</span>
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className={`w-full rounded-t-md transition-all duration-500 ${count > 0 ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' : 'bg-gray-100 dark:bg-gray-700'}`}
                          style={{ height: `${Math.max(height, count > 0 ? 10 : 4)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-600 font-medium">{dayLabel}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 text-center">
              <TrendingUp size={18} className="text-primary-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.avgLength}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 font-medium uppercase tracking-wider">Avg Words</p>
            </div>
            <div className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 text-center">
              <Tag size={18} className="text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.topTags.length}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 font-medium uppercase tracking-wider">Unique Tags</p>
            </div>
            <div className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 text-center">
              <Activity size={18} className="text-violet-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.starredCount}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 font-medium uppercase tracking-wider">Starred</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}