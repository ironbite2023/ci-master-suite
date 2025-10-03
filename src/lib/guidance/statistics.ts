import { GuidanceTip, GuidanceWarning, BestPractice, CommonMistake } from '@/types/guided-tools'

/**
 * Six Sigma Statistics Guidance Library
 * 
 * Specialized guidance for statistical tools: SPC, Capability, Hypothesis Testing, DOE, MSA, etc.
 */

// ============================================================================
// STATISTICS TIPS
// ============================================================================

export const STATS_CHECK_NORMALITY: GuidanceTip = {
  id: 'tip-stats-normality',
  icon: '📊',
  title: 'Check for Normality',
  content: 'Many statistical tests assume normal distribution. Use normality tests or probability plots before analysis.',
  priority: 'high'
}

export const STATS_VERIFY_INDEPENDENCE: GuidanceTip = {
  id: 'tip-stats-independence',
  icon: '🔗',
  title: 'Verify Data Independence',
  content: 'Data points must be independent (not autocorrelated). Check for patterns over time or sequence.',
  priority: 'high'
}

export const STATS_UNDERSTAND_VARIATION: GuidanceTip = {
  id: 'tip-stats-variation',
  icon: '📈',
  title: 'Distinguish Common vs Special Cause',
  content: 'Common cause is inherent to the process. Special cause is external and sporadic. Different actions needed for each.',
  priority: 'high'
}

export const STATS_SAMPLE_SIZE_MATTERS: GuidanceTip = {
  id: 'tip-stats-sample-size',
  icon: '🔢',
  title: 'Sample Size Affects Confidence',
  content: 'Larger samples give narrower confidence intervals and more statistical power. Use power analysis to determine needed size.',
  priority: 'medium'
}

export const STATS_VISUALIZE_FIRST: GuidanceTip = {
  id: 'tip-stats-visualize',
  icon: '👀',
  title: 'Plot Your Data First',
  content: 'Always visualize data before statistical analysis. Charts reveal patterns, outliers, and issues that statistics might miss.',
  priority: 'high'
}

export const STATS_UNDERSTAND_P_VALUE: GuidanceTip = {
  id: 'tip-stats-p-value',
  icon: '🎯',
  title: 'P-value Is Not Effect Size',
  content: 'P-value tells you if an effect exists, not how big it is. Always report and consider practical significance.',
  priority: 'medium'
}

export const STATS_CONTROL_BEFORE_CAPABILITY: GuidanceTip = {
  id: 'tip-stats-control-first',
  icon: '📉',
  title: 'Achieve Control Before Assessing Capability',
  content: 'Process capability calculations assume statistical control. Eliminate special causes first.',
  priority: 'high'
}

export const STATS_DOCUMENT_ASSUMPTIONS: GuidanceTip = {
  id: 'tip-stats-assumptions',
  icon: '📝',
  title: 'Document Statistical Assumptions',
  content: 'Record which assumptions you checked (normality, independence, equal variance) and the results.',
  priority: 'medium'
}

// ============================================================================
// STATISTICS WARNINGS
// ============================================================================

export const STATS_DONT_CONFUSE_CORRELATION_CAUSATION: GuidanceWarning = {
  id: 'warn-stats-correlation',
  type: 'error',
  title: 'Correlation ≠ Causation',
  content: 'Just because two variables move together doesn\'t mean one causes the other. Use DOE to establish causation.',
  severity: 'high'
}

export const STATS_AVOID_P_HACKING: GuidanceWarning = {
  id: 'warn-stats-p-hacking',
  type: 'error',
  title: 'Avoid P-Hacking',
  content: 'Don\'t keep testing until you get p < 0.05. This inflates Type I error. Pre-specify your analysis plan.',
  severity: 'high'
}

export const STATS_DONT_IGNORE_OUTLIERS: GuidanceWarning = {
  id: 'warn-stats-outliers',
  type: 'warning',
  title: 'Investigate Outliers',
  content: 'Don\'t automatically delete outliers. They might represent special causes or measurement errors worth investigating.',
  severity: 'high'
}

export const STATS_AVOID_OVERFITTING: GuidanceWarning = {
  id: 'warn-stats-overfit',
  type: 'warning',
  title: 'Don\'t Overfit Your Model',
  content: 'Adding too many variables makes the model fit historical data perfectly but predict future data poorly.',
  severity: 'medium'
}

