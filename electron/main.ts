import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 18 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  })

  // Harden navigation: never open new windows; route external links to the OS browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const allowed = isDev ? 'http://localhost:5173' : 'file://'
    if (!url.startsWith(allowed)) {
      event.preventDefault()
      if (url.startsWith('http://') || url.startsWith('https://')) shell.openExternal(url)
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC Handlers
const getNotesPath = () => {
  const notesPath = path.join(app.getPath('documents'), 'AI-Notes')
  if (!fs.existsSync(notesPath)) {
    fs.mkdirSync(notesPath, { recursive: true })
  }
  return path.join(notesPath, 'notes.json')
}

ipcMain.handle('get-notes', async () => {
  const notesPath = getNotesPath()
  try {
    if (fs.existsSync(notesPath)) {
      const data = fs.readFileSync(notesPath, 'utf-8')
      return JSON.parse(data)
    }
    return { version: '1.0', projects: [] }
  } catch (error) {
    console.error('Error reading notes:', error)
    return { version: '1.0', projects: [] }
  }
})

ipcMain.handle('save-notes', async (_, notes: unknown) => {
  const notesPath = getNotesPath()
  try {
    fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error saving notes:', error)
    return false
  }
})

ipcMain.handle('export-notes', async (_, notes: unknown) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: 'ai-notes-export.json',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  })
  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, JSON.stringify(notes, null, 2), 'utf-8')
    return true
  }
  return false
})

ipcMain.handle('export-ai-prompt', async (_, prompt: string) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: 'ai-prompt.txt',
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
  })
  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, prompt, 'utf-8')
    return true
  }
  return false
})
