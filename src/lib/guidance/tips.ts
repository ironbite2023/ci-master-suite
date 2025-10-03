import { GuidanceTip } from '@/types/guided-tools'

/**
 * Centralized library of reusable tips for all guided tools
 * 
 * Naming Convention: CATEGORY_SPECIFIC_NAME
 * Example: PROBLEM_BE_SPECIFIC, DATA_USE_NUMBERS
 */

// ============================================================================
// PROBLEM DEFINITION TIPS
// ============================================================================

export const PROBLEM_BE_SPECIFIC: GuidanceTip = {
  id: 'tip-problem-be-specific',
  icon: '💡',
  title: 'Be Specific and Measurable',
  content: 'Include specific metrics, timeframes, locations, and conditions. Vague problems lead to vague solutions.',
  priority: 'high'
}

export const PROBLEM_USE_DATA: GuidanceTip = {
  id: 'tip-problem-use-data',
  icon: '📊',
  title: 'Quantify with Data',
  content: 'Use numbers to describe the problem. "Defect rate increased from 2% to 8%" is better than "quality is bad".',
  priority: 'high'
}

export const PROBLEM_FOCUS_ON_EFFECT: GuidanceTip = {
  id: 'tip-problem-focus-effect',
  icon: '🎯',
  title: 'Focus on the Effect, Not Causes',
  content: 'State what is happening, not why. Save the cause analysis for later steps.',
  priority: 'medium'
}

export const PROBLEM_SHOW_GAP: GuidanceTip = {
  id: 'tip-problem-show-gap',
  icon: '📏',
  title: 'Show Current vs. Target',
  content: 'Clearly state where you are now vs. where you want to be. This helps prioritize the problem.',
  priority: 'medium'
}

// ============================================================================
// DATA COLLECTION TIPS
// ============================================================================

export const DATA_COLLECT_BASELINE: GuidanceTip = {
  id: 'tip-data-collect-baseline',
  icon: '📈',
  title: 'Establish Baseline First',
  content: 'Measure current performance before making changes. You can\'t improve what you don\'t measure.',
  priority: 'high'
}

export const DATA_USE_STRATIFICATION: GuidanceTip = {
  id: 'tip-data-stratification',
  icon: '🔍',
  title: 'Stratify Your Data',
  content: 'Break data down by time, location, shift, product line, etc. Patterns often hide in subgroups.',
  priority: 'medium'
}

export const DATA_VERIFY_ACCURACY: GuidanceTip = {
  id: 'tip-data-verify',
  icon: '✓',
  title: 'Verify Data Accuracy',
  content: 'Check measurement systems before trusting data. Bad data leads to bad decisions.',
  priority: 'high'
}

// ============================================================================
// ROOT CAUSE ANALYSIS TIPS
// ============================================================================

export const RCA_ASK_WHY_FIVE_TIMES: GuidanceTip = {
  id: 'tip-rca-five-why',
  icon: '❓',
  title: 'Ask "Why?" Five Times',
  content: 'Keep asking why until you reach a root cause you can control. Stop at surface causes and problems recur.',
  priority: 'high'
}

export const RCA_LOOK_FOR_SYSTEM_ISSUES: GuidanceTip = {
  id: 'tip-rca-system-issues',
  icon: '🔧',
  title: 'Focus on Systems, Not People',
  content: 'Look for process, equipment, and system failures rather than blaming individuals.',
  priority: 'high'
}

export const RCA_VERIFY_WITH_DATA: GuidanceTip = {
  id: 'tip-rca-verify',
  icon: '📊',
  title: 'Verify Root Causes with Data',
  content: 'Test your theory. Does the data support this as a root cause? Or is it just a guess?',
  priority: 'medium'
}

// ============================================================================
// TEAM COLLABORATION TIPS
// ============================================================================

export const TEAM_INVOLVE_EXPERTS: GuidanceTip = {
  id: 'tip-team-involve-experts',
  icon: '👥',
  title: 'Involve Those Who Do the Work',
  content: 'People closest to the problem have the best insights. Don\'t analyze in isolation.',
  priority: 'high'
}

export const TEAM_DIVERSE_PERSPECTIVES: GuidanceTip = {
  id: 'tip-team-diverse',
  icon: '🌐',
  title: 'Seek Diverse Perspectives',
  content: 'Include different roles, shifts, and experience levels. Diversity reveals blind spots.',
  priority: 'medium'
}

export const TEAM_DOCUMENT_SESSIONS: GuidanceTip = {
  id: 'tip-team-document',
  icon: '📝',
  title: 'Document Team Discussions',
  content: 'Capture insights, disagreements, and rationale. This helps later and builds institutional knowledge.',
  priority: 'low'
}

// ============================================================================
// ORGANIZED BY CATEGORY
// ============================================================================

export const TIPS_BY_CATEGORY = {
  PROBLEM_DEFINITION: [
    PROBLEM_BE_SPECIFIC,
    PROBLEM_USE_DATA,
    PROBLEM_FOCUS_ON_EFFECT,
    PROBLEM_SHOW_GAP
  ],
  DATA_COLLECTION: [
    DATA_COLLECT_BASELINE,
    DATA_USE_STRATIFICATION,
    DATA_VERIFY_ACCURACY
  ],
  ROOT_CAUSE_ANALYSIS: [
    RCA_ASK_WHY_FIVE_TIMES,
    RCA_LOOK_FOR_SYSTEM_ISSUES,
    RCA_VERIFY_WITH_DATA
  ],
  TEAM_COLLABORATION: [
    TEAM_INVOLVE_EXPERTS,
    TEAM_DIVERSE_PERSPECTIVES,
    TEAM_DOCUMENT_SESSIONS
  ]
}

// ============================================================================
// ALL TIPS (ALPHABETICAL)
// ============================================================================

export const ALL_TIPS = [
  DATA_COLLECT_BASELINE,
  DATA_USE_STRATIFICATION,
  DATA_VERIFY_ACCURACY,
  PROBLEM_BE_SPECIFIC,
  PROBLEM_FOCUS_ON_EFFECT,
  PROBLEM_SHOW_GAP,
  PROBLEM_USE_DATA,
  RCA_ASK_WHY_FIVE_TIMES,
  RCA_LOOK_FOR_SYSTEM_ISSUES,
  RCA_VERIFY_WITH_DATA,
  TEAM_DIVERSE_PERSPECTIVES,
  TEAM_DOCUMENT_SESSIONS,
  TEAM_INVOLVE_EXPERTS
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getTipById = (id: string): GuidanceTip | undefined => {
  return ALL_TIPS.find(tip => tip.id === id)
}

export const getTipsByCategory = (category: keyof typeof TIPS_BY_CATEGORY): GuidanceTip[] => {
  return TIPS_BY_CATEGORY[category] || []
}

export const searchTips = (query: string): GuidanceTip[] => {
  const lowerQuery = query.toLowerCase()
  return ALL_TIPS.filter(tip => 
    tip.title.toLowerCase().includes(lowerQuery) ||
    tip.content.toLowerCase().includes(lowerQuery)
  )
}
