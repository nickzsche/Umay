import { useState, useMemo, useCallback } from 'react'
import { AppData, DailyNote } from '../types'
import { X, Calendar, Plus, ChevronLeft, ChevronRight, FileText, Clock } from 'lucide-react'

interface DailyNotesProps {
  data: AppData
  onUpdateDailyNote: (id: string, content: string) => void
  isOpen: boolean
  onClose: () => void
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export default function DailyNotes({
  data,
  onUpdateDailyNote,
  isOpen,
  onClose,
}: DailyNotesProps) {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(today))
  const [editContent, setEditContent] = useState<Record<string, string>>({})

  const dailyNotesMap = useMemo(() => {
    const map: Record<string, DailyNote> = {}
    data.dailyNotes.forEach(dn => {
      map[dn.date] = dn
    })
    return map
  }, [data.dailyNotes])

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const todayStr = formatDate(today)

  const selectedNote = dailyNotesMap[selectedDate]
  const displayContent = editContent[selectedDate] ?? selectedNote?.content ?? ''

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handleCreateToday = useCallback(() => {
    setSelectedDate(todayStr)
  }, [todayStr])

  const handleBlur = useCallback(() => {
    if (selectedNote && editContent[selectedDate] !== undefined) {
      onUpdateDailyNote(selectedNote.id, editContent[selectedDate])
    }
  }, [selectedNote, editContent, selectedDate, onUpdateDailyNote])

  if (!isOpen) return null

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 h-[80vh] glass-panel rounded-2xl shadow-2xl overflow-hidden flex animate-in fade-in zoom-in-95 duration-200">
        {/* Calendar Sidebar */}
        <div className="w-72 border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col bg-white/50 dark:bg-gray-900/50">
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500">
                <X size={16} />
              </button>
              <div className="flex items-center gap-1">
                <button onClick={handlePrevMonth} className="btn-ghost p-1.5 rounded-lg">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[120px] text-center">
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <button onClick={handleNextMonth} className="btn-ghost p-1.5 rounded-lg">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DAYS_OF_WEEK.map(day => (
                <div
                  key={day}
                  className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 text-center py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="aspect-square" />
                }

                const dateStr = formatDate(new Date(viewYear, viewMonth, day))
                const isToday = dateStr === todayStr
                const isSelected = dateStr === selectedDate
                const hasNote = !!dailyNotesMap[dateStr]

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : isToday
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {day}
                    {hasNote && (
                      <div
                        className={`w-1 h-1 rounded-full mt-0.5 ${
                          isSelected ? 'bg-white' : 'bg-primary-500'
                        }`}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Create Today Button */}
          <div className="p-4">
            <button
              onClick={handleCreateToday}
              className="btn-primary w-full justify-center text-sm"
            >
              <Plus size={14} />
              Create Today&apos;s Note
            </button>
          </div>

          {/* Recent Notes */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 mb-2">
              Recent Notes
            </p>
            <div className="space-y-1">
              {data.dailyNotes
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 10)
                .map(dn => (
                  <button
                    key={dn.id}
                    onClick={() => setSelectedDate(dn.date)}
                    className={`w-full text-left sidebar-item !py-2 !px-3 text-xs ${
                      selectedDate === dn.date ? 'active' : ''
                    }`}
                  >
                    <FileText size={12} className="text-primary-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">
                        {new Date(dn.date + 'T00:00:00').toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-600 truncate">
                        {dn.content.slice(0, 40) || 'Empty note'}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Calendar size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <Clock size={10} />
                <span>
                  {selectedNote
                    ? `Last edited ${new Date(selectedNote.updatedAt).toLocaleTimeString()}`
                    : 'No note yet'}
                </span>
              </div>
            </div>
          </div>

          {/* Editor */}
          <textarea
            className="flex-1 p-6 bg-white dark:bg-gray-800/40 text-sm text-gray-700 dark:text-gray-300 resize-none focus:outline-none leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-600"
            value={displayContent}
            onChange={e => setEditContent(prev => ({ ...prev, [selectedDate]: e.target.value }))}
            onBlur={handleBlur}
            placeholder={
              selectedNote
                ? 'Write your daily note...'
                : 'Click "Create Today\'s Note" to start writing...'
            }
            readOnly={!selectedNote}
          />

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50">
            <span className="text-xs text-gray-400 dark:text-gray-600">
              {displayContent.length} characters
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-600">
              {displayContent.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}