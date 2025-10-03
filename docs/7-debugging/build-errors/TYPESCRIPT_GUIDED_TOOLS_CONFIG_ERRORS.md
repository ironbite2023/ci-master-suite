# TypeScript Guided Tools Configuration Errors

**Category**: Build Errors  
**Severity**: Critical (Blocks Build)  
**Affected Files**: `src/config/tools/*.ts`  
**Type Definitions**: `src/types/guided-tools.ts`  
**Last Updated**: October 3, 2025

---

## 🚨 **OVERVIEW**

TypeScript configuration errors occur when tool configuration files don't match the `ToolConfiguration` interface. These errors **block the build** and must be fixed before deployment.

**Common Scenario:**
```bash
npm run build
# Error: Type error: Type 'X' is not assignable to type 'Y'
# Location: src/config/tools/your-tool-config.ts:123
```

---

## 📊 **ERROR STATISTICS**

Based on five-why-config.ts migration:
- **Total Error Patterns:** 20 distinct types
- **Total Individual Fixes:** 70+ changes
- **Time to Debug (without guide):** 2-3 days
- **Time to Fix (with guide):** 2-3 hours
- **Success Rate:** 100% when following checklist

---

## 🔴 **THE 20 ERROR PATTERNS**

### **ERROR #1: Invalid `rows` Property in InputConfiguration**

**Error Message:**
```
Type error: Object literal may only specify known properties, 
and 'rows' does not exist in type 'InputConfiguration'.
```

**Location:** Question `inputConfig` objects

**Why It Happens:**
The `rows` property was removed from `InputConfiguration` interface but is still used in old configs.

**❌ WRONG:**
```typescript
inputConfig: {
  maxLength: 500,
  rows: 4  // ❌ Property doesn't exist
}
```

**✅ CORRECT:**
```typescript
inputConfig: {
  maxLength: 500
  // NO rows property
}
```

**How to Fix:**
1. Search for `rows:` in your config file
2. Delete all occurrences
3. Component handles text area sizing automatically

**Instances in five-why-config.ts:** 10

---

### **ERROR #2: Misplaced `allowSkip` Property**

**Error Message:**
```
Type error: Object literal may only specify known properties, 
and 'allowSkip' does not exist in type 'StepValidation'.
```

**Location:** Inside `validation` object (wrong location)

**Why It Happens:**
`allowSkip` is a `StepConfiguration` property, not a `StepValidation` property.

**❌ WRONG:**
```typescript
validation: {
  requiredQuestions: ['q1', 'q2'],
  allowSkip: false  // ❌ Wrong nesting level
}
```

**✅ CORRECT:**
```typescript
validation: {
  requiredQuestions: ['q1', 'q2']
},
allowSkip: false  // ✅ At step level
```

**How to Fix:**
1. Find all `allowSkip` inside `validation` objects
2. Move to same level as `validation` (step level)
3. Keep the same value

**Instances in five-why-config.ts:** 7

---

### **ERROR #3: Missing `scenario` Property in QuestionExample**

**Error Message:**
```
Type error: Property 'scenario' is missing in type 
'{ id: string; title: string; ... }' but required in type 'QuestionExample'.
```

**Location:** Example objects in `examples` arrays

**Why It Happens:**
`scenario` is a required property but often forgotten when creating examples.

**❌ WRONG:**
```typescript
{
  id: 'ex-1',
  title: 'Manufacturing Example',
  description: 'Quality issue',
  value: 'Defective parts found...',
  // ❌ Missing scenario
  useCase: 'Quality control',
  difficulty: 'intermediate'
}
```

**✅ CORRECT:**
```typescript
{
  id: 'ex-1',
  title: 'Manufacturing Example',
  description: 'Quality issue',
  value: 'Defective parts found...',
  scenario: 'Increased defect rate in assembly line',  // ✅ Added
  useCase: 'Quality control',
  difficulty: 'intermediate'
}
```

**How to Fix:**
1. Search for all `examples` arrays
2. Add `scenario` property to each example
3. Make it contextual and specific

**Instances in five-why-config.ts:** 8

---

### **ERROR #4: Missing `validation` Property in QuestionConfiguration**

