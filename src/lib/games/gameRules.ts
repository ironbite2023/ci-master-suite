/**
 * Game Rules Data
 * Static content for all games and modes
 */

import { GameMode } from '@/types/catapult'
import {
  GameRule
} from '@/components/games/GameRulesModal'

// ============================================================================
// CATAPULT - FREE PLAY MODE
// ============================================================================

export const catapultFreePlayRules: GameRule = {
  gameId: 'catapult',
  mode: 'freeplay',
  overview: {
    title: 'Catapult Challenge - Free Play',
    description: 'Master the art of precision launching! Adjust angle, force, and weight to hit targets and earn points.',
    objective: 'Learn the basics of projectile motion and understand how different parameters affect launch distance and accuracy. Practice makes perfect!',
    imageUrl: undefined
  },
  controls: [
    {
      name: 'Angle',
      description: 'Adjust the launch angle between 30° and 60°. Lower angles give more distance, higher angles provide more arc.',
      icon: '📐',
      keyBinding: undefined
    },
    {
      name: 'Force',
      description: 'Set the launch force from 300N to 600N. More force equals greater distance, but may reduce accuracy.',
      icon: '💪',
      keyBinding: undefined
    },
    {
      name: 'Weight',
      description: 'Choose projectile weight: Light (1kg), Medium (2kg), or Heavy (3kg). Weight affects trajectory and momentum.',
      icon: '⚖️',
      keyBinding: undefined
    },
    {
      name: 'Launch',
      description: 'Fire the catapult with your current settings. Watch the trajectory and landing point.',
      icon: '🚀',
      keyBinding: 'Space'
    },
    {
      name: 'Reset',
      description: 'Clear your shot history and start fresh. All statistics will be reset.',
      icon: '🔄',
      keyBinding: undefined
    }
  ],
  scoring: [
    {
      action: 'Hit Target Zone',
      points: 100,
      description: 'Land within the optimal target zone (90-110m)'
    },
    {
      action: 'Near Miss',
      points: 50,
      description: 'Land close to target (80-120m)'
    },
    {
      action: 'Consistency Bonus',
      points: 25,
      description: 'Hit similar distances consecutively (within 5m)'
    },
    {
      action: 'Perfect Shot',
      points: 200,
      description: 'Land exactly at 100m target'
    },
    {
      action: 'Streak Bonus',
      points: 50,
      description: 'Chain multiple successful target hits'
    }
  ],
  learningGoals: [
    {
      concept: 'Projectile Motion Fundamentals',
      description: 'Understand how angle and force affect trajectory and distance',
      difficulty: 'beginner'
    },
    {
      concept: 'Parameter Relationships',
      description: 'Learn how angle, force, and weight interact to produce different outcomes',
      difficulty: 'beginner'
    },
    {
      concept: 'Consistency and Repeatability',
      description: 'Develop ability to replicate successful settings',
      difficulty: 'intermediate'
    }
  ],
  tips: [
    '45° is often the optimal angle for maximum distance in ideal conditions',
    'Heavier projectiles are less affected by air resistance',
    'Keep notes of successful combinations for later reference',
    'Watch the trajectory prediction to estimate landing point',
    'Try systematic changes - adjust one parameter at a time'
  ],
  successCriteria: [
    'Hit target zone (90-110m) at least 3 times',
    'Achieve a consistency bonus by landing within 5m range',
    'Score at least 500 total points',
    'Complete 10 launches to build experience'
  ],
  estimatedTime: '5-10 minutes'
}

// ============================================================================
// CATAPULT - DOE MODE
// ============================================================================

