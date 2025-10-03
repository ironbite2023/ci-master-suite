# 📚 Centralized Guidance Library - Implementation Plan

## 🎯 Executive Summary

**Goal:** Create a centralized, reusable library of guidance content (tips, warnings, best practices, common mistakes, resources) that can be referenced by any tool configuration, eliminating duplication and ensuring consistency.

**Current Problem:**
- Each tool config duplicates guidance content
- Updates require changing multiple files
- Inconsistent wording across tools
- Hard to maintain quality

**Solution:**
- Single source of truth for all guidance content
- Reference-based system for tool configs
- Category-based organization
- Easy to search, update, and maintain

---

## 📊 Current State Analysis

### **Current Architecture:**
```
src/config/tools/
├── five-why-config.ts     ← Contains full guidance objects
├── fishbone-config.ts     ← Contains full guidance objects
└── pdca-config.ts         ← Contains full guidance objects (future)
```

### **Current Guidance Structure in Each Tool:**
```typescript
guidance: {
  introduction: "Tool-specific intro",
  tips: [
    { id: 'tip-1', icon: '💡', title: '...', content: '...', priority: 'high' }
  ],
  warnings: [...],
  bestPractices: [...],
  commonMistakes: [...],
  resources: [...]
}
```

### **Problems with Current Approach:**
1. ❌ **Duplication:** Same tip "Be Specific" appears in multiple tools
2. ❌ **Inconsistency:** Slight variations in wording across tools
3. ❌ **Maintenance:** Fixing a typo requires editing multiple files
4. ❌ **Scalability:** As we add more tools (target: 20+), this becomes unmaintainable
5. ❌ **Discovery:** Hard to find all tips about "data quality"
6. ❌ **Versioning:** Can't track when guidance was added/updated

---

## 🏗️ Proposed Architecture

### **New Structure:**
```
src/lib/guidance/
├── index.ts                  # Central export point
├── tips.ts                   # All reusable tips
├── warnings.ts               # All reusable warnings
├── bestPractices.ts          # All reusable best practices
├── commonMistakes.ts         # All reusable common mistakes
├── resources.ts              # All reusable resources
├── categories/               # Organized by topic
│   ├── problem-definition.ts
│   ├── data-collection.ts
│   ├── root-cause-analysis.ts
│   ├── process-improvement.ts
│   └── validation.ts
└── utils.ts                  # Helper functions

src/config/tools/
├── five-why-config.ts        # References guidance by ID
├── fishbone-config.ts        # References guidance by ID
└── pdca-config.ts            # References guidance by ID
```

### **New Guidance Structure in Tools:**
```typescript
import { TIPS, BEST_PRACTICES, WARNINGS } from '@/lib/guidance'

guidance: {
  introduction: "Tool-specific intro",
  tips: [
    TIPS.BE_SPECIFIC,
    TIPS.USE_DATA,
    TIPS.INVOLVE_TEAM
  ],
  warnings: [WARNINGS.DONT_SKIP_STEP],
  bestPractices: [BEST_PRACTICES.VALIDATE_WITH_DATA],
  commonMistakes: [MISTAKES.JUMPING_TO_CONCLUSIONS],
  resources: [RESOURCES.ISHIKAWA_GUIDE]
}
```

---

## 📝 Detailed Implementation Plan

### **Phase 1: Foundation Setup (Day 1, 2-3 hours)**

#### **Step 1.1: Create Directory Structure**
```bash
mkdir -p src/lib/guidance/categories
touch src/lib/guidance/index.ts
touch src/lib/guidance/tips.ts
touch src/lib/guidance/warnings.ts
touch src/lib/guidance/bestPractices.ts
touch src/lib/guidance/commonMistakes.ts
touch src/lib/guidance/resources.ts
touch src/lib/guidance/utils.ts
```

**Success Criteria:**
- [ ] All files created
- [ ] No TypeScript errors
- [ ] Files import correctly

---

#### **Step 1.2: Define Core Types**

**File:** `src/lib/guidance/types.ts`

