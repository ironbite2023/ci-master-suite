# 🎯 PHASE 3: CATAPULT GAME IMPLEMENTATION PLAN

## 📊 **Overview**

**Game:** DOE Catapult Challenge
**Purpose:** Teach Design of Experiments through interactive gameplay
**Duration:** 4-5 days
**Complexity:** High

---

## 🎮 **GAME CONCEPT**

### **Core Gameplay:**
Players adjust catapult parameters (angle, force, weight) to hit targets at various distances. The game teaches:
- **Factorial Design**: Testing all combinations of parameters
- **Response Variables**: Distance, accuracy, consistency
- **Main Effects**: Which parameters matter most
- **Interactions**: How parameters work together
- **Optimization**: Finding the best settings

### **Learning Objectives:**
1. Understand factorial experimental design
2. Identify main effects and interactions
3. Use data to make informed decisions
4. Optimize process parameters
5. Interpret statistical results

---

## 🏗️ **ARCHITECTURE**

### **Tech Stack:**
- **Physics Engine**: Matter.js (2D rigid body physics)
- **Rendering**: HTML5 Canvas (direct manipulation)
- **State Management**: React hooks + Zustand (for complex state)
- **Animation**: RequestAnimationFrame + GSAP (for UI effects)
- **Charts**: Recharts (for DOE analysis)

### **File Structure:**
```
src/
├── app/
│   └── games/
│       └── play/
│           └── catapult/
│               └── page.tsx (Main game page)
├── components/
│   └── games/
│       └── catapult/
│           ├── CatapultCanvas.tsx (Physics + rendering)
│           ├── CatapultControls.tsx (Parameter controls)
│           ├── TargetZone.tsx (Target display)
│           ├── ExperimentPanel.tsx (DOE tracking)
│           ├── ResultsChart.tsx (Analysis visualization)
│           ├── TutorialOverlay.tsx (Step-by-step guide)
│           └── ScoreDisplay.tsx (Score & stats)
└── lib/
    └── games/
        └── catapult/
            ├── physics.ts (Physics calculations)
            ├── doe.ts (DOE logic & analysis)
            ├── scoring.ts (Score calculation)
            └── tutorial.ts (Tutorial steps)
```

---

## 📋 **IMPLEMENTATION PHASES**

### **Day 1: Core Infrastructure** ⏱️ 6-8 hours
**Goal:** Get basic catapult physics working

1. **Setup Dependencies**
   - Install Matter.js: `npm install matter-js @types/matter-js`
   - Install GSAP: `npm install gsap`
   - Verify existing dependencies (Recharts already installed)

2. **Create Game Page** (`/app/games/play/catapult/page.tsx`)
   - Game layout with canvas area
   - Sidebar for controls
   - Integration with game session hook
   - Modal system integration

3. **Physics Engine** (`/lib/games/catapult/physics.ts`)
   - Matter.js world setup
   - Catapult body creation
   - Projectile physics
   - Collision detection
   - Gravity simulation

4. **Basic Canvas Rendering** (`/components/games/catapult/CatapultCanvas.tsx`)
   - Canvas setup with proper sizing
   - Draw catapult structure
   - Draw projectile
   - Draw ground/environment
   - Animation loop

**Success Criteria:**
- [ ] Catapult appears on screen
- [ ] Can launch projectile with basic physics
- [ ] Projectile follows realistic trajectory
- [ ] Collision with ground detected

---

### **Day 2: Game Controls & Targeting** ⏱️ 6-8 hours
**Goal:** Make it playable with targets

1. **Parameter Controls** (`/components/games/catapult/CatapultControls.tsx`)
   - Angle slider (15° - 75°)
   - Force slider (50 - 150 units)
   - Weight selector (Light/Medium/Heavy)
   - Launch button
   - Reset button
   - Visual feedback for selections

