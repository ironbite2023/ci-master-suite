# Guided Tools Migration - Error Prevention Checklist

**Purpose**: Comprehensive checklist to prevent errors during tool migrations  
**Based On**: 70+ fixes from five-why-config.ts + fishbone/A3 patterns  
**Status**: Production-Ready Reference  
**Last Updated**: October 3, 2025

---

## 📋 **OVERVIEW**

This checklist prevents the **20 error patterns** discovered during tool migrations. Following this guide will reduce migration time from **2-3 days of debugging to 2-3 hours of clean implementation**.

**Print this. Pin it. Reference it for EVERY tool migration.**

---

## ⚠️ **TOP 10 MOST COMMON ERRORS TO AVOID**

### 1. **Missing Required Tool-Level Properties**
```typescript
✅ REQUIRED at tool level:
- id: string
- name: string
- description: string
- category: 'continuous-improvement' | 'six-sigma' | 'lean'
- difficulty: 'beginner' | 'intermediate' | 'advanced'
- estimatedTime: string
- icon: string
- version: string
- lastUpdated: string              // ⚠️ Often forgotten!
- objectives: string[]              // ⚠️ Often forgotten!
- prerequisites: string[]           // ⚠️ Often forgotten!
- tags: string[]
- relatedTools: string[]
- introduction: IntroductionSection
- steps: StepConfiguration[]
- completionCriteria: CompletionCriteria
- nextSteps: NextStep[]
```

---

### 2. **Every Question MUST Have These Properties**
```typescript
✅ REQUIRED for every question:
- id: string
- order: number                     // ⚠️ DO NOT FORGET!
- text: string
- type: QuestionType
- required: boolean
- validation: QuestionValidation[]  // ⚠️ MUST be array, not object!
- inputConfig: InputConfiguration

❌ NEVER use:
- rows: number                      // Not in InputConfiguration
- labels: {...}                     // Not in InputConfiguration
```

**CHECK EVERY QUESTION FOR:**
- [ ] Has `order` property (sequential: 1, 2, 3...)
- [ ] Has `validation` array (even if empty: `[]`)
- [ ] Has `inputConfig` object (even if empty: `{}`)

---

### 3. **Validation Structure (CRITICAL)**
```typescript
❌ WRONG:
validation: {
  required: true,
  minLength: 15,
  maxLength: 300
}

✅ CORRECT:
validation: [
  {
    type: 'required',
    errorMessage: 'This field is required.'
  },
  {
    type: 'min',
    value: 15,
    errorMessage: 'Minimum 15 characters required.'
  },
  {
    type: 'max',
    value: 300,
    errorMessage: 'Maximum 300 characters allowed.'
  }
]
```

**VALIDATION RULES:**
- [ ] Always use array format `[]`
- [ ] Each rule must have `type` and `errorMessage`
- [ ] Use `value` property for min/max, not as property name
- [ ] User-friendly error messages

---

### 4. **Hints Structure (NEW FORMAT)**
```typescript
❌ OLD FORMAT (DO NOT USE):
hints: [{
  id: 'hint-1',
  title: 'Title',
  content: 'Content',
  icon: '🎯',                        // ❌ Remove icon
  triggerCondition: { showOnLoad: true }  // ❌ Old structure
}]

✅ NEW FORMAT:
hints: [{
  id: 'hint-1',
  trigger: 'auto',                   // ✅ 'auto' | 'hover' | 'button' | 'after-delay'
  title: 'Title',
  content: 'Content',
  type: 'tip'                        // ✅ 'tip' | 'warning' | 'info' | 'best-practice'
}]
```

**HINT CHECKLIST:**
- [ ] Use `trigger` not `triggerCondition`
- [ ] Add `type` property
- [ ] Remove `icon` property
- [ ] Valid trigger values: `'auto'`, `'hover'`, `'button'`, `'after-delay'`

---

### 5. **Examples Must Have ALL Required Properties**
```typescript
✅ REQUIRED for every example:
{
  id: string
  title: string
  description: string
  value: unknown
  scenario: string                   // ⚠️ REQUIRED! Often forgotten!
  useCase: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  industry?: string                  // Optional
  isTemplate?: boolean               // Optional
}
```

**EXAMPLE CHECKLIST:**
- [ ] Every example has `scenario` property
- [ ] `difficulty` matches type exactly (no typos)
- [ ] `value` is appropriate for question type

