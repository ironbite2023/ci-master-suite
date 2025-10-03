# Five Why Configuration Fix - Implementation Plan

**Document Type:** Implementation Plan  
**Feature:** Guided Tools - Five Why Analysis  
**Date Created:** October 3, 2025  
**Status:** Ready for Implementation  
**Estimated Time:** 45 minutes  
**Complexity:** Low  

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Problem Analysis](#problem-analysis)
3. [Prerequisites](#prerequisites)
4. [Implementation Phases](#implementation-phases)
5. [Success Criteria](#success-criteria)
6. [Testing & Verification](#testing--verification)

---

## 🎯 OVERVIEW

### Request Summary
Fix the `five-why-config.ts` file to ensure full compliance with the `ToolConfiguration` TypeScript interface. The fishbone-config.ts is already complete and serves as the reference standard.

### Why This Matters
- **Type Safety:** Ensures configuration matches TypeScript interface, preventing runtime errors
- **UI Consistency:** Proper hint structure ensures hints display correctly in the guided wizard
- **Validation Reliability:** Array-based validation enables proper error message handling
- **Maintainability:** Complete tool metadata makes configuration discoverable
- **User Experience:** Correct configuration ensures all guidance, hints, and validation work as designed

### Benefits
✅ No TypeScript compilation errors  
✅ Hints display and trigger correctly  
✅ Validation messages show properly  
✅ Configuration is complete and professional  
✅ Matches fishbone-config.ts quality standard  

---

## 🔍 PROBLEM ANALYSIS

### Current State
The `five-why-config.ts` file has **4 critical issues** preventing full type compliance:

#### Issue #1: Missing Tool-Level Properties
**Location:** Top of configuration object  
**Missing:**
- `lastUpdated: string`
- `objectives: string[]`
- `prerequisites: string[]`

**Impact:** Incomplete metadata, TypeScript errors

---

#### Issue #2: Outdated Hint Structure (9 instances)
**Locations:** 6 different steps  
**Current (WRONG):**
```typescript
hints: [{
  id: 'hint-specific',
  title: 'Be Specific',
  content: 'Include who, what, when...',
  icon: '🎯',
  triggerCondition: { showOnLoad: true }  // ❌ OLD STRUCTURE
}]
```

**Should Be:**
```typescript
hints: [{
  id: 'hint-specific',
  trigger: 'auto',  // ✅ NEW: 'auto' | 'hover' | 'button' | 'after-delay'
  title: 'Be Specific',
  content: 'Include who, what, when...',
  type: 'tip'  // ✅ NEW: 'tip' | 'warning' | 'info' | 'best-practice'
}]
```

**Affected Steps:**
- Step 1 (lines 89-111): 3 hints
- Step 2 (lines 316-331): 2 hints
- Step 3 (lines 446-454): 1 hint
- Step 4 (lines 520-527): 1 hint
- Step 6 (lines 665-673): 1 hint
- Step 7 (lines 799-813): 2 hints

**Impact:** Hints won't display correctly in UI

---

#### Issue #3: Validation Objects Instead of Arrays (7 instances)
**Current (WRONG):**
```typescript
validation: {
  required: true,
  minLength: 15,
  maxLength: 300
}
```

**Should Be:**
```typescript
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

**Affected Questions:**
1. `problem_frequency` (line 257)
2. `why_1` (lines 357-360)
3. `why_2` (lines 469-473)
4. `why_3` (lines 542-546)
5. `why_4` (lines 615-619)
6. `why_5` (lines 688-692)
7. `countermeasure_1` (lines 838-842)

**Impact:** Validation won't work, error messages won't display

---

#### Issue #4: Missing Order Property
**Location:** `why_1_evidence` question (line 369)  
**Missing:** `order: 2,`  
**Impact:** Question ordering may fail

---

## ✅ PREREQUISITES

### Technical Requirements
- ✅ File exists: `src/config/tools/five-why-config.ts`
- ✅ Type interface exists: `src/types/guided-tools.ts`
- ✅ Reference example: `src/config/tools/fishbone-config.ts`
- ✅ TypeScript compiler available
- ✅ Code editor with TypeScript support

### Knowledge Requirements
- Understanding of TypeScript interfaces
- Familiarity with guided tools configuration structure
- Knowledge of validation rule types
- Understanding of hint trigger mechanisms

### Reference Files
- `src/config/tools/fishbone-config.ts` - Working example
- `src/types/guided-tools.ts` - Type definitions
- `src/components/guided/GuidedWizard.tsx` - Component consuming config

---

## 🚀 IMPLEMENTATION PHASES

### PHASE 1: Add Missing Tool-Level Properties
**Estimated Time:** 5 minutes  
**Risk Level:** Low  
**Dependencies:** None

#### Step 1.1: Add `lastUpdated` Property
**Location:** After line 39 (`version: '1.0.0'`)

**Action:**
```typescript
version: '1.0.0',
lastUpdated: '2024-01-01',
```

**Verification:** Property appears after version

---

#### Step 1.2: Add `objectives` Array
**Location:** After `lastUpdated`

**Action:**
```typescript
lastUpdated: '2024-01-01',

objectives: [
  'Identify root causes through systematic questioning',
  'Move beyond symptoms to underlying issues',
  'Develop effective countermeasures',
  'Prevent problem recurrence'
],
```

**Verification:** Array contains 4 clear, actionable objectives

---

#### Step 1.3: Add `prerequisites` Array
**Location:** After `objectives`

**Action:**
```typescript
prerequisites: [
  'Clear problem statement with observable facts',
  'Understanding of the problem context',
  'Open mindset - avoid jumping to conclusions'
],
```

**Verification:** Array contains 3 prerequisites matching introduction content

---

#### Step 1.4: Move `tags` and `relatedTools` Properties
**Current Location:** Lines 1043 and 1035 (near bottom)  
**New Location:** After `prerequisites`

**Action:**
- Cut lines 1035-1041 (`relatedTools` array)
- Cut lines 1043 (`tags` array)
- Paste after `prerequisites`

**Verification:** Properties appear in this order:
1. `objectives`
2. `prerequisites`
3. `tags`
4. `relatedTools`
5. `introduction`

---

### PHASE 2: Fix All Hint Structures
**Estimated Time:** 15 minutes  
**Risk Level:** Low  
**Dependencies:** None

#### Step 2.1: Fix Step 1 Problem Statement Hints (Lines 89-111)
**Hint Count:** 3 hints

**Hint 1 - `hint-specific` (lines 90-96):**
```typescript
// BEFORE:
{
  id: 'hint-specific',
  title: 'Be Specific',
  content: 'Include who, what, when, where, and how much. Avoid vague descriptions.',
  icon: '🎯',
  triggerCondition: { showOnLoad: true }
}

// AFTER:
{
  id: 'hint-specific',
  trigger: 'auto',
  title: 'Be Specific',
  content: 'Include who, what, when, where, and how much. Avoid vague descriptions.',
  type: 'tip'
}
```

**Hint 2 - `hint-measurable` (lines 97-103):**
```typescript
// BEFORE:
{
  id: 'hint-measurable',
  title: 'Make it Measurable',
  content: 'Use numbers: quantities, dates, times, costs, percentages.',
  icon: '📊',
  triggerCondition: { showOnLoad: true }
}

// AFTER:
{
  id: 'hint-measurable',
  trigger: 'auto',
  title: 'Make it Measurable',
  content: 'Use numbers: quantities, dates, times, costs, percentages.',
  type: 'tip'
}
```

**Hint 3 - `hint-observable` (lines 104-111):**
```typescript
// BEFORE:
{
  id: 'hint-observable',
  title: 'Use Observable Facts',
  content: 'Describe what you can see, touch, count, or measure - not opinions or assumptions.',
  icon: '👁️',
  triggerCondition: { showOnLoad: false }
}

// AFTER:
{
  id: 'hint-observable',
  trigger: 'hover',
  title: 'Use Observable Facts',
  content: 'Describe what you can see, touch, count, or measure - not opinions or assumptions.',
  type: 'tip'
}
```

**Verification:** All 3 hints have `trigger` and `type`, no `icon` or `triggerCondition`

---

#### Step 2.2: Fix Step 2 First Why Hints (Lines 316-331)
**Hint Count:** 2 hints

**Hint 1 - `hint-direct` (lines 317-323):**
```typescript
// BEFORE:
{
  id: 'hint-direct',
  title: 'Find the Direct Cause',
  content: 'What was the immediate reason? Think about what you would see or measure right at the moment of the problem.',
  icon: '🎯',
  triggerCondition: { showOnLoad: true }
}

// AFTER:
{
  id: 'hint-direct',
  trigger: 'auto',
  title: 'Find the Direct Cause',
  content: 'What was the immediate reason? Think about what you would see or measure right at the moment of the problem.',
  type: 'tip'
}
```

**Hint 2 - `hint-evidence` (lines 324-331):**
```typescript
// BEFORE:
{
  id: 'hint-evidence',
  title: 'Use Evidence',
  content: 'Base your answer on facts, observations, or data - not assumptions.',
  icon: '📊',
  triggerCondition: { showOnLoad: true }
}

// AFTER:
{
  id: 'hint-evidence',
  trigger: 'auto',
  title: 'Use Evidence',
  content: 'Base your answer on facts, observations, or data - not assumptions.',
  type: 'tip'
}
```

**Verification:** Both hints converted to new structure

---

#### Step 2.3: Fix Step 3 Second Why Hints (Lines 446-454)
**Hint Count:** 1 hint

**Hint 1 - `hint-deeper` (lines 447-454):**
```typescript
// BEFORE:
{
  id: 'hint-deeper',
  title: 'Go Deeper',
  content: 'Don\'t repeat your first answer. Ask: "Why did THAT happen?" Keep peeling back the layers.',
  icon: '⬇️',
  triggerCondition: { showOnLoad: true }
}

// AFTER:
{
  id: 'hint-deeper',
  trigger: 'auto',
  title: 'Go Deeper',
  content: 'Don\'t repeat your first answer. Ask: "Why did THAT happen?" Keep peeling back the layers.',
  type: 'tip'
}
```

**Verification:** Hint structure updated

---

#### Step 2.4: Fix Step 4 Third Why Hints (Lines 520-527)
**Hint Count:** 1 hint

**Hint 1 - `hint-system` (lines 521-527):**
```typescript
// BEFORE:
{
  id: 'hint-system',
  title: 'Look at Systems',
  content: 'By the third "why", you often discover system or management issues.',
  icon: '🏗️',
  triggerCondition: { showOnLoad: true }
}

// AFTER:
{
  id: 'hint-system',
  trigger: 'auto',
  title: 'Look at Systems',
  content: 'By the third "why", you often discover system or management issues.',
  type: 'tip'
}
```

**Verification:** Hint structure updated

---

#### Step 2.5: Fix Step 6 Fifth Why Hints (Lines 665-673)
**Hint Count:** 1 hint

**Hint 1 - `hint-root` (lines 666-673):**
```typescript
// BEFORE:
{
  id: 'hint-root',
  title: 'Is This a Root Cause?',
  content: 'A root cause is something you can fix that will prevent the problem from recurring. If fixing this wouldn\'t prevent the problem, keep asking why.',
  icon: '🎯',
  triggerCondition: { showOnLoad: true }
}

// AFTER:
{
  id: 'hint-root',
  trigger: 'auto',
  title: 'Is This a Root Cause?',
  content: 'A root cause is something you can fix that will prevent the problem from recurring. If fixing this wouldn\'t prevent the problem, keep asking why.',
  type: 'tip'
}
```

**Verification:** Hint structure updated

---

#### Step 2.6: Fix Step 7 Countermeasures Hints (Lines 799-813)
**Hint Count:** 2 hints

**Hint 1 - `hint-specific-action` (lines 800-806):**
```typescript
// BEFORE:
{
  id: 'hint-specific-action',
  title: 'Be Specific',
  content: 'Define exactly what will be done, by whom, and by when.',
  icon: '📋',
  triggerCondition: { showOnLoad: true }
}

// AFTER:
{
  id: 'hint-specific-action',
  trigger: 'auto',
  title: 'Be Specific',
  content: 'Define exactly what will be done, by whom, and by when.',
  type: 'tip'
}
```

**Hint 2 - `hint-prevent` (lines 807-813):**
```typescript
// BEFORE:
{
  id: 'hint-prevent',
  title: 'Focus on Prevention',
  content: 'Your countermeasure should prevent the problem from happening again, not just fix the current instance.',
  icon: '🛡️',
  triggerCondition: { showOnLoad: true }
}

// AFTER:
{
  id: 'hint-prevent',
  trigger: 'auto',
  title: 'Focus on Prevention',
  content: 'Your countermeasure should prevent the problem from happening again, not just fix the current instance.',
  type: 'tip'
}
```

**Verification:** All 9 hints across 6 steps converted successfully

---

### PHASE 3: Fix Validation Arrays
**Estimated Time:** 20 minutes  
**Risk Level:** Low  
**Dependencies:** None

#### Step 3.1: Fix `problem_frequency` Validation (Line 257)
**Location:** Step 1, Question 3

**Before:**
```typescript
validation: {
  required: true
}
```

**After:**
```typescript
validation: [
  {
    type: 'required',
    errorMessage: 'Please select how often this problem occurs.'
  }
]
```

**Verification:** Validation is array with proper error message

---

#### Step 3.2: Fix `why_1` Validation (Lines 357-360)
**Location:** Step 2, Question 1

**Before:**
```typescript
validation: {
  required: true,
  minLength: 15,
  maxLength: 300
}
```

**After:**
```typescript
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
]
```

**Verification:** Array with 3 validation rules

---

#### Step 3.3: Fix `why_2` Validation (Lines 469-473)
**Location:** Step 3, Question 1

**Before:**
```typescript
validation: {
  required: true,
  minLength: 15,
  maxLength: 300
}
```

**After:**
```typescript
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
]
```

**Verification:** Array with 3 validation rules

---

#### Step 3.4: Fix `why_3` Validation (Lines 542-546)
**Location:** Step 4, Question 1

**Before:**
```typescript
validation: {
  required: true,
  minLength: 15,
  maxLength: 300
}
```

**After:**
```typescript
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
]
```

**Verification:** Array with 3 validation rules

---

#### Step 3.5: Fix `why_4` Validation (Lines 615-619)
**Location:** Step 5, Question 1

**Before:**
```typescript
validation: {
  required: true,
  minLength: 15,
  maxLength: 300
}
```

**After:**
```typescript
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
]
```

**Verification:** Array with 3 validation rules

---

#### Step 3.6: Fix `why_5` Validation (Lines 688-692)
**Location:** Step 6, Question 1

**Before:**
```typescript
validation: {
  required: true,
  minLength: 20,
  maxLength: 300
}
```

**After:**
```typescript
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
]
```

**Note:** Min value is 20 (not 15) for this question

**Verification:** Array with 3 validation rules

---

#### Step 3.7: Fix `countermeasure_1` Validation (Lines 838-842)
**Location:** Step 7, Question 1

**Before:**
```typescript
validation: {
  required: true,
  minLength: 30,
  maxLength: 500
}
```

**After:**
```typescript
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
]
```

**Verification:** Array with 3 validation rules, note higher min (30) and max (500) values

---

### PHASE 4: Add Missing Order Property
**Estimated Time:** 2 minutes  
**Risk Level:** Low  
**Dependencies:** None

#### Step 4.1: Add Order to `why_1_evidence` Question
**Location:** Line 369, Step 2, Question 2

**Before:**
```typescript
{
  id: 'why_1_evidence',
  text: 'What evidence supports this cause?',
  type: 'short-text',
  required: false,
  // ... rest of properties
}
```

**After:**
```typescript
{
  id: 'why_1_evidence',
  order: 2,
  text: 'What evidence supports this cause?',
  type: 'short-text',
  required: false,
  // ... rest of properties
}
```

**Verification:** `order: 2,` appears after `id` property

---

### PHASE 5: Final Verification & Testing
**Estimated Time:** 8 minutes  
**Risk Level:** Low  
**Dependencies:** All previous phases complete

#### Step 5.1: Visual TypeScript Check
**Action:** Review file in IDE for TypeScript errors (red squiggles)

**Expected Result:** No TypeScript errors

**If Errors Found:**
- Review error messages
- Cross-reference with `ToolConfiguration` interface
- Fix any remaining issues

---

#### Step 5.2: Structure Comparison with Fishbone
**Action:** Compare five-why-config.ts with fishbone-config.ts

**Check:**
- ✅ Same tool-level properties present
- ✅ Same hint structure
- ✅ Same validation array structure
- ✅ All questions have `order` property
- ✅ Consistent code style

---

#### Step 5.3: Count Verification
**Action:** Verify all instances were fixed

**Checklist:**
- ✅ Tool properties: 3 added (lastUpdated, objectives, prerequisites)
- ✅ Hints converted: 9 total (3+2+1+1+1+2)
- ✅ Validation arrays: 7 converted
- ✅ Order properties: 1 added
- ✅ Total changes: ~30 edits

---

#### Step 5.4: Content Integrity Check
**Action:** Verify no content was lost during conversion

**Check:**
- ✅ All hint content preserved
- ✅ All validation rules preserved
- ✅ All error messages meaningful
- ✅ No accidental deletions

---

## ✅ SUCCESS CRITERIA

### Primary Success Criteria

#### 1. Type Compliance ✅
- [ ] No TypeScript compilation errors
- [ ] Matches `ToolConfiguration` interface exactly
- [ ] All required properties present
- [ ] All nested objects match expected types

#### 2. Structural Fixes ✅
- [ ] Tool-level: `lastUpdated`, `objectives`, `prerequisites` added
- [ ] Hints: All 9 instances use new `trigger` + `type` structure
- [ ] Validation: All 7 instances converted to arrays
- [ ] Order: `why_1_evidence` has `order: 2`

#### 3. Quality Standards ✅
- [ ] Error messages clear and user-friendly
- [ ] Hint content preserved and properly structured
- [ ] Consistent with fishbone-config.ts
- [ ] Professional code quality

#### 4. Functionality ✅
- [ ] Hints will trigger correctly in UI
- [ ] Validation will execute properly
- [ ] Error messages will display
- [ ] Question ordering will work

---

### Verification Checklist

**File Structure:**
```
✅ Tool Metadata (top)
   ├── id, name, category
   ├── description, icon, estimatedTime, difficulty
   ├── version, lastUpdated
   ├── objectives (array)
   ├── prerequisites (array)
   ├── tags (array)
   └── relatedTools (array)