2. **Target System** (`/components/games/catapult/TargetZone.tsx`)
   - Multiple target zones at different distances
   - Bullseye zones (high points)
   - Near-miss zones (medium points)
   - Miss detection
   - Visual target rendering
   - Hit animations

3. **Scoring System** (`/lib/games/catapult/scoring.ts`)
   - Distance calculation
   - Accuracy scoring
   - Consistency bonus
   - Time penalties
   - Combo multipliers
   - Total score calculation

4. **Score Display** (`/components/games/catapult/ScoreDisplay.tsx`)
   - Current score
   - Shot history
   - Best shot indicator
   - Streak counter
   - Progress to next level

**Success Criteria:**
- [ ] Can adjust all 3 parameters
- [ ] Targets appear at different distances
- [ ] Hits detected and scored
- [ ] Score updates in real-time
- [ ] Visual feedback for hits/misses

---

### **Day 3: DOE Mechanics** ⏱️ 6-8 hours
**Goal:** Add educational DOE layer

1. **DOE Logic** (`/lib/games/catapult/doe.ts`)
   - Factorial design generation (2³ = 8 experiments)
   - High/low level definitions
   - Experiment tracking
   - Main effects calculation
   - Interaction effects
   - Statistical analysis (mean, std dev)

2. **Experiment Panel** (`/components/games/catapult/ExperimentPanel.tsx`)
   - Experiment matrix display
   - Current experiment indicator
   - Completed experiments checklist
   - Suggested next test
   - Run order randomization

3. **Results Analysis** (`/components/games/catapult/ResultsChart.tsx`)
   - Main effects plot
   - Interaction plots
   - Pareto chart of effects
   - Response surface (if enough data)
   - Recommendations panel

4. **Educational Tooltips**
   - Explain factorial design
   - Explain main effects
   - Explain interactions
   - Best practices tips

**Success Criteria:**
- [ ] 8 experiments tracked in matrix
- [ ] Results stored for analysis
- [ ] Charts display meaningful data
- [ ] Clear recommendations shown
- [ ] Educational content integrated

---

### **Day 4: Tutorial & Polish** ⏱️ 6-8 hours
**Goal:** Make it teachable and beautiful

1. **Tutorial System** (`/components/games/catapult/TutorialOverlay.tsx`)
   - Step-by-step onboarding
   - Interactive highlights
   - Progress tracking
   - Skip/replay options
   - Context-sensitive help

2. **Tutorial Content** (`/lib/games/catapult/tutorial.ts`)
   - Step 1: Welcome & objective
   - Step 2: Understanding parameters
   - Step 3: Making your first shot
   - Step 4: What is DOE?
   - Step 5: Running experiments
   - Step 6: Analyzing results
   - Step 7: Finding optimal settings

3. **Visual Polish**
   - Smooth animations
   - Particle effects for hits
   - Sound effects integration (useGameAudio)
   - Visual effects (useGameVisuals)
   - Loading states
   - Error handling

4. **Mobile Responsiveness**
   - Touch controls for sliders
   - Responsive canvas sizing
   - Mobile-friendly layout
   - Pinch-to-zoom (optional)

**Success Criteria:**
- [ ] Tutorial guides new players
- [ ] Animations smooth on 60fps
- [ ] Sound effects work
- [ ] Particle effects on hits
- [ ] Mobile-friendly

---

### **Day 5: Testing & Integration** ⏱️ 4-6 hours
**Goal:** Complete & production-ready

1. **Game Session Integration**
   - Connect to useGameSession hook
   - Auto-save progress
   - Session start/pause/complete
   - Track metrics (shots, accuracy, time)

2. **Achievement System**
   - First launch achievement
   - Perfect accuracy achievement
   - DOE master achievement
   - Speed achievements
   - Unlock notifications

3. **Leaderboard Integration**
   - Submit high scores
   - Difficulty multipliers
   - Update rankings

4. **Testing**
   - Physics edge cases
   - Parameter boundaries
   - DOE calculation verification
   - Performance optimization
   - Browser compatibility

