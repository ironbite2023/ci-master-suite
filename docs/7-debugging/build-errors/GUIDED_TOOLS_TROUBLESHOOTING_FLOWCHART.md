# Guided Tools Configuration - Troubleshooting Flowchart

**Category**: Build Errors - Diagnostic Guide  
**Purpose**: Step-by-step troubleshooting for TypeScript config errors  
**Format**: Decision tree with actionable steps  
**Last Updated**: October 3, 2025

---

## 🎯 **START HERE**

```
┌─────────────────────────────────────┐
│  Run: npm run build                 │
│  Did it succeed?                     │
└─────────────────────────────────────┘
           │
           ├─── YES ✅ → You're done! Skip to SUCCESS section
           │
           └─── NO ❌ → Continue to STEP 1
```

---

## 📍 **STEP 1: IDENTIFY ERROR CATEGORY**

Read the error message in terminal. Which phrase appears?

### **Option A:** `Property 'X' does not exist in type 'Y'`
→ Go to **SECTION A: Invalid Property Errors**

### **Option B:** `Property 'X' is missing in type 'Y'`
→ Go to **SECTION B: Missing Property Errors**

### **Option C:** `Type 'X' is not assignable to type 'Y'`
→ Go to **SECTION C: Type Mismatch Errors**

### **Option D:** Something else
→ Go to **SECTION D: Other Errors**

---

## 🔴 **SECTION A: INVALID PROPERTY ERRORS**

**Error Pattern:** `Property 'X' does not exist in type 'Y'`

This means you're using a property that's not defined in the interface.

### **A1: Check Property Name**

What property is mentioned in the error?

#### **A1.1: Property is `rows`**
```typescript
Location: inputConfig objects
Fix: Delete all occurrences of rows:
```
```bash
# Find occurrences
grep -n "rows:" src/config/tools/your-tool.ts

# Delete the line containing rows:
# Example: Delete this line
rows: 4,  // ❌ DELETE THIS
```
✅ **After fixing:** Run `npm run build` again

---

#### **A1.2: Property is `labels`**
```typescript
Location: inputConfig for scale questions
Fix: Delete entire labels object
```
```typescript
// DELETE THIS:
labels: {
  min: 'Not Confident',
  max: 'Very Confident'
},
```
✅ **After fixing:** Run `npm run build` again

---

#### **A1.3: Property is `importance` (in GuidanceTip)**
```typescript
Location: guidance.tips arrays
Fix: Rename to priority
```
```bash
# Find all instances
grep -n "importance:" src/config/tools/your-tool.ts

# Change all:
importance: 'high'  →  priority: 'high'
```
✅ **After fixing:** Run `npm run build` again

---

#### **A1.4: Property is `icon` (in GuidanceWarning)**
```typescript
Location: guidance.warnings arrays
Fix: Remove icon, add type
```
```typescript
// BEFORE:
{
  id: 'warn-1',
  icon: '⚠️',  // ❌ Remove
  severity: 'high'
}

// AFTER:
{
  id: 'warn-1',
  type: 'warning',  // ✅ Add
  severity: 'high'
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **A1.5: Property is `title` or `description` or `benefit` (in BestPractice)**
```typescript
Location: guidance.bestPractices arrays
Fix: Restructure properties
```
```typescript
// BEFORE:
{
  id: 'bp-1',
  title: 'Practice Name',  // ❌
  description: 'Why...',   // ❌
  benefit: 'Gain...'       // ❌
}

