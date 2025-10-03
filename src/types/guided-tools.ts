/**
 * Guided Tools System - Type Definitions
 * Complete type system for guided tool experiences
 */

// ============================================================================
// MAIN TOOL CONFIGURATION
// ============================================================================

export interface ToolConfiguration {
  // Metadata
  id: string
  name: string
  category: 'continuous-improvement' | 'six-sigma' | 'lean'
  description: string
  icon: string
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  
  // Learning Objectives
  objectives: string[]
  prerequisites: string[]
  
  // Introduction
  introduction: IntroductionSection
  
  // Steps
  steps: StepConfiguration[]
  
  // Completion
  completionCriteria: CompletionCriteria
  nextSteps: NextStep[]
  
  // Metadata
  tags: string[]
  relatedTools: string[]
  version: string
  lastUpdated: string
}

export interface IntroductionSection {
  title: string
  overview: string
  whenToUse: string[]
  whatYouWillNeed: string[]
  expectedOutcomes: string[]
  videoUrl?: string
  estimatedTime: string
}

// ============================================================================
// STEP CONFIGURATION
// ============================================================================

export interface StepConfiguration {
  id: string
  stepNumber: number
  title: string
  description: string
  icon?: string
  
  // Questions
  questions: QuestionConfiguration[]
  
  // Guidance
  guidance: StepGuidance
  
  // Validation
  validation: StepValidation
  
  // Dependencies
  dependencies?: string[]
  optional?: boolean
  
  // Actions
  allowSkip?: boolean
  requiresReview?: boolean
}

// ============================================================================
// QUESTION CONFIGURATION
// ============================================================================

export interface QuestionConfiguration {
  id: string
  order: number
  text: string
  type: QuestionType
  required: boolean
  
  // Input Configuration
  inputConfig: InputConfiguration
  
  // Help Content
  helpText?: string
  placeholder?: string
  hints?: QuestionHint[]
  examples?: QuestionExample[]
  
  // Validation
  validation: QuestionValidation[]
  
  // Conditional Logic
  conditionalLogic?: ConditionalLogic[]
  
  // Follow-up
  followUpQuestions?: FollowUpQuestion[]
}

export type QuestionType =
  | 'short-text'
  | 'long-text'
  | 'number'
  | 'decimal'
  | 'percentage'
  | 'currency'
  | 'date'
  | 'time'
  | 'datetime'
  | 'single-select'
  | 'multi-select'
  | 'boolean'
  | 'rating'
  | 'scale'
  | 'table'
  | 'matrix'
  | 'file-upload'
  | 'drawing'
  | 'calculation'

export interface InputConfiguration {
  // Text inputs
  minLength?: number
  maxLength?: number
  pattern?: string
  
  // Number inputs
  min?: number
  max?: number
  step?: number
  unit?: string
  
  // Select inputs
  options?: SelectOption[]
  allowCustom?: boolean
  
  // Table inputs
  columns?: TableColumn[]
  minRows?: number
  maxRows?: number
  
  // File inputs
  acceptedFileTypes?: string[]
  maxFileSize?: number
  
  // Default value
  defaultValue?: unknown
  
  // Formatting
  prefix?: string
  suffix?: string
  format?: string
}

export interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: string
  group?: string
}

export interface TableColumn {
  id: string
  header: string
  type: 'text' | 'number' | 'select' | 'date'
  width?: string
  required?: boolean
  validation?: QuestionValidation[]
  helpText?: string
}

// ============================================================================
// HINTS AND EXAMPLES
// ============================================================================

export interface QuestionHint {
  id: string
  trigger: 'button' | 'hover' | 'auto' | 'after-delay'
  delay?: number
  title: string
  content: string
  icon?: string
  type: 'tip' | 'warning' | 'info' | 'best-practice'
}