```typescript
import { GuidanceTip, GuidanceWarning, BestPractice, CommonMistake, GuidanceResource } from '@/types/guided-tools'

// Re-export for convenience
export type { GuidanceTip, GuidanceWarning, BestPractice, CommonMistake, GuidanceResource }

// Metadata for guidance items
export interface GuidanceMetadata {
  id: string
  createdDate: string
  lastUpdated: string
  author?: string
  version: string
  tags: string[]
  usedBy: string[] // Tool IDs that use this guidance
}

// Category groupings
export enum GuidanceCategory {
  PROBLEM_DEFINITION = 'problem-definition',
  DATA_COLLECTION = 'data-collection',
  ROOT_CAUSE_ANALYSIS = 'root-cause-analysis',
  PROCESS_IMPROVEMENT = 'process-improvement',
  VALIDATION = 'validation',
  TEAM_COLLABORATION = 'team-collaboration',
  DOCUMENTATION = 'documentation'
}

// Guidance with metadata
export interface GuidanceTipWithMeta extends GuidanceTip {
  meta: GuidanceMetadata
  category: GuidanceCategory
}
```

**Success Criteria:**
- [ ] Types compile without errors
- [ ] Types extend existing interfaces correctly

---

#### **Step 1.3: Create Tips Library**

**File:** `src/lib/guidance/tips.ts`