✅ Introduction Section
   └── All properties present

✅ Steps Array (7 steps)
   ├── Step 1: 3 questions, 3 hints (converted)
   ├── Step 2: 2 questions, 2 hints (converted)
   ├── Step 3: 1 question, 1 hint (converted)
   ├── Step 4: 1 question, 1 hint (converted)
   ├── Step 5: 1 question, 0 hints
   ├── Step 6: 3 questions, 1 hint (converted)
   └── Step 7: 5 questions, 2 hints (converted)

✅ Completion Criteria
   └── All properties present

✅ Next Steps
   └── All properties present

✅ Resources
   └── All properties present
```

---

## 🧪 TESTING & VERIFICATION

### Manual Testing Steps

#### Test 1: IDE Type Checking
**Procedure:**
1. Open `five-why-config.ts` in VS Code
2. Check for red error squiggles
3. Hover over `fiveWhyConfig` to see inferred type

**Expected:** No errors, type shows as `ToolConfiguration`

---

#### Test 2: Import Test
**Procedure:**
1. Create test file or use existing component
2. Import: `import { fiveWhyConfig } from '@/config/tools/five-why-config'`
3. Check for import errors

**Expected:** Clean import, no type errors

---

#### Test 3: Property Access Test
**Procedure:**
```typescript
const config = fiveWhyConfig;
console.log(config.lastUpdated);     // Should exist
console.log(config.objectives);      // Should be array
console.log(config.prerequisites);   // Should be array
console.log(config.steps[0].questions[0].hints[0].trigger);  // Should be 'auto'
console.log(config.steps[0].questions[0].validation);  // Should be array
```

**Expected:** All properties accessible, no undefined values

---

#### Test 4: Hint Structure Validation
**Procedure:**
```typescript
const firstHint = fiveWhyConfig.steps[0].questions[0].hints?.[0];
if (firstHint) {
  console.assert(firstHint.trigger !== undefined, 'Hint should have trigger');
  console.assert(firstHint.type !== undefined, 'Hint should have type');
  console.assert(firstHint.triggerCondition === undefined, 'Hint should NOT have triggerCondition');
  console.assert(firstHint.icon === undefined, 'Hint should NOT have icon');
}
```

**Expected:** All assertions pass

---

#### Test 5: Validation Array Check
**Procedure:**
```typescript
const validation = fiveWhyConfig.steps[0].questions[0].validation;
console.assert(Array.isArray(validation), 'Validation should be array');
console.assert(validation.length > 0, 'Validation array should have rules');
console.assert(validation[0].type !== undefined, 'Validation rule should have type');
console.assert(validation[0].errorMessage !== undefined, 'Validation rule should have errorMessage');
```

**Expected:** All assertions pass

---

### Automated Verification Script

```typescript
// verification-script.ts
import { fiveWhyConfig } from '@/config/tools/five-why-config';
import { ToolConfiguration } from '@/types/guided-tools';