export interface QuestionExample {
  id: string
  title: string
  description: string
  value: unknown
  industry?: string
  scenario: string
  useCase: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isTemplate?: boolean
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface QuestionValidation {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom'
  value?: unknown
  errorMessage: string
  successMessage?: string
  validationFunction?: (value: unknown, allData: Record<string, unknown>) => boolean
}

export interface StepValidation {
  requiredQuestions: string[]
  customValidation?: (data: Record<string, unknown>) => ValidationResult
  warningThreshold?: number
  errorThreshold?: number
}

export interface ValidationResult {
  isValid: boolean
  errors?: string[]
  warnings?: string[]
  successMessage?: string
}

// ============================================================================
// CONDITIONAL LOGIC
// ============================================================================

export interface ConditionalLogic {
  condition: {
    questionId: string
    operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than'
    value: unknown
  }
  action: 'show' | 'hide' | 'require' | 'optional'
}

export interface FollowUpQuestion {
  id: string
  condition: string
  question: QuestionConfiguration
}

// ============================================================================
// GUIDANCE CONTENT
// ============================================================================

export interface StepGuidance {
  introduction: string
  tips: GuidanceTip[]
  warnings: GuidanceWarning[]
  bestPractices: BestPractice[]
  commonMistakes: CommonMistake[]
  resources: GuidanceResource[]
  relatedConcepts?: RelatedConcept[]
}

export interface GuidanceTip {
  id: string
  icon: string
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  audience?: 'beginner' | 'intermediate' | 'advanced' | 'all'
}

export interface GuidanceWarning {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  content: string
  severity: 'high' | 'medium' | 'low'
}

export interface BestPractice {
  id: string
  practice: string
  rationale: string
  example?: string
  source?: string
}

export interface CommonMistake {
  id: string
  mistake: string
  whyItsWrong: string
  correction: string
  example?: string
}

export interface GuidanceResource {
  id: string
  type: 'video' | 'article' | 'template' | 'case-study' | 'book' | 'tool'
  title: string
  description: string
  url?: string
  duration?: string
  thumbnail?: string
  author?: string
}

export interface RelatedConcept {
  id: string
  name: string
  description: string
  learnMoreUrl?: string
}

// ============================================================================
// COMPLETION CRITERIA
// ============================================================================

export interface CompletionCriteria {
  allStepsCompleted: boolean
  minimumQuestionsAnswered?: number
  requiredSteps: string[]
  optionalSteps: string[]
  qualityChecks?: QualityCheck[]
}

export interface QualityCheck {
  id: string
  description: string
  checkFunction: (data: Record<string, unknown>) => boolean
  importance: 'critical' | 'important' | 'suggested'
}

export interface NextStep {
  id: string
  title: string
  description: string
  type: 'tool' | 'action' | 'learning'
  route?: string
  priority: 'recommended' | 'optional'
}

// ============================================================================
// WIZARD STATE AND SESSION
// ============================================================================

export interface WizardState {
  currentStepIndex: number
  stepData: Record<string, unknown>
  completedSteps: Set<string>
  validationErrors: Record<string, string[]>
  startTime: Date
  lastSaved: Date | null
}

export interface ToolSession {
  id: string
  userId: string
  toolId: string
  sessionData: Record<string, unknown>
  currentStepIndex: number
  completedSteps: string[]
  isCompleted: boolean
  startedAt: string
  lastUpdated: string
  completedAt?: string
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface GuidedWizardProps {
  toolId: string
  config: ToolConfiguration
  onComplete: (data: Record<string, unknown>) => void
  onSave?: (data: Record<string, unknown>) => void
  initialData?: Record<string, unknown>
  allowSkip?: boolean
}

export interface QuestionCardProps {
  question: QuestionConfiguration
  value: unknown
  onChange: (value: unknown) => void
  onValidate?: (value: unknown) => ValidationResult
  showHints?: boolean
  error?: string
}

export interface GuidePanelProps {
  guidance: StepGuidance
  position?: 'right' | 'bottom'
  collapsible?: boolean
  defaultExpanded?: boolean
}

export interface ProgressMapProps {
  steps: StepConfiguration[]
  currentStepIndex: number
  completedSteps: Set<string>
  onStepClick?: (index: number) => void
  orientation?: 'horizontal' | 'vertical'
}

export interface StepNavigatorProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onStepSelect: (step: number) => void
  canGoNext: boolean
  canGoPrevious: boolean
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type StepStatus = 'completed' | 'current' | 'upcoming' | 'locked'

export interface AnalyticsEvent {
  userId: string
  toolId: string
  stepId: string
  eventType: 'step_viewed' | 'hint_viewed' | 'example_used' | 'step_completed' | 'validation_failed'
  eventData?: Record<string, unknown>
  timestamp: string
}
