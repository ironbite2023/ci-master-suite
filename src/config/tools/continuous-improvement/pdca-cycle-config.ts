/**
 * PDCA Cycle Manager - Guided Tool Configuration
 * Plan-Do-Check-Act Continuous Improvement Cycle
 * 
 * Based on Deming's PDCA methodology for systematic problem-solving
 * and continuous improvement
 */

import { ToolConfiguration } from '@/types/guided-tools'
import {
  // Tips
  PROBLEM_BE_SPECIFIC,
  PROBLEM_USE_DATA,
  PROBLEM_FOCUS_ON_EFFECT,
  DATA_COLLECT_BASELINE,
  DATA_VERIFY_ACCURACY,
  RCA_ASK_WHY_FIVE_TIMES,
  RCA_GO_TO_GEMBA,
  RCA_VERIFY_WITH_DATA,
  TEAM_CROSS_FUNCTIONAL,
  TEAM_DOCUMENT_DECISIONS,
  
  // Warnings
  PROBLEM_DONT_SKIP,
  PROBLEM_DONT_JUMP_TO_SOLUTIONS,
  DATA_AVOID_ASSUMPTIONS,
  RCA_DONT_STOP_AT_SYMPTOMS,
  SOLUTION_DONT_BAND_AID,
  
  // Best Practices
  PROBLEM_USE_DATA_DRIVEN,
  RCA_USE_MULTIPLE_TOOLS,
  SOLUTION_BRAINSTORM_MULTIPLE,
  SOLUTION_COST_BENEFIT,
  IMPLEMENT_PDCA_CYCLE,
  IMPLEMENT_STANDARDIZE,
  IMPLEMENT_MEASURE_RESULTS,
  TEAM_USE_FACILITATOR,
  
  // Common Mistakes
  PROBLEM_TOO_VAGUE,
  DATA_NO_BASELINE,
  RCA_STOPPING_TOO_EARLY,
  SOLUTION_FIRST_IDEA,
  SOLUTION_NO_PILOT,
  IMPLEMENT_NO_STANDARDIZATION,
  IMPLEMENT_NO_FOLLOWUP
} from '@/lib/guidance'

