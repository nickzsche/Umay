import { AppData, ElectronAPI } from './types'

declare global {
  interface Window {
    electron: ElectronAPI
  }
}

export const loadData = async (): Promise<AppData> => {
  const data = await window.electron.getNotes()
  return {
    version: data.version || '2.0',
    projects: data.projects || [],
    lastUpdated: new Date().toISOString(),
    settings: data.settings || {
      darkMode: false,
      defaultView: 'grid',
      sortBy: 'updated',
      autoSave: true,
      autoSaveInterval: 500,
      aiExportTemplate: 'default',
      showArchived: false,
    },
    dailyNotes: data.dailyNotes || [],
    trash: data.trash || [],
  }
}

export const saveData = async (data: AppData): Promise<boolean> => {
  return await window.electron.saveNotes(data)
}

export const exportData = async (data: AppData): Promise<boolean> => {
  return await window.electron.exportNotes(data)
}

export const exportAiPrompt = async (prompt: string): Promise<boolean> => {
  return await window.electron.exportAiPrompt(prompt)
}

export const createEmptyData = (): AppData => ({
  version: '2.0',
  projects: [],
  lastUpdated: new Date().toISOString(),
  settings: {
    darkMode: false,
    defaultView: 'grid',
    sortBy: 'updated',
    autoSave: true,
    autoSaveInterval: 500,
    aiExportTemplate: 'default',
    showArchived: false,
  },
  dailyNotes: [],
  trash: [],
})

export const searchAllNotes = (data: AppData, query: string) => {
  const results: { note: any; project: any; matches: any[] }[] = []
  const lowerQuery = query.toLowerCase()
  
  data.projects.forEach(project => {
    project.notes.forEach(note => {
      const matches: { field: string; text: string; index: number }[] = []
      
      if (note.title.toLowerCase().includes(lowerQuery)) {
        const idx = note.title.toLowerCase().indexOf(lowerQuery)
        matches.push({ field: 'title', text: note.title, index: idx })
      }
      if (note.content.toLowerCase().includes(lowerQuery)) {
        const idx = note.content.toLowerCase().indexOf(lowerQuery)
        matches.push({ field: 'content', text: note.content.substring(0, 100), index: idx })
      }
      if (note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        const tag = note.tags.find(tag => tag.toLowerCase().includes(lowerQuery))
        matches.push({ field: 'tag', text: tag || '', index: 0 })
      }
      
      if (matches.length > 0) {
        results.push({ note, project, matches })
      }
    })
  })
  
  return results
}

export const generateProjectAiPrompt = (project: any, notes: any[]) => {
  return `# Project: ${project.name}

${project.description ? `Description: ${project.description}\n` : ''}

## Project Overview
- Total notes: ${notes.length}
- Note types: ${notes.map(n => n.type).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
- Tags: ${notes.flatMap(n => n.tags).filter((v, i, a) => a.indexOf(v) === i).join(', ')}

## Notes
${notes.map(note => `### ${note.title}
- Type: ${note.type}
- Status: ${note.status}
- Tags: ${note.tags.join(', ')}

${note.content}

---
`).join('\n')}

## AI Context
This project contains ${notes.length} notes. Please analyze and provide insights based on the above context.

## Instructions
[Your request here]
`
}

