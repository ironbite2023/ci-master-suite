/**
 * Nelson Rules Engine for Control Chart Pattern Detection
 * Implements all 8 Nelson Rules for identifying out-of-control conditions
 * 
 * Reference: Nelson, L.S. (1984). "The Shewhart Control Chart—Tests for Special Causes"
 */

import {
  Subgroup,
  ControlLimits,
  classifyXBarPoint,
  isAboveCenterLine,
  calculateTrend,
  isAlternating
} from './controlCharts'

// ============================================================================
// TYPES
// ============================================================================

export interface NelsonRuleResult {
  ruleName: string
  ruleNumber: number
  violated: boolean
  violationIndices: number[]
  severity: 'high' | 'medium' | 'low'
  description: string
  recommendation: string
  chart: 'xbar' | 'range'
}

export interface Violation {
  id: string
  subgroupIndex: number
  subgroupNumber: number
  rule: string
  ruleNumber: number
  severity: 'high' | 'medium' | 'low'
  description: string
  recommendation: string
  chart: 'xbar' | 'range'
}

export interface NelsonAnalysis {
  violations: Violation[]
  totalViolations: number
  highSeverityCount: number
  mediumSeverityCount: number
  lowSeverityCount: number
  isStable: boolean
  summary: string
}

// ============================================================================
// NELSON RULES CONFIGURATION
// ============================================================================

const NELSON_RULES = {
  RULE_1: {
    name: 'Point Beyond 3σ',
    severity: 'high' as const,
    description: 'One or more points fall outside the 3σ control limits',
    recommendation: 'Investigate for special cause variation. Check for process changes, equipment issues, or measurement errors.'
  },
  RULE_2: {
    name: 'Nine Points on Same Side',
    severity: 'medium' as const,
    description: 'Nine consecutive points fall on the same side of the center line',
    recommendation: 'Process mean may have shifted. Check for sustained changes in materials, methods, or environmental conditions.'
  },
  RULE_3: {
    name: 'Six Points Trending',
    severity: 'medium' as const,
    description: 'Six consecutive points steadily increasing or decreasing',
    recommendation: 'Process is trending. Look for gradual tool wear, temperature drift, or operator fatigue.'
  },
  RULE_4: {
    name: 'Fourteen Points Alternating',
    severity: 'low' as const,
    description: 'Fourteen consecutive points alternate up and down',
    recommendation: 'Process may have systematic variation. Check for alternating operators, batches, or measurement systems.'
  },
  RULE_5: {
    name: 'Two of Three Beyond 2σ',
    severity: 'medium' as const,
    description: 'Two out of three consecutive points fall beyond 2σ (same side)',
    recommendation: 'Increased variation detected. Investigate potential causes of process instability.'
  },
  RULE_6: {
    name: 'Four of Five Beyond 1σ',
    severity: 'low' as const,
    description: 'Four out of five consecutive points fall beyond 1σ (same side)',
    recommendation: 'Process variation is higher than expected. Monitor closely and check for emerging issues.'
  },
  RULE_7: {
    name: 'Fifteen Points Within 1σ',
    severity: 'low' as const,
    description: 'Fifteen consecutive points fall within 1σ of center line',
    recommendation: 'Unusually low variation. Verify data accuracy and check if process capability has improved or if stratification is occurring.'
  },
  RULE_8: {
    name: 'Eight Points Beyond 1σ',
    severity: 'medium' as const,
    description: 'Eight consecutive points fall beyond 1σ on either side of center line',
    recommendation: 'Process variation has increased. Investigate causes of higher variability.'
  }
} as const

// ============================================================================
// RULE 1: Point Beyond 3σ (Outside Control Limits)
// ============================================================================

/**
 * Rule 1: One or more points beyond 3σ control limits
 * Severity: HIGH
 */
export function checkRule1(
  subgroups: Subgroup[],
  controlLimits: ControlLimits
): NelsonRuleResult {
  const violationIndices: number[] = []

  subgroups.forEach((subgroup, index) => {
    const zone = classifyXBarPoint(subgroup.mean, controlLimits)
    if (zone === 'beyond_3sigma' || zone === 'below_lcl') {
      violationIndices.push(index)
    }
  })

  return {
    ruleName: NELSON_RULES.RULE_1.name,
    ruleNumber: 1,
    violated: violationIndices.length > 0,
    violationIndices,
    severity: NELSON_RULES.RULE_1.severity,
    description: NELSON_RULES.RULE_1.description,
    recommendation: NELSON_RULES.RULE_1.recommendation,
    chart: 'xbar'
  }
}

