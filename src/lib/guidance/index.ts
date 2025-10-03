/**
 * Centralized Guidance Library
 * 
 * This library provides reusable guidance content (tips, warnings, best practices,
 * common mistakes, and resources) that can be referenced across all guided tools.
 * 
 * Benefits:
 * - Single source of truth for all guidance content
 * - Easy to update and maintain
 * - Consistent messaging across tools
 * - Reusable content reduces duplication
 * - Type-safe references prevent errors
 * 
 * Usage Example:
 * ```typescript
 * import { PROBLEM_BE_SPECIFIC, PROBLEM_DONT_SKIP } from '@/lib/guidance'
 * 
 * const stepGuidance: StepGuidance = {
 *   tips: [PROBLEM_BE_SPECIFIC, PROBLEM_USE_DATA],
 *   warnings: [PROBLEM_DONT_SKIP],
 *   // ...
 * }
 * ```
 */

// ============================================================================
// TIPS - Export all tips
// ============================================================================

export {
  // Individual tips
  PROBLEM_BE_SPECIFIC,
  PROBLEM_USE_DATA,
  PROBLEM_FOCUS_ON_EFFECT,
  PROBLEM_SHOW_GAP,
  DATA_COLLECT_BASELINE,
  DATA_USE_STRATIFICATION,
  DATA_VERIFY_ACCURACY,
  RCA_ASK_WHY_FIVE_TIMES,
  RCA_LOOK_FOR_SYSTEM_ISSUES,
  RCA_VERIFY_WITH_DATA,
  TEAM_INVOLVE_EXPERTS,
  TEAM_DIVERSE_PERSPECTIVES,
  TEAM_DOCUMENT_SESSIONS,
  
  // Organized collections
  TIPS_BY_CATEGORY,
  ALL_TIPS,
  
  // Helper functions
  getTipById,
  getTipsByCategory,
  searchTips
} from './tips'

// ============================================================================
// WARNINGS - Export all warnings
// ============================================================================

export {
  // Individual warnings
  PROBLEM_DONT_SKIP,
  PROBLEM_AVOID_BLAME,
  PROBLEM_DONT_JUMP_TO_SOLUTIONS,
  DATA_AVOID_ASSUMPTIONS,
  DATA_CHECK_MEASUREMENT_SYSTEM,
  DATA_SAMPLE_SIZE_MATTERS,
  RCA_DONT_STOP_AT_SYMPTOMS,
  RCA_AVOID_SINGLE_CAUSE,
  RCA_VERIFY_BEFORE_ACTING,
  SOLUTION_DONT_BAND_AID,
  SOLUTION_CONSIDER_SIDE_EFFECTS,
  SOLUTION_PILOT_FIRST,
  
  // Organized collections
  WARNINGS_BY_CATEGORY,
  ALL_WARNINGS,
  
  // Helper functions
  getWarningById,
  getWarningsByCategory,
  getWarningsBySeverity,
  searchWarnings
} from './warnings'

// ============================================================================
// BEST PRACTICES - Export all best practices
// ============================================================================

export {
  // Individual best practices
  PROBLEM_USE_DATA_DRIVEN,
  PROBLEM_DEFINE_SCOPE,
  PROBLEM_SHOW_IMPACT,
  DATA_USE_CHECK_SHEETS,
  DATA_TRAIN_COLLECTORS,
  DATA_DOCUMENT_METHOD,
  RCA_GO_TO_GEMBA,
  RCA_USE_MULTIPLE_TOOLS,
  RCA_VERIFY_WITH_DATA as RCA_VERIFY_WITH_DATA_BP,
  SOLUTION_BRAINSTORM_MULTIPLE,
  SOLUTION_COST_BENEFIT,
  SOLUTION_FAILURE_MODE,
  IMPLEMENT_PDCA_CYCLE,
  IMPLEMENT_STANDARDIZE,
  IMPLEMENT_MEASURE_RESULTS,
  TEAM_CROSS_FUNCTIONAL,
  TEAM_USE_FACILITATOR,
  TEAM_DOCUMENT_DECISIONS,
  
  // Organized collections
  BEST_PRACTICES_BY_CATEGORY,
  ALL_BEST_PRACTICES,
  
  // Helper functions
  getBestPracticeById,
  getBestPracticesByCategory,
  searchBestPractices
} from './best-practices'

// ============================================================================
// COMMON MISTAKES - Export all common mistakes
// ============================================================================

export {
  // Individual common mistakes
  PROBLEM_STATING_CAUSES,
  PROBLEM_TOO_VAGUE,
  PROBLEM_BLAMING_PEOPLE,
  DATA_CHERRY_PICKING,
  DATA_TOO_SMALL_SAMPLE,
  DATA_NO_BASELINE,
  RCA_STOPPING_TOO_EARLY,
  RCA_SKIPPING_GEMBA,
  RCA_SINGLE_TOOL_ONLY,
  SOLUTION_FIRST_IDEA,
  SOLUTION_BAND_AID_FIX,
  SOLUTION_NO_PILOT,
  IMPLEMENT_NO_STANDARDIZATION,
  IMPLEMENT_NO_FOLLOWUP,
  IMPLEMENT_SKIPPING_TRAINING,
  
  // Organized collections
  COMMON_MISTAKES_BY_CATEGORY,
  ALL_COMMON_MISTAKES,
  
  // Helper functions
  getCommonMistakeById,
  getCommonMistakesByCategory,
  searchCommonMistakes
} from './common-mistakes'

