import { BestPractice } from '@/types/guided-tools'

/**
 * Centralized library of reusable best practices for all guided tools
 * 
 * Naming Convention: CATEGORY_PRACTICE_NAME
 * Example: PROBLEM_USE_DATA_DRIVEN, RCA_GEMBA_WALK
 */

// ============================================================================
// PROBLEM DEFINITION BEST PRACTICES
// ============================================================================

export const PROBLEM_USE_DATA_DRIVEN: BestPractice = {
  id: 'bp-problem-data-driven',
  practice: 'Use data to quantify the problem when possible',
  rationale: 'Numbers make the problem concrete and measurable, helping with prioritization and tracking improvement.'
}

export const PROBLEM_DEFINE_SCOPE: BestPractice = {
  id: 'bp-problem-scope',
  practice: 'Define clear boundaries: what\'s IN scope and what\'s OUT',
  rationale: 'Prevents scope creep and keeps the team focused on solving the right problem.'
}

export const PROBLEM_SHOW_IMPACT: BestPractice = {
  id: 'bp-problem-impact',
  practice: 'Quantify the impact: cost, time, quality, safety, or customer satisfaction',
  rationale: 'Demonstrates business value and helps justify resources needed for improvement.'
}

// ============================================================================
// DATA COLLECTION BEST PRACTICES
// ============================================================================

export const DATA_USE_CHECK_SHEETS: BestPractice = {
  id: 'bp-data-check-sheets',
  practice: 'Use structured check sheets or forms for data collection',
  rationale: 'Ensures consistency across collectors and reduces errors in data recording.'
}

export const DATA_TRAIN_COLLECTORS: BestPractice = {
  id: 'bp-data-train',
  practice: 'Train all data collectors on the measurement method',
  rationale: 'Reduces variation between collectors and improves data reliability (Gage R&R).'
}

export const DATA_DOCUMENT_METHOD: BestPractice = {
  id: 'bp-data-document',
  practice: 'Document your data collection method in detail',
  rationale: 'Allows others to replicate your study and verify results. Critical for credibility.'
}

// ============================================================================
// ROOT CAUSE ANALYSIS BEST PRACTICES
// ============================================================================

export const RCA_GO_TO_GEMBA: BestPractice = {
  id: 'bp-rca-gemba',
  practice: 'Go to Gemba (the actual place) and observe the process',
  rationale: 'Seeing the process firsthand reveals insights you\'ll never get from a conference room.'
}

export const RCA_USE_MULTIPLE_TOOLS: BestPractice = {
  id: 'bp-rca-multiple-tools',
  practice: 'Use multiple analysis tools (5 Why, Fishbone, Pareto)',
  rationale: 'Different tools reveal different insights. Triangulation leads to more robust conclusions.'
}

export const RCA_VERIFY_WITH_DATA: BestPractice = {
  id: 'bp-rca-verify',
  practice: 'Test your root cause hypothesis with data or experiments',
  rationale: 'Proves causation, not just correlation. Prevents wasting resources on wrong fixes.'
}

// ============================================================================
// SOLUTION DEVELOPMENT BEST PRACTICES
// ============================================================================

export const SOLUTION_BRAINSTORM_MULTIPLE: BestPractice = {
  id: 'bp-solution-brainstorm',
  practice: 'Generate multiple solution options before selecting one',
  rationale: 'The first idea is rarely the best. Brainstorming reveals creative, cost-effective alternatives.'
}

export const SOLUTION_COST_BENEFIT: BestPractice = {
  id: 'bp-solution-cost-benefit',
  practice: 'Conduct a cost-benefit analysis for major solutions',
  rationale: 'Ensures the solution is economically viable and helps prioritize limited resources.'
}

export const SOLUTION_FAILURE_MODE: BestPractice = {
  id: 'bp-solution-fmea',
  practice: 'Consider failure modes: What could go wrong with this solution?',
  rationale: 'Anticipating risks allows you to build in safeguards and contingency plans.'
}

// ============================================================================
// IMPLEMENTATION BEST PRACTICES
// ============================================================================

export const IMPLEMENT_PDCA_CYCLE: BestPractice = {
  id: 'bp-implement-pdca',
  practice: 'Use PDCA (Plan-Do-Check-Act) for implementation',
  rationale: 'Structured approach ensures you learn from implementation and make adjustments.'
}

