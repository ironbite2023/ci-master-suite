/**
 * Process Capability Calculations for Catapult Capability Mode
 * Implements Cp, Cpk, Pp, Ppk, Cpm, Sigma Level, DPMO, and interpretations
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SpecificationLimits {
  lsl: number | null  // Lower Specification Limit
  usl: number | null  // Upper Specification Limit
  target: number | null  // Target value (nominal)
}

export interface CapabilityIndices {
  cp: number | null      // Process Capability (short-term, potential)
  cpk: number | null     // Process Capability Index (short-term, actual)
  pp: number | null      // Process Performance (long-term, potential)
  ppk: number | null     // Process Performance Index (long-term, actual)
  cpm: number | null     // Taguchi Capability Index (target-centered)
  cpl: number | null     // Lower Capability Index
  cpu: number | null     // Upper Capability Index
  cr: number | null      // Capability Ratio
}

export interface SigmaMetrics {
  sigmaLevel: number     // Process Sigma Level (Z-score)
  dpmo: number           // Defects Per Million Opportunities
  ppm: number            // Parts Per Million defective
  yield: number          // Process yield percentage
  defectRate: number     // Defect rate (0-1)
}

export interface CapabilityRating {
  rating: string         // e.g., "Excellent", "Adequate", "Poor"
  color: string          // Color code for UI
  description: string    // Detailed description
  recommendation: string // Action recommendation
  icon: string          // Icon name for UI
}

export interface CapabilityAnalysis {
  specs: SpecificationLimits
  indices: CapabilityIndices
  sigmaMetrics: SigmaMetrics
  rating: CapabilityRating
  interpretation: string
  recommendations: string[]
  processCenter: number
  processSpread: number
  specWidth: number | null
}

// ============================================================================
// SPECIFICATION VALIDATION
// ============================================================================

/**
 * Validate specification limits
 */
