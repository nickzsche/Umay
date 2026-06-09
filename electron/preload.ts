import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  getNotes: () => Promise<{ version: string; projects: unknown[] }>
  saveNotes: (notes: unknown) => Promise<boolean>
  exportNotes: (notes: unknown) => Promise<boolean>
  exportAiPrompt: (prompt: string) => Promise<boolean>
}

contextBridge.exposeInMainWorld('electron', {
  getNotes: () => ipcRenderer.invoke('get-notes'),
  saveNotes: (notes: unknown) => ipcRenderer.invoke('save-notes', notes),
  exportNotes: (notes: unknown) => ipcRenderer.invoke('export-notes', notes),
  exportAiPrompt: (prompt: string) => ipcRenderer.invoke('export-ai-prompt', prompt),
} as ElectronAPI)
