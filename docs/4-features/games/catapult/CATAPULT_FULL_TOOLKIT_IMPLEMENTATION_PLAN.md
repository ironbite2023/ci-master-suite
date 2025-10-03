# 🎯 Catapult Game - Full Six Sigma Toolkit Implementation Plan

**Version**: 2.0 (Multi-Mode Educational Platform)
**Created**: October 3, 2025
**Status**: Ready for Implementation
**Estimated Duration**: 3 weeks (phased rollout)

---

## 📋 1. DETAILED REQUEST ANALYSIS

### **What Has Been Requested:**

Transform the Catapult game from a single-mode physics game into a **comprehensive Six Sigma training platform** that teaches the complete quality improvement methodology through integrated statistical tools.

### **Core Vision:**

**"One game teaches the entire DMAIC cycle with hands-on application of Six Sigma statistical tools"**

### **Specific Requirements:**

1. **Multi-Mode Architecture**: 5 distinct learning modes within one game
2. **Progressive Learning**: Unlock system that guides users through the Six Sigma workflow
3. **Integrated Tools**: DOE, Normality Tests, Process Capability, Control Charts
4. **Real-World Application**: Mirror actual manufacturing/quality improvement scenarios
5. **Educational Value**: Teach not just individual tools, but how they work together
6. **Phased Rollout**: Deliver value incrementally over 3 weeks

### **The Five Modes:**

#### **Mode 1: Free Play** 🎮
- Exploration and familiarization
- No restrictions, continuous adjustments
- Score-based gameplay
- **Purpose**: Engagement and intuition building

#### **Mode 2: DOE Challenge** 🔬
- 2³ factorial design (8 experiments)
- Main effects and interaction analysis
- Optimization through systematic experimentation
- **Purpose**: Teach Design of Experiments methodology

#### **Mode 3: Validation Study** 📊
- Normality testing (Anderson-Darling, Shapiro-Wilk)
- Data distribution analysis
- Statistical validation
- **Purpose**: Teach data validation and assumption checking

#### **Mode 4: Capability Analysis** 📐
- Process capability indices (Cp, Cpk, Pp, Ppk)
- Specification limits management
- Six Sigma level calculation
- **Purpose**: Teach process capability assessment

#### **Mode 5: Control Phase** 📈
- Statistical Process Control (SPC)
- X-bar and R charts
- Special cause detection
- **Purpose**: Teach process monitoring and control

---

## 💡 2. JUSTIFICATION AND BENEFITS

### **Why This Approach is Superior:**

#### **A. Educational Excellence**

**Traditional Approach (Separate Games):**
```
Catapult → DOE only
5S Game → Organization
SMED → Setup reduction
Problem: Tools taught in isolation, no workflow understanding
```

**Integrated Approach (This Plan):**
```
Catapult Game:
├─ DOE → Optimize settings
├─ Validation → Confirm data quality
├─ Capability → Check if specs are met
└─ Control → Monitor ongoing performance

Advantage: Teaches complete Six Sigma workflow
```

#### **B. Real-World Alignment**

**Manufacturing Scenario Parallel:**
```
Problem: Injection molding produces inconsistent parts

Six Sigma Process:
1. DOE → Test temps, pressures, speeds → Find optimal
2. Validation → Run 30 parts → Check normality
3. Capability → Calculate Cpk → Verify meets specs
4. Control → Daily monitoring → Detect drift

Catapult Game: Teaches EXACT same workflow!
```

#### **C. Competitive Advantage**

| Feature | Competitors | Our Solution |
|---------|------------|--------------|
| DOE Training | Spreadsheet exercises | ✅ Interactive game |
| Tool Integration | Separate modules | ✅ Unified workflow |
| Engagement | Reading materials | ✅ Hands-on gameplay |
| Real-time Feedback | Delayed grading | ✅ Instant insights |
| Certification Prep | Theory-heavy | ✅ Practical application |

#### **D. Business Impact**

- **Premium Justification**: 5 modes = 5x value = higher pricing
- **Differentiation**: No competitor offers integrated Six Sigma game
- **Certification Alignment**: Matches Green Belt/Black Belt curriculum
- **Retention**: Higher replayability = longer engagement
- **Viral Potential**: Users share optimized results and insights

#### **E. Learning Effectiveness**

**Cognitive Benefits:**
- **Contextual Learning**: Tools applied in realistic scenario
- **Progressive Complexity**: Each mode builds on previous
- **Immediate Feedback**: See results of statistical decisions
- **Mental Models**: Understand tool relationships
- **Retention**: Hands-on > passive reading

---

## 🎓 3. PREREQUISITES

### **A. Technical Prerequisites**

#### **Already Implemented:**
- ✅ Core catapult physics engine
- ✅ Canvas rendering system
- ✅ Projectile motion calculations
- ✅ Scoring system
- ✅ Free play controls
- ✅ Shot tracking and history
- ✅ Type definitions for DOE

#### **Libraries Available:**
- ✅ Recharts (for statistical visualizations)
- ✅ React state management
- ✅ Shadcn UI components
- ✅ Canvas API

#### **Need to Add:**
- 📦 Statistical calculation libraries (or implement native)
- 📦 Chart components for control charts
- 📦 Data export functionality (CSV/Excel)

### **B. Knowledge Prerequisites**

#### **Statistical Concepts to Implement:**

**1. Design of Experiments:**
- Factorial design (2^k)
- Main effects calculation
- Interaction effects
- Optimal settings prediction

**2. Normality Testing:**
- Anderson-Darling test
- Shapiro-Wilk test
- Kolmogorov-Smirnov test
- Q-Q plots
- Probability plots

**3. Process Capability:**
- Cp, Cpk, Pp, Ppk formulas
- Sigma level calculation
- Specification limits
- Process performance indices

**4. Statistical Process Control:**
- Control chart theory
- Control limit calculations (±3σ)
- Nelson rules (8 tests)
- Western Electric rules
- Rational subgrouping

### **C. Data Requirements**

**Minimum Sample Sizes:**
- DOE: 8 experiments (one per factorial combination)
- Normality: 30 data points minimum
- Capability: 100+ data points recommended
- Control Charts: 20-25 subgroups of 3-5 samples

### **D. User Flow Prerequisites**

**Progressive Unlocking Logic:**
```
Free Play (Always Available)
    ↓
DOE Mode (Unlocks after tutorial)
    ↓ (Complete 8 experiments)
Validation Mode (Unlocks after DOE complete)
    ↓ (Pass normality test)
Capability Mode (Unlocks after validation)
    ↓ (Calculate Cpk)
Control Charts (Unlocks after capability)
    ↓ (Monitor process)
Black Belt Certification Ready! 🎓
```

---

## 🚀 4. IMPLEMENTATION METHODOLOGY

### **PHASED ROLLOUT STRATEGY**

---

## **📅 WEEK 1: FOUNDATION + DOE MODE**

### **Phase 1.1: Foundation (Days 1-2)**

#### **Day 1: Multi-Mode Architecture**

**A. File Structure Setup**
```
src/lib/games/catapult/
├── physics.ts                    [EXISTING]
├── scoring.ts                    [EXISTING]
├── doeEngine.ts                  [NEW] - Experiment generation
├── doeCalculations.ts            [NEW] - Statistical analysis
├── statisticalHelpers.ts         [NEW] - Common functions

src/components/games/catapult/
├── CatapultCanvas.tsx            [EXISTING]
├── CatapultControls.tsx          [EXISTING]
├── ModeSelector.tsx              [NEW] - Mode switching UI
├── GameProgress.tsx              [NEW] - Unlock tracking

src/app/games/play/catapult/
└── page.tsx                      [UPDATE] - Multi-mode orchestration
```

**B. Create Mode Selector Component**

`src/components/games/catapult/ModeSelector.tsx`

**Features:**
- Tab interface for mode selection
- Lock icons for unavailable modes
- Progress indicators
- Tooltips explaining each mode
- Achievement badges

**Visual Design:**
```typescript
┌────────────────────────────────────────────────────┐
│       🎯 CATAPULT QUALITY LAB                      │
├────────────────────────────────────────────────────┤
│                                                    │
│  [🎮 Free Play] [🔬 DOE] [📊 Valid] [📐 Cap] [📈] │
│      Active      Ready    🔒       🔒      🔒     │
│                                                    │
│  Progress: [██████████░░░░░░░░] 50% Complete      │
│  Next Unlock: Validation Study (Complete DOE)     │
└────────────────────────────────────────────────────┘
```