**Error Message:**
```
Type error: Property 'validation' is missing in type 
'{ id: string; order: number; ... }' but required in type 'QuestionConfiguration'.
```

**Location:** Question objects

**Why It Happens:**
Every question MUST have a `validation` array, even if empty.

**❌ WRONG:**
```typescript
{
  id: 'my_question',
  order: 1,
  text: 'Enter your answer',
  type: 'long-text',
  required: false,
  inputConfig: {}
  // ❌ Missing validation array
}
```

**✅ CORRECT:**
```typescript
{
  id: 'my_question',
  order: 1,
  text: 'Enter your answer',
  type: 'long-text',
  required: false,
  validation: [],  // ✅ Empty array if no validation rules
  inputConfig: {}
}
```

**How to Fix:**
1. Check all question objects
2. Add `validation: []` if missing
3. Add validation rules if needed

**Instances in five-why-config.ts:** 6

---

### **ERROR #5: Wrong Property Name (`importance` vs `priority`) in GuidanceTip**

**Error Message:**
```
Type error: Object literal may only specify known properties, 
and 'importance' does not exist in type 'GuidanceTip'.
```

**Location:** Tip objects in `guidance.tips` arrays

**Why It Happens:**
Interface defines `priority`, but `importance` was used instead.

**❌ WRONG:**
```typescript
{
  id: 'tip-1',
  icon: '💡',
  title: 'Pro Tip',
  content: 'Always verify...',
  importance: 'high'  // ❌ Wrong property name
}
```

**✅ CORRECT:**
```typescript
{
  id: 'tip-1',
  icon: '💡',
  title: 'Pro Tip',
  content: 'Always verify...',
  priority: 'high'  // ✅ Correct property name
}
```

**How to Fix:**
1. Search for `importance:` in tip objects
2. Replace with `priority:`
3. Keep same value ('high' | 'medium' | 'low')

**Instances in five-why-config.ts:** 10

---

### **ERROR #6: Invalid Properties in GuidanceWarning**

**Error Message:**
```
Type error: Object literal may only specify known properties, 
and 'icon' does not exist in type 'GuidanceWarning'.
```

**Location:** Warning objects in `guidance.warnings` arrays

**Why It Happens:**
- `GuidanceWarning` requires `type` property
- `GuidanceWarning` does NOT allow `icon` property (unlike tips)

**❌ WRONG:**
```typescript
{
  id: 'warn-1',
  title: 'Warning',
  content: 'Avoid this...',
  severity: 'high',
  icon: '⚠️'  // ❌ Not allowed in warnings
  // ❌ Missing 'type' property
}
```

**✅ CORRECT:**
```typescript
{
  id: 'warn-1',
  type: 'warning',  // ✅ Required
  title: 'Warning',
  content: 'Avoid this...',
  severity: 'high'
  // NO icon property
}
```

**How to Fix:**
1. Add `type: 'warning'` to all warning objects
2. Remove `icon` property
3. Keep `severity`, `title`, `content`

**Instances in five-why-config.ts:** 5

---

### **ERROR #7: Wrong Properties in BestPractice**

**Error Message:**
```
Type error: Object literal may only specify known properties, 
and 'title' does not exist in type 'BestPractice'.
```

**Location:** Best practice objects in `guidance.bestPractices` arrays

**Why It Happens:**
Interface uses different property names: `practice` and `rationale` instead of `title`, `description`, `benefit`.

**❌ WRONG:**
```typescript
{
  id: 'bp-1',
  title: 'Verify Root Cause',  // ❌ Wrong property
  description: 'Always check...',  // ❌ Wrong property
  benefit: 'Ensures accuracy',  // ❌ Wrong property
  example: 'For instance...'
}
```

**✅ CORRECT:**
```typescript
{
  id: 'bp-1',
  practice: 'Verify Root Cause',  // ✅ Use 'practice'
  rationale: 'Always check... Ensures accuracy',  // ✅ Combine into 'rationale'
  example: 'For instance...'
}
```

**How to Fix:**
1. Change `title` → `practice`
2. Merge `description` + `benefit` → `rationale`
3. Keep `example` as is