export const STATS_ALPHA_NOT_ARBITRARY: GuidanceWarning = {
  id: 'warn-stats-alpha',
  type: 'info',
  title: 'Alpha Level Should Be Pre-Specified',
  content: '0.05 is convention, not magic. Choose alpha based on cost of Type I vs Type II error in your context.',
  severity: 'medium'
}

export const STATS_DONT_TRUST_SINGLE_POINT: GuidanceWarning = {
  id: 'warn-stats-single-point',
  type: 'warning',
  title: 'One Point Doesn\'t Make a Trend',
  content: 'Wait for sustained change before declaring improvement. Use control chart rules to detect real shifts.',
  severity: 'medium'
}

export const STATS_BEWARE_MULTICOLLINEARITY: GuidanceWarning = {
  id: 'warn-stats-multicollinearity',
  type: 'warning',
  title: 'Check for Multicollinearity',
  content: 'Highly correlated predictors make regression coefficients unstable and difficult to interpret.',
  severity: 'medium'
}

// ============================================================================
// STATISTICS BEST PRACTICES
// ============================================================================

export const STATS_USE_CONTROL_CHARTS_BEFORE_CAPABILITY: BestPractice = {
  id: 'bp-stats-control-first',
  practice: 'Establish statistical control before calculating process capability',
  rationale: 'Capability indices (Cp, Cpk) are meaningless for unstable processes. Remove special causes first.'
}

export const STATS_STRATIFY_DATA: BestPractice = {
  id: 'bp-stats-stratify',
  practice: 'Stratify data by shift, machine, operator, or other factors',
  rationale: 'Combining different sources of variation masks root causes and makes analysis misleading.'
}

export const STATS_CALCULATE_CONFIDENCE_INTERVALS: BestPractice = {
  id: 'bp-stats-confidence',
  practice: 'Always report confidence intervals, not just point estimates',
  rationale: 'Confidence intervals show the precision of your estimate and help decision-makers understand uncertainty.'
}

export const STATS_VALIDATE_MEASUREMENT_SYSTEM: BestPractice = {
  id: 'bp-stats-msa',
  practice: 'Conduct Gage R&R study before collecting process data',
  rationale: 'If your measurement system has high variation, you can\'t trust conclusions about process variation.'
}

export const STATS_USE_RATIONAL_SUBGROUPS: BestPractice = {
  id: 'bp-stats-subgroups',
  practice: 'Design rational subgroups to minimize within-group variation',
  rationale: 'Proper subgrouping maximizes the chance of detecting special causes in control charts.'
}

export const STATS_TRACK_ASSUMPTIONS: BestPractice = {
  id: 'bp-stats-track-assumptions',
  practice: 'Document and verify all statistical assumptions',
  rationale: 'Violated assumptions invalidate results. Keep a checklist of assumptions for each analysis type.'
}

export const STATS_USE_POWER_ANALYSIS: BestPractice = {
  id: 'bp-stats-power',
  practice: 'Calculate required sample size using power analysis',
  rationale: 'Underpowered studies waste resources and miss real effects. Overpowered studies waste even more resources.'
}

export const STATS_REPLICATE_EXPERIMENTS: BestPractice = {
  id: 'bp-stats-replicate',
  practice: 'Use replication to estimate experimental error',
  rationale: 'Replication allows you to separate signal from noise and test for factor interactions.'
}

export const STATS_BOX_COX_TRANSFORMATION: BestPractice = {
  id: 'bp-stats-transform',
  practice: 'Use Box-Cox transformation for non-normal data when appropriate',
  rationale: 'Transformation can stabilize variance and normalize data, making parametric tests valid.'
}

// ============================================================================
// STATISTICS COMMON MISTAKES
// ============================================================================

export const STATS_USING_CAPABILITY_ON_UNSTABLE_PROCESS: CommonMistake = {
  id: 'cm-stats-unstable-capability',
  mistake: 'Calculating Cp/Cpk on an unstable (out-of-control) process',
  whyItsWrong: 'Capability indices assume the process is in statistical control. For unstable processes, they\'re meaningless.',
  correction: 'First create a control chart, remove special causes, then calculate capability once stable.'
}

export const STATS_IGNORING_SPECIAL_CAUSES: CommonMistake = {
  id: 'cm-stats-special-causes',
  mistake: 'Treating special causes as common cause variation',
  whyItsWrong: 'Adjusting the process for special causes makes variation worse, not better (tampering).',
  correction: 'Use control chart rules to identify special causes, then investigate and eliminate root causes.'
}