**C. Update Game State Management**

`src/app/games/play/catapult/page.tsx`

Add state:
```typescript
const [gameMode, setGameMode] = useState<GameMode>('freeplay')
const [unlockedModes, setUnlockedModes] = useState<GameMode[]>(['freeplay'])
const [experiments, setExperiments] = useState<DOEExperiment[]>([])
const [validationData, setValidationData] = useState<ValidationData | null>(null)
const [capabilityData, setCapabilityData] = useState<CapabilityData | null>(null)
const [controlData, setControlData] = useState<ControlChartData | null>(null)
```

**D. Type Definitions Update**

`src/types/catapult.ts`

Add new types:
```typescript
export type GameMode = 'freeplay' | 'doe' | 'validation' | 'capability' | 'control'

export interface GameProgress {
  unlockedModes: GameMode[]
  completedModes: GameMode[]
  currentMode: GameMode
  achievements: Achievement[]
}

export interface ValidationData {
  shots: Shot[]
  normalityTests: {
    andersonDarling: { statistic: number; pValue: number; isNormal: boolean }
    shapiroWilk: { statistic: number; pValue: number; isNormal: boolean }
  }
  descriptiveStats: {
    mean: number
    median: number
    stdDev: number
    min: number
    max: number
  }
}

export interface CapabilityData {
  specifications: {
    USL: number // Upper Spec Limit
    LSL: number // Lower Spec Limit
    target: number
  }
  indices: {
    Cp: number
    Cpk: number
    Pp: number
    Ppk: number
    Cpm: number
  }
  sigmaLevel: number
  ppm: number // Parts per million defective
}

export interface ControlChartData {
  subgroups: Subgroup[]
  controlLimits: {
    xbar: { UCL: number; CL: number; LCL: number }
    range: { UCL: number; CL: number; LCL: number }
  }
  violations: Violation[]
}

export interface Subgroup {
  id: number
  samples: number[]
  xbar: number
  range: number
  timestamp: number
}

export interface Violation {
  subgroupId: number
  rule: string
  severity: 'warning' | 'critical'
  description: string
}
```

#### **Day 2: DOE Engine**

**A. Create DOE Engine**

`src/lib/games/catapult/doeEngine.ts`

**Functions:**

```typescript
/**
 * Generate all 8 factorial experiments for 2^3 design
 */
export function generateDOEExperiments(): DOEExperiment[] {
  const experiments: DOEExperiment[] = []
  
  // 2^3 = 8 combinations
  const levels = [
    { angle: 'low', force: 'low', weight: 'low' },
    { angle: 'high', force: 'low', weight: 'low' },
    { angle: 'low', force: 'high', weight: 'low' },
    { angle: 'high', force: 'high', weight: 'low' },
    { angle: 'low', force: 'low', weight: 'high' },
    { angle: 'high', force: 'low', weight: 'high' },
    { angle: 'low', force: 'high', weight: 'high' },
    { angle: 'high', force: 'high', weight: 'high' }
  ]
  
  levels.forEach((level, index) => {
    experiments.push({
      runNumber: index + 1,
      angle: level.angle as 'low' | 'high',
      force: level.force as 'low' | 'high',
      weight: level.weight as 'low' | 'high',
      angleValue: DOE_LEVELS.angle[level.angle],
      forceValue: DOE_LEVELS.force[level.force],
      weightValue: DOE_LEVELS.weight[level.weight],
      completed: false,
      result: undefined
    })
  })
  
  return experiments
}

/**
 * Get the next incomplete experiment
 */
export function getNextIncompleteExperiment(
  experiments: DOEExperiment[]
): DOEExperiment | null {
  return experiments.find(exp => !exp.completed) || null
}

/**
 * Check if all experiments are complete
 */
export function isExperimentSetComplete(experiments: DOEExperiment[]): boolean {
  return experiments.every(exp => exp.completed)
}

/**
 * Load specific experiment settings
 */
export function loadExperimentSettings(experiment: DOEExperiment): CatapultSettings {
  return {
    angle: experiment.angleValue,
    force: experiment.forceValue,
    weight: experiment.weightValue
  }
}

/**
 * Save result to experiment
 */
export function saveExperimentResult(
  experiments: DOEExperiment[],
  runNumber: number,
  result: DOEResult
): DOEExperiment[] {
  return experiments.map(exp =>
    exp.runNumber === runNumber
      ? { ...exp, completed: true, result }
      : exp
  )
}

/**
 * Reset all experiments
 */
export function resetExperiments(experiments: DOEExperiment[]): DOEExperiment[] {
  return experiments.map(exp => ({
    ...exp,
    completed: false,
    result: undefined
  }))
}
```

**B. Create DOE Calculations**

`src/lib/games/catapult/doeCalculations.ts`

**Functions:**

```typescript
/**
 * Calculate main effects for each factor
 * Main Effect = (Avg of High Levels) - (Avg of Low Levels)
 */
export function calculateMainEffects(experiments: DOEExperiment[]): {
  angle: number
  force: number
  weight: number
} {
  const completed = experiments.filter(exp => exp.completed && exp.result)
  
  if (completed.length < 8) {
    throw new Error('All 8 experiments must be completed for analysis')
  }
  
  // Calculate average distance for high and low levels of each factor
  const angleHigh = completed
    .filter(exp => exp.angle === 'high')
    .reduce((sum, exp) => sum + exp.result!.distance, 0) / 4
  
  const angleLow = completed
    .filter(exp => exp.angle === 'low')
    .reduce((sum, exp) => sum + exp.result!.distance, 0) / 4
  
  const forceHigh = completed
    .filter(exp => exp.force === 'high')
    .reduce((sum, exp) => sum + exp.result!.distance, 0) / 4
  
  const forceLow = completed
    .filter(exp => exp.force === 'low')
    .reduce((sum, exp) => sum + exp.result!.distance, 0) / 4
  
  const weightHigh = completed
    .filter(exp => exp.weight === 'high')
    .reduce((sum, exp) => sum + exp.result!.distance, 0) / 4
  
  const weightLow = completed
    .filter(exp => exp.weight === 'low')
    .reduce((sum, exp) => sum + exp.result!.distance, 0) / 4
  
  return {
    angle: angleHigh - angleLow,
    force: forceHigh - forceLow,
    weight: weightHigh - weightLow
  }
}

/**
 * Calculate 2-factor interaction effects
 * AB Interaction = 0.5 * [(A+B+) + (A-B-) - (A+B-) - (A-B+)]
 */
export function calculateInteractions(experiments: DOEExperiment[]): {
  angleForce: number
  angleWeight: number
  forceWeight: number
} {
  const completed = experiments.filter(exp => exp.completed && exp.result)
  
  // Helper to get experiment distance by levels
  const getDist = (a: string, f: string, w: string) => {
    const exp = completed.find(
      e => e.angle === a && e.force === f && e.weight === w
    )
    return exp?.result?.distance || 0
  }
  
  // Angle × Force interaction
  const angleForce = 0.5 * (
    getDist('high', 'high', 'low') + getDist('low', 'low', 'low') -
    getDist('high', 'low', 'low') - getDist('low', 'high', 'low')
  )
  
  // Angle × Weight interaction
  const angleWeight = 0.5 * (
    getDist('high', 'low', 'high') + getDist('low', 'low', 'low') -
    getDist('high', 'low', 'low') - getDist('low', 'low', 'high')
  )
  
  // Force × Weight interaction
  const forceWeight = 0.5 * (
    getDist('low', 'high', 'high') + getDist('low', 'low', 'low') -
    getDist('low', 'high', 'low') - getDist('low', 'low', 'high')
  )
  
  return { angleForce, angleWeight, forceWeight }
}

/**
 * Find optimal settings based on main effects
 */
export function findOptimalSettings(mainEffects: {
  angle: number
  force: number
  weight: number
}): CatapultSettings {
  return {
    angle: mainEffects.angle > 0 ? DOE_LEVELS.angle.high : DOE_LEVELS.angle.low,
    force: mainEffects.force > 0 ? DOE_LEVELS.force.high : DOE_LEVELS.force.low,
    weight: mainEffects.weight > 0 ? DOE_LEVELS.weight.high : DOE_LEVELS.weight.low
  }
}

/**
 * Generate insights from DOE analysis
 */
export function generateInsights(
  mainEffects: { angle: number; force: number; weight: number },
  interactions: { angleForce: number; angleWeight: number; forceWeight: number },
  experiments: DOEExperiment[]
): string[] {
  const insights: string[] = []
  
  // Identify strongest main effect
  const effects = [
    { name: 'Force', value: Math.abs(mainEffects.force) },
    { name: 'Angle', value: Math.abs(mainEffects.angle) },
    { name: 'Weight', value: Math.abs(mainEffects.weight) }
  ].sort((a, b) => b.value - a.value)
  
  insights.push(`${effects[0].name} has the strongest impact on distance (+${effects[0].value.toFixed(1)}m)`)
  
  // Main effect insights
  if (mainEffects.angle > 0) {
    insights.push(`Higher angle significantly improves distance (+${mainEffects.angle.toFixed(1)}m)`)
  } else {
    insights.push(`Lower angle performs better (-${Math.abs(mainEffects.angle).toFixed(1)}m penalty for high)`)
  }
  
  if (mainEffects.weight < 0) {
    insights.push(`Lighter projectiles travel farther (${Math.abs(mainEffects.weight).toFixed(1)}m advantage)`)
  }
  
  // Interaction insights
  if (Math.abs(interactions.angleForce) > 5) {
    const type = interactions.angleForce > 0 ? 'synergistically' : 'antagonistically'
    insights.push(`Angle and force work ${type} together (${interactions.angleForce.toFixed(1)}m interaction)`)
  }
  
  // Optimal settings
  const optimal = findOptimalSettings(mainEffects)
  insights.push(
    `Optimal settings: ${optimal.angle}° angle, ${optimal.force}N force, ${optimal.weight} weight`
  )
  
  return insights
}

/**
 * Calculate predicted response for any setting combination
 */
export function predictResponse(
  settings: CatapultSettings,
  experiments: DOEExperiment[]
): number {
  const avgDistance = experiments
    .filter(exp => exp.completed && exp.result)
    .reduce((sum, exp) => sum + exp.result!.distance, 0) / 8
  
  const mainEffects = calculateMainEffects(experiments)
  const interactions = calculateInteractions(experiments)
  
  // Build prediction using regression model
  let prediction = avgDistance
  
  // Add main effects
  prediction += (settings.angle === DOE_LEVELS.angle.high ? 1 : -1) * (mainEffects.angle / 2)
  prediction += (settings.force === DOE_LEVELS.force.high ? 1 : -1) * (mainEffects.force / 2)
  prediction += (settings.weight === DOE_LEVELS.weight.high ? 1 : -1) * (mainEffects.weight / 2)
  
  return prediction
}
```

