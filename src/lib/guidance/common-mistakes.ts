import { CommonMistake } from '@/types/guided-tools'

/**
 * Centralized library of reusable common mistakes for all guided tools
 * 
 * Naming Convention: CATEGORY_MISTAKE_NAME
 * Example: PROBLEM_STATING_CAUSES, DATA_CHERRY_PICKING
 */

// ============================================================================
// PROBLEM DEFINITION COMMON MISTAKES
// ============================================================================

export const PROBLEM_STATING_CAUSES: CommonMistake = {
  id: 'cm-problem-causes',
  mistake: 'Stating causes instead of the problem itself',
  whyItsWrong: 'This skips the analysis and jumps to conclusions before exploring all possibilities.',
  correction: 'State only the observable problem/effect, not your theory about why it happens.'
}

export const PROBLEM_TOO_VAGUE: CommonMistake = {
  id: 'cm-problem-vague',
  mistake: '"Quality is bad" or "Production is slow"',
  whyItsWrong: 'Vague statements don\'t provide enough information to analyze or measure improvement.',
  correction: 'Be specific: "Defect rate increased from 2% to 8% on Line 3 in the past month"'
}

export const PROBLEM_BLAMING_PEOPLE: CommonMistake = {
  id: 'cm-problem-blame',
  mistake: 'Blaming individuals: "John made mistakes" or "The team is lazy"',
  whyItsWrong: 'People work within systems. Blame prevents root cause discovery and demoralizes teams.',
  correction: 'Focus on process failures: "Training gaps exist" or "Checklist is unclear"'
}

// ============================================================================
// DATA COLLECTION COMMON MISTAKES
// ============================================================================

export const DATA_CHERRY_PICKING: CommonMistake = {
  id: 'cm-data-cherry-pick',
  mistake: 'Selecting only data that supports your existing theory',
  whyItsWrong: 'Confirmation bias leads to wrong conclusions. You miss contradictory evidence.',
  correction: 'Collect all relevant data objectively, even if it contradicts your hypothesis.'
}

export const DATA_TOO_SMALL_SAMPLE: CommonMistake = {
  id: 'cm-data-small-sample',
  mistake: 'Drawing conclusions from 3-5 data points',
  whyItsWrong: 'Small samples have high variation and low statistical power. Conclusions are unreliable.',
  correction: 'Use at least 20-30 data points (more for high variation processes) before drawing conclusions.'
}

export const DATA_NO_BASELINE: CommonMistake = {
  id: 'cm-data-no-baseline',
  mistake: 'Starting improvement without measuring current performance',
  whyItsWrong: 'Without a baseline, you can\'t prove improvement occurred or quantify the impact.',
  correction: 'Always establish a baseline before making changes. Measure for at least 2-4 weeks.'
}

// ============================================================================
// ROOT CAUSE ANALYSIS COMMON MISTAKES
// ============================================================================

export const RCA_STOPPING_TOO_EARLY: CommonMistake = {
  id: 'cm-rca-stop-early',
  mistake: 'Stopping at the first "why" (surface cause)',
  whyItsWrong: 'Surface causes are symptoms, not root causes. The problem will recur.',
  correction: 'Ask "why" at least 5 times until you reach a controllable root cause.'
}

export const RCA_SKIPPING_GEMBA: CommonMistake = {
  id: 'cm-rca-no-gemba',
  mistake: 'Analyzing the problem from your desk without observing the process',
  whyItsWrong: 'You miss critical details and context that only observation can reveal.',
  correction: 'Go to Gemba (the actual workplace) and observe the process firsthand.'
}

export const RCA_SINGLE_TOOL_ONLY: CommonMistake = {
  id: 'cm-rca-single-tool',
  mistake: 'Using only one analysis tool (e.g., only 5 Why or only Fishbone)',
  whyItsWrong: 'Each tool has blind spots. Relying on one limits your perspective.',
  correction: 'Use 2-3 complementary tools (5 Why + Fishbone + Pareto) for comprehensive analysis.'
}

// ============================================================================
// SOLUTION DEVELOPMENT COMMON MISTAKES
// ============================================================================

export const SOLUTION_FIRST_IDEA: CommonMistake = {
  id: 'cm-solution-first-idea',
  mistake: 'Implementing the first solution that comes to mind',
  whyItsWrong: 'The first idea is rarely the best. You miss better, cheaper, or simpler alternatives.',
  correction: 'Brainstorm at least 3-5 solution options, then evaluate and select the best.'
}

