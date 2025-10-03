# Remaining TypeScript Errors - Quick Reference

**Date:** October 3, 2025  
**Total Remaining:** 18 errors  
**Priority:** 🟡 **MEDIUM** - Build still fails but core systems are fixed  

---

## Quick Summary

| Category | Count | Priority | Est. Time |
|----------|-------|----------|-----------|
| UI Cascading Errors | 7 | 🔴 High | 10 min |
| Infrastructure Errors | 11 | 🟢 Medium | 30 min |
| **TOTAL** | **18** | - | **40 min** |

---

## Category 1: UI Cascading Errors (7 errors)

### 🔴 Priority: HIGH - Quick Win
These errors were **created by Phase 1 fixes** when we updated difficulty enums from `easy/medium/hard` to `beginner/intermediate/advanced`.

### Error #1-6: Game Detail Page Difficulty Keys

**File:** `src/app/games/[slug]/page.tsx`  
**Lines:** 241, 242, 247, 248, 253, 254  
**Errors:** 6

```typescript
// CURRENT (BROKEN)
<DifficultyLevel
  label="Easy"
  icon="🟢"
  multiplier={game.difficultyLevels.easy.multiplier}        // ❌ Line 241
  description={game.difficultyLevels.easy.description}      // ❌ Line 242
/>
<DifficultyLevel
  label="Medium"
  icon="🟡"
  multiplier={game.difficultyLevels.medium.multiplier}      // ❌ Line 247
  description={game.difficultyLevels.medium.description}    // ❌ Line 248
/>
<DifficultyLevel
  label="Hard"
  icon="🔴"
  multiplier={game.difficultyLevels.hard.multiplier}        // ❌ Line 253
  description={game.difficultyLevels.hard.description}      // ❌ Line 254
/>

// REQUIRED FIX
<DifficultyLevel
  label="Beginner"
  icon="🟢"
  multiplier={game.difficultyLevels.beginner.multiplier}    // ✅
  description={game.difficultyLevels.beginner.description}  // ✅
/>
<DifficultyLevel
  label="Intermediate"
  icon="🟡"
  multiplier={game.difficultyLevels.intermediate.multiplier}    // ✅
  description={game.difficultyLevels.intermediate.description}  // ✅
/>
<DifficultyLevel
  label="Advanced"
  icon="🔴"
  multiplier={game.difficultyLevels.advanced.multiplier}    // ✅
  description={game.difficultyLevels.advanced.description}  // ✅
/>
```

**Error Messages:**
```
Property 'easy' does not exist on type '{ beginner: {...}; intermediate: {...}; advanced: {...} }'.
Property 'medium' does not exist on type '{ beginner: {...}; intermediate: {...}; advanced: {...} }'.
Property 'hard' does not exist on type '{ beginner: {...}; intermediate: {...}; advanced: {...} }'.
```

---

### Error #7: GameKey Type Mismatch

**File:** `src/lib/games/gameRegistry.ts`  
**Line:** 107  
**Errors:** 1

```typescript
// CURRENT (BROKEN)
export const GAME_REGISTRY: Record<GameKey, GameMetadata> = {
  catapult: { ... },
  smed: {              // ❌ 'smed' doesn't exist in GameKey type
    id: 'smed',
    key: 'smed',
    ...
  },
  ...
}

// OPTION 1: Fix the key name (RECOMMENDED)
export const GAME_REGISTRY: Record<GameKey, GameMetadata> = {
  catapult: { ... },
  smed_challenge: {    // ✅ Matches GameKey type
    id: 'smed_challenge',
    key: 'smed_challenge',
    ...
  },
  ...
}

// OPTION 2: Update GameKey type (if 'smed' is intentional)
// In src/types/games.ts
export type GameKey =
  | 'catapult'
  | 'smed'              // ✅ Add this
  | 'five_s_factory'
  | 'kanban_flow'
  | 'defect_detective'
  | 'vsm_puzzle'
```

**Error Message:**
```
Object literal may only specify known properties, and 'smed' does not exist in type 'Record<GameKey, GameMetadata>'.
```

**Recommendation:** Use Option 1 (rename to `smed_challenge`) to match the `GameKey` type definition in `src/types/games.ts` line 10.

---

## Category 2: Infrastructure Errors (11 errors)

### 🟢 Priority: MEDIUM - Pre-existing Issues

These errors existed before Phase 1 and are in supporting systems (not core game logic).

---

### Error #8: Missing Violation Export

**File:** `src/lib/games/catapult/nelsonRules.ts`  
**Line:** 11  
**Errors:** 1

```typescript
// CURRENT (BROKEN)
import {
  Subgroup,
  ControlLimits,
  Violation,        // ❌ Not exported from controlCharts
  classifyXBarPoint,
  isAboveCenterLine,
  calculateTrend,
  isAlternating
} from './controlCharts'

// REQUIRED FIX: Remove from import (type is likely defined locally)
import {
  Subgroup,
  ControlLimits,
  // Violation removed
  classifyXBarPoint,
  isAboveCenterLine,
  calculateTrend,
  isAlternating
} from './controlCharts'

// Violation type is already defined in nelsonRules.ts
// (See line 22 in nelsonRules.ts)
```

**Error Message:**
```
Module '"./controlCharts"' has no exported member 'Violation'.
```

---

### Error #9: Null Type Assignment

**File:** `src/lib/games/catapult/doeSupabaseService.ts`  
**Line:** 75  
**Errors:** 1