export const catapultDOERules: GameRule = {
  gameId: 'catapult',
  mode: 'doe',
  overview: {
    title: 'DOE Experiment Challenge',
    description: 'Design and execute a full factorial experiment to discover optimal catapult settings using statistical methods.',
    objective: 'Learn Design of Experiments (DOE) methodology by running all 8 combinations of a 2³ factorial design and analyzing main effects and interactions.',
    imageUrl: undefined
  },
  controls: [
    {
      name: 'Experiment Selection',
      description: 'Choose from 8 pre-designed experiments. Each combination tests High/Low levels of Angle, Force, and Weight.',
      icon: '🧪',
      keyBinding: undefined
    },
    {
      name: 'Level Buttons',
      description: 'Toggle between Low and High levels for each factor. System prevents invalid combinations.',
      icon: '🎚️',
      keyBinding: undefined
    },
    {
      name: 'Launch Experiment',
      description: 'Execute current experiment combination and record results automatically.',
      icon: '🚀',
      keyBinding: undefined
    },
    {
      name: 'Load Next',
      description: 'Automatically load the next incomplete experiment in sequence.',
      icon: '⏭️',
      keyBinding: undefined
    },
    {
      name: 'View Matrix',
      description: 'See all 8 experiments with their status and results in table format.',
      icon: '📊',
      keyBinding: undefined
    }
  ],
  scoring: [
    {
      action: 'Complete Experiment',
      points: 100,
      description: 'Successfully execute one of the 8 factorial combinations'
    },
    {
      action: 'Full DOE Complete',
      points: 500,
      description: 'Complete all 8 experiments in the design'
    },
    {
      action: 'Optimal Settings Found',
      points: 300,
      description: 'Identify and validate the optimal parameter combination'
    },
    {
      action: 'Analysis Mastery',
      points: 200,
      description: 'Correctly interpret main effects and interactions'
    }
  ],
  learningGoals: [
    {
      concept: 'Full Factorial Design (2³)',
      description: 'Understand how to systematically test all combinations of 3 factors at 2 levels',
      difficulty: 'intermediate'
    },
    {
      concept: 'Main Effects Analysis',
      description: 'Calculate and interpret the individual impact of each factor on the response',
      difficulty: 'intermediate'
    },
    {
      concept: 'Interaction Effects',
      description: 'Identify when factors work together synergistically or antagonistically',
      difficulty: 'advanced'
    },
    {
      concept: 'Pareto Analysis',
      description: 'Apply 80/20 rule to prioritize the most impactful factors',
      difficulty: 'intermediate'
    },
    {
      concept: 'Optimal Settings Prediction',
      description: 'Use DOE results to predict and validate best parameter combination',
      difficulty: 'advanced'
    }
  ],
  tips: [
    'Complete all 8 experiments before analyzing - partial data can mislead',
    'Pay attention to which factors have the largest main effects',
    'Look for interaction effects where combinations outperform individual factors',
    'Use the experiment matrix to track your progress systematically',
    'Export your results to CSV for deeper analysis in external tools'
  ],
  successCriteria: [
    'Complete all 8 factorial experiments',
    'Analyze main effects and identify top 2 influential factors',
    'Detect at least one significant interaction effect',
    'Validate optimal settings by achieving predicted performance',
    'Understand the Pareto principle applied to your factors'
  ],
  estimatedTime: '15-20 minutes'
}

// ============================================================================
// CATAPULT - VALIDATION MODE
// ============================================================================