```typescript
import { GuidanceTip } from '@/types/guided-tools'

/**
 * Centralized library of reusable tips for all guided tools
 * 
 * Naming Convention: CATEGORY_SPECIFIC_NAME
 * Example: PROBLEM_BE_SPECIFIC, DATA_USE_NUMBERS
 */

// ============================================================================
// PROBLEM DEFINITION TIPS
// ============================================================================

export const PROBLEM_BE_SPECIFIC: GuidanceTip = {
  id: 'tip-problem-be-specific',
  icon: '💡',
  title: 'Be Specific and Measurable',
  content: 'Include specific metrics, timeframes, locations, and conditions. Vague problems lead to vague solutions.',
  priority: 'high'
}

export const PROBLEM_USE_DATA: GuidanceTip = {
  id: 'tip-problem-use-data',
  icon: '📊',
  title: 'Quantify with Data',
  content: 'Use numbers to describe the problem. "Defect rate increased from 2% to 8%" is better than "quality is bad".',
  priority: 'high'
}

export const PROBLEM_FOCUS_ON_EFFECT: GuidanceTip = {
  id: 'tip-problem-focus-effect',
  icon: '🎯',
  title: 'Focus on the Effect, Not Causes',
  content: 'State what is happening, not why. Save the cause analysis for later steps.',
  priority: 'medium'
}

export const PROBLEM_SHOW_GAP: GuidanceTip = {
  id: 'tip-problem-show-gap',
  icon: '📏',
  title: 'Show Current vs. Target',
  content: 'Clearly state where you are now vs. where you want to be. This helps prioritize the problem.',
  priority: 'medium'
}

// ============================================================================
// DATA COLLECTION TIPS
// ============================================================================

export const DATA_COLLECT_BASELINE: GuidanceTip = {
  id: 'tip-data-collect-baseline',
  icon: '📈',
  title: 'Establish Baseline First',
  content: 'Measure current performance before making changes. You can\'t improve what you don\'t measure.',
  priority: 'high'
}

export const DATA_USE_STRATIFICATION: GuidanceTip = {
  id: 'tip-data-stratification',
  icon: '🔍',
  title: 'Stratify Your Data',
  content: 'Break data down by time, location, shift, product line, etc. Patterns often hide in subgroups.',
  priority: 'medium'
}

export const DATA_VERIFY_ACCURACY: GuidanceTip = {
  id: 'tip-data-verify',
  icon: '✓',
  title: 'Verify Data Accuracy',
  content: 'Check measurement systems before trusting data. Bad data leads to bad decisions.',
  priority: 'high'
}

// ============================================================================
// ROOT CAUSE ANALYSIS TIPS
// ============================================================================

export const RCA_ASK_WHY_FIVE_TIMES: GuidanceTip = {
  id: 'tip-rca-five-why',
  icon: '❓',
  title: 'Ask "Why?" Five Times',
  content: 'Keep asking why until you reach a root cause you can control. Stop at surface causes and problems recur.',
  priority: 'high'
}

export const RCA_LOOK_FOR_SYSTEM_ISSUES: GuidanceTip = {
  id: 'tip-rca-system-issues',
  icon: '🔧',
  title: 'Focus on Systems, Not People',
  content: 'Look for process, equipment, and system failures rather than blaming individuals.',
  priority: 'high'
}

export const RCA_VERIFY_WITH_DATA: GuidanceTip = {
  id: 'tip-rca-verify',
  icon: '📊',
  title: 'Verify Root Causes with Data',
  content: 'Test your theory. Does the data support this as a root cause? Or is it just a guess?',
  priority: 'medium'
}

// ============================================================================
// TEAM COLLABORATION TIPS
// ============================================================================

export const TEAM_INVOLVE_EXPERTS: GuidanceTip = {
  id: 'tip-team-involve-experts',
  icon: '👥',
  title: 'Involve Those Who Do the Work',
  content: 'People closest to the problem have the best insights. Don\'t analyze in isolation.',
  priority: 'high'
}

export const TEAM_DIVERSE_PERSPECTIVES: GuidanceTip = {
  id: 'tip-team-diverse',
  icon: '🌐',
  title: 'Seek Diverse Perspectives',
  content: 'Include different roles, shifts, and experience levels. Diversity reveals blind spots.',
  priority: 'medium'
}

export const TEAM_DOCUMENT_SESSIONS: GuidanceTip = {
  id: 'tip-team-document',
  icon: '📝',
  title: 'Document Team Discussions',
  content: 'Capture insights, disagreements, and rationale. This helps later and builds institutional knowledge.',
  priority: 'low'
}

// ============================================================================
// ORGANIZED BY CATEGORY
// ============================================================================

export const TIPS_BY_CATEGORY = {
  PROBLEM_DEFINITION: [
    PROBLEM_BE_SPECIFIC,
    PROBLEM_USE_DATA,
    PROBLEM_FOCUS_ON_EFFECT,
    PROBLEM_SHOW_GAP
  ],
  DATA_COLLECTION: [
    DATA_COLLECT_BASELINE,
    DATA_USE_STRATIFICATION,
    DATA_VERIFY_ACCURACY
  ],
  ROOT_CAUSE_ANALYSIS: [
    RCA_ASK_WHY_FIVE_TIMES,
    RCA_LOOK_FOR_SYSTEM_ISSUES,
    RCA_VERIFY_WITH_DATA
  ],
  TEAM_COLLABORATION: [
    TEAM_INVOLVE_EXPERTS,
    TEAM_DIVERSE_PERSPECTIVES,
    TEAM_DOCUMENT_SESSIONS
  ]
}

// ============================================================================
// ALL TIPS (ALPHABETICAL)
// ============================================================================

export const ALL_TIPS = [
  DATA_COLLECT_BASELINE,
  DATA_USE_STRATIFICATION,
  DATA_VERIFY_ACCURACY,
  PROBLEM_BE_SPECIFIC,
  PROBLEM_FOCUS_ON_EFFECT,
  PROBLEM_SHOW_GAP,
  PROBLEM_USE_DATA,
  RCA_ASK_WHY_FIVE_TIMES,
  RCA_LOOK_FOR_SYSTEM_ISSUES,
  RCA_VERIFY_WITH_DATA,
  TEAM_DIVERSE_PERSPECTIVES,
  TEAM_DOCUMENT_SESSIONS,
  TEAM_INVOLVE_EXPERTS
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getTipById = (id: string): GuidanceTip | undefined => {
  return ALL_TIPS.find(tip => tip.id === id)
}

export const getTipsByCategory = (category: keyof typeof TIPS_BY_CATEGORY): GuidanceTip[] => {
  return TIPS_BY_CATEGORY[category] || []
}

export const searchTips = (query: string): GuidanceTip[] => {
  const lowerQuery = query.toLowerCase()
  return ALL_TIPS.filter(tip => 
    tip.title.toLowerCase().includes(lowerQuery) ||
    tip.content.toLowerCase().includes(lowerQuery)
  )
}
```

**Success Criteria:**
- [ ] All tips compile without errors
- [ ] Tips follow naming convention
- [ ] Helper functions work correctly
- [ ] Can import and use in tool configs

---

#### **Step 1.4: Create Warnings Library**

**File:** `src/lib/guidance/warnings.ts`