**Instances in five-why-config.ts:** 4

---

### **ERROR #8: Missing Required Arrays in StepGuidance**

**Error Message:**
```
Type error: Property 'commonMistakes' is missing in type 
'{ introduction: string; tips: ...; }' but required in type 'StepGuidance'.
```

**Location:** `guidance` objects in step configurations

**Why It Happens:**
`StepGuidance` requires ALL arrays to exist, even if empty.

**❌ WRONG:**
```typescript
guidance: {
  introduction: 'Step intro...',
  tips: [...],
  warnings: [...],
  bestPractices: [...]
  // ❌ Missing commonMistakes and resources
}
```

**✅ CORRECT:**
```typescript
guidance: {
  introduction: 'Step intro...',
  tips: [...],
  warnings: [...],
  bestPractices: [...],
  commonMistakes: [],  // ✅ Required even if empty
  resources: []  // ✅ Required even if empty
}
```

**How to Fix:**
1. Check all `guidance` objects
2. Add empty arrays for missing properties:
   - `commonMistakes: []`
   - `resources: []`
3. Populate later if needed

**Instances in five-why-config.ts:** 6

---

### **ERROR #9: Invalid `labels` Property in InputConfiguration**

**Error Message:**
```
Type error: Object literal may only specify known properties, 
and 'labels' does not exist in type 'InputConfiguration'.
```

**Location:** Scale/rating question `inputConfig`

**Why It Happens:**
`labels` property was removed from interface (handled by component).

**❌ WRONG:**
```typescript
{
  type: 'scale',
  inputConfig: {
    min: 1,
    max: 10,
    step: 1,
    labels: {  // ❌ Not in interface
      min: 'Not Confident',
      max: 'Very Confident'
    }
  }
}
```

**✅ CORRECT:**
```typescript
{
  type: 'scale',
  inputConfig: {
    min: 1,
    max: 10,
    step: 1
    // NO labels property
  }
}
```

**How to Fix:**
1. Find scale/rating questions
2. Remove `labels` object from `inputConfig`
3. Component handles labels automatically

**Instances in five-why-config.ts:** 1

---

### **ERROR #10: Missing `order` Property in QuestionConfiguration**

**Error Message:**
```
Type error: Property 'order' is missing in type 
'{ id: string; text: string; ... }' but required in type 'QuestionConfiguration'.
```

**Location:** Question objects

**Why It Happens:**
Every question MUST have an `order` property for sequential display.

**❌ WRONG:**
```typescript
{
  id: 'question_1',
  // ❌ Missing order property
  text: 'What is the problem?',
  type: 'long-text',
  required: true,
  validation: [],
  inputConfig: {}
}
```

**✅ CORRECT:**
```typescript
{
  id: 'question_1',
  order: 1,  // ✅ Sequential number
  text: 'What is the problem?',
  type: 'long-text',
  required: true,
  validation: [],
  inputConfig: {}
}
```

**How to Fix:**
1. Check all questions in all steps
2. Add `order` property with sequential numbers (1, 2, 3...)
3. Ensure no gaps or duplicates

**Instances in five-why-config.ts:** 8

---

### **ERROR #11: Wrong ConditionalLogic Structure**

**Error Message:**
```
Type error: Type '{ showIf: { ... } }' is not assignable to type 'ConditionalLogic[]'.
```

**Location:** Question `conditionalLogic` property

**Why It Happens:**
- Must be an array, not object
- Must have `condition` and `action` properties

**❌ WRONG:**
```typescript
conditionalLogic: {
  showIf: {
    questionId: 'root_cause_confidence',
    operator: 'lessThan',
    value: 7
  }
}
```

**✅ CORRECT:**
```typescript
conditionalLogic: [{
  condition: {
    questionId: 'root_cause_confidence',
    operator: 'less-than',  // Use kebab-case
    value: 7
  },
  action: 'show'  // Required property
}]
```

**How to Fix:**
1. Wrap in array `[...]`
2. Change `showIf` → `condition`
3. Add `action: 'show'` or `action: 'hide'`
4. Use kebab-case for operators

**Instances in five-why-config.ts:** 1

---