export const catapultValidationRules: GameRule = {
  gameId: 'catapult',
  mode: 'validation',
  overview: {
    title: 'Validation Study - Normality Testing',
    description: 'Collect data using optimal settings and validate that your process follows a normal distribution.',
    objective: 'Learn statistical validation techniques by running normality tests (Anderson-Darling, Shapiro-Wilk, Kolmogorov-Smirnov) on process data.',
    imageUrl: undefined
  },
  controls: [
    {
      name: 'Optimal Settings Lock',
      description: 'Settings are locked to optimal values from DOE. This ensures consistent test conditions.',
      icon: '🔒',
      keyBinding: undefined
    },
    {
      name: 'Collect Shot',
      description: 'Launch with optimal settings and add data point to validation dataset.',
      icon: '📊',
      keyBinding: undefined
    },
    {
      name: 'Run Normality Tests',
      description: 'Execute all 3 normality tests on your collected data (requires minimum 30 shots).',
      icon: '🧮',
      keyBinding: undefined
    },
    {
      name: 'View Q-Q Plot',
      description: 'Visual assessment of normality - points should follow the diagonal line.',
      icon: '📈',
      keyBinding: undefined
    },
    {
      name: 'Reset Validation',
      description: 'Clear all collected data and start validation study over.',
      icon: '🔄',
      keyBinding: undefined
    }
  ],
  scoring: [
    {
      action: 'Collect Data Point',
      points: 10,
      description: 'Add one valid shot to validation dataset'
    },
    {
      action: 'Reach Minimum Sample',
      points: 100,
      description: 'Collect required 30 data points for valid testing'
    },
    {
      action: 'Pass Normality Tests',
      points: 300,
      description: 'Data passes all 3 normality tests (p-value > 0.05)'
    },
    {
      action: 'Statistical Mastery',
      points: 200,
      description: 'Correctly interpret test results and understand implications'
    }
  ],
  learningGoals: [
    {
      concept: 'Normal Distribution Basics',
      description: 'Understand what normal distribution is and why it matters in Six Sigma',
      difficulty: 'intermediate'
    },
    {
      concept: 'Anderson-Darling Test',
      description: 'Learn this powerful normality test that emphasizes tails of distribution',
      difficulty: 'advanced'
    },
    {
      concept: 'Shapiro-Wilk Test',
      description: 'Understand this commonly used test for small to medium sample sizes',
      difficulty: 'advanced'
    },
    {
      concept: 'Kolmogorov-Smirnov Test',
      description: 'Learn about this distribution-free test for comparing samples',
      difficulty: 'advanced'
    },
    {
      concept: 'Q-Q Plot Interpretation',
      description: 'Visual assessment of normality through quantile-quantile plots',
      difficulty: 'intermediate'
    },
    {
      concept: 'Descriptive Statistics',
      description: 'Calculate and interpret mean, median, standard deviation, skewness, and kurtosis',
      difficulty: 'beginner'
    }
  ],
  tips: [
    'Collect at least 30-50 data points for reliable normality testing',
    'Q-Q plots are powerful visual tools - learn to read them',
    'P-value > 0.05 typically indicates normal distribution',
    'If data is non-normal, capability analysis may not be valid',
    'Watch for outliers - they can skew normality test results'
  ],
  successCriteria: [
    'Collect minimum 30 data points',
    'Achieve p-value > 0.05 on all three normality tests',
    'Interpret Q-Q plot correctly',
    'Calculate and understand descriptive statistics',
    'Recognize what normal vs non-normal data looks like'
  ],
  estimatedTime: '10-15 minutes'
}

// ============================================================================
// CATAPULT - CAPABILITY MODE
// ============================================================================