export const STATS_MIXING_ATTRIBUTE_VARIABLE: CommonMistake = {
  id: 'cm-stats-data-types',
  mistake: 'Using the wrong control chart type for your data',
  whyItsWrong: 'Attribute data (counts, defects) needs different charts than variable data (measurements). Wrong chart gives wrong conclusions.',
  correction: 'Use p, np, c, or u charts for attribute data. Use X-bar-R, I-MR for variable data.'
}

export const STATS_INAPPROPRIATE_SPEC_LIMITS: CommonMistake = {
  id: 'cm-stats-spec-limits',
  mistake: 'Using specification limits as control limits',
  whyItsWrong: 'Specs are customer requirements (voice of customer). Control limits come from process data (voice of process). They\'re different.',
  correction: 'Calculate control limits from process data. Compare separately to specification limits.'
}

export const STATS_NEGLECTING_MEASUREMENT_ERROR: CommonMistake = {
  id: 'cm-stats-measurement',
  mistake: 'Assuming measurement system variation is negligible',
  whyItsWrong: 'If measurement variation equals or exceeds process variation, you can\'t see real process changes.',
  correction: 'Conduct MSA (Gage R&R) study. Measurement system should contribute < 10% of total variation.'
}

export const STATS_OVERREACTING_TO_NOISE: CommonMistake = {
  id: 'cm-stats-tampering',
  mistake: 'Adjusting the process for every point outside the average',
  whyItsWrong: 'This is tampering. It increases variation rather than decreasing it.',
  correction: 'Only act when control chart rules indicate special causes. Let common cause variation alone.'
}

export const STATS_CONFUSING_PRECISION_ACCURACY: CommonMistake = {
  id: 'cm-stats-precision-accuracy',
  mistake: 'Confusing precision (repeatability) with accuracy (bias)',
  whyItsWrong: 'A measurement system can be precise but inaccurate (consistent but wrong), or vice versa.',
  correction: 'MSA studies must assess both repeatability/reproducibility AND bias separately.'
}

export const STATS_WRONG_DISTRIBUTION_ASSUMPTION: CommonMistake = {
  id: 'cm-stats-distribution',
  mistake: 'Assuming normality without checking',
  whyItsWrong: 'Many statistical tests and capability calculations assume normal distribution. Non-normal data invalidates results.',
  correction: 'Always check normality with probability plots or tests. Use non-parametric methods if non-normal.'
}

// ============================================================================
// ORGANIZED COLLECTIONS
// ============================================================================

export const STATS_TIPS = [
  STATS_CHECK_NORMALITY,
  STATS_VERIFY_INDEPENDENCE,
  STATS_UNDERSTAND_VARIATION,
  STATS_SAMPLE_SIZE_MATTERS,
  STATS_VISUALIZE_FIRST,
  STATS_UNDERSTAND_P_VALUE,
  STATS_CONTROL_BEFORE_CAPABILITY,
  STATS_DOCUMENT_ASSUMPTIONS
]

export const STATS_WARNINGS = [
  STATS_DONT_CONFUSE_CORRELATION_CAUSATION,
  STATS_AVOID_P_HACKING,
  STATS_DONT_IGNORE_OUTLIERS,
  STATS_AVOID_OVERFITTING,
  STATS_ALPHA_NOT_ARBITRARY,
  STATS_DONT_TRUST_SINGLE_POINT,
  STATS_BEWARE_MULTICOLLINEARITY
]

export const STATS_BEST_PRACTICES = [
  STATS_USE_CONTROL_CHARTS_BEFORE_CAPABILITY,
  STATS_STRATIFY_DATA,
  STATS_CALCULATE_CONFIDENCE_INTERVALS,
  STATS_VALIDATE_MEASUREMENT_SYSTEM,
  STATS_USE_RATIONAL_SUBGROUPS,
  STATS_TRACK_ASSUMPTIONS,
  STATS_USE_POWER_ANALYSIS,
  STATS_REPLICATE_EXPERIMENTS,
  STATS_BOX_COX_TRANSFORMATION
]

export const STATS_COMMON_MISTAKES = [
  STATS_USING_CAPABILITY_ON_UNSTABLE_PROCESS,
  STATS_IGNORING_SPECIAL_CAUSES,
  STATS_MIXING_ATTRIBUTE_VARIABLE,
  STATS_INAPPROPRIATE_SPEC_LIMITS,
  STATS_NEGLECTING_MEASUREMENT_ERROR,
  STATS_OVERREACTING_TO_NOISE,
  STATS_CONFUSING_PRECISION_ACCURACY,
  STATS_WRONG_DISTRIBUTION_ASSUMPTION
]