export const IMPLEMENT_STANDARDIZE: BestPractice = {
  id: 'bp-implement-standardize',
  practice: 'Standardize successful improvements into procedures',
  rationale: 'Prevents backsliding and ensures the improvement sticks long-term.'
}

export const IMPLEMENT_MEASURE_RESULTS: BestPractice = {
  id: 'bp-implement-measure',
  practice: 'Measure results and compare to baseline',
  rationale: 'Proves effectiveness and builds confidence in continuous improvement methods.'
}

// ============================================================================
// TEAM COLLABORATION BEST PRACTICES
// ============================================================================

export const TEAM_CROSS_FUNCTIONAL: BestPractice = {
  id: 'bp-team-cross-functional',
  practice: 'Include cross-functional team members',
  rationale: 'Different perspectives catch blind spots and improve solution feasibility across departments.'
}

export const TEAM_USE_FACILITATOR: BestPractice = {
  id: 'bp-team-facilitator',
  practice: 'Use a neutral facilitator for team sessions',
  rationale: 'Keeps discussions on track, ensures all voices are heard, and manages conflict.'
}

export const TEAM_DOCUMENT_DECISIONS: BestPractice = {
  id: 'bp-team-document',
  practice: 'Document key decisions and the reasoning behind them',
  rationale: 'Provides accountability and helps future teams learn from your experience.'
}

// ============================================================================
// ORGANIZED BY CATEGORY
// ============================================================================

export const BEST_PRACTICES_BY_CATEGORY = {
  PROBLEM_DEFINITION: [
    PROBLEM_USE_DATA_DRIVEN,
    PROBLEM_DEFINE_SCOPE,
    PROBLEM_SHOW_IMPACT
  ],
  DATA_COLLECTION: [
    DATA_USE_CHECK_SHEETS,
    DATA_TRAIN_COLLECTORS,
    DATA_DOCUMENT_METHOD
  ],
  ROOT_CAUSE_ANALYSIS: [
    RCA_GO_TO_GEMBA,
    RCA_USE_MULTIPLE_TOOLS,
    RCA_VERIFY_WITH_DATA
  ],
  SOLUTION_DEVELOPMENT: [
    SOLUTION_BRAINSTORM_MULTIPLE,
    SOLUTION_COST_BENEFIT,
    SOLUTION_FAILURE_MODE
  ],
  IMPLEMENTATION: [
    IMPLEMENT_PDCA_CYCLE,
    IMPLEMENT_STANDARDIZE,
    IMPLEMENT_MEASURE_RESULTS
  ],
  TEAM_COLLABORATION: [
    TEAM_CROSS_FUNCTIONAL,
    TEAM_USE_FACILITATOR,
    TEAM_DOCUMENT_DECISIONS
  ]
}

// ============================================================================
// ALL BEST PRACTICES (ALPHABETICAL)
// ============================================================================

export const ALL_BEST_PRACTICES = [
  DATA_DOCUMENT_METHOD,
  DATA_TRAIN_COLLECTORS,
  DATA_USE_CHECK_SHEETS,
  IMPLEMENT_MEASURE_RESULTS,
  IMPLEMENT_PDCA_CYCLE,
  IMPLEMENT_STANDARDIZE,
  PROBLEM_DEFINE_SCOPE,
  PROBLEM_SHOW_IMPACT,
  PROBLEM_USE_DATA_DRIVEN,
  RCA_GO_TO_GEMBA,
  RCA_USE_MULTIPLE_TOOLS,
  RCA_VERIFY_WITH_DATA,
  SOLUTION_BRAINSTORM_MULTIPLE,
  SOLUTION_COST_BENEFIT,
  SOLUTION_FAILURE_MODE,
  TEAM_CROSS_FUNCTIONAL,
  TEAM_DOCUMENT_DECISIONS,
  TEAM_USE_FACILITATOR
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getBestPracticeById = (id: string): BestPractice | undefined => {
  return ALL_BEST_PRACTICES.find(practice => practice.id === id)
}

export const getBestPracticesByCategory = (category: keyof typeof BEST_PRACTICES_BY_CATEGORY): BestPractice[] => {
  return BEST_PRACTICES_BY_CATEGORY[category] || []
}

export const searchBestPractices = (query: string): BestPractice[] => {
  const lowerQuery = query.toLowerCase()
  return ALL_BEST_PRACTICES.filter(practice => 
    practice.practice.toLowerCase().includes(lowerQuery) ||
    practice.rationale.toLowerCase().includes(lowerQuery)
  )
}