### **Phase 1.2: DOE UI Components (Days 3-4)**

#### **Day 3: DOE Controls**

**A. Create DOE Controls Component**

`src/components/games/catapult/DOEControls.tsx`

**Features:**
- Level toggle buttons (Low/High) for each factor
- Current experiment indicator
- Progress bar
- Auto-load next experiment
- "Run Experiment" button
- "Auto-Run All" option

**Visual Design:**
```typescript
┌─────────────────────────────────────────┐
│  🔬 DOE EXPERIMENT MODE                 │
│                                         │
│  Experiment 3 of 8                      │
│  [████████░░░░░░░░░░░░░░] 37%          │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Angle                            │  │
│  │ [LOW: 30°] [HIGH: 60°]  ← HIGH   │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Force                            │  │
│  │ [LOW: 75N] [HIGH: 125N] ← HIGH   │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Weight                           │  │
│  │ [LOW] [HIGH]            ← LOW    │  │
│  └──────────────────────────────────┘  │
│                                         │
│  Current Settings: 60°, 125N, Light    │
│                                         │
│  [Launch Experiment] [Auto-Run All]    │
│  [Load Next] [View Matrix]             │
└─────────────────────────────────────────┘
```

**B. Create Experiment Matrix**

`src/components/games/catapult/ExperimentMatrix.tsx`

**Features:**
- 8-row table with all factorial combinations
- Status indicators (✅ ⏳ ⬜)
- Click row to load settings
- Sort by any column
- Export results (CSV)
- Reset all experiments

**Table Structure:**
```typescript
Run | Angle | Force | Weight | Distance | Accuracy | Score | Status
----|-------|-------|--------|----------|----------|-------|--------
 1  |  LOW  |  LOW  |  LOW   | 142.3m   |   78%    | 1,234 |   ✅
 2  | HIGH  |  LOW  |  LOW   | 178.5m   |   82%    | 1,567 |   ✅
 3  |  LOW  | HIGH  |  LOW   | 167.8m   |   85%    | 1,445 |   ⏳
 4  | HIGH  | HIGH  |  LOW   |    -     |    -     |   -   |   ⬜
 5  |  LOW  |  LOW  | HIGH   |    -     |    -     |   -   |   ⬜
 6  | HIGH  |  LOW  | HIGH   |    -     |    -     |   -   |   ⬜
 7  |  LOW  | HIGH  | HIGH   |    -     |    -     |   -   |   ⬜
 8  | HIGH  | HIGH  | HIGH   |    -     |    -     |   -   |   ⬜
```

#### **Day 4: DOE Analysis Dashboard**

**A. Create Analysis Component**

`src/components/games/catapult/DOEAnalysis.tsx`

**Sections:**

**1. Main Effects Display:**
```typescript
🎯 MAIN EFFECTS (Individual Factor Impact)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Factor    Effect     Impact      Visualization
─────────────────────────────────────────────
Force    +42.7m     ████████████████████  HIGH
Angle    +24.3m     ████████████░░░░░░░░  MODERATE  
Weight   -18.5m     ████████░░░░░░░░░░░░  LOW (negative)

Interpretation:
• Force is the most critical factor
• Increasing angle improves distance
• Heavier projectiles reduce distance
```

**2. Interaction Effects:**
```typescript
🔀 INTERACTION EFFECTS (Factor Combinations)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Interaction      Value    Type            Significance
────────────────────────────────────────────────────
Angle × Force   +8.2m    Synergistic ↗   Moderate
Angle × Weight  -3.1m    Antagonistic ↘  Low
Force × Weight  +1.4m    Minimal →       Negligible

Key Finding:
• Angle and force enhance each other's effects
• Combining high angle + high force gives bonus distance
```

**3. Optimal Settings Card:**
```typescript
⭐ RECOMMENDED OPTIMAL SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Angle:  60° (HIGH)  ✅
Force:  125N (HIGH) ✅
Weight: Light (LOW) ✅

Predicted Distance: 223.4m
Expected Accuracy: 87%
Estimated Score: 2,450 points

[Test These Settings] [Save Configuration]
```

**4. Insights Panel:**
```typescript
💡 KEY INSIGHTS & RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Force has the strongest impact on distance
  → Prioritize high force settings in applications

✓ Higher angle significantly improves distance
  → Use 60° for maximum range

✓ Lighter projectiles travel farther
  → Weight reduction offers clear advantage

✓ Angle and force work synergistically
  → Combining both at high levels maximizes results

✓ Weight has minimal interaction with other factors
  → Can be optimized independently

Next Steps:
→ Run validation study to confirm consistency
→ Test optimal settings 30 times
→ Unlock Capability Analysis mode
```

**B. Create Visualization Charts**

Use Recharts for:

**1. Main Effects Plot:**
```typescript
<BarChart data={mainEffectsData}>
  <XAxis dataKey="factor" />
  <YAxis label="Effect on Distance (m)" />
  <Bar dataKey="effect" fill={effect > 0 ? '#10b981' : '#ef4444'} />
  <Tooltip />
</BarChart>
```

**2. Interaction Plot:**
```typescript
<LineChart data={interactionData}>
  <XAxis dataKey="level" />
  <YAxis label="Average Distance (m)" />
  <Line dataKey="lowForce" stroke="#3b82f6" />
  <Line dataKey="highForce" stroke="#10b981" />
  <Legend />
</LineChart>
```

**3. Pareto Chart:**
```typescript
<ComposedChart data={paretoData}>
  <Bar dataKey="effectSize" fill="#3b82f6" />
  <Line dataKey="cumulativePercent" stroke="#ef4444" />
  <Tooltip />
</ComposedChart>
```

### **Phase 1.3: Integration & Testing (Day 5)**

#### **Integration Tasks:**

**A. Update Main Game Page**

Add DOE mode logic:
```typescript
const handleExperimentComplete = (result: DOEResult) => {
  const updatedExperiments = saveExperimentResult(
    experiments,
    currentExperiment,
    result
  )
  setExperiments(updatedExperiments)
  
  if (isExperimentSetComplete(updatedExperiments)) {
    // All experiments done!
    showAnalysisDashboard()
    unlockValidationMode()
  } else {
    // Load next experiment
    const next = getNextIncompleteExperiment(updatedExperiments)
    if (next) {
      loadExperimentSettings(next)
    }
  }
}
```