---

### 6. **StepGuidance Structure (ALL Arrays Required)**
```typescript
✅ REQUIRED - ALL properties must exist:
guidance: {
  introduction: string,
  tips: GuidanceTip[],              // Can be empty []
  warnings: GuidanceWarning[],       // Can be empty []
  bestPractices: BestPractice[],     // Can be empty []
  commonMistakes: CommonMistake[],   // ⚠️ Can be empty [], but MUST exist!
  resources: GuidanceResource[],     // ⚠️ Can be empty [], but MUST exist!
  relatedConcepts?: RelatedConcept[] // Optional
}
```

**GUIDANCE CHECKLIST:**
- [ ] All 6 required arrays present (even if empty)
- [ ] `introduction` is a string, not array
- [ ] Each array contains properly structured objects

---

### 7. **GuidanceTip Structure**
```typescript
❌ WRONG property names:
{
  id: string,
  title: string,
  content: string,
  importance: 'high',                // ❌ Wrong property name
  icon: string
}

✅ CORRECT:
{
  id: string,
  icon: string,                      // ✅ Icon IS allowed in tips
  title: string,
  content: string,
  priority: 'high' | 'medium' | 'low', // ✅ Use 'priority' not 'importance'
  audience?: 'beginner' | 'intermediate' | 'advanced' | 'all'
}
```

---

### 8. **GuidanceWarning Structure**
```typescript
❌ WRONG:
{
  id: string,
  title: string,
  content: string,
  severity: 'high',
  icon: '⚠️'                         // ❌ NOT allowed in warnings
}

✅ CORRECT:
{
  id: string,
  type: 'warning' | 'error' | 'info', // ⚠️ REQUIRED!
  title: string,
  content: string,
  severity: 'high' | 'medium' | 'low'
  // NO icon property
}
```

---

### 9. **BestPractice Structure**
```typescript
❌ WRONG property names:
{
  id: string,
  title: 'Practice Name',            // ❌ Wrong
  description: 'Why it works',       // ❌ Wrong
  example?: string,
  benefit: 'What you gain'           // ❌ Wrong
}

✅ CORRECT:
{
  id: string,
  practice: 'Practice Name',         // ✅ Use 'practice'
  rationale: 'Why it works',         // ✅ Use 'rationale'
  example?: string,
  source?: string
  // NO 'benefit' property - merge into rationale
}
```

---

### 10. **Step-Level Properties (Not in Validation)**
```typescript
❌ WRONG - allowSkip inside validation:
validation: {
  requiredQuestions: ['q1', 'q2'],
  allowSkip: false                   // ❌ Wrong location
}

✅ CORRECT - allowSkip at step level:
validation: {
  requiredQuestions: ['q1', 'q2']
},
allowSkip: false                     // ✅ Step level
```

---

## 🔍 **COMPREHENSIVE PROPERTY CHECKLIST**

### **Tool Level (Root Configuration)**
```typescript
- [ ] id (string)
- [ ] name (string)
- [ ] description (string)
- [ ] category (enum)
- [ ] difficulty (enum)
- [ ] estimatedTime (string)
- [ ] icon (string)
- [ ] version (string)
- [ ] lastUpdated (string)
- [ ] objectives (array of strings)
- [ ] prerequisites (array of strings)
- [ ] tags (array of strings)
- [ ] relatedTools (array of strings)
- [ ] introduction (object)
- [ ] steps (array)
- [ ] completionCriteria (object)
- [ ] nextSteps (array)
```

---

### **Introduction Section**
```typescript
- [ ] title (string)
- [ ] overview (string)
- [ ] estimatedTime (string)
- [ ] whenToUse (array of strings)
- [ ] whatYouWillNeed (array of strings)
- [ ] expectedOutcomes (array of strings)
- [ ] videoUrl? (optional string)
```

---

### **Step Configuration**
```typescript
- [ ] id (string)
- [ ] stepNumber (number)
- [ ] title (string)
- [ ] description (string)
- [ ] questions (array)
- [ ] guidance (object - all 6 arrays)
- [ ] validation (object with requiredQuestions)
- [ ] optional? (boolean, optional)
- [ ] allowSkip? (boolean, optional)
- [ ] icon? (string, optional)
```

---

