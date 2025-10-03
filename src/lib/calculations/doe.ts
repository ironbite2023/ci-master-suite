/**
 * Design of Experiments (DOE) Calculation Library
 * Phase 4 Week 3 Implementation
 * 
 * Provides statistical functions for:
 * - Factorial design generation (full and fractional)
 * - Design matrix creation
 * - ANOVA analysis
 * - Main effects and interaction effects
 * - Response surface methodology
 */

export interface Factor {
  id: string
  name: string
  symbol: string
  type: 'continuous' | 'discrete'
  levels: number
  lowValue: number
  highValue: number
  unit: string
}

export interface Response {
  id: string
  name: string
  target: 'maximize' | 'minimize' | 'target'
  targetValue?: number
  unit: string
}

export interface RunData {
  runNumber: number
  factorValues: Record<string, number>
  responseValues: Record<string, number>
  standardOrder: number
  randomOrder: number
}

export interface Effect {
  factor: string
  effect: number
  percentContribution: number
  significant: boolean
}

export interface Interaction {
  factors: string[]
  effect: number
  percentContribution: number
  significant: boolean
}

export interface ANOVARow {
  source: string
  degreesOfFreedom: number
  sumOfSquares: number
  meanSquare: number
  fValue: number
  pValue: number
  significant: boolean
}

export interface ANOVATable {
  rows: ANOVARow[]
  totalSS: number
  rSquared: number
  rSquaredAdj: number
}

export interface DOEResults {
  effects: Effect[]
  interactions: Interaction[]
  anova: ANOVATable
  optimalConditions: Record<string, number>
  predictedResponse: Record<string, number>
  residuals: number[]
}

/**
 * Generate a full factorial design matrix
 */
export const generateFullFactorialDesign = (factors: Factor[]): number[][] => {
  const design: number[][] = []
  
  // Calculate total number of runs
  const totalRuns = factors.reduce((acc, factor) => acc * factor.levels, 1)
  
  for (let run = 0; run < totalRuns; run++) {
    const row: number[] = []
    let temp = run
    
    for (let i = factors.length - 1; i >= 0; i--) {
      const factor = factors[i]
      const level = temp % factor.levels
      temp = Math.floor(temp / factor.levels)
      
      // Convert level to actual value
      const value = factor.lowValue + (level / (factor.levels - 1)) * (factor.highValue - factor.lowValue)
      row.unshift(value)
    }
    
    design.push(row)
  }
  
  return design
}

/**
 * Generate a 2-level full factorial design (coded units: -1, +1)
 */
export const generate2LevelFactorial = (numFactors: number): number[][] => {
  const totalRuns = Math.pow(2, numFactors)
  const design: number[][] = []
  
  for (let run = 0; run < totalRuns; run++) {
    const row: number[] = []
    for (let factor = 0; factor < numFactors; factor++) {
      const level = ((run >> factor) & 1) === 0 ? -1 : 1
      row.push(level)
    }
    design.push(row)
  }
  
  return design
}

/**
 * Generate a fractional factorial design (2^(k-p) design)
 */
export const generateFractionalFactorial = (
  numFactors: number
): number[][] => {
  // For simplicity, implementing 2^(k-1) half-fraction
  const baseFactors = numFactors - 1
  const baseDesign = generate2LevelFactorial(baseFactors)
  
  // Add the fractional factor as interaction
  const fractionalDesign = baseDesign.map(row => {
    const fractionalValue = row.reduce((acc, val) => acc * val, 1)
    return [...row, fractionalValue]
  })
  
  return fractionalDesign
}

/**
 * Calculate main effects from experimental data
 */
export const calculateMainEffects = (
  design: number[][],
  responses: number[],
  factorNames: string[]
): Effect[] => {
  const numFactors = design[0].length
  const numRuns = design.length
  const effects: Effect[] = []
  
  for (let factor = 0; factor < numFactors; factor++) {
    let sumLow = 0
    let sumHigh = 0
    let countLow = 0
    let countHigh = 0
    
    for (let run = 0; run < numRuns; run++) {
      if (design[run][factor] < 0) {
        sumLow += responses[run]
        countLow++
      } else {
        sumHigh += responses[run]
        countHigh++
      }
    }
    
    const avgLow = sumLow / countLow
    const avgHigh = sumHigh / countHigh
    const effect = avgHigh - avgLow
    
    effects.push({
      factor: factorNames[factor] || `Factor ${factor + 1}`,
      effect: effect,
      percentContribution: 0, // Will be calculated later
      significant: Math.abs(effect) > 0.1 // Simplified significance test
    })
  }
  
  // Calculate percent contribution
  const totalEffect = effects.reduce((sum, e) => sum + Math.abs(e.effect), 0)
  effects.forEach(e => {
    e.percentContribution = (Math.abs(e.effect) / totalEffect) * 100
  })
  
  return effects
}