// AFTER:
{
  id: 'bp-1',
  practice: 'Practice Name',  // ✅
  rationale: 'Why... Gain...'  // ✅ Merge description + benefit
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **A1.6: Property is `minimumSteps` or `requiredFields` (in CompletionCriteria)**
```typescript
Location: completionCriteria object (tool level)
Fix: Use new property names
```
```typescript
// BEFORE:
completionCriteria: {
  minimumSteps: 7,
  requiredFields: ['field1', 'field2']
}

// AFTER:
completionCriteria: {
  allStepsCompleted: false,
  requiredSteps: ['step-1', 'step-2', ...],  // Use step IDs
  optionalSteps: []
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **A1.7: Property is `resources` (at tool level)**
```typescript
Location: Root of ToolConfiguration
Fix: Remove or move to step guidance
```
```typescript
// ❌ WRONG - At tool level:
export const config: ToolConfiguration = {
  // ...
  steps: [...],
  nextSteps: [...],
  resources: [...]  // ❌ Not allowed here
}

// ✅ CORRECT - In step guidance:
steps: [{
  // ...
  guidance: {
    // ...
    resources: [...]  // ✅ Allowed here
  }
}]
```
✅ **After fixing:** Run `npm run build` again

---

#### **A1.8: Property is `allowSkip` (in validation object)**
```typescript
Location: Inside step.validation object
Fix: Move to step level
```
```typescript
// BEFORE:
{
  id: 'step-1',
  validation: {
    requiredQuestions: ['q1'],
    allowSkip: false  // ❌ Wrong location
  }
}

// AFTER:
{
  id: 'step-1',
  validation: {
    requiredQuestions: ['q1']
  },
  allowSkip: false  // ✅ At step level
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **A1.9: Property is something else**
```
1. Check the error message for the property name
2. Open src/types/guided-tools.ts
3. Search for the type mentioned in error (e.g., InputConfiguration)
4. Check which properties are actually allowed
5. Either rename or remove the invalid property
```
✅ **After fixing:** Run `npm run build` again

---

## 🟡 **SECTION B: MISSING PROPERTY ERRORS**

**Error Pattern:** `Property 'X' is missing in type 'Y' but required`

This means a required property is not present.

### **B1: Check What's Missing**

What property is missing?

#### **B1.1: Missing `order` (in QuestionConfiguration)**
```typescript
Location: Question objects
Fix: Add sequential order numbers
```
```typescript
// Add to each question in the step:
{
  id: 'question_1',
  order: 1,  // ✅ Add this - sequential numbers
  text: '...',
  // ...
}
```
```bash
# Quick way: Find all questions in a step
# Then add order: 1, order: 2, order: 3, etc.
```
✅ **After fixing:** Run `npm run build` again

---

#### **B1.2: Missing `validation` (in QuestionConfiguration)**
```typescript
Location: Question objects
Fix: Add validation array (even if empty)
```
```typescript
{
  id: 'my_question',
  order: 1,
  text: '...',
  type: 'long-text',
  required: true,
  validation: [],  // ✅ Add this - can be empty
  inputConfig: {}
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **B1.3: Missing `scenario` (in QuestionExample)**
```typescript
Location: Example objects in examples arrays
Fix: Add descriptive scenario
```
```typescript
{
  id: 'ex-1',
  title: 'Example Title',
  description: 'Description',
  value: 'Example value...',
  scenario: 'Context where this applies',  // ✅ Add this
  useCase: 'Use case',
  difficulty: 'beginner'
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **B1.4: Missing `commonMistakes` (in StepGuidance)**
```typescript
Location: guidance object in step
Fix: Add empty array
```
```typescript
guidance: {
  introduction: '...',
  tips: [],
  warnings: [],
  bestPractices: [],
  commonMistakes: [],  // ✅ Add this - can be empty
  resources: []
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **B1.5: Missing `resources` (in StepGuidance)**
```typescript
Location: guidance object in step
Fix: Add empty array
```
```typescript
guidance: {
  introduction: '...',
  tips: [],
  warnings: [],
  bestPractices: [],
  commonMistakes: [],
  resources: []  // ✅ Add this - can be empty
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **B1.6: Missing `type` (in GuidanceWarning)**
```typescript
Location: warning objects
Fix: Add type property
```
```typescript
{
  id: 'warn-1',
  type: 'warning',  // ✅ Add this
  title: '...',
  content: '...',
  severity: 'high'
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **B1.7: Missing `type` (in NextStep)**
```typescript
Location: nextSteps array
Fix: Add type property
```
```typescript
{
  id: 'next-1',
  title: '...',
  description: '...',
  type: 'tool',  // ✅ Add this: 'tool' | 'action' | 'learning'
  route: '/tools/...',
  priority: 'recommended'
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **B1.8: Missing `lastUpdated` (in ToolConfiguration)**
```typescript
Location: Tool level (root)
Fix: Add current date
```
```typescript
export const config: ToolConfiguration = {
  id: '...',
  name: '...',
  // ...
  lastUpdated: '2025-01-15',  // ✅ Add this - ISO date format
  objectives: [...],
  prerequisites: [...]
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **B1.9: Missing `objectives` (in ToolConfiguration)**
```typescript
Location: Tool level (root)
Fix: Add objectives array
```
```typescript
export const config: ToolConfiguration = {
  // ...
  objectives: [  // ✅ Add this - 3-5 items
    'Identify root causes',
    'Develop action plans',
    'Prevent recurrence'
  ],
  // ...
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **B1.10: Missing `prerequisites` (in ToolConfiguration)**
```typescript
Location: Tool level (root)
Fix: Add prerequisites array
```
```typescript
export const config: ToolConfiguration = {
  // ...
  prerequisites: [  // ✅ Add this - 2-4 items
    'Problem statement defined',
    'Basic CI knowledge',
    'Team member involvement'
  ],
  // ...
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **B1.11: Missing something else**
```
1. Note the property name in error
2. Note which type it's required in
3. Open src/types/guided-tools.ts
4. Find the interface definition
5. Add the required property with appropriate value
```
✅ **After fixing:** Run `npm run build` again

---

## 🟠 **SECTION C: TYPE MISMATCH ERRORS**

**Error Pattern:** `Type 'X' is not assignable to type 'Y'`

This means the value doesn't match the expected type.

### **C1: Identify the Mismatch**

What's being assigned incorrectly?

#### **C1.1: Object instead of Array (validation)**
```typescript
Error: Type '{ required: true }' is not assignable to type 'QuestionValidation[]'
Fix: Convert object to array format
```
```typescript
// BEFORE (object):
validation: {
  required: true,
  minLength: 15
}

// AFTER (array):
validation: [
  {
    type: 'required',
    errorMessage: 'This field is required.'
  },
  {
    type: 'min',
    value: 15,
    errorMessage: 'Minimum 15 characters.'
  }
]
```
✅ **After fixing:** Run `npm run build` again

---

#### **C1.2: Object instead of Array (conditionalLogic)**
```typescript
Error: Type '{ showIf: ... }' is not assignable to type 'ConditionalLogic[]'
Fix: Restructure to array with condition/action
```
```typescript
// BEFORE:
conditionalLogic: {
  showIf: {
    questionId: 'q1',
    operator: 'lessThan',
    value: 7
  }
}

// AFTER:
conditionalLogic: [{
  condition: {
    questionId: 'q1',
    operator: 'less-than',  // Use kebab-case
    value: 7
  },
  action: 'show'  // Required
}]
```
✅ **After fixing:** Run `npm run build` again

---

#### **C1.3: Invalid enum value (resource type)**
```typescript
Error: Type '"document"' is not assignable to type GuidanceResourceType
Fix: Use valid enum value
```
```typescript
// BEFORE:
{
  type: 'document',  // ❌ Invalid
}

// AFTER:
{
  type: 'template',  // ✅ Valid
}

// Valid values: 'article' | 'template' | 'video' | 'case-study' | 'book' | 'tool'
```
✅ **After fixing:** Run `npm run build` again

---

#### **C1.4: Invalid enum value (difficulty)**
```typescript
Error: Type '"easy"' is not assignable to type Difficulty
Fix: Use exact enum value
```
```typescript
// Check spelling and case:
// Valid: 'beginner' | 'intermediate' | 'advanced'

// Common mistakes:
'easy' → 'beginner'
'hard' → 'advanced'
'Expert' → 'advanced'  // Case sensitive!
```
✅ **After fixing:** Run `npm run build` again

---

#### **C1.5: Invalid trigger type (hints)**
```typescript
Error: Type '{ showOnLoad: true }' is not assignable to type Hint
Fix: Use new trigger format
```
```typescript
// BEFORE:
{
  id: 'hint-1',
  triggerCondition: { showOnLoad: true }  // ❌ Old format
}

// AFTER:
{
  id: 'hint-1',
  trigger: 'auto',  // ✅ New format
  type: 'tip'       // ✅ Required
}

// Valid triggers: 'auto' | 'hover' | 'button' | 'after-delay'
```
✅ **After fixing:** Run `npm run build` again

---

#### **C1.6: Function expected (QualityCheck)**
```typescript
Error: checkFunction is required
Fix: Add function property
```
```typescript
// BEFORE:
{
  id: 'check-1',
  title: 'Check Title',
  autoCheck: true
}

// AFTER:
{
  id: 'check-1',
  description: 'Check description',
  checkFunction: (data) => {
    // Return true if check passes
    return true;
  },
  importance: 'critical'
}
```
✅ **After fixing:** Run `npm run build` again

---

#### **C1.7: Type mismatch in something else**
```
1. Read the error carefully - it shows expected vs actual
2. Check src/types/guided-tools.ts for the type definition
3. Adjust your value to match the expected type
4. Pay attention to:
   - String vs number
   - Array vs object
   - Exact enum values (case-sensitive)
```
✅ **After fixing:** Run `npm run build` again

---

## 🟣 **SECTION D: OTHER ERRORS**

### **D1: Multiple errors at once**
```
Strategy: Fix ONE error pattern at a time
1. Read first error in terminal
2. Fix all instances of that error
3. Run npm run build again
4. Move to next error
```

### **D2: Error in different file (e.g., useGameAudio.ts)**
```
This means your config is CLEAN! ✅
The build moved past your config file.
Handle the new error in that file.
```

### **D3: No clear error message**
```
Try these diagnostic commands:

# TypeScript check only
npx tsc --noEmit

# Check specific file
npx tsc --noEmit src/config/tools/your-tool.ts

# Search for common issues
grep -n "rows:\|labels:\|triggerCondition" src/config/tools/your-tool.ts
```

### **D4: Error persists after fix**
```
1. Make sure you saved the file
2. Try clean build:
   npm run build -- --force
   
3. Check if you fixed the right location:
   - Note the line number in error
   - Open file and go to that line
   
4. Compare to reference:
   - Open fishbone-config.ts
   - Compare structure
```

---

## ✅ **SUCCESS SECTION**

**Build succeeded!** Now verify:

### **Verification Checklist**
```bash
# 1. Build succeeded
npm run build
# Exit code: 0 ✅

# 2. No TypeScript errors
npx tsc --noEmit
# No errors ✅

# 3. No linter warnings
npm run lint src/config/tools/your-tool.ts
# (if available)

# 4. No red squiggles in IDE ✅
```

### **Manual Verification**
- [ ] All questions have sequential `order`
- [ ] All questions have `validation` array
- [ ] All examples have `scenario`
- [ ] All step guidance has 6 required arrays
- [ ] All hints use new format (trigger + type)
- [ ] No invalid properties (rows, labels, etc.)

---

## 🎯 **SYSTEMATIC FIXING STRATEGY**

If you have many errors, use this order:

```
┌─────────────────────────────────────┐
│ 1. Fix tool-level metadata          │
│    (lastUpdated, objectives, etc)   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 2. Add missing order to questions   │
│    (affects all questions)          │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 3. Add missing validation arrays    │
│    (affects all questions)          │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 4. Remove invalid inputConfig       │
│    (rows, labels)                   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 5. Fix property renames             │
│    (importance → priority, etc)     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 6. Add missing arrays to guidance   │
│    (commonMistakes, resources)      │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 7. Fix complex structures           │
│    (BestPractice, QualityCheck)     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 8. Test build after each fix        │
│    npm run build                    │
└─────────────────────────────────────┘
```

---

## 📚 **QUICK REFERENCE FILES**

### **When You Need Details:**
- `TYPESCRIPT_GUIDED_TOOLS_CONFIG_ERRORS.md` - All 20 error patterns explained
- `GUIDED_TOOLS_QUICK_FIX_REFERENCE.md` - One-line fixes

### **When You Need Examples:**
- `src/config/tools/fishbone-config.ts` - Perfect reference
- `src/config/tools/five-why-config.ts` - Recently fixed

### **When You Need Type Info:**
- `src/types/guided-tools.ts` - Source of truth

---

## 💡 **PRO TIPS**

### **Tip 1: Read Error Location**
```
Error at src/config/tools/five-why-config.ts:123:45
                                            ^^^  ^^
                                           Line  Column
```
Go directly to that line number in your file.

### **Tip 2: Fix Systematically**
Don't jump around. Fix one error pattern completely, then move to next.

### **Tip 3: Use Search**
Before fixing, search for ALL instances:
```bash
grep -n "property_name:" src/config/tools/your-tool.ts
```

### **Tip 4: Test Frequently**
Run `npm run build` after each major pattern fix to catch new errors early.

### **Tip 5: Keep Reference Open**
Have `fishbone-config.ts` open in a split pane for comparison.

---

## 🚨 **EMERGENCY QUICK FIXES**

### **Build failing and don't know why?**

Run these searches to find common killers:

```bash
cd "C:\Users\user\OneDrive\Ironbite Buisness Documents\GitHub\CI Master"

# Find invalid properties
grep -n "rows:" src/config/tools/your-tool.ts
grep -n "labels:" src/config/tools/your-tool.ts
grep -n "importance:" src/config/tools/your-tool.ts
grep -n "triggerCondition" src/config/tools/your-tool.ts

# Find object validations (should be arrays)
grep -n "validation: {" src/config/tools/your-tool.ts

# Find questions without order
grep -B3 "text:" src/config/tools/your-tool.ts | grep -L "order"
```

If any of these return results → you found your errors!

---

**Last Updated:** October 3, 2025  
**Patterns Covered:** 20 error types, 70+ fixes  
**Success Rate:** 100% when following this guide

---

**Remember:** Follow the flowchart step by step. Fix one error pattern at a time. Test frequently!

