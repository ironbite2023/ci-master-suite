import type { DOEExperiment, DOEAnalysis, CatapultSettings } from '@/types/catapult'
import { DOE_LEVELS } from '@/types/catapult'
import { getCompletedExperiments } from './doeEngine'

// ============================================================================
// MAIN EFFECTS CALCULATION
// ============================================================================

/**
 * Calculate main effects for each factor
 * Main Effect = (Average of High Levels) - (Average of Low Levels)
 * 
 * This shows how much each factor individually affects the response (distance)
 */
export function calculateMainEffects(experiments: DOEExperiment[]): {
  angle: number
  force: number
  weight: number
} {
  const completed = getCompletedExperiments(experiments)
  
  if (completed.length < 8) {
    throw new Error('All 8 experiments must be completed for main effects analysis')
  }
  
  // Calculate average distance for high and low levels of each factor
  
  // ANGLE effect
  const angleHigh = completed
    .filter(exp => exp.angle === 'high')
    .reduce((sum, exp) => sum + (exp.result?.distance || 0), 0) / 4
  
  const angleLow = completed
    .filter(exp => exp.angle === 'low')
    .reduce((sum, exp) => sum + (exp.result?.distance || 0), 0) / 4
  
  // FORCE effect
  const forceHigh = completed
    .filter(exp => exp.force === 'high')
    .reduce((sum, exp) => sum + (exp.result?.distance || 0), 0) / 4
  
  const forceLow = completed
    .filter(exp => exp.force === 'low')
    .reduce((sum, exp) => sum + (exp.result?.distance || 0), 0) / 4
  
  // WEIGHT effect
  const weightHigh = completed
    .filter(exp => exp.weight === 'high')
    .reduce((sum, exp) => sum + (exp.result?.distance || 0), 0) / 4
  
  const weightLow = completed
    .filter(exp => exp.weight === 'low')
    .reduce((sum, exp) => sum + (exp.result?.distance || 0), 0) / 4
  
  return {
    angle: angleHigh - angleLow,
    force: forceHigh - forceLow,
    weight: weightHigh - weightLow
  }
}

// ============================================================================
// INTERACTION EFFECTS CALCULATION
// ============================================================================

/**
 * Calculate 2-factor interaction effects
 * AB Interaction = 0.5 * [(A+B+) + (A-B-) - (A+B-) - (A-B+)]
 * 
 * This shows if two factors work together (synergistic) or against each other (antagonistic)
 */
export function calculateInteractions(experiments: DOEExperiment[]): {
  angleForce: number
  angleWeight: number
  forceWeight: number
} {
  const completed = getCompletedExperiments(experiments)
  
  if (completed.length < 8) {
    throw new Error('All 8 experiments must be completed for interaction analysis')
  }
  
  // Helper to get experiment distance by levels
  const getDist = (a: 'low' | 'high', f: 'low' | 'high', w: 'low' | 'high'): number => {
    const exp = completed.find(
      e => e.angle === a && e.force === f && e.weight === w
    )
    return exp?.result?.distance || 0
  }
  
  // Angle × Force interaction
  const angleForce = 0.5 * (
    getDist('high', 'high', 'low') + getDist('low', 'low', 'low') -
    getDist('high', 'low', 'low') - getDist('low', 'high', 'low')
  )
  
  // Angle × Weight interaction  
  const angleWeight = 0.5 * (
    getDist('high', 'low', 'high') + getDist('low', 'low', 'low') -
    getDist('high', 'low', 'low') - getDist('low', 'low', 'high')
  )
  
  // Force × Weight interaction
  const forceWeight = 0.5 * (
    getDist('low', 'high', 'high') + getDist('low', 'low', 'low') -
    getDist('low', 'high', 'low') - getDist('low', 'low', 'high')
  )
  
  return { angleForce, angleWeight, forceWeight }
}

// ============================================================================
// OPTIMAL SETTINGS
// ============================================================================

/**
 * Find optimal settings based on main effects
 * Choose HIGH if main effect is positive, LOW if negative
 */