### **ERROR #12-14: Multiple Missing Properties in Step 7**

**Error Messages:**
- Missing `order` in questions
- Missing `validation` arrays
- Missing `commonMistakes` in guidance

**Location:** Step 7 (Countermeasures) questions and guidance

**Why It Happens:**
Copy-paste errors when creating later steps.

**✅ FIX:**
```typescript
// Add to each question:
order: 1,  // Sequential
validation: [],  // Even if empty

// Add to step guidance:
commonMistakes: []  // Even if empty
```

**Instances in five-why-config.ts:** 10 combined

---

### **ERROR #15: Invalid Resource Type**

**Error Message:**
```
Type error: Type '"document"' is not assignable to type 
'"article" | "template" | "video" | "case-study" | "book" | "tool"'.
```

**Location:** `GuidanceResource` objects

**Why It Happens:**
`'document'` is not a valid type in the enum.

**❌ WRONG:**
```typescript
{
  id: 'res-1',
  title: 'Action Plan Template',
  description: 'Template for...',
  type: 'document',  // ❌ Invalid type
  url: '/templates/action-plan.pdf'
}
```

**✅ CORRECT:**
```typescript
{
  id: 'res-1',
  title: 'Action Plan Template',
  description: 'Template for...',
  type: 'template',  // ✅ Valid type
  url: '/templates/action-plan.pdf'
}
```

**Valid Types:**
- `'article'`
- `'template'`
- `'video'`
- `'case-study'`
- `'book'`
- `'tool'`

**Instances in five-why-config.ts:** 1

---

### **ERROR #16: Wrong QualityCheck Properties**

**Error Message:**
```
Type error: Object literal may only specify known properties, 
and 'title' does not exist in type 'QualityCheck'.
```

**Location:** `completionCriteria.qualityChecks` array

**Why It Happens:**
Interface changed from declarative to functional structure.

**❌ WRONG:**
```typescript
{
  id: 'check-1',
  title: 'Verify Root Cause',  // ❌ Wrong property
  description: 'Is this the real root cause?',
  autoCheck: false,  // ❌ Not in interface
  required: true  // ❌ Not in interface
}
```

**✅ CORRECT:**
```typescript
{
  id: 'check-1',
  description: 'Is this the real root cause?',
  checkFunction: (data) => {
    // Return true if check passes
    return true;
  },
  importance: 'critical'  // 'critical' | 'important' | 'suggested'
}
```

**How to Fix:**
1. Remove `title`, `autoCheck`, `required`
2. Add `checkFunction: (data) => boolean`
3. Add `importance` with valid value

**Instances in five-why-config.ts:** 2

---

### **ERROR #17: Invalid CompletionCriteria Properties**

**Error Message:**
```
Type error: Object literal may only specify known properties, 
and 'minimumSteps' does not exist in type 'CompletionCriteria'.
```

**Location:** Top-level `completionCriteria` object

**Why It Happens:**
Property names changed in interface.

**❌ WRONG:**
```typescript
completionCriteria: {
  minimumSteps: 7,  // ❌ Wrong property
  requiredFields: [  // ❌ Wrong property
    'problem_statement',
    'root_cause'
  ]
}
```

**✅ CORRECT:**
```typescript
completionCriteria: {
  allStepsCompleted: false,  // Boolean flag
  requiredSteps: [  // Step IDs
    'problem-statement',
    'first-why',
    'analysis',
    // ... all step IDs
  ],
  optionalSteps: []  // Step IDs that are optional
}
```

**How to Fix:**
1. Change `minimumSteps` → `allStepsCompleted: false`
2. Change `requiredFields` → `requiredSteps` (use step IDs)
3. Add `optionalSteps: []`

**Instances in five-why-config.ts:** 1

---

### **ERROR #18: Missing `type` in NextStep**

**Error Message:**
```
Type error: Property 'type' is missing in type 
'{ id: string; title: string; ... }' but required in type 'NextStep'.
```

**Location:** `nextSteps` array

**Why It Happens:**
`type` is a required property often forgotten.