// ============================================================================
// RULE 2: Nine Consecutive Points on Same Side of Center Line
// ============================================================================

/**
 * Rule 2: Nine consecutive points on same side of center line
 * Severity: MEDIUM
 */
export function checkRule2(
  subgroups: Subgroup[],
  controlLimits: ControlLimits
): NelsonRuleResult {
  const violationIndices: number[] = []
  const centerLine = controlLimits.xBarCL
  const windowSize = 9

  for (let i = windowSize - 1; i < subgroups.length; i++) {
    const window = subgroups.slice(i - windowSize + 1, i + 1)
    const firstIsAbove = isAboveCenterLine(window[0].mean, centerLine)
    
    const allOnSameSide = window.every(sg => 
      isAboveCenterLine(sg.mean, centerLine) === firstIsAbove
    )

    if (allOnSameSide) {
      // Mark all 9 points in the window
      for (let j = i - windowSize + 1; j <= i; j++) {
        if (!violationIndices.includes(j)) {
          violationIndices.push(j)
        }
      }
    }
  }

  return {
    ruleName: NELSON_RULES.RULE_2.name,
    ruleNumber: 2,
    violated: violationIndices.length > 0,
    violationIndices: violationIndices.sort((a, b) => a - b),
    severity: NELSON_RULES.RULE_2.severity,
    description: NELSON_RULES.RULE_2.description,
    recommendation: NELSON_RULES.RULE_2.recommendation,
    chart: 'xbar'
  }
}

// ============================================================================
// RULE 3: Six Consecutive Points Steadily Increasing or Decreasing
// ============================================================================

/**
 * Rule 3: Six consecutive points trending up or down
 * Severity: MEDIUM
 */
export function checkRule3(
  subgroups: Subgroup[]
): NelsonRuleResult {
  const violationIndices: number[] = []
  const windowSize = 6

  for (let i = windowSize - 1; i < subgroups.length; i++) {
    const window = subgroups.slice(i - windowSize + 1, i + 1)
    const values = window.map(sg => sg.mean)
    const trend = calculateTrend(values)

    if (trend === 'increasing' || trend === 'decreasing') {
      // Mark all 6 points in the window
      for (let j = i - windowSize + 1; j <= i; j++) {
        if (!violationIndices.includes(j)) {
          violationIndices.push(j)
        }
      }
    }
  }

  return {
    ruleName: NELSON_RULES.RULE_3.name,
    ruleNumber: 3,
    violated: violationIndices.length > 0,
    violationIndices: violationIndices.sort((a, b) => a - b),
    severity: NELSON_RULES.RULE_3.severity,
    description: NELSON_RULES.RULE_3.description,
    recommendation: NELSON_RULES.RULE_3.recommendation,
    chart: 'xbar'
  }
}

// ============================================================================
// RULE 4: Fourteen Consecutive Points Alternating Up and Down
// ============================================================================

/**
 * Rule 4: Fourteen consecutive points alternating
 * Severity: LOW
 */
export function checkRule4(
  subgroups: Subgroup[]
): NelsonRuleResult {
  const violationIndices: number[] = []
  const windowSize = 14

  for (let i = windowSize - 1; i < subgroups.length; i++) {
    const window = subgroups.slice(i - windowSize + 1, i + 1)
    const values = window.map(sg => sg.mean)

    if (isAlternating(values)) {
      // Mark all 14 points in the window
      for (let j = i - windowSize + 1; j <= i; j++) {
        if (!violationIndices.includes(j)) {
          violationIndices.push(j)
        }
      }
    }
  }

  return {
    ruleName: NELSON_RULES.RULE_4.name,
    ruleNumber: 4,
    violated: violationIndices.length > 0,
    violationIndices: violationIndices.sort((a, b) => a - b),
    severity: NELSON_RULES.RULE_4.severity,
    description: NELSON_RULES.RULE_4.description,
    recommendation: NELSON_RULES.RULE_4.recommendation,
    chart: 'xbar'
  }
}

// ============================================================================
// RULE 5: Two of Three Consecutive Points Beyond 2σ (Same Side)
// ============================================================================

/**
 * Rule 5: Two out of three consecutive points beyond 2σ on same side
 * Severity: MEDIUM
 */