### **Question Configuration**
```typescript
- [ ] id (string)
- [ ] order (number) ⚠️
- [ ] text (string)
- [ ] type (QuestionType enum)
- [ ] required (boolean)
- [ ] validation (array) ⚠️
- [ ] inputConfig (object)
- [ ] helpText? (optional)
- [ ] placeholder? (optional)
- [ ] hints? (optional array)
- [ ] examples? (optional array)
- [ ] conditionalLogic? (optional array)
```

---

### **InputConfiguration Valid Properties**
```typescript
✅ ALLOWED:
- minLength, maxLength, pattern (text)
- min, max, step, unit (number)
- options, allowCustom (select)
- columns, minRows, maxRows (table)
- acceptedFileTypes, maxFileSize (file)
- defaultValue, prefix, suffix, format

❌ NOT ALLOWED:
- rows (removed from interface)
- labels (removed from interface)
```

---

### **CompletionCriteria**
```typescript
❌ WRONG property names:
{
  minimumSteps: 7,                   // ❌ Wrong
  requiredFields: ['field1']         // ❌ Wrong
}

✅ CORRECT:
{
  allStepsCompleted: boolean,
  requiredSteps: string[],           // Step IDs
  optionalSteps: string[],           // Step IDs
  minimumQuestionsAnswered?: number,
  qualityChecks?: QualityCheck[]
}
```

---

### **QualityCheck Structure**
```typescript
❌ WRONG:
{
  id: string,
  title: 'Check Name',               // ❌ No title
  description: string,
  autoCheck: boolean,                // ❌ No autoCheck
  required: boolean                  // ❌ No required
}

✅ CORRECT:
{
  id: string,
  description: string,
  checkFunction: (data) => boolean,  // ⚠️ Required function
  importance: 'critical' | 'important' | 'suggested'
}
```

---

### **NextStep Structure**
```typescript
- [ ] id (string)
- [ ] title (string)
- [ ] description (string)
- [ ] type ('tool' | 'action' | 'learning') ⚠️ REQUIRED!
- [ ] route? (optional string)
- [ ] priority ('recommended' | 'optional')
```

---

### **ConditionalLogic Structure**
```typescript
❌ WRONG (old format):
conditionalLogic: {
  showIf: {
    questionId: 'q1',
    operator: 'lessThan',           // ❌ Wrong format
    value: 7
  }
}

✅ CORRECT (new format):
conditionalLogic: [{
  condition: {
    questionId: 'q1',
    operator: 'less-than',          // ✅ Use kebab-case
    value: 7
  },
  action: 'show'                    // ⚠️ Required!
}]
```

---

## 🚫 **NEVER DO THESE**

### **1. Invalid Property Names**
```typescript
❌ NEVER USE:
- rows (in inputConfig)
- labels (in inputConfig)
- triggerCondition (in hints)
- icon (in warnings)
- importance (use 'priority')
- title (in BestPractice, use 'practice')
- description (in BestPractice, use 'rationale')
- benefit (in BestPractice, merge to 'rationale')
- minimumSteps (in completionCriteria, use 'requiredSteps')
- requiredFields (in completionCriteria, use 'requiredSteps')
- autoCheck (in QualityCheck)
- required (in QualityCheck)
- resources (at tool level - only in step guidance)
```

---

### **2. Wrong Nesting**
```typescript
❌ WRONG:
validation: {
  requiredQuestions: ['q1'],
  allowSkip: false                  // ❌ allowSkip is step-level
}

step: {
  guidance: {
    tips: [...],
    resources: [...]                // ✅ Correct - in guidance
  }
},
resources: [...]                    // ❌ Wrong - not at tool level
```

---

### **3. Object Instead of Array**
```typescript
❌ ALWAYS ARRAYS:
- validation (must be array, not object)
- hints (must be array)
- examples (must be array)
- conditionalLogic (must be array)
- tips, warnings, bestPractices, commonMistakes, resources (all arrays)
```

---

## ✅ **PRE-MIGRATION CHECKLIST**

### **Before You Start Coding**
- [ ] Read the task file completely (e.g., TASK_PDCA_CYCLE.md)
- [ ] Review reference configs: fishbone-config.ts, five-why-config.ts, a3-config.ts
- [ ] Have guided-tools.ts types open for reference
- [ ] Have guidance library quick reference available
- [ ] Plan your step structure on paper first
- [ ] Map old fields to new questions