**❌ WRONG:**
```typescript
{
  id: 'next-fishbone',
  title: 'Fishbone Diagram',
  description: 'Visualize your analysis',
  route: '/tools/fishbone',
  priority: 'recommended'
  // ❌ Missing type
}
```

**✅ CORRECT:**
```typescript
{
  id: 'next-fishbone',
  title: 'Fishbone Diagram',
  description: 'Visualize your analysis',
  type: 'tool',  // ✅ Required: 'tool' | 'action' | 'learning'
  route: '/tools/fishbone',
  priority: 'recommended'
}
```

**Valid Types:**
- `'tool'` - Link to another guided tool
- `'action'` - Action to take
- `'learning'` - Learning resource

**Instances in five-why-config.ts:** 3

---

### **ERROR #19: Tool-Level Resources Array**

**Error Message:**
```
Type error: Object literal may only specify known properties, 
and 'resources' does not exist in type 'ToolConfiguration'.
```

**Location:** Top-level of config (root level)

**Why It Happens:**
`resources` only belong in `StepGuidance`, not at tool level.

**❌ WRONG:**
```typescript
export const fiveWhyConfig: ToolConfiguration = {
  id: 'five-why',
  name: '5 Why Analysis',
  // ... other properties
  steps: [...],
  nextSteps: [...],
  resources: [  // ❌ Wrong location
    { id: 'res-1', ... }
  ]
}
```

**✅ CORRECT:**
```typescript
export const fiveWhyConfig: ToolConfiguration = {
  id: 'five-why',
  name: '5 Why Analysis',
  // ... other properties
  steps: [
    {
      id: 'step-1',
      // ...
      guidance: {
        introduction: '...',
        tips: [],
        warnings: [],
        bestPractices: [],
        commonMistakes: [],
        resources: [  // ✅ Inside step guidance
          { id: 'res-1', ... }
        ]
      }
    }
  ],
  nextSteps: [...]
  // NO resources at this level
}
```

**How to Fix:**
1. Remove `resources` array from tool level
2. Move resources to appropriate `step.guidance.resources`
3. Distribute to relevant steps

**Instances in five-why-config.ts:** 1

---

### **ERROR #20: Missing Tool-Level Metadata**

**Error Message:**
```
Type error: Property 'lastUpdated' is missing in type 
'{ id: string; name: string; ... }' but required in type 'ToolConfiguration'.
```

**Location:** Top-level of config

**Why It Happens:**
Tool-level metadata often forgotten when starting new config.

**❌ WRONG:**
```typescript
export const toolConfig: ToolConfiguration = {
  id: 'my-tool',
  name: 'My Tool',
  description: 'A great tool',
  category: 'continuous-improvement',
  difficulty: 'beginner',
  estimatedTime: '30-45 minutes',
  icon: '🔧',
  version: '1.0.0',
  // ❌ Missing: lastUpdated, objectives, prerequisites
  tags: [...],
  relatedTools: [...]
}
```

**✅ CORRECT:**
```typescript
export const toolConfig: ToolConfiguration = {
  id: 'my-tool',
  name: 'My Tool',
  description: 'A great tool',
  category: 'continuous-improvement',
  difficulty: 'beginner',
  estimatedTime: '30-45 minutes',
  icon: '🔧',
  version: '1.0.0',
  lastUpdated: '2025-01-15',  // ✅ ISO date format
  objectives: [  // ✅ What users will achieve
    'Identify root causes',
    'Develop solutions'
  ],
  prerequisites: [  // ✅ What users need before starting
    'Problem statement defined',
    'Basic knowledge of CI'
  ],
  tags: [...],
  relatedTools: [...]
}
```

**How to Fix:**
1. Add `lastUpdated` with ISO date
2. Add `objectives` array (3-5 items)
3. Add `prerequisites` array (2-4 items)

**Instances in five-why-config.ts:** 1 (discovered early)

---

## 🔧 **DIAGNOSTIC WORKFLOW**

### **Step 1: Run Build**
```bash
cd "C:\Users\user\OneDrive\Ironbite Buisness Documents\GitHub\CI Master"
npm run build
```

### **Step 2: Read Error Message**
```
> Build error occurred
Error: Type error: Property 'X' is missing in type 'Y'
  at src/config/tools/your-tool-config.ts:123:45
```

