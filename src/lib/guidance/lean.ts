import { GuidanceTip, GuidanceWarning, BestPractice, CommonMistake } from '@/types/guided-tools'

/**
 * Lean Manufacturing Guidance Library
 * 
 * Specialized guidance for Lean tools: VSM, 5S, OEE, Kanban, etc.
 */

// ============================================================================
// LEAN TIPS
// ============================================================================

export const LEAN_VISUALIZE_FLOW: GuidanceTip = {
  id: 'tip-lean-visualize',
  icon: '👁️',
  title: 'Visualize the Flow',
  content: 'Make work visible. Use visual management boards, flow diagrams, and kanban cards to see what\'s happening at a glance.',
  priority: 'high'
}

export const LEAN_ELIMINATE_WASTE: GuidanceTip = {
  id: 'tip-lean-waste',
  icon: '♻️',
  title: 'Focus on the 8 Wastes',
  content: 'Target DOWNTIME: Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory, Motion, Extra processing.',
  priority: 'high'
}

export const LEAN_STANDARDIZE_WORK: GuidanceTip = {
  id: 'tip-lean-standardize',
  icon: '📋',
  title: 'Standardize First, Then Improve',
  content: 'You can\'t improve what isn\'t standardized. Document current best practice, then work on improving it.',
  priority: 'high'
}

export const LEAN_CONTINUOUS_FLOW: GuidanceTip = {
  id: 'tip-lean-flow',
  icon: '🌊',
  title: 'Create Continuous Flow',
  content: 'Aim for one-piece flow where possible. Reduce batch sizes and eliminate handoffs between operations.',
  priority: 'medium'
}

export const LEAN_PULL_SYSTEM: GuidanceTip = {
  id: 'tip-lean-pull',
  icon: '⬅️',
  title: 'Pull, Don\'t Push',
  content: 'Let customer demand pull work through the system. Only produce what the next process needs, when they need it.',
  priority: 'medium'
}

export const LEAN_LEVEL_WORKLOAD: GuidanceTip = {
  id: 'tip-lean-heijunka',
  icon: '⚖️',
  title: 'Level the Workload (Heijunka)',
  content: 'Smooth out production volume and mix. Avoid peaks and valleys that create waste and stress.',
  priority: 'medium'
}

export const LEAN_VALUE_STREAM: GuidanceTip = {
  id: 'tip-lean-vsm',
  icon: '🗺️',
  title: 'Map the Value Stream',
  content: 'Map material and information flow from supplier to customer. See the whole system, not just individual processes.',
  priority: 'high'
}

// ============================================================================
// LEAN WARNINGS
// ============================================================================

export const LEAN_DONT_OVER_AUTOMATE: GuidanceWarning = {
  id: 'warn-lean-automation',
  type: 'warning',
  title: 'Don\'t Over-Automate',
  content: 'Automating a bad process makes it consistently bad faster. Improve the process first, then automate if needed.',
  severity: 'high'
}

export const LEAN_AVOID_BATCH_THINKING: GuidanceWarning = {
  id: 'warn-lean-batch',
  type: 'warning',
  title: 'Avoid Batch and Queue',
  content: 'Large batches hide problems and increase lead time. They create inventory waste and delay feedback.',
  severity: 'high'
}

export const LEAN_DONT_SKIP_GEMBA: GuidanceWarning = {
  id: 'warn-lean-gemba',
  type: 'warning',
  title: 'Don\'t Skip Gemba',
  content: 'You can\'t improve a process you haven\'t observed. Go to the actual place and see the actual work.',
  severity: 'high'
}

export const LEAN_AVOID_TOOLS_WITHOUT_CULTURE: GuidanceWarning = {
  id: 'warn-lean-culture',
  type: 'warning',
  title: 'Tools Without Culture Fail',
  content: 'Lean tools without respect for people and continuous improvement mindset become empty rituals.',
  severity: 'medium'
}

export const LEAN_DONT_IGNORE_VARIATION: GuidanceWarning = {
  id: 'warn-lean-variation',
  type: 'info',
  title: 'Variation Hides in Averages',
  content: 'Average cycle time doesn\'t tell the full story. Look at the range and variation in your process.',
  severity: 'medium'
}

// ============================================================================
// LEAN BEST PRACTICES
// ============================================================================

export const LEAN_VALUE_STREAM_FIRST: BestPractice = {
  id: 'bp-lean-vsm-first',
  practice: 'Start with Value Stream Mapping before implementing changes',
  rationale: 'VSM reveals the full picture of waste and helps prioritize improvements with the biggest impact.'
}

export const LEAN_INVOLVE_OPERATORS: BestPractice = {
  id: 'bp-lean-operators',
  practice: 'Involve operators in improvement activities',
  rationale: 'Those doing the work have the best ideas for improvement and will support changes they helped design.'
}

export const LEAN_SMALL_RAPID_TESTS: BestPractice = {
  id: 'bp-lean-rapid-tests',
  practice: 'Use small, rapid experiments instead of large projects',
  rationale: 'Quick PDCA cycles allow faster learning and adaptation with less risk and investment.'
}

export const LEAN_VISUAL_MANAGEMENT: BestPractice = {
  id: 'bp-lean-visual',
  practice: 'Make abnormalities immediately visible',
  rationale: 'Visual controls enable quick response to problems and prevent small issues from becoming big ones.'
}