```typescript
// CURRENT (BROKEN)
if (error || !data) {
  throw new Error('Catapult game not found in database')
}

this.gameId = data.id  // ❌ data.id could be null

// REQUIRED FIX: Add null check
if (error || !data || !data.id) {
  throw new Error('Catapult game not found in database')
}

this.gameId = data.id  // ✅ TypeScript knows data.id is not null
```

**Error Message:**
```
Type 'string | null' is not assignable to type 'string'. Type 'null' is not assignable to type 'string'.
```

---

### Error #10-11: Leaderboard Score Property

**File:** `src/lib/games/leaderboardService.ts`  
**Lines:** 227, 249  
**Errors:** 2

```typescript
// CURRENT (BROKEN)
.sort((a, b) => b.score - a.score)  // ❌ Line 227
.sort((a, b) => b.score - a.score)  // ❌ Line 249

// REQUIRED FIX
.sort((a, b) => b.bestScore - a.bestScore)  // ✅
.sort((a, b) => b.bestScore - a.bestScore)  // ✅
```

**Error Message:**
```
Property 'score' does not exist on type 'GameLeaderboard'.
```

**Note:** `GameLeaderboard` interface has `bestScore`, `averageScore`, etc., but not `score`.

---

### Error #12: Invalid Resource Type

**File:** `src/lib/guidance/resources.ts`  
**Line:** 100  
**Errors:** 1

```typescript
// CURRENT (BROKEN)
type: 'course',  // ❌ Not a valid type

// REQUIRED FIX: Use valid type
type: 'video',   // ✅ Or 'article' depending on content
```

**Error Message:**
```
Type '"course"' is not assignable to type '"article" | "template" | "video" | "case-study" | "book" | "tool"'.
```

**Valid Options:** `'article' | 'template' | 'video' | 'case-study' | 'book' | 'tool'`

---

### Error #13: Unknown to Boolean Assignment

**File:** `src/lib/guided-tools/utils.ts`  
**Line:** 171  
**Errors:** 1

```typescript
// CURRENT (BROKEN)
isComplete: someUnknownValue  // ❌ Type 'unknown' not assignable to 'boolean'

// REQUIRED FIX: Add type guard or conversion
isComplete: Boolean(someUnknownValue)  // ✅ Option 1
// OR
isComplete: (someUnknownValue as boolean)  // ✅ Option 2
```

**Error Message:**
```
Type 'unknown' is not assignable to type 'boolean'.
```

---

### Error #14-15: Implicit Any Type

**File:** `src/lib/guided-tools/utils.ts`  
**Line:** 270 (2 errors on same line)  
**Errors:** 2

```typescript
// CURRENT (BROKEN)
const value = obj[key]  // ❌ obj has no index signature

// REQUIRED FIX: Add type assertion
const value = (obj as Record<string, unknown>)[key]  // ✅
```

**Error Message:**
```
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
No index signature with a parameter of type 'string' was found on type '{}'.
```

---

### Error #16: Unknown to String Argument

**File:** `src/lib/guided-tools/validation.ts`  
**Line:** 135  
**Errors:** 1

```typescript
// CURRENT (BROKEN)
someFunction(value)  // ❌ value is unknown, expects string

// REQUIRED FIX: Convert to string
someFunction(String(value))  // ✅
```

**Error Message:**
```
Argument of type 'unknown' is not assignable to parameter of type 'string'.
```

---

### Error #17-18: Unknown Type Property Access

**File:** `src/lib/guided-tools/validation.ts`  
**Lines:** 137, 139  
**Errors:** 2

```typescript
// CURRENT (BROKEN)
value.something  // ❌ 'value' is of type 'unknown'

// REQUIRED FIX: Add type guard
if (typeof value === 'object' && value !== null) {
  // ✅ Safe to access properties
  (value as Record<string, unknown>).something
}
```

**Error Message:**
```
'value' is of type 'unknown'.
```

---

## Fix Priority Order

### Step 1: UI Quick Wins (Est. 10 min)
Fix the 7 cascading UI errors to unblock build:
1. ✅ Update game detail page difficulty keys (6 errors)
2. ✅ Fix GameKey mismatch (1 error)

**Impact:** Build may succeed after this step

---

### Step 2: Infrastructure Cleanup (Est. 30 min)
Fix remaining 11 infrastructure errors:
1. ✅ Remove invalid Violation import (1 error)
2. ✅ Add null check in DOE service (1 error)
3. ✅ Fix leaderboard score properties (2 errors)
4. ✅ Fix resource type (1 error)
5. ✅ Add type guards in guided tools (6 errors)

**Impact:** 100% type safety, production-ready

---

## Testing Commands

```bash
# Check remaining errors
npx tsc --noEmit

# Count errors
npx tsc --noEmit 2>&1 | Select-String -Pattern "error TS" | Measure-Object

# Attempt build
npm run build

# Run linter
npx eslint . --ext .ts,.tsx
```

---

## Success Criteria

- ✅ **0 TypeScript errors**
- ✅ **Build completes successfully**
- ✅ **All tests pass**
- ✅ **Linter shows 0 errors**

---

**Current Status:** 18 errors remaining (70% reduction from 60)  
**Next Milestone:** 11 errors (82% reduction) after UI fixes  
**Final Goal:** 0 errors (100% type safety)

---

**Document Version:** 1.0  
**Last Updated:** October 3, 2025  
**Related:** See `TYPESCRIPT_TYPE_ERRORS_PHASE_1_FIX_2025-10-03.md` for detailed Phase 1 analysis

