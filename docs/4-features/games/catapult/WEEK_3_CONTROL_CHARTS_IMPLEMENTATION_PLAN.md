# 📊 WEEK 3: CONTROL CHARTS MODE - IMPLEMENTATION PLAN

**Version:** 1.0
**Status:** Ready to Implement
**Duration:** Days 11-15 (5 days)
**Phase:** Control (DMAIC Cycle)

---

## 🎯 **MISSION**

Implement Statistical Process Control (SPC) charts for the Catapult game, teaching users how to monitor and maintain process stability over time using X-bar and R charts with Nelson Rules.

---

## 📚 **EDUCATIONAL OBJECTIVES**

### **What Users Will Learn:**
1. ✅ Purpose of control charts in Six Sigma
2. ✅ Difference between common cause and special cause variation
3. ✅ How to calculate control limits (UCL, LCL, Center Line)
4. ✅ X-bar chart for monitoring process mean
5. ✅ R chart for monitoring process variation
6. ✅ 8 Nelson Rules for out-of-control detection
7. ✅ How to respond to out-of-control signals
8. ✅ Process stability vs process capability

---

## 🏗️ **TECHNICAL ARCHITECTURE**

### **Control Chart Types:**
```
X-bar Chart (Process Mean Monitoring)
├─ Track average distance per subgroup
├─ Detect shifts in process centering
└─ Use UCL, LCL based on R-bar

R Chart (Process Variation Monitoring)
├─ Track range (max - min) per subgroup
├─ Detect changes in process spread
└─ Use UCL, LCL based on constants
```

### **Data Structure:**
```typescript
Subgroup:
  - shots: Shot[]          // 3-5 shots per subgroup
  - mean: number           // Average distance
  - range: number          // Max - min
  - timestamp: Date

Control Limits:
  - xBarUCL: number        // X-bar Upper Control Limit
  - xBarCL: number         // X-bar Center Line (grand mean)
  - xBarLCL: number        // X-bar Lower Control Limit
  - rBarUCL: number        // R Upper Control Limit
  - rBarCL: number         // R Center Line (average range)
  - rBarLCL: number        // R Lower Control Limit (often 0)

Violations:
  - rule: string           // "Nelson Rule 1-8"
  - subgroupIndex: number
  - description: string
  - severity: 'high' | 'medium' | 'low'
```

---

## 📅 **5-DAY IMPLEMENTATION SCHEDULE**

### **Day 11: Control Chart Calculations Engine** (~500 lines)
**Focus:** Core mathematical calculations

**Deliverables:**
- Control limit calculations (X-bar, R)
- Subgroup management functions
- Grand mean and R-bar calculations
- Control constants (A2, D3, D4)
- Helper functions

**File:** `src/lib/games/catapult/controlCharts.ts`

---

### **Day 12: Nelson Rules Engine** (~600 lines)
**Focus:** Out-of-control detection

**Deliverables:**
- 8 Nelson Rules implementation
- Violation detection logic
- Pattern recognition algorithms
- Severity classification
- Recommendation generation

**File:** `src/lib/games/catapult/nelsonRules.ts`

**8 Nelson Rules:**
1. One point beyond 3σ
2. Nine points in a row on same side
3. Six points in a row increasing/decreasing
4. Fourteen points in a row alternating
5. Two out of three points beyond 2σ
6. Four out of five points beyond 1σ
7. Fifteen points in a row within 1σ
8. Eight points in a row beyond 1σ

---

### **Day 13: Control Chart UI Components (Part 1)** (~800 lines)
**Focus:** Chart visualization

**Deliverables:**
- ControlModeControls.tsx (~200 lines)
  - Subgroup size selector
  - Start monitoring button
  - Reset button
  
- XBarChart.tsx (~300 lines)
  - Line chart with control limits
  - Violation markers
  - Hover tooltips
  
- RChart.tsx (~300 lines)
  - Range chart with control limits
  - Variation tracking
  - Visual indicators

**Location:** `src/components/games/catapult/`

---

### **Day 14: Control Chart UI Components (Part 2)** (~700 lines)
**Focus:** Data display and analysis

**Deliverables:**
- SubgroupManager.tsx (~200 lines)
  - Current subgroup display
  - Shot collection progress
  - Submit subgroup button
  
- ControlChartViolations.tsx (~250 lines)
  - Violation list display
  - Nelson Rule explanations
  - Severity indicators
  
- ControlChartSummary.tsx (~250 lines)
  - Process stability assessment
  - Statistics summary
  - Control recommendations

**Location:** `src/components/games/catapult/`

---

### **Day 15: Week 3 Integration & Polish** (~400 lines)
**Focus:** Integration and completion

**Deliverables:**
- Integrate all control chart components
- Add mode transitions (Capability → Control)
- Implement Supabase integration for control data
- Add control chart achievements
- Testing and bug fixes
- Week 3 completion summary