**B. Achievement System**

Add DOE achievements:
```typescript
const DOE_ACHIEVEMENTS = [
  {
    id: 'first_experiment',
    name: 'First Steps',
    description: 'Complete your first DOE experiment',
    icon: '🔬',
    condition: (experiments) => experiments.filter(e => e.completed).length >= 1
  },
  {
    id: 'halfway',
    name: 'Halfway There',
    description: 'Complete 4 DOE experiments',
    icon: '📊',
    condition: (experiments) => experiments.filter(e => e.completed).length >= 4
  },
  {
    id: 'full_factorial',
    name: 'Full Factorial',
    description: 'Complete all 8 DOE experiments',
    icon: '🎯',
    condition: (experiments) => isExperimentSetComplete(experiments)
  },
  {
    id: 'data_scientist',
    name: 'Data Scientist',
    description: 'Analyze DOE results',
    icon: '📈',
    condition: (_, analysisViewed) => analysisViewed
  },
  {
    id: 'optimizer',
    name: 'Optimizer',
    description: 'Test optimal settings',
    icon: '⭐',
    condition: (_, __, optimalTested) => optimalTested
  }
]
```

**C. Testing Checklist**

- [ ] Mode switching works smoothly
- [ ] Experiments generate correctly (8 unique combinations)
- [ ] Can complete experiments in any order
- [ ] Results save correctly
- [ ] Analysis calculates accurate statistics
- [ ] Charts render properly
- [ ] Optimal settings are correct
- [ ] Achievements unlock appropriately
- [ ] Mobile responsive
- [ ] No console errors

### **📦 Week 1 Deliverable:**

✅ **Fully functional DOE mode integrated with Free Play**
- Users can switch between modes
- Complete 8 factorial experiments
- View detailed statistical analysis
- Unlock validation mode

---

## **📅 WEEK 2: VALIDATION + CAPABILITY MODES**

### **Phase 2.1: Normality Testing (Days 6-7)**

#### **Day 6: Statistical Functions**

**A. Create Statistical Helpers**

`src/lib/games/catapult/statisticalHelpers.ts`

**Common functions:**
```typescript
// Descriptive statistics
export function calculateMean(data: number[]): number
export function calculateMedian(data: number[]): number
export function calculateStdDev(data: number[], sample = true): number
export function calculateVariance(data: number[], sample = true): number
export function calculateRange(data: number[]): { min: number; max: number }

// Distribution functions
export function calculateSkewness(data: number[]): number
export function calculateKurtosis(data: number[]): number
export function sortData(data: number[]): number[]
export function calculatePercentile(data: number[], percentile: number): number

// Utilities
export function generateHistogramBins(data: number[], binCount?: number)
export function calculateZScores(data: number[]): number[]
```

**B. Create Normality Test Functions**

`src/lib/games/catapult/normalityTests.ts`

**Tests to implement:**

**1. Anderson-Darling Test:**
```typescript
export function andersonDarlingTest(data: number[]): {
  statistic: number
  pValue: number
  isNormal: boolean
  criticalValues: { alpha: number; value: number }[]
} {
  // 1. Calculate mean and std dev
  const mean = calculateMean(data)
  const stdDev = calculateStdDev(data)
  
  // 2. Calculate z-scores and sort
  const zScores = data.map(x => (x - mean) / stdDev).sort((a, b) => a - b)
  const n = data.length
  
  // 3. Calculate A² statistic
  let sum = 0
  for (let i = 0; i < n; i++) {
    const z = zScores[i]
    const phi = normalCDF(z)
    sum += (2 * (i + 1) - 1) * (Math.log(phi) + Math.log(1 - zScores[n - 1 - i]))
  }
  
  const A2 = -n - (1 / n) * sum
  
  // 4. Compare to critical values
  const criticalValues = [
    { alpha: 0.01, value: 1.035 },
    { alpha: 0.05, value: 0.752 },
    { alpha: 0.10, value: 0.631 }
  ]
  
  const pValue = interpolatePValue(A2, criticalValues)
  const isNormal = pValue > 0.05
  
  return { statistic: A2, pValue, isNormal, criticalValues }
}
```

**2. Shapiro-Wilk Test:**
```typescript
export function shapiroWilkTest(data: number[]): {
  statistic: number
  pValue: number
  isNormal: boolean
} {
  const n = data.length
  const sortedData = sortData(data)
  
  // Calculate W statistic (simplified implementation)
  const mean = calculateMean(sortedData)
  const numerator = calculateShapiroNumerator(sortedData, mean)
  const denominator = calculateShapiroDenominator(sortedData, mean)
  
  const W = numerator / denominator
  const pValue = shapiroWilkPValue(W, n)
  const isNormal = pValue > 0.05
  
  return { statistic: W, pValue, isNormal }
}
```

**3. Kolmogorov-Smirnov Test:**
```typescript
export function kolmogorovSmirnovTest(data: number[]): {
  statistic: number
  pValue: number
  isNormal: boolean
} {
  // Implementation of KS test
  // Compare empirical CDF to theoretical normal CDF
}
```

**C. Generate Q-Q Plot Data**

```typescript
export function generateQQPlotData(data: number[]): {
  theoretical: number[]
  observed: number[]
  referenceLineSlope: number
  referenceLineIntercept: number
} {
  const sortedData = sortData(data)
  const n = sortedData.length
  
  // Calculate theoretical quantiles (normal distribution)
  const theoretical = []
  for (let i = 1; i <= n; i++) {
    const p = (i - 0.5) / n
    theoretical.push(normalQuantile(p))
  }
  
  // Calculate reference line (perfect normality)
  const mean = calculateMean(sortedData)
  const stdDev = calculateStdDev(sortedData)
  
  return {
    theoretical,
    observed: sortedData,
    referenceLineSlope: stdDev,
    referenceLineIntercept: mean
  }
}
```

#### **Day 7: Validation UI Components**

**A. Create Validation Controls**

`src/components/games/catapult/ValidationControls.tsx`

**Features:**
- Display optimal settings from DOE
- "Run Validation Shot" button
- Progress indicator (shots completed / 30)
- Current statistics display
- "Analyze Results" button (enabled at 30+ shots)

**Visual:**
```typescript
┌──────────────────────────────────────────┐
│  📊 VALIDATION STUDY                     │
│                                          │
│  Testing Optimal Settings:               │
│  • Angle: 60°                           │
│  • Force: 125N                          │
│  • Weight: Light                        │
│                                          │
│  Progress: [████████████████░░] 24/30   │
│                                          │
│  Current Statistics:                     │
│  Mean Distance: 218.3m                  │
│  Std Deviation: 12.4m                   │
│  Range: 195.2m - 241.5m                 │
│                                          │
│  [Run Validation Shot]                   │
│  [Analyze Results] (unlocks at 30)      │
└──────────────────────────────────────────┘
```

**B. Create Normality Dashboard**

`src/components/games/catapult/NormalityDashboard.tsx`

**Sections:**

**1. Test Results Summary:**
```typescript
📊 NORMALITY TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test                 Statistic   P-Value   Result
─────────────────────────────────────────────────
Anderson-Darling     0.432       0.287     ✅ Normal
Shapiro-Wilk         0.967       0.324     ✅ Normal
Kolmogorov-Smirnov   0.089       0.412     ✅ Normal

Conclusion: Data follows normal distribution ✅
P-values > 0.05 indicate normality
```

**2. Descriptive Statistics:**
```typescript
📈 DESCRIPTIVE STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Metric           Value
────────────────────────
Sample Size      30
Mean             218.3m
Median           217.8m
Std Deviation    12.4m
Min              195.2m
Max              241.5m
Range            46.3m
Skewness         0.12 (slightly right-skewed)
Kurtosis         -0.45 (slightly platykurtic)
```

**3. Histogram with Normal Curve:**
```typescript
<ResponsiveContainer width="100%" height={300}>
  <ComposedChart data={histogramData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="bin" label="Distance (m)" />
    <YAxis label="Frequency" />
    <Bar dataKey="frequency" fill="#3b82f6" />
    <Line 
      dataKey="normalCurve" 
      stroke="#ef4444" 
      strokeWidth={2}
      dot={false}
    />
    <Legend />
  </ComposedChart>
</ResponsiveContainer>
```