export function validateSpecificationLimits(specs: SpecificationLimits): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check if at least one limit is specified
  if (specs.lsl === null && specs.usl === null) {
    errors.push('At least one specification limit (LSL or USL) must be defined')
  }

  // Check if LSL < USL when both are defined
  if (specs.lsl !== null && specs.usl !== null && specs.lsl >= specs.usl) {
    errors.push('Lower Specification Limit must be less than Upper Specification Limit')
  }

  // Check if target is within limits
  if (specs.target !== null) {
    if (specs.lsl !== null && specs.target < specs.lsl) {
      errors.push('Target must be greater than or equal to LSL')
    }
    if (specs.usl !== null && specs.target > specs.usl) {
      errors.push('Target must be less than or equal to USL')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// ============================================================================
// CAPABILITY INDICES CALCULATIONS
// ============================================================================

/**
 * Calculate all capability indices
 */
export function calculateCapabilityIndices(
  data: number[],
  mean: number,
  stdDev: number,
  specs: SpecificationLimits
): CapabilityIndices {
  const { lsl, usl, target } = specs

  // Calculate Cp (short-term potential capability)
  let cp: number | null = null
  if (lsl !== null && usl !== null) {
    const tolerance = usl - lsl
    const processSpread = 6 * stdDev
    cp = tolerance / processSpread
  }

  // Calculate CPU (upper capability)
  let cpu: number | null = null
  if (usl !== null) {
    cpu = (usl - mean) / (3 * stdDev)
  }

  // Calculate CPL (lower capability)
  let cpl: number | null = null
  if (lsl !== null) {
    cpl = (mean - lsl) / (3 * stdDev)
  }

  // Calculate Cpk (short-term actual capability)
  let cpk: number | null = null
  if (cpu !== null && cpl !== null) {
    cpk = Math.min(cpu, cpl)
  } else if (cpu !== null) {
    cpk = cpu
  } else if (cpl !== null) {
    cpk = cpl
  }

  // Calculate Pp (long-term potential performance)
  // For this simplified version, we use overall std dev (same as Cp)
  const pp = cp

  // Calculate Ppk (long-term actual performance)
  const ppk = cpk

  // Calculate Cpm (Taguchi capability index)
  let cpm: number | null = null
  if (lsl !== null && usl !== null && target !== null) {
    const tolerance = usl - lsl
    const tau = Math.sqrt(stdDev * stdDev + Math.pow(mean - target, 2))
    cpm = tolerance / (6 * tau)
  }

  // Calculate Capability Ratio (CR)
  let cr: number | null = null
  if (cp !== null) {
    cr = 1 / cp
  }

  return {
    cp: cp !== null ? Math.round(cp * 100) / 100 : null,
    cpk: cpk !== null ? Math.round(cpk * 100) / 100 : null,
    pp: pp !== null ? Math.round(pp * 100) / 100 : null,
    ppk: ppk !== null ? Math.round(ppk * 100) / 100 : null,
    cpm: cpm !== null ? Math.round(cpm * 100) / 100 : null,
    cpl: cpl !== null ? Math.round(cpl * 100) / 100 : null,
    cpu: cpu !== null ? Math.round(cpu * 100) / 100 : null,
    cr: cr !== null ? Math.round(cr * 100) / 100 : null
  }
}

// ============================================================================
// SIGMA LEVEL & DPMO CALCULATIONS
// ============================================================================

/**
 * Calculate process sigma level and defect metrics
 */
export function calculateSigmaMetrics(
  data: number[],
  mean: number,
  stdDev: number,
  specs: SpecificationLimits
): SigmaMetrics {
  const { lsl, usl } = specs

  // Count defects
  let defects = 0
  data.forEach(value => {
    if (lsl !== null && value < lsl) defects++
    if (usl !== null && value > usl) defects++
  })

  // Calculate defect rate
  const defectRate = defects / data.length

  // Calculate DPMO (Defects Per Million Opportunities)
  const dpmo = defectRate * 1000000

  // Calculate PPM (Parts Per Million)
  const ppm = dpmo

  // Calculate yield
  const yieldPercent = (1 - defectRate) * 100

  // Calculate Sigma Level (Z-score)
  // Using the relationship: DPMO -> Sigma Level
  let sigmaLevel = 0
  if (defectRate > 0 && defectRate < 1) {
    // Use inverse normal distribution approximation
    sigmaLevel = calculateSigmaFromDPMO(dpmo)
  } else if (defectRate === 0) {
    // Perfect process, estimate based on sample size
    sigmaLevel = 6.0 // Assume 6 sigma if no defects
  } else {
    sigmaLevel = 0
  }

  return {
    sigmaLevel: Math.round(sigmaLevel * 100) / 100,
    dpmo: Math.round(dpmo),
    ppm: Math.round(ppm),
    yield: Math.round(yieldPercent * 100) / 100,
    defectRate: Math.round(defectRate * 10000) / 10000
  }
}

/**
 * Convert DPMO to Sigma Level
 */
function calculateSigmaFromDPMO(dpmo: number): number {
  // Lookup table for DPMO to Sigma (approximate)
  const sigmaTable: Array<[number, number]> = [
    [691462, 1.0],
    [308538, 2.0],
    [66807, 3.0],
    [6210, 4.0],
    [233, 5.0],
    [3.4, 6.0],
    [0.019, 6.5]
  ]

  // Find closest match
  for (let i = 0; i < sigmaTable.length - 1; i++) {
    const [highDPMO, lowSigma] = sigmaTable[i]
    const [lowDPMO, highSigma] = sigmaTable[i + 1]
    
    if (dpmo >= lowDPMO && dpmo <= highDPMO) {
      // Linear interpolation
      const ratio = (Math.log(dpmo) - Math.log(lowDPMO)) / (Math.log(highDPMO) - Math.log(lowDPMO))
      return highSigma - ratio * (highSigma - lowSigma)
    }
  }

  // Outside table range
  if (dpmo > 691462) return 0.5
  if (dpmo < 0.019) return 7.0

  return 3.0 // Default
}

// ============================================================================
// CAPABILITY RATING
// ============================================================================

/**
 * Get capability rating based on Cpk value
 */
export function getCapabilityRating(cpk: number | null): CapabilityRating {
  if (cpk === null) {
    return {
      rating: 'Unknown',
      color: 'gray',
      description: 'Cannot determine capability without specification limits',
      recommendation: 'Define specification limits to assess process capability',
      icon: 'HelpCircle'
    }
  }

  if (cpk >= 2.0) {
    return {
      rating: 'Excellent',
      color: 'green',
      description: 'World-class capability. Process is highly capable with minimal defects.',
      recommendation: 'Maintain current process. Consider reducing inspection frequency.',
      icon: 'Trophy'
    }
  } else if (cpk >= 1.67) {
    return {
      rating: 'Very Good',
      color: 'green',
      description: 'Excellent capability. Process exceeds industry standards.',
      recommendation: 'Continue monitoring. Process is well-controlled.',
      icon: 'CheckCircle2'
    }
  } else if (cpk >= 1.33) {
    return {
      rating: 'Good',
      color: 'blue',
      description: 'Adequate capability. Process meets Six Sigma minimum standards.',
      recommendation: 'Continue monitoring and maintain current controls.',
      icon: 'ThumbsUp'
    }
  } else if (cpk >= 1.0) {
    return {
      rating: 'Marginal',
      color: 'yellow',
      description: 'Barely adequate. Process needs improvement to reduce defects.',
      recommendation: 'Implement process improvements. Increase monitoring.',
      icon: 'AlertTriangle'
    }
  } else if (cpk >= 0.67) {
    return {
      rating: 'Poor',
      color: 'orange',
      description: 'Inadequate capability. Significant defects expected.',
      recommendation: 'Urgent process improvement required. Consider 100% inspection.',
      icon: 'AlertCircle'
    }
  } else {
    return {
      rating: 'Unacceptable',
      color: 'red',
      description: 'Severely inadequate. Process is not capable.',
      recommendation: 'Immediate corrective action required. Process overhaul needed.',
      icon: 'XCircle'
    }
  }
}

// ============================================================================
// COMPLETE CAPABILITY ANALYSIS
// ============================================================================

/**
 * Perform complete capability analysis
 */
export function performCapabilityAnalysis(
  data: number[],
  mean: number,
  stdDev: number,
  specs: SpecificationLimits
): CapabilityAnalysis {
  // Validate specifications
  const validation = validateSpecificationLimits(specs)
  if (!validation.valid) {
    throw new Error(`Invalid specifications: ${validation.errors.join(', ')}`)
  }

  // Calculate all metrics
  const indices = calculateCapabilityIndices(data, mean, stdDev, specs)
  const sigmaMetrics = calculateSigmaMetrics(data, mean, stdDev, specs)
  const rating = getCapabilityRating(indices.cpk)

  // Calculate process characteristics
  const processCenter = mean
  const processSpread = 6 * stdDev

  // Calculate specification width
  let specWidth: number | null = null
  if (specs.lsl !== null && specs.usl !== null) {
    specWidth = specs.usl - specs.lsl
  }

  // Generate interpretation
  const interpretation = generateInterpretation(indices, sigmaMetrics, specs, mean)

  // Generate recommendations
  const recommendations = generateRecommendations(indices, sigmaMetrics, rating, specs)

  return {
    specs,
    indices,
    sigmaMetrics,
    rating,
    interpretation,
    recommendations,
    processCenter,
    processSpread,
    specWidth
  }
}

// ============================================================================
// INTERPRETATION GENERATOR
// ============================================================================

function generateInterpretation(
  indices: CapabilityIndices,
  sigmaMetrics: SigmaMetrics,
  specs: SpecificationLimits,
  mean: number
): string {
  const parts: string[] = []

  // Cpk interpretation
  if (indices.cpk !== null) {
    parts.push(`Your process has a Cpk of ${indices.cpk.toFixed(2)}, indicating ${getCapabilityRating(indices.cpk).rating.toLowerCase()} capability.`)
  }

  // Sigma level interpretation
  parts.push(`The process operates at a ${sigmaMetrics.sigmaLevel.toFixed(2)} sigma level, producing ${sigmaMetrics.dpmo.toLocaleString()} defects per million opportunities.`)

  // Yield interpretation
  parts.push(`Process yield is ${sigmaMetrics.yield.toFixed(2)}%, meaning ${(100 - sigmaMetrics.yield).toFixed(2)}% of outputs are outside specifications.`)

  // Centering interpretation
  if (specs.target !== null) {
    const offset = mean - specs.target
    if (Math.abs(offset) > 0.01) {
      parts.push(`The process is off-target by ${Math.abs(offset).toFixed(2)} units (${offset > 0 ? 'above' : 'below'} target).`)
    } else {
      parts.push('The process is well-centered on the target.')
    }
  }

  return parts.join(' ')
}

// ============================================================================
// RECOMMENDATIONS GENERATOR
// ============================================================================

function generateRecommendations(
  indices: CapabilityIndices,
  sigmaMetrics: SigmaMetrics,
  rating: CapabilityRating,
  specs: SpecificationLimits
): string[] {
  const recommendations: string[] = []

  // Primary recommendation based on rating
  recommendations.push(rating.recommendation)

  // Cpk-based recommendations
  if (indices.cpk !== null && indices.cpk < 1.33) {
    recommendations.push('Focus on reducing process variation (improve Cp) and centering the process (improve Cpk).')
  }

  // Centering recommendations
  if (specs.target !== null && indices.cpl !== null && indices.cpu !== null) {
    if (Math.abs(indices.cpl - indices.cpu) > 0.2) {
      if (indices.cpl < indices.cpu) {
        recommendations.push('Process is shifted low. Adjust process settings to center on target.')
      } else {
        recommendations.push('Process is shifted high. Adjust process settings to center on target.')
      }
    }
  }

  // Sigma level recommendations
  if (sigmaMetrics.sigmaLevel < 3.0) {
    recommendations.push('Process is far from Six Sigma standards. Consider a DMAIC project for improvement.')
  } else if (sigmaMetrics.sigmaLevel < 4.0) {
    recommendations.push('Process has room for significant improvement. Focus on reducing common cause variation.')
  } else if (sigmaMetrics.sigmaLevel >= 6.0) {
    recommendations.push('Excellent performance! Share best practices and maintain process controls.')
  }

  // Defect rate recommendations
  if (sigmaMetrics.defectRate > 0.05) {
    recommendations.push('High defect rate detected. Implement sorting/inspection until process is improved.')
  }

  return recommendations
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate process width (6 sigma)
 */
export function calculateProcessWidth(stdDev: number): number {
  return 6 * stdDev
}

/**
 * Calculate specification width
 */
export function calculateSpecificationWidth(specs: SpecificationLimits): number | null {
  if (specs.lsl !== null && specs.usl !== null) {
    return specs.usl - specs.lsl
  }
  return null
}

/**
 * Check if process is centered
 */
export function isProcessCentered(mean: number, specs: SpecificationLimits, tolerance: number = 0.05): boolean {
  if (specs.lsl !== null && specs.usl !== null) {
    const specCenter = (specs.lsl + specs.usl) / 2
    const offset = Math.abs(mean - specCenter)
    const specWidth = specs.usl - specs.lsl
    return offset < (specWidth * tolerance)
  }
  if (specs.target !== null) {
    const offset = Math.abs(mean - specs.target)
    const stdTolerance = tolerance * (specs.usl || specs.lsl || mean)
    return offset < stdTolerance
  }
  return true
}

/**
 * Calculate expected defects
 */
export function calculateExpectedDefects(dpmo: number, opportunities: number): number {
  return (dpmo / 1000000) * opportunities
}

/**
 * Format capability index for display
 */
export function formatCapabilityIndex(value: number | null): string {
  if (value === null) return 'N/A'
  return value.toFixed(2)
}

/**
 * Format sigma level for display
 */
export function formatSigmaLevel(value: number): string {
  return `${value.toFixed(2)}σ`
}

/**
 * Format DPMO for display
 */
export function formatDPMO(value: number): string {
  return value.toLocaleString()
}
