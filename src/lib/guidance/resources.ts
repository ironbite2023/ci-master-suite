import { GuidanceResource } from '@/types/guided-tools'

/**
 * Centralized library of reusable resources for all guided tools
 * 
 * Naming Convention: CATEGORY_RESOURCE_NAME
 * Example: RCA_ASQ_FISHBONE_GUIDE, DATA_MINITAB_TUTORIAL
 */

// ============================================================================
// PROBLEM DEFINITION RESOURCES
// ============================================================================

export const PROBLEM_SMART_GOALS: GuidanceResource = {
  id: 'res-problem-smart',
  type: 'article',
  title: 'SMART Goals Framework',
  description: 'Learn how to write Specific, Measurable, Achievable, Relevant, Time-bound problem statements.',
  url: 'https://www.mindtools.com/a4wo118/smart-goals'
}

export const PROBLEM_SCOPE_DEFINITION: GuidanceResource = {
  id: 'res-problem-scope',
  type: 'template',
  title: 'Problem Statement Template',
  description: 'Downloadable template for structured problem statements with examples.',
  url: 'https://asq.org/quality-resources/problem-solving'
}

// ============================================================================
// ROOT CAUSE ANALYSIS RESOURCES
// ============================================================================

export const RCA_FIVE_WHY_GUIDE: GuidanceResource = {
  id: 'res-rca-five-why',
  type: 'video',
  title: '5 Why Analysis Complete Guide',
  description: 'Step-by-step video tutorial on conducting 5 Why analysis with real examples.',
  url: 'https://www.youtube.com/results?search_query=5+why+analysis+tutorial'
}

export const RCA_FISHBONE_ASQ: GuidanceResource = {
  id: 'res-rca-fishbone',
  type: 'article',
  title: 'Fishbone (Ishikawa) Diagram Guide',
  description: 'Comprehensive guide from ASQ on creating and using Fishbone diagrams.',
  url: 'https://asq.org/quality-resources/fishbone'
}

export const RCA_ROOT_CAUSE_BOOK: GuidanceResource = {
  id: 'res-rca-book',
  type: 'book',
  title: 'Root Cause Analysis Handbook',
  description: 'Definitive guide to RCA methods and best practices by ABS Consulting.',
  url: 'https://www.amazon.com/Root-Cause-Analysis-Handbook-Improvement/dp/1893019764'
}

// ============================================================================
// DATA COLLECTION & ANALYSIS RESOURCES
// ============================================================================

export const DATA_SPC_GUIDE: GuidanceResource = {
  id: 'res-data-spc',
  type: 'article',
  title: 'Statistical Process Control (SPC) Guide',
  description: 'Learn how to create and interpret control charts for process monitoring.',
  url: 'https://asq.org/quality-resources/control-chart'
}

export const DATA_MEASUREMENT_SYSTEM: GuidanceResource = {
  id: 'res-data-msa',
  type: 'article',
  title: 'Measurement System Analysis (MSA)',
  description: 'How to validate your measurement system with Gage R&R studies.',
  url: 'https://asq.org/quality-resources/measurement-system-analysis'
}

export const DATA_SAMPLE_SIZE_CALCULATOR: GuidanceResource = {
  id: 'res-data-sample-size',
  type: 'tool',
  title: 'Sample Size Calculator',
  description: 'Free online calculator to determine statistically valid sample sizes.',
  url: 'https://www.calculator.net/sample-size-calculator.html'
}

// ============================================================================
// SIX SIGMA METHODOLOGY RESOURCES
// ============================================================================

export const SIX_SIGMA_DMAIC: GuidanceResource = {
  id: 'res-six-sigma-dmaic',
  type: 'article',
  title: 'DMAIC Methodology Overview',
  description: 'Complete guide to the Define-Measure-Analyze-Improve-Control framework.',
  url: 'https://asq.org/quality-resources/dmaic'
}

export const SIX_SIGMA_CERTIFICATION: GuidanceResource = {
  id: 'res-six-sigma-cert',
  type: 'video',
  title: 'Six Sigma Green Belt Certification',
  description: 'Online certification course for Six Sigma practitioners.',
  url: 'https://www.asq.org/cert/six-sigma-green-belt'
}

// ============================================================================
// LEAN MANUFACTURING RESOURCES
// ============================================================================