---

### **During Configuration Writing**
- [ ] Use a reference config as template (copy structure)
- [ ] Add properties in correct order (id, order, text, type, required...)
- [ ] Every question gets `order`, `validation`, `inputConfig`
- [ ] Every step gets complete `guidance` object (all 6 arrays)
- [ ] Every example gets `scenario` property
- [ ] All hints use new format (trigger + type)
- [ ] Test build after completing each step (catch errors early)

---

### **After Configuration Complete**
- [ ] Run `npm run build` - fix ALL TypeScript errors
- [ ] Search for: `rows:`, `labels:`, `triggerCondition`, `importance:`
- [ ] Verify all questions have `order` property
- [ ] Verify all questions have `validation` array
- [ ] Verify all examples have `scenario` property
- [ ] Check step guidance has all 6 required arrays
- [ ] Verify CompletionCriteria structure
- [ ] Verify NextStep objects have `type` property

---

## 🔧 **QUICK VERIFICATION COMMANDS**

```bash
# Search for problematic patterns
grep -n "rows:" src/config/tools/your-tool-config.ts
grep -n "labels:" src/config/tools/your-tool-config.ts
grep -n "triggerCondition" src/config/tools/your-tool-config.ts
grep -n "importance:" src/config/tools/your-tool-config.ts
grep -n "icon:" src/config/tools/your-tool-config.ts | grep "warning\|bestPractice"

# Build test
npm run build

# Type check only
npx tsc --noEmit
```

---

## 📊 **ERROR PROBABILITY BY SECTION**

Based on the 70+ fixes we made in five-why-config.ts:

| Section | Error Probability | Most Common Errors |
|---------|-------------------|-------------------|
| **Question Properties** | 🔴 VERY HIGH | Missing `order`, validation as object |
| **Hints** | 🔴 VERY HIGH | Old structure, missing type |
| **Examples** | 🟡 MEDIUM | Missing `scenario` |
| **Guidance** | 🟡 MEDIUM | Missing required arrays |
| **Tool Metadata** | 🟢 LOW | Usually copied correctly |
| **Introduction** | 🟢 LOW | Straightforward structure |

---

## 💾 **SAVE TIME: USE THESE TEMPLATES**

### **Safe Question Template**
```typescript
// SAFE QUESTION TEMPLATE - Copy this for every question
{
  id: 'question_id',
  order: 1,  // ⚠️ Sequential
  text: 'Question text?',
  type: 'long-text',
  required: true,
  helpText: 'Help text here',
  placeholder: 'Example: ...',
  
  hints: [],  // Add hints using NEW format
  examples: [],  // Each must have 'scenario'
  
  validation: [  // ⚠️ Always array
    {
      type: 'required',
      errorMessage: 'This field is required.'
    }
  ],
  
  inputConfig: {
    maxLength: 500
    // NO rows, NO labels
  }
}
```

### **Safe Step Guidance Template**
```typescript
// SAFE STEP GUIDANCE TEMPLATE
guidance: {
  introduction: 'Step introduction text',
  tips: [],  // GuidanceTip objects
  warnings: [],  // Must have 'type' property
  bestPractices: [],  // Use 'practice' and 'rationale'
  commonMistakes: [],  // ⚠️ Required even if empty
  resources: []  // ⚠️ Required even if empty
}
```

### **Safe Step Validation Template**
```typescript
// SAFE STEP VALIDATION TEMPLATE
validation: {
  requiredQuestions: ['question_id_1', 'question_id_2']
},
allowSkip: false  // At step level, not in validation
```

---

## 🎯 **FINAL PRE-FLIGHT CHECK**

Before marking tool as complete:

### **Build & Type Check**
- [ ] `npm run build` succeeds with ZERO errors
- [ ] No TypeScript red squiggles in IDE
- [ ] No linter warnings for the config file

### **Structure Validation**
- [ ] All questions have sequential `order` (1, 2, 3...)
- [ ] All questions have `validation` array
- [ ] All questions have `inputConfig` object
- [ ] All hints use new format (trigger, type)
- [ ] All examples have `scenario` property
- [ ] All step guidance has 6 required arrays
- [ ] No invalid properties (rows, labels, triggerCondition, etc.)

