import type { DOEExperiment, DOEResult, CatapultSettings } from '@/types/catapult'
import { DOE_LEVELS } from '@/types/catapult'

// ============================================================================
// DOE EXPERIMENT GENERATION
// ============================================================================

/**
 * Generate all 8 factorial experiments for 2^3 design
 * Tests all combinations of Low/High levels for 3 factors (Angle, Force, Weight)
 */
export function generateDOEExperiments(): DOEExperiment[] {
  const experiments: DOEExperiment[] = []
  
  // 2^3 = 8 combinations (full factorial design)
  const factorialCombinations = [
    { angle: 'low', force: 'low', weight: 'low' },
    { angle: 'high', force: 'low', weight: 'low' },
    { angle: 'low', force: 'high', weight: 'low' },
    { angle: 'high', force: 'high', weight: 'low' },
    { angle: 'low', force: 'low', weight: 'high' },
    { angle: 'high', force: 'low', weight: 'high' },
    { angle: 'low', force: 'high', weight: 'high' },
    { angle: 'high', force: 'high', weight: 'high' }
  ] as const
  
  factorialCombinations.forEach((levels, index) => {
    experiments.push({
      runNumber: index + 1,
      angle: levels.angle,
      force: levels.force,
      weight: levels.weight,
      angleValue: DOE_LEVELS.angle[levels.angle],
      forceValue: DOE_LEVELS.force[levels.force],
      weightValue: DOE_LEVELS.weight[levels.weight],
      completed: false,
      result: undefined
    })
  })
  
  return experiments
}

// ============================================================================
// EXPERIMENT NAVIGATION
// ============================================================================

/**
 * Get the next incomplete experiment
 * Returns null if all experiments are complete
 */
export function getNextIncompleteExperiment(
  experiments: DOEExperiment[]
): DOEExperiment | null {
  return experiments.find(exp => !exp.completed) || null
}

/**
 * Get experiment by run number
 */
export function getExperimentByNumber(
  experiments: DOEExperiment[],
  runNumber: number
): DOEExperiment | null {
  return experiments.find(exp => exp.runNumber === runNumber) || null
}

/**
 * Get all completed experiments
 */
export function getCompletedExperiments(
  experiments: DOEExperiment[]
): DOEExperiment[] {
  return experiments.filter(exp => exp.completed && exp.result)
}

/**
 * Get incomplete experiments
 */
export function getIncompleteExperiments(
  experiments: DOEExperiment[]
): DOEExperiment[] {
  return experiments.filter(exp => !exp.completed)
}

// ============================================================================
// EXPERIMENT STATUS
// ============================================================================

/**
 * Check if all experiments are complete
 */
export function isExperimentSetComplete(experiments: DOEExperiment[]): boolean {
  return experiments.length === 8 && experiments.every(exp => exp.completed)
}

/**
 * Get completion percentage (0-100)
 */
export function getCompletionPercentage(experiments: DOEExperiment[]): number {
  const completed = experiments.filter(exp => exp.completed).length
  return Math.round((completed / 8) * 100)
}

/**
 * Get experiment count summary
 */
export function getExperimentSummary(experiments: DOEExperiment[]): {
  total: number
  completed: number
  remaining: number
  percentage: number
} {
  const total = 8
  const completed = experiments.filter(exp => exp.completed).length
  const remaining = total - completed
  const percentage = getCompletionPercentage(experiments)
  
  return { total, completed, remaining, percentage }
}

// ============================================================================
// EXPERIMENT SETTINGS
// ============================================================================

/**
 * Load specific experiment settings as catapult configuration
 */
export function loadExperimentSettings(experiment: DOEExperiment): CatapultSettings {
  return {
    angle: experiment.angleValue,
    force: experiment.forceValue,
    weight: experiment.weightValue
  }
}

/**
 * Convert settings back to DOE levels (Low/High)
 */
export function settingsToDOELevels(settings: CatapultSettings): {
  angle: 'low' | 'high'
  force: 'low' | 'high'
  weight: 'low' | 'high'
} {
  return {
    angle: settings.angle === DOE_LEVELS.angle.low ? 'low' : 'high',
    force: settings.force === DOE_LEVELS.force.low ? 'low' : 'high',
    weight: settings.weight === DOE_LEVELS.weight.low ? 'low' : 'high'
  }
}

/**
 * Find experiment matching given settings
 */
export function findExperimentBySettings(
  experiments: DOEExperiment[],
  settings: CatapultSettings
): DOEExperiment | null {
  const levels = settingsToDOELevels(settings)
  
  return experiments.find(
    exp =>
      exp.angle === levels.angle &&
      exp.force === levels.force &&
      exp.weight === levels.weight
  ) || null
}

// ============================================================================
// EXPERIMENT RESULTS
// ============================================================================

/**
 * Save result to a specific experiment
 * Returns updated experiments array
 */
export function saveExperimentResult(
  experiments: DOEExperiment[],
  runNumber: number,
  result: DOEResult
): DOEExperiment[] {
  return experiments.map(exp =>
    exp.runNumber === runNumber
      ? { ...exp, completed: true, result }
      : exp
  )
}

/**
 * Update experiment result (for re-runs)
 */
export function updateExperimentResult(
  experiments: DOEExperiment[],
  runNumber: number,
  result: DOEResult
): DOEExperiment[] {
  return experiments.map(exp =>
    exp.runNumber === runNumber
      ? { ...exp, result }
      : exp
  )
}

/**
 * Mark experiment as incomplete (for re-runs)
 */
export function markExperimentIncomplete(
  experiments: DOEExperiment[],
  runNumber: number
): DOEExperiment[] {
  return experiments.map(exp =>
    exp.runNumber === runNumber
      ? { ...exp, completed: false, result: undefined }
      : exp
  )
}

