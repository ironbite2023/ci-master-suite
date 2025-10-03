/**
 * Storage Utilities for Guided Tools
 * Handles saving/loading tool sessions
 */

import { ToolSession } from '@/types/guided-tools'

const STORAGE_PREFIX = 'guided_tool_'

/**
 * Save session to localStorage
 */
export const saveToLocalStorage = (toolId: string, data: Record<string, unknown>): void => {
  try {
    const key = `${STORAGE_PREFIX}${toolId}`
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * Load session from localStorage
 */
export const loadFromLocalStorage = (toolId: string): Record<string, unknown> | null => {
  try {
    const key = `${STORAGE_PREFIX}${toolId}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return null
  }
}

/**
 * Clear session from localStorage
 */
export const clearFromLocalStorage = (toolId: string): void => {
  try {
    const key = `${STORAGE_PREFIX}${toolId}`
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * Save session to database (Supabase)
 */
export const saveSessionToDatabase = async (
  session: Partial<ToolSession>
): Promise<boolean> => {
  try {
    // This will be implemented when we integrate with Supabase
    // For now, just return true
    console.log('Saving session to database:', session)
    return true
  } catch (error) {
    console.error('Error saving to database:', error)
    return false
  }
}

/**
 * Load session from database (Supabase)
 */
export const loadSessionFromDatabase = async (
  userId: string,
  toolId: string
): Promise<ToolSession | null> => {
  try {
    // This will be implemented when we integrate with Supabase
    // For now, just return null
    console.log('Loading session from database:', userId, toolId)
    return null
  } catch (error) {
    console.error('Error loading from database:', error)
    return null
  }
}

/**
 * Get all saved sessions for a user
 */
export const getUserSessions = async (userId: string): Promise<ToolSession[]> => {
  try {
    // This will be implemented when we integrate with Supabase
    console.log('Getting user sessions:', userId)
    return []
  } catch (error) {
    console.error('Error getting user sessions:', error)
    return []
  }
}

/**
 * Delete a session
 */
export const deleteSession = async (sessionId: string): Promise<boolean> => {
  try {
    // This will be implemented when we integrate with Supabase
    console.log('Deleting session:', sessionId)
    return true
  } catch (error) {
    console.error('Error deleting session:', error)
    return false
  }
}

/**
 * Auto-save with debouncing
 */
export const createAutoSave = (
  saveFunction: (data: Record<string, unknown>) => void,
  delay: number = 2000
) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (data: Record<string, unknown>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      saveFunction(data)
      timeoutId = null
    }, delay)
  }
}

/**
 * Export session as JSON file
 */
export const exportSessionAsJson = (toolId: string, data: Record<string, unknown>, filename?: string): void => {
  try {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `${toolId}_${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (_error) {
    console.error('Error exporting session:', _error)
  }
}

/**
 * Import session from JSON file
 */
export const importSessionFromJson = (file: File): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
    
    reader.readAsText(file)
  })
}