// ============================================================================
// RESOURCES - Export all resources
// ============================================================================

export {
  // Individual resources
  PROBLEM_SMART_GOALS,
  PROBLEM_SCOPE_DEFINITION,
  RCA_FIVE_WHY_GUIDE,
  RCA_FISHBONE_ASQ,
  RCA_ROOT_CAUSE_BOOK,
  DATA_SPC_GUIDE,
  DATA_MEASUREMENT_SYSTEM,
  DATA_SAMPLE_SIZE_CALCULATOR,
  SIX_SIGMA_DMAIC,
  SIX_SIGMA_CERTIFICATION,
  LEAN_VSM_GUIDE,
  LEAN_GEMBA_WALK,
  LEAN_KAIZEN_EVENTS,
  TOOL_MINITAB,
  TOOL_EXCEL_TEMPLATES,
  
  // Organized collections
  RESOURCES_BY_CATEGORY,
  ALL_RESOURCES,
  
  // Helper functions
  getResourceById,
  getResourcesByCategory,
  getResourcesByType,
  searchResources
} from './resources'

// ============================================================================
// LEAN MANUFACTURING - Export all lean guidance
// ============================================================================

export {
  // Tips
  LEAN_VISUALIZE_FLOW,
  LEAN_ELIMINATE_WASTE,
  LEAN_STANDARDIZE_WORK,
  LEAN_CONTINUOUS_FLOW,
  LEAN_PULL_SYSTEM,
  LEAN_LEVEL_WORKLOAD,
  LEAN_VALUE_STREAM,
  
  // Warnings
  LEAN_DONT_OVER_AUTOMATE,
  LEAN_AVOID_BATCH_THINKING,
  LEAN_DONT_SKIP_GEMBA,
  LEAN_AVOID_TOOLS_WITHOUT_CULTURE,
  LEAN_DONT_IGNORE_VARIATION,
  
  // Best Practices
  LEAN_VALUE_STREAM_FIRST,
  LEAN_INVOLVE_OPERATORS,
  LEAN_SMALL_RAPID_TESTS,
  LEAN_VISUAL_MANAGEMENT,
  LEAN_TAKT_TIME_ALIGNMENT,
  LEAN_FIVE_S_FOUNDATION,
  LEAN_STANDARD_WORK_DOCUMENT,
  LEAN_MISTAKE_PROOFING,
  
  // Common Mistakes
  LEAN_IMPLEMENTING_TOOLS_ONLY,
  LEAN_IGNORING_PEOPLE_SIDE,
  LEAN_COPYING_TOYOTA,
  LEAN_BIG_BANG_IMPLEMENTATION,
  LEAN_METRICS_ONLY,
  LEAN_ELIMINATING_SLACK,
  
  // Collections
  LEAN_TIPS,
  LEAN_WARNINGS,
  LEAN_BEST_PRACTICES,
  LEAN_COMMON_MISTAKES
} from './lean'

// ============================================================================
// SIX SIGMA STATISTICS - Export all statistics guidance
// ============================================================================

export {
  // Tips
  STATS_CHECK_NORMALITY,
  STATS_VERIFY_INDEPENDENCE,
  STATS_UNDERSTAND_VARIATION,
  STATS_SAMPLE_SIZE_MATTERS,
  STATS_VISUALIZE_FIRST,
  STATS_UNDERSTAND_P_VALUE,
  STATS_CONTROL_BEFORE_CAPABILITY,
  STATS_DOCUMENT_ASSUMPTIONS,
  
  // Warnings
  STATS_DONT_CONFUSE_CORRELATION_CAUSATION,
  STATS_AVOID_P_HACKING,
  STATS_DONT_IGNORE_OUTLIERS,
  STATS_AVOID_OVERFITTING,
  STATS_ALPHA_NOT_ARBITRARY,
  STATS_DONT_TRUST_SINGLE_POINT,
  STATS_BEWARE_MULTICOLLINEARITY,
  
  // Best Practices
  STATS_USE_CONTROL_CHARTS_BEFORE_CAPABILITY,
  STATS_STRATIFY_DATA,
  STATS_CALCULATE_CONFIDENCE_INTERVALS,
  STATS_VALIDATE_MEASUREMENT_SYSTEM,
  STATS_USE_RATIONAL_SUBGROUPS,
  STATS_TRACK_ASSUMPTIONS,
  STATS_USE_POWER_ANALYSIS,
  STATS_REPLICATE_EXPERIMENTS,
  STATS_BOX_COX_TRANSFORMATION,
  
  // Common Mistakes
  STATS_USING_CAPABILITY_ON_UNSTABLE_PROCESS,
  STATS_IGNORING_SPECIAL_CAUSES,
  STATS_MIXING_ATTRIBUTE_VARIABLE,
  STATS_INAPPROPRIATE_SPEC_LIMITS,
  STATS_NEGLECTING_MEASUREMENT_ERROR,
  STATS_OVERREACTING_TO_NOISE,
  STATS_CONFUSING_PRECISION_ACCURACY,
  STATS_WRONG_DISTRIBUTION_ASSUMPTION,
  
  // Collections
  STATS_TIPS,
  STATS_WARNINGS,
  STATS_BEST_PRACTICES,
  STATS_COMMON_MISTAKES
} from './statistics'