export const getDailyNote = (data: AppData) => {
  const today = new Date().toISOString().split('T')[0]
  const dailyNote = data.dailyNotes.find(dn => dn.date === today)
  if (!dailyNote) {
    const newDailyNote = {
      id: `daily-${today}`,
      date: today,
      content: `# Daily Note - ${today}\n\n`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newDailyNote
  }
  return dailyNote
}

export const getRelatedNotes = (note: any, allNotes: any[], limit: number = 5) => {
  const noteWords = new Set(note.content.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3))
  const noteTags = new Set(note.tags.map((t: string) => t.toLowerCase()))
  
  const scored = allNotes
    .filter(n => n.id !== note.id)
    .map(n => {
      const nWords = new Set(n.content.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3))
      const nTags = new Set(n.tags.map((t: string) => t.toLowerCase()))
      
      const wordOverlap = [...noteWords].filter(w => nWords.has(w)).length
      const tagOverlap = [...noteTags].filter(t => nTags.has(t)).length
      
      return {
        note: n,
        score: wordOverlap * 2 + tagOverlap * 10,
      }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
  
  return scored.map(item => item.note.id)
}

export const suggestTags = (content: string, existingTags: string[]) => {
  const commonTags = ['api', 'frontend', 'backend', 'bug', 'feature', 'idea', 'task', 'review', 'meeting', 'design', 'database', 'security', 'performance', 'testing', 'deployment', 'documentation', 'refactor', 'urgent', 'todo', 'done', 'research', 'learning', 'architecture', 'ui', 'ux', 'mobile', 'web', 'desktop', 'cloud', 'devops', 'ai', 'ml', 'analytics']
  
  const lowerContent = content.toLowerCase()
  const suggestions = commonTags
    .filter(tag => !existingTags.includes(tag))
    .filter(tag => lowerContent.includes(tag))
    .slice(0, 5)
  
  return suggestions
}

export const summarizeNote = (content: string) => {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  if (sentences.length <= 2) return content
  
  const firstSentence = sentences[0].trim()
  const lastSentence = sentences[sentences.length - 1].trim()
  
  return `${firstSentence}. ... (${sentences.length} sentences total). Last point: ${lastSentence}.`
}

export const NOTE_TEMPLATES = [
  {
    id: 'api-doc',
    name: 'API Documentation',
    type: 'note' as const,
    title: 'API Endpoint',
    content: '## Endpoint\n\n`POST /api/v1/...`\n\n## Request\n\n```json\n{\n  "key": "value"\n}\n```\n\n## Response\n\n```json\n{\n  "success": true\n}\n```\n\n## Notes\n\n- Rate limit: 100/min\n- Authentication required',
    tags: ['api', 'documentation'],
    icon: '⚡',
  },
  {
    id: 'bug-report',
    name: 'Bug Report',
    type: 'task' as const,
    title: 'Bug: [Description]',
    content: '## Description\n\n[Describe the bug]\n\n## Steps to Reproduce\n\n1. \n2. \n3. \n\n## Expected Behavior\n\n\n## Actual Behavior\n\n\n## Environment\n\n- OS: \n- Browser: \n- Version: \n\n## Screenshots\n\n',
    tags: ['bug', 'urgent'],
    icon: '🐛',
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    type: 'note' as const,
    title: 'Meeting: [Topic]',
    content: '## Attendees\n\n- \n\n## Agenda\n\n1. \n2. \n3. \n\n## Discussion\n\n\n## Action Items\n\n- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3\n\n## Next Meeting\n\n',
    tags: ['meeting', 'action-items'],
    icon: '📅',
  },
  {
    id: 'daily-journal',
    name: 'Daily Journal',
    type: 'note' as const,
    title: `Daily Journal - ${new Date().toLocaleDateString()}`,
    content: '## Today\'s Goals\n\n1. \n2. \n3. \n\n## Accomplishments\n\n\n## Challenges\n\n\n## Learnings\n\n\n## Tomorrow\'s Plan\n\n',
    tags: ['daily', 'journal'],
    icon: '📔',
  },
  {
    id: 'feature-spec',
    name: 'Feature Specification',
    type: 'note' as const,
    title: 'Feature: [Name]',
    content: '## Overview\n\n[Describe the feature]\n\n## Requirements\n\n### Must Have\n\n- [ ] \n- [ ] \n\n### Nice to Have\n\n- [ ] \n- [ ] \n\n## Technical Details\n\n\n## UI/UX\n\n\n## Acceptance Criteria\n\n- [ ] \n- [ ] \n\n## Timeline\n\n',
    tags: ['feature', 'spec'],
    icon: '✨',
  },
]