**Files:**
- Mode integration in `src/app/games/play/catapult/page.tsx`
- Supabase service: `src/lib/games/catapult/controlSupabaseService.ts`
- Achievement definitions

---

## 🧮 **CONTROL CHART FORMULAS**

### **Control Limit Calculations:**

**X-bar Chart (Monitoring Mean):**
```typescript
// Center Line (Grand Mean)
X̿ = Σ(X̄i) / k
where X̄i = mean of subgroup i, k = number of subgroups

// Upper Control Limit
UCL_X̄ = X̿ + (A2 × R̄)

// Lower Control Limit
LCL_X̄ = X̿ - (A2 × R̄)

// A2 constant depends on subgroup size n:
n=2: A2=1.880
n=3: A2=1.023
n=4: A2=0.729
n=5: A2=0.577
```

**R Chart (Monitoring Variation):**
```typescript
// Center Line (Average Range)
R̄ = Σ(Ri) / k
where Ri = range of subgroup i

// Upper Control Limit
UCL_R = D4 × R̄

// Lower Control Limit
LCL_R = D3 × R̄

// Constants depend on subgroup size n:
n=2: D3=0,     D4=3.267
n=3: D3=0,     D4=2.574
n=4: D3=0,     D4=2.282
n=5: D3=0,     D4=2.114
```

---

## 🎮 **USER FLOW**

### **Control Mode Entry:**
```
Prerequisites:
✅ DOE Mode Complete (optimal settings found)
✅ Validation Mode Complete (normality confirmed)
✅ Capability Mode Complete (process capable)

User Flow:
1. User enters Control Mode
2. Choose subgroup size (3-5 shots, default 5)
3. Start collecting subgroups
4. System calculates control limits after 20+ subgroups
5. Monitor process stability
6. Detect violations (Nelson Rules)
7. Take corrective action if needed
8. Complete DMAIC cycle!
```

### **Subgroup Collection:**
```
For each subgroup:
1. User fires 5 shots (subgroup size)
2. System calculates subgroup mean and range
3. Plot point on X-bar and R charts
4. Check for Nelson Rule violations
5. Display any out-of-control signals
6. User continues or investigates
```

---

## 📊 **NELSON RULES SPECIFICATIONS**

### **Rule 1: One Point Beyond 3σ**
```typescript
// Most serious - immediate action required
Detection: Any point > UCL or < LCL
Severity: HIGH
Recommendation: "Stop process. Investigate special cause immediately."
```

### **Rule 2: Nine Points on Same Side**
```typescript
// Process mean shift
Detection: 9 consecutive points above or below center line
Severity: HIGH
Recommendation: "Process has shifted. Adjust process settings."
```

### **Rule 3: Six Points Trending**
```typescript
// Process drift
Detection: 6 consecutive points increasing or decreasing
Severity: MEDIUM
Recommendation: "Process is drifting. Check for tool wear or time-based factors."
```

### **Rule 4: Fourteen Points Alternating**
```typescript
// Systematic variation
Detection: 14 consecutive points alternating up/down
Severity: MEDIUM
Recommendation: "Systematic variation detected. Check for cyclical patterns."
```

### **Rule 5: Two of Three Beyond 2σ**
```typescript
// Increased variation
Detection: 2 out of 3 consecutive points beyond 2σ
Severity: MEDIUM
Recommendation: "Variation increasing. Monitor closely."
```

### **Rule 6: Four of Five Beyond 1σ**
```typescript
// Process shift warning
Detection: 4 out of 5 consecutive points beyond 1σ
Severity: LOW
Recommendation: "Possible process shift. Continue monitoring."
```

### **Rule 7: Fifteen Points Within 1σ**
```typescript
// Reduced variation (too good?)
Detection: 15 consecutive points within 1σ
Severity: LOW
Recommendation: "Stratification possible. Verify measurement system."
```

### **Rule 8: Eight Points Beyond 1σ**
```typescript
// Mixture or bimodal distribution
Detection: 8 consecutive points beyond 1σ on both sides
Severity: MEDIUM
Recommendation: "Process may have two populations. Investigate."
```

---

## 🎨 **UI/UX DESIGN GUIDELINES**

### **Visual Design:**
```
Control Charts:
- X-axis: Subgroup number (1, 2, 3, ...)
- Y-axis: Distance (m)
- UCL: Red dashed line
- CL: Green solid line
- LCL: Red dashed line
- Data points: Blue circles
- Violations: Red circles with alert icon
```

### **Color Coding:**
```
Stable process: Green indicators
Violations detected: Red/orange alerts
Within control: Blue/gray
Trends: Yellow warnings
```

### **Interactive Features:**
- Hover over points to see details
- Click violations to see Nelson Rule explanation
- Zoom into specific subgroup ranges
- Toggle between X-bar and R chart views

---

## 📈 **SUCCESS CRITERIA**

