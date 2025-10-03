# Centralized Guidance Library - Quick Reference Guide

**Version**: 1.0  
**Last Updated**: October 3, 2025

---

## 🚀 Quick Start

### 1. Import What You Need
```typescript
import { 
  PROBLEM_BE_SPECIFIC,      // Individual tip
  PROBLEM_DONT_SKIP,        // Individual warning
  PROBLEM_USE_DATA_DRIVEN,  // Individual best practice
  PROBLEM_TOO_VAGUE,        // Individual common mistake
  RCA_FIVE_WHY_GUIDE        // Individual resource
} from '@/lib/guidance'
```

### 2. Use in Tool Config
```typescript
export const myToolConfig: ToolConfiguration = {
  steps: [{
    guidance: {
      tips: [PROBLEM_BE_SPECIFIC, PROBLEM_USE_DATA],
      warnings: [PROBLEM_DONT_SKIP],
      bestPractices: [PROBLEM_USE_DATA_DRIVEN],
      commonMistakes: [PROBLEM_TOO_VAGUE],
      resources: [RCA_FIVE_WHY_GUIDE]
    }
  }]
}
```

### 3. Done! ✅
The `GuidePanel` component automatically renders everything.

---

## 📚 Available Guidance Items

### 🎯 Tips (13 items)

#### Problem Definition
- `PROBLEM_BE_SPECIFIC` - Be specific and measurable (HIGH priority)
- `PROBLEM_USE_DATA` - Quantify with data (HIGH priority)
- `PROBLEM_FOCUS_ON_EFFECT` - Focus on effect, not causes (MEDIUM)
- `PROBLEM_SHOW_GAP` - Show current vs. target (MEDIUM)

#### Data Collection
- `DATA_COLLECT_BASELINE` - Establish baseline first (HIGH priority)
- `DATA_USE_STRATIFICATION` - Stratify your data (MEDIUM)
- `DATA_VERIFY_ACCURACY` - Verify data accuracy (HIGH priority)

#### Root Cause Analysis
- `RCA_ASK_WHY_FIVE_TIMES` - Ask "Why?" five times (HIGH priority)
- `RCA_LOOK_FOR_SYSTEM_ISSUES` - Focus on systems, not people (HIGH priority)
- `RCA_VERIFY_WITH_DATA` - Verify root causes with data (MEDIUM)

#### Team Collaboration
- `TEAM_INVOLVE_EXPERTS` - Involve those who do the work (HIGH priority)
- `TEAM_DIVERSE_PERSPECTIVES` - Seek diverse perspectives (MEDIUM)
- `TEAM_DOCUMENT_SESSIONS` - Document team discussions (LOW)

---

### ⚠️ Warnings (12 items)

#### Problem Definition
- `PROBLEM_DONT_SKIP` - Don't skip this step (HIGH severity)
- `PROBLEM_AVOID_BLAME` - Avoid blaming people (HIGH severity)
- `PROBLEM_DONT_JUMP_TO_SOLUTIONS` - Don't jump to solutions (MEDIUM)

#### Data Collection
- `DATA_AVOID_ASSUMPTIONS` - Avoid assumptions (HIGH severity)
- `DATA_CHECK_MEASUREMENT_SYSTEM` - Verify measurement system (HIGH severity)
- `DATA_SAMPLE_SIZE_MATTERS` - Sample size matters (MEDIUM)

#### Root Cause Analysis
- `RCA_DONT_STOP_AT_SYMPTOMS` - Don't stop at symptoms (HIGH severity)
- `RCA_AVOID_SINGLE_CAUSE` - Avoid single-cause thinking (MEDIUM)
- `RCA_VERIFY_BEFORE_ACTING` - Verify before acting (HIGH severity)

#### Solution Development
- `SOLUTION_DONT_BAND_AID` - Avoid band-aid solutions (HIGH severity)
- `SOLUTION_CONSIDER_SIDE_EFFECTS` - Consider unintended consequences (MEDIUM)
- `SOLUTION_PILOT_FIRST` - Pilot before full rollout (LOW)

---

### ✅ Best Practices (18 items)

#### Problem Definition
- `PROBLEM_USE_DATA_DRIVEN` - Use data to quantify the problem
- `PROBLEM_DEFINE_SCOPE` - Define clear boundaries
- `PROBLEM_SHOW_IMPACT` - Quantify the impact

#### Data Collection
- `DATA_USE_CHECK_SHEETS` - Use structured check sheets
- `DATA_TRAIN_COLLECTORS` - Train all data collectors
- `DATA_DOCUMENT_METHOD` - Document your data collection method