**4. Q-Q Plot:**
```typescript
<ResponsiveContainer width="100%" height={300}>
  <ScatterChart>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="theoretical" 
      label="Theoretical Quantiles"
    />
    <YAxis 
      dataKey="observed" 
      label="Sample Quantiles"
    />
    <Scatter 
      data={qqData} 
      fill="#3b82f6"
    />
    <Line 
      data={referenceLine} 
      dataKey="y"
      stroke="#ef4444"
      strokeWidth={2}
      dot={false}
    />
    <Tooltip />
  </ScatterChart>
</ResponsiveContainer>
```

**5. Insights Panel:**
```typescript
💡 VALIDATION INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Data passes normality tests
   → Statistical methods are valid

✅ Low standard deviation (12.4m)
   → Settings produce consistent results

✅ Mean close to predicted (218.3m vs 223.4m)
   → DOE model is accurate

✅ Minimal skewness (0.12)
   → Symmetric distribution

Next Step:
→ Proceed to Capability Analysis
→ Check if process meets specifications
```

### **Phase 2.2: Capability Analysis (Days 8-9)**

#### **Day 8: Capability Calculations**

**A. Create Capability Functions**

`src/lib/games/catapult/capabilityAnalysis.ts`

**Functions:**

```typescript
/**
 * Calculate process capability indices
 */
export function calculateCapabilityIndices(
  data: number[],
  USL: number, // Upper Specification Limit
  LSL: number, // Lower Specification Limit
  target?: number
): {
  Cp: number
  Cpk: number
  Pp: number
  Ppk: number
  Cpm: number
} {
  const mean = calculateMean(data)
  const stdDevWithin = calculateStdDev(data, true) // Short-term variation
  const stdDevOverall = calculateStdDev(data, false) // Long-term variation
  
  // Process Capability (short-term)
  const Cp = (USL - LSL) / (6 * stdDevWithin)
  
  const Cpu = (USL - mean) / (3 * stdDevWithin)
  const Cpl = (mean - LSL) / (3 * stdDevWithin)
  const Cpk = Math.min(Cpu, Cpl)
  
  // Process Performance (long-term)
  const Pp = (USL - LSL) / (6 * stdDevOverall)
  
  const Ppu = (USL - mean) / (3 * stdDevOverall)
  const Ppl = (mean - LSL) / (3 * stdDevOverall)
  const Ppk = Math.min(Ppu, Ppl)
  
  // Taguchi index (if target specified)
  let Cpm = 0
  if (target !== undefined) {
    const tau = Math.sqrt(stdDevWithin ** 2 + (mean - target) ** 2)
    Cpm = (USL - LSL) / (6 * tau)
  }
  
  return { Cp, Cpk, Pp, Ppk, Cpm }
}

/**
 * Calculate sigma level
 */
export function calculateSigmaLevel(
  data: number[],
  USL: number,
  LSL: number
): number {
  const mean = calculateMean(data)
  const stdDev = calculateStdDev(data)
  
  // Distance to nearest spec limit in standard deviations
  const distanceToUSL = (USL - mean) / stdDev
  const distanceToLSL = (mean - LSL) / stdDev
  
  return Math.min(distanceToUSL, distanceToLSL)
}

/**
 * Calculate defects per million opportunities (DPMO)
 */
export function calculateDPMO(
  data: number[],
  USL: number,
  LSL: number
): number {
  const defects = data.filter(x => x < LSL || x > USL).length
  const opportunities = data.length
  
  return (defects / opportunities) * 1_000_000
}

/**
 * Calculate process yield
 */
export function calculateYield(
  data: number[],
  USL: number,
  LSL: number
): {
  withinSpec: number
  outOfSpec: number
  yieldPercent: number
} {
  const withinSpec = data.filter(x => x >= LSL && x <= USL).length
  const outOfSpec = data.length - withinSpec
  const yieldPercent = (withinSpec / data.length) * 100
  
  return { withinSpec, outOfSpec, yieldPercent }
}

/**
 * Interpret capability index
 */
export function interpretCapability(cpk: number): {
  rating: string
  color: string
  description: string
  recommendation: string
} {
  if (cpk >= 2.0) {
    return {
      rating: 'Excellent',
      color: '#10b981',
      description: '6σ capable',
      recommendation: 'Maintain current process'
    }
  } else if (cpk >= 1.33) {
    return {
      rating: 'Adequate',
      color: '#3b82f6',
      description: '4σ capable',
      recommendation: 'Process meets requirements'
    }
  } else if (cpk >= 1.0) {
    return {
      rating: 'Marginal',
      color: '#f59e0b',
      description: '3σ capable',
      recommendation: 'Improvement needed'
    }
  } else {
    return {
      rating: 'Inadequate',
      color: '#ef4444',
      description: 'Not capable',
      recommendation: 'Immediate action required'
    }
  }
}
```

#### **Day 9: Capability UI**

**A. Create Capability Controls**

`src/components/games/catapult/CapabilityControls.tsx`

**Features:**
- Specification limits input (USL, LSL, Target)
- Suggested specs based on target zones
- Data collection progress
- "Calculate Capability" button

**Visual:**
```typescript
┌──────────────────────────────────────────┐
│  📐 PROCESS CAPABILITY ANALYSIS          │
│                                          │
│  Define Specification Limits:            │
│                                          │
│  Target Zone: ⚪ Mid Zone (200-250m)    │
│                                          │
│  Lower Spec Limit (LSL): [200] m        │
│  Target:                  [225] m        │
│  Upper Spec Limit (USL): [250] m        │
│                                          │
│  Data Collected: [████████████] 100 pts │
│                                          │
│  [Calculate Capability]                  │
│  [Use Target Zone Specs] [Custom]       │
└──────────────────────────────────────────┘
```

**B. Create Capability Dashboard**

`src/components/games/catapult/CapabilityDashboard.tsx`

**Sections:**

**1. Capability Indices:**
```typescript
📐 CAPABILITY INDICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Index   Value   Rating      Interpretation
──────────────────────────────────────────
Cp      1.67    ✅ Excellent Process centered, capable
Cpk     1.45    ✅ Adequate  Process meets specs
Pp      1.62    ✅ Excellent Long-term performance
Ppk     1.41    ✅ Adequate  Consistent capability
Cpm     1.38    ✅ Adequate  On-target performance

Overall: Process is CAPABLE ✅
Sigma Level: 4.35σ
DPMO: 12 defects per million
```

**2. Capability Histogram:**
```typescript
<ResponsiveContainer width="100%" height={300}>
  <ComposedChart data={capabilityHistogram}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="bin" />
    <YAxis />
    
    {/* Histogram bars */}
    <Bar dataKey="frequency" fill="#3b82f6" />
    
    {/* Process curve */}
    <Line 
      dataKey="processCurve" 
      stroke="#10b981"
      strokeWidth={2}
      dot={false}
    />
    
    {/* Spec limits */}
    <ReferenceLine x={LSL} stroke="#ef4444" strokeWidth={2} label="LSL" />
    <ReferenceLine x={USL} stroke="#ef4444" strokeWidth={2} label="USL" />
    <ReferenceLine x={target} stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" label="Target" />
    
    <Tooltip />
  </ComposedChart>
</ResponsiveContainer>
```

**3. Process Performance:**
```typescript
📊 PROCESS PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Metric                 Value
──────────────────────────────
Within Specification   98 / 100 (98%)
Out of Specification   2 / 100 (2%)
Process Yield          98.0%
Defect Rate            2.0%
DPMO                   20,000

Target Performance:    224.3m (Target: 225m)
Offset from Target:    -0.7m (0.3%)
```

**4. Visual Capability:**
```typescript
┌────────────────────────────────────────┐
│                                        │
│  LSL          Target          USL     │
│  200m         225m            250m    │
│   │            │               │      │
│   ▼            ▼               ▼      │
│   ├────────────┼───────────────┤      │
│                                        │
│        ╱──────╲                       │
│       ╱   μ    ╲                      │
│      ╱   224.3  ╲                     │
│     ╱            ╲                    │
│    ╱──────────────╲                   │
│   ╱  Process Curve ╲                  │
│                                        │
│   ◄───── 6σ = 50m ─────►              │
│   ◄─ Spec Width = 50m ─►              │
│                                        │
│   Cp = 1.67  (Process narrower)       │
│   Cpk = 1.45 (Slightly off-center)    │
└────────────────────────────────────────┘
```