export const catapultCapabilityRules: GameRule = {
  gameId: 'catapult',
  mode: 'capability',
  overview: {
    title: 'Process Capability Analysis',
    description: 'Define specification limits and assess whether your process can consistently meet customer requirements.',
    objective: 'Learn process capability indices (Cp, Cpk, Pp, Ppk, Cpm) and understand the relationship between process variation and specification limits.',
    imageUrl: undefined
  },
  controls: [
    {
      name: 'Lower Spec Limit (LSL)',
      description: 'Set minimum acceptable distance. Shots below this are defects.',
      icon: '📉',
      keyBinding: undefined
    },
    {
      name: 'Upper Spec Limit (USL)',
      description: 'Set maximum acceptable distance. Shots above this are defects.',
      icon: '📈',
      keyBinding: undefined
    },
    {
      name: 'Target Value',
      description: 'Ideal target distance. Used for Cpm calculation (centering).',
      icon: '🎯',
      keyBinding: undefined
    },
    {
      name: 'Run Capability Analysis',
      description: 'Calculate all capability indices and sigma level from validation data.',
      icon: '🧮',
      keyBinding: undefined
    },
    {
      name: 'View Process Capability Chart',
      description: 'Histogram with specification limits and normal curve overlay.',
      icon: '📊',
      keyBinding: undefined
    }
  ],
  scoring: [
    {
      action: 'Define Specifications',
      points: 50,
      description: 'Set valid LSL, USL, and Target values'
    },
    {
      action: 'Cp ≥ 1.33',
      points: 200,
      description: 'Achieve "Adequate" process capability'
    },
    {
      action: 'Cp ≥ 2.0',
      points: 500,
      description: 'Achieve "Six Sigma" level capability'
    },
    {
      action: 'Process Centered',
      points: 100,
      description: 'Cpk ≈ Cp (process mean at target)'
    },
    {
      action: 'DPMO < 233',
      points: 300,
      description: 'Achieve Six Sigma quality level (< 3.4 DPMO ideal)'
    }
  ],
  learningGoals: [
    {
      concept: 'Cp Index (Potential Capability)',
      description: 'Understand capability if process is perfectly centered',
      difficulty: 'intermediate'
    },
    {
      concept: 'Cpk Index (Actual Capability)',
      description: 'Learn how process centering affects real-world capability',
      difficulty: 'intermediate'
    },
    {
      concept: 'Pp & Ppk (Performance Indices)',
      description: 'Distinguish between short-term capability and long-term performance',
      difficulty: 'advanced'
    },
    {
      concept: 'Cpm (Taguchi Index)',
      description: 'Understand capability index that penalizes off-target performance',
      difficulty: 'advanced'
    },
    {
      concept: 'Sigma Level',
      description: 'Convert capability indices to sigma quality levels (3σ to 6σ)',
      difficulty: 'intermediate'
    },
    {
      concept: 'DPMO & PPM',
      description: 'Calculate defects per million opportunities and parts per million',
      difficulty: 'intermediate'
    }
  ],
  tips: [
    'Cp ≥ 1.33 is industry standard for adequate capability',
    'Cp ≥ 2.0 represents Six Sigma quality (but check Cpk!)',
    'Cpk < Cp means process is off-center - adjust the mean',
    'Set realistic specification limits based on customer needs',
    'Six Sigma aims for 3.4 DPMO (6σ quality level)'
  ],
  successCriteria: [
    'Define realistic specification limits (LSL, USL, Target)',
    'Calculate all 5 capability indices correctly',
    'Achieve Cp ≥ 1.33 (Adequate capability)',
    'Understand difference between Cp and Cpk',
    'Interpret sigma level and DPMO results',
    'Know when process needs centering vs. variation reduction'
  ],
  estimatedTime: '10-15 minutes'
}

// ============================================================================
// CATAPULT - CONTROL MODE
// ============================================================================

export const catapultControlRules: GameRule = {
  gameId: 'catapult',
  mode: 'control',
  overview: {
    title: 'Control Phase - SPC Monitoring',
    description: 'Monitor your process using X-bar and R control charts. Detect special cause variation using Nelson Rules.',
    objective: 'Learn Statistical Process Control (SPC) by creating control charts, calculating control limits, and identifying out-of-control patterns.',
    imageUrl: undefined
  },
  controls: [
    {
      name: 'Subgroup Size',
      description: 'Select subgroup size (2-10 shots). Larger subgroups give better estimates but slower response.',
      icon: '📊',
      keyBinding: undefined
    },
    {
      name: 'Collect Shot',
      description: 'Add shot to current subgroup. Subgroup completes when size is reached.',
      icon: '🎯',
      keyBinding: undefined
    },
    {
      name: 'Calculate Control Limits',
      description: 'After 20+ subgroups, calculate UCL, CL, LCL for X-bar and R charts.',
      icon: '📏',
      keyBinding: undefined
    },
    {
      name: 'Apply Nelson Rules',
      description: 'Detect out-of-control patterns using all 8 Nelson Rules.',
      icon: '🚨',
      keyBinding: undefined
    },
    {
      name: 'View Violations',
      description: 'See detailed list of all detected violations with recommendations.',
      icon: '⚠️',
      keyBinding: undefined
    }
  ],
  scoring: [
    {
      action: 'Complete Subgroup',
      points: 20,
      description: 'Collect all shots for one subgroup'
    },
    {
      action: 'Establish Control Limits',
      points: 200,
      description: 'Collect 20+ subgroups and calculate control limits'
    },
    {
      action: 'Process In Control',
      points: 500,
      description: 'Maintain stable process with no Nelson Rules violations'
    },
    {
      action: 'Detect Special Cause',
      points: 300,
      description: 'Identify and understand out-of-control patterns'
    },
    {
      action: 'SPC Mastery',
      points: 400,
      description: 'Correctly interpret all violations and know corrective actions'
    }
  ],
  learningGoals: [
    {
      concept: 'X-bar Chart (Process Mean)',
      description: 'Monitor average performance over time to detect shifts in process center',
      difficulty: 'intermediate'
    },
    {
      concept: 'R Chart (Process Variation)',
      description: 'Monitor range to detect changes in process consistency',
      difficulty: 'intermediate'
    },
    {
      concept: 'Control Limit Calculation',
      description: 'Learn formulas using A2, D3, D4 constants based on subgroup size',
      difficulty: 'advanced'
    },
    {
      concept: 'Nelson Rules (8 Patterns)',
      description: 'Identify special cause patterns: trends, shifts, runs, cycles',
      difficulty: 'advanced'
    },
    {
      concept: 'Common vs Special Cause',
      description: 'Distinguish between random variation and assignable causes',
      difficulty: 'intermediate'
    },
    {
      concept: 'Process Stability',
      description: 'Understand what "in statistical control" means and why it matters',
      difficulty: 'intermediate'
    }
  ],
  tips: [
    'Start with subgroup size of 5 for good balance of sensitivity and speed',
    'Collect at least 20-25 subgroups before calculating control limits',
    'Always check R chart first - variation must be stable before analyzing mean',
    'One Nelson Rule violation requires investigation, multiple require action',
    'Use control charts to maintain gains from improvement projects',
    'Remember: In control ≠ capable. Process must be both stable AND capable'
  ],
  successCriteria: [
    'Collect minimum 20 subgroups',
    'Calculate control limits correctly using A2, D3, D4 constants',
    'Create both X-bar and R control charts',
    'Identify at least one Nelson Rule pattern',
    'Understand difference between common and special cause variation',
    'Know when to recalculate control limits'
  ],
  estimatedTime: '15-20 minutes'
}

