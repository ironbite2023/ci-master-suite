/**
 * Analytics Utilities for Guided Tools
 * Track user interactions and tool usage
 */

import { AnalyticsEvent } from '@/types/guided-tools'

/**
 * Track an analytics event
 */
export const trackEvent = async (event: AnalyticsEvent): Promise<void> => {
  try {
    // Log to console for now
    console.log('Analytics Event:', event)
    
    // TODO: Send to analytics service (e.g., Supabase, Google Analytics)
    // await sendToAnalyticsService(event)
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

/**
 * Track step viewed
 */
export const trackStepViewed = (
  userId: string,
  toolId: string,
  stepId: string
): void => {
  trackEvent({
    userId,
    toolId,
    stepId,
    eventType: 'step_viewed',
    timestamp: new Date().toISOString()
  })
}

/**
 * Track hint viewed
 */
export const trackHintViewed = (
  userId: string,
  toolId: string,
  stepId: string,
  hintId: string
): void => {
  trackEvent({
    userId,
    toolId,
    stepId,
    eventType: 'hint_viewed',
    eventData: { hintId },
    timestamp: new Date().toISOString()
  })
}

/**
 * Track example used
 */
export const trackExampleUsed = (
  userId: string,
  toolId: string,
  stepId: string,
  exampleId: string
): void => {
  trackEvent({
    userId,
    toolId,
    stepId,
    eventType: 'example_used',
    eventData: { exampleId },
    timestamp: new Date().toISOString()
  })
}

/**
 * Track step completed
 */
export const trackStepCompleted = (
  userId: string,
  toolId: string,
  stepId: string,
  timeSpent: number
): void => {
  trackEvent({
    userId,
    toolId,
    stepId,
    eventType: 'step_completed',
    eventData: { timeSpent },
    timestamp: new Date().toISOString()
  })
}

/**
 * Track validation failed
 */
export const trackValidationFailed = (
  userId: string,
  toolId: string,
  stepId: string,
  errors: string[]
): void => {
  trackEvent({
    userId,
    toolId,
    stepId,
    eventType: 'validation_failed',
    eventData: { errors },
    timestamp: new Date().toISOString()
  })
}

/**
 * Calculate time spent on tool
 */
export const calculateTimeSpent = (startTime: Date): number => {
  const now = new Date()
  return Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60) // minutes
}

/**
 * Get analytics summary for a tool
 */
export const getToolAnalyticsSummary = async (
  toolId: string
): Promise<{
  totalStarts: number
  totalCompletions: number
  averageTime: number
  completionRate: number
  mostViewedHints: string[]
  mostUsedExamples: string[]
  commonValidationErrors: string[]
} | null> => {
  try {
    // TODO: Fetch from analytics service
    console.log('Getting analytics for:', toolId)
    return {
      totalStarts: 0,
      totalCompletions: 0,
      averageTime: 0,
      completionRate: 0,
      mostViewedHints: [],
      mostUsedExamples: [],
      commonValidationErrors: []
    }
  } catch (error) {
    console.error('Error getting analytics:', error)
    return null
  }
}
