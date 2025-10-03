/**
 * Control Charts Calculations for Catapult Control Mode
 * Implements X-bar and R charts for Statistical Process Control (SPC)
 */

// ============================================================================
// TYPES
// ============================================================================

export interface Subgroup {
  id: string
  shots: Array<{ id: string; distance: number }>
  mean: number
  range: number
  timestamp: Date
  subgroupNumber: number
}

export interface ControlLimits {
  // X-bar Chart (Process Mean)
  xBarUCL: number  // Upper Control Limit
  xBarCL: number   // Center Line (Grand Mean)
  xBarLCL: number  // Lower Control Limit
  
  // R Chart (Process Variation)
  rBarUCL: number  // Upper Control Limit
  rBarCL: number   // Center Line (Average Range)
  rBarLCL: number  // Lower Control Limit (often 0)
  
  // Sigma zones for Nelson Rules
  xBar1Sigma: number  // 1σ from center
  xBar2Sigma: number  // 2σ from center
  xBar3Sigma: number  // 3σ from center (same as UCL/LCL)
}

export interface ControlConstants {
  A2: number  // X-bar chart factor
  D3: number  // R chart lower limit factor
  D4: number  // R chart upper limit factor
  d2: number  // Bias correction factor for estimating σ
}

export interface ControlChartData {
  subgroups: Subgroup[]
  controlLimits: ControlLimits | null
  subgroupSize: number
  totalSubgroups: number
  isStable: boolean
}

export interface ProcessStatistics {
  grandMean: number
  rBar: number
  processStdDev: number
  minValue: number
  maxValue: number
  overallRange: number
}

// ============================================================================
// CONTROL CONSTANTS (A2, D3, D4, d2)
// ============================================================================

/**
 * Control chart constants for different subgroup sizes
 * Source: Montgomery, D.C. (2009) Statistical Quality Control
 */