### **Functional Requirements:**
- ✅ Accurate control limit calculations
- ✅ All 8 Nelson Rules correctly implemented
- ✅ Real-time violation detection
- ✅ Subgroup management (collect, submit, reset)
- ✅ Visual control charts with Recharts

### **Educational Requirements:**
- ✅ Users understand control charts purpose
- ✅ Users can identify out-of-control signals
- ✅ Users know when to take action
- ✅ Users complete DMAIC cycle

### **Performance Requirements:**
- ✅ Chart rendering < 100ms
- ✅ Violation detection < 10ms
- ✅ Smooth animations
- ✅ Responsive on mobile

---

## 🗄️ **DATABASE SCHEMA**

### **Control Sessions Table:**
```sql
CREATE TABLE control_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  game_id UUID REFERENCES games(id),
  
  subgroup_size INTEGER NOT NULL CHECK (subgroup_size BETWEEN 2 AND 5),
  subgroups JSONB NOT NULL DEFAULT '[]',
  
  control_limits JSONB,  -- { xBarUCL, xBarCL, xBarLCL, rBarUCL, rBarCL, rBarLCL }
  violations JSONB DEFAULT '[]',  -- Array of violation objects
  
  is_stable BOOLEAN DEFAULT FALSE,
  total_subgroups INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_control_sessions_user ON control_sessions(user_id);
CREATE INDEX idx_control_sessions_game ON control_sessions(game_id);

-- RLS Policies
ALTER TABLE control_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own control sessions"
  ON control_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own control sessions"
  ON control_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own control sessions"
  ON control_sessions FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 📦 **DELIVERABLES SUMMARY**

### **Day 11:** Control Chart Calculations (~500 lines)
- `src/lib/games/catapult/controlCharts.ts`

### **Day 12:** Nelson Rules Engine (~600 lines)
- `src/lib/games/catapult/nelsonRules.ts`

### **Day 13:** Control UI Part 1 (~800 lines)
- `src/components/games/catapult/ControlModeControls.tsx`
- `src/components/games/catapult/XBarChart.tsx`
- `src/components/games/catapult/RChart.tsx`

### **Day 14:** Control UI Part 2 (~700 lines)
- `src/components/games/catapult/SubgroupManager.tsx`
- `src/components/games/catapult/ControlChartViolations.tsx`
- `src/components/games/catapult/ControlChartSummary.tsx`

### **Day 15:** Integration & Polish (~400 lines)
- Mode integration
- Supabase service
- Achievements
- Testing

**Total:** ~3,000 lines across 5 days

---

## 🎓 **EDUCATIONAL CONTENT**

### **In-Game Tutorials:**
```
Tutorial 1: "What are Control Charts?"
- Purpose: Monitor process over time
- Two types: X-bar (mean) and R (variation)
- Control limits vs specification limits

Tutorial 2: "Reading Control Charts"
- Points within limits = stable
- Points outside limits = special cause
- Patterns indicate problems

Tutorial 3: "Nelson Rules"
- 8 rules for detecting out-of-control conditions
- Different patterns, different causes
- How to respond to each rule

Tutorial 4: "Maintaining Control"
- When to take action
- When to leave process alone
- Continuous improvement mindset
```

---

## ⚡ **QUICK START (Day 11)**

### **First Implementation Steps:**
1. Create `controlCharts.ts` with control limit calculations
2. Implement subgroup data structure
3. Add control constants (A2, D3, D4)
4. Calculate grand mean and R-bar
5. Implement helper functions
6. Write unit tests

### **Sample Code Structure:**
```typescript
// Control limit calculation
export function calculateControlLimits(
  subgroups: Subgroup[],
  subgroupSize: number
): ControlLimits

// Subgroup creation
export function createSubgroup(shots: Shot[]): Subgroup

// Control constants
export const CONTROL_CONSTANTS: Record<number, ControlConstants>

// Validation
export function validateSubgroupSize(size: number): boolean
```

---

## 🎯 **WEEK 3 MILESTONES**

```
Day 11: ✅ Control calculations engine complete
Day 12: ✅ Nelson Rules engine complete
Day 13: ✅ Control charts visualization complete
Day 14: ✅ Control UI components complete
Day 15: ✅ Week 3 integrated and tested

Final: ✅ DMAIC CYCLE COMPLETE!
```

---

## 🚀 **POST-WEEK 3**

### **What's Next After Control Charts:**
1. **Integration Testing** - Test complete DOE → Validation → Capability → Control flow
2. **Achievements** - Award badges for completing DMAIC
3. **Leaderboards** - Process stability rankings
4. **Export Features** - Generate control chart reports
5. **Historical Analysis** - Compare sessions over time

---

**Status:** ✅ Plan Complete - Ready to Start Day 11!

**Next Action:** Build control chart calculations engine

---

**Let's build the Control Phase!** 📊