**5. Insights & Recommendations:**
```typescript
💡 CAPABILITY INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Process is capable (Cpk = 1.45 > 1.33)
   → Meets customer requirements

✅ Low variation (σ = 12.4m)
   → Consistent performance

⚠️ Slightly below target (-0.7m)
   → Consider minor adjustment

✅ 98% yield
   → High quality output

✓ Recommendation: PROCEED TO CONTROL PHASE
   → Set up monitoring to maintain performance
```

### **📦 Week 2 Deliverable:**

✅ **Validation Mode + Capability Mode fully functional**
- Normality testing with 3 statistical tests
- Q-Q plots and histograms
- Process capability analysis
- Cpk calculations
- Visual capability charts
- Unlock control charts mode

---

## **📅 WEEK 3: CONTROL CHARTS + POLISH**

### **Phase 3.1: Control Charts (Days 10-12)**

#### **Day 10: Control Chart Calculations**

**A. Create Control Chart Functions**

`src/lib/games/catapult/controlCharts.ts`

**Functions:**

```typescript
/**
 * Calculate X-bar and R chart control limits
 */
export function calculateXbarRLimits(subgroups: Subgroup[]): {
  xbar: { UCL: number; CL: number; LCL: number }
  range: { UCL: number; CL: number; LCL: number }
} {
  const n = subgroups[0].samples.length // Subgroup size
  const k = subgroups.length // Number of subgroups
  
  // Calculate grand average (X-double-bar)
  const grandAvg = subgroups.reduce((sum, sg) => sum + sg.xbar, 0) / k
  
  // Calculate average range (R-bar)
  const avgRange = subgroups.reduce((sum, sg) => sum + sg.range, 0) / k
  
  // Control chart constants (depends on subgroup size)
  const constants = getControlChartConstants(n)
  
  // X-bar chart limits
  const xbar = {
    UCL: grandAvg + constants.A2 * avgRange,
    CL: grandAvg,
    LCL: grandAvg - constants.A2 * avgRange
  }
  
  // R chart limits
  const range = {
    UCL: constants.D4 * avgRange,
    CL: avgRange,
    LCL: constants.D3 * avgRange
  }
  
  return { xbar, range }
}

/**
 * Check for control chart violations (Nelson Rules)
 */
export function checkNelsonRules(
  points: number[],
  UCL: number,
  CL: number,
  LCL: number
): Violation[] {
  const violations: Violation[] = []
  const sigma = (UCL - CL) / 3
  
  points.forEach((point, i) => {
    // Rule 1: Point beyond control limits
    if (point > UCL || point < LCL) {
      violations.push({
        subgroupId: i + 1,
        rule: 'Rule 1: Point beyond control limits',
        severity: 'critical',
        description: 'Special cause variation detected'
      })
    }
    
    // Rule 2: 9 points in a row on same side of center line
    if (i >= 8) {
      const last9 = points.slice(i - 8, i + 1)
      if (last9.every(p => p > CL) || last9.every(p => p < CL)) {
        violations.push({
          subgroupId: i + 1,
          rule: 'Rule 2: 9 points on same side',
          severity: 'warning',
          description: 'Process shift detected'
        })
      }
    }
    
    // Rule 3: 6 points in a row trending up or down
    if (i >= 5) {
      const last6 = points.slice(i - 5, i + 1)
      const increasing = last6.every((p, idx) => idx === 0 || p > last6[idx - 1])
      const decreasing = last6.every((p, idx) => idx === 0 || p < last6[idx - 1])
      if (increasing || decreasing) {
        violations.push({
          subgroupId: i + 1,
          rule: 'Rule 3: 6 points trending',
          severity: 'warning',
          description: 'Process trend detected'
        })
      }
    }
    
    // Rule 4: 14 points alternating up and down
    if (i >= 13) {
      const last14 = points.slice(i - 13, i + 1)
      const alternating = last14.every((p, idx) => {
        if (idx === 0) return true
        return idx % 2 === 1 ? p > last14[idx - 1] : p < last14[idx - 1]
      })
      if (alternating) {
        violations.push({
          subgroupId: i + 1,
          rule: 'Rule 4: 14 points alternating',
          severity: 'warning',
          description: 'Systematic variation detected'
        })
      }
    }
    
    // Rule 5: 2 out of 3 points beyond 2σ
    if (i >= 2) {
      const last3 = points.slice(i - 2, i + 1)
      const beyond2Sigma = last3.filter(p => 
        Math.abs(p - CL) > 2 * sigma
      ).length
      if (beyond2Sigma >= 2) {
        violations.push({
          subgroupId: i + 1,
          rule: 'Rule 5: 2 of 3 beyond 2σ',
          severity: 'warning',
          description: 'Increased variation detected'
        })
      }
    }
    
    // Rule 6: 4 out of 5 points beyond 1σ
    if (i >= 4) {
      const last5 = points.slice(i - 4, i + 1)
      const beyond1Sigma = last5.filter(p => 
        Math.abs(p - CL) > sigma
      ).length
      if (beyond1Sigma >= 4) {
        violations.push({
          subgroupId: i + 1,
          rule: 'Rule 6: 4 of 5 beyond 1σ',
          severity: 'warning',
          description: 'Process centering issue'
        })
      }
    }
    
    // Rule 7: 15 points within 1σ
    if (i >= 14) {
      const last15 = points.slice(i - 14, i + 1)
      const within1Sigma = last15.filter(p => 
        Math.abs(p - CL) < sigma
      ).length
      if (within1Sigma === 15) {
        violations.push({
          subgroupId: i + 1,
          rule: 'Rule 7: 15 points within 1σ',
          severity: 'warning',
          description: 'Stratification or incorrect control limits'
        })
      }
    }
    
    // Rule 8: 8 points beyond 1σ
    if (i >= 7) {
      const last8 = points.slice(i - 7, i + 1)
      const beyond1Sigma = last8.every(p => 
        Math.abs(p - CL) > sigma
      )
      if (beyond1Sigma) {
        violations.push({
          subgroupId: i + 1,
          rule: 'Rule 8: 8 points beyond 1σ',
          severity: 'warning',
          description: 'Mixture or incorrect control limits'
        })
      }
    }
  })
  
  return violations
}

/**
 * Calculate process capability from control chart
 */
export function calculateProcessCapabilityFromSPC(
  xbarData: number[],
  rangeData: number[],
  USL: number,
  LSL: number
): {
  Cp: number
  Cpk: number
} {
  const avgXbar = calculateMean(xbarData)
  const avgRange = calculateMean(rangeData)
  const n = 5 // Assuming subgroup size of 5
  
  const constants = getControlChartConstants(n)
  const sigma = avgRange / constants.d2
  
  const Cp = (USL - LSL) / (6 * sigma)
  const Cpu = (USL - avgXbar) / (3 * sigma)
  const Cpl = (avgXbar - LSL) / (3 * sigma)
  const Cpk = Math.min(Cpu, Cpl)
  
  return { Cp, Cpk }
}

/**
 * Get control chart constants based on subgroup size
 */
function getControlChartConstants(n: number) {
  const constants: Record<number, { A2: number; D3: number; D4: number; d2: number }> = {
    2: { A2: 1.880, D3: 0, D4: 3.267, d2: 1.128 },
    3: { A2: 1.023, D3: 0, D4: 2.574, d2: 1.693 },
    4: { A2: 0.729, D3: 0, D4: 2.282, d2: 2.059 },
    5: { A2: 0.577, D3: 0, D4: 2.114, d2: 2.326 },
    6: { A2: 0.483, D3: 0, D4: 2.004, d2: 2.534 },
    7: { A2: 0.419, D3: 0.076, D4: 1.924, d2: 2.704 },
    8: { A2: 0.373, D3: 0.136, D4: 1.864, d2: 2.847 },
    9: { A2: 0.337, D3: 0.184, D4: 1.816, d2: 2.970 },
    10: { A2: 0.308, D3: 0.223, D4: 1.777, d2: 3.078 }
  }
  
  return constants[n] || constants[5]
}
```

#### **Days 11-12: Control Chart UI**

**A. Create Control Chart Controls**

`src/components/games/catapult/ControlChartControls.tsx`

**Features:**
- Subgroup configuration (size, frequency)
- "Collect Subgroup" button
- Real-time chart updates
- Violation alerts
- Process status indicator