### **Step 3: Identify Error Pattern**
1. Note the property name mentioned
2. Note the type mentioned
3. Note the line number
4. Find matching error pattern above

### **Step 4: Fix Using Pattern Guide**
1. Read the "How to Fix" section
2. Apply the fix
3. Run build again
4. Repeat until clean

### **Step 5: Verify**
```bash
npm run build
# Should complete without errors
```

---

## 🎯 **PREVENTION CHECKLIST**

Use before starting ANY tool migration:

### **Tool Level**
- [ ] All metadata properties present (lastUpdated, objectives, prerequisites)
- [ ] Tags and relatedTools arrays exist
- [ ] NO resources array at tool level

### **Step Level**
- [ ] Every step has complete guidance object
- [ ] All 6 guidance arrays present (even if empty)
- [ ] allowSkip at step level, not in validation

### **Question Level**
- [ ] Every question has sequential `order`
- [ ] Every question has `validation` array
- [ ] Every question has `inputConfig` object
- [ ] NO `rows` or `labels` in inputConfig

### **Examples**
- [ ] Every example has `scenario` property
- [ ] Difficulty matches enum exactly

### **Hints**
- [ ] Use `trigger` not `triggerCondition`
- [ ] Every hint has `type` property
- [ ] NO `icon` property (removed)

### **Guidance Objects**
- [ ] Tips use `priority` not `importance`
- [ ] Warnings have `type` property, NO `icon`
- [ ] BestPractices use `practice` and `rationale`

### **Completion Criteria**
- [ ] Use `requiredSteps` not `minimumSteps`
- [ ] Use `requiredSteps`/`optionalSteps` not `requiredFields`
- [ ] QualityChecks use `checkFunction` and `importance`

### **Next Steps**
- [ ] Every NextStep has `type` property

---

## 📚 **QUICK REFERENCE**

### **Search Commands to Find Issues**
```bash
# Find invalid properties
grep -n "rows:" src/config/tools/your-tool.ts
grep -n "labels:" src/config/tools/your-tool.ts
grep -n "triggerCondition" src/config/tools/your-tool.ts
grep -n "importance:" src/config/tools/your-tool.ts
grep -n "icon:" src/config/tools/your-tool.ts | grep "warning"

# Verify structure
grep -n "validation:" src/config/tools/your-tool.ts
grep -n "order:" src/config/tools/your-tool.ts
grep -n "scenario:" src/config/tools/your-tool.ts
```

### **Type Check Only**
```bash
npx tsc --noEmit
```

---

## 🎓 **LEARNING FROM MISTAKES**

### **Most Time-Consuming Errors**
1. Missing `order` in many questions (tedious to add everywhere)
2. Converting all hints to new structure (repetitive)
3. Refactoring BestPractice properties (requires reading content)

### **Most Subtle Errors**
1. `allowSkip` in wrong location (looks right at first glance)
2. Missing `scenario` in examples (easy to overlook)
3. Missing empty arrays in guidance (assumes they're optional)

### **Easiest to Fix**
1. Property renames (importance → priority)
2. Adding missing arrays (just add `[]`)
3. Removing invalid properties (just delete)

---

## ✅ **SUCCESS CRITERIA**

Your config is ready when:
- [ ] `npm run build` completes with exit code 0
- [ ] ZERO TypeScript errors in output
- [ ] NO red squiggles in IDE for your config file
- [ ] All questions have sequential order
- [ ] All guidance objects have 6 required arrays
- [ ] All examples have scenario property

---

## 📞 **GET HELP**

If stuck:
1. Check `src/types/guided-tools.ts` for exact interface
2. Compare to `fishbone-config.ts` (perfect reference)
3. Search this document for the property causing issues
4. Run `npx tsc --noEmit` for detailed error info

---

**Last Updated:** October 3, 2025  
**Based On:** Five Why, Fishbone, A3 migrations  
**Total Fixes Documented:** 70+ individual changes across 20 patterns  
**Success Rate:** 100% when following this guide

---

**Remember:** These errors are systematic and predictable. Following this guide will save you HOURS of debugging!

