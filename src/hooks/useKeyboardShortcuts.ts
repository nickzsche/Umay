import { useEffect, useCallback } from 'react'
import { ShortcutMap } from '../types'

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isMac = navigator.platform.includes('Mac')
    const cmd = isMac ? e.metaKey : e.ctrlKey
    const key = e.key.toLowerCase()
    
    const shortcutKey = cmd ? `cmd+${key}` : key
    
    if (shortcuts[shortcutKey]) {
      e.preventDefault()
      shortcuts[shortcutKey]()
    }
    
    if (cmd && e.shiftKey) {
      const shiftKey = `cmd+shift+${key}`
      if (shortcuts[shiftKey]) {
        e.preventDefault()
        shortcuts[shiftKey]()
      }
    }
    
    if (cmd && e.altKey) {
      const altKey = `cmd+alt+${key}`
      if (shortcuts[altKey]) {
        e.preventDefault()
        shortcuts[altKey]()
      }
    }
    
    if (e.key === 'Escape') {
      if (shortcuts['escape']) {
        shortcuts['escape']()
      }
    }
  }, [shortcuts])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