**Visual:**
```typescript
┌──────────────────────────────────────────┐
│  📈 STATISTICAL PROCESS CONTROL          │
│                                          │
│  Subgroup Configuration:                 │
│  Size: [5] samples per subgroup         │
│  Frequency: Every [10] minutes          │
│                                          │
│  Progress: Subgroup 12 of 25            │
│  [████████████░░░░░░░░░░] 48%          │
│                                          │
│  Process Status: ✅ IN CONTROL          │
│  Violations: 0 detected                 │
│                                          │
│  [Collect Subgroup] [Auto-Collect]      │
│  [Reset Charts] [View Violations]       │
└──────────────────────────────────────────┘
```

**B. Create Control Chart Dashboard**

`src/components/games/catapult/ControlChartDashboard.tsx`

**Charts:**

**1. X-bar Chart:**
```typescript
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={xbarData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="subgroup" label="Subgroup Number" />
    <YAxis domain={[LCL - 10, UCL + 10]} label="Average Distance (m)" />
    
    {/* Control limits */}
    <ReferenceLine y={UCL} stroke="#ef4444" strokeWidth={2} label="UCL" />
    <ReferenceLine y={CL} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" label="CL" />
    <ReferenceLine y={LCL} stroke="#ef4444" strokeWidth={2} label="LCL" />
    
    {/* ±1σ and ±2σ zones */}
    <ReferenceArea y1={CL - sigma} y2={CL + sigma} fill="#10b981" fillOpacity={0.1} />
    <ReferenceArea y1={CL - 2*sigma} y2={CL + 2*sigma} fill="#f59e0b" fillOpacity={0.05} />
    
    {/* Data points */}
    <Line 
      dataKey="xbar" 
      stroke="#3b82f6" 
      strokeWidth={2}
      dot={(props) => {
        const isViolation = violations.some(v => v.subgroupId === props.payload.subgroup)
        return (
          <circle
            cx={props.cx}
            cy={props.cy}
            r={isViolation ? 6 : 4}
            fill={isViolation ? '#ef4444' : '#3b82f6'}
            stroke={isViolation ? '#dc2626' : '#2563eb'}
            strokeWidth={2}
          />
        )
      }}
    />
    
    <Tooltip />
    <Legend />
  </LineChart>
</ResponsiveContainer>
```

**2. R Chart:**
```typescript
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={rangeData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="subgroup" label="Subgroup Number" />
    <YAxis label="Range (m)" />
    
    <ReferenceLine y={UCL_R} stroke="#ef4444" strokeWidth={2} label="UCL" />
    <ReferenceLine y={CL_R} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" label="CL" />
    <ReferenceLine y={LCL_R} stroke="#ef4444" strokeWidth={2} label="LCL" />
    
    <Line dataKey="range" stroke="#8b5cf6" strokeWidth={2} />
    <Tooltip />
  </LineChart>
</ResponsiveContainer>
```

**3. Process Status:**
```typescript
📊 CONTROL CHART SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Metric                 Value
──────────────────────────────
Subgroups Collected    25
Total Samples          125
Process Status         ✅ IN CONTROL
Violations Detected    0

Control Limits (X-bar):
  UCL: 242.3m
  CL:  218.7m
  LCL: 195.1m

Control Limits (Range):
  UCL: 32.4m
  CL:  15.3m
  LCL: 0m

Process Capability (from SPC):
  Cp: 1.54
  Cpk: 1.42
```

**4. Violations Panel:**
```typescript
⚠️ VIOLATIONS & ALERTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No violations detected ✅

Nelson Rules Checked:
✓ Rule 1: No points beyond control limits
✓ Rule 2: No sustained shifts
✓ Rule 3: No trends detected
✓ Rule 4: No excessive alternation
✓ Rule 5: No increased variation
✓ Rule 6: No centering issues
✓ Rule 7: No stratification
✓ Rule 8: No mixture patterns

Process is STABLE and IN CONTROL
```

**5. Insights:**
```typescript
💡 CONTROL PHASE INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Process is statistically controlled
   → Only common cause variation present

✅ No special causes detected
   → Process is stable and predictable

✅ Capability maintained (Cpk = 1.42)
   → Continue monitoring at current frequency

✓ Recommendation: CONTINUE MONITORING
   → Collect data regularly
   → Investigate any violations immediately
   → Document process changes

🎓 CONGRATULATIONS!
You've completed the full Six Sigma cycle:
1. ✅ DOE → Optimized settings
2. ✅ Validation → Confirmed normality
3. ✅ Capability → Verified specs met
4. ✅ Control → Established monitoring

Achievement Unlocked: Six Sigma Black Belt Ready! 🏆
```

### **Phase 3.2: Tutorial System (Days 13-14)**

#### **Day 13: Create Tutorial Components**

**A. Tutorial Framework**

`src/components/games/catapult/GameTutorial.tsx`

**Tutorial flow:**
```typescript
const tutorials = {
  freeplay: [
    {
      step: 1,
      title: "Welcome to the Catapult Lab!",
      content: "Learn how to launch projectiles and understand what affects distance.",
      highlight: "canvas",
      actions: ["Next"]
    },
    {
      step: 2,
      title: "Adjust the Angle",
      content: "The launch angle affects the trajectory. Try different angles!",
      highlight: "angle-slider",
      actions: ["Try it", "Skip"]
    }
  ],
  
  doe: [
    {
      step: 1,
      title: "Design of Experiments (DOE)",
      content: "DOE is a systematic way to test multiple factors and find optimal settings.",
      highlight: "mode-selector",
      actions: ["Learn More", "Skip Tutorial"]
    },
    {
      step: 2,
      title: "Factorial Design",
      content: "We'll test all 8 combinations of Low/High levels for 3 factors.",
      highlight: "experiment-matrix",
      visual: "factorial-cube-diagram",
      actions: ["Next"]
    },
    {
      step: 3,
      title: "Run Experiments",
      content: "Complete each experiment. Order doesn't matter!",
      highlight: "doe-controls",
      actions: ["Start Experiments"]
    }
  ],
  
  validation: [
    {
      step: 1,
      title: "Validation Study",
      content: "Before trusting our optimal settings, we need to validate the data follows a normal distribution.",
      highlight: "validation-controls",
      actions: ["Next"]
    },
    {
      step: 2,
      title: "Why Normality Matters",
      content: "Many statistical methods assume normal distribution. We'll test this with 3 different tests.",
      visual: "normal-distribution-curve",
      actions: ["Next"]
    },
    {
      step: 3,
      title: "Collect Data",
      content: "Run at least 30 shots at optimal settings to build a dataset.",
      highlight: "validation-button",
      actions: ["Start Collecting"]
    }
  ],
  
  capability: [
    {
      step: 1,
      title: "Process Capability",
      content: "Now we check if our process can meet customer specifications.",
      highlight: "capability-controls",
      actions: ["Next"]
    },
    {
      step: 2,
      title: "Specification Limits",
      content: "Define the acceptable range (LSL to USL). We'll calculate if the process fits.",
      highlight: "spec-inputs",
      visual: "capability-diagram",
      actions: ["Next"]
    },
    {
      step: 3,
      title: "Cpk Index",
      content: "Cpk > 1.33 means the process is capable. Let's find out!",
      highlight: "calculate-button",
      actions: ["Calculate"]
    }
  ],
  
  control: [
    {
      step: 1,
      title: "Statistical Process Control",
      content: "The final phase: Monitor the process over time to detect changes.",
      highlight: "control-controls",
      actions: ["Next"]
    },
    {
      step: 2,
      title: "Control Charts",
      content: "X-bar chart tracks averages. R chart tracks variation. Both must be in control.",
      visual: "control-chart-example",
      actions: ["Next"]
    },
    {
      step: 3,
      title: "Subgroups",
      content: "Collect samples in groups. We'll plot averages and ranges.",
      highlight: "subgroup-config",
      actions: ["Next"]
    },
    {
      step: 4,
      title: "Nelson Rules",
      content: "8 rules detect special cause variation. Any violation means investigate!",
      visual: "nelson-rules-diagram",
      actions: ["Start Monitoring"]
    }
  ]
}
```

**B. Tooltip System**

Add contextual tooltips throughout:
```typescript
<Tooltip content="DOE helps find optimal settings systematically">
  <Info className="h-4 w-4" />
</Tooltip>
```

#### **Day 14: Polish & Integration**

**A. Achievement System**