5. **Documentation**
   - Code comments
   - README for game mechanics
   - Educational content credits

**Success Criteria:**
- [ ] Full session tracking
- [ ] Achievements unlock
- [ ] Scores submit to leaderboard
- [ ] No critical bugs
- [ ] Performance >30fps

---

## 🎯 **GAME MECHANICS SPECIFICATIONS**

### **Parameters:**

| Parameter | Low Level | High Level | Unit | Effect |
|-----------|-----------|------------|------|--------|
| Angle | 30° | 60° | degrees | Trajectory arc |
| Force | 75 | 125 | N (normalized) | Launch velocity |
| Weight | 1.0 | 2.0 | kg | Mass/inertia |

### **Targets:**

| Zone | Distance | Width | Points | Color |
|------|----------|-------|--------|-------|
| Near | 100-150m | 20m | 50 | Green |
| Mid | 200-250m | 20m | 100 | Blue |
| Far | 300-350m | 20m | 150 | Purple |
| Bullseye | Centers | 5m | +50 bonus | Gold |

### **Scoring Formula:**
```
Base Score = Target Points × Difficulty Multiplier
Accuracy Bonus = 50 × (1 - Distance_from_center / Target_width)
Consistency Bonus = 100 × (shots_in_target / total_shots) if >= 3 shots
Time Penalty = -1 per second over 30 seconds per shot
Combo Multiplier = 1.5× if 3+ consecutive hits

Total Score = (Base + Accuracy + Consistency - Time) × Combo
```

### **DOE Analysis:**

**Main Effects:**
```
Effect_A = (Avg_response_high - Avg_response_low) / 2
```

**Interaction Effects:**
```
AB_interaction = ((Y_high_high + Y_low_low) - (Y_high_low + Y_low_high)) / 4
```

**Recommendation Logic:**
- Rank effects by absolute magnitude
- Identify statistically significant effects (>10% of range)
- Recommend parameter settings for optimization goal

---

## 🧪 **EDUCATIONAL CONTENT**

### **Key Concepts Taught:**

1. **Factorial Design**
   - "Test all combinations to understand the full picture"
   - 2³ design = 8 runs for 3 factors

2. **Main Effects**
   - "How much does changing one parameter affect the result?"
   - Visualized as bar charts

3. **Interactions**
   - "Sometimes parameters work together"
   - Example: Angle effect depends on force level

4. **Optimization**
   - "Use data to find the best settings"
   - Response surface methodology

5. **Statistical Thinking**
   - Variability matters
   - Replication confirms results
   - Random run order reduces bias

---

## 📊 **SUCCESS METRICS**

| Metric | Target | How to Measure |
|--------|--------|----------------|
| First-time completion | >80% | Session analytics |
| Average playtime | 10-15 min | Time tracking |
| Tutorial completion | >70% | Tutorial step tracking |
| Score improvement | +30% round 2 vs 1 | Score deltas |
| Return rate | >40% | User sessions |
| Educational value | 4+/5 rating | Post-game survey |

---

## 🚀 **NEXT ACTIONS**

1. ✅ Review this plan
2. 🔄 Install dependencies (Matter.js, GSAP)
3. 🔄 Create game page structure
4. 🔄 Build physics engine
5. 🔄 Add rendering system
6. 🔄 Implement controls
7. 🔄 Add targets & scoring
8. 🔄 Integrate DOE mechanics
9. 🔄 Add tutorial
10. 🔄 Polish & test

---

## 💡 **TIPS FOR SUCCESS**

- **Start Simple**: Get physics working before adding complexity
- **Test Frequently**: Physics bugs compound quickly
- **Use Console Logs**: Debug trajectories with position data
- **Mobile First**: Canvas sizing is tricky on mobile
- **Performance**: Target 60fps, settle for 30fps minimum
- **Educational Focus**: Keep learning objectives clear

---

Ready to start building? Let's begin with Day 1! 🚀