export function checkRule5(
  subgroups: Subgroup[],
  controlLimits: ControlLimits
): NelsonRuleResult {
  const violationIndices: number[] = []
  const windowSize = 3

  for (let i = windowSize - 1; i < subgroups.length; i++) {
    const window = subgroups.slice(i - windowSize + 1, i + 1)
    
    // Check upper side (above CL + 2σ)
    const upperCount = window.filter(sg => 
      sg.mean > controlLimits.xBarCL + controlLimits.xBar2Sigma
    ).length
    
    // Check lower side (below CL - 2σ)
    const lowerCount = window.filter(sg => 
      sg.mean < controlLimits.xBarCL - controlLimits.xBar2Sigma
    ).length

    if (upperCount >= 2 || lowerCount >= 2) {
      // Mark the points that contributed to violation
      for (let j = i - windowSize + 1; j <= i; j++) {
        const sg = subgroups[j]
        const isBeyond2Sigma = 
          sg.mean > controlLimits.xBarCL + controlLimits.xBar2Sigma ||
          sg.mean < controlLimits.xBarCL - controlLimits.xBar2Sigma
        
        if (isBeyond2Sigma && !violationIndices.includes(j)) {
          violationIndices.push(j)
        }
      }
    }
  }

  return {
    ruleName: NELSON_RULES.RULE_5.name,
    ruleNumber: 5,
    violated: violationIndices.length > 0,
    violationIndices: violationIndices.sort((a, b) => a - b),
    severity: NELSON_RULES.RULE_5.severity,
    description: NELSON_RULES.RULE_5.description,
    recommendation: NELSON_RULES.RULE_5.recommendation,
    chart: 'xbar'
  }
}

// ============================================================================
// RULE 6: Four of Five Consecutive Points Beyond 1σ (Same Side)
// ============================================================================

/**
 * Rule 6: Four out of five consecutive points beyond 1σ on same side
 * Severity: LOW
 */
export function checkRule6(
  subgroups: Subgroup[],
  controlLimits: ControlLimits
): NelsonRuleResult {
  const violationIndices: number[] = []
  const windowSize = 5

  for (let i = windowSize - 1; i < subgroups.length; i++) {
    const window = subgroups.slice(i - windowSize + 1, i + 1)
    
    // Check upper side (above CL + 1σ)
    const upperCount = window.filter(sg => 
      sg.mean > controlLimits.xBarCL + controlLimits.xBar1Sigma
    ).length
    
    // Check lower side (below CL - 1σ)
    const lowerCount = window.filter(sg => 
      sg.mean < controlLimits.xBarCL - controlLimits.xBar1Sigma
    ).length

    if (upperCount >= 4 || lowerCount >= 4) {
      // Mark the points that contributed to violation
      for (let j = i - windowSize + 1; j <= i; j++) {
        const sg = subgroups[j]
        const isBeyond1Sigma = 
          sg.mean > controlLimits.xBarCL + controlLimits.xBar1Sigma ||
          sg.mean < controlLimits.xBarCL - controlLimits.xBar1Sigma
        
        if (isBeyond1Sigma && !violationIndices.includes(j)) {
          violationIndices.push(j)
        }
      }
    }
  }

  return {
    ruleName: NELSON_RULES.RULE_6.name,
    ruleNumber: 6,
    violated: violationIndices.length > 0,
    violationIndices: violationIndices.sort((a, b) => a - b),
    severity: NELSON_RULES.RULE_6.severity,
    description: NELSON_RULES.RULE_6.description,
    recommendation: NELSON_RULES.RULE_6.recommendation,
    chart: 'xbar'
  }
}

// ============================================================================
// RULE 7: Fifteen Consecutive Points Within 1σ (Both Sides)
// ============================================================================

/**
 * Rule 7: Fifteen consecutive points within 1σ of center line
 * Severity: LOW (indicates unusual low variation)
 */
export function checkRule7(
  subgroups: Subgroup[],
  controlLimits: ControlLimits
): NelsonRuleResult {
  const violationIndices: number[] = []
  const windowSize = 15

  for (let i = windowSize - 1; i < subgroups.length; i++) {
    const window = subgroups.slice(i - windowSize + 1, i + 1)
    
    const allWithin1Sigma = window.every(sg => {
      const distance = Math.abs(sg.mean - controlLimits.xBarCL)
      return distance <= controlLimits.xBar1Sigma
    })

    if (allWithin1Sigma) {
      // Mark all 15 points in the window
      for (let j = i - windowSize + 1; j <= i; j++) {
        if (!violationIndices.includes(j)) {
          violationIndices.push(j)
        }
      }
    }
  }

  return {
    ruleName: NELSON_RULES.RULE_7.name,
    ruleNumber: 7,
    violated: violationIndices.length > 0,
    violationIndices: violationIndices.sort((a, b) => a - b),
    severity: NELSON_RULES.RULE_7.severity,
    description: NELSON_RULES.RULE_7.description,
    recommendation: NELSON_RULES.RULE_7.recommendation,
    chart: 'xbar'
  }
}

