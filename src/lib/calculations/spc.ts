/**
 * Statistical Process Control (SPC) Calculations
 * Implements control limits, Nelson rules, and Western Electric rules
 */

export interface DataPoint {
  sample: number
  value: number
  subgroup?: number[]
}

export interface ControlLimits {
  mean: number
  ucl: number
  lcl: number
  sigma: number
  violations: number[]
  rules: RuleViolation[]
}

export interface RuleViolation {
  rule: string
  description: string
  indices: number[]
  severity: 'warning' | 'critical'
}

/**
 * Calculate control limits using 3-sigma method
 */
export function calculateControlLimits(
  data: number[],
  sigmaLevel: number = 3,
  checkRules: boolean = true
): ControlLimits {
  const n = data.length
  const mean = data.reduce((sum, val) => sum + val, 0) / n

  // Calculate standard deviation
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1)
  const sigma = Math.sqrt(variance)

  // Control limits
  const ucl = mean + sigmaLevel * sigma
  const lcl = mean - sigmaLevel * sigma

  // Check for basic violations (outside control limits)
  const violations: number[] = []
  data.forEach((value, index) => {
    if (value > ucl || value < lcl) {
      violations.push(index)
    }
  })

  // Check additional rules if requested
  const rules = checkRules ? checkControlChartRules(data, mean, sigma, ucl, lcl) : []

  return {
    mean,
    ucl,
    lcl,
    sigma,
    violations: [...new Set(violations)].sort((a, b) => a - b),
    rules
  }
}

/**
 * Nelson Rules for detecting special causes
 */
export function checkControlChartRules(
  data: number[],
  mean: number,
  sigma: number,
  ucl: number,
  lcl: number
): RuleViolation[] {
  const violations: RuleViolation[] = []

  // Rule 1: One point beyond 3σ (already checked in main function)
  const rule1Violations = data
    .map((value, index) => (value > ucl || value < lcl ? index : -1))
    .filter(index => index !== -1)

  if (rule1Violations.length > 0) {
    violations.push({
      rule: 'Rule 1',
      description: 'One or more points beyond 3σ from centerline',
      indices: rule1Violations,
      severity: 'critical'
    })
  }

  // Rule 2: 9 points in a row on same side of centerline
  let consecutiveSameSide = 0
  let lastSide = 0
  const rule2Violations: number[] = []

  for (let i = 0; i < data.length; i++) {
    const currentSide = data[i] > mean ? 1 : -1
    if (currentSide === lastSide) {
      consecutiveSameSide++
      if (consecutiveSameSide >= 9) {
        rule2Violations.push(i)
      }
    } else {
      consecutiveSameSide = 1
      lastSide = currentSide
    }
  }

  if (rule2Violations.length > 0) {
    violations.push({
      rule: 'Rule 2',
      description: '9 points in a row on same side of centerline',
      indices: rule2Violations,
      severity: 'warning'
    })
  }

  // Rule 3: 6 points in a row steadily increasing or decreasing
  for (let i = 5; i < data.length; i++) {
    let increasing = true
    let decreasing = true

    for (let j = 1; j < 6; j++) {
      if (data[i - j + 1] <= data[i - j]) increasing = false
      if (data[i - j + 1] >= data[i - j]) decreasing = false
    }

    if (increasing || decreasing) {
      violations.push({
        rule: 'Rule 3',
        description: '6 points in a row steadily increasing or decreasing',
        indices: [i - 5, i],
        severity: 'warning'
      })
      break // Only report first occurrence
    }
  }

  // Rule 4: 14 points in a row alternating up and down
  if (data.length >= 14) {
    for (let i = 13; i < data.length; i++) {
      let alternating = true
      for (let j = 0; j < 13; j++) {
        const current = data[i - j]
        const prev = data[i - j - 1]
        const prevPrev = data[i - j - 2]
        
        if (j > 0) {
          const shouldGoUp = prev < prevPrev
          const actuallyWentUp = current > prev
          if (shouldGoUp !== actuallyWentUp) {
            alternating = false
            break
          }
        }
      }

      if (alternating) {
        violations.push({
          rule: 'Rule 4',
          description: '14 points in a row alternating up and down',
          indices: [i - 13, i],
          severity: 'warning'
        })
        break
      }
    }
  }

  // Rule 5: 2 out of 3 points beyond 2σ on same side
  const zone2Upper = mean + 2 * sigma
  const zone2Lower = mean - 2 * sigma

  for (let i = 2; i < data.length; i++) {
    const last3 = data.slice(i - 2, i + 1)
    const upperCount = last3.filter(v => v > zone2Upper).length
    const lowerCount = last3.filter(v => v < zone2Lower).length

    if (upperCount >= 2 || lowerCount >= 2) {
      violations.push({
        rule: 'Rule 5',
        description: '2 out of 3 points beyond 2σ on same side',
        indices: [i - 2, i - 1, i],
        severity: 'warning'
      })
    }
  }

  // Rule 6: 4 out of 5 points beyond 1σ on same side
  const zone1Upper = mean + sigma
  const zone1Lower = mean - sigma

  for (let i = 4; i < data.length; i++) {
    const last5 = data.slice(i - 4, i + 1)
    const upperCount = last5.filter(v => v > zone1Upper).length
    const lowerCount = last5.filter(v => v < zone1Lower).length

    if (upperCount >= 4 || lowerCount >= 4) {
      violations.push({
        rule: 'Rule 6',
        description: '4 out of 5 points beyond 1σ on same side',
        indices: [i - 4, i - 3, i - 2, i - 1, i],
        severity: 'warning'
      })
    }
  }

  // Rule 7: 15 points in a row within 1σ of centerline (both sides)
  for (let i = 14; i < data.length; i++) {
    const last15 = data.slice(i - 14, i + 1)
    const allWithinZone = last15.every(v => Math.abs(v - mean) < sigma)

    if (allWithinZone) {
      violations.push({
        rule: 'Rule 7',
        description: '15 points in a row within 1σ of centerline',
        indices: [i - 14, i],
        severity: 'warning'
      })
      break
    }
  }

  // Rule 8: 8 points in a row beyond 1σ from centerline (both sides)
  for (let i = 7; i < data.length; i++) {
    const last8 = data.slice(i - 7, i + 1)
    const allBeyondZone = last8.every(v => Math.abs(v - mean) > sigma)

    if (allBeyondZone) {
      violations.push({
        rule: 'Rule 8',
        description: '8 points in a row beyond 1σ from centerline',
        indices: [i - 7, i],
        severity: 'warning'
      })
      break
    }
  }

  return violations
}