```typescript
import { GuidanceWarning } from '@/types/guided-tools'

export const WARN_DONT_SKIP_PROBLEM_DEFINITION: GuidanceWarning = {
  id: 'warn-skip-problem-def',
  type: 'warning',
  title: 'Don\'t Skip Problem Definition',
  content: 'A vague problem statement leads to incomplete analysis. Take time to be specific before moving forward.',
  severity: 'high'
}

export const WARN_AVOID_BLAME: GuidanceWarning = {
  id: 'warn-avoid-blame',
  type: 'warning',
  title: 'Avoid Blaming Individuals',
  content: 'Focus on system issues, not people. Blame shuts down collaboration and prevents finding real root causes.',
  severity: 'high'
}

export const WARN_DONT_JUMP_TO_SOLUTIONS: GuidanceWarning = {
  id: 'warn-no-jumping-solutions',
  type: 'warning',
  title: 'Don\'t Jump to Solutions',
  content: 'Complete the analysis first. Premature solutions often address symptoms, not root causes.',
  severity: 'medium'
}

export const WARN_VERIFY_DATA: GuidanceWarning = {
  id: 'warn-verify-data',
  type: 'warning',
  title: 'Verify Data Before Proceeding',
  content: 'Bad data leads to bad decisions. Check measurement systems and data collection methods.',
  severity: 'high'
}

export const ALL_WARNINGS = [
  WARN_DONT_SKIP_PROBLEM_DEFINITION,
  WARN_AVOID_BLAME,
  WARN_DONT_JUMP_TO_SOLUTIONS,
  WARN_VERIFY_DATA
]
```

**Success Criteria:**
- [ ] All warnings compile
- [ ] Clear severity levels
- [ ] Actionable guidance

---

#### **Step 1.5: Create Best Practices Library**

**File:** `src/lib/guidance/bestPractices.ts`

```typescript
import { BestPractice } from '@/types/guided-tools'

export const BP_USE_DATA_TO_QUANTIFY: BestPractice = {
  id: 'bp-use-data',
  practice: 'Use data to quantify the problem when possible',
  rationale: 'Numbers make the problem concrete and measurable, helping with prioritization and tracking improvement.',
  example: 'Instead of "quality is bad", say "defect rate is 8.5% vs. target of 2%"',
  source: 'Lean Six Sigma methodology'
}

export const BP_INVOLVE_TEAM_MEMBERS: BestPractice = {
  id: 'bp-involve-team',
  practice: 'Involve team members who experience the problem',
  rationale: 'Those closest to the problem have the best insights and will be more engaged in solutions.',
  example: 'Include operators, supervisors, and maintenance staff in root cause analysis sessions.',
  source: 'Kaizen methodology'
}

export const BP_STATE_WHAT_IS_HAPPENING: BestPractice = {
  id: 'bp-state-positive',
  practice: 'State what IS happening, not what ISN\'T',
  rationale: 'Positive statements are clearer and more actionable than negatives.',
  example: 'Say "cycle time is 45 minutes" instead of "process is not fast enough"'
}

export const BP_DOCUMENT_PROCESS: BestPractice = {
  id: 'bp-document',
  practice: 'Document your analysis process and rationale',
  rationale: 'Documentation helps others learn, enables review, and creates institutional knowledge.',
  example: 'Save your fishbone diagrams, data charts, and decision rationale for future reference.'
}

export const BP_VALIDATE_WITH_GEMBA: BestPractice = {
  id: 'bp-gemba',
  practice: 'Go to the Gemba (where work happens) to verify',
  rationale: 'Conference room theories often miss reality. See the process firsthand.',
  example: 'Walk the production line, watch the process, talk to operators before finalizing root causes.',
  source: 'Gemba Walk practice'
}

export const ALL_BEST_PRACTICES = [
  BP_USE_DATA_TO_QUANTIFY,
  BP_INVOLVE_TEAM_MEMBERS,
  BP_STATE_WHAT_IS_HAPPENING,
  BP_DOCUMENT_PROCESS,
  BP_VALIDATE_WITH_GEMBA
]
```

---

#### **Step 1.6: Create Common Mistakes Library**

**File:** `src/lib/guidance/commonMistakes.ts`

