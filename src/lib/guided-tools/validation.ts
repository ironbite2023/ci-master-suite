/**
 * Validation Utilities for Guided Tools
 */

import { ValidationResult, QuestionConfiguration, StepConfiguration } from '@/types/guided-tools'

/**
 * Validate a single question answer
 */
export const validateQuestion = (
  question: QuestionConfiguration,
  value: unknown,
  allData?: Record<string, unknown>
): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  // Guard: Check if validation rules exist
  if (!question.validation || !Array.isArray(question.validation)) {
    return { isValid: true, errors, warnings }
  }

  for (const rule of question.validation) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(rule.errorMessage)
        }
        break

      case 'min':
        if (typeof value === 'number' && value < (rule.value as number)) {
          errors.push(rule.errorMessage)
        } else if (typeof value === 'string' && value.length < (rule.value as number)) {
          errors.push(rule.errorMessage)
        }
        break

      case 'max':
        if (typeof value === 'number' && value > (rule.value as number)) {
          errors.push(rule.errorMessage)
        } else if (typeof value === 'string' && value.length > (rule.value as number)) {
          errors.push(rule.errorMessage)
        }
        break

      case 'pattern':
        if (typeof value === 'string' && rule.value) {
          const regex = new RegExp(rule.value as string)
          if (!regex.test(value)) {
            errors.push(rule.errorMessage)
          }
        }
        break

      case 'custom':
        if (rule.validationFunction && allData) {
          const isValid = rule.validationFunction(value, allData)
          if (!isValid) {
            errors.push(rule.errorMessage)
          }
        }
        break
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

/**
 * Validate all questions in a step
 */
export const validateStep = (
  step: StepConfiguration,
  stepData: Record<string, unknown>,
  allData: Record<string, unknown>
): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate required questions
  for (const questionId of step.validation.requiredQuestions) {
    const question = step.questions.find(q => q.id === questionId)
    if (!question) continue

    const value = stepData[questionId]
    const result = validateQuestion(question, value, allData)

    if (!result.isValid && result.errors) {
      errors.push(...result.errors)
    }
    if (result.warnings) {
      warnings.push(...result.warnings)
    }
  }

  // Run custom validation if provided
  if (step.validation.customValidation) {
    const customResult = step.validation.customValidation(stepData)
    if (!customResult.isValid && customResult.errors) {
      errors.push(...customResult.errors)
    }
    if (customResult.warnings) {
      warnings.push(...customResult.warnings)
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

/**
 * Check if conditional logic should show/hide a question
 */
export const evaluateConditionalLogic = (
  condition: { questionId: string; operator: string; value: unknown },
  allData: Record<string, unknown>
): boolean => {
  const { questionId, operator, value } = condition
  const actualValue = allData[questionId]

  switch (operator) {
    case 'equals':
      return actualValue === value
    case 'not-equals':
      return actualValue !== value
    case 'contains':
      return typeof actualValue === 'string' && typeof value === 'string' && actualValue.includes(value)
    case 'greater-than':
      return typeof actualValue === 'number' && typeof value === 'number' && actualValue > value
    case 'less-than':
      return typeof actualValue === 'number' && typeof value === 'number' && actualValue < value
    default:
      return false
  }
}

/**
 * Get visible questions based on conditional logic
 */
export const getVisibleQuestions = (
  questions: QuestionConfiguration[],
  stepData: Record<string, unknown>
): QuestionConfiguration[] => {
  return questions.filter(question => {
    if (!question.conditionalLogic || question.conditionalLogic.length === 0) {
      return true
    }

    // Check if any conditional logic says to show
    return question.conditionalLogic.some(logic => {
      const shouldShow = evaluateConditionalLogic(logic.condition, stepData)
      return logic.action === 'show' ? shouldShow : !shouldShow
    })
  })
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate phone number (basic)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Validate date range
 */
export const isDateInRange = (
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean => {
  if (minDate && date < minDate) return false
  if (maxDate && date > maxDate) return false
  return true
}
