# 📘 DAY 11 QUICK REFERENCE

## 🎯 CONTROL CHART CALCULATIONS ENGINE

**File:** `src/lib/games/catapult/controlCharts.ts` (576 lines)

---

## 🔑 KEY FUNCTIONS

### **Subgroup Management**
```typescript
createSubgroup(shots, subgroupNumber) → Subgroup
  Creates a subgroup from catapult shots
  Returns: { id, shots, mean, range, timestamp, subgroupNumber }
```

### **Process Statistics**
```typescript
calculateGrandMean(subgroups) → number
  X̿ = Σx̄ᵢ / k (average of subgroup means)

calculateRBar(subgroups) → number
  R̄ = ΣRᵢ / k (average of subgroup ranges)

calculateProcessStdDev(rBar, subgroupSize) → number
  σ = R̄ / d₂

calculateProcessStatistics(subgroups, subgroupSize) → ProcessStatistics
  Returns: { grandMean, rBar, processStdDev, minValue, maxValue, overallRange }
```

### **Control Limits**
```typescript
calculateXBarLimits(grandMean, rBar, subgroupSize)
  UCL = X̿ + A₂R̄
  CL  = X̿
  LCL = X̿ - A₂R̄

calculateRLimits(rBar, subgroupSize)
  UCL = D₄R̄
  CL  = R̄
  LCL = D₃R̄

calculateControlLimits(subgroups, subgroupSize) → ControlLimits | null
  Complete limits with sigma zones
```

### **Point Classification**
```typescript
classifyXBarPoint(value, controlLimits) → PointZone
  Returns: 'beyond_3sigma' | 'zone_2to3sigma' | 'zone_1to2sigma' | 'zone_center' | 'below_lcl'

isAboveCenterLine(value, centerLine) → boolean
isOutsideControlLimits(value, ucl, lcl) → boolean
```

### **Stability Assessment**
```typescript
assessProcessStability(subgroups, controlLimits, violations) → boolean
  Checks:
  - ≥20 subgroups
  - No high-severity violations
  - All points within control limits
```

### **Pattern Detection (for Nelson Rules)**
```typescript
calculateTrend(values) → 'increasing' | 'decreasing' | 'stable'
isAlternating(values) → boolean
calculateRunLength(values, centerLine, side) → number
```

### **Main Factory**
```typescript
createControlChartData(subgroups, subgroupSize) → ControlChartData
  Returns complete control chart structure
```

---

## 📊 CONTROL CONSTANTS

```typescript
CONTROL_CONSTANTS[n] → { A2, D3, D4, d2 }

// Examples:
CONTROL_CONSTANTS[3] = { A2: 1.023, D3: 0, D4: 2.574, d2: 1.693 }
CONTROL_CONSTANTS[5] = { A2: 0.577, D3: 0, D4: 2.114, d2: 2.326 }
```

**Valid subgroup sizes:** 2, 3, 4, 5, 6, 7, 8, 9, 10

---

## 🏗️ TYPE EXPORTS

```typescript
// From controlCharts.ts (also in catapult.ts)
export interface Subgroup
export interface ControlLimits
export interface ControlConstants
export interface ControlChartData
export interface ProcessStatistics
export type PointZone

export const CONTROL_CONSTANTS
```

---

## 🔗 INTEGRATION EXAMPLE

```typescript
// In game page or component
import {
  createSubgroup,
  createControlChartData,
  calculateProcessStatistics,
  assessProcessStability
} from '@/lib/games/catapult/controlCharts'

// 1. Collect shots in subgroups
const subgroup = createSubgroup(
  [
    { id: 'shot-1', distance: 45.2 },
    { id: 'shot-2', distance: 47.8 },
    { id: 'shot-3', distance: 46.5 }
  ],
  1
)

// 2. After 20+ subgroups, calculate control limits
const chartData = createControlChartData(allSubgroups, 3)

// 3. Display statistics
const stats = calculateProcessStatistics(allSubgroups, 3)

// 4. Check stability
const isStable = assessProcessStability(
  allSubgroups,
  chartData.controlLimits!,
  [] // violations from Nelson Rules
)
```

---

## 📐 FORMULAS

### **X-bar Chart:**
- **UCL:** X̿ + A₂R̄
- **CL:** X̿
- **LCL:** X̿ - A₂R̄

### **R Chart:**
- **UCL:** D₄R̄
- **CL:** R̄
- **LCL:** D₃R̄

### **Process Std Dev:**
- **σ:** R̄ / d₂

---

## ✅ VALIDATION RULES

- **Minimum subgroups:** 20 (for reliable control limits)
- **Subgroup size range:** 2-10 samples
- **Stability criteria:**
  - All X-bar points within UCL/LCL
  - All R points within UCL/LCL
  - No high-severity violations

---

## 🎓 EDUCATIONAL CONCEPTS

1. **Grand Mean (X̿):** Average of all subgroup means
2. **R-bar (R̄):** Average of all subgroup ranges
3. **Control Limits:** Voice of the process (not specifications)
4. **Sigma Zones:** 1σ, 2σ, 3σ for pattern detection
5. **Stability:** Predictable, in statistical control
6. **Common Cause:** Natural variation within control limits
7. **Special Cause:** Assignable variation (out of control)

---

## 🚀 NEXT: DAY 12

**Build:** Nelson Rules Engine (`nelsonRules.ts`)

**Will use these functions:**
- `classifyXBarPoint()`
- `isAboveCenterLine()`
- `calculateTrend()`
- `isAlternating()`
- `calculateRunLength()`

**Will return:**
- `Violation[]` array with detected patterns

---

**Quick Reference Created:** October 3, 2025 ✅