// ============================================================================
// HELPER FUNCTION
// ============================================================================

/**
 * Get game rules for a specific game and mode
 */
export function getGameRules(gameId: string, mode?: GameMode): GameRule {
  if (gameId === 'catapult') {
    switch (mode) {
      case 'freeplay':
        return catapultFreePlayRules
      case 'doe':
        return catapultDOERules
      case 'validation':
        return catapultValidationRules
      case 'capability':
        return catapultCapabilityRules
      case 'control':
        return catapultControlRules
      default:
        return catapultFreePlayRules
    }
  }

  // Add other games here in the future
  throw new Error(`Rules not found for game: ${gameId}`)
}

/**
 * Get all rules for a specific game
 */
export function getAllGameRules(gameId: string): GameRule[] {
  if (gameId === 'catapult') {
    return [
      catapultFreePlayRules,
      catapultDOERules,
      catapultValidationRules,
      catapultCapabilityRules,
      catapultControlRules
    ]
  }

  throw new Error(`Rules not found for game: ${gameId}`)
}

/**
 * Check if user has seen rules for a game/mode
 */
export function hasSeenRules(gameId: string, mode?: string): boolean {
  if (typeof window === 'undefined') return false
  
  const key = mode ? `rules-seen-${gameId}-${mode}` : `rules-seen-${gameId}`
  return localStorage.getItem(key) === 'true'
}

/**
 * Mark rules as seen for a game/mode
 */
export function markRulesAsSeen(gameId: string, mode?: string): void {
  if (typeof window === 'undefined') return
  
  const key = mode ? `rules-seen-${gameId}-${mode}` : `rules-seen-${gameId}`
  localStorage.setItem(key, 'true')
}

/**
 * Reset rules seen status (useful for testing)
 */
export function resetRulesSeenStatus(gameId: string, mode?: string): void {
  if (typeof window === 'undefined') return
  
  if (mode) {
    localStorage.removeItem(`rules-seen-${gameId}-${mode}`)
  } else {
    // Reset all modes for this game
    const modes: GameMode[] = ['freeplay', 'doe', 'validation', 'capability', 'control']
    modes.forEach(m => {
      localStorage.removeItem(`rules-seen-${gameId}-${m}`)
    })
    localStorage.removeItem(`rules-seen-${gameId}`)
  }
}