Complete achievement tracking:
```typescript
const ACHIEVEMENTS = [
  // Free Play
  { id: 'first_shot', name: 'First Launch', icon: '🚀' },
  { id: 'hit_target', name: 'Bullseye', icon: '🎯' },
  { id: 'combo_5', name: '5 Hit Combo', icon: '🔥' },
  
  // DOE
  { id: 'first_experiment', name: 'First Experiment', icon: '🔬' },
  { id: 'full_factorial', name: 'Full Factorial', icon: '📊' },
  { id: 'optimizer', name: 'Optimizer', icon: '⭐' },
  
  // Validation
  { id: 'validator', name: 'Data Validator', icon: '✅' },
  { id: 'normal_data', name: 'Normal Distribution', icon: '📈' },
  
  // Capability
  { id: 'capable_process', name: 'Capable Process', icon: '📐' },
  { id: 'six_sigma', name: 'Six Sigma', icon: '6️⃣' },
  
  // Control
  { id: 'spc_master', name: 'SPC Master', icon: '📉' },
  { id: 'zero_violations', name: 'Perfect Control', icon: '💯' },
  
  // Meta
  { id: 'black_belt', name: 'Black Belt Ready', icon: '🥋' },
  { id: 'complete_all', name: 'DMAIC Master', icon: '🏆' }
]
```

**B. Data Export**

Add export functionality:
```typescript
// Export DOE results
function exportDOEResults(experiments: DOEExperiment[]) {
  const csv = [
    ['Run', 'Angle', 'Force', 'Weight', 'Distance', 'Accuracy', 'Score'],
    ...experiments.map(exp => [
      exp.runNumber,
      exp.angle,
      exp.force,
      exp.weight,
      exp.result?.distance,
      exp.result?.accuracy,
      exp.result?.score
    ])
  ]
  downloadCSV(csv, 'doe-results.csv')
}

// Export capability report
function exportCapabilityReport(data: CapabilityData) {
  const report = generatePDFReport({
    title: 'Process Capability Analysis',
    data,
    charts: ['histogram', 'capability-plot'],
    summary: 'Process is capable with Cpk = 1.45'
  })
  downloadPDF(report, 'capability-report.pdf')
}
```

**C. Performance Optimization**

- Memoize expensive calculations
- Virtualize long lists
- Lazy load charts
- Optimize canvas rendering

**D. Mobile Responsiveness**

- Stack layouts vertically on mobile
- Touch-friendly controls
- Simplified charts for small screens
- Swipe gestures for mode switching

**E. Final QA Checklist**

- [ ] All 5 modes work independently
- [ ] Mode unlocking works correctly
- [ ] All calculations are accurate
- [ ] Charts render properly
- [ ] Tutorials are clear
- [ ] Achievements unlock
- [ ] Data exports correctly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance is good (60fps)

### **📦 Week 3 Deliverable:**

✅ **Complete Six Sigma Toolkit**
- Control charts with Nelson rules
- Tutorial system for all modes
- Achievement system
- Data export
- Mobile responsive
- Production ready

---

## ✅ 5. SUCCESS CRITERIA

### **A. Functional Success Criteria**

**Mode Functionality:**
- [ ] All 5 modes are fully functional
- [ ] Mode switching is seamless
- [ ] Progressive unlocking works correctly
- [ ] Data persists across sessions

**Statistical Accuracy:**
- [ ] DOE calculations match textbook formulas
- [ ] Normality tests return correct p-values
- [ ] Capability indices are accurate
- [ ] Control limits calculated correctly
- [ ] Violations detected properly

**User Experience:**
- [ ] Intuitive navigation between modes
- [ ] Clear visual feedback
- [ ] Helpful error messages
- [ ] Smooth animations
- [ ] Fast load times

**Educational Value:**
- [ ] Users understand DOE methodology
- [ ] Normality testing is clear
- [ ] Capability interpretation is explained
- [ ] Control chart rules are taught
- [ ] DMAIC workflow is evident

### **B. Technical Success Criteria**

**Performance:**
- [ ] 60fps canvas rendering
- [ ] Charts load in < 1 second
- [ ] Calculations complete in < 500ms
- [ ] No memory leaks
- [ ] Smooth on mobile devices

**Code Quality:**
- [ ] TypeScript strict mode
- [ ] No ESLint errors
- [ ] Comprehensive type definitions
- [ ] Reusable components
- [ ] Clean architecture

**Testing:**
- [ ] Statistical functions tested
- [ ] UI components render correctly
- [ ] Integration tests pass
- [ ] Mobile testing complete
- [ ] Cross-browser compatibility

### **C. Business Success Criteria**

**User Engagement:**
- [ ] Average session > 20 minutes
- [ ] 80%+ complete at least DOE mode
- [ ] 50%+ complete all 5 modes
- [ ] High replay rate
- [ ] Low bounce rate

**Educational Outcomes:**
- [ ] Users can explain DOE
- [ ] 90%+ understand Cpk meaning
- [ ] Users can interpret control charts
- [ ] Positive learning feedback
- [ ] Certification prep value confirmed

**Market Position:**
- [ ] Unique offering (no competitors)
- [ ] Premium pricing justified
- [ ] Positive user reviews
- [ ] Social media sharing
- [ ] Certification body recognition

---

## 📊 6. METRICS & KPIs

### **Engagement Metrics:**
- Mode completion rates
- Time spent per mode
- Replay frequency
- Achievement unlock rate
- Tutorial skip rate

### **Learning Metrics:**
- Comprehension quiz scores
- Concept application accuracy
- User confidence ratings
- Skill progression tracking
- Certification exam correlation

### **Technical Metrics:**
- Page load time
- FPS during gameplay
- Error rate
- Crash rate
- Mobile vs desktop usage

---

## 🎓 7. EDUCATIONAL ALIGNMENT

### **Six Sigma Green Belt Curriculum:**
✅ Design of Experiments (DOE)
✅ Normality testing
✅ Process capability analysis
✅ Statistical process control (SPC)
✅ Control charts
✅ DMAIC methodology

### **Six Sigma Black Belt Curriculum:**
✅ Factorial designs
✅ Main effects & interactions
✅ Anderson-Darling test
✅ Cpk interpretation
✅ Nelson rules
✅ Advanced SPC

### **Lean Six Sigma Certification:**
This game covers **approximately 30% of the statistical tools** required for Green Belt certification and **20% of Black Belt** topics.

---

## 🚀 8. DEPLOYMENT STRATEGY

### **Week 1: MVP Launch**
- Free Play + DOE Mode
- Beta testing with select users
- Gather feedback
- Fix critical bugs

### **Week 2: Enhanced Release**
- Add Validation + Capability modes
- Incorporate beta feedback
- Marketing push
- User testimonials

### **Week 3: Full Release**
- Add Control Charts mode
- Complete tutorial system
- Launch promotional campaign
- Press release
- Certification body outreach

### **Post-Launch:**
- Monitor analytics
- User support
- Iterative improvements
- Additional games using same framework

---

## 💰 9. BUDGET & RESOURCES

### **Development Time:**
- **Week 1**: 40 hours (DOE mode)
- **Week 2**: 40 hours (Validation + Capability)
- **Week 3**: 40 hours (Control + Polish)
- **Total**: 120 hours over 3 weeks

### **Additional Resources:**
- UI/UX review: 5 hours
- QA testing: 10 hours
- Documentation: 5 hours
- Marketing materials: 10 hours

### **Total Investment:** ~130-140 hours

### **Expected ROI:**
- Premium feature (justify $50-100 pricing)
- Competitive differentiation
- Higher user retention
- Certification alignment value
- Potential licensing to education institutions

---

## 📝 10. CONCLUSION

This implementation transforms the Catapult game from a simple physics sandbox into a **comprehensive Six Sigma training platform** that teaches the complete DMAIC methodology through hands-on application.

### **Key Differentiators:**
1. **Integrated Learning**: Tools taught together, not in isolation
2. **Real-World Workflow**: Mirrors actual Six Sigma projects
3. **Engaging Format**: Game-based learning > traditional training
4. **Immediate Feedback**: See results of statistical decisions in real-time
5. **Progressive Complexity**: Each mode builds on previous knowledge

### **Strategic Value:**
- **Educational Excellence**: Unmatched in the market
- **Business Model**: Justifies premium pricing
- **Competitive Moat**: Very difficult to replicate
- **Scalability**: Framework reusable for other games
- **Certification Prep**: Direct value to professionals

### **Next Steps:**
1. Approve this plan
2. Begin Week 1 implementation (DOE mode)
3. Iterate based on user feedback
4. Expand to remaining modes
5. Launch comprehensive Six Sigma game platform

---

**This is not just a game. It's a comprehensive Six Sigma training simulator.** 🎯

**Ready to build it?** Let's transform continuous improvement education! 🚀