```typescript
import { CommonMistake } from '@/types/guided-tools'

export const MISTAKE_STATING_CAUSES_AS_PROBLEM: CommonMistake = {
  id: 'mistake-causes-as-problem',
  mistake: 'Stating causes instead of the problem itself',
  whyItsWrong: 'This skips the analysis and jumps to conclusions before exploring all possibilities.',
  correction: 'State only the observable problem/effect, not your theory about why it happens. Example: Say "defect rate is 8%" not "we have a training problem".'
}

export const MISTAKE_TOO_VAGUE: CommonMistake = {
  id: 'mistake-vague',
  mistake: 'Being too vague or general',
  whyItsWrong: 'Vague problems lead to vague solutions and make it hard to know when you\'ve succeeded.',
  correction: 'Add specific metrics, locations, timeframes, and conditions. Example: Change "quality is bad" to "Assembly Line 3 had 45 defects in Week 12".'
}

export const MISTAKE_INCLUDING_SOLUTIONS: CommonMistake = {
  id: 'mistake-solutions-in-problem',
  mistake: 'Including solutions in the problem statement',
  whyItsWrong: 'This biases the analysis and prevents you from finding the real root cause.',
  correction: 'Remove any "we need to..." or "lack of..." phrases. Just state what\'s wrong, not what to do about it.'
}

export const MISTAKE_BLAMING_PEOPLE: CommonMistake = {
  id: 'mistake-blaming',
  mistake: 'Blaming individuals instead of systems',
  whyItsWrong: 'Blame culture shuts down collaboration and prevents finding systemic root causes.',
  correction: 'Focus on processes, systems, and conditions. Ask "What in our system allowed this to happen?" not "Who made the mistake?"'
}

export const MISTAKE_STOPPING_TOO_EARLY: CommonMistake = {
  id: 'mistake-stop-early',
  mistake: 'Stopping at the first cause instead of digging deeper',
  whyItsWrong: 'Surface causes are often symptoms. Fixing them doesn\'t prevent recurrence.',
  correction: 'Keep asking "why" until you reach a root cause you can control. Usually takes 3-5 levels of "why".'
}

export const ALL_COMMON_MISTAKES = [
  MISTAKE_STATING_CAUSES_AS_PROBLEM,
  MISTAKE_TOO_VAGUE,
  MISTAKE_INCLUDING_SOLUTIONS,
  MISTAKE_BLAMING_PEOPLE,
  MISTAKE_STOPPING_TOO_EARLY
]
```

---

#### **Step 1.7: Create Resources Library**

**File:** `src/lib/guidance/resources.ts`

```typescript
import { GuidanceResource } from '@/types/guided-tools'

// ============================================================================
// ARTICLES & GUIDES
// ============================================================================

export const RESOURCE_FISHBONE_GUIDE: GuidanceResource = {
  id: 'res-fishbone-guide',
  type: 'article',
  title: 'Ishikawa Fishbone Diagram Guide',
  description: 'Comprehensive guide to the Fishbone (Ishikawa) Diagram methodology and 6M categories from ASQ.',
  url: 'https://asq.org/quality-resources/fishbone',
  author: 'American Society for Quality'
}

export const RESOURCE_FIVE_WHY_GUIDE: GuidanceResource = {
  id: 'res-five-why-guide',
  type: 'article',
  title: '5 Whys Analysis Guide',
  description: 'Step-by-step guide to conducting effective 5 Why root cause analysis.',
  url: 'https://www.mindtools.com/pages/article/newTMC_5W.htm'
}

export const RESOURCE_PDCA_GUIDE: GuidanceResource = {
  id: 'res-pdca-guide',
  type: 'article',
  title: 'PDCA Cycle Explained',
  description: 'Complete guide to Plan-Do-Check-Act methodology for continuous improvement.',
  url: 'https://asq.org/quality-resources/pdca-cycle'
}

// ============================================================================
// TEMPLATES
// ============================================================================

export const RESOURCE_FISHBONE_TEMPLATE: GuidanceResource = {
  id: 'res-fishbone-template',
  type: 'template',
  title: 'Fishbone Diagram Template',
  description: 'Downloadable PowerPoint template for conducting fishbone analysis with your team.'
}

export const RESOURCE_A3_TEMPLATE: GuidanceResource = {
  id: 'res-a3-template',
  type: 'template',
  title: 'A3 Problem Solving Template',
  description: 'Standard A3 report template following Toyota methodology.'
}

// ============================================================================
// BOOKS
// ============================================================================

export const RESOURCE_LEAN_THINKING_BOOK: GuidanceResource = {
  id: 'res-lean-thinking',
  type: 'book',
  title: 'Lean Thinking',
  description: 'Classic book on Lean principles by Womack and Jones.',
  author: 'James P. Womack, Daniel T. Jones'
}

export const RESOURCE_TOYOTA_WAY_BOOK: GuidanceResource = {
  id: 'res-toyota-way',
  type: 'book',
  title: 'The Toyota Way',
  description: '14 management principles from the world\'s greatest manufacturer.',
  author: 'Jeffrey Liker'
}

// ============================================================================
// ORGANIZED BY CATEGORY
// ============================================================================

export const RESOURCES_BY_TYPE = {
  ARTICLES: [
    RESOURCE_FISHBONE_GUIDE,
    RESOURCE_FIVE_WHY_GUIDE,
    RESOURCE_PDCA_GUIDE
  ],
  TEMPLATES: [
    RESOURCE_FISHBONE_TEMPLATE,
    RESOURCE_A3_TEMPLATE
  ],
  BOOKS: [
    RESOURCE_LEAN_THINKING_BOOK,
    RESOURCE_TOYOTA_WAY_BOOK
  ]
}

export const ALL_RESOURCES = [
  ...RESOURCES_BY_TYPE.ARTICLES,
  ...RESOURCES_BY_TYPE.TEMPLATES,
  ...RESOURCES_BY_TYPE.BOOKS
]
```