function verifyConfig(config: ToolConfiguration): boolean {
  const errors: string[] = [];
  
  // Check tool-level properties
  if (!config.lastUpdated) errors.push('Missing lastUpdated');
  if (!Array.isArray(config.objectives)) errors.push('Missing objectives array');
  if (!Array.isArray(config.prerequisites)) errors.push('Missing prerequisites array');
  
  // Check all hints
  let hintCount = 0;
  config.steps.forEach((step, stepIndex) => {
    step.questions.forEach((question, qIndex) => {
      question.hints?.forEach((hint, hIndex) => {
        hintCount++;
        if (!hint.trigger) errors.push(`Step ${stepIndex}, Q ${qIndex}, Hint ${hIndex}: Missing trigger`);
        if (!hint.type) errors.push(`Step ${stepIndex}, Q ${qIndex}, Hint ${hIndex}: Missing type`);
        if ('triggerCondition' in hint) errors.push(`Step ${stepIndex}, Q ${qIndex}, Hint ${hIndex}: Has old triggerCondition`);
        if ('icon' in hint) errors.push(`Step ${stepIndex}, Q ${qIndex}, Hint ${hIndex}: Has old icon`);
      });
    });
  });
  
  console.log(`Total hints checked: ${hintCount}`);
  
  // Check all validations
  let validationCount = 0;
  config.steps.forEach((step, stepIndex) => {
    step.questions.forEach((question, qIndex) => {
      if (!Array.isArray(question.validation)) {
        errors.push(`Step ${stepIndex}, Q ${qIndex} (${question.id}): Validation is not array`);
      } else {
        validationCount++;
        question.validation.forEach((rule, rIndex) => {
          if (!rule.type) errors.push(`Step ${stepIndex}, Q ${qIndex}, Rule ${rIndex}: Missing type`);
          if (!rule.errorMessage) errors.push(`Step ${stepIndex}, Q ${qIndex}, Rule ${rIndex}: Missing errorMessage`);
        });
      }
    });
  });
  
  console.log(`Total validation arrays checked: ${validationCount}`);
  
  // Check order properties
  config.steps.forEach((step, stepIndex) => {
    step.questions.forEach((question, qIndex) => {
      if (question.order === undefined) {
        errors.push(`Step ${stepIndex}, Q ${qIndex} (${question.id}): Missing order`);
      }
    });
  });
  
  if (errors.length > 0) {
    console.error('❌ Verification Failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    return false;
  }
  
  console.log('✅ All verifications passed!');
  return true;
}

// Run verification
const result = verifyConfig(fiveWhyConfig);
process.exit(result ? 0 : 1);
```

---

## 📊 IMPLEMENTATION SUMMARY

### Changes Overview
| Category | Changes | Lines Affected |
|----------|---------|----------------|
| Tool Properties | 3 added | 40-60 |
| Hints Converted | 9 instances | 89-813 |
| Validation Arrays | 7 converted | 257-842 |
| Order Properties | 1 added | 369 |
| **Total** | **~30 edits** | **Multiple** |

### Time Investment
- Phase 1 (Tool Properties): 5 minutes
- Phase 2 (Hints): 15 minutes
- Phase 3 (Validation): 20 minutes
- Phase 4 (Order): 2 minutes
- Phase 5 (Verification): 8 minutes
- **Total: 50 minutes**

### Risk Assessment
- **Overall Risk:** Low
- **Type:** Structural refactoring, no logic changes
- **Reversibility:** High (version control)
- **Impact:** Configuration only, no runtime behavior changes

---

## 📝 NOTES FOR IMPLEMENTER

### Important Reminders
1. **Don't rush Phase 2** - Easy to miss a hint if going too fast
2. **Copy error messages carefully** - They're user-facing
3. **Preserve all content** - Only change structure, not content
4. **Test after each phase** - Easier to find issues early
5. **Use find-and-replace cautiously** - Structure variations exist

### Common Pitfalls to Avoid
❌ Accidentally removing `icon` property - some hints may reference emojis  
❌ Forgetting to remove `triggerCondition` property  
❌ Converting `trigger: 'auto'` when it should be `hover`  
❌ Inconsistent error messages across similar validations  
❌ Forgetting commas after new properties  

### Helpful Tips
✅ Use multi-cursor editing for repetitive changes  
✅ Keep fishbone-config.ts open for reference  
✅ Commit after each phase for easy rollback  
✅ Use TypeScript errors as a checklist  
✅ Test in UI after completion if possible  

---

## 🎯 NEXT STEPS AFTER COMPLETION

1. **Update Documentation**
   - Mark this implementation as complete
   - Update any related documentation

2. **Test in UI** (if possible)
   - Load Five Why tool in browser
   - Verify hints appear correctly
   - Test validation messages
   - Check all steps navigate properly

3. **Update Other Configs** (if needed)
   - Check if other tool configs need similar fixes
   - Apply same pattern if issues found

4. **Memory Systems Update**
   - Log this fix in Memory Bank decision log
   - Add to Memory Palace if new patterns learned

---

## 📚 REFERENCES

- **Type Definitions:** `src/types/guided-tools.ts`
- **Working Example:** `src/config/tools/fishbone-config.ts`
- **Component Using Config:** `src/components/guided/GuidedWizard.tsx`
- **Guidance Library:** `src/lib/guidance/index.ts`

---

**Document Status:** ✅ Ready for Implementation  
**Last Updated:** October 3, 2025  
**Estimated Completion:** 50 minutes  
**Complexity:** Low  
**Priority:** Medium  

---

*This document provides complete step-by-step instructions for fixing the five-why-config.ts file. Follow each phase sequentially and verify after each phase for best results.*