export const pdcaConfig: ToolConfiguration = {
  id: 'pdca-cycle',
  name: 'PDCA Cycle Manager',
  description: 'Plan-Do-Check-Act continuous improvement methodology',
  category: 'continuous-improvement',
  difficulty: 'beginner',
  estimatedTime: '30-45 minutes',
  icon: '🔄',
  version: '1.0.0',
  lastUpdated: '2025-10-03',

  objectives: [
    'Apply systematic PDCA methodology for continuous improvement',
    'Define measurable objectives and success metrics',
    'Execute small-scale pilot implementations',
    'Analyze results and validate improvements',
    'Standardize successful changes and plan next cycle'
  ],

  prerequisites: [
    'Identified opportunity for improvement',
    'Basic data on current performance',
    'Authority to implement small-scale changes',
    'Time to complete a full PDCA cycle (typically 1-4 weeks)'
  ],

  tags: ['pdca', 'continuous-improvement', 'deming-cycle', 'kaizen', 'problem-solving'],
  relatedTools: ['a3-problem-solving', '5-whys', 'kaizen-events', 'standard-work'],

  introduction: {
    title: 'Welcome to PDCA Cycle Manager',
    overview: 'The PDCA (Plan-Do-Check-Act) Cycle, also known as the Deming Cycle, is a systematic method for continuous improvement. It provides a structured approach to testing changes, learning from results, and implementing successful improvements.',
    videoUrl: '',
    estimatedTime: '30-45 minutes',
    
    whenToUse: [
      'Testing improvements before full-scale implementation',
      'Systematic problem-solving and process improvement',
      'Reducing variation and increasing predictability',
      'Learning organization development',
      'Continuous improvement initiatives (Kaizen)',
      'Validating hypotheses with small-scale experiments'
    ],
    
    whatYouWillNeed: [
      'Clear improvement objective or problem to solve',
      'Baseline data on current performance',
      'Resources to implement a pilot test',
      'Time to complete one cycle (1-4 weeks typical)',
      'Team support and management buy-in'
    ],
    
    expectedOutcomes: [
      'Structured improvement plan with measurable goals',
      'Documented pilot implementation results',
      'Data-driven decision on whether to standardize',
      'Lessons learned for organizational knowledge',
      'Plan for next improvement cycle'
    ]
  },

  steps: [
    // ========================================================================
    // STEP 1: CYCLE OVERVIEW & PROBLEM IDENTIFICATION
    // ========================================================================
    {
      id: 'step-1-overview',
      stepNumber: 1,
      title: 'Cycle Overview & Problem',
      description: 'Define the basic information and problem for this PDCA cycle',
      optional: false,
      icon: '🎯',

      questions: [
        {
          id: 'cycle_name',
          order: 1,
          text: 'What is the name of this PDCA cycle?',
          type: 'short-text',
          required: true,
          
          helpText: 'Give this cycle a clear, descriptive name that identifies the improvement focus.',
          placeholder: 'Example: Reduce Setup Time on Line 3',
          
          hints: [
            {
              id: 'hint-cycle-name',
              trigger: 'auto',
              title: 'Naming Best Practices',
              content: 'Use a name that clearly indicates: What you\'re improving, Where it\'s happening, and What success looks like.',
              type: 'tip'
            }
          ],
          
          examples: [
            {
              id: 'ex-manufacturing',
              title: 'Manufacturing Example',
              description: 'Setup time reduction project',
              value: 'Reduce Changeover Time on CNC Line by 30%',
              scenario: 'Manufacturing plant with long changeover times affecting productivity',
              useCase: 'Production efficiency improvement',
              difficulty: 'beginner'
            },
            {
              id: 'ex-healthcare',
              title: 'Healthcare Example',
              description: 'Patient flow improvement',
              value: 'Reduce ER Wait Time for Non-Critical Patients',
              scenario: 'Emergency department with long patient wait times',
              useCase: 'Healthcare process improvement',
              difficulty: 'beginner'
            },
            {
              id: 'ex-office',
              title: 'Office Example',
              description: 'Document processing improvement',
              value: 'Improve Invoice Processing Cycle Time by 40%',
              scenario: 'Accounts payable department with delayed processing',
              useCase: 'Administrative process improvement',
              difficulty: 'beginner'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Cycle name is required to track this improvement.'
            },
            {
              type: 'min',
              value: 10,
              errorMessage: 'Please provide a more descriptive name (at least 10 characters).'
            },
            {
              type: 'max',
              value: 100,
              errorMessage: 'Keep the name concise (under 100 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 100
          }
        },
        {
          id: 'objective',
          order: 2,
          text: 'What is the objective of this improvement cycle?',
          type: 'long-text',
          required: true,
          
          helpText: 'State the specific, measurable objective you want to achieve. Include current state, target state, and timeframe.',
          placeholder: 'Example: Reduce average setup time from 45 minutes to 30 minutes (33% reduction) within 2 weeks',
          
          hints: [
            {
              id: 'hint-smart-objective',
              trigger: 'auto',
              title: 'Use SMART Objectives',
              content: 'Make it Specific, Measurable, Achievable, Relevant, and Time-bound. Include current baseline, target, and deadline.',
              type: 'tip'
            },
            {
              id: 'hint-objective-length',
              trigger: 'after-delay',
              title: 'Be Comprehensive',
              content: 'A good objective answers: What will improve? By how much? From what baseline? By when?',
              type: 'info'
            }
          ],
          
          examples: [
            {
              id: 'ex-quality',
              title: 'Quality Improvement',
              description: 'Defect rate reduction',
              value: 'Reduce defect rate from current 8.5% to target 4% or below within 3 weeks, saving $15,000 monthly in rework costs',
              scenario: 'Manufacturing line with high defect rates',
              useCase: 'Quality improvement',
              difficulty: 'intermediate'
            },
            {
              id: 'ex-delivery',
              title: 'Delivery Performance',
              description: 'On-time delivery improvement',
              value: 'Improve on-time delivery from 78% to 95% within 4 weeks, reducing customer complaints by 60%',
              scenario: 'Distribution center missing delivery commitments',
              useCase: 'Logistics improvement',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Objective is required to focus the improvement effort.'
            },
            {
              type: 'min',
              value: 30,
              errorMessage: 'Please provide more detail about your objective (at least 30 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 500
          }
        },
        {
          id: 'description',
          order: 3,
          text: 'Provide additional context about this improvement initiative (optional)',
          type: 'long-text',
          required: false,
          
          helpText: 'Explain the background: Why is this important? What triggered this improvement? Who is affected?',
          placeholder: 'Example: This improvement was triggered by customer complaints about lead time. The current process has 5 handoffs and no standard work...',
          
          examples: [
            {
              id: 'ex-context',
              title: 'Context Example',
              description: 'Background information',
              value: 'Current changeover process involves 12 manual steps with no standard sequence. Operators use different methods leading to time variation of 30-60 minutes. Customer orders are increasing, requiring more frequent changeovers.',
              scenario: 'Providing context for the improvement need',
              useCase: 'Background documentation',
              difficulty: 'beginner'
            }
          ],
          
          validation: [],
          
          inputConfig: {
            maxLength: 1000
          }
        },
        {
          id: 'cycle_dates',
          order: 4,
          text: 'What are the start and target completion dates for this cycle?',
          type: 'short-text',
          required: true,
          
          helpText: 'PDCA cycles should be time-boxed. Typical cycles run 1-4 weeks. Enter dates in format: MM/DD/YYYY - MM/DD/YYYY',
          placeholder: 'Example: 10/03/2025 - 10/17/2025',
          
          hints: [
            {
              id: 'hint-cycle-duration',
              trigger: 'auto',
              title: 'Keep Cycles Short',
              content: 'Shorter cycles (1-2 weeks) promote rapid learning. Longer cycles (3-4 weeks) allow for more complex changes.',
              type: 'tip'
            }
          ],
          
          examples: [
            {
              id: 'ex-short-cycle',
              title: 'Short Cycle',
              description: '1-week rapid improvement',
              value: '10/03/2025 - 10/10/2025',
              scenario: 'Quick improvement with immediate results',
              useCase: 'Fast-paced improvement',
              difficulty: 'beginner'
            },
            {
              id: 'ex-standard-cycle',
              title: 'Standard Cycle',
              description: '2-week improvement cycle',
              value: '10/03/2025 - 10/17/2025',
              scenario: 'Balanced cycle with time for testing and adjustment',
              useCase: 'Standard PDCA cycle',
              difficulty: 'beginner'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Start and target dates are required for time-boxing.'
            }
          ],
          
          inputConfig: {
            maxLength: 50
          }
        }
      ],

      guidance: {
        introduction: 'This step establishes the foundation for your PDCA cycle. A clear objective and well-defined scope are critical for success. Take time to think through what you want to improve and why it matters.',
        tips: [PROBLEM_BE_SPECIFIC, PROBLEM_USE_DATA, PROBLEM_FOCUS_ON_EFFECT],
        warnings: [PROBLEM_DONT_SKIP, PROBLEM_DONT_JUMP_TO_SOLUTIONS],
        bestPractices: [PROBLEM_USE_DATA_DRIVEN],
        commonMistakes: [PROBLEM_TOO_VAGUE],
        resources: []
      },

      validation: {
        requiredQuestions: ['cycle_name', 'objective', 'cycle_dates']
      },
      
      allowSkip: false
    },

    // ========================================================================
    // STEP 2: PLAN - CURRENT STATE & METRICS
    // ========================================================================
    {
      id: 'step-2-plan-metrics',
      stepNumber: 2,
      title: 'Plan - Current State & Metrics',
      description: 'Document current performance and define success metrics',
      optional: false,
      icon: '📊',

      questions: [
        {
          id: 'current_state',
          order: 1,
          text: 'What is the current state? Describe the problem with data.',
          type: 'long-text',
          required: true,
          
          helpText: 'Document the current condition using specific data points. Include measurements, frequencies, and impacts.',
          placeholder: 'Example: Current average setup time is 45 minutes (measured over 20 changeovers last month). Range: 32-58 minutes. This causes 3.2 hours of downtime per week.',
          
          hints: [
            {
              id: 'hint-baseline-data',
              trigger: 'auto',
              title: 'Baseline Data is Critical',
              content: 'Without baseline data, you cannot measure improvement. Collect at least 10-20 data points if possible.',
              type: 'warning'
            }
          ],
          
          examples: [
            {
              id: 'ex-current-manufacturing',
              title: 'Manufacturing Current State',
              description: 'Production metrics',
              value: 'Current defect rate: 8.5% (measured over 1,200 units last month). Top defects: misalignment (45%), wrong torque (30%), missing parts (25%). Cost impact: $18,000/month in rework.',
              scenario: 'Quality problem with multiple defect types',
              useCase: 'Manufacturing quality',
              difficulty: 'intermediate'
            },
            {
              id: 'ex-current-service',
              title: 'Service Current State',
              description: 'Service delivery metrics',
              value: 'Current customer response time: average 4.2 hours (target: 2 hours). 67% of tickets resolved within SLA. Peak delays occur between 2-4 PM when volume is highest.',
              scenario: 'Service desk with slow response times',
              useCase: 'Service improvement',
              difficulty: 'beginner'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Current state data is required to establish baseline.'
            },
            {
              type: 'min',
              value: 50,
              errorMessage: 'Please provide detailed current state data (at least 50 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1000
          }
        },
        {
          id: 'metrics',
          order: 2,
          text: 'What metrics will you track to measure success?',
          type: 'long-text',
          required: true,
          
          helpText: 'List the specific metrics you will measure. For each metric, include: metric name, baseline value, target value, and unit of measurement.',
          placeholder: 'Example:\n1. Setup Time: Baseline 45 min → Target 30 min\n2. Downtime: Baseline 3.2 hrs/week → Target 2.0 hrs/week\n3. Operator Satisfaction: Baseline 6/10 → Target 8/10',
          
          hints: [
            {
              id: 'hint-leading-lagging',
              trigger: 'auto',
              title: 'Leading and Lagging Metrics',
              content: 'Track both leading indicators (process metrics) and lagging indicators (outcome metrics) for comprehensive view.',
              type: 'tip'
            }
          ],
          
          examples: [
            {
              id: 'ex-metrics-quality',
              title: 'Quality Metrics',
              description: 'Defect tracking',
              value: '1. Defect Rate: 8.5% → 4.0%\n2. First Pass Yield: 91.5% → 96.0%\n3. Rework Cost: $18K/month → $9K/month\n4. Customer Returns: 12/month → 5/month',
              scenario: 'Quality improvement initiative',
              useCase: 'Manufacturing quality',
              difficulty: 'intermediate'
            },
            {
              id: 'ex-metrics-efficiency',
              title: 'Efficiency Metrics',
              description: 'Cycle time reduction',
              value: '1. Process Cycle Time: 4.2 hours → 2.0 hours\n2. Steps in Process: 12 → 8\n3. Handoffs: 5 → 3\n4. Error Rate: 8% → 3%',
              scenario: 'Process efficiency improvement',
              useCase: 'Process improvement',
              difficulty: 'beginner'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Metrics are required to measure improvement.'
            },
            {
              type: 'min',
              value: 30,
              errorMessage: 'Please define specific metrics (at least 30 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1000
          }
        },
        {
          id: 'resources',
          order: 3,
          text: 'What resources are needed for this improvement?',
          type: 'long-text',
          required: false,
          
          helpText: 'List the resources required: people, time, budget, equipment, materials, training, etc.',
          placeholder: 'Example: 2 operators (4 hours each), 1 maintenance technician (2 hours), $500 for quick-change tooling, conference room for kickoff meeting',
          
          examples: [
            {
              id: 'ex-resources-minimal',
              title: 'Minimal Resources',
              description: 'Low-cost improvement',
              value: 'Team time: 8 person-hours total, whiteboard for visual management, no budget required, use existing tools and materials',
              scenario: 'Simple process improvement requiring only time',
              useCase: 'Low-resource improvement',
              difficulty: 'beginner'
            },
            {
              id: 'ex-resources-moderate',
              title: 'Moderate Resources',
              description: 'Investment required',
              value: '3 operators (16 hours each), 1 engineer (8 hours), $2,000 budget for fixtures and jigs, training materials, measurement tools',
              scenario: 'Improvement requiring some capital investment',
              useCase: 'Moderate resource improvement',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [],
          
          inputConfig: {
            maxLength: 500
          }
        }
      ],

      guidance: {
        introduction: 'The Plan phase is about understanding where you are now and where you want to be. Good baseline data is essential - if you cannot measure it, you cannot improve it. Be realistic about targets and resources.',
        tips: [DATA_COLLECT_BASELINE, DATA_VERIFY_ACCURACY, PROBLEM_USE_DATA],
        warnings: [DATA_AVOID_ASSUMPTIONS, PROBLEM_DONT_JUMP_TO_SOLUTIONS],
        bestPractices: [PROBLEM_USE_DATA_DRIVEN, IMPLEMENT_MEASURE_RESULTS],
        commonMistakes: [DATA_NO_BASELINE, PROBLEM_TOO_VAGUE],
        resources: []
      },

      validation: {
        requiredQuestions: ['current_state', 'metrics']
      },
      
      allowSkip: false
    },

    // ========================================================================
    // STEP 3: PLAN - ROOT CAUSE & HYPOTHESIS
    // ========================================================================
    {
      id: 'step-3-plan-hypothesis',
      stepNumber: 3,
      title: 'Plan - Root Cause & Hypothesis',
      description: 'Identify root causes and develop your improvement hypothesis',
      optional: false,
      icon: '🔍',

      questions: [
        {
          id: 'root_causes',
          order: 1,
          text: 'What are the root causes of the problem?',
          type: 'long-text',
          required: true,
          
          helpText: 'Document the root causes you have identified. Use tools like 5 Whys or Fishbone Diagram. List the causes in priority order.',
          placeholder: 'Example:\n1. No standard work sequence (operators use different methods)\n2. Tools not organized by sequence of use\n3. No visual aids or checklists\n4. Measurement tools stored in separate location',
          
          hints: [
            {
              id: 'hint-rca-tools',
              trigger: 'auto',
              title: 'Use RCA Tools',
              content: 'Consider using 5 Whys, Fishbone Diagram, or other RCA tools available in this platform to identify root causes.',
              type: 'tip'
            },
            {
              id: 'hint-gemba',
              trigger: 'hover',
              title: 'Go to Gemba',
              content: 'Observe the actual process where the work is done. Talk to operators and those closest to the work.',
              type: 'best-practice'
            }
          ],
          
          examples: [
            {
              id: 'ex-rca-process',
              title: 'Process Root Causes',
              description: 'Process inefficiency causes',
              value: '1. No standardized sequence (15 min variation)\n2. Searching for tools/parts (8 min average)\n3. Unclear specifications (causes errors)\n4. Multiple approvals required (adds 2 days)\n5. Manual data entry (error-prone)',
              scenario: 'Process with multiple contributing causes',
              useCase: 'Process improvement',
              difficulty: 'intermediate'
            },
            {
              id: 'ex-rca-quality',
              title: 'Quality Root Causes',
              description: 'Quality defect causes',
              value: '1. Worn tooling (causes 45% of defects)\n2. No torque specification (30% of defects)\n3. Missing parts check (25% of defects)\n4. Poor lighting at workstation\n5. No error-proofing devices',
              scenario: 'Quality problem with identified causes',
              useCase: 'Quality improvement',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Root causes are required to develop effective countermeasures.'
            },
            {
              type: 'min',
              value: 30,
              errorMessage: 'Please provide detailed root cause analysis (at least 30 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1000
          }
        },
        {
          id: 'hypothesis',
          order: 2,
          text: 'What is your improvement hypothesis? What changes do you believe will improve the situation?',
          type: 'long-text',
          required: true,
          
          helpText: 'State your hypothesis in "If...then..." format. What changes will you make, and what improvement do you expect?',
          placeholder: 'Example: If we create a standard work sequence, organize tools by sequence of use, and add visual aids, then setup time will decrease from 45 minutes to 30 minutes or less.',
          
          hints: [
            {
              id: 'hint-if-then',
              trigger: 'auto',
              title: 'If-Then Format',
              content: 'Use "If we do [changes], then we expect [results] because [reasoning]." This format ensures testable hypothesis.',
              type: 'tip'
            }
          ],
          
          examples: [
            {
              id: 'ex-hypothesis-process',
              title: 'Process Hypothesis',
              description: 'Process improvement hypothesis',
              value: 'If we eliminate 2 non-value-added approval steps and implement parallel processing for independent tasks, then cycle time will decrease from 4.2 hours to 2.0 hours because we remove delays and optimize flow.',
              scenario: 'Process cycle time reduction',
              useCase: 'Process improvement',
              difficulty: 'intermediate'
            },
            {
              id: 'ex-hypothesis-quality',
              title: 'Quality Hypothesis',
              description: 'Quality improvement hypothesis',
              value: 'If we replace worn tooling, add torque specifications with error-proofing, and implement a parts checklist, then defect rate will decrease from 8.5% to 4.0% because we address the top 3 root causes representing 95% of defects.',
              scenario: 'Quality defect reduction',
              useCase: 'Quality improvement',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Hypothesis is required to guide your improvement experiment.'
            },
            {
              type: 'min',
              value: 40,
              errorMessage: 'Please provide a detailed hypothesis (at least 40 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 800
          }
        },
        {
          id: 'countermeasures',
          order: 3,
          text: 'What specific countermeasures or solutions will you implement?',
          type: 'long-text',
          required: true,
          
          helpText: 'List the specific actions you will take to test your hypothesis. Be concrete and actionable.',
          placeholder: 'Example:\n1. Create standard work document with photos\n2. Organize tool shadow board in sequence of use\n3. Create visual checklist laminated at workstation\n4. Move measurement tools next to workstation\n5. Train all operators on new standard',
          
          hints: [
            {
              id: 'hint-pilot-scale',
              trigger: 'auto',
              title: 'Start Small',
              content: 'Implement countermeasures on a small scale first (one line, one shift, one product). Learn and adjust before full deployment.',
              type: 'warning'
            }
          ],
          
          examples: [
            {
              id: 'ex-countermeasures-setup',
              title: 'Setup Reduction',
              description: 'SMED countermeasures',
              value: '1. Convert internal setup steps to external (do while machine running)\n2. Standardize tool heights (eliminate adjustments)\n3. Create quick-change fixtures\n4. Color-code and label all tools\n5. Implement one-touch adjustments\n6. Create setup checklist',
              scenario: 'Reducing machine changeover time',
              useCase: 'Manufacturing efficiency',
              difficulty: 'advanced'
            },
            {
              id: 'ex-countermeasures-flow',
              title: 'Flow Improvement',
              description: 'Process flow countermeasures',
              value: '1. Eliminate approval requirement for orders under $1,000\n2. Cross-train team to handle multiple order types\n3. Implement Kanban visual management\n4. Relocate printer next to processing area\n5. Create standard work for high-volume orders',
              scenario: 'Improving process flow and reducing delays',
              useCase: 'Office process improvement',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Countermeasures are required for the Do phase.'
            },
            {
              type: 'min',
              value: 30,
              errorMessage: 'Please provide specific countermeasures (at least 30 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1000
          }
        }
      ],

      guidance: {
        introduction: 'This step connects root cause analysis to action. Your hypothesis should be testable - you will verify it in the Do and Check phases. Focus on addressing root causes, not symptoms.',
        tips: [RCA_ASK_WHY_FIVE_TIMES, RCA_VERIFY_WITH_DATA],
        warnings: [RCA_DONT_STOP_AT_SYMPTOMS, SOLUTION_DONT_BAND_AID],
        bestPractices: [RCA_USE_MULTIPLE_TOOLS, RCA_GO_TO_GEMBA, SOLUTION_BRAINSTORM_MULTIPLE, SOLUTION_COST_BENEFIT],
        commonMistakes: [RCA_STOPPING_TOO_EARLY, SOLUTION_FIRST_IDEA],
        resources: []
      },

      validation: {
        requiredQuestions: ['root_causes', 'hypothesis', 'countermeasures']
      },
      
      allowSkip: false
    },

    // ========================================================================
    // STEP 4: DO - IMPLEMENTATION & EXECUTION
    // ========================================================================
    {
      id: 'step-4-do-implementation',
      stepNumber: 4,
      title: 'Do - Implementation & Execution',
      description: 'Execute the plan on a small scale and document what happens',
      optional: false,
      icon: '⚡',

      questions: [
        {
          id: 'implementation_plan',
          order: 1,
          text: 'Describe your implementation plan. Who, what, when, where?',
          type: 'long-text',
          required: true,
          
          helpText: 'Document the specifics of your pilot implementation. Include scope, responsible parties, timeline, and location.',
          placeholder: 'Example: Pilot on Line 3, A-shift only, for Product XYZ. Operator John (lead) and Mary will execute. Week of Oct 7-11. 10 changeovers planned during pilot period.',
          
          hints: [
            {
              id: 'hint-pilot-scope',
              trigger: 'auto',
              title: 'Define Pilot Scope',
              content: 'Be specific about the boundaries of your pilot: which line, which shift, which products, how many cycles. Small scale allows for learning.',
              type: 'tip'
            }
          ],
          
          examples: [
            {
              id: 'ex-impl-manufacturing',
              title: 'Manufacturing Pilot',
              description: 'Production line pilot',
              value: 'Pilot implementation on Assembly Line 2, B-shift (2pm-10pm), Monday-Friday 10/7-10/11. Team: Operators Tom, Sarah, Lisa; Supervisor Mike; Engineer Chen. Scope: 25 units (5 per day). Daily review meeting at 9:30am.',
              scenario: 'Controlled manufacturing pilot',
              useCase: 'Manufacturing improvement',
              difficulty: 'intermediate'
            },
            {
              id: 'ex-impl-service',
              title: 'Service Pilot',
              description: 'Service process pilot',
              value: 'Pilot in Customer Service Department, Team Alpha (5 agents), Oct 3-10. Scope: Apply new process to Category 2 tickets only (approx 30 tickets/day). Team lead Sarah monitoring. Daily 15-min huddle at 8:45am to review issues.',
              scenario: 'Service process improvement pilot',
              useCase: 'Service improvement',
              difficulty: 'beginner'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Implementation plan is required for the Do phase.'
            },
            {
              type: 'min',
              value: 40,
              errorMessage: 'Please provide detailed implementation plan (at least 40 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1000
          }
        },
        {
          id: 'actions_taken',
          order: 2,
          text: 'What actions were actually taken? Document what you did.',
          type: 'long-text',
          required: true,
          
          helpText: 'Record the actual actions taken during implementation. Include dates, who did what, and any deviations from the plan.',
          placeholder: 'Example:\n10/7: Created standard work document, posted at workstation\n10/8: Organized tool shadow board\n10/9: Trained all A-shift operators (4 people, 30 min each)\n10/10-11: Executed 10 changeovers using new method',
          
          examples: [
            {
              id: 'ex-actions-detailed',
              title: 'Detailed Action Log',
              description: 'Day-by-day implementation',
              value: 'Day 1 (10/7): Kickoff meeting, 30 min. Created visual work instructions with photos. Organized tools by sequence.\nDay 2 (10/8): Training session, 1 hour. First trial run.\nDay 3 (10/9): 3 changeovers completed, data collected.\nDay 4 (10/10): 4 changeovers, adjusted tool positions based on feedback.\nDay 5 (10/11): 3 changeovers, process flowing smoothly.',
              scenario: 'Week-long pilot implementation',
              useCase: 'Manufacturing pilot',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Action log is required to document what was done.'
            },
            {
              type: 'min',
              value: 30,
              errorMessage: 'Please provide detailed action log (at least 30 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1500
          }
        },
        {
          id: 'observations',
          order: 3,
          text: 'What did you observe during implementation? What worked? What didn\'t?',
          type: 'long-text',
          required: true,
          
          helpText: 'Document your observations, both positive and negative. Include unexpected findings, operator feedback, and problems encountered.',
          placeholder: 'Example: Operators liked the visual checklist. Tool organization saved approx 5 minutes. Measurement tool location still problematic - moved it 3 times before finding optimal spot. One operator suggested adding lighting.',
          
          hints: [
            {
              id: 'hint-observe-objectively',
              trigger: 'auto',
              title: 'Observe Objectively',
              content: 'Record what you see, not what you think. Separate facts from opinions. Talk to operators and get their input.',
              type: 'tip'
            }
          ],
          
          examples: [
            {
              id: 'ex-observations-good-bad',
              title: 'Balanced Observations',
              description: 'Positive and negative findings',
              value: 'Positive: Standard work reduced variation - all changeovers now 30-35 min range. Operators appreciated visual aids and shadow board. Team morale improved.\n\nNegative: New fixture not compatible with older product variant. One tool position awkward for left-handed operator. Checklist lamination peeled off after 2 days - needs different material.',
              scenario: 'Mixed results from pilot',
              useCase: 'Learning from pilot',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Observations are critical for learning during PDCA.'
            },
            {
              type: 'min',
              value: 40,
              errorMessage: 'Please provide detailed observations (at least 40 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1500
          }
        },
        {
          id: 'issues',
          order: 4,
          text: 'What issues or problems were encountered? How were they resolved?',
          type: 'long-text',
          required: false,
          
          helpText: 'Document any problems, obstacles, or unexpected issues. Include severity and how you addressed them.',
          placeholder: 'Example: Issue 1: New fixture did not fit older product variant. Resolution: Created adapter plate for legacy products.\nIssue 2: Maintenance needed but not scheduled. Resolution: Expedited maintenance request, completed same day.',
          
          examples: [
            {
              id: 'ex-issues-resolution',
              title: 'Issues with Resolutions',
              description: 'Problem-solving during pilot',
              value: 'Issue 1 (High): Equipment calibration off - detected during trial. Resolution: Recalibrated immediately, added to pre-setup checklist.\n\nIssue 2 (Medium): Two operators on vacation, coverage thin. Resolution: Postponed 2 planned changeovers, extended pilot by 1 day.\n\nIssue 3 (Low): Visual aid font too small. Resolution: Reprinted with larger font.',
              scenario: 'Multiple issues during pilot',
              useCase: 'Issue tracking and resolution',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [],
          
          inputConfig: {
            maxLength: 1000
          }
        }
      ],

      guidance: {
        introduction: 'The Do phase is about execution and learning. Implement your countermeasures on a small scale, collect data, and observe carefully. Document everything - both successes and problems. This is an experiment, not final implementation.',
        tips: [DATA_COLLECT_BASELINE],
        warnings: [DATA_AVOID_ASSUMPTIONS],
        bestPractices: [IMPLEMENT_PDCA_CYCLE, TEAM_USE_FACILITATOR, TEAM_CROSS_FUNCTIONAL, TEAM_DOCUMENT_DECISIONS, RCA_GO_TO_GEMBA],
        commonMistakes: [SOLUTION_NO_PILOT, IMPLEMENT_NO_FOLLOWUP],
        resources: []
      },

      validation: {
        requiredQuestions: ['implementation_plan', 'actions_taken', 'observations']
      },
      
      allowSkip: false
    },

    // ========================================================================
    // STEP 5: CHECK - RESULTS & ANALYSIS
    // ========================================================================
    {
      id: 'step-5-check-results',
      stepNumber: 5,
      title: 'Check - Results & Analysis',
      description: 'Analyze results, compare to targets, and evaluate effectiveness',
      optional: false,
      icon: '📈',

      questions: [
        {
          id: 'results',
          order: 1,
          text: 'What results did you achieve? Report the actual metrics.',
          type: 'long-text',
          required: true,
          
          helpText: 'Report the actual results for each metric you defined in Step 2. Compare baseline → target → actual achieved.',
          placeholder: 'Example:\n1. Setup Time: Baseline 45 min → Target 30 min → Achieved 32 min (71% of target, 29% improvement)\n2. Downtime: Baseline 3.2 hrs/week → Target 2.0 hrs/week → Achieved 2.3 hrs/week\n3. Operator Satisfaction: Baseline 6/10 → Target 8/10 → Achieved 8.5/10',
          
          hints: [
            {
              id: 'hint-compare-baseline',
              trigger: 'auto',
              title: 'Compare to Baseline',
              content: 'Always show: Baseline → Target → Actual. This makes improvement (or lack of) immediately visible.',
              type: 'tip'
            }
          ],
          
          examples: [
            {
              id: 'ex-results-exceeded',
              title: 'Results Exceeded Target',
              description: 'Better than expected results',
              value: 'Metric 1 - Defect Rate: Baseline 8.5% → Target 4.0% → Achieved 3.2% (exceeded target by 20%)\nMetric 2 - First Pass Yield: Baseline 91.5% → Target 96.0% → Achieved 96.8% (exceeded)\nMetric 3 - Rework Cost: Baseline $18K → Target $9K → Achieved $7.5K (saved $10.5K/month)',
              scenario: 'Improvement exceeded expectations',
              useCase: 'Successful improvement',
              difficulty: 'intermediate'
            },
            {
              id: 'ex-results-partial',
              title: 'Partial Success',
              description: 'Some targets met, some missed',
              value: 'Metric 1 - Cycle Time: Baseline 4.2 hrs → Target 2.0 hrs → Achieved 2.8 hrs (33% improvement, 68% of goal)\nMetric 2 - Error Rate: Baseline 8% → Target 3% → Achieved 4% (50% improvement, 80% of goal)\nMetric 3 - Steps Reduced: Baseline 12 → Target 8 → Achieved 8 (met target)',
              scenario: 'Mixed results, some targets met',
              useCase: 'Partial success improvement',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Results are required to evaluate the improvement.'
            },
            {
              type: 'min',
              value: 40,
              errorMessage: 'Please provide detailed results with metrics (at least 40 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1500
          }
        },
        {
          id: 'analysis',
          order: 2,
          text: 'Analyze the results. Did you meet your objective? Why or why not?',
          type: 'long-text',
          required: true,
          
          helpText: 'Analyze what the results mean. Did the improvement work as expected? What factors contributed to success or shortfall?',
          placeholder: 'Example: We achieved 32 min average (vs 30 min target), which is 71% of goal but still a 29% improvement. The gap appears to be due to measurement tool location issue and one step that still varies. Overall, the hypothesis was validated - standard work and organization do reduce setup time.',
          
          hints: [
            {
              id: 'hint-root-cause-results',
              trigger: 'auto',
              title: 'Analyze Both Success and Gaps',
              content: 'Understand why you succeeded AND why you did not fully meet targets. Both are learning opportunities.',
              type: 'tip'
            }
          ],
          
          examples: [
            {
              id: 'ex-analysis-success',
              title: 'Success Analysis',
              description: 'Why improvement worked',
              value: 'The improvement exceeded targets primarily because: 1) Standard work eliminated variation between operators (previously 30-60 min range, now 30-35 min), 2) Tool organization saved 8-10 minutes per changeover, 3) Visual aids reduced errors to zero, 4) Operators embraced the change and suggested additional improvements. Hypothesis validated.',
              scenario: 'Successful improvement analysis',
              useCase: 'Understanding success',
              difficulty: 'intermediate'
            },
            {
              id: 'ex-analysis-partial',
              title: 'Partial Success Analysis',
              description: 'Why some targets missed',
              value: 'We achieved 68% of goal (2.8 hrs vs 2.0 hr target). Analysis shows: 1) Two countermeasures worked well (eliminated approvals, parallel processing saved 1.0 hour), 2) One countermeasure did not work (cross-training incomplete, only 2 of 5 staff trained), 3) Discovered additional delay not in original analysis (system latency during peak hours). Hypothesis partially validated - need to address system performance and complete training.',
              scenario: 'Mixed results requiring further analysis',
              useCase: 'Learning from partial success',
              difficulty: 'advanced'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Analysis is required to understand the results.'
            },
            {
              type: 'min',
              value: 50,
              errorMessage: 'Please provide thorough analysis (at least 50 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1500
          }
        },
        {
          id: 'learnings',
          order: 3,
          text: 'What did you learn from this cycle? What insights emerged?',
          type: 'long-text',
          required: true,
          
          helpText: 'Capture key learnings, both technical and organizational. What would you do differently? What surprised you?',
          placeholder: 'Example:\n1. Visual aids are more effective than written procedures for this operation\n2. Operator input during design phase improved buy-in and final solution\n3. Unexpected benefit: reduced stress for operators\n4. Learning: Need to account for product variants in future improvements',
          
          hints: [
            {
              id: 'hint-organizational-learning',
              trigger: 'auto',
              title: 'Capture Organizational Knowledge',
              content: 'Learnings from PDCA cycles build organizational capability. Document what worked, what did not, and why.',
              type: 'best-practice'
            }
          ],
          
          examples: [
            {
              id: 'ex-learnings-comprehensive',
              title: 'Comprehensive Learnings',
              description: 'Multiple insights from cycle',
              value: '1. Technical: Tool shadow board more effective than drawer storage - saved 5 minutes\n2. Process: Pilot duration (1 week) was perfect for learning and adjustment\n3. People: Operators have valuable improvement ideas - engaging them early is critical\n4. Unexpected: Improved lighting made bigger impact than anticipated\n5. Would do differently: Test with all product variants before finalizing fixtures\n6. Surprise: Improvement reduced physical strain - unexpected ergonomic benefit',
              scenario: 'Rich learning from pilot cycle',
              useCase: 'Organizational learning',
              difficulty: 'advanced'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Learnings are essential for organizational knowledge.'
            },
            {
              type: 'min',
              value: 30,
              errorMessage: 'Please document key learnings (at least 30 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1500
          }
        }
      ],

      guidance: {
        introduction: 'The Check phase is about honest evaluation. Compare results to targets objectively. Success is learning - whether you met targets or not, you learned something valuable. Analyze why results turned out the way they did.',
        tips: [DATA_VERIFY_ACCURACY, PROBLEM_USE_DATA, RCA_VERIFY_WITH_DATA],
        warnings: [DATA_AVOID_ASSUMPTIONS],
        bestPractices: [IMPLEMENT_MEASURE_RESULTS, PROBLEM_USE_DATA_DRIVEN, TEAM_DOCUMENT_DECISIONS],
        commonMistakes: [DATA_NO_BASELINE],
        resources: []
      },

      validation: {
        requiredQuestions: ['results', 'analysis', 'learnings']
      },
      
      allowSkip: false
    },

    // ========================================================================
    // STEP 6: ACT - STANDARDIZATION & DECISIONS
    // ========================================================================
    {
      id: 'step-6-act-standardization',
      stepNumber: 6,
      title: 'Act - Standardization & Decisions',
      description: 'Decide whether to standardize, adjust, or abandon the improvement',
      optional: false,
      icon: '✅',

      questions: [
        {
          id: 'decision',
          order: 1,
          text: 'What is your decision based on the results? Standardize, Adjust, or Abandon?',
          type: 'long-text',
          required: true,
          
          helpText: 'Based on your results and analysis, decide: STANDARDIZE (implement broadly), ADJUST (modify and test again), or ABANDON (did not work, try different approach).',
          placeholder: 'Example: Decision: STANDARDIZE with modifications. The improvement achieved 29% reduction and is worth implementing. We will make 2 adjustments before broad deployment: 1) Optimize measurement tool location, 2) Add adapter plate for legacy product variants.',
          
          hints: [
            {
              id: 'hint-three-options',
              trigger: 'auto',
              title: 'Three Paths Forward',
              content: 'STANDARDIZE if results meet/exceed targets. ADJUST if promising but needs refinement. ABANDON if approach not working and try different countermeasures.',
              type: 'tip'
            }
          ],
          
          examples: [
            {
              id: 'ex-decision-standardize',
              title: 'Standardize Decision',
              description: 'Full deployment approved',
              value: 'Decision: STANDARDIZE. Results exceeded all targets: 3.2% defects (vs 4% target), $10.5K monthly savings (vs $9K target). Approach proven effective. No modifications needed. Recommend immediate deployment to all 4 production lines. Training plan ready. Timeline: complete deployment within 3 weeks.',
              scenario: 'Highly successful pilot',
              useCase: 'Full standardization',
              difficulty: 'beginner'
            },
            {
              id: 'ex-decision-adjust',
              title: 'Adjust Decision',
              description: 'Refine and retest',
              value: 'Decision: ADJUST AND RETEST. Achieved 68% of goal - promising but not ready for full deployment. Two countermeasures worked well, one did not. Plan: 1) Complete cross-training (5 staff vs 2), 2) Address system latency issue with IT, 3) Pilot again for 2 weeks with adjustments. If successful, then standardize.',
              scenario: 'Partial success needs refinement',
              useCase: 'Adjust and repeat PDCA',
              difficulty: 'intermediate'
            },
            {
              id: 'ex-decision-abandon',
              title: 'Abandon Decision',
              description: 'Try different approach',
              value: 'Decision: ABANDON this approach. Results showed no improvement (4.1 hr vs 4.2 hr baseline, within measurement error). Root cause analysis was incomplete - the real constraint is upstream in Planning department, not in our process. Recommend: 1) Conduct value stream mapping including Planning, 2) Start new PDCA focused on upstream delays.',
              scenario: 'Approach not effective',
              useCase: 'Learn and try different approach',
              difficulty: 'advanced'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'A decision is required to complete the Act phase.'
            },
            {
              type: 'min',
              value: 40,
              errorMessage: 'Please provide detailed decision with rationale (at least 40 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1000
          }
        },
        {
          id: 'standardization',
          order: 2,
          text: 'If standardizing, what actions will make this the new standard?',
          type: 'long-text',
          required: false,
          
          helpText: 'Document how you will standardize the improvement: update procedures, train people, implement across other areas, measure ongoing.',
          placeholder: 'Example:\n1. Update Standard Work document and post at all workstations\n2. Train all 3 shifts (18 operators total, 30 min each)\n3. Implement tool shadow boards on Lines 1, 2, 4 (Line 3 complete)\n4. Update operator training checklist\n5. Add setup time to daily metrics dashboard\n6. Review results monthly in team meeting',
          
          hints: [
            {
              id: 'hint-standardize-steps',
              trigger: 'auto',
              title: 'Standardization Elements',
              content: 'Effective standardization includes: 1) Document the new method, 2) Train everyone, 3) Implement broadly, 4) Monitor adherence, 5) Update when needed.',
              type: 'best-practice'
            }
          ],
          
          examples: [
            {
              id: 'ex-standardization-plan',
              title: 'Complete Standardization Plan',
              description: 'Full deployment strategy',
              value: '1. Documentation: Update SOPs, create visual work instructions, laminate checklists (Week 1)\n2. Training: Train all shifts, create training video, add to onboarding (Week 1-2)\n3. Deployment: Lines 2-4 (Week 2-3), cross-train backup operators (Week 3)\n4. Monitoring: Track metrics daily for 4 weeks, then weekly. Add to layered audit checklist (Ongoing)\n5. Sustain: Monthly review in team meeting, 6-month follow-up PDCA cycle',
              scenario: 'Comprehensive standardization',
              useCase: 'Full deployment',
              difficulty: 'advanced'
            }
          ],
          
          validation: [],
          
          inputConfig: {
            maxLength: 1500
          }
        },
        {
          id: 'documentation',
          order: 3,
          text: 'What documentation was created or updated?',
          type: 'long-text',
          required: false,
          
          helpText: 'List the documents created, updated, or modified: SOPs, work instructions, training materials, forms, checklists, etc.',
          placeholder: 'Example:\n1. Standard Operating Procedure - Setup Line 3 (v2.0, 3 pages, 8 photos)\n2. Visual Work Instruction - Setup Sequence (1-page laminated)\n3. Setup Checklist (double-sided card, laminated)\n4. Training Module - Quick Changeover (15-minute video + quiz)\n5. Tool Shadow Board Layout Diagram\n6. Operator Training Completion Log\n7. Daily Setup Time Tracking Sheet',
          
          examples: [
            {
              id: 'ex-documentation-list',
              title: 'Documentation Package',
              description: 'Complete documentation set',
              value: '1. Standard Operating Procedure - Setup Line 3 (v2.0, 3 pages, 8 photos)\n2. Visual Work Instruction - Setup Sequence (1-page laminated)\n3. Setup Checklist (double-sided card, laminated)\n4. Training Module - Quick Changeover (15-minute video + quiz)\n5. Tool Shadow Board Layout Diagram\n6. Operator Training Completion Log\n7. Daily Setup Time Tracking Sheet',
              scenario: 'Full documentation package',
              useCase: 'Professional standardization',
              difficulty: 'advanced'
            }
          ],
          
          validation: [],
          
          inputConfig: {
            maxLength: 1000
          }
        }
      ],

      guidance: {
        introduction: 'The Act phase is about making a decision and taking action. If the improvement worked, standardize it so the gains are sustained. If it needs adjustment, document what to change and start another PDCA cycle. If it did not work, that is also valuable learning.',
        tips: [DATA_VERIFY_ACCURACY],
        warnings: [],
        bestPractices: [IMPLEMENT_STANDARDIZE, IMPLEMENT_PDCA_CYCLE, TEAM_USE_FACILITATOR, TEAM_DOCUMENT_DECISIONS],
        commonMistakes: [IMPLEMENT_NO_STANDARDIZATION, IMPLEMENT_NO_FOLLOWUP],
        resources: []
      },

      validation: {
        requiredQuestions: ['decision']
      },
      
      allowSkip: false
    },

    // ========================================================================
    // STEP 7: REVIEW & NEXT CYCLE
    // ========================================================================
    {
      id: 'step-7-review',
      stepNumber: 7,
      title: 'Review & Next Cycle',
      description: 'Reflect on the cycle and plan the next improvement',
      optional: false,
      icon: '🔄',

      questions: [
        {
          id: 'reflection',
          order: 1,
          text: 'Reflect on this PDCA cycle. What went well? What could be improved in how you conducted the cycle?',
          type: 'long-text',
          required: true,
          
          helpText: 'Reflect on the PDCA process itself, not just the technical results. How well did you plan? Execute? Measure? Decide?',
          placeholder: 'Example:\nWent Well: Team collaboration was excellent. Data collection was thorough. Pilot scope was appropriate.\nCould Improve: Should have involved operators earlier in planning. Needed more time for training. Data collection checklist would have helped.',
          
          hints: [
            {
              id: 'hint-meta-learning',
              trigger: 'auto',
              title: 'Learn About Learning',
              content: 'Reflect on how you conducted PDCA itself. Each cycle should improve both your process AND your improvement capability.',
              type: 'tip'
            }
          ],
          
          examples: [
            {
              id: 'ex-reflection-balanced',
              title: 'Balanced Reflection',
              description: 'Strengths and improvement areas',
              value: 'Went Well:\n- Excellent team collaboration and communication\n- Data collection was thorough and accurate\n- Pilot scope allowed for learning without major disruption\n- Regular daily huddles kept everyone informed\n\nCould Improve:\n- Should have involved operators in design phase, not just implementation\n- Needed more time for training (rushed 30-min session)\n- Data collection checklist would have prevented one missing data point\n- Should have scheduled pilot to avoid vacation period',
              scenario: 'Honest reflection on process',
              useCase: 'Process improvement',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [
            {
              type: 'required',
              errorMessage: 'Reflection is important for continuous learning.'
            },
            {
              type: 'min',
              value: 30,
              errorMessage: 'Please provide thoughtful reflection (at least 30 characters).'
            }
          ],
          
          inputConfig: {
            maxLength: 1500
          }
        },
        {
          id: 'next_cycle',
          order: 2,
          text: 'What is the focus of the next PDCA cycle?',
          type: 'long-text',
          required: false,
          
          helpText: 'PDCA is continuous. What is the next problem to solve or the next improvement to make? This could be refining the current improvement or tackling a new opportunity.',
          placeholder: 'Example: Next Cycle Focus: Reduce quality inspection time from 8 minutes to 4 minutes. This was identified as the next bottleneck during our cycle. Target start date: 10/21/2025.',
          
          hints: [
            {
              id: 'hint-continuous',
              trigger: 'auto',
              title: 'PDCA is Continuous',
              content: 'The Act phase leads to the next Plan phase. Always have the next improvement identified. This creates continuous improvement culture.',
              type: 'best-practice'
            }
          ],
          
          examples: [
            {
              id: 'ex-next-cycle-related',
              title: 'Related Next Cycle',
              description: 'Build on current improvement',
              value: 'Next Cycle: Reduce setup time from 32 min to 25 min (further improvement). Focus on the remaining variation and measurement tool location issue discovered in this cycle. Start date: 10/28/2025 (2 weeks after standardization complete). Same team.',
              scenario: 'Continuing improvement in same area',
              useCase: 'Incremental improvement',
              difficulty: 'beginner'
            },
            {
              id: 'ex-next-cycle-new',
              title: 'New Focus Area',
              description: 'New improvement opportunity',
              value: 'Next Cycle: Reduce inspection time from 12 min to 6 min. Now that setup is optimized, inspection is the constraint. Pareto analysis shows 80% of inspection time is spent on 3 characteristics. Start date: 11/1/2025. New team with QC lead.',
              scenario: 'Moving to next constraint',
              useCase: 'New improvement area',
              difficulty: 'intermediate'
            }
          ],
          
          validation: [],
          
          inputConfig: {
            maxLength: 800
          }
        }
      ],

      guidance: {
        introduction: 'This final step closes the current cycle and opens the next one. Reflect honestly on how you conducted PDCA - both the technical results and the process itself. Plan the next cycle to maintain momentum.',
        tips: [PROBLEM_USE_DATA],
        warnings: [],
        bestPractices: [IMPLEMENT_PDCA_CYCLE, IMPLEMENT_MEASURE_RESULTS, TEAM_DOCUMENT_DECISIONS],
        commonMistakes: [IMPLEMENT_NO_FOLLOWUP, IMPLEMENT_NO_STANDARDIZATION],
        resources: []
      },

      validation: {
        requiredQuestions: ['reflection']
      },
      
      allowSkip: false
    }
  ],

  // ========================================================================
  // COMPLETION CRITERIA
  // ========================================================================
  completionCriteria: {
    allStepsCompleted: true,
    requiredSteps: [
      'step-1-overview',
      'step-2-plan-metrics',
      'step-3-plan-hypothesis',
      'step-4-do-implementation',
      'step-5-check-results',
      'step-6-act-standardization',
      'step-7-review'
    ],
    optionalSteps: [],
    minimumQuestionsAnswered: 18,
    qualityChecks: [
      {
        id: 'check-baseline-data',
        description: 'Verify baseline data was collected before implementation',
        checkFunction: (data: Record<string, unknown>) => {
          return typeof data.current_state === 'string' && data.current_state.length > 50
        },
        importance: 'critical'
      },
      {
        id: 'check-measurable-results',
        description: 'Verify actual results were measured and compared to baseline',
        checkFunction: (data: Record<string, unknown>) => {
          return typeof data.results === 'string' && data.results.length > 40
        },
        importance: 'critical'
      },
      {
        id: 'check-decision-made',
        description: 'Verify a clear decision was made (standardize, adjust, or abandon)',
        checkFunction: (data: Record<string, unknown>) => {
          const decision = String(data.decision || '').toLowerCase()
          return decision.includes('standardize') || decision.includes('adjust') || decision.includes('abandon')
        },
        importance: 'important'
      }
    ]
  },

  // ========================================================================
  // NEXT STEPS
  // ========================================================================
  nextSteps: [
    {
      id: 'standardize-improvement',
      title: 'Standardize the Improvement',
      description: 'If your pilot was successful, implement the improvement broadly and update standard work',
      type: 'action',
      priority: 'recommended'
    },
    {
      id: 'start-next-cycle',
      title: 'Start Next PDCA Cycle',
      description: 'Begin the next improvement cycle to maintain continuous improvement momentum',
      type: 'tool',
      route: '/dashboard/continuous-improvement/pdca',
      priority: 'recommended'
    },
    {
      id: 'document-learning',
      title: 'Share Learnings',
      description: 'Share your results and learnings with the broader organization for knowledge transfer',
      type: 'action',
      priority: 'optional'
    },
    {
      id: 'a3-report',
      title: 'Create A3 Report',
      description: 'Document your improvement in A3 format for formal communication and tracking',
      type: 'tool',
      route: '/dashboard/continuous-improvement/a3',
      priority: 'optional'
    }
  ]
}