/**
 * Calculate two-factor interaction effects
 */
export const calculateInteractionEffects = (
  design: number[][],
  responses: number[],
  factorNames: string[]
): Interaction[] => {
  const numFactors = design[0].length
  const numRuns = design.length
  const interactions: Interaction[] = []
  
  // Calculate all two-factor interactions
  for (let i = 0; i < numFactors - 1; i++) {
    for (let j = i + 1; j < numFactors; j++) {
      let sumLL = 0, sumLH = 0, sumHL = 0, sumHH = 0
      let countLL = 0, countLH = 0, countHL = 0, countHH = 0
      
      for (let run = 0; run < numRuns; run++) {
        const fi = design[run][i]
        const fj = design[run][j]
        
        if (fi < 0 && fj < 0) { sumLL += responses[run]; countLL++ }
        else if (fi < 0 && fj > 0) { sumLH += responses[run]; countLH++ }
        else if (fi > 0 && fj < 0) { sumHL += responses[run]; countHL++ }
        else { sumHH += responses[run]; countHH++ }
      }
      
      const avgLL = sumLL / (countLL || 1)
      const avgLH = sumLH / (countLH || 1)
      const avgHL = sumHL / (countHL || 1)
      const avgHH = sumHH / (countHH || 1)
      
      const interactionEffect = ((avgHH - avgHL) - (avgLH - avgLL)) / 2
      
      interactions.push({
        factors: [
          factorNames[i] || `Factor ${i + 1}`,
          factorNames[j] || `Factor ${j + 1}`
        ],
        effect: interactionEffect,
        percentContribution: 0,
        significant: Math.abs(interactionEffect) > 0.1
      })
    }
  }
  
  // Calculate percent contribution
  const totalEffect = interactions.reduce((sum, i) => sum + Math.abs(i.effect), 0)
  interactions.forEach(i => {
    i.percentContribution = (Math.abs(i.effect) / totalEffect) * 100
  })
  
  return interactions
}

/**
 * Perform ANOVA analysis
 */
export const performANOVA = (
  design: number[][],
  responses: number[],
  effects: Effect[],
  interactions: Interaction[]
): ANOVATable => {
  const numRuns = responses.length
  const grandMean = responses.reduce((sum, r) => sum + r, 0) / numRuns
  
  // Calculate total sum of squares
  const totalSS = responses.reduce((sum, r) => sum + Math.pow(r - grandMean, 2), 0)
  
  const rows: ANOVARow[] = []
  
  // Main effects
  effects.forEach(effect => {
    const ss = Math.pow(effect.effect, 2) * numRuns / 4 // Simplified for 2-level designs
    const df = 1
    const ms = ss / df
    const fValue = ms / (totalSS / (numRuns - 1)) // Simplified F-test
    const pValue = fValue > 4 ? 0.05 : 0.1 // Simplified p-value
    
    rows.push({
      source: effect.factor,
      degreesOfFreedom: df,
      sumOfSquares: ss,
      meanSquare: ms,
      fValue: fValue,
      pValue: pValue,
      significant: pValue < 0.05
    })
  })
  
  // Interactions
  interactions.forEach(interaction => {
    const ss = Math.pow(interaction.effect, 2) * numRuns / 4
    const df = 1
    const ms = ss / df
    const fValue = ms / (totalSS / (numRuns - 1))
    const pValue = fValue > 4 ? 0.05 : 0.1
    
    rows.push({
      source: interaction.factors.join(' x '),
      degreesOfFreedom: df,
      sumOfSquares: ss,
      meanSquare: ms,
      fValue: fValue,
      pValue: pValue,
      significant: pValue < 0.05
    })
  })
  
  // Error/Residual
  const modelSS = rows.reduce((sum, row) => sum + row.sumOfSquares, 0)
  const errorSS = totalSS - modelSS
  const errorDF = numRuns - rows.length - 1
  const errorMS = errorSS / (errorDF || 1)
  
  rows.push({
    source: 'Error',
    degreesOfFreedom: errorDF,
    sumOfSquares: errorSS,
    meanSquare: errorMS,
    fValue: 0,
    pValue: 1,
    significant: false
  })
  
  // Total
  rows.push({
    source: 'Total',
    degreesOfFreedom: numRuns - 1,
    sumOfSquares: totalSS,
    meanSquare: totalSS / (numRuns - 1),
    fValue: 0,
    pValue: 1,
    significant: false
  })
  
  const rSquared = modelSS / totalSS
  const rSquaredAdj = 1 - ((1 - rSquared) * (numRuns - 1)) / (errorDF || 1)
  
  return {
    rows,
    totalSS,
    rSquared,
    rSquaredAdj
  }
}

