import { useState } from 'react'
import { AppData, Reminder } from '../types'
import { Bell, Plus, Trash2, X, CheckCircle2, AlertCircle, Calendar, Clock } from 'lucide-react'

interface RemindersPanelProps {
  data: AppData
  isOpen: boolean
  onClose: () => void
  onAddReminder: (noteId: string, reminder: Omit<Reminder, 'id'>) => void
  onCompleteReminder: (reminderId: string) => void
  onDeleteReminder: (reminderId: string) => void
}

export default function RemindersPanel({
  data,
  isOpen,
  onClose,
  onAddReminder,
  onCompleteReminder,
  onDeleteReminder,
}: RemindersPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newMessage, setNewMessage] = useState('')

  const allReminders = data.projects
    .flatMap(p => p.notes.flatMap(n => (n.reminders || []).map(r => ({ ...r, noteTitle: n.title, projectId: p.id }))))

  const overdueReminders = allReminders.filter(r => !r.completed && new Date(r.dueDate) < new Date())
  const upcomingReminders = allReminders.filter(r => !r.completed && new Date(r.dueDate) >= new Date())
  const completedReminders = allReminders.filter(r => r.completed)

  const allNotes = data.projects.flatMap(p => p.notes.map(n => ({ ...n, projectName: p.name })))

  const handleAdd = () => {
    if (!selectedNoteId || !newDueDate || !newMessage.trim()) return
    onAddReminder(selectedNoteId, {
      noteId: selectedNoteId,
      dueDate: newDueDate,
      message: newMessage.trim(),
      completed: false,
    })
    setSelectedNoteId('')
    setNewDueDate('')
    setNewMessage('')
    setShowAddForm(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Bell size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reminders
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                {allReminders.length} total · {overdueReminders.length} overdue
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary text-sm shadow-lg shadow-primary-500/20"
            >
              <Plus size={14} />
              Add
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Add Reminder Form */}
        {showAddForm && (
          <div className="p-4 mx-6 mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center gap-2">
              <Plus size={14} className="text-primary-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Reminder</span>
            </div>
            <select
              value={selectedNoteId}
              onChange={(e) => setSelectedNoteId(e.target.value)}
              className="input-field w-full text-sm"
            >
              <option value="">Select a note...</option>
              {allNotes.map(n => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
            </select>
            <div className="flex items-center gap-3">
              <input
                type="datetime-local"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="input-field flex-1 text-sm"
              />
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Reminder message..."
              className="input-field w-full text-sm"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!selectedNoteId || !newDueDate || !newMessage.trim()}
                className="btn-primary text-sm shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Reminder
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overdue */}
          {overdueReminders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={14} className="text-red-500" />
                <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  Overdue
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium">
                  {overdueReminders.length}
                </span>
              </div>
              <div className="space-y-2">
                {overdueReminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3 group"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => onCompleteReminder(reminder.id)}
                      className="mt-1 w-4 h-4 rounded border-red-300 dark:border-red-600 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        {reminder.message}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1.5">
                        <Clock size={10} />
                        {formatDate(reminder.dueDate)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Note: {reminder.noteTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteReminder(reminder.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcomingReminders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-primary-500" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Upcoming
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium">
                  {upcomingReminders.length}
                </span>
              </div>
              <div className="space-y-2">
                {upcomingReminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 flex items-start gap-3 group hover:shadow-md hover:shadow-primary-500/5 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => onCompleteReminder(reminder.id)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {reminder.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                        <Clock size={10} />
                        {formatDate(reminder.dueDate)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Note: {reminder.noteTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteReminder(reminder.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completedReminders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Completed
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium">
                  {completedReminders.length}
                </span>
              </div>
              <div className="space-y-2">
                {completedReminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/30 rounded-xl p-4 flex items-start gap-3 group"
                  >
                    <input
                      type="checkbox"
                      checked
                      onChange={() => onCompleteReminder(reminder.id)}
                      className="mt-1 w-4 h-4 rounded border-emerald-300 dark:border-emerald-600 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-400 dark:text-gray-500 line-through">
                        {reminder.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 flex items-center gap-1.5">
                        <Clock size={10} />
                        {new Date(reminder.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                        Note: {reminder.noteTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteReminder(reminder.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allReminders.length === 0 && !showAddForm && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
                <Bell size={24} className="text-amber-500 dark:text-amber-400" />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
                No reminders yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                Add a reminder to stay on top of your notes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}