/**
 * A3 Problem Solving - Guided Tool Configuration
 * Toyota A3 Methodology - Structured Problem Solving on One Page
 * 
 * 8 Steps: Background → Current → Target → Root Cause → Countermeasures → Plan → Follow-up → Review
 */

import { ToolConfiguration } from '@/types/guided-tools'
import {
  // Tips
  PROBLEM_BE_SPECIFIC,
  PROBLEM_USE_DATA,
  PROBLEM_SHOW_GAP,
  DATA_COLLECT_BASELINE,
  RCA_ASK_WHY_FIVE_TIMES,
  RCA_GO_TO_GEMBA,
  TEAM_INVOLVE_EXPERTS,
  
  // Warnings
  PROBLEM_DONT_SKIP,
  PROBLEM_DONT_JUMP_TO_SOLUTIONS,
  RCA_DONT_STOP_AT_SYMPTOMS,
  DATA_AVOID_ASSUMPTIONS,
  SOLUTION_DONT_BAND_AID,
  
  // Best Practices
  PROBLEM_USE_DATA_DRIVEN,
  PROBLEM_DEFINE_SCOPE,
  DATA_DOCUMENT_METHOD,
  SOLUTION_BRAINSTORM_MULTIPLE,
  IMPLEMENT_STANDARDIZE,
  IMPLEMENT_PDCA_CYCLE,
  IMPLEMENT_MEASURE_RESULTS,
  TEAM_CROSS_FUNCTIONAL,
  
  // Common Mistakes
  PROBLEM_TOO_VAGUE,
  PROBLEM_STATING_CAUSES,
  RCA_STOPPING_TOO_EARLY,
  SOLUTION_FIRST_IDEA,
  IMPLEMENT_SKIPPING_TRAINING,
  IMPLEMENT_NO_FOLLOWUP,
  
  // Resources
  PROBLEM_SMART_GOALS,
  RCA_ROOT_CAUSE_BOOK
} from '@/lib/guidance'

export const a3Config: ToolConfiguration = {
  id: 'a3-problem-solving',
  name: 'A3 Problem Solving',
  description: 'Toyota A3 methodology for structured problem-solving on one page',
  category: 'continuous-improvement',
  difficulty: 'intermediate',
  estimatedTime: '45-60 minutes',
  icon: '📄',
  version: '1.0.0',
  lastUpdated: '2024-01-01',

  objectives: [
    'Apply Toyota A3 methodology to real problems',
    'Identify and verify root causes with data',
    'Develop effective countermeasures',
    'Create actionable implementation plans'
  ],

  prerequisites: [
    'Basic problem-solving knowledge',
    'Access to problem data or gemba',
    'Understanding of PDCA cycle (helpful)'
  ],

  tags: ['problem-solving', 'root-cause-analysis', 'a3', 'toyota', 'lean'],
  relatedTools: ['5-whys', 'fishbone-diagram', 'pdca-cycle'],

  introduction: {
    title: 'Welcome to A3 Problem Solving',
    overview: 'The A3 is Toyota\'s structured approach to problem-solving, named after the A3-sized paper (11"x17") it\'s written on. It follows a logical left-to-right, top-to-bottom story that guides teams from problem to solution to results.',
    videoUrl: '/videos/a3-intro.mp4',
    estimatedTime: '50',
    
    whenToUse: [
      'Complex problems requiring structured analysis',
      'Cross-functional issues needing team alignment',
      'Problems where root cause is unclear',
      'Need to document problem-solving for organizational learning',
      'Executive-level communication of improvements'
    ],
    
    whatYouWillNeed: [
      'Problem identified and observed at gemba',
      'Access to relevant data and metrics',
      'Support from management and stakeholders',
      '30-60 minutes of focused time',
      'Team members available for input (recommended)'
    ],
    
    expectedOutcomes: [
      'Clear problem and goal statement',
      'Data-driven root cause identification',
      'Practical countermeasures with owners',
      'Detailed implementation plan',
      'Follow-up schedule for verification',
      'One-page visual summary for communication'
    ]
  },

  steps: [
    // STEP 1: Title & Background
    {
      id: 'step-1-background',
      stepNumber: 1,
      title: 'Title & Background',
      description: 'Set the context and business case for this A3',
      optional: false,

      questions: [
        {
          id: 'a3_title',
          order: 1,
          text: 'What is the title of this A3?',
          type: 'short-text',
          required: true,
          helpText: 'Create a concise, descriptive title. Think newspaper headline: clear and compelling.',
          placeholder: 'Example: Reduce Defect Rate in Assembly Line 3 by 50%',
          
          hints: [
            {
              id: 'hint-title-1',
              trigger: 'hover',
              title: 'Title Tip',
              content: 'Good titles include: what (the problem), where (location), and often the target (goal).',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'example-title-1',
              title: 'Manufacturing Title Example',
              description: 'Specific problem, location, and target',
              value: 'Reduce Welding Defects on Frame Assembly by 40%',
              industry: 'manufacturing',
              scenario: 'Quality improvement',
              useCase: 'Quality improvement project',
              difficulty: 'intermediate' as const
            },
            {
              id: 'example-title-2',
              title: 'Healthcare Title Example',
              description: 'Clear metric with current and target state',
              value: 'Decrease Patient Wait Time in ER from 45 to 20 Minutes',
              industry: 'healthcare',
              scenario: 'Process improvement',
              useCase: 'Process efficiency project',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'A3 title is required.'
            },
            {
              type: 'min',
              value: 10,
              errorMessage: 'Title should be at least 10 characters and descriptive.'
            }
          ],

          inputConfig: {
            maxLength: 100
          }
        },

        {
          id: 'a3_owner',
          order: 2,
          text: 'Who is the A3 owner/leader?',
          type: 'short-text',
          required: true,
          helpText: 'The person responsible for driving this A3 to completion.',
          placeholder: 'Full Name',
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Owner name is required.'
            }
          ],
          
          inputConfig: {
            maxLength: 100
          }
        },

        {
          id: 'a3_department',
          order: 3,
          text: 'Which department or area is this A3 for?',
          type: 'short-text',
          required: true,
          helpText: 'The primary department affected by or working on this problem.',
          placeholder: 'Example: Production, Quality, Engineering, Maintenance',
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Department is required.'
            }
          ],
          
          inputConfig: {
            maxLength: 100
          }
        },

        {
          id: 'a3_background',
          order: 4,
          text: 'What is the background and business context?',
          type: 'long-text',
          required: true,
          helpText: 'Why is this problem important? What is the business impact? How did we discover it?',
          placeholder: 'Example: During Q3 customer audits, we identified increasing defect trends in welded frames. This affects customer satisfaction and increases warranty costs by approximately $50K per month...',
          
          hints: [
            {
              id: 'hint-background-1',
              trigger: 'hover',
              title: 'Background Details',
              content: 'Include: How the problem was discovered, business impact (cost, time, quality, safety), and why it matters now.',
              type: 'tip'
            },
            {
              id: 'hint-background-2',
              trigger: 'hover',
              title: 'Strengthen Business Case',
              content: 'Good start! Add specific numbers (costs, frequency, impact) to strengthen the business case.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'example-background-1',
              title: 'Manufacturing Background Example',
              description: 'Quantifies problem, shows trend, states business impact',
              value: 'Our scrap rate has increased from 3% to 8% over the past quarter, costing an additional $120K monthly. Customer complaints have doubled. Root cause is unclear, requiring structured analysis.',
              industry: 'manufacturing',
              scenario: 'Cost reduction',
              useCase: 'Quality improvement with cost impact',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Background is required to set context.'
            },
            {
              type: 'min',
              value: 50,
              errorMessage: 'Please provide more context. Include business impact and why this problem matters.'
            }
          ],

          inputConfig: {
            maxLength: 500,
            
          }
        }
      ],

      guidance: {
        introduction: 'The background sets the stage. Help readers understand why this A3 exists and why they should care. Link the problem to business priorities.',
        
        tips: [
          PROBLEM_BE_SPECIFIC,
          PROBLEM_USE_DATA
        ],

        warnings: [
          PROBLEM_DONT_SKIP
        ],

        bestPractices: [
          PROBLEM_USE_DATA_DRIVEN,
          TEAM_CROSS_FUNCTIONAL
        ],

        commonMistakes: [
          PROBLEM_TOO_VAGUE
        ],

        resources: [
          PROBLEM_SMART_GOALS
        ]
      },

      validation: {
        requiredQuestions: ['a3_title', 'a3_owner', 'a3_department', 'a3_background']
      }
    },

    // STEP 2: Current Condition
    {
      id: 'step-2-current',
      stepNumber: 2,
      title: 'Current Condition',
      description: 'Describe the current state with data and facts',
      optional: false,

      questions: [
        {
          id: 'problem_statement',
          order: 1,
          text: 'What is the problem statement?',
          type: 'long-text',
          required: true,
          helpText: 'Describe WHAT is happening (not WHY). Be specific, measurable, and factual.',
          placeholder: 'Example: Assembly Line 3 is producing 8.5% defective units (target: 2%), primarily welding defects on frame joints. Problem occurs on both shifts but more frequently on night shift.',
          
          hints: [
            {
              id: 'hint-description-1',
              trigger: 'hover',
              title: 'Description Method',
              content: 'Use the 5W2H method: Who, What, When, Where, Why it matters, How much, How detected.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'example-problem-1',
              title: 'Manufacturing Problem Example',
              description: 'Specific metrics, problem types, timing, and scope',
              value: 'Production Line 3 has a 12% defect rate for Widget XYZ (target: 3%), primarily paint defects and dimensional issues. Problem started 6 weeks ago and affects all shifts.',
              industry: 'manufacturing',
              scenario: 'Quality defect',
              useCase: 'Quality problem identification',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Problem statement is required.'
            },
            {
              type: 'min',
              value: 40,
              errorMessage: 'Provide more detail. Include what, where, when, and how much.'
            }
          ],

          inputConfig: {
            maxLength: 400,
            
          }
        },

        {
          id: 'current_metrics',
          order: 2,
          text: 'What are the current performance metrics?',
          type: 'long-text',
          required: true,
          helpText: 'List key metrics showing the current state. Include numbers, units, and time periods.',
          placeholder: 'Example:\n- Defect Rate: 8.5% (measured over last 30 days, n=2,400 units)\n- Cost Impact: $45,000/month in scrap and rework\n- Customer Complaints: 15 in Q3 (up from 3 in Q2)',
          
          hints: [
            {
              id: 'hint-metrics-1',
              trigger: 'hover',
              title: 'Metric Types',
              content: 'Include: quality metrics, cost impact, time impact, safety issues, or customer impact.',
              type: 'tip'
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Current metrics are required to establish baseline.'
            }
          ],

          inputConfig: {
            maxLength: 500,
            
          }
        },

        {
          id: 'scope',
          order: 3,
          text: 'What is in scope and out of scope?',
          type: 'long-text',
          required: true,
          helpText: 'Define clear boundaries. What WILL you address? What will you NOT address (at least initially)?',
          placeholder: 'IN SCOPE:\n- Assembly Line 3 welding defects only\n- Both day and night shifts\n- Current product family (Widget XYZ)\n\nOUT OF SCOPE:\n- Lines 1 and 2\n- Paint defects (separate A3)\n- Equipment replacement (budget constraint)',
          
          hints: [
            {
              id: 'hint-scope-1',
              trigger: 'hover',
              title: 'Scope Importance',
              content: 'Clear scope prevents scope creep and helps the team stay focused on achievable goals.',
              type: 'tip'
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Scope definition is required.'
            }
          ],

          inputConfig: {
            maxLength: 400,
            
          }
        }
      ],

      guidance: {
        introduction: 'The current condition is about facts, not opinions. Use data to paint a clear picture of "what is" before jumping to "why" or "how to fix."',
        
        tips: [
          PROBLEM_SHOW_GAP,
          DATA_COLLECT_BASELINE
        ],

        warnings: [
          PROBLEM_DONT_JUMP_TO_SOLUTIONS,
          DATA_AVOID_ASSUMPTIONS
        ],

        bestPractices: [
          PROBLEM_DEFINE_SCOPE,
          DATA_DOCUMENT_METHOD,
          RCA_GO_TO_GEMBA
        ],

        commonMistakes: [
          PROBLEM_STATING_CAUSES
        ],

        resources: []
      },

      validation: {
        requiredQuestions: ['problem_statement', 'current_metrics', 'scope']
      }
    },

    // STEP 3: Target Condition
    {
      id: 'step-3-target',
      stepNumber: 3,
      title: 'Target Condition',
      description: 'Define the desired future state with specific goals',
      optional: false,

      questions: [
        {
          id: 'goal_statement',
          order: 1,
          text: 'What is the goal/target condition?',
          type: 'long-text',
          required: true,
          helpText: 'Describe the desired future state. Be specific and measurable. Use SMART criteria.',
          placeholder: 'Example: Reduce defect rate on Assembly Line 3 from 8.5% to 2.0% (target) within 90 days, saving $30K monthly in scrap costs.',
          
          hints: [
            {
              id: 'hint-goal-1',
              trigger: 'hover',
              title: 'SMART Goals',
              content: 'SMART: Specific, Measurable, Achievable, Relevant, Time-bound.',
              type: 'tip'
            }
          ],

          examples: [
            {
              id: 'example-goal-1',
              title: 'Manufacturing Goal Example',
              description: 'Specific number, timeframe, and business benefit',
              value: 'Achieve and maintain 3% defect rate (down from 12%) by end of Q4, reducing scrap costs by $50K/month and eliminating customer complaints.',
              industry: 'manufacturing',
              scenario: 'Quality goal',
              useCase: 'Goal statement',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Goal statement is required.'
            },
            {
              type: 'min',
              value: 30,
              errorMessage: 'Provide more detail. Include target metrics and timeframe.'
            }
          ],

          inputConfig: {
            maxLength: 300,
            
          }
        },

        {
          id: 'target_metrics',
          order: 2,
          text: 'What are the target metrics?',
          type: 'long-text',
          required: true,
          helpText: 'List specific target values for each metric. Show the gap between current and target.',
          placeholder: 'Example:\n- Defect Rate: 2.0% (current: 8.5%, gap: -6.5%)\n- Monthly Scrap Cost: $15,000 (current: $45,000, savings: $30,000)\n- Customer Complaints: 0 per quarter (current: 15/quarter)',
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Target metrics are required to measure success.'
            }
          ],

          inputConfig: {
            maxLength: 400,
            
          }
        },

        {
          id: 'success_criteria',
          order: 3,
          text: 'What are the success criteria?',
          type: 'long-text',
          required: true,
          helpText: 'How will you know when you\'ve succeeded? What must be true?',
          placeholder: 'Example:\n- Sustained defect rate ≤ 2.0% for 4 consecutive weeks\n- Zero customer complaints for 2 consecutive months\n- All operators trained and using new work instructions\n- Standard work updated and posted at line',
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Success criteria are required.'
            }
          ],

          inputConfig: {
            maxLength: 400,
            
          }
        }
      ],

      guidance: {
        introduction: 'The target condition creates a clear vision of success. Make it concrete enough that anyone can recognize when you\'ve achieved it.',
        
        tips: [
          PROBLEM_SHOW_GAP
        ],

        warnings: [],

        bestPractices: [
          PROBLEM_USE_DATA_DRIVEN,
          IMPLEMENT_MEASURE_RESULTS
        ],

        commonMistakes: [
          PROBLEM_TOO_VAGUE
        ],

        resources: [
          PROBLEM_SMART_GOALS
        ]
      },

      validation: {
        requiredQuestions: ['target_goal']
      }
    },

    // STEP 4: Root Cause Analysis
    {
      id: 'step-4-root-cause',
      stepNumber: 4,
      title: 'Root Cause Analysis',
      description: 'Identify and verify the true root causes',
      optional: false,

      questions: [
        {
          id: 'analysis_method',
          order: 1,
          text: 'Which root cause analysis method(s) will you use?',
          type: 'multi-select',
          required: true,
          helpText: 'Select all methods you\'ll use to identify root causes.',
          
          inputConfig: {
            options: [
              {
                value: '5-why',
                label: '5 Why Analysis',
                description: 'Iterative questioning to dig deeper',
                icon: '❓'
              },
              {
                value: 'fishbone',
                label: 'Fishbone/Ishikawa Diagram',
                description: '6M categories: Machine, Method, Material, People, Measurement, Environment',
                icon: '🐟'
              },
              {
                value: 'pareto',
                label: 'Pareto Analysis',
                description: 'Identify the vital few causes',
                icon: '📊'
              },
              {
                value: 'data-analysis',
                label: 'Data/Statistical Analysis',
                description: 'Charts, graphs, statistical tests',
                icon: '📈'
              },
              {
                value: 'gemba',
                label: 'Gemba Observation',
                description: 'Go see the actual process',
                icon: '👁️'
              }
            ]
          },

          validation: [
            {
              type: 'required',
              errorMessage: 'Please select at least one analysis method.'
            }
          ]
        },

        {
          id: 'root_causes',
          order: 2,
          text: 'What are the verified root causes?',
          type: 'long-text',
          required: true,
          helpText: 'List each root cause with: 1) The cause, 2) Evidence supporting it, 3) Impact/contribution to problem.',
          placeholder: 'Example:\n\nRoot Cause #1: Inconsistent welding torch angle\n- Evidence: Video analysis shows 40% variation in angle between operators\n- Impact: Responsible for 60% of weld defects (Pareto analysis)\n\nRoot Cause #2: Inadequate work instructions\n- Evidence: Current work instructions lack photos; operators interpret differently\n- Impact: New operators take 3x longer to achieve quality standards',
          
          hints: [
            {
              id: 'hint-root-cause-1',
              trigger: 'hover',
              title: '5 Whys Method',
              content: 'For each cause, ask "Why?" 5 times to ensure you\'ve reached a true root cause, not just a symptom.',
              type: 'tip'
            },
            {
              id: 'hint-root-cause-2',
              trigger: 'auto',
              title: 'Verification Reminder',
              content: 'Good! For each cause, verify with data or observation. State your evidence.',
              type: 'info'
            }
          ],

          examples: [
            {
              id: 'example-root-cause-1',
              title: 'Manufacturing Root Cause Example',
              description: 'Clear cause, data-backed evidence, quantified impact, verification method',
              value: 'Root Cause: Machine calibration drift\n- Evidence: CMM measurements show 0.015" variance from spec (out of tolerance)\n- Impact: 70% of dimensional defects traced to this machine\n- Verified: Trend analysis over 3 months confirms correlation',
              industry: 'manufacturing',
              scenario: 'Process defect',
              useCase: 'Root cause identification',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Root causes are required.'
            },
            {
              type: 'min',
              value: 100,
              errorMessage: 'Provide detailed root causes with evidence for each one.'
            }
          ],

          inputConfig: {
            maxLength: 800,
            
          }
        }
      ],

      guidance: {
        introduction: 'Root cause analysis is the heart of the A3. Don\'t rush this step. Go to gemba, collect data, and verify your theories before moving forward.',
        
        tips: [
          RCA_ASK_WHY_FIVE_TIMES,
          TEAM_INVOLVE_EXPERTS
        ],

        warnings: [
          RCA_DONT_STOP_AT_SYMPTOMS,
          DATA_AVOID_ASSUMPTIONS
        ],

        bestPractices: [
          TEAM_CROSS_FUNCTIONAL,
          RCA_GO_TO_GEMBA,
          PROBLEM_DEFINE_SCOPE
        ],

        commonMistakes: [
          RCA_STOPPING_TOO_EARLY
        ],

        resources: [
          RCA_ROOT_CAUSE_BOOK
        ]
      },

      validation: {
        requiredQuestions: ['analysis_method', 'root_causes']
      }
    },

    // STEP 5: Countermeasures
    {
      id: 'step-5-countermeasures',
      stepNumber: 5,
      title: 'Countermeasures',
      description: 'Develop solutions that address root causes',
      optional: false,

      questions: [
        {
          id: 'countermeasures',
          order: 1,
          text: 'What countermeasures will you implement?',
          type: 'long-text',
          required: true,
          helpText: 'For each root cause, propose a countermeasure. Include: What, Why this solution, Who is responsible, Expected impact.',
          placeholder: 'Example:\n\nCountermeasure #1: Create visual work aids with photos\n- Addresses: Inconsistent welding technique root cause\n- Why: Visual standards reduce interpretation variation\n- Owner: Quality Engineer (Jane Smith)\n- Expected Impact: Reduce technique-related defects by 50%\n- Cost: $500 (materials)\n\nCountermeasure #2: Implement daily torch calibration checks\n- Addresses: Equipment drift root cause\n- Why: Prevents out-of-spec conditions\n- Owner: Maintenance Lead (Bob Jones)\n- Expected Impact: Eliminate calibration-related defects\n- Cost: 10 min/day labor',
          
          hints: [
            {
              id: 'hint-countermeasures-1',
              trigger: 'hover',
              title: 'Effective Countermeasures',
              content: 'Good countermeasures are: Targeted to root causes, Practical/feasible, Cost-effective, Sustainable long-term.',
              type: 'tip'
            },
            {
              id: 'hint-countermeasures-2',
              trigger: 'auto',
              title: 'Owner and Results',
              content: 'Excellent! Make sure each countermeasure has a clear owner and expected result.',
              type: 'info'
            }
          ],

          examples: [
            {
              id: 'example-countermeasure-1',
              title: 'Manufacturing Countermeasure Example',
              description: 'Links to root cause, quantifies impact, has owner, timeline, and cost',
              value: 'Countermeasure: Install poka-yoke sensor to prevent wrong-part assembly\n- Root Cause Addressed: Parts can be installed backwards\n- Expected Impact: 100% elimination of wrong-orientation defects (currently 15% of total)\n- Owner: Maintenance (Tom Lee)\n- Timeline: 2 weeks\n- Cost: $2,500 (sensor + installation)',
              industry: 'manufacturing',
              scenario: 'Equipment solution',
              useCase: 'Countermeasure development',
              difficulty: 'intermediate' as const
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Countermeasures are required.'
            },
            {
              type: 'min',
              value: 100,
              errorMessage: 'Provide detailed countermeasures with owners and expected impacts.'
            }
          ],

          inputConfig: {
            maxLength: 1000,
            
          }
        }
      ],

      guidance: {
        introduction: 'Countermeasures should directly attack the root causes you identified. Resist the temptation to jump to solutions you already had in mind.',
        
        tips: [
          TEAM_INVOLVE_EXPERTS,
          PROBLEM_USE_DATA
        ],

        warnings: [
          SOLUTION_DONT_BAND_AID
        ],

        bestPractices: [
          SOLUTION_BRAINSTORM_MULTIPLE,
          IMPLEMENT_PDCA_CYCLE
        ],

        commonMistakes: [
          SOLUTION_FIRST_IDEA
        ],

        resources: []
      },

      validation: {
        requiredQuestions: ['countermeasures']
      }
    },

    // STEP 6: Implementation Plan
    {
      id: 'step-6-implementation',
      stepNumber: 6,
      title: 'Implementation Plan',
      description: 'Create a detailed action plan with owners and dates',
      optional: false,

      questions: [
        {
          id: 'implementation_plan',
          order: 1,
          text: 'What is the step-by-step implementation plan?',
          type: 'long-text',
          required: true,
          helpText: 'Break countermeasures into specific action items. Each should have: Action, Owner, Due Date, Status.',
          placeholder: 'Example:\n\n1. Design visual work aids (Jane Smith, Week 1, In Progress)\n2. Review aids with operators (Jane Smith, Week 2, Pending)\n3. Print and laminate aids (Production Supervisor, Week 2, Pending)\n4. Install aids at workstations (Maintenance, Week 3, Pending)\n5. Train all operators on new aids (Training Coordinator, Week 3-4, Pending)\n6. Conduct 30-day effectiveness check (Quality Manager, Week 8, Pending)',
          
          hints: [
            {
              id: 'hint-implementation-1',
              trigger: 'hover',
              title: 'Plan Elements',
              content: 'Good implementation plans have: Clear sequence, Specific actions, Named owners, Realistic dates, Progress tracking.',
              type: 'tip'
            }
          ],

          validation: [
            {
              type: 'required',
              errorMessage: 'Implementation plan is required.'
            },
            {
              type: 'min',
              value: 80,
              errorMessage: 'Provide a detailed step-by-step plan with owners and dates.'
            }
          ],

          inputConfig: {
            maxLength: 1000,
            
          }
        },

        {
          id: 'risks_obstacles',
          order: 2,
          text: 'What risks or obstacles do you foresee?',
          type: 'long-text',
          required: false,
          helpText: 'Identify potential roadblocks and how you\'ll address them.',
          placeholder: 'Example:\n- Risk: Operators may resist change → Mitigation: Involve operators in design; explain "why"\n- Risk: Budget approval delays → Mitigation: Pre-approve with finance; have low-cost backup plan\n- Obstacle: Summer vacation schedule → Mitigation: Plan training for August before peak vacation',
          
          validation: [],
          
          inputConfig: {
            maxLength: 500,
            
          }
        }
      ],

      guidance: {
        introduction: 'A great plan is specific enough that anyone could execute it. Include training, communication, and how you\'ll measure success.',
        
        tips: [
          TEAM_INVOLVE_EXPERTS,
          PROBLEM_BE_SPECIFIC
        ],

        warnings: [
          SOLUTION_DONT_BAND_AID
        ],

        bestPractices: [
          IMPLEMENT_STANDARDIZE,
          TEAM_CROSS_FUNCTIONAL,
          IMPLEMENT_PDCA_CYCLE,
          IMPLEMENT_MEASURE_RESULTS
        ],

        commonMistakes: [
          IMPLEMENT_SKIPPING_TRAINING,
          IMPLEMENT_NO_FOLLOWUP
        ],

        resources: []
      },

      validation: {
        requiredQuestions: ['implementation_plan']
      }
    },

    // STEP 7: Follow-up
    {
      id: 'step-7-followup',
      stepNumber: 7,
      title: 'Follow-up & Verification',
      description: 'Plan how you\'ll verify results and sustain improvements',
      optional: false,

      questions: [
        {
          id: 'followup_schedule',
          order: 1,
          text: 'What is your follow-up schedule?',
          type: 'long-text',
          required: true,
          helpText: 'When will you check results? What will you measure? How will you know if it worked?',
          placeholder: 'Example:\n\nWeek 4: Initial check\n- Measure: Defect rate on 200 units\n- Target: < 5% (improvement from 8.5%)\n- Action if not met: Adjust countermeasures\n\nWeek 8: Mid-point review\n- Measure: Defect rate, operator adherence to new process\n- Target: < 3%\n\nWeek 12: Final verification\n- Measure: 4 weeks of sustained data\n- Target: ≤ 2%, zero customer complaints\n- Decision: Close A3 or extend',
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Follow-up schedule is required.'
            }
          ],

          inputConfig: {
            maxLength: 600,
            
          }
        },

        {
          id: 'lessons_learned',
          order: 2,
          text: 'What lessons learned or insights emerged?',
          type: 'long-text',
          required: false,
          helpText: 'What worked well? What would you do differently? What can other teams learn from this?',
          placeholder: 'Example:\n- Involving operators early led to better solution design and faster adoption\n- Data collection was more time-consuming than expected; plan 2 weeks next time\n- Root cause was not what we initially thought; Gemba observation was critical',
          
          validation: [],
          
          inputConfig: {
            maxLength: 500,
            
          }
        }
      ],

      guidance: {
        introduction: 'Follow-up is what separates great A3s from mediocre ones. Plan your checks, measure results, and adjust if needed. Capture lessons learned for the organization.',
        
        tips: [
          PROBLEM_USE_DATA,
          TEAM_INVOLVE_EXPERTS
        ],

        warnings: [
          DATA_AVOID_ASSUMPTIONS
        ],

        bestPractices: [
          IMPLEMENT_STANDARDIZE,
          IMPLEMENT_MEASURE_RESULTS,
          IMPLEMENT_PDCA_CYCLE
        ],

        commonMistakes: [],

        resources: []
      },

      validation: {
        requiredQuestions: ['followup_schedule']
      }
    },

    // STEP 8: Review & Export
    {
      id: 'step-8-review',
      stepNumber: 8,
      title: 'Review & Complete',
      description: 'Review your A3 and prepare for sharing',
      optional: false,

      questions: [
        {
          id: 'a3_status',
          order: 1,
          text: 'What is the current status of this A3?',
          type: 'single-select',
          required: true,
          helpText: 'Select the status that best represents where you are.',
          
          inputConfig: {
            options: [
              {
                value: 'draft',
                label: 'Draft - Still Planning',
                description: 'A3 is being developed, not yet ready for implementation'
              },
              {
                value: 'in_progress',
                label: 'In Progress - Implementing',
                description: 'Countermeasures are being rolled out'
              },
              {
                value: 'completed',
                label: 'Completed - Results Verified',
                description: 'Implementation done, results sustained'
              }
            ]
          },

          validation: [
            {
              type: 'required',
              errorMessage: 'Please select a status.'
            }
          ]
        },

        {
          id: 'review_notes',
          order: 2,
          text: 'Any final notes or next steps?',
          type: 'long-text',
          required: false,
          helpText: 'Capture any additional thoughts, dependencies, or handoff notes.',
          placeholder: 'Example: Need to present to steering committee on 10/15. Waiting for budget approval for Countermeasure #3. Will update metrics dashboard monthly.',
          
          validation: [],
          
          inputConfig: {
            maxLength: 300,
            
          }
        }
      ],

      guidance: {
        introduction: 'You\'ve completed your A3! Review the full document, share with stakeholders, and prepare to present your story from left to right, top to bottom.',
        
        tips: [],
        warnings: [],
        bestPractices: [
          TEAM_CROSS_FUNCTIONAL
        ],
        commonMistakes: [],
        resources: []
      },

      validation: {
        requiredQuestions: ['a3_status']
      }
    }
  ],

  completionCriteria: {
    allStepsCompleted: false,
    requiredSteps: ['step-1-background', 'step-2-current', 'step-3-target', 'step-4-root-cause', 'step-5-countermeasures'],
    optionalSteps: ['step-6-implementation', 'step-7-followup', 'step-8-review']
  },

  nextSteps: [
    {
      id: 'present-a3',
      title: 'Present Your A3',
      description: 'Share your A3 with stakeholders. Walk through left-to-right, telling the story.',
      type: 'action',
      priority: 'recommended'
    },
    {
      id: 'implement-plan',
      title: 'Execute Implementation Plan',
      description: 'Begin implementing your countermeasures according to the plan.',
      type: 'action',
      priority: 'recommended'
    },
    {
      id: 'follow-up',
      title: 'Monitor and Follow Up',
      description: 'Track metrics and verify results according to your follow-up schedule.',
      type: 'action',
      priority: 'recommended'
    }
  ]
}