// ============================================================================
// RULE 8: Eight Consecutive Points Beyond 1σ (Either Side)
// ============================================================================

/**
 * Rule 8: Eight consecutive points beyond 1σ on either side
 * Severity: MEDIUM
 */
export function checkRule8(
  subgroups: Subgroup[],
  controlLimits: ControlLimits
): NelsonRuleResult {
  const violationIndices: number[] = []
  const windowSize = 8

  for (let i = windowSize - 1; i < subgroups.length; i++) {
    const window = subgroups.slice(i - windowSize + 1, i + 1)
    
    const allBeyond1Sigma = window.every(sg => {
      const distance = Math.abs(sg.mean - controlLimits.xBarCL)
      return distance > controlLimits.xBar1Sigma
    })

    if (allBeyond1Sigma) {
      // Mark all 8 points in the window
      for (let j = i - windowSize + 1; j <= i; j++) {
        if (!violationIndices.includes(j)) {
          violationIndices.push(j)
        }
      }
    }
  }

  return {
    ruleName: NELSON_RULES.RULE_8.name,
    ruleNumber: 8,
    violated: violationIndices.length > 0,
    violationIndices: violationIndices.sort((a, b) => a - b),
    severity: NELSON_RULES.RULE_8.severity,
    description: NELSON_RULES.RULE_8.description,
    recommendation: NELSON_RULES.RULE_8.recommendation,
    chart: 'xbar'
  }
}

// ============================================================================
// RANGE CHART RULE: Point Outside R Chart Control Limits
// ============================================================================

/**
 * Range Chart Rule: One or more points outside R chart limits
 * Severity: HIGH
 */
export function checkRangeChartViolations(
  subgroups: Subgroup[],
  controlLimits: ControlLimits
): NelsonRuleResult {
  const violationIndices: number[] = []

  subgroups.forEach((subgroup, index) => {
    if (
      subgroup.range > controlLimits.rBarUCL ||
      subgroup.range < controlLimits.rBarLCL
    ) {
      violationIndices.push(index)
    }
  })

  return {
    ruleName: 'R Chart Violation',
    ruleNumber: 0,
    violated: violationIndices.length > 0,
    violationIndices,
    severity: 'high',
    description: 'One or more subgroup ranges fall outside R chart control limits',
    recommendation: 'Process variation is unstable. Check for inconsistent inputs, changing conditions, or measurement issues.',
    chart: 'range'
  }
}

// ============================================================================
// MAIN NELSON RULES ANALYSIS
// ============================================================================

/**
 * Run all Nelson Rules and return complete analysis
 */