export function findOptimalSettings(mainEffects: {
  angle: number
  force: number
  weight: number
}): CatapultSettings {
  return {
    angle: mainEffects.angle > 0 ? DOE_LEVELS.angle.high : DOE_LEVELS.angle.low,
    force: mainEffects.force > 0 ? DOE_LEVELS.force.high : DOE_LEVELS.force.low,
    weight: mainEffects.weight > 0 ? DOE_LEVELS.weight.high : DOE_LEVELS.weight.low
  }
}

/**
 * Predict response (distance) for any setting combination
 * Using DOE regression model
 */
export function predictResponse(
  settings: CatapultSettings,
  experiments: DOEExperiment[]
): number {
  const completed = getCompletedExperiments(experiments)
  
  if (completed.length < 8) {
    throw new Error('All 8 experiments must be completed for prediction')
  }
  
  // Calculate grand average (overall mean)
  const avgDistance = completed.reduce(
    (sum, exp) => sum + (exp.result?.distance || 0),
    0
  ) / 8
  
  const mainEffects = calculateMainEffects(experiments)
  
  // Build prediction using regression model
  // Y = μ + (Aeffect/2 * A) + (Beffect/2 * B) + (Ceffect/2 * C)
  // where A, B, C are -1 for low, +1 for high
  
  let prediction = avgDistance
  
  // Add main effects (scaled by ±0.5 for high/low)
  prediction += (settings.angle === DOE_LEVELS.angle.high ? 1 : -1) * (mainEffects.angle / 2)
  prediction += (settings.force === DOE_LEVELS.force.high ? 1 : -1) * (mainEffects.force / 2)
  prediction += (settings.weight === DOE_LEVELS.weight.high ? 1 : -1) * (mainEffects.weight / 2)
  
  return Math.round(prediction * 10) / 10 // Round to 1 decimal
}

// ============================================================================
// INSIGHTS GENERATION
// ============================================================================

/**
 * Generate natural language insights from DOE analysis
 */
export function generateInsights(
  mainEffects: { angle: number; force: number; weight: number },
  interactions: { angleForce: number; angleWeight: number; forceWeight: number },
  experiments: DOEExperiment[]
): string[] {
  const insights: string[] = []
  
  // Rank factors by importance
  const effectsRanked = [
    { name: 'Force', value: Math.abs(mainEffects.force), effect: mainEffects.force },
    { name: 'Angle', value: Math.abs(mainEffects.angle), effect: mainEffects.angle },
    { name: 'Weight', value: Math.abs(mainEffects.weight), effect: mainEffects.weight }
  ].sort((a, b) => b.value - a.value)
  
  // Most important factor
  insights.push(
    `${effectsRanked[0].name} has the strongest impact on distance ` +
    `(${effectsRanked[0].effect > 0 ? '+' : ''}${effectsRanked[0].effect.toFixed(1)}m)`
  )
  
  // Main effect insights
  if (mainEffects.angle > 5) {
    insights.push(`Higher angle significantly improves distance (+${mainEffects.angle.toFixed(1)}m)`)
  } else if (mainEffects.angle < -5) {
    insights.push(`Lower angle performs better (${mainEffects.angle.toFixed(1)}m penalty for high)`)
  }
  
  if (mainEffects.force > 5) {
    insights.push(`Higher force greatly increases distance (+${mainEffects.force.toFixed(1)}m)`)
  } else if (mainEffects.force < -5) {
    insights.push(`Lower force is surprisingly better (${mainEffects.force.toFixed(1)}m penalty for high)`)
  }
  
  if (mainEffects.weight > 5) {
    insights.push(`Heavier projectiles travel farther (+${mainEffects.weight.toFixed(1)}m)`)
  } else if (mainEffects.weight < -5) {
    insights.push(`Lighter projectiles travel farther (${Math.abs(mainEffects.weight).toFixed(1)}m advantage)`)
  }
  
  // Interaction insights
  const significantInteraction = 5 // threshold for "significant"
  
  if (Math.abs(interactions.angleForce) > significantInteraction) {
    const type = interactions.angleForce > 0 ? 'synergistically' : 'antagonistically'
    insights.push(
      `Angle and force work ${type} together ` +
      `(${interactions.angleForce > 0 ? '+' : ''}${interactions.angleForce.toFixed(1)}m interaction)`
    )
  }
  
  if (Math.abs(interactions.angleWeight) > significantInteraction) {
    const type = interactions.angleWeight > 0 ? 'synergistically' : 'antagonistically'
    insights.push(
      `Angle and weight interact ${type} ` +
      `(${interactions.angleWeight > 0 ? '+' : ''}${interactions.angleWeight.toFixed(1)}m interaction)`
    )
  }
  
  if (Math.abs(interactions.forceWeight) > significantInteraction) {
    const type = interactions.forceWeight > 0 ? 'synergistically' : 'antagonistically'
    insights.push(
      `Force and weight show ${type} interaction ` +
      `(${interactions.forceWeight > 0 ? '+' : ''}${interactions.forceWeight.toFixed(1)}m interaction)`
    )
  }
  
  // Optimal settings recommendation
  const optimal = findOptimalSettings(mainEffects)
  const angleLevel = optimal.angle === DOE_LEVELS.angle.high ? 'high' : 'low'
  const forceLevel = optimal.force === DOE_LEVELS.force.high ? 'high' : 'low'
  const weightLevel = optimal.weight === DOE_LEVELS.weight.high ? 'heavy' : 'light'
  
  insights.push(
    `Optimal settings: ${optimal.angle}° angle (${angleLevel}), ` +
    `${optimal.force}N force (${forceLevel}), ` +
    `${optimal.weight} weight (${weightLevel})`
  )
  
  // Predicted performance
  const predicted = predictResponse(optimal, experiments)
  insights.push(`Predicted distance at optimal settings: ${predicted.toFixed(1)}m`)
  
  return insights
}

