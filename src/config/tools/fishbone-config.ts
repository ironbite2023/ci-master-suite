/**
 * Fishbone Diagram - Guided Tool Configuration
 * Ishikawa Cause & Effect Analysis using 6M Methodology
 * 
 * MIGRATED TO CENTRALIZED GUIDANCE LIBRARY
 */

import { ToolConfiguration } from '@/types/guided-tools'
import {
  PROBLEM_BE_SPECIFIC,
  PROBLEM_SHOW_GAP,
  PROBLEM_FOCUS_ON_EFFECT,
  PROBLEM_DONT_SKIP,
  PROBLEM_USE_DATA_DRIVEN,
  PROBLEM_USE_DATA,
  TEAM_INVOLVE_EXPERTS,
  PROBLEM_STATING_CAUSES,
  PROBLEM_TOO_VAGUE,
  RCA_FISHBONE_ASQ
} from '@/lib/guidance'

export const fishboneConfig: ToolConfiguration = {
  id: 'fishbone-diagram',
  name: 'Fishbone Diagram',
  description: 'Ishikawa Cause & Effect Analysis (6M Method)',
  category: 'continuous-improvement',
  difficulty: 'intermediate',
  estimatedTime: '20-40 minutes',
  icon: '🐟',
  version: '1.0.0',
  lastUpdated: '2024-01-01',

  objectives: [
    'Identify potential root causes using 6M categories',
    'Organize causes into Machine, Method, Material, People, Measurement, Environment',
    'Develop actionable solutions for top causes',
    'Create visual cause-and-effect diagram'
  ],

  prerequisites: [
    'Clear problem statement',
    'Basic understanding of root cause analysis',
    'Team input recommended'
  ],

  tags: ['root-cause-analysis', 'fishbone', 'ishikawa', '6m', 'cause-effect', 'quality'],
  relatedTools: ['5-whys', 'a3-problem-solving', 'pareto-analysis'],

  introduction: {
    title: 'Welcome to Fishbone Diagram',
    overview: 'The Fishbone Diagram (also called Ishikawa or Cause-and-Effect Diagram) helps identify and organize potential causes of a problem into six categories: Machine, Method, Material, People (Manpower), Measurement, and Environment (Mother Nature).',
    videoUrl: '/videos/fishbone-intro.mp4',
    estimatedTime: '30',
    
    whenToUse: [
      'Need to identify multiple potential causes',
      'Want to organize causes by category',
      'Team brainstorming session',
      'Visual presentation of cause-effect relationships',
      'Complex problems with many contributing factors'
    ],
    
    whatYouWillNeed: [
      'Clear problem statement or effect to analyze',
      'Team members from different areas (recommended)',
      '20-40 minutes of focused time',
      'Knowledge of the process or system'
    ],
    
    expectedOutcomes: [
      'Visual diagram showing all potential causes',
      'Causes organized by 6M categories',
      'Identified top priority causes to address',
      'Action plan for next steps',
      'Team alignment on root causes'
    ]
  },

  steps: [
    {
      id: 'problem-definition',
      stepNumber: 1,
      title: 'Define the Problem',
      description: 'Clearly state the problem or effect you want to analyze',
      optional: false,

      questions: [
        {
          id: 'problem_statement',
          order: 1,
          text: 'What is the problem or effect you want to analyze?',
          type: 'long-text',
          required: true,

          helpText: 'This is the "head" of the fishbone - the effect you\'re investigating. Be specific and measurable.',
          placeholder: 'Example: High defect rate in final assembly (8.5% vs. target 2%)',

          hints: [
            {
              id: 'hint-problem-specific',
              trigger: 'hover',
              title: 'Be Specific',
              content: 'Be as specific as possible. Include metrics, timeframes, and location if applicable.',
              type: 'tip'
            },
            {
              id: 'hint-problem-detail',
              trigger: 'auto',
              title: 'Add Detail',
              content: 'Good start! Try to be even more specific. Can you add numbers or measurements?',
              type: 'info'
            }
          ],

          examples: [
            {
              id: 'example-problem-1',
              title: 'Manufacturing Quality Problem',
              description: 'Specific problem with metrics and timeframe',
              value: 'Customer complaint rate increased from 2% to 8% in Q3 2024 for Product Line A',
              industry: 'Manufacturing',
              useCase: 'Quality Issues',
              scenario: 'Increase in defects',
              difficulty: 'intermediate' as const
            },
            {
              id: 'example-problem-2',
              title: 'Service Process Problem',
              description: 'Process efficiency problem with targets',
              value: 'Order processing time exceeds 5 days (target: 2 days) for 60% of orders',
              industry: 'Service',
              useCase: 'Process Efficiency',
              scenario: 'Slow order fulfillment',
              difficulty: 'beginner' as const
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Problem statement is required.'
            },
            {
              type: 'min',
              value: 20,
              errorMessage: 'Please provide a detailed problem statement (at least 20 characters).'
            }
          ],

          inputConfig: {
            maxLength: 300
          }
        }
      ],

      guidance: {
        introduction: 'The Fishbone Diagram helps identify root causes by organizing them into six categories (6M: Machine, Method, Material, People, Measurement, Environment).',
        
        // ✅ MIGRATED: Using centralized guidance library
        tips: [
          PROBLEM_BE_SPECIFIC,
          PROBLEM_SHOW_GAP,
          PROBLEM_FOCUS_ON_EFFECT
        ],
        warnings: [
          PROBLEM_DONT_SKIP
        ],
        bestPractices: [
          PROBLEM_USE_DATA_DRIVEN
        ],
        commonMistakes: [
          PROBLEM_STATING_CAUSES,
          PROBLEM_TOO_VAGUE
        ],
        resources: [
          RCA_FISHBONE_ASQ
        ]
      },

      validation: {
        requiredQuestions: ['problem_statement']
      }
    },

    {
      id: 'machine-causes',
      stepNumber: 2,
      title: 'Machine Causes',
      description: 'Identify equipment, tools, or technology-related causes',
      optional: false,

      questions: [
        {
          id: 'machine_causes',
          order: 1,
          text: 'What MACHINE/EQUIPMENT factors might be contributing to this problem?',
          type: 'long-text',
          required: false,

          helpText: 'Think about: Equipment failures, tool wear, technology limitations, automation issues, calibration problems.',
          placeholder: 'Press Enter after each cause to add another',

          hints: [
            {
              id: 'hint-machine-factors',
              trigger: 'hover',
              title: 'Machine Factors',
              content: '⚙️ Consider: Equipment age, maintenance status, capacity, reliability, automation, software/hardware issues.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'example-machine-1',
              title: 'Machine Causes Example',
              description: 'Equipment and maintenance related causes',
              value: 'Press machine #3 calibration drifts after 4 hours\nLack of preventive maintenance schedule\nOutdated software on CNC machines',
              industry: 'Manufacturing',
              useCase: 'Equipment Issues',
              scenario: 'Production quality problems',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [],

          inputConfig: {
            maxLength: 500
          }
        }
      ],

      guidance: {
        introduction: '⚙️ Machine causes relate to physical equipment, tools, technology, and systems used in the process.',
        tips: [],
        warnings: [],
        bestPractices: [],
        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: []
      }
    },

    {
      id: 'method-causes',
      stepNumber: 3,
      title: 'Method Causes',
      description: 'Identify process, procedure, and workflow-related causes',
      optional: false,

      questions: [
        {
          id: 'method_causes',
          order: 1,
          text: 'What METHOD/PROCESS factors might be contributing to this problem?',
          type: 'long-text',
          required: false,

          helpText: 'Think about: Standard operating procedures, workflow design, process steps, decision rules, approvals.',
          placeholder: 'Press Enter after each cause to add another',

          hints: [
            {
              id: 'hint-method-factors',
              trigger: 'hover',
              title: 'Method Factors',
              content: '📋 Consider: SOPs, process steps, sequence, timing, handoffs, approval chains, work instructions.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'example-method-1',
              title: 'Method Causes Example',
              description: 'Process and procedure related causes',
              value: 'Inspection procedure skips critical dimensions\nNo standardized training process\nInconsistent handoff between shifts',
              industry: 'Manufacturing',
              useCase: 'Process Issues',
              scenario: 'Quality problems',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [],

          inputConfig: {
            maxLength: 500
          }
        }
      ],

      guidance: {
        introduction: '📋 Method causes relate to how work is done - procedures, processes, and workflows.',
        tips: [],
        warnings: [],
        bestPractices: [],
        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: []
      }
    },

    {
      id: 'material-causes',
      stepNumber: 4,
      title: 'Material Causes',
      description: 'Identify raw materials, supplies, and input-related causes',
      optional: false,

      questions: [
        {
          id: 'material_causes',
          order: 1,
          text: 'What MATERIAL/INPUT factors might be contributing to this problem?',
          type: 'long-text',
          required: false,

          helpText: 'Think about: Raw materials quality, supplier issues, inventory problems, specifications, storage conditions.',
          placeholder: 'Press Enter after each cause to add another',

          hints: [
            {
              id: 'hint-material-factors',
              trigger: 'hover',
              title: 'Material Factors',
              content: '📦 Consider: Material quality, supplier reliability, specifications, storage, handling, inventory management.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'example-material-1',
              title: 'Material Causes Example',
              description: 'Raw material and supply related causes',
              value: 'Steel supplier changed alloy composition\nInconsistent raw material batch quality\nPoor storage conditions causing material degradation',
              industry: 'Manufacturing',
              useCase: 'Material Issues',
              scenario: 'Quality defects',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [],

          inputConfig: {
            maxLength: 500
          }
        }
      ],

      guidance: {
        introduction: '📦 Material causes relate to inputs, raw materials, supplies, and consumables.',
        tips: [],
        warnings: [],
        bestPractices: [],
        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: []
      }
    },

    {
      id: 'people-causes',
      stepNumber: 5,
      title: 'People Causes',
      description: 'Identify human factors, training, and workforce-related causes',
      optional: false,

      questions: [
        {
          id: 'people_causes',
          order: 1,
          text: 'What PEOPLE/WORKFORCE factors might be contributing to this problem?',
          type: 'long-text',
          required: false,

          helpText: 'Think about: Training gaps, skill levels, communication issues, workload, fatigue, motivation.',
          placeholder: 'Press Enter after each cause to add another',

          hints: [
            {
              id: 'hint-people-factors',
              trigger: 'hover',
              title: 'People Factors',
              content: '👥 Consider: Training, experience, communication, workload, staffing levels, shift patterns, morale.',
              type: 'tip'
            },
            {
              id: 'hint-people-systems',
              trigger: 'auto',
              title: 'Systems, Not Blame',
              content: '💡 Remember: Focus on SYSTEMS, not blaming individuals. What systemic issues affect people?',
              type: 'warning'
            }
          ],

          examples: [
            {
              id: 'example-people-1',
              title: 'People Causes Example',
              description: 'Human factors and system-related causes',
              value: 'Inadequate training for new equipment\nHigh turnover leading to inexperienced staff\nPoor communication between departments',
              industry: 'Manufacturing',
              useCase: 'Human Factors',
              scenario: 'Quality and efficiency issues',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [],

          inputConfig: {
            maxLength: 500
          }
        }
      ],

      guidance: {
        introduction: '👥 People causes relate to human factors, but focus on SYSTEMS, not blaming individuals.',
        tips: [],
        warnings: [],
        bestPractices: [],
        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: []
      }
    },

    {
      id: 'measurement-causes',
      stepNumber: 6,
      title: 'Measurement Causes',
      description: 'Identify inspection, testing, and data collection-related causes',
      optional: false,

      questions: [
        {
          id: 'measurement_causes',
          order: 1,
          text: 'What MEASUREMENT/INSPECTION factors might be contributing to this problem?',
          type: 'long-text',
          required: false,

          helpText: 'Think about: Measurement accuracy, calibration, inspection methods, data collection, metrics, gauges.',
          placeholder: 'Press Enter after each cause to add another',

          hints: [
            {
              id: 'hint-measurement-factors',
              trigger: 'hover',
              title: 'Measurement Factors',
              content: '📏 Consider: Gauge accuracy, calibration frequency, inspection methods, data collection, measurement systems.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'example-measurement-1',
              title: 'Measurement Causes Example',
              description: 'Measurement system and data collection causes',
              value: 'Micrometer not calibrated in 6 months\nInconsistent inspection criteria between inspectors\nManual data entry errors',
              industry: 'Manufacturing',
              useCase: 'Quality Control',
              scenario: 'Measurement reliability',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [],

          inputConfig: {
            maxLength: 500
          }
        }
      ],

      guidance: {
        introduction: '📏 Measurement causes relate to how you measure, inspect, test, and collect data.',
        tips: [],
        warnings: [],
        bestPractices: [],
        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: []
      }
    },

    {
      id: 'environment-causes',
      stepNumber: 7,
      title: 'Environment Causes',
      description: 'Identify workplace conditions, external factors, and surroundings-related causes',
      optional: false,

      questions: [
        {
          id: 'environment_causes',
          order: 1,
          text: 'What ENVIRONMENT factors might be contributing to this problem?',
          type: 'long-text',
          required: false,

          helpText: 'Think about: Temperature, humidity, lighting, noise, cleanliness, layout, external factors.',
          placeholder: 'Press Enter after each cause to add another',

          hints: [
            {
              id: 'hint-environment-factors',
              trigger: 'hover',
              title: 'Environment Factors',
              content: '🌍 Consider: Temperature, humidity, cleanliness, lighting, noise, workspace layout, weather, regulations.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'example-environment-1',
              title: 'Environment Causes Example',
              description: 'Environmental and working condition causes',
              value: 'Factory floor temperature fluctuates 15°F throughout day\nPoor lighting in inspection area\nCrowded workspace limits movement',
              industry: 'Manufacturing',
              useCase: 'Working Conditions',
              scenario: 'Environmental factors',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [],

          inputConfig: {
            maxLength: 500
          }
        }
      ],

      guidance: {
        introduction: '🌍 Environment causes relate to physical surroundings, working conditions, and external factors.',
        tips: [],
        warnings: [],
        bestPractices: [],
        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: []
      }
    },

    {
      id: 'review-and-notes',
      stepNumber: 8,
      title: 'Review & Analysis',
      description: 'Review your fishbone diagram and add analysis notes',
      optional: false,

      questions: [
        {
          id: 'key_findings',
          order: 1,
          text: 'What are the key findings from your analysis?',
          type: 'long-text',
          required: false,

          helpText: 'Summarize the most significant causes you identified across all categories.',
          placeholder: 'Example: Main contributors appear to be calibration issues (Machine), inconsistent SOPs (Method), and training gaps (People)...',

          hints: [
            {
              id: 'hint-key-findings',
              trigger: 'hover',
              title: 'Look for Patterns',
              content: 'Look for patterns across categories. Which causes appear most impactful or urgent?',
              type: 'tip'
            }
          ],

          validation: [],

          inputConfig: {
            maxLength: 500
          }
        },

        {
          id: 'next_steps',
          order: 2,
          text: 'What are your recommended next steps?',
          type: 'long-text',
          required: false,

          helpText: 'Based on your analysis, what actions should be taken? Prioritize the most critical causes.',
          placeholder: 'Example: 1. Immediate calibration of all measurement equipment\n2. Develop standardized training program\n3. Review and update SOPs...',

          hints: [
            {
              id: 'hint-next-steps',
              trigger: 'hover',
              title: 'Prioritize Actions',
              content: 'Prioritize causes that: 1) Have biggest impact, 2) Are easiest to fix, 3) Prevent recurrence.',
              type: 'tip'
            }
          ],

          validation: [],

          inputConfig: {
            maxLength: 800
          }
        }
      ],

      guidance: {
        introduction: 'Review your fishbone diagram and document key findings and next steps.',
        tips: [PROBLEM_USE_DATA, TEAM_INVOLVE_EXPERTS],
        warnings: [],
        bestPractices: [PROBLEM_USE_DATA_DRIVEN],
        commonMistakes: [],
        resources: [RCA_FISHBONE_ASQ]
      },

      validation: {
        requiredQuestions: []
      }
    }
  ],

  completionCriteria: {
    allStepsCompleted: false,
    requiredSteps: ['problem-definition'],
    optionalSteps: ['machine-causes', 'method-causes', 'material-causes', 'people-causes', 'measurement-causes', 'environment-causes', 'summary-actions']
  },

  nextSteps: [
    {
      id: 'validate-causes',
      title: 'Validate Root Causes',
      description: 'Use data or experimentation to verify your identified causes.',
      type: 'action',
      priority: 'recommended'
    },
    {
      id: 'develop-solutions',
      title: 'Develop Countermeasures',
      description: 'Create action plans to address the top priority causes.',
      type: 'action',
      priority: 'recommended'
    },
    {
      id: 'use-5-whys',
      title: 'Dig Deeper with 5 Whys',
      description: 'Use 5 Why Analysis to explore the most critical causes further.',
      type: 'tool',
      route: '/dashboard/tools/five-why-analysis',
      priority: 'optional'
    }
  ]
}
