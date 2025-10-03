# 🎮 CI MASTER GAMES - IMPLEMENTATION ROADMAP

**Status:** In Progress  
**Start Date:** October 3, 2025  
**Target Completion:** 14 weeks

---

## 🎯 RECOMMENDED EXECUTION ORDER

This roadmap follows **dependency-driven development** - each phase builds on the previous one, ensuring a solid foundation before adding complexity.

---

## ✅ PHASE 0: FOUNDATION (COMPLETED)

**Duration:** 1 day  
**Status:** ✅ DONE

- [x] Database schema deployed (8 tables, triggers, RLS)
- [x] 6 games seeded
- [x] 6 achievements for Catapult
- [x] Dependencies installed
- [x] Security vulnerability fixed (xlsx → exceljs)
- [x] TypeScript types created (560+ lines)

**Deliverables:**
- ✅ `games` tables in Supabase
- ✅ `src/types/games.ts`
- ✅ All npm dependencies
- ✅ 0 security vulnerabilities

---

## 🔧 PHASE 1: CORE INFRASTRUCTURE (CURRENT)

**Duration:** 3-4 days  
**Priority:** CRITICAL  
**Dependencies:** Phase 0

### **Day 1-2: Hooks & State Management**

**Goal:** Create reusable game session management

**Tasks:**
1. ✅ **Create `useGameSession` hook** (`src/hooks/useGameSession.ts`)
   - Session lifecycle (start, pause, resume, complete, quit)
   - Auto-save functionality
   - Progress tracking
   - Achievement checking
   - Leaderboard updates

2. **Create `useGameAudio` hook** (`src/hooks/useGameAudio.ts`)
   - Sound effect management
   - Background music
   - Volume control
   - Mute/unmute

3. **Create `useGameVisuals` hook** (`src/hooks/useGameVisuals.ts`)
   - Visual effects (confetti, particles)
   - Screen shake
   - Flash effects

**Deliverables:**
- `src/hooks/useGameSession.ts`
- `src/hooks/useGameAudio.ts`
- `src/hooks/useGameVisuals.ts`

---

### **Day 3: Utility Functions**

**Goal:** Create helper functions for games

**Tasks:**
1. **Create game utilities** (`src/lib/games/`)
   - `gameService.ts` - Fetch games, sessions
   - `achievementEngine.ts` - Check/unlock achievements
   - `leaderboardService.ts` - Update rankings
   - `statisticsCalculator.ts` - Calculate metrics (Cpk, Sigma, etc.)

**Deliverables:**
- `src/lib/games/gameService.ts`
- `src/lib/games/achievementEngine.ts`
- `src/lib/games/leaderboardService.ts`
- `src/lib/games/statisticsCalculator.ts`

---

### **Day 4: Base UI Components**

**Goal:** Create reusable game UI components

**Tasks:**
1. **Create base components** (`src/components/games/`)
   - `GameContainer.tsx` - Main game wrapper
   - `GameHUD.tsx` - Score, time, progress display
   - `GameModal.tsx` - Tutorial, pause, completion modals
   - `GameControls.tsx` - Play, pause, reset buttons
   - `AchievementToast.tsx` - Achievement unlock notifications

**Deliverables:**
- `src/components/games/GameContainer.tsx`
- `src/components/games/GameHUD.tsx`
- `src/components/games/GameModal.tsx`
- `src/components/games/GameControls.tsx`
- `src/components/games/AchievementToast.tsx`

---

## 🎨 PHASE 2: GAME PAGES & NAVIGATION

**Duration:** 2-3 days  
**Priority:** HIGH  
**Dependencies:** Phase 1

### **Day 5: Route Structure**

**Goal:** Create game navigation and listing pages

**Tasks:**
1. **Games Gallery** (`src/app/games/page.tsx`)
   - Grid of all games
   - Filter by category
   - Search functionality
   - Featured games section

2. **Game Detail** (`src/app/games/[gameKey]/page.tsx`)
   - Game description
   - Learning objectives
   - Difficulty selection
   - Leaderboard preview
   - Reviews/ratings
   - "Play Now" button

3. **Game Play Page** (`src/app/games/[gameKey]/play/page.tsx`)
   - Actual game component
   - Full-screen mode
   - Exit confirmation

**Deliverables:**
- `src/app/games/page.tsx`
- `src/app/games/[gameKey]/page.tsx`
- `src/app/games/[gameKey]/play/page.tsx`
- `src/app/games/layout.tsx`