export function performNelsonAnalysis(
  subgroups: Subgroup[],
  controlLimits: ControlLimits
): NelsonAnalysis {
  // Run all 8 Nelson Rules
  const rule1 = checkRule1(subgroups, controlLimits)
  const rule2 = checkRule2(subgroups, controlLimits)
  const rule3 = checkRule3(subgroups)
  const rule4 = checkRule4(subgroups)
  const rule5 = checkRule5(subgroups, controlLimits)
  const rule6 = checkRule6(subgroups, controlLimits)
  const rule7 = checkRule7(subgroups, controlLimits)
  const rule8 = checkRule8(subgroups, controlLimits)
  const rangeRule = checkRangeChartViolations(subgroups, controlLimits)

  const allRules = [rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rangeRule]

  // Convert to Violation objects
  const violations: Violation[] = []

  allRules.forEach(rule => {
    if (rule.violated) {
      rule.violationIndices.forEach(index => {
        violations.push({
          id: `violation-${rule.ruleNumber}-${index}-${Date.now()}`,
          subgroupIndex: index,
          subgroupNumber: subgroups[index].subgroupNumber,
          rule: rule.ruleName,
          ruleNumber: rule.ruleNumber,
          severity: rule.severity,
          description: rule.description,
          recommendation: rule.recommendation,
          chart: rule.chart
        })
      })
    }
  })

  // Count by severity
  const highSeverityCount = violations.filter(v => v.severity === 'high').length
  const mediumSeverityCount = violations.filter(v => v.severity === 'medium').length
  const lowSeverityCount = violations.filter(v => v.severity === 'low').length

  // Determine if stable
  const isStable = highSeverityCount === 0 && mediumSeverityCount === 0

  // Generate summary
  let summary = ''
  if (isStable && lowSeverityCount === 0) {
    summary = 'Process is in statistical control. No special causes detected.'
  } else if (isStable && lowSeverityCount > 0) {
    summary = `Process is stable with ${lowSeverityCount} minor pattern(s) detected. Monitor closely.`
  } else if (highSeverityCount > 0) {
    summary = `Process is OUT OF CONTROL. ${highSeverityCount} high-severity violation(s) detected. Immediate action required.`
  } else {
    summary = `Process shows instability. ${mediumSeverityCount} medium-severity violation(s) detected. Investigation recommended.`
  }

  return {
    violations,
    totalViolations: violations.length,
    highSeverityCount,
    mediumSeverityCount,
    lowSeverityCount,
    isStable,
    summary
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get violations for a specific subgroup
 */
export function getViolationsForSubgroup(
  subgroupIndex: number,
  analysis: NelsonAnalysis
): Violation[] {
  return analysis.violations.filter(v => v.subgroupIndex === subgroupIndex)
}

/**
 * Get violations by rule number
 */
export function getViolationsByRule(
  ruleNumber: number,
  analysis: NelsonAnalysis
): Violation[] {
  return analysis.violations.filter(v => v.ruleNumber === ruleNumber)
}

/**
 * Get violations by severity
 */
export function getViolationsBySeverity(
  severity: 'high' | 'medium' | 'low',
  analysis: NelsonAnalysis
): Violation[] {
  return analysis.violations.filter(v => v.severity === severity)
}

/**
 * Check if a specific subgroup has violations
 */
export function hasViolations(
  subgroupIndex: number,
  analysis: NelsonAnalysis
): boolean {
  return analysis.violations.some(v => v.subgroupIndex === subgroupIndex)
}

/**
 * Get the most severe violation for a subgroup
 */
export function getMostSevereViolation(
  subgroupIndex: number,
  analysis: NelsonAnalysis
): Violation | null {
  const subgroupViolations = getViolationsForSubgroup(subgroupIndex, analysis)
  
  if (subgroupViolations.length === 0) return null

  // Priority: high > medium > low
  const highSeverity = subgroupViolations.find(v => v.severity === 'high')
  if (highSeverity) return highSeverity

  const mediumSeverity = subgroupViolations.find(v => v.severity === 'medium')
  if (mediumSeverity) return mediumSeverity

  return subgroupViolations[0]
}

/**
 * Format violations for display
 */
export function formatViolationSummary(analysis: NelsonAnalysis): string {
  if (analysis.totalViolations === 0) {
    return 'No violations detected. Process is stable.'
  }

  const parts: string[] = []
  
  if (analysis.highSeverityCount > 0) {
    parts.push(`${analysis.highSeverityCount} high-severity`)
  }
  if (analysis.mediumSeverityCount > 0) {
    parts.push(`${analysis.mediumSeverityCount} medium-severity`)
  }
  if (analysis.lowSeverityCount > 0) {
    parts.push(`${analysis.lowSeverityCount} low-severity`)
  }

  return `${analysis.totalViolations} violation(s): ${parts.join(', ')}`
}

/**
 * Export violations to CSV
 */
export function exportViolationsToCSV(analysis: NelsonAnalysis): string {
  const headers = ['Subgroup', 'Rule', 'Severity', 'Description', 'Chart']
  const rows = analysis.violations.map(v => [
    v.subgroupNumber,
    `Rule ${v.ruleNumber}: ${v.rule}`,
    v.severity,
    v.description,
    v.chart
  ])

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
}

// ============================================================================
// EDUCATIONAL INSIGHTS
// ============================================================================

/**
 * Generate educational insights from violations
 */
export function generateEducationalInsights(analysis: NelsonAnalysis): string[] {
  const insights: string[] = []

  if (analysis.isStable) {
    insights.push('✅ Your process is in statistical control - well done!')
    insights.push('📊 All points are within expected variation limits')
    insights.push('🎯 Focus on capability: Can this stable process meet specifications?')
  } else {
    insights.push('⚠️ Special cause variation detected in your process')
    insights.push('🔍 Investigate the root causes of out-of-control signals')
    insights.push('🛠️ Take corrective action before proceeding to capability analysis')
  }

  // Rule-specific insights
  const violatedRules = new Set(analysis.violations.map(v => v.ruleNumber))

  if (violatedRules.has(1)) {
    insights.push('🔴 Rule 1: Extreme values detected - high-priority investigation needed')
  }
  if (violatedRules.has(2)) {
    insights.push('📈 Rule 2: Process mean may have shifted - check for sustained changes')
  }
  if (violatedRules.has(3)) {
    insights.push('📉 Rule 3: Trending detected - look for gradual process drift')
  }
  if (violatedRules.has(7)) {
    insights.push('🔵 Rule 7: Unusually low variation - verify data quality or stratification')
  }

  return insights
}