export const SOLUTION_BAND_AID_FIX: CommonMistake = {
  id: 'cm-solution-band-aid',
  mistake: 'Applying quick fixes that address symptoms, not root causes',
  whyItsWrong: 'Problem will recur because the root cause remains. Wastes time and resources.',
  correction: 'Target the validated root cause, even if it takes longer to implement.'
}

export const SOLUTION_NO_PILOT: CommonMistake = {
  id: 'cm-solution-no-pilot',
  mistake: 'Implementing company-wide without testing on a small scale',
  whyItsWrong: 'If the solution fails or has side effects, the impact is massive and costly.',
  correction: 'Always pilot the solution in one area/shift/line first, then scale up.'
}

// ============================================================================
// IMPLEMENTATION COMMON MISTAKES
// ============================================================================

export const IMPLEMENT_NO_STANDARDIZATION: CommonMistake = {
  id: 'cm-implement-no-standard',
  mistake: 'Not updating standard operating procedures after improvement',
  whyItsWrong: 'People revert to old methods. The improvement doesn\'t stick long-term.',
  correction: 'Update SOPs, train everyone, and audit adherence to the new standard.'
}

export const IMPLEMENT_NO_FOLLOWUP: CommonMistake = {
  id: 'cm-implement-no-followup',
  mistake: 'Implementing and walking away without monitoring results',
  whyItsWrong: 'You don\'t know if the solution worked or if problems returned.',
  correction: 'Monitor key metrics for at least 30-90 days post-implementation.'
}

export const IMPLEMENT_SKIPPING_TRAINING: CommonMistake = {
  id: 'cm-implement-no-training',
  mistake: 'Rolling out changes without training affected employees',
  whyItsWrong: 'People don\'t understand the new process, leading to errors and resistance.',
  correction: 'Train all affected employees before go-live. Include the "why" behind the change.'
}

// ============================================================================
// ORGANIZED BY CATEGORY
// ============================================================================

export const COMMON_MISTAKES_BY_CATEGORY = {
  PROBLEM_DEFINITION: [
    PROBLEM_STATING_CAUSES,
    PROBLEM_TOO_VAGUE,
    PROBLEM_BLAMING_PEOPLE
  ],
  DATA_COLLECTION: [
    DATA_CHERRY_PICKING,
    DATA_TOO_SMALL_SAMPLE,
    DATA_NO_BASELINE
  ],
  ROOT_CAUSE_ANALYSIS: [
    RCA_STOPPING_TOO_EARLY,
    RCA_SKIPPING_GEMBA,
    RCA_SINGLE_TOOL_ONLY
  ],
  SOLUTION_DEVELOPMENT: [
    SOLUTION_FIRST_IDEA,
    SOLUTION_BAND_AID_FIX,
    SOLUTION_NO_PILOT
  ],
  IMPLEMENTATION: [
    IMPLEMENT_NO_STANDARDIZATION,
    IMPLEMENT_NO_FOLLOWUP,
    IMPLEMENT_SKIPPING_TRAINING
  ]
}

// ============================================================================
// ALL COMMON MISTAKES (ALPHABETICAL)
// ============================================================================

export const ALL_COMMON_MISTAKES = [
  DATA_CHERRY_PICKING,
  DATA_NO_BASELINE,
  DATA_TOO_SMALL_SAMPLE,
  IMPLEMENT_NO_FOLLOWUP,
  IMPLEMENT_NO_STANDARDIZATION,
  IMPLEMENT_SKIPPING_TRAINING,
  PROBLEM_BLAMING_PEOPLE,
  PROBLEM_STATING_CAUSES,
  PROBLEM_TOO_VAGUE,
  RCA_SINGLE_TOOL_ONLY,
  RCA_SKIPPING_GEMBA,
  RCA_STOPPING_TOO_EARLY,
  SOLUTION_BAND_AID_FIX,
  SOLUTION_FIRST_IDEA,
  SOLUTION_NO_PILOT
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getCommonMistakeById = (id: string): CommonMistake | undefined => {
  return ALL_COMMON_MISTAKES.find(mistake => mistake.id === id)
}

export const getCommonMistakesByCategory = (category: keyof typeof COMMON_MISTAKES_BY_CATEGORY): CommonMistake[] => {
  return COMMON_MISTAKES_BY_CATEGORY[category] || []
}

export const searchCommonMistakes = (query: string): CommonMistake[] => {
  const lowerQuery = query.toLowerCase()
  return ALL_COMMON_MISTAKES.filter(mistake => 
    mistake.mistake.toLowerCase().includes(lowerQuery) ||
    mistake.correction.toLowerCase().includes(lowerQuery)
  )
}