export const CONTROL_CONSTANTS: Record<number, ControlConstants> = {
  2: { A2: 1.880, D3: 0, D4: 3.267, d2: 1.128 },
  3: { A2: 1.023, D3: 0, D4: 2.574, d2: 1.693 },
  4: { A2: 0.729, D3: 0, D4: 2.282, d2: 2.059 },
  5: { A2: 0.577, D3: 0, D4: 2.114, d2: 2.326 },
  6: { A2: 0.483, D3: 0, D4: 2.004, d2: 2.534 },
  7: { A2: 0.419, D3: 0.076, D4: 1.924, d2: 2.704 },
  8: { A2: 0.373, D3: 0.136, D4: 1.864, d2: 2.847 },
  9: { A2: 0.337, D3: 0.184, D4: 1.816, d2: 2.970 },
  10: { A2: 0.308, D3: 0.223, D4: 1.777, d2: 3.078 }
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate subgroup size
 */
export function validateSubgroupSize(size: number): boolean {
  return size >= 2 && size <= 10
}

/**
 * Validate minimum subgroups for control limits
 */
export function hasMinimumSubgroups(subgroups: Subgroup[]): boolean {
  return subgroups.length >= 20
}

/**
 * Get control constants for subgroup size
 */
export function getControlConstants(subgroupSize: number): ControlConstants {
  if (!validateSubgroupSize(subgroupSize)) {
    throw new Error(`Invalid subgroup size: ${subgroupSize}. Must be between 2 and 10.`)
  }
  return CONTROL_CONSTANTS[subgroupSize]
}

// ============================================================================
// SUBGROUP CREATION & MANAGEMENT
// ============================================================================

/**
 * Create a subgroup from shots
 */
export function createSubgroup(
  shots: Array<{ id: string; distance: number }>,
  subgroupNumber: number
): Subgroup {
  if (shots.length === 0) {
    throw new Error('Cannot create subgroup from empty shots array')
  }

  const distances = shots.map(s => s.distance)
  const mean = calculateMean(distances)
  const range = calculateRange(distances)

  return {
    id: `subgroup-${Date.now()}-${subgroupNumber}`,
    shots,
    mean: Math.round(mean * 100) / 100,
    range: Math.round(range * 100) / 100,
    timestamp: new Date(),
    subgroupNumber
  }
}

/**
 * Calculate mean of values
 */
function calculateMean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

/**
 * Calculate range (max - min)
 */
function calculateRange(values: number[]): number {
  if (values.length === 0) return 0
  const min = Math.min(...values)
  const max = Math.max(...values)
  return max - min
}

/**
 * Validate subgroup has correct size
 */
export function validateSubgroup(subgroup: Subgroup, expectedSize: number): boolean {
  return subgroup.shots.length === expectedSize
}

// ============================================================================
// PROCESS STATISTICS CALCULATIONS
// ============================================================================

/**
 * Calculate grand mean (X-double-bar)
 */
export function calculateGrandMean(subgroups: Subgroup[]): number {
  if (subgroups.length === 0) return 0
  
  const sumOfMeans = subgroups.reduce((sum, sg) => sum + sg.mean, 0)
  return sumOfMeans / subgroups.length
}

/**
 * Calculate R-bar (average range)
 */
export function calculateRBar(subgroups: Subgroup[]): number {
  if (subgroups.length === 0) return 0
  
  const sumOfRanges = subgroups.reduce((sum, sg) => sum + sg.range, 0)
  return sumOfRanges / subgroups.length
}

/**
 * Calculate process standard deviation estimate
 */
export function calculateProcessStdDev(rBar: number, subgroupSize: number): number {
  const constants = getControlConstants(subgroupSize)
  return rBar / constants.d2
}

/**
 * Calculate all process statistics
 */
export function calculateProcessStatistics(
  subgroups: Subgroup[],
  subgroupSize: number
): ProcessStatistics {
  if (subgroups.length === 0) {
    return {
      grandMean: 0,
      rBar: 0,
      processStdDev: 0,
      minValue: 0,
      maxValue: 0,
      overallRange: 0
    }
  }

  const grandMean = calculateGrandMean(subgroups)
  const rBar = calculateRBar(subgroups)
  const processStdDev = calculateProcessStdDev(rBar, subgroupSize)

  // Calculate overall min/max from all shots
  const allDistances = subgroups.flatMap(sg => sg.shots.map(s => s.distance))
  const minValue = Math.min(...allDistances)
  const maxValue = Math.max(...allDistances)
  const overallRange = maxValue - minValue

  return {
    grandMean: Math.round(grandMean * 100) / 100,
    rBar: Math.round(rBar * 100) / 100,
    processStdDev: Math.round(processStdDev * 100) / 100,
    minValue: Math.round(minValue * 100) / 100,
    maxValue: Math.round(maxValue * 100) / 100,
    overallRange: Math.round(overallRange * 100) / 100
  }
}

// ============================================================================
// CONTROL LIMITS CALCULATIONS
// ============================================================================

/**
 * Calculate X-bar chart control limits
 */
export function calculateXBarLimits(
  grandMean: number,
  rBar: number,
  subgroupSize: number
): { UCL: number; CL: number; LCL: number } {
  const constants = getControlConstants(subgroupSize)
  
  const UCL = grandMean + (constants.A2 * rBar)
  const CL = grandMean
  const LCL = grandMean - (constants.A2 * rBar)

  return {
    UCL: Math.round(UCL * 100) / 100,
    CL: Math.round(CL * 100) / 100,
    LCL: Math.round(LCL * 100) / 100
  }
}

/**
 * Calculate R chart control limits
 */
export function calculateRLimits(
  rBar: number,
  subgroupSize: number
): { UCL: number; CL: number; LCL: number } {
  const constants = getControlConstants(subgroupSize)
  
  const UCL = constants.D4 * rBar
  const CL = rBar
  const LCL = constants.D3 * rBar

  return {
    UCL: Math.round(UCL * 100) / 100,
    CL: Math.round(CL * 100) / 100,
    LCL: Math.round(LCL * 100) / 100
  }
}

/**
 * Calculate sigma zones for Nelson Rules
 */
export function calculateSigmaZones(
  grandMean: number,
  processStdDev: number
): { sigma1: number; sigma2: number; sigma3: number } {
  return {
    sigma1: Math.round(processStdDev * 100) / 100,
    sigma2: Math.round((processStdDev * 2) * 100) / 100,
    sigma3: Math.round((processStdDev * 3) * 100) / 100
  }
}

/**
 * Calculate complete control limits
 */
export function calculateControlLimits(
  subgroups: Subgroup[],
  subgroupSize: number
): ControlLimits | null {
  // Need minimum subgroups to calculate reliable limits
  if (!hasMinimumSubgroups(subgroups)) {
    return null
  }

  const grandMean = calculateGrandMean(subgroups)
  const rBar = calculateRBar(subgroups)
  const processStdDev = calculateProcessStdDev(rBar, subgroupSize)

  // Calculate X-bar limits
  const xBarLimits = calculateXBarLimits(grandMean, rBar, subgroupSize)

  // Calculate R limits
  const rLimits = calculateRLimits(rBar, subgroupSize)

  // Calculate sigma zones
  const sigmaZones = calculateSigmaZones(grandMean, processStdDev)

  return {
    xBarUCL: xBarLimits.UCL,
    xBarCL: xBarLimits.CL,
    xBarLCL: xBarLimits.LCL,
    
    rBarUCL: rLimits.UCL,
    rBarCL: rLimits.CL,
    rBarLCL: rLimits.LCL,
    
    xBar1Sigma: sigmaZones.sigma1,
    xBar2Sigma: sigmaZones.sigma2,
    xBar3Sigma: sigmaZones.sigma3
  }
}

// ============================================================================
// POINT CLASSIFICATION
// ============================================================================

/**
 * Classify a point relative to control limits
 */
export type PointZone = 'beyond_3sigma' | 'zone_2to3sigma' | 'zone_1to2sigma' | 'zone_center' | 'below_lcl'

export function classifyXBarPoint(
  value: number,
  controlLimits: ControlLimits
): PointZone {
  const { xBarCL, xBar1Sigma, xBar2Sigma, xBarUCL, xBarLCL } = controlLimits

  // Beyond 3σ (outside control limits)
  if (value > xBarUCL) return 'beyond_3sigma'
  if (value < xBarLCL) return 'below_lcl'

  // Between 2σ and 3σ
  if (value > xBarCL + xBar2Sigma || value < xBarCL - xBar2Sigma) {
    return 'zone_2to3sigma'
  }

  // Between 1σ and 2σ
  if (value > xBarCL + xBar1Sigma || value < xBarCL - xBar1Sigma) {
    return 'zone_1to2sigma'
  }

  // Within 1σ (center zone)
  return 'zone_center'
}

/**
 * Check if point is above center line
 */
export function isAboveCenterLine(value: number, centerLine: number): boolean {
  return value > centerLine
}

/**
 * Check if point is outside control limits
 */
export function isOutsideControlLimits(
  value: number,
  ucl: number,
  lcl: number
): boolean {
  return value > ucl || value < lcl
}

// ============================================================================
// PROCESS STABILITY ASSESSMENT
// ============================================================================

/**
 * Assess overall process stability
 */
export function assessProcessStability(
  subgroups: Subgroup[],
  controlLimits: ControlLimits,
  violations: Array<{ rule: string; subgroupIndex: number; severity: string }>
): boolean {
  // Need minimum subgroups
  if (!hasMinimumSubgroups(subgroups)) {
    return false
  }

  // No high-severity violations
  const hasHighSeverityViolations = violations.some(v => v.severity === 'high')
  if (hasHighSeverityViolations) {
    return false
  }

  // Check if all X-bar points are within control limits
  const allWithinLimits = subgroups.every(sg => {
    return !isOutsideControlLimits(sg.mean, controlLimits.xBarUCL, controlLimits.xBarLCL)
  })

  if (!allWithinLimits) {
    return false
  }

  // Check if all R points are within control limits
  const allRangesWithinLimits = subgroups.every(sg => {
    return !isOutsideControlLimits(sg.range, controlLimits.rBarUCL, controlLimits.rBarLCL)
  })

  return allRangesWithinLimits
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format control limit for display
 */
export function formatControlLimit(value: number): string {
  return value.toFixed(2)
}

/**
 * Calculate process capability from control chart data
 */
export function estimateProcessCapability(
  processStdDev: number,
  specLSL: number | null,
  specUSL: number | null
): { cp: number | null; cpk: number | null } {
  if (!specLSL && !specUSL) {
    return { cp: null, cpk: null }
  }

  let cp: number | null = null
  const cpk: number | null = null

  // Calculate Cp if both limits exist
  if (specLSL !== null && specUSL !== null) {
    const tolerance = specUSL - specLSL
    const processSpread = 6 * processStdDev
    cp = tolerance / processSpread
  }

  return {
    cp: cp !== null ? Math.round(cp * 100) / 100 : null,
    cpk: cpk
  }
}

/**
 * Calculate trend (for Rule 3 - six points trending)
 */
export function calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
  if (values.length < 2) return 'stable'

  let increasing = 0
  let decreasing = 0

  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i - 1]) {
      increasing++
    } else if (values[i] < values[i - 1]) {
      decreasing++
    }
  }

  if (increasing > decreasing && increasing >= values.length - 1) {
    return 'increasing'
  } else if (decreasing > increasing && decreasing >= values.length - 1) {
    return 'decreasing'
  }

  return 'stable'
}