#### Root Cause Analysis
- `RCA_GO_TO_GEMBA` - Go to Gemba (the actual place)
- `RCA_USE_MULTIPLE_TOOLS` - Use multiple analysis tools
- `RCA_VERIFY_WITH_DATA_BP` - Test your root cause hypothesis

#### Solution Development
- `SOLUTION_BRAINSTORM_MULTIPLE` - Generate multiple solution options
- `SOLUTION_COST_BENEFIT` - Conduct a cost-benefit analysis
- `SOLUTION_FAILURE_MODE` - Consider failure modes

#### Implementation
- `IMPLEMENT_PDCA_CYCLE` - Use PDCA for implementation
- `IMPLEMENT_STANDARDIZE` - Standardize successful improvements
- `IMPLEMENT_MEASURE_RESULTS` - Measure results and compare to baseline

#### Team Collaboration
- `TEAM_CROSS_FUNCTIONAL` - Include cross-functional team members
- `TEAM_USE_FACILITATOR` - Use a neutral facilitator
- `TEAM_DOCUMENT_DECISIONS` - Document key decisions

---

### ❌ Common Mistakes (15 items)

#### Problem Definition
- `PROBLEM_STATING_CAUSES` - Stating causes instead of the problem
- `PROBLEM_TOO_VAGUE` - "Quality is bad" (too vague)
- `PROBLEM_BLAMING_PEOPLE` - Blaming individuals

#### Data Collection
- `DATA_CHERRY_PICKING` - Selecting only supporting data
- `DATA_TOO_SMALL_SAMPLE` - Drawing conclusions from 3-5 data points
- `DATA_NO_BASELINE` - Starting improvement without measuring

#### Root Cause Analysis
- `RCA_STOPPING_TOO_EARLY` - Stopping at the first "why"
- `RCA_SKIPPING_GEMBA` - Analyzing from your desk
- `RCA_SINGLE_TOOL_ONLY` - Using only one analysis tool

#### Solution Development
- `SOLUTION_FIRST_IDEA` - Implementing the first solution
- `SOLUTION_BAND_AID_FIX` - Applying quick fixes
- `SOLUTION_NO_PILOT` - Implementing company-wide without testing

#### Implementation
- `IMPLEMENT_NO_STANDARDIZATION` - Not updating SOPs
- `IMPLEMENT_NO_FOLLOWUP` - Implementing and walking away
- `IMPLEMENT_SKIPPING_TRAINING` - Rolling out without training

---

### 📖 Resources (15 items)

#### Problem Definition
- `PROBLEM_SMART_GOALS` - SMART Goals Framework (article)
- `PROBLEM_SCOPE_DEFINITION` - Problem Statement Template (template)

#### Root Cause Analysis
- `RCA_FIVE_WHY_GUIDE` - 5 Why Analysis Complete Guide (video)
- `RCA_FISHBONE_ASQ` - Fishbone Diagram Guide (article)
- `RCA_ROOT_CAUSE_BOOK` - Root Cause Analysis Handbook (book)

#### Data Collection
- `DATA_SPC_GUIDE` - Statistical Process Control Guide (article)
- `DATA_MEASUREMENT_SYSTEM` - Measurement System Analysis (article)
- `DATA_SAMPLE_SIZE_CALCULATOR` - Sample Size Calculator (tool)

#### Six Sigma
- `SIX_SIGMA_DMAIC` - DMAIC Methodology Overview (article)
- `SIX_SIGMA_CERTIFICATION` - Six Sigma Green Belt Certification (course)

#### Lean Manufacturing
- `LEAN_VSM_GUIDE` - Value Stream Mapping Guide (article)
- `LEAN_GEMBA_WALK` - Gemba Walk Best Practices (video)
- `LEAN_KAIZEN_EVENTS` - Planning and Running Kaizen Events (article)

#### Tools & Software
- `TOOL_MINITAB` - Minitab Statistical Software (tool)
- `TOOL_EXCEL_TEMPLATES` - Free Excel CI Templates (template)

---

## 🔍 Helper Functions

### Get by ID
```typescript
import { getTipById, getWarningById } from '@/lib/guidance'

const tip = getTipById('tip-problem-be-specific')
const warning = getWarningById('warn-problem-dont-skip')
```

### Get by Category
```typescript
import { getTipsByCategory, getBestPracticesByCategory } from '@/lib/guidance'

const problemTips = getTipsByCategory('PROBLEM_DEFINITION')
const dataPractices = getBestPracticesByCategory('DATA_COLLECTION')
```