export const LEAN_TAKT_TIME_ALIGNMENT: BestPractice = {
  id: 'bp-lean-takt',
  practice: 'Design processes to match takt time (customer demand rate)',
  rationale: 'Synchronizing with customer demand eliminates overproduction and minimizes inventory.'
}

export const LEAN_FIVE_S_FOUNDATION: BestPractice = {
  id: 'bp-lean-five-s',
  practice: 'Use 5S as the foundation for all Lean improvements',
  rationale: 'An organized, clean workplace is safer, more efficient, and reveals problems that were hidden by clutter.'
}

export const LEAN_STANDARD_WORK_DOCUMENT: BestPractice = {
  id: 'bp-lean-standard-work',
  practice: 'Document standard work with time, sequence, and inventory',
  rationale: 'Clear standards enable training, problem detection, and serve as the baseline for kaizen.'
}

export const LEAN_MISTAKE_PROOFING: BestPractice = {
  id: 'bp-lean-poka-yoke',
  practice: 'Build quality in with mistake-proofing (poka-yoke)',
  rationale: 'Prevention devices eliminate defects at the source, reducing inspection and rework costs.'
}

// ============================================================================
// LEAN COMMON MISTAKES
// ============================================================================

export const LEAN_IMPLEMENTING_TOOLS_ONLY: CommonMistake = {
  id: 'cm-lean-tools-only',
  mistake: 'Implementing Lean tools without changing the culture',
  whyItsWrong: 'Tools without the thinking behind them become superficial activities that don\'t deliver results.',
  correction: 'Focus on developing problem-solving capability and respect for people alongside tools.'
}

export const LEAN_IGNORING_PEOPLE_SIDE: CommonMistake = {
  id: 'cm-lean-people',
  mistake: 'Ignoring the people side of change',
  whyItsWrong: 'Resistance and lack of understanding sabotage even the best technical solutions.',
  correction: 'Communicate the why, involve people in design, provide training, and celebrate small wins.'
}

export const LEAN_COPYING_TOYOTA: CommonMistake = {
  id: 'cm-lean-copying',
  mistake: 'Trying to copy Toyota exactly without adapting to your context',
  whyItsWrong: 'What works in automotive manufacturing may not work in your industry or culture.',
  correction: 'Learn the principles, then adapt the tools to fit your specific situation and challenges.'
}

export const LEAN_BIG_BANG_IMPLEMENTATION: CommonMistake = {
  id: 'cm-lean-big-bang',
  mistake: 'Attempting a "big bang" Lean transformation',
  whyItsWrong: 'Large-scale changes overwhelm the organization and often fail to stick.',
  correction: 'Start small with a model line or area. Learn, refine, then expand gradually.'
}

export const LEAN_METRICS_ONLY: CommonMistake = {
  id: 'cm-lean-metrics',
  mistake: 'Focusing only on metrics without understanding the process',
  whyItsWrong: 'Gaming the numbers becomes more important than actually improving.',
  correction: 'Use metrics as indicators, but go to gemba to understand what the numbers really mean.'
}

export const LEAN_ELIMINATING_SLACK: CommonMistake = {
  id: 'cm-lean-no-slack',
  mistake: 'Eliminating all slack and buffer in the system',
  whyItsWrong: 'Zero buffer makes the system fragile. Any variation causes shutdowns.',
  correction: 'Maintain strategic buffers where variation is high. Reduce buffer as you reduce variation.'
}

// ============================================================================
// ORGANIZED COLLECTIONS
// ============================================================================

export const LEAN_TIPS = [
  LEAN_VISUALIZE_FLOW,
  LEAN_ELIMINATE_WASTE,
  LEAN_STANDARDIZE_WORK,
  LEAN_CONTINUOUS_FLOW,
  LEAN_PULL_SYSTEM,
  LEAN_LEVEL_WORKLOAD,
  LEAN_VALUE_STREAM
]

export const LEAN_WARNINGS = [
  LEAN_DONT_OVER_AUTOMATE,
  LEAN_AVOID_BATCH_THINKING,
  LEAN_DONT_SKIP_GEMBA,
  LEAN_AVOID_TOOLS_WITHOUT_CULTURE,
  LEAN_DONT_IGNORE_VARIATION
]

export const LEAN_BEST_PRACTICES = [
  LEAN_VALUE_STREAM_FIRST,
  LEAN_INVOLVE_OPERATORS,
  LEAN_SMALL_RAPID_TESTS,
  LEAN_VISUAL_MANAGEMENT,
  LEAN_TAKT_TIME_ALIGNMENT,
  LEAN_FIVE_S_FOUNDATION,
  LEAN_STANDARD_WORK_DOCUMENT,
  LEAN_MISTAKE_PROOFING
]

export const LEAN_COMMON_MISTAKES = [
  LEAN_IMPLEMENTING_TOOLS_ONLY,
  LEAN_IGNORING_PEOPLE_SIDE,
  LEAN_COPYING_TOYOTA,
  LEAN_BIG_BANG_IMPLEMENTATION,
  LEAN_METRICS_ONLY,
  LEAN_ELIMINATING_SLACK
]