---

#### **Step 1.8: Create Central Export**

**File:** `src/lib/guidance/index.ts`

```typescript
// ============================================================================
// CENTRALIZED GUIDANCE LIBRARY
// Single source of truth for all reusable guidance content
// ============================================================================

// Tips
export * from './tips'

// Warnings
export * from './warnings'

// Best Practices
export * from './bestPractices'

// Common Mistakes
export * from './commonMistakes'

// Resources
export * from './resources'

// Convenience exports for common patterns
import { TIPS_BY_CATEGORY } from './tips'
import { ALL_WARNINGS } from './warnings'
import { ALL_BEST_PRACTICES } from './bestPractices'
import { ALL_COMMON_MISTAKES } from './commonMistakes'
import { RESOURCES_BY_TYPE } from './resources'

export const GUIDANCE = {
  TIPS: TIPS_BY_CATEGORY,
  WARNINGS: ALL_WARNINGS,
  BEST_PRACTICES: ALL_BEST_PRACTICES,
  MISTAKES: ALL_COMMON_MISTAKES,
  RESOURCES: RESOURCES_BY_TYPE
}
```

**Success Criteria:**
- [ ] All exports work
- [ ] No circular dependencies
- [ ] Can import with single line: `import { TIPS, WARNINGS } from '@/lib/guidance'`

---

### **Phase 2: Migration of Existing Tools (Day 1-2, 3-4 hours)**

#### **Step 2.1: Update Fishbone Config**

**Before:**
```typescript
guidance: {
  tips: [
    { id: 'tip-1', icon: '💡', title: 'Be Specific', content: '...' }
  ]
}
```

**After:**
```typescript
import { 
  PROBLEM_BE_SPECIFIC,
  PROBLEM_USE_DATA,
  PROBLEM_FOCUS_ON_EFFECT,
  BP_USE_DATA_TO_QUANTIFY,
  BP_INVOLVE_TEAM_MEMBERS,
  MISTAKE_STATING_CAUSES_AS_PROBLEM,
  WARN_DONT_SKIP_PROBLEM_DEFINITION,
  RESOURCE_FISHBONE_GUIDE
} from '@/lib/guidance'

guidance: {
  tips: [PROBLEM_BE_SPECIFIC, PROBLEM_USE_DATA, PROBLEM_FOCUS_ON_EFFECT],
  warnings: [WARN_DONT_SKIP_PROBLEM_DEFINITION],
  bestPractices: [BP_USE_DATA_TO_QUANTIFY, BP_INVOLVE_TEAM_MEMBERS],
  commonMistakes: [MISTAKE_STATING_CAUSES_AS_PROBLEM],
  resources: [RESOURCE_FISHBONE_GUIDE]
}
```

**Success Criteria:**
- [ ] Fishbone tool displays all guidance correctly
- [ ] No TypeScript errors
- [ ] Content matches previous version

---

#### **Step 2.2: Update Five Why Config**

Same process as above.