### Search
```typescript
import { searchTips, searchBestPractices, searchResources } from '@/lib/guidance'

const dataTips = searchTips('data')
const teamPractices = searchBestPractices('team')
const articleResources = searchResources('article')
```

### Get All
```typescript
import { 
  ALL_TIPS, 
  ALL_WARNINGS, 
  ALL_BEST_PRACTICES, 
  ALL_COMMON_MISTAKES, 
  ALL_RESOURCES 
} from '@/lib/guidance'

console.log(`Total tips: ${ALL_TIPS.length}`)
```

### Get by Category Object
```typescript
import { 
  TIPS_BY_CATEGORY, 
  WARNINGS_BY_CATEGORY,
  BEST_PRACTICES_BY_CATEGORY 
} from '@/lib/guidance'

const allProblemTips = TIPS_BY_CATEGORY.PROBLEM_DEFINITION
const allDataWarnings = WARNINGS_BY_CATEGORY.DATA_COLLECTION
```

---

## 📋 Naming Conventions

### Tips
`CATEGORY_DESCRIPTION`
- Examples: `PROBLEM_BE_SPECIFIC`, `DATA_COLLECT_BASELINE`, `RCA_ASK_WHY_FIVE_TIMES`

### Warnings
`CATEGORY_WARNING_NAME`
- Examples: `PROBLEM_DONT_SKIP`, `DATA_AVOID_ASSUMPTIONS`, `RCA_DONT_STOP_AT_SYMPTOMS`

### Best Practices
`CATEGORY_PRACTICE_NAME`
- Examples: `PROBLEM_USE_DATA_DRIVEN`, `RCA_GO_TO_GEMBA`, `IMPLEMENT_PDCA_CYCLE`

### Common Mistakes
`CATEGORY_MISTAKE_DESCRIPTION`
- Examples: `PROBLEM_STATING_CAUSES`, `DATA_CHERRY_PICKING`, `RCA_STOPPING_TOO_EARLY`

### Resources
`CATEGORY_RESOURCE_NAME`
- Examples: `RCA_FIVE_WHY_GUIDE`, `DATA_SPC_GUIDE`, `LEAN_VSM_GUIDE`

---

## 🎨 Categories Available

### PROBLEM_DEFINITION
Tips, warnings, best practices, common mistakes, and resources for defining problems clearly.

### DATA_COLLECTION
Tips, warnings, best practices, common mistakes, and resources for collecting and analyzing data.

### ROOT_CAUSE_ANALYSIS
Tips, warnings, best practices, common mistakes, and resources for finding root causes.

### SOLUTION_DEVELOPMENT
Warnings, best practices, and common mistakes for developing effective solutions.

### IMPLEMENTATION
Best practices and common mistakes for implementing improvements.

### TEAM_COLLABORATION
Tips and best practices for working with teams effectively.

### SIX_SIGMA
Resources for Six Sigma methodology and certification.

### LEAN_MANUFACTURING
Resources for Lean tools and techniques.

### TOOLS_SOFTWARE
Resources for software and templates.

---

## 💡 Usage Tips

### ✅ DO
- Import only what you need (tree-shaking friendly)
- Use guidance items by reference (no inline objects)
- Combine items from different categories
- Leverage search functions for discovery

### ❌ DON'T
- Create inline guidance objects (use the library!)
- Duplicate guidance content
- Modify guidance items directly (they're const)
- Mix library items with inline objects unnecessarily

---

## 🔗 Type Definitions

All guidance items use these interfaces from `@/types/guided-tools`:

```typescript
interface GuidanceTip {
  id: string
  icon: string
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
}

interface GuidanceWarning {
  id: string
  type: 'warning' | 'error' | 'info'
  title: string
  content: string
  severity: 'low' | 'medium' | 'high'
}

interface BestPractice {
  id: string
  practice: string
  rationale: string
  example?: string
  source?: string
}

interface CommonMistake {
  id: string
  mistake: string
  whyItsWrong: string
  correction: string
}

interface GuidanceResource {
  id: string
  type: 'article' | 'video' | 'book' | 'course' | 'tool' | 'template' | 'document'
  title: string
  description: string
  url?: string
}
```

---

## 📞 Need Help?

1. **Check the Plan**: `docs/4-features/guided-tools/CENTRALIZED_GUIDANCE_LIBRARY_PLAN.md`
2. **Check the Implementation Summary**: `docs/4-features/guided-tools/CENTRALIZED_GUIDANCE_IMPLEMENTATION_COMPLETE.md`
3. **Check Examples**: Look at `five-why-config.ts` or `fishbone-config.ts`
4. **Search the Library**: Use search functions to find what you need

---

*Last updated: October 3, 2025*