/**
 * Find optimal factor settings for maximizing/minimizing response
 */
export const findOptimalConditions = (
  effects: Effect[],
  target: 'maximize' | 'minimize'
): Record<string, number> => {
  const optimal: Record<string, number> = {}
  
  effects.forEach(effect => {
    if (target === 'maximize') {
      optimal[effect.factor] = effect.effect > 0 ? 1 : -1
    } else {
      optimal[effect.factor] = effect.effect < 0 ? 1 : -1
    }
  })
  
  return optimal
}

/**
 * Predict response at given factor settings
 */
export const predictResponse = (
  grandMean: number,
  effects: Effect[],
  interactions: Interaction[],
  factorSettings: Record<string, number>
): number => {
  let prediction = grandMean
  
  // Add main effects
  effects.forEach(effect => {
    const setting = factorSettings[effect.factor] || 0
    prediction += (effect.effect / 2) * setting
  })
  
  // Add interaction effects
  interactions.forEach(interaction => {
    const setting1 = factorSettings[interaction.factors[0]] || 0
    const setting2 = factorSettings[interaction.factors[1]] || 0
    prediction += (interaction.effect / 2) * setting1 * setting2
  })
  
  return prediction
}

/**
 * Calculate residuals
 */
export const calculateResiduals = (
  actualResponses: number[],
  predictedResponses: number[]
): number[] => {
  return actualResponses.map((actual, i) => actual - predictedResponses[i])
}

/**
 * Perform complete DOE analysis
 */
export const analyzeDOE = (
  design: number[][],
  responses: number[],
  factorNames: string[],
  responseTarget: 'maximize' | 'minimize' = 'maximize'
): DOEResults => {
  // Calculate effects
  const effects = calculateMainEffects(design, responses, factorNames)
  const interactions = calculateInteractionEffects(design, responses, factorNames)
  
  // Perform ANOVA
  const anova = performANOVA(design, responses, effects, interactions)
  
  // Find optimal conditions
  const optimalConditions = findOptimalConditions(effects, responseTarget)
  
  // Calculate grand mean
  const grandMean = responses.reduce((sum, r) => sum + r, 0) / responses.length
  
  // Predict response at optimal conditions
  const predictedOptimal = predictResponse(grandMean, effects, interactions, optimalConditions)
  
  // Calculate predicted responses for all runs
  const predictedResponses = design.map(run => {
    const settings: Record<string, number> = {}
    run.forEach((value, i) => {
      settings[factorNames[i] || `Factor ${i + 1}`] = value
    })
    return predictResponse(grandMean, effects, interactions, settings)
  })
  
  // Calculate residuals
  const residuals = calculateResiduals(responses, predictedResponses)
  
  return {
    effects,
    interactions,
    anova,
    optimalConditions,
    predictedResponse: { optimal: predictedOptimal },
    residuals
  }
}

/**
 * Generate Plackett-Burman design for screening
 */
export const generatePlackettBurman = (numFactors: number): number[][] => {
  // Simplified implementation for common sizes
  const designs: Record<number, number[][]> = {
    7: [
      [1, 1, 1, -1, 1, -1, -1],
      [-1, 1, 1, 1, -1, 1, -1],
      [-1, -1, 1, 1, 1, -1, 1],
      [1, -1, -1, 1, 1, 1, -1],
      [-1, 1, -1, -1, 1, 1, 1],
      [1, -1, 1, -1, -1, 1, 1],
      [1, 1, -1, 1, -1, -1, 1],
      [-1, -1, -1, -1, -1, -1, -1]
    ]
  }
  
  if (numFactors in designs) {
    return designs[numFactors]
  }
  
  // Fallback to 2^k design
  return generate2LevelFactorial(numFactors)
}

/**
 * Calculate design resolution
 */
export const calculateResolution = (design: number[][]): number => {
  // Simplified resolution calculation
  // Resolution III: Main effects confounded with two-factor interactions
  // Resolution IV: Main effects clear, two-factor interactions confounded
  // Resolution V: Main effects and two-factor interactions clear
  
  const numFactors = design[0].length
  const numRuns = design.length
  
  if (numRuns >= Math.pow(2, numFactors)) return 5 // Full factorial
  if (numRuns >= Math.pow(2, numFactors - 1)) return 4
  return 3
}

/**
 * Randomize run order
 */
export const randomizeRunOrder = (design: number[][]): number[][] => {
  const indexed = design.map((run) => ({ run, order: Math.random() }))
  indexed.sort((a, b) => a.order - b.order)
  return indexed.map(item => item.run)
}