---

### **Day 6-7: Supporting Pages**

**Goal:** Create additional game-related pages

**Tasks:**
1. **Leaderboard Page** (`src/app/games/leaderboards/page.tsx`)
   - Global rankings
   - Filter by game/difficulty
   - User rank highlighting

2. **Achievements Page** (`src/app/games/achievements/page.tsx`)
   - All achievements
   - Progress tracking
   - Rarity indicators

3. **User Profile/Stats** (`src/app/games/profile/page.tsx`)
   - Games played
   - Achievements earned
   - Personal best scores
   - Progress charts

**Deliverables:**
- `src/app/games/leaderboards/page.tsx`
- `src/app/games/achievements/page.tsx`
- `src/app/games/profile/page.tsx`

---

## 🎯 PHASE 3: FIRST GAME - CATAPULT (PROOF OF CONCEPT)

**Duration:** 5-7 days  
**Priority:** HIGH  
**Dependencies:** Phase 1, Phase 2

### **Why Catapult First?**
- Most complex (includes physics, DOE, statistics)
- If we can build this, other games will be easier
- Validates our architecture and hooks

---

### **Day 8-9: Catapult Physics Engine**

**Goal:** Build the physics simulation

**Tasks:**
1. **Create physics engine** (`src/lib/games/catapult/physicsEngine.ts`)
   - Matter.js integration
   - Projectile motion calculations
   - Wind/gravity simulation
   - Collision detection

2. **Create catapult component** (`src/components/games/catapult/CatapultCanvas.tsx`)
   - Konva canvas rendering
   - Animated catapult
   - Projectile trajectory
   - Target visualization

**Deliverables:**
- `src/lib/games/catapult/physicsEngine.ts`
- `src/components/games/catapult/CatapultCanvas.tsx`

---

### **Day 10-11: Catapult Controls & UI**

**Goal:** Build the control interface

**Tasks:**
1. **Control Panel** (`src/components/games/catapult/ControlPanel.tsx`)
   - Angle slider (0-90°)
   - Power slider (0-100%)
   - Weight selector
   - Arm length selector
   - Fire button

2. **Statistics Display** (`src/components/games/catapult/StatisticsPanel.tsx`)
   - Shot history
   - Cpk calculation
   - Control charts
   - Process capability visualization

**Deliverables:**
- `src/components/games/catapult/ControlPanel.tsx`
- `src/components/games/catapult/StatisticsPanel.tsx`

---

### **Day 12: DOE Wizard**

**Goal:** Implement Design of Experiments feature

**Tasks:**
1. **DOE Wizard** (`src/components/games/catapult/DOEWizard.tsx`)
   - Full factorial design
   - Factor selection
   - Run matrix
   - Results analysis
   - Main effects plot
   - Optimal settings recommendation

**Deliverables:**
- `src/components/games/catapult/DOEWizard.tsx`
- `src/lib/games/catapult/doeCalculations.ts`

---

### **Day 13-14: Catapult Game Logic & Polish**

**Goal:** Complete Catapult game

**Tasks:**
1. **Main Game Component** (`src/app/games/catapult/play/page.tsx`)
   - Integrate all components
   - Game flow logic
   - Achievement triggers
   - Session management

2. **Polish & Testing**
   - Sound effects
   - Visual effects
   - Tutorial modal
   - Bug fixes

**Deliverables:**
- Fully playable Catapult game
- All achievements functional
- Leaderboard integration

---

## 🎮 PHASE 4: REMAINING GAMES (PARALLEL DEVELOPMENT)

**Duration:** 6-8 weeks  
**Priority:** MEDIUM  
**Dependencies:** Phase 3

### **Week 3-4: SMED Challenge**

**Tasks:**
- Timeline visualization
- Activity cards (drag & drop)
- Internal/External conversion
- Parallelization logic
- Time reduction calculations

**Deliverables:**
- `src/app/games/smed_challenge/play/page.tsx`
- `src/components/games/smed/` (all components)

---

### **Week 5-6: 5S Factory**

**Tasks:**
- Factory floor visualization
- Object sorting (keep/discard)
- Organization zones
- Before/after comparison
- Scoring system

**Deliverables:**
- `src/app/games/five_s_factory/play/page.tsx`
- `src/components/games/five-s/` (all components)

---

### **Week 7-8: Kanban Flow**

**Tasks:**
- Board visualization
- Card movement
- WIP limit enforcement
- Flow metrics
- Bottleneck detection