// ============================================================================
// COMPLETE DOE ANALYSIS
// ============================================================================

/**
 * Perform complete DOE analysis
 * Returns all calculations and insights
 */
export function performDOEAnalysis(experiments: DOEExperiment[]): DOEAnalysis {
  const mainEffects = calculateMainEffects(experiments)
  const interactions = calculateInteractions(experiments)
  const optimalSettings = findOptimalSettings(mainEffects)
  const recommendations = generateInsights(mainEffects, interactions, experiments)
  
  return {
    mainEffects,
    interactions,
    recommendations,
    optimalSettings
  }
}

// ============================================================================
// EFFECT SIGNIFICANCE
// ============================================================================

/**
 * Determine if an effect is statistically significant
 * Using simplified rule: effect > 10% of range
 */
export function isEffectSignificant(
  effect: number,
  experiments: DOEExperiment[]
): boolean {
  const completed = getCompletedExperiments(experiments)
  const distances = completed.map(exp => exp.result?.distance || 0)
  const range = Math.max(...distances) - Math.min(...distances)
  
  return Math.abs(effect) > range * 0.1
}

/**
 * Classify effect magnitude
 */
export function classifyEffect(effect: number): {
  magnitude: 'negligible' | 'small' | 'moderate' | 'large'
  description: string
} {
  const absEffect = Math.abs(effect)
  
  if (absEffect < 5) {
    return { magnitude: 'negligible', description: 'Minimal impact' }
  } else if (absEffect < 15) {
    return { magnitude: 'small', description: 'Minor impact' }
  } else if (absEffect < 30) {
    return { magnitude: 'moderate', description: 'Moderate impact' }
  } else {
    return { magnitude: 'large', description: 'Major impact' }
  }
}

// ============================================================================
// PARETO ANALYSIS
// ============================================================================

/**
 * Perform Pareto analysis of effects
 * Returns factors ordered by importance with cumulative percentage
 */