// ============================================================================
// EXPERIMENT RESET
// ============================================================================

/**
 * Reset all experiments to incomplete state
 */
export function resetExperiments(experiments: DOEExperiment[]): DOEExperiment[] {
  return experiments.map(exp => ({
    ...exp,
    completed: false,
    result: undefined
  }))
}

/**
 * Reset specific experiment
 */
export function resetExperiment(
  experiments: DOEExperiment[],
  runNumber: number
): DOEExperiment[] {
  return markExperimentIncomplete(experiments, runNumber)
}

/**
 * Clear all results but keep completion status
 * Useful for data export before reset
 */
export function clearResults(experiments: DOEExperiment[]): DOEExperiment[] {
  return experiments.map(exp => ({
    ...exp,
    result: undefined
  }))
}

// ============================================================================
// EXPERIMENT VALIDATION
// ============================================================================

/**
 * Validate experiment result data
 */
export function validateExperimentResult(result: DOEResult): boolean {
  return (
    typeof result.distance === 'number' &&
    result.distance >= 0 &&
    typeof result.accuracy === 'number' &&
    result.accuracy >= 0 &&
    result.accuracy <= 100 &&
    typeof result.score === 'number' &&
    result.score >= 0 &&
    typeof result.timestamp === 'number' &&
    result.timestamp > 0
  )
}

/**
 * Validate entire experiment set
 */
export function validateExperimentSet(experiments: DOEExperiment[]): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Check correct number of experiments
  if (experiments.length !== 8) {
    errors.push(`Expected 8 experiments, found ${experiments.length}`)
  }
  
  // Check for duplicate run numbers
  const runNumbers = experiments.map(exp => exp.runNumber)
  const uniqueRunNumbers = new Set(runNumbers)
  if (uniqueRunNumbers.size !== runNumbers.length) {
    errors.push('Duplicate run numbers detected')
  }
  
  // Check run numbers are 1-8
  const validRunNumbers = runNumbers.every(num => num >= 1 && num <= 8)
  if (!validRunNumbers) {
    errors.push('Run numbers must be between 1 and 8')
  }
  
  // Check all completed experiments have valid results
  experiments.forEach(exp => {
    if (exp.completed && exp.result) {
      if (!validateExperimentResult(exp.result)) {
        errors.push(`Invalid result data for run ${exp.runNumber}`)
      }
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get experiment label (e.g., "Run 1: Low Angle, Low Force, Low Weight")
 */
export function getExperimentLabel(experiment: DOEExperiment): string {
  return `Run ${experiment.runNumber}: ${experiment.angle} Angle, ${experiment.force} Force, ${experiment.weight} Weight`
}

/**
 * Get experiment short label (e.g., "R1: L/L/L")
 */
export function getExperimentShortLabel(experiment: DOEExperiment): string {
  const a = experiment.angle === 'low' ? 'L' : 'H'
  const f = experiment.force === 'low' ? 'L' : 'H'
  const w = experiment.weight === 'low' ? 'L' : 'H'
  return `R${experiment.runNumber}: ${a}/${f}/${w}`
}

/**
 * Sort experiments by various criteria
 */
export function sortExperiments(
  experiments: DOEExperiment[],
  sortBy: 'runNumber' | 'distance' | 'score' | 'completion' = 'runNumber'
): DOEExperiment[] {
  const sorted = [...experiments]
  
  switch (sortBy) {
    case 'runNumber':
      return sorted.sort((a, b) => a.runNumber - b.runNumber)
    
    case 'distance':
      return sorted.sort((a, b) => {
        const distA = a.result?.distance || 0
        const distB = b.result?.distance || 0
        return distB - distA
      })
    
    case 'score':
      return sorted.sort((a, b) => {
        const scoreA = a.result?.score || 0
        const scoreB = b.result?.score || 0
        return scoreB - scoreA
      })
    
    case 'completion':
      return sorted.sort((a, b) => {
        if (a.completed === b.completed) return a.runNumber - b.runNumber
        return a.completed ? -1 : 1
      })
    
    default:
      return sorted
  }
}

/**
 * Export experiments to CSV format
 */
export function exportToCSV(experiments: DOEExperiment[]): string {
  const header = 'Run,Angle,Force,Weight,Distance,Accuracy,Score,Completed'
  const rows = experiments.map(exp => 
    `${exp.runNumber},${exp.angle},${exp.force},${exp.weight},` +
    `${exp.result?.distance || ''},${exp.result?.accuracy || ''},` +
    `${exp.result?.score || ''},${exp.completed ? 'Yes' : 'No'}`
  )
  
  return [header, ...rows].join('\n')
}

/**
 * Calculate average result for completed experiments
 */
export function calculateAverageResults(experiments: DOEExperiment[]): {
  avgDistance: number
  avgAccuracy: number
  avgScore: number
  count: number
} {
  const completed = getCompletedExperiments(experiments)
  const count = completed.length
  
  if (count === 0) {
    return { avgDistance: 0, avgAccuracy: 0, avgScore: 0, count: 0 }
  }
  
  const totals = completed.reduce(
    (acc, exp) => ({
      distance: acc.distance + (exp.result?.distance || 0),
      accuracy: acc.accuracy + (exp.result?.accuracy || 0),
      score: acc.score + (exp.result?.score || 0)
    }),
    { distance: 0, accuracy: 0, score: 0 }
  )
  
  return {
    avgDistance: totals.distance / count,
    avgAccuracy: totals.accuracy / count,
    avgScore: totals.score / count,
    count
  }
}
