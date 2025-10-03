import { GuidanceWarning } from '@/types/guided-tools'

/**
 * Centralized library of reusable warnings for all guided tools
 * 
 * Naming Convention: CATEGORY_WARNING_NAME
 * Example: PROBLEM_DONT_SKIP, DATA_AVOID_ASSUMPTIONS
 */

// ============================================================================
// PROBLEM DEFINITION WARNINGS
// ============================================================================

export const PROBLEM_DONT_SKIP: GuidanceWarning = {
  id: 'warn-problem-dont-skip',
  type: 'warning',
  title: 'Don\'t Skip This Step',
  content: 'A vague problem statement will lead to incomplete analysis. Take time to be specific before moving forward.',
  severity: 'high'
}

export const PROBLEM_AVOID_BLAME: GuidanceWarning = {
  id: 'warn-problem-avoid-blame',
  type: 'warning',
  title: 'Avoid Blaming People',
  content: 'Focus on process and system failures, not individuals. People work within systems—fix the system.',
  severity: 'high'
}

export const PROBLEM_DONT_JUMP_TO_SOLUTIONS: GuidanceWarning = {
  id: 'warn-problem-no-solutions',
  type: 'warning',
  title: 'Don\'t Jump to Solutions',
  content: 'Resist the urge to propose solutions now. First understand the problem completely.',
  severity: 'medium'
}

// ============================================================================
// DATA COLLECTION WARNINGS
// ============================================================================

export const DATA_AVOID_ASSUMPTIONS: GuidanceWarning = {
  id: 'warn-data-assumptions',
  type: 'warning',
  title: 'Avoid Assumptions',
  content: 'Don\'t assume you know what the data will show. Collect actual data—you might be surprised.',
  severity: 'high'
}

export const DATA_CHECK_MEASUREMENT_SYSTEM: GuidanceWarning = {
  id: 'warn-data-measurement',
  type: 'warning',
  title: 'Verify Measurement System',
  content: 'If your data collection method is flawed, all analysis will be flawed. Validate your measurement system first.',
  severity: 'high'
}

export const DATA_SAMPLE_SIZE_MATTERS: GuidanceWarning = {
  id: 'warn-data-sample-size',
  type: 'warning',
  title: 'Sample Size Matters',
  content: 'Too little data leads to unreliable conclusions. Ensure you have enough data points for statistical validity.',
  severity: 'medium'
}

// ============================================================================
// ROOT CAUSE ANALYSIS WARNINGS
// ============================================================================

export const RCA_DONT_STOP_AT_SYMPTOMS: GuidanceWarning = {
  id: 'warn-rca-symptoms',
  type: 'warning',
  title: 'Don\'t Stop at Symptoms',
  content: 'Keep digging deeper. Surface-level causes are symptoms, not root causes. The real cause is usually 3-5 levels deep.',
  severity: 'high'
}

export const RCA_AVOID_SINGLE_CAUSE: GuidanceWarning = {
  id: 'warn-rca-single-cause',
  type: 'warning',
  title: 'Avoid Single-Cause Thinking',
  content: 'Most problems have multiple contributing causes. Look for all factors, not just the most obvious one.',
  severity: 'medium'
}

export const RCA_VERIFY_BEFORE_ACTING: GuidanceWarning = {
  id: 'warn-rca-verify',
  type: 'warning',
  title: 'Verify Before Acting',
  content: 'Test your root cause theory before implementing expensive countermeasures. Wrong diagnosis = wasted effort.',
  severity: 'high'
}

// ============================================================================
// SOLUTION DEVELOPMENT WARNINGS
// ============================================================================

export const SOLUTION_DONT_BAND_AID: GuidanceWarning = {
  id: 'warn-solution-band-aid',
  type: 'warning',
  title: 'Avoid Band-Aid Solutions',
  content: 'Quick fixes might stop the bleeding, but they don\'t heal the wound. Address the root cause, not just symptoms.',
  severity: 'high'
}

export const SOLUTION_CONSIDER_SIDE_EFFECTS: GuidanceWarning = {
  id: 'warn-solution-side-effects',
  type: 'warning',
  title: 'Consider Unintended Consequences',
  content: 'Every change has ripple effects. Think through how your solution might impact other areas.',
  severity: 'medium'
}

export const SOLUTION_PILOT_FIRST: GuidanceWarning = {
  id: 'warn-solution-pilot',
  type: 'info',
  title: 'Pilot Before Full Rollout',
  content: 'Test solutions on a small scale first. This reduces risk and allows for adjustments before company-wide implementation.',
  severity: 'low'
}

// ============================================================================
// ORGANIZED BY CATEGORY
// ============================================================================

export const WARNINGS_BY_CATEGORY = {
  PROBLEM_DEFINITION: [
    PROBLEM_DONT_SKIP,
    PROBLEM_AVOID_BLAME,
    PROBLEM_DONT_JUMP_TO_SOLUTIONS
  ],
  DATA_COLLECTION: [
    DATA_AVOID_ASSUMPTIONS,
    DATA_CHECK_MEASUREMENT_SYSTEM,
    DATA_SAMPLE_SIZE_MATTERS
  ],
  ROOT_CAUSE_ANALYSIS: [
    RCA_DONT_STOP_AT_SYMPTOMS,
    RCA_AVOID_SINGLE_CAUSE,
    RCA_VERIFY_BEFORE_ACTING
  ],
  SOLUTION_DEVELOPMENT: [
    SOLUTION_DONT_BAND_AID,
    SOLUTION_CONSIDER_SIDE_EFFECTS,
    SOLUTION_PILOT_FIRST
  ]
}

// ============================================================================
// ALL WARNINGS (ALPHABETICAL)
// ============================================================================

export const ALL_WARNINGS = [
  DATA_AVOID_ASSUMPTIONS,
  DATA_CHECK_MEASUREMENT_SYSTEM,
  DATA_SAMPLE_SIZE_MATTERS,
  PROBLEM_AVOID_BLAME,
  PROBLEM_DONT_JUMP_TO_SOLUTIONS,
  PROBLEM_DONT_SKIP,
  RCA_AVOID_SINGLE_CAUSE,
  RCA_DONT_STOP_AT_SYMPTOMS,
  RCA_VERIFY_BEFORE_ACTING,
  SOLUTION_CONSIDER_SIDE_EFFECTS,
  SOLUTION_DONT_BAND_AID,
  SOLUTION_PILOT_FIRST
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getWarningById = (id: string): GuidanceWarning | undefined => {
  return ALL_WARNINGS.find(warning => warning.id === id)
}

export const getWarningsByCategory = (category: keyof typeof WARNINGS_BY_CATEGORY): GuidanceWarning[] => {
  return WARNINGS_BY_CATEGORY[category] || []
}

export const getWarningsBySeverity = (severity: 'low' | 'medium' | 'high'): GuidanceWarning[] => {
  return ALL_WARNINGS.filter(warning => warning.severity === severity)
}

export const searchWarnings = (query: string): GuidanceWarning[] => {
  const lowerQuery = query.toLowerCase()
  return ALL_WARNINGS.filter(warning => 
    warning.title.toLowerCase().includes(lowerQuery) ||
    warning.content.toLowerCase().includes(lowerQuery)
  )
}