export function performParetoAnalysis(
  mainEffects: { angle: number; force: number; weight: number },
  interactions: { angleForce: number; angleWeight: number; forceWeight: number }
): Array<{
  factor: string
  effect: number
  absEffect: number
  percentage: number
  cumulative: number
}> {
  // Combine all effects
  const effects = [
    { factor: 'Angle', effect: mainEffects.angle },
    { factor: 'Force', effect: mainEffects.force },
    { factor: 'Weight', effect: mainEffects.weight },
    { factor: 'Angle × Force', effect: interactions.angleForce },
    { factor: 'Angle × Weight', effect: interactions.angleWeight },
    { factor: 'Force × Weight', effect: interactions.forceWeight }
  ]
  
  // Sort by absolute effect (largest first)
  const sorted = effects.map(e => ({
    ...e,
    absEffect: Math.abs(e.effect)
  })).sort((a, b) => b.absEffect - a.absEffect)
  
  // Calculate total and percentages
  const total = sorted.reduce((sum, e) => sum + e.absEffect, 0)
  
  let cumulative = 0
  return sorted.map(e => {
    const percentage = (e.absEffect / total) * 100
    cumulative += percentage
    return {
      ...e,
      percentage: Math.round(percentage * 10) / 10,
      cumulative: Math.round(cumulative * 10) / 10
    }
  })
}

// ============================================================================
// INTERACTION PLOTS DATA
// ============================================================================

/**
 * Generate data for interaction plots
 * Shows if lines are parallel (no interaction) or not (interaction present)
 */
export function generateInteractionPlotData(
  experiments: DOEExperiment[],
  factor1: 'angle' | 'force' | 'weight',
  factor2: 'angle' | 'force' | 'weight'
): {
  lowFactor2: { low: number; high: number }
  highFactor2: { low: number; high: number }
} {
  const completed = getCompletedExperiments(experiments)
  
  // Calculate average distance for each combination
  const calc = (f1: 'low' | 'high', f2: 'low' | 'high') => {
    const filtered = completed.filter(exp => {
      return exp[factor1] === f1 && exp[factor2] === f2
    })
    
    if (filtered.length === 0) return 0
    
    return filtered.reduce((sum, exp) => sum + (exp.result?.distance || 0), 0) / filtered.length
  }
  
  return {
    lowFactor2: {
      low: calc('low', 'low'),
      high: calc('high', 'low')
    },
    highFactor2: {
      low: calc('low', 'high'),
      high: calc('high', 'high')
    }
  }
}

// ============================================================================
// CONFIDENCE & ROBUSTNESS
// ============================================================================

/**
 * Calculate confidence in optimal settings
 * Based on how much better they are than alternatives
 */
export function calculateOptimalConfidence(
  experiments: DOEExperiment[],
  optimalSettings: CatapultSettings
): {
  confidence: 'low' | 'medium' | 'high'
  percentage: number
  reasoning: string
} {
  const completed = getCompletedExperiments(experiments)
  const predicted = predictResponse(optimalSettings, experiments)
  const distances = completed.map(exp => exp.result?.distance || 0)
  const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length
  
  const improvement = ((predicted - avgDistance) / avgDistance) * 100
  
  if (improvement > 20) {
    return {
      confidence: 'high',
      percentage: Math.min(95, 70 + improvement),
      reasoning: `Optimal settings predict ${improvement.toFixed(1)}% improvement over average`
    }
  } else if (improvement > 10) {
    return {
      confidence: 'medium',
      percentage: Math.min(80, 60 + improvement),
      reasoning: `Moderate improvement expected (${improvement.toFixed(1)}%)`
    }
  } else {
    return {
      confidence: 'low',
      percentage: Math.min(70, 50 + improvement),
      reasoning: `Limited improvement expected (${improvement.toFixed(1)}%)`
    }
  }
}

// ============================================================================
// SUMMARY STATISTICS
// ============================================================================

/**
 * Calculate summary statistics for DOE results
 */
export function calculateDOESummary(experiments: DOEExperiment[]): {
  count: number
  mean: number
  median: number
  stdDev: number
  min: number
  max: number
  range: number
} {
  const completed = getCompletedExperiments(experiments)
  const distances = completed.map(exp => exp.result?.distance || 0).sort((a, b) => a - b)
  
  const count = distances.length
  const mean = distances.reduce((sum, d) => sum + d, 0) / count
  const median = distances[Math.floor(count / 2)]
  const min = distances[0]
  const max = distances[count - 1]
  const range = max - min
  
  // Calculate standard deviation
  const squaredDiffs = distances.map(d => Math.pow(d - mean, 2))
  const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / count
  const stdDev = Math.sqrt(variance)
  
  return {
    count,
    mean: Math.round(mean * 10) / 10,
    median: Math.round(median * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    range: Math.round(range * 10) / 10
  }
}
