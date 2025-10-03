/**
 * Process Capability Analysis
 * Calculates capability indices and provides process performance metrics
 */

export interface CapabilityInput {
  data: number[]
  usl: number // Upper Specification Limit
  lsl: number // Lower Specification Limit
  target?: number // Target value (optional)
  subgroupSize?: number // For within-subgroup variance
}

export interface CapabilityResults {
  // Basic Statistics
  mean: number
  median: number
  stdDev: number
  variance: number
  range: number
  
  // Capability Indices
  cp: number // Potential capability
  cpk: number // Actual capability
  cpl: number // Lower capability
  cpu: number // Upper capability
  
  // Performance Indices
  pp: number // Potential performance
  ppk: number // Actual performance
  ppl: number // Lower performance
  ppu: number // Upper performance
  
  // Sigma Level
  sigmaLevel: number
  dpmo: number // Defects Per Million Opportunities
  
  // Specification Analysis
  targetDistance: number
  specificationWidth: number
  processWidth: number
  
  // Assessment
  isCapable: boolean
  capabilityLevel: string
  recommendations: string[]
  
  // Out of Spec Analysis
  outOfSpecCount: number
  outOfSpecPercent: number
  aboveUSL: number
  belowLSL: number
}

/**
 * Calculate process capability indices
 */
export function calculateCapability(input: CapabilityInput): CapabilityResults {
  const { data, usl, lsl, target } = input
  const n = data.length
  
  // Basic Statistics
  const mean = data.reduce((sum, val) => sum + val, 0) / n
  const sortedData = [...data].sort((a, b) => a - b)
  const median = n % 2 === 0 
    ? (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2
    : sortedData[Math.floor(n / 2)]
  
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1)
  const stdDev = Math.sqrt(variance)
  const range = Math.max(...data) - Math.min(...data)
  
  // Specification Analysis
  const specificationWidth = usl - lsl
  const processWidth = 6 * stdDev
  const targetValue = target ?? (usl + lsl) / 2
  const targetDistance = Math.abs(mean - targetValue)
  
  // Capability Indices (short-term, within-subgroup)
  const cp = specificationWidth / (6 * stdDev)
  const cpu = (usl - mean) / (3 * stdDev)
  const cpl = (mean - lsl) / (3 * stdDev)
  const cpk = Math.min(cpu, cpl)
  
  // Performance Indices (long-term, overall)
  // Using overall standard deviation for Pp/Ppk
  const pp = specificationWidth / (6 * stdDev)
  const ppu = (usl - mean) / (3 * stdDev)
  const ppl = (mean - lsl) / (3 * stdDev)
  const ppk = Math.min(ppu, ppl)
  
  // Sigma Level and DPMO
  const sigmaLevel = cpk * 3
  const dpmo = calculateDPMO(sigmaLevel)
  
  // Out of Spec Analysis
  const aboveUSL = data.filter(v => v > usl).length
  const belowLSL = data.filter(v => v < lsl).length
  const outOfSpecCount = aboveUSL + belowLSL
  const outOfSpecPercent = (outOfSpecCount / n) * 100
  
  // Capability Assessment
  const isCapable = cpk >= 1.33
  const capabilityLevel = getCapabilityLevel(cpk)
  const recommendations = generateRecommendations({
    cpk,
    cp,
    mean,
    targetValue,
    stdDev,
    outOfSpecPercent
  })
  
  return {
    mean,
    median,
    stdDev,
    variance,
    range,
    cp,
    cpk,
    cpl,
    cpu,
    pp,
    ppk,
    ppl,
    ppu,
    sigmaLevel,
    dpmo,
    targetDistance,
    specificationWidth,
    processWidth,
    isCapable,
    capabilityLevel,
    recommendations,
    outOfSpecCount,
    outOfSpecPercent,
    aboveUSL,
    belowLSL
  }
}

/**
 * Calculate DPMO (Defects Per Million Opportunities) from sigma level
 */
function calculateDPMO(sigmaLevel: number): number {
  // Approximation using normal distribution
  const z = sigmaLevel
  
  // Using standard normal CDF approximation
  const phi = (x: number) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x))
    const d = 0.3989423 * Math.exp(-x * x / 2)
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return x > 0 ? 1 - p : p
  }
  
  const defectRate = 1 - phi(z) + phi(-z)
  return Math.round(defectRate * 1000000)
}

/**
 * Get capability level classification
 */
