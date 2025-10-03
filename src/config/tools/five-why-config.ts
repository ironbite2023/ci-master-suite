/**
 * 5 Why Analysis - Complete Tool Configuration
 * Pilot implementation for Guided Tools Framework
 * 
 * MIGRATED TO CENTRALIZED GUIDANCE LIBRARY
 */

import { ToolConfiguration } from '@/types/guided-tools'
import {
  // Tips
  PROBLEM_BE_SPECIFIC,
  PROBLEM_USE_DATA,
  
  // Warnings
  PROBLEM_DONT_SKIP,
  PROBLEM_DONT_JUMP_TO_SOLUTIONS,
  
  // Best Practices
  PROBLEM_USE_DATA_DRIVEN,
  TEAM_CROSS_FUNCTIONAL,
  
  // Common Mistakes
  PROBLEM_STATING_CAUSES,
  PROBLEM_TOO_VAGUE,
  
  // Resources
  RCA_FIVE_WHY_GUIDE,
  PROBLEM_SMART_GOALS
} from '@/lib/guidance'

export const fiveWhyConfig: ToolConfiguration = {
  id: 'five-why-analysis',
  name: '5 Why Analysis',
  description: 'Discover root causes through iterative questioning',
  category: 'continuous-improvement',
  difficulty: 'beginner',
  estimatedTime: '15-20 minutes',
  icon: '🔍',
  version: '1.0.0',
  lastUpdated: '2024-01-01',

  objectives: [
    'Identify root causes through systematic questioning',
    'Move beyond symptoms to underlying issues',
    'Develop effective countermeasures',
    'Prevent problem recurrence'
  ],

  prerequisites: [
    'Clear problem statement with observable facts',
    'Understanding of the problem context',
    'Open mindset - avoid jumping to conclusions'
  ],

  tags: ['root-cause', 'problem-solving', 'quality', 'beginner', 'lean', 'continuous-improvement'],

  relatedTools: [
    'fishbone-diagram',
    'a3-thinking',
    'pdca-cycle',
    'pareto-analysis',
    'root-cause-analysis'
  ],

  introduction: {
    title: 'Welcome to 5 Why Analysis',
    overview: 'The 5 Why technique is a simple but powerful tool for finding the root cause of problems. By asking "why" repeatedly, we move past symptoms to discover the underlying issues.',
    videoUrl: '/videos/five-why-intro.mp4',
    estimatedTime: '15',
    
    whenToUse: [
      'Problem has a clear, observable symptom',
      'Need to identify underlying root cause',
      'Want to prevent problem recurrence',
      'Team needs alignment on problem source',
      'Issues appear simple but keep recurring'
    ],
    
    whatYouWillNeed: [
      'Clear problem statement',
      'Observable facts about the problem',
      'Subject matter expertise or team input',
      'Open mind - avoid jumping to conclusions'
    ],
    
    expectedOutcomes: [
      'Clear identification of root cause(s)',
      'Understanding of cause-and-effect relationships',
      'Actionable countermeasures',
      'Prevention strategy to avoid recurrence',
      'Documentation for future reference'
    ]
  },

  steps: [
    {
      id: 'step-1-problem',
      stepNumber: 1,
      title: 'Define the Problem',
      description: 'Create a clear, specific problem statement',
      optional: false,

      questions: [
        {
          id: 'problem_statement',
          order: 1,
          text: 'What is the problem?',
          type: 'long-text',
          required: true,
          helpText: 'Describe what happened in specific, measurable terms. Focus on facts, not interpretations.',
          placeholder: 'Example: Assembly line #3 produced 15 defective units on 10/2/2025 between 2-4 PM, resulting in $3,000 in scrap costs.',

          hints: [
            {
              id: 'hint-specific',
              trigger: 'auto',
              title: 'Be Specific',
              content: 'Include who, what, when, where, and how much. Avoid vague descriptions.',
              type: 'tip'
            },
            {
              id: 'hint-measurable',
              trigger: 'auto',
              title: 'Make it Measurable',
              content: 'Use numbers: quantities, dates, times, costs, percentages.',
              type: 'tip'
            },
            {
              id: 'hint-observable',
              trigger: 'hover',
              title: 'Use Observable Facts',
              content: 'Describe what you can see, touch, count, or measure - not opinions or assumptions.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'example-manufacturing',
              title: 'Manufacturing Quality Issue',
              description: 'Defective parts in production',
              value: 'Assembly line #3 produced 15 defective units with misaligned components on 10/2/2025 between 2-4 PM, resulting in $3,000 in scrap costs.',
              difficulty: 'beginner',
              industry: 'Manufacturing',
              useCase: 'Quality Control',
              scenario: 'Production line quality issue',
              isTemplate: false
            },
            {
              id: 'example-service',
              title: 'Service Delivery Delay',
              description: 'Customer service issue',
              value: 'Customer support response time increased from 2 hours to 6 hours on 10/1/2025, affecting 45 customers and resulting in 12 complaints.',
              difficulty: 'beginner',
              industry: 'Service',
              useCase: 'Process Improvement',
              scenario: 'Service level degradation',
              isTemplate: false
            },
            {
              id: 'example-healthcare',
              title: 'Healthcare Process Issue',
              description: 'Patient wait time problem',
              value: 'Emergency department wait times exceeded 4 hours for 23 patients on 9/28/2025, surpassing the 2-hour target by 100%.',
              difficulty: 'intermediate',
              industry: 'Healthcare',
              useCase: 'Patient Experience',
              scenario: 'Wait time exceeding targets',
              isTemplate: false
            },
            {
              id: 'example-office',
              title: 'Administrative Process',
              description: 'Invoice processing delay',
              value: 'Invoice approval process took 14 days in September vs. target of 5 days, delaying payment to 28 vendors.',
              difficulty: 'beginner',
              industry: 'Office/Admin',
              useCase: 'Process Efficiency',
              scenario: 'Administrative bottleneck',
              isTemplate: false
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Problem statement is required.'
            },
            {
              type: 'min',
              value: 30,
              errorMessage: 'Problem statement must be at least 30 characters and include specific details.'
            },
            {
              type: 'max',
              value: 500,
              errorMessage: 'Problem statement must not exceed 500 characters.'
            }
          ],

          inputConfig: {
            maxLength: 500
          }
        },

        {
          id: 'problem_impact',
          order: 2,
          text: 'What is the impact of this problem?',
          type: 'multi-select',
          required: true,
          helpText: 'Select all areas affected by this problem.',

          inputConfig: {
            options: [
              {
                value: 'quality',
                label: 'Quality',
                description: 'Defects, errors, customer satisfaction',
                icon: '⭐'
              },
              {
                value: 'delivery',
                label: 'Delivery/Time',
                description: 'Delays, cycle time, lead time',
                icon: '⏱️'
              },
              {
                value: 'cost',
                label: 'Cost',
                description: 'Increased expenses, waste, rework',
                icon: '💰'
              },
              {
                value: 'safety',
                label: 'Safety',
                description: 'Risk to people or equipment',
                icon: '🛡️'
              },
              {
                value: 'morale',
                label: 'Morale',
                description: 'Team frustration, engagement',
                icon: '😊'
              },
              {
                value: 'compliance',
                label: 'Compliance',
                description: 'Regulatory or policy violations',
                icon: '📋'
              }
            ]
          },

          validation: [
            {
              type: 'required',
              errorMessage: 'Please select at least one impact area.'
            }
          ]
        },

        {
          id: 'problem_frequency',
          order: 3,
          text: 'How often does this problem occur?',
          type: 'single-select',
          required: true,
          helpText: 'Understanding frequency helps prioritize and plan countermeasures.',

          inputConfig: {
            options: [
              { value: 'continuous', label: 'Continuous (Always happening)', description: 'Ongoing issue' },
              { value: 'frequent', label: 'Frequent (Multiple times per day/week)', description: 'Regular occurrence' },
              { value: 'occasional', label: 'Occasional (Few times per month)', description: 'Sporadic pattern' },
              { value: 'rare', label: 'Rare (Once or twice)', description: 'Isolated incident' }
            ]
          },

          validation: [
            {
              type: 'required',
              errorMessage: 'Please select how often this problem occurs.'
            }
          ]
        }
      ],

      guidance: {
        introduction: 'A well-defined problem is half solved. Take time to be precise and specific. Avoid jumping to conclusions about causes at this stage.',
        
        // ✅ MIGRATED: Using centralized guidance library
        tips: [
          PROBLEM_BE_SPECIFIC,
          PROBLEM_USE_DATA
        ],

        warnings: [
          PROBLEM_DONT_SKIP,
          PROBLEM_DONT_JUMP_TO_SOLUTIONS
        ],

        bestPractices: [
          PROBLEM_USE_DATA_DRIVEN,
          TEAM_CROSS_FUNCTIONAL
        ],

        resources: [
          PROBLEM_SMART_GOALS,
          RCA_FIVE_WHY_GUIDE
        ],

        commonMistakes: [
          PROBLEM_TOO_VAGUE,
          PROBLEM_STATING_CAUSES
        ]
      },

      validation: {
        requiredQuestions: ['problem_statement', 'problem_impact', 'problem_frequency']
      },
      allowSkip: false
    },

    {
      id: 'step-2-first-why',
      stepNumber: 2,
      title: 'First Why - Surface Cause',
      description: 'Ask why the problem occurred',
      optional: false,

      questions: [
        {
          id: 'why_1',
          order: 1,
          text: 'Why did this problem occur?',
          type: 'long-text',
          required: true,
          helpText: 'Look at the immediate, direct cause. What was happening right when the problem occurred?',
          placeholder: 'Example: The alignment jig was not properly calibrated.',

          hints: [
            {
              id: 'hint-direct',
              trigger: 'auto',
              title: 'Find the Direct Cause',
              content: 'What was the immediate reason? Think about what you would see or measure right at the moment of the problem.',
              type: 'tip'
            },
            {
              id: 'hint-evidence',
              trigger: 'auto',
              title: 'Use Evidence',
              content: 'Base your answer on facts, observations, or data - not assumptions.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'ex-why1-manufacturing',
              title: 'Manufacturing Example',
              description: 'Quality defect cause',
              value: 'The alignment jig was not properly calibrated, causing components to be misaligned by 2mm.',
              difficulty: 'beginner',
              industry: 'Manufacturing',
              scenario: 'Misaligned components in production',
              useCase: 'Quality Control',
              isTemplate: false
            },
            {
              id: 'ex-why1-service',
              title: 'Service Example',
              description: 'Delay cause',
              value: 'The support ticketing system had a backlog of 150 unassigned tickets.',
              difficulty: 'beginner',
              industry: 'Service',
              scenario: 'Customer support delays',
              useCase: 'Process Improvement',
              isTemplate: false
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'First "why" is required to proceed.'
            },
            {
              type: 'min',
              value: 15,
              errorMessage: 'Please provide more detail (at least 15 characters).'
            },
            {
              type: 'max',
              value: 300,
              errorMessage: 'Please keep response under 300 characters.'
            }
          ],

          inputConfig: {
            maxLength: 300
          }
        },

        {
          id: 'why_1_evidence',
          order: 2,
          text: 'What evidence supports this cause?',
          type: 'short-text',
          required: false,
          helpText: 'Optional: Add any data, observations, or facts that confirm this cause.',
          placeholder: 'Example: Calibration log shows last check was 3 weeks ago',

          validation: [],

          inputConfig: {
            maxLength: 200
          }
        }
      ],

      guidance: {
        introduction: 'Now we begin asking "why". Start with the direct, immediate cause - what was happening right when the problem occurred?',
        
        tips: [
          {
            id: 'tip-observable',
            title: 'Look for Observable Causes',
            content: 'The first "why" should identify something you can see, measure, or verify.',
            priority: 'high',
            icon: '👁️'
          },
          {
            id: 'tip-single',
            title: 'One Cause at a Time',
            content: 'If you find multiple causes, pick the most significant one and explore it fully.',
            priority: 'medium',
            icon: '1️⃣'
          }
        ],

        warnings: [
          {
            id: 'warn-stop-early',
            type: 'warning',
            title: 'Don\'t Stop Here',
            content: 'The first "why" is usually just a symptom or surface cause. Keep going deeper!',
            severity: 'high'
          }
        ],

        bestPractices: [
          {
            id: 'bp-verify',
            practice: 'Verify the Cause',
            rationale: 'Check that this cause actually led to the problem - ensures you\'re on the right track',
            example: 'Review logs, measurements, or ask people who witnessed it'
          }
        ],

        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: ['why_1']
      },
      allowSkip: false
    },

    {
      id: 'step-3-second-why',
      stepNumber: 3,
      title: 'Second Why - Dig Deeper',
      description: 'Ask why the first cause occurred',
      optional: false,

      questions: [
        {
          id: 'why_2',
          order: 1,
          text: 'Why did the first cause happen?',
          type: 'long-text',
          required: true,
          helpText: 'Take your answer from "Why #1" and ask why that occurred. Go one level deeper.',
          placeholder: 'Example: The calibration schedule was not being followed.',

          hints: [
            {
              id: 'hint-deeper',
              trigger: 'auto',
              title: 'Go Deeper',
              content: 'Don\'t repeat your first answer. Ask: "Why did THAT happen?" Keep peeling back the layers.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'ex-why2-manufacturing',
              title: 'Manufacturing Example',
              description: 'Process breakdown',
              value: 'The calibration schedule was not being followed because operators were unaware of the requirement.',
              difficulty: 'beginner',
              industry: 'Manufacturing',
              scenario: 'Calibration not followed',
              useCase: 'Quality Control',
              isTemplate: false
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Second "why" is required to proceed.'
            },
            {
              type: 'min',
              value: 15,
              errorMessage: 'Please provide more detail (at least 15 characters).'
            },
            {
              type: 'max',
              value: 300,
              errorMessage: 'Please keep response under 300 characters.'
            }
          ],

          inputConfig: {
            maxLength: 300
          }
        }
      ],

      guidance: {
        introduction: 'We\'re starting to move from surface symptoms to underlying causes. Keep asking why!',
        
        tips: [
          {
            id: 'tip-process',
            title: 'Look at the Process',
            content: 'Often the second "why" reveals process gaps or missing steps.',
            priority: 'medium',
            icon: '🔄'
          }
        ],

        warnings: [],
        bestPractices: [],
        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: ['why_2']
      },
      allowSkip: false
    },

    {
      id: 'step-4-third-why',
      stepNumber: 4,
      title: 'Third Why - Find Patterns',
      description: 'Ask why the second cause occurred',
      optional: false,

      questions: [
        {
          id: 'why_3',
          order: 1,
          text: 'Why did the second cause happen?',
          type: 'long-text',
          required: true,
          helpText: 'Continue the chain. Why did the previous cause occur?',
          placeholder: 'Example: There was no training program for new calibration procedures.',

          hints: [
            {
              id: 'hint-system',
              trigger: 'auto',
              title: 'Look at Systems',
              content: 'By the third "why", you often discover system or management issues.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'ex-why3-manufacturing',
              title: 'Manufacturing Example',
              description: 'System gap',
              value: 'There was no training program for calibration procedures when they were updated 6 months ago.',
              difficulty: 'intermediate',
              industry: 'Manufacturing',
              scenario: 'Training gap for updated procedures',
              useCase: 'Training',
              isTemplate: false
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Third "why" is required to proceed.'
            },
            {
              type: 'min',
              value: 15,
              errorMessage: 'Please provide more detail (at least 15 characters).'
            },
            {
              type: 'max',
              value: 300,
              errorMessage: 'Please keep response under 300 characters.'
            }
          ],

          inputConfig: {
            maxLength: 300
          }
        }
      ],

      guidance: {
        introduction: 'You\'re getting closer to root causes. Look for systemic issues, not just individual actions.',
        
        tips: [
          {
            id: 'tip-systemic',
            title: 'Identify Systemic Issues',
            content: 'Root causes are usually system problems (missing procedures, inadequate resources, unclear responsibilities).',
            priority: 'high',
            icon: '🎯'
          }
        ],

        warnings: [
          {
            id: 'warn-people',
            type: 'warning',
            title: 'Don\'t Blame People',
            content: 'If your answer is "someone forgot" or "person made a mistake", keep asking why that was possible.',
            severity: 'high'
          }
        ],

        bestPractices: [],
        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: ['why_3']
      },
      allowSkip: false
    },

    {
      id: 'step-5-fourth-why',
      stepNumber: 5,
      title: 'Fourth Why - Approach Root',
      description: 'Ask why the third cause occurred',
      optional: false,

      questions: [
        {
          id: 'why_4',
          order: 1,
          text: 'Why did the third cause happen?',
          type: 'long-text',
          required: true,
          helpText: 'Keep digging. You should be getting close to a root cause.',
          placeholder: 'Example: Training budget cuts eliminated the calibration training program.',

          examples: [
            {
              id: 'ex-why4-manufacturing',
              title: 'Manufacturing Example',
              description: 'Root cause emerging',
              value: 'Budget constraints led to elimination of specialized training programs, including calibration training.',
              difficulty: 'intermediate',
              industry: 'Manufacturing',
              scenario: 'Budget cuts affecting training',
              useCase: 'Resource Planning',
              isTemplate: false
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Fourth "why" is required to proceed.'
            },
            {
              type: 'min',
              value: 15,
              errorMessage: 'Please provide more detail (at least 15 characters).'
            },
            {
              type: 'max',
              value: 300,
              errorMessage: 'Please keep response under 300 characters.'
            }
          ],

          inputConfig: {
            maxLength: 300
          }
        }
      ],

      guidance: {
        introduction: 'You\'re likely approaching a root cause. Look for fundamental issues in your system or organization.',
        
        tips: [
          {
            id: 'tip-actionable',
            title: 'Think About Solutions',
            content: 'As you approach root causes, you should start seeing actionable countermeasures.',
            priority: 'high',
            icon: '💡'
          }
        ],

        warnings: [],
        bestPractices: [],
        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: ['why_4']
      },
      allowSkip: false
    },

    {
      id: 'step-6-fifth-why',
      stepNumber: 6,
      title: 'Fifth Why - Root Cause',
      description: 'Identify the ultimate root cause',
      optional: false,

      questions: [
        {
          id: 'why_5',
          order: 1,
          text: 'Why did the fourth cause happen?',
          type: 'long-text',
          required: true,
          helpText: 'This should reveal a root cause - a fundamental issue that, if fixed, prevents recurrence.',
          placeholder: 'Example: No formal process exists for evaluating training needs when making budget decisions.',

          hints: [
            {
              id: 'hint-root',
              trigger: 'auto',
              title: 'Is This a Root Cause?',
              content: 'A root cause is something you can fix that will prevent the problem from recurring. If fixing this wouldn\'t prevent the problem, keep asking why.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'ex-why5-manufacturing',
              title: 'Manufacturing Example - Root Cause',
              description: 'Fundamental system issue',
              value: 'No formal process exists for evaluating operational training needs during budget planning, leading to decisions that don\'t consider production requirements.',
              difficulty: 'advanced',
              industry: 'Manufacturing',
              scenario: 'Missing process for training needs assessment',
              useCase: 'Strategic Planning',
              isTemplate: false
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Fifth "why" is required to identify root cause.'
            },
            {
              type: 'min',
              value: 20,
              errorMessage: 'Root cause needs detailed explanation (at least 20 characters).'
            },
            {
              type: 'max',
              value: 300,
              errorMessage: 'Please keep response under 300 characters.'
            }
          ],

          inputConfig: {
            maxLength: 300
          }
        },

        {
          id: 'root_cause_confidence',
          order: 2,
          text: 'How confident are you that this is the root cause?',
          type: 'scale',
          required: true,
          helpText: 'Rate your confidence that fixing this cause will prevent the problem from recurring.',

          inputConfig: {
            min: 1,
            max: 10,
            step: 1
          },

          validation: []
        },

        {
          id: 'need_more_whys',
          order: 3,
          text: 'Do you need to ask more "whys"?',
          type: 'boolean',
          required: false,
          helpText: 'Five whys is a guideline, not a rule. If you haven\'t found a root cause, you may need to go deeper.',

          validation: [],

          inputConfig: {},

          conditionalLogic: [{
            condition: {
              questionId: 'root_cause_confidence',
              operator: 'less-than',
              value: 7
            },
            action: 'show'
          }]
        }
      ],

      guidance: {
        introduction: 'You should have reached a root cause - a fundamental issue that you can address to prevent recurrence.',
        
        tips: [
          {
            id: 'tip-test',
            title: 'Test Your Root Cause',
            content: 'Ask: "If we fix this, will the problem stop recurring?" If no, ask more whys.',
            priority: 'high',
            icon: '🧪'
          },
          {
            id: 'tip-multiple',
            title: 'Multiple Root Causes',
            content: 'Some problems have multiple root causes. You may need to repeat this process for each cause chain.',
            priority: 'medium',
            icon: '🌳'
          }
        ],

        warnings: [
          {
            id: 'warn-stop-early',
            type: 'warning',
            title: 'Don\'t Stop Too Early',
            content: 'If your "root cause" is still a symptom, keep asking why!',
            severity: 'high'
          }
        ],

        bestPractices: [
          {
            id: 'bp-verify',
            practice: 'Verify with Data',
            rationale: 'Check if your root cause explanation fits all occurrences of the problem - ensures you have the real root cause',
            example: 'Review past incidents to see if this cause was present'
          }
        ],

        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: ['why_5', 'root_cause_confidence']
      },
      allowSkip: false
    },

    {
      id: 'step-7-countermeasures',
      stepNumber: 7,
      title: 'Countermeasures',
      description: 'Develop actions to address the root cause',
      optional: false,

      questions: [
        {
          id: 'countermeasure_1',
          order: 1,
          text: 'What is your primary countermeasure?',
          type: 'long-text',
          required: true,
          helpText: 'Describe the main action you will take to address the root cause and prevent recurrence.',
          placeholder: 'Example: Create a formal process for evaluating training needs during annual budget planning.',

          hints: [
            {
              id: 'hint-specific-action',
              trigger: 'auto',
              title: 'Be Specific',
              content: 'Define exactly what will be done, by whom, and by when.',
              type: 'tip'
            },
            {
              id: 'hint-prevent',
              trigger: 'auto',
              title: 'Focus on Prevention',
              content: 'Your countermeasure should prevent the problem from happening again, not just fix the current instance.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'ex-countermeasure-process',
              title: 'Process Implementation',
              description: 'Adding missing process',
              value: 'Implement a quarterly training needs assessment process that feeds into budget planning, including mandatory review of all equipment calibration and maintenance training requirements.',
              difficulty: 'intermediate',
              industry: 'Manufacturing',
              scenario: 'Implementing new training assessment process',
              useCase: 'Process Improvement',
              isTemplate: false
            },
            {
              id: 'ex-countermeasure-system',
              title: 'System Update',
              description: 'Technology solution',
              value: 'Deploy automated ticketing system with intelligent routing that assigns tickets based on agent availability and expertise, preventing backlog accumulation.',
              difficulty: 'advanced',
              industry: 'Service',
              scenario: 'Automating ticket routing system',
              useCase: 'System Improvement',
              isTemplate: false
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Primary countermeasure is required.'
            },
            {
              type: 'min',
              value: 30,
              errorMessage: 'Please provide detailed countermeasure description (at least 30 characters).'
            },
            {
              type: 'max',
              value: 500,
              errorMessage: 'Please keep countermeasure under 500 characters.'
            }
          ],

          inputConfig: {
            maxLength: 500
          }
        },

        {
          id: 'countermeasure_owner',
          order: 2,
          text: 'Who is responsible for implementing this countermeasure?',
          type: 'short-text',
          required: true,
          helpText: 'Name or role of the person accountable for execution.',
          placeholder: 'Example: Operations Manager',

          validation: [],

          inputConfig: {
            maxLength: 100
          }
        },

        {
          id: 'countermeasure_deadline',
          order: 3,
          text: 'Target completion date',
          type: 'date',
          required: true,
          helpText: 'When should this countermeasure be fully implemented?',

          validation: [],

          inputConfig: {}
        },

        {
          id: 'additional_countermeasures',
          order: 4,
          text: 'Are there additional countermeasures needed?',
          type: 'long-text',
          required: false,
          helpText: 'Optional: List any supporting actions or backup countermeasures.',
          placeholder: 'Example: Short-term: Manually inspect all calibration records. Long-term: Implement digital calibration tracking system.',

          validation: [],

          inputConfig: {
            maxLength: 500
          }
        },

        {
          id: 'effectiveness_measure',
          order: 5,
          text: 'How will you measure effectiveness?',
          type: 'long-text',
          required: true,
          helpText: 'Define how you will know if your countermeasure worked.',
          placeholder: 'Example: Zero calibration-related defects for 3 consecutive months.',

          validation: [],

          inputConfig: {
            maxLength: 300
          }
        }
      ],

      guidance: {
        introduction: 'Now create actionable countermeasures that address your root cause. Focus on prevention, not just firefighting.',
        
        tips: [
          {
            id: 'tip-smart',
            title: 'Make it SMART',
            content: 'Countermeasures should be Specific, Measurable, Achievable, Relevant, and Time-bound.',
            priority: 'high',
            icon: '🎯'
          },
          {
            id: 'tip-sustainable',
            title: 'Ensure Sustainability',
            content: 'Consider how to maintain the countermeasure long-term, not just implement it once.',
            priority: 'high',
            icon: '♻️'
          },
          {
            id: 'tip-multiple-levels',
            title: 'Consider Multiple Levels',
            content: 'You can address multiple "whys" in your chain, not just the final root cause.',
            priority: 'medium',
            icon: '🪜'
          }
        ],

        warnings: [
          {
            id: 'warn-bandaid',
            type: 'warning',
            title: 'Avoid Band-Aid Solutions',
            content: 'Don\'t just fix the immediate problem. Address the root cause to prevent recurrence.',
            severity: 'high'
          },
          {
            id: 'warn-realistic',
            type: 'warning',
            title: 'Be Realistic',
            content: 'Choose countermeasures that are achievable with available resources.',
            severity: 'medium'
          }
        ],

        bestPractices: [
          {
            id: 'bp-hierarchy',
            practice: 'Follow the Countermeasure Hierarchy',
            rationale: 'Prefer permanent solutions over temporary fixes for more effective and sustainable solutions',
            example: '1. Eliminate (best), 2. Substitute, 3. Control, 4. Training, 5. PPE (last resort)'
          },
          {
            id: 'bp-pilot',
            practice: 'Pilot Test When Possible',
            rationale: 'Test countermeasures on a small scale before full implementation to identify issues before widespread deployment',
            example: 'Try new process on one line before rolling out to entire facility'
          }
        ],

        resources: [
          {
            id: 'res-action-plan',
            title: 'Action Plan Template',
            type: 'template',
            url: '/resources/action-plan-template.xlsx',
            description: 'Structured template for tracking countermeasure implementation'
          }
        ],

        commonMistakes: []
      },

      validation: {
        requiredQuestions: ['countermeasure_1', 'countermeasure_owner', 'countermeasure_deadline', 'effectiveness_measure']
      },
      allowSkip: false
    }
  ],

  completionCriteria: {
    allStepsCompleted: false,
    requiredSteps: ['step-1-problem', 'step-2-first-why', 'step-3-second-why', 'step-4-third-why', 'step-5-fourth-why', 'step-6-fifth-why', 'step-7-countermeasures'],
    optionalSteps: [],
    qualityChecks: [
      {
        id: 'check-depth',
        description: 'Verify that you went deep enough to find root cause',
        checkFunction: () => true,
        importance: 'critical'
      },
      {
        id: 'check-evidence',
        description: 'Confirm each "why" is supported by facts or data',
        checkFunction: () => true,
        importance: 'critical'
      }
    ]
  },

  nextSteps: [
    {
      id: 'next-a3',
      title: 'Create A3 Report',
      description: 'Document your analysis in standardized A3 format for communication and review',
      type: 'tool',
      route: '/dashboard/continuous-improvement/a3',
      priority: 'recommended'
    },
    {
      id: 'next-fishbone',
      title: 'Fishbone Diagram',
      description: 'If you found multiple potential causes, use Fishbone to organize them visually',
      type: 'tool',
      route: '/dashboard/continuous-improvement/fishbone',
      priority: 'optional'
    },
    {
      id: 'next-pdca',
      title: 'PDCA Cycle',
      description: 'Track your countermeasure implementation and verification',
      type: 'tool',
      route: '/dashboard/continuous-improvement/pdca',
      priority: 'recommended'
    }
  ]
}
