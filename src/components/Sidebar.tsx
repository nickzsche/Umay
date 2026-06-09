import { Project } from '../types'
import { Folder, Plus, Trash2, ChevronRight, Layers, Sparkles } from 'lucide-react'

interface SidebarProps {
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (id: string) => void
  onAddProject: () => void
  onDeleteProject: (id: string) => void
  onShowArchive?: () => void
  onShowTrash?: () => void
  onShowDailyNotes?: () => void
  onShowTags?: () => void
  onShowReminders?: () => void
  onShowAi?: () => void
}

export default function Sidebar({
  projects,
  selectedProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject,
  onShowArchive,
  onShowTrash,
  onShowDailyNotes,
  onShowTags,
  onShowReminders,
  onShowAi,
}: SidebarProps) {
  return (
    <div className="w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col shadow-xl shadow-black/5">
      {/* Logo / Title - extra top padding for macOS traffic lights */}
      <div className="pt-10 px-6 pb-4">
        <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-300">AI Notes</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              AI-Readable Note Manager
            </p>
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div className="px-6 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          <Layers size={14} />
          Projects
          <span className="ml-auto bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs font-medium">
            {projects.length}
          </span>
        </div>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {projects.map(project => (
          <div
            key={project.id}
            className={`sidebar-item group ${selectedProjectId === project.id ? 'active' : ''}`}
            onClick={() => onSelectProject(project.id)}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-offset-2 dark:ring-offset-gray-900 transition-shadow"
              style={{ 
                backgroundColor: project.color,
                boxShadow: `0 0 0 2px ${project.color}40`
              }}
            />
            <div className="flex-1 min-w-0">
              <span className="block truncate text-sm font-medium">
                {project.name}
              </span>
              <span className="block text-xs text-gray-400 dark:text-gray-500 truncate">
                {project.notes.length} notes
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Delete this project and all its notes?')) {
                    onDeleteProject(project.id)
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <ChevronRight size={14} className="text-gray-400" />
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="px-4 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <Folder size={20} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
              No projects yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Create your first project
            </p>
          </div>
        )}
      </div>

      {/* Add Project Button */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button onClick={onAddProject} className="btn-primary w-full justify-center shadow-lg shadow-primary-500/20">
          <Plus size={16} />
          New Project
        </button>
      </div>
    </div>
  )
}