export const LEAN_VSM_GUIDE: GuidanceResource = {
  id: 'res-lean-vsm',
  type: 'article',
  title: 'Value Stream Mapping Guide',
  description: 'How to create current and future state value stream maps.',
  url: 'https://www.lean.org/lexicon-terms/value-stream-mapping/'
}

export const LEAN_GEMBA_WALK: GuidanceResource = {
  id: 'res-lean-gemba',
  type: 'video',
  title: 'Gemba Walk Best Practices',
  description: 'Learn how to conduct effective Gemba walks to observe processes.',
  url: 'https://www.youtube.com/results?search_query=gemba+walk+tutorial'
}

export const LEAN_KAIZEN_EVENTS: GuidanceResource = {
  id: 'res-lean-kaizen',
  type: 'article',
  title: 'Planning and Running Kaizen Events',
  description: 'Step-by-step guide to organizing rapid improvement workshops.',
  url: 'https://www.lean.org/lexicon-terms/kaizen/'
}

// ============================================================================
// TOOLS & SOFTWARE RESOURCES
// ============================================================================

export const TOOL_MINITAB: GuidanceResource = {
  id: 'res-tool-minitab',
  type: 'tool',
  title: 'Minitab Statistical Software',
  description: 'Industry-standard software for statistical analysis and Six Sigma.',
  url: 'https://www.minitab.com/'
}

export const TOOL_EXCEL_TEMPLATES: GuidanceResource = {
  id: 'res-tool-excel',
  type: 'template',
  title: 'Free Excel CI Templates',
  description: 'Downloadable Excel templates for Pareto charts, control charts, and more.',
  url: 'https://www.vertex42.com/ExcelTemplates/pareto-chart.html'
}

// ============================================================================
// ORGANIZED BY CATEGORY
// ============================================================================

export const RESOURCES_BY_CATEGORY = {
  PROBLEM_DEFINITION: [
    PROBLEM_SMART_GOALS,
    PROBLEM_SCOPE_DEFINITION
  ],
  ROOT_CAUSE_ANALYSIS: [
    RCA_FIVE_WHY_GUIDE,
    RCA_FISHBONE_ASQ,
    RCA_ROOT_CAUSE_BOOK
  ],
  DATA_COLLECTION: [
    DATA_SPC_GUIDE,
    DATA_MEASUREMENT_SYSTEM,
    DATA_SAMPLE_SIZE_CALCULATOR
  ],
  SIX_SIGMA: [
    SIX_SIGMA_DMAIC,
    SIX_SIGMA_CERTIFICATION
  ],
  LEAN_MANUFACTURING: [
    LEAN_VSM_GUIDE,
    LEAN_GEMBA_WALK,
    LEAN_KAIZEN_EVENTS
  ],
  TOOLS_SOFTWARE: [
    TOOL_MINITAB,
    TOOL_EXCEL_TEMPLATES
  ]
}

// ============================================================================
// ALL RESOURCES (ALPHABETICAL)
// ============================================================================

export const ALL_RESOURCES = [
  DATA_MEASUREMENT_SYSTEM,
  DATA_SAMPLE_SIZE_CALCULATOR,
  DATA_SPC_GUIDE,
  LEAN_GEMBA_WALK,
  LEAN_KAIZEN_EVENTS,
  LEAN_VSM_GUIDE,
  PROBLEM_SCOPE_DEFINITION,
  PROBLEM_SMART_GOALS,
  RCA_FISHBONE_ASQ,
  RCA_FIVE_WHY_GUIDE,
  RCA_ROOT_CAUSE_BOOK,
  SIX_SIGMA_CERTIFICATION,
  SIX_SIGMA_DMAIC,
  TOOL_EXCEL_TEMPLATES,
  TOOL_MINITAB
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getResourceById = (id: string): GuidanceResource | undefined => {
  return ALL_RESOURCES.find(resource => resource.id === id)
}

export const getResourcesByCategory = (category: keyof typeof RESOURCES_BY_CATEGORY): GuidanceResource[] => {
  return RESOURCES_BY_CATEGORY[category] || []
}

export const getResourcesByType = (type: GuidanceResource['type']): GuidanceResource[] => {
  return ALL_RESOURCES.filter(resource => resource.type === type)
}

export const searchResources = (query: string): GuidanceResource[] => {
  const lowerQuery = query.toLowerCase()
  return ALL_RESOURCES.filter(resource => 
    resource.title.toLowerCase().includes(lowerQuery) ||
    resource.description.toLowerCase().includes(lowerQuery)
  )
}