/**
 * Calculate X-bar and R chart values for subgrouped data
 */
export interface XbarRChart {
  xbar: {
    values: number[]
    mean: number
    ucl: number
    lcl: number
  }
  rChart: {
    values: number[]
    mean: number
    ucl: number
    lcl: number
  }
}

export function calculateXbarRChart(subgroups: number[][]): XbarRChart {
  const n = subgroups[0].length // Subgroup size
  
  // Calculate X-bar values
  const xbarValues = subgroups.map(group => 
    group.reduce((sum, val) => sum + val, 0) / group.length
  )
  const xbarMean = xbarValues.reduce((sum, val) => sum + val, 0) / xbarValues.length

  // Calculate R values
  const rValues = subgroups.map(group => Math.max(...group) - Math.min(...group))
  const rMean = rValues.reduce((sum, val) => sum + val, 0) / rValues.length

  // Control chart constants
  const constants = getControlChartConstants(n)

  return {
    xbar: {
      values: xbarValues,
      mean: xbarMean,
      ucl: xbarMean + constants.A2 * rMean,
      lcl: xbarMean - constants.A2 * rMean
    },
    rChart: {
      values: rValues,
      mean: rMean,
      ucl: constants.D4 * rMean,
      lcl: constants.D3 * rMean
    }
  }
}

/**
 * Control chart constants for different subgroup sizes
 */
function getControlChartConstants(n: number): {
  A2: number
  D3: number
  D4: number
  d2: number
} {
  const constants: { [key: number]: { A2: number; D3: number; D4: number; d2: number } } = {
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

  return constants[n] || constants[5] // Default to n=5 if not found
}

/**
 * Calculate process capability indices
 */
export interface ProcessCapability {
  cp: number
  cpk: number
  cpkUpper: number
  cpkLower: number
  isCapable: boolean
}

export function calculateProcessCapability(
  data: number[],
  usl: number,
  lsl: number
): ProcessCapability {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1)
  const sigma = Math.sqrt(variance)

  const cp = (usl - lsl) / (6 * sigma)
  const cpkUpper = (usl - mean) / (3 * sigma)
  const cpkLower = (mean - lsl) / (3 * sigma)
  const cpk = Math.min(cpkUpper, cpkLower)

  return {
    cp,
    cpk,
    cpkUpper,
    cpkLower,
    isCapable: cpk >= 1.33 // Industry standard for capable process
  }
}