**Success Criteria:**
- [ ] Five Why tool displays all guidance correctly
- [ ] Reuses same tips as Fishbone where appropriate

---

### **Phase 3: Documentation (Day 2, 1-2 hours)**

#### **Step 3.1: Create Developer Guide**

**File:** `docs/4-features/guided-tools/GUIDANCE_LIBRARY_USAGE.md`

Document:
- How to use existing guidance
- How to add new guidance
- Naming conventions
- Best practices
- Examples

---

#### **Step 3.2: Create Guidance Catalog**

**File:** `docs/4-features/guided-tools/GUIDANCE_CATALOG.md`

Create a searchable catalog of all guidance items:
- All tips with descriptions
- All warnings
- All best practices
- All common mistakes
- All resources

---

### **Phase 4: Testing & Validation (Day 2, 1-2 hours)**

#### **Step 4.1: Manual Testing**
- [ ] Test Fishbone tool - all tabs show content
- [ ] Test Five Why tool - all tabs show content
- [ ] Verify shared tips display identically
- [ ] Check all links work (resources)

#### **Step 4.2: Visual Regression**
- [ ] Take screenshots of before/after
- [ ] Verify no visual changes

---

### **Phase 5: Future Enhancements (Future)**

#### **Enhancement 1: Search Functionality**
```typescript
// src/lib/guidance/search.ts
export const searchGuidance = (query: string) => {
  // Search across all guidance types
  const results = {
    tips: searchTips(query),
    bestPractices: searchBestPractices(query),
    // ...
  }
  return results
}
```

#### **Enhancement 2: Usage Analytics**
Track which guidance items are most viewed/helpful.

#### **Enhancement 3: Guidance Versioning**
Track when guidance was added, updated, by whom.

#### **Enhancement 4: Multi-language Support**
Add translations for all guidance items.

---

## 📋 Implementation Checklist

### **Phase 1: Foundation (Day 1)**
- [ ] Create directory structure
- [ ] Define types (`types.ts`)
- [ ] Create tips library (`tips.ts`) - ~15 tips
- [ ] Create warnings library (`warnings.ts`) - ~5 warnings
- [ ] Create best practices library (`bestPractices.ts`) - ~5 practices
- [ ] Create common mistakes library (`commonMistakes.ts`) - ~5 mistakes
- [ ] Create resources library (`resources.ts`) - ~5 resources
- [ ] Create central export (`index.ts`)
- [ ] Test imports work

### **Phase 2: Migration (Day 1-2)**
- [ ] Update Fishbone config to use library
- [ ] Test Fishbone tool
- [ ] Update Five Why config to use library
- [ ] Test Five Why tool
- [ ] Verify no regressions

### **Phase 3: Documentation (Day 2)**
- [ ] Create usage guide
- [ ] Create guidance catalog
- [ ] Update README

### **Phase 4: Testing (Day 2)**
- [ ] Manual testing all tools
- [ ] Visual regression check
- [ ] Fix any issues

---

## ✅ Success Criteria

### **Immediate (Phase 1-2):**
- [ ] All existing tools work with new library
- [ ] No visual changes to users
- [ ] Zero TypeScript errors
- [ ] Faster to add new guidance

### **Long-term (After all tools migrated):**
- [ ] 50%+ reduction in guidance code duplication
- [ ] Single place to update all guidance
- [ ] Consistent quality across all tools
- [ ] Easy to find and reuse guidance

---

## 🎯 Timeline

| Phase | Duration | Completion |
|-------|----------|------------|
| Phase 1: Foundation | 2-3 hours | Day 1 |
| Phase 2: Migration | 3-4 hours | Day 1-2 |
| Phase 3: Documentation | 1-2 hours | Day 2 |
| Phase 4: Testing | 1-2 hours | Day 2 |
| **TOTAL** | **7-11 hours** | **1-2 days** |

---

## 🚀 Next Steps

1. **Review this plan** - Get approval from team
2. **Start Phase 1** - Create foundation files
3. **Migrate one tool** - Fishbone as pilot
4. **Validate** - Ensure no regressions
5. **Migrate remaining tools** - Scale to all tools
6. **Document** - Create usage guides
7. **Celebrate** - 🎉 Centralized guidance achieved!

---

*Document Version: 1.0*
*Created: October 3, 2025*
*Status: READY FOR IMPLEMENTATION*
