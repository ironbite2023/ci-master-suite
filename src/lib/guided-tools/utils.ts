/**
 * Utility Helper Functions for Guided Tools
 */

import { StepConfiguration, StepStatus } from '@/types/guided-tools'

/**
 * Debounce function for delaying function execution
 */
export const debounce = <T extends (...args: never[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } => {
  let timeoutId: NodeJS.Timeout | null = null

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}

/**
 * Get step status based on current progress
 */
export const getStepStatus = (
  step: StepConfiguration,
  stepIndex: number,
  currentStepIndex: number,
  completedSteps: Set<string>
): StepStatus => {
  if (completedSteps.has(step.id)) return 'completed'
  if (stepIndex === currentStepIndex) return 'current'
  if (stepIndex < currentStepIndex) return 'completed'
  
  // Check dependencies
  if (step.dependencies) {
    const allDepsCompleted = step.dependencies.every(depId => 
      completedSteps.has(depId)
    )
    if (!allDepsCompleted) return 'locked'
  }
  
  return 'upcoming'
}

/**
 * Calculate overall progress percentage
 */
export const calculateProgress = (
  totalSteps: number,
  completedSteps: Set<string>
): number => {
  if (totalSteps === 0) return 0
  return Math.round((completedSteps.size / totalSteps) * 100)
}

/**
 * Format time duration
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`
}

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format date and time for display
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if object is empty
 */
export const isEmpty = (obj: unknown): boolean => {
  if (obj === null || obj === undefined) return true
  if (typeof obj === 'string') return obj.trim().length === 0
  if (Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

/**
 * Merge objects deeply
 */
export const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  const output = { ...target }
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceKey = key as keyof T
      if (isObject(source[sourceKey])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[sourceKey] })
        } else {
          output[sourceKey] = deepMerge(
            target[sourceKey] as Record<string, unknown>,
            source[sourceKey] as Record<string, unknown>
          ) as T[keyof T]
        }
      } else {
        Object.assign(output, { [key]: source[sourceKey] })
      }
    })
  }
  
  return output
}

/**
 * Check if value is an object
 */
const isObject = (item: unknown): boolean => {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Convert snake_case to Title Case
 */
export const snakeToTitle = (text: string): string => {
  return text
    .split('_')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Parse error message from different error types
 */
export const parseErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  if (error && typeof error === 'object' && 'error' in error) {
    return String(error.error)
  }
  return 'An unknown error occurred'
}

/**
 * Safely get nested object property
 */
export const getNestedProperty = (obj: unknown, path: string, defaultValue: unknown = undefined): unknown => {
  const keys = path.split('.')
  let current: unknown = obj
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue
    }
    current = (current as Record<string, unknown>)[key]
  }
  
  return current !== undefined ? current : defaultValue
}

/**
 * Set nested object property
 */
export const setNestedProperty = (obj: Record<string, unknown>, path: string, value: unknown): void => {
  const keys = path.split('.')
  const lastKey = keys.pop()
  
  if (!lastKey) return
  
  let current: Record<string, unknown> = obj
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }
  
  current[lastKey] = value
}

/**
 * Compare two values for equality (deep comparison for objects/arrays)
 */
export const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true
  if (a === null || b === null) return false
  if (typeof a !== typeof b) return false
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => isEqual(item, b[index]))
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const objA = a as Record<string, unknown>
    const objB = b as Record<string, unknown>
    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)
    
    if (keysA.length !== keysB.length) return false
    
    return keysA.every(key => isEqual(objA[key], objB[key]))
  }
  
  return false
}

/**
 * Retry async function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }
  
  throw lastError
}