function getCapabilityLevel(cpk: number): string {
  if (cpk >= 2.0) return 'World Class (6σ)'
  if (cpk >= 1.67) return 'Excellent (5σ)'
  if (cpk >= 1.33) return 'Capable (4σ)'
  if (cpk >= 1.0) return 'Marginal (3σ)'
  if (cpk >= 0.67) return 'Poor (2σ)'
  return 'Inadequate (<2σ)'
}

/**
 * Generate recommendations based on capability analysis
 */
function generateRecommendations(params: {
  cpk: number
  cp: number
  mean: number
  targetValue: number
  stdDev: number
  outOfSpecPercent: number
}): string[] {
  const { cpk, cp, mean, targetValue, stdDev, outOfSpecPercent } = params
  const recommendations: string[] = []
  
  // Capability-based recommendations
  if (cpk < 1.0) {
    recommendations.push('CRITICAL: Process is not capable. Immediate action required to reduce variation or adjust specifications.')
  } else if (cpk < 1.33) {
    recommendations.push('Process capability is marginal. Consider process improvement initiatives to increase Cpk above 1.33.')
  }
  
  // Centering recommendations
  const centeringRatio = cp / cpk
  if (centeringRatio > 1.2) {
    recommendations.push('Process is not well-centered. Adjust process mean to move closer to the target value.')
  }
  
  // Variation recommendations
  if (cp < 1.33 && cpk < 1.33) {
    recommendations.push('Reduce process variation through Six Sigma DMAIC projects, better process control, or improved materials.')
  }
  
  // Defect-based recommendations
  if (outOfSpecPercent > 0.27) { // > 3 sigma
    recommendations.push(`Currently producing ${outOfSpecPercent.toFixed(2)}% defects. Implement defect reduction strategies immediately.`)
  }
  
  // Target deviation
  const targetDeviation = Math.abs(mean - targetValue)
  if (targetDeviation > stdDev) {
    recommendations.push('Process mean is significantly off-target. Investigate root causes of systematic bias.')
  }
  
  // Positive feedback for good performance
  if (cpk >= 1.67) {
    recommendations.push('Excellent process capability! Continue monitoring to maintain this performance level.')
  }
  
  return recommendations
}

/**
 * Calculate Z-score for capability analysis
 */
export function calculateZScore(value: number, mean: number, stdDev: number): number {
  return (value - mean) / stdDev
}

/**
 * Calculate probability of defects
 */
export interface DefectProbability {
  aboveUSL: number
  belowLSL: number
  total: number
  ppm: number
}

export function calculateDefectProbability(
  mean: number,
  stdDev: number,
  usl: number,
  lsl: number
): DefectProbability {
  const zUSL = (usl - mean) / stdDev
  const zLSL = (lsl - mean) / stdDev
  
  // Standard normal CDF
  const phi = (z: number): number => {
    return 0.5 * (1 + erf(z / Math.sqrt(2)))
  }
  
  // Error function approximation
  const erf = (x: number): number => {
    const sign = x >= 0 ? 1 : -1
    x = Math.abs(x)
    
    const a1 =  0.254829592
    const a2 = -0.284496736
    const a3 =  1.421413741
    const a4 = -1.453152027
    const a5 =  1.061405429
    const p  =  0.3275911
    
    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
    
    return sign * y
  }
  
  const aboveUSL = 1 - phi(zUSL)
  const belowLSL = phi(zLSL)
  const total = aboveUSL + belowLSL
  const ppm = total * 1000000
  
  return {
    aboveUSL: aboveUSL * 100,
    belowLSL: belowLSL * 100,
    total: total * 100,
    ppm: Math.round(ppm)
  }
}

/**
 * Generate histogram bins for capability visualization
 */
export interface HistogramBin {
  start: number
  end: number
  count: number
  percentage: number
  isOutOfSpec: boolean
}

export function generateHistogramBins(
  data: number[],
  usl: number,
  lsl: number,
  binCount: number = 20
): HistogramBin[] {
  const min = Math.min(...data, lsl)
  const max = Math.max(...data, usl)
  const binWidth = (max - min) / binCount
  
  const bins: HistogramBin[] = []
  
  for (let i = 0; i < binCount; i++) {
    const start = min + i * binWidth
    const end = start + binWidth
    const count = data.filter(v => v >= start && v < end).length
    const isOutOfSpec = end <= lsl || start >= usl
    
    bins.push({
      start,
      end,
      count,
      percentage: (count / data.length) * 100,
      isOutOfSpec
    })
  }
  
  return bins
}