### **Content Quality**
- [ ] Error messages are user-friendly
- [ ] Help text is clear and helpful
- [ ] Examples are realistic and diverse
- [ ] Guidance is relevant to each step

---

## 📚 **REFERENCE FILES**

### **Use These as Templates (In Priority Order)**
1. ✅ `src/config/tools/fishbone-config.ts` - PERFECT structure
2. ✅ `src/config/tools/five-why-config.ts` - PERFECT (after 70+ fixes)
3. ✅ `src/config/tools/continuous-improvement/a3-problem-solving-config.ts` - Recent

### **Type Definitions**
- `src/types/guided-tools.ts` - THE source of truth for all interfaces

### **Guidance Library**
- `src/lib/guidance/index.ts` - All 131 available guidance items
- `docs/4-features/guided-tools/GUIDANCE_LIBRARY_QUICK_REFERENCE.md` - Quick reference

---

## 🎉 **SUCCESS INDICATORS**

You've done it right when:
- ✅ Build completes in < 5 seconds
- ✅ ZERO TypeScript errors
- ✅ ZERO linter warnings  
- ✅ Tool loads in browser without errors
- ✅ All steps navigate smoothly
- ✅ Validation works correctly
- ✅ Hints display properly
- ✅ Examples load correctly
- ✅ AI Coach integration works
- ✅ Auto-save functions
- ✅ Completion flow works

---

## 📋 **SUMMARY: THE 20 ERROR PATTERNS**

Based on actual fixes made to five-why-config.ts:

| # | Error Pattern | Instances | Fix |
|---|---------------|-----------|-----|
| 1 | Invalid `rows` property | 10 | Remove all `rows:` from inputConfig |
| 2 | Misplaced `allowSkip` | 7 | Move to step level from validation |
| 3 | Missing `scenario` property | 8 | Add to all examples |
| 4 | Missing `validation` arrays | 6 | Add empty array to all questions |
| 5 | `importance` → `priority` | 10 | Rename in all GuidanceTip objects |
| 6 | Invalid `GuidanceWarning` props | 5 | Add `type`, remove `icon` |
| 7 | Invalid `BestPractice` props | 4 | Use `practice`/`rationale` |
| 8 | Missing `StepGuidance` arrays | 6 | Add empty `commonMistakes`/`resources` |
| 9 | Invalid `labels` property | 1 | Remove from inputConfig |
| 10 | Missing `order` properties | 8 | Add sequential order to questions |
| 11 | Wrong `conditionalLogic` | 1 | Convert to array with `condition`/`action` |
| 12 | Missing `scenario` (more) | 2 | Add to countermeasure examples |
| 13 | Missing `order` (Step 7) | 5 | Add to all Step 7 questions |
| 14 | Missing `validation` (Step 7) | 4 | Add arrays to Step 7 questions |
| 15 | Invalid resource type | 1 | Use `'template'` not `'document'` |
| 16 | Missing `commonMistakes` | 1 | Add to Step 7 guidance |
| 17 | Wrong `QualityCheck` props | 2 | Use `checkFunction`/`importance` |
| 18 | Invalid `CompletionCriteria` | 1 | Use `requiredSteps`/`optionalSteps` |
| 19 | Missing `type` in `NextStep` | 3 | Add `type: 'tool'` to all nextSteps |
| 20 | Invalid tool-level `resources` | 1 | Remove (only in step guidance) |

**Total Fixes:** 70+ individual changes across 20 error patterns

---

## 🚀 **TIME SAVINGS**

With this checklist:
- **Without checklist:** 2-3 days debugging per tool
- **With checklist:** 2-3 hours clean implementation per tool
- **Time saved:** 80-90% reduction in debugging time
- **Quality improvement:** Zero-error migrations

---

## 📞 **NEED HELP?**

If you encounter an error not covered here:
1. Check `src/types/guided-tools.ts` for the exact interface definition
2. Compare your code to `fishbone-config.ts` (perfect reference)
3. Run `npm run build` to see exact error location
4. Search this document for the property name causing issues

---

**Last Updated:** October 3, 2025  
**Version:** 1.0  
**Based On:** Five Why, Fishbone, A3 migrations  
**Status:** Production-Ready

---

**🎯 Remember: Following this checklist will save you HOURS of debugging time!**

**Print this. Pin it. Reference it for EVERY tool migration.**