**Deliverables:**
- `src/app/games/kanban_flow/play/page.tsx`
- `src/components/games/kanban/` (all components)

---

### **Week 9-10: Defect Detective**

**Tasks:**
- Production line simulation
- Inspection interface
- Control chart integration
- Pattern recognition
- Special vs. common cause

**Deliverables:**
- `src/app/games/defect_detective/play/page.tsx`
- `src/components/games/defect-detective/` (all components)

---

### **Week 11-12: VSM Puzzle**

**Tasks:**
- Process step cards
- Value stream map builder
- Waste identification
- Metrics calculation
- Future state design

**Deliverables:**
- `src/app/games/vsm_puzzle/play/page.tsx`
- `src/components/games/vsm/` (all components)

---

## 🎨 PHASE 5: POLISH & OPTIMIZATION

**Duration:** 2 weeks  
**Priority:** MEDIUM  
**Dependencies:** Phase 4

### **Week 13: Performance & Accessibility**

**Tasks:**
1. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Asset optimization
   - Bundle size reduction

2. **Accessibility (WCAG 2.1 AA)**
   - Keyboard navigation
   - Screen reader support
   - Color contrast
   - Focus indicators

3. **Mobile Responsiveness**
   - Touch controls
   - Responsive layouts
   - Performance on mobile

**Deliverables:**
- Lighthouse score 90+
- WCAG 2.1 AA compliant
- Mobile-optimized

---

### **Week 14: Final Polish**

**Tasks:**
1. **User Experience**
   - Animations polish
   - Loading states
   - Error handling
   - User feedback

2. **Documentation**
   - API documentation
   - Component storybook
   - Developer guide
   - User guide

3. **Testing & Bug Fixes**
   - Unit tests
   - Integration tests
   - E2E tests
   - Bug fixes

**Deliverables:**
- Production-ready games
- Complete documentation
- Test coverage

---

## 📊 PHASE 6: OPTIONAL ENHANCEMENTS

**Duration:** Ongoing  
**Priority:** LOW  
**Dependencies:** Phase 5

### **Future Features:**

1. **Social Features**
   - Friend challenges
   - Replay sharing
   - Comments/reactions

2. **Advanced Analytics**
   - Learning curves
   - Skill progression
   - Personalized recommendations

3. **Content Expansion**
   - New games
   - Additional achievements
   - Seasonal events

4. **Academy Integration (Phase 2)**
   - Link games to courses
   - Track game progress in academy
   - Game-based assessments

---

## 🎯 SUCCESS CRITERIA

### **Phase 1-2 (Infrastructure):**
- [✅] All hooks implemented and tested
- [ ] All base components working
- [ ] Routes navigable
- [ ] No TypeScript errors

### **Phase 3 (Catapult):**
- [ ] Catapult fully playable
- [ ] All 6 achievements unlockable
- [ ] Leaderboard functional
- [ ] DOE wizard working

### **Phase 4 (Remaining Games):**
- [ ] All 6 games playable
- [ ] Achievements for each game
- [ ] Consistent UI/UX

### **Phase 5 (Polish):**
- [ ] Lighthouse score 90+
- [ ] WCAG 2.1 AA compliant
- [ ] Mobile responsive
- [ ] Documented

---

## 🚀 EXECUTION STRATEGY

### **Development Approach:**

1. **Incremental Development**
   - Build one complete vertical slice at a time
   - Test thoroughly before moving to next phase

2. **Component Reusability**
   - Maximize shared components
   - Create game-specific variants only when needed

3. **Continuous Testing**
   - Test each component as built
   - Run build after each major change

4. **Documentation As We Go**
   - Document APIs inline
   - Update README with new features

---

## 📋 DAILY CHECKLIST

For each development day:

- [ ] Start with Phase checklist review
- [ ] Implement planned features
- [ ] Write tests for new code
- [ ] Run `npm run build` to check for errors
- [ ] Update this roadmap with progress
- [ ] Commit changes with clear messages

---

## 🎯 CURRENT STATUS

**Current Phase:** Phase 1 - Core Infrastructure  
**Current Task:** Create `useGameSession` hook  
**Progress:** 10% complete (Foundation done)

**Next Steps:**
1. Implement `useGameSession.ts`
2. Implement `useGameAudio.ts`
3. Implement `useGameVisuals.ts`
4. Create utility functions
5. Build base UI components

---

**Let's build something amazing! 🚀**