/**
 * Check if values alternate (for Rule 4)
 */
export function isAlternating(values: number[]): boolean {
  if (values.length < 2) return false

  for (let i = 2; i < values.length; i++) {
    const prev2 = values[i - 2]
    const prev1 = values[i - 1]
    const current = values[i]

    // Check if alternating pattern
    if ((prev2 < prev1 && prev1 >= current) || (prev2 > prev1 && prev1 <= current)) {
      continue
    } else {
      return false
    }
  }

  return true
}

/**
 * Export subgroups to CSV format
 */
export function exportSubgroupsToCSV(subgroups: Subgroup[]): string {
  const headers = ['Subgroup', 'Mean', 'Range', 'Timestamp']
  const rows = subgroups.map(sg => [
    sg.subgroupNumber,
    sg.mean,
    sg.range,
    sg.timestamp.toISOString()
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  return csvContent
}

/**
 * Calculate run length (consecutive points on same side)
 */
export function calculateRunLength(
  values: number[],
  centerLine: number,
  side: 'above' | 'below'
): number {
  let runLength = 0

  for (let i = values.length - 1; i >= 0; i--) {
    if (side === 'above' && values[i] > centerLine) {
      runLength++
    } else if (side === 'below' && values[i] < centerLine) {
      runLength++
    } else {
      break
    }
  }

  return runLength
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Create complete control chart data structure
 */
export function createControlChartData(
  subgroups: Subgroup[],
  subgroupSize: number
): ControlChartData {
  const controlLimits = calculateControlLimits(subgroups, subgroupSize)
  
  // Calculate stability (will need violations from Nelson Rules)
  const isStable = controlLimits !== null && hasMinimumSubgroups(subgroups)

  return {
    subgroups,
    controlLimits,
    subgroupSize,
    totalSubgroups: subgroups.length,
    isStable
  }
}
