# 🎮 Game Rules & Instructions System - Implementation Scope

**Feature**: Pre-game rules display and in-game rules reference  
**Priority**: High (UX & Educational Value)  
**Estimated Time**: 4-6 hours  
**Status**: Scoped - Ready for Implementation

---

## 🎯 **Objective**

Create a comprehensive rules and instructions system that:
1. **Educates** players before they start
2. **Guides** players through game mechanics
3. **References** rules during gameplay
4. **Adapts** rules based on game mode
5. **Remembers** user preferences ("Don't show again")

---

## 👤 **User Stories**

### As a First-Time Player:
- I want to see game rules **before I start playing**
- I want to understand **what I'll learn** from this game
- I want to see **how to control** the game
- I want to know **how scoring works**
- I want to know **what success looks like**

### As a Returning Player:
- I want to **skip rules** if I've seen them before
- I want to **access rules anytime** during gameplay
- I want to see **mode-specific rules** when switching modes
- I want a **quick reference** guide while playing

### As a Learning User:
- I want to understand the **Six Sigma concepts** in the game
- I want to see **examples and tips**
- I want to know **what I'll master** by playing

---

## 🎨 **UI/UX Design**

### 1. **Pre-Game Rules Modal** (Primary)

**Trigger**: 
- User clicks "Play Now" button
- First time playing this game
- Or user hasn't checked "Don't show again"

**Layout**:
```
┌────────────────────────────────────────────┐
│  🎯 Catapult Game - How to Play           │
│  [Tab: Overview] [Tab: Controls] [Tab: Scoring] [Tab: Learning Goals]
├────────────────────────────────────────────┤
│                                            │
│  [Icon]  Game Objective                   │
│  Launch projectiles to hit targets and    │
│  learn Design of Experiments              │
│                                            │
│  📊 What You'll Learn:                    │
│  • 2³ Factorial Design                    │
│  • Main Effects & Interactions            │
│  • Optimal Settings                       │
│                                            │
│  ⚙️ Controls:                             │
│  • Adjust angle slider (15° - 75°)       │
│  • Set force (50% - 150%)                │
│  • Select weight (Light/Medium/Heavy)     │
│  • Click "Launch" to fire                │
│                                            │
│  🏆 Success Criteria:                     │
│  • Complete all 8 DOE experiments         │
│  • Achieve target hits                    │
│  • Unlock new modes                       │
│                                            │
├────────────────────────────────────────────┤
│  [✓] Don't show this again                │
│  [Skip]  [Start Tutorial]  [Start Game]   │
└────────────────────────────────────────────┘
```

**Features**:
- Tabbed interface (Overview, Controls, Scoring, Learning)
- Visual aids (icons, images, GIFs)
- "Don't show again" checkbox
- Three action buttons:
  - **Skip**: Go straight to game
  - **Start Tutorial**: Interactive walkthrough
  - **Start Game**: Begin playing with rules understood

---

### 2. **In-Game Rules Button** (Secondary)

**Location**: Top-right corner of game interface

**UI**:
```
[?] Rules & Tips
```

**Behavior**:
- Always visible during gameplay
- Opens rules modal (compact version)
- Pauses game if clicked
- Shows mode-specific rules

---

### 3. **Mode-Specific Rules** (Tertiary)

**Trigger**: When switching to a new game mode for the first time

**Example for Catapult**:
- **Free Play**: Basic rules
- **DOE Mode**: Factorial design explanation
- **Validation Mode**: Normality testing guide
- **Capability Mode**: Specification limits & indices guide
- **Control Mode**: Subgroup collection & charts guide

**UI**:
```
┌────────────────────────────────────────────┐
│  🎯 Validation Mode - New Rules            │
├────────────────────────────────────────────┤
│  You've unlocked Validation Mode!         │
│                                            │
│  📊 Objective:                            │
│  Collect 30+ shots at optimal settings    │
│  and run normality tests                  │
│                                            │
│  📈 What You'll Learn:                    │
│  • Anderson-Darling Test                  │
│  • Shapiro-Wilk Test                      │
│  • Q-Q Plots                              │
│  • Normal Distribution                     │
│                                            │
│  ⚙️ How to Play:                          │
│  1. Use optimal settings from DOE         │
│  2. Collect 30+ shots                     │
│  3. Click "Run Normality Tests"           │
│  4. Interpret results                     │
│                                            │
│  [Got it!]  [View Detailed Guide]         │
└────────────────────────────────────────────┘
```

---

## 📁 **Data Structure**

### Option A: Static Content (Recommended for MVP)

**Location**: `src/lib/games/gameRules.ts`

```typescript
export interface GameRule {
  gameId: string
  mode?: GameMode // optional, for mode-specific rules
  overview: {
    title: string
    description: string
    objective: string
    imageUrl?: string
  }
  controls: ControlInstruction[]
  scoring: ScoringRule[]
  learningGoals: LearningObjective[]
  tips: string[]
  successCriteria: string[]
  estimatedTime: string
}

export interface ControlInstruction {
  name: string
  description: string
  icon: string
  keyBinding?: string
}

export interface ScoringRule {
  action: string
  points: number
  description: string
}

export interface LearningObjective {
  concept: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}
```

**Example Data**:
```typescript
export const catapultRules: GameRule = {
  gameId: 'catapult',
  overview: {
    title: 'DOE Catapult Challenge',
    description: 'Master Design of Experiments through interactive catapult gameplay',
    objective: 'Launch projectiles to hit targets while learning factorial design',
    imageUrl: '/images/games/catapult-preview.png'
  },
  controls: [
    {
      name: 'Angle',
      description: 'Adjust launch angle between 15° and 75°',
      icon: '↗️',
      keyBinding: 'Arrow Keys'
    },
    {
      name: 'Force',
      description: 'Set launch force from 50% to 150%',
      icon: '💪'
    },
    {
      name: 'Weight',
      description: 'Choose projectile weight: Light, Medium, or Heavy',
      icon: '⚖️'
    }
  ],
  scoring: [
    {
      action: 'Hit Target',
      points: 100,
      description: 'Land in target zone'
    },
    {
      action: 'Bullseye',
      points: 500,
      description: 'Perfect center hit'
    },
    {
      action: 'Streak Bonus',
      points: 50,
      description: 'Per consecutive hit'
    }
  ],
  learningGoals: [
    {
      concept: '2³ Factorial Design',
      description: 'Understand how to design experiments with 3 factors at 2 levels',
      difficulty: 'intermediate'
    },
    {
      concept: 'Main Effects',
      description: 'Learn to calculate and interpret factor effects',
      difficulty: 'intermediate'
    },
    {
      concept: 'Interaction Effects',
      description: 'Understand how factors work together',
      difficulty: 'advanced'
    }
  ],
  tips: [
    'Start with Free Play to get familiar with controls',
    'In DOE mode, follow the experiment matrix for best learning',
    'Higher angles work better for distant targets',
    'Record your observations for each experiment'
  ],
  successCriteria: [
    'Complete all 8 DOE experiments',
    'Achieve 70%+ accuracy',
    'Unlock all game modes'
  ],
  estimatedTime: '15-20 minutes per mode'
}
```

---

### Option B: Database Schema (For Future Scalability)

```sql
CREATE TABLE game_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id),
  mode VARCHAR(50), -- 'freeplay', 'doe', 'validation', etc.
  title VARCHAR(255) NOT NULL,
  description TEXT,
  objective TEXT,
  image_url VARCHAR(500),
  controls JSONB, -- Array of control instructions
  scoring JSONB, -- Array of scoring rules
  learning_goals JSONB, -- Array of learning objectives
  tips TEXT[], -- Array of tips
  success_criteria TEXT[], -- Array of success criteria
  estimated_time VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track user's rule viewing preferences
CREATE TABLE user_game_rules_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  game_id UUID REFERENCES games(id),
  mode VARCHAR(50),
  has_viewed BOOLEAN DEFAULT FALSE,
  dont_show_again BOOLEAN DEFAULT FALSE,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🛠️ **Technical Implementation**

### Phase 1: Core Components (2-3 hours)

#### 1. **GameRulesModal Component**
**File**: `src/components/games/GameRulesModal.tsx`

```typescript
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { GameRule } from '@/lib/games/gameRules'

interface GameRulesModalProps {
  open: boolean
  onClose: () => void
  gameRule: GameRule
  onStartGame: () => void
  onStartTutorial?: () => void
}

export function GameRulesModal({
  open,
  onClose,
  gameRule,
  onStartGame,
  onStartTutorial
}: GameRulesModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleStartGame = () => {
    if (dontShowAgain) {
      localStorage.setItem(`rules-seen-${gameRule.gameId}`, 'true')
    }
    onStartGame()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            🎯 {gameRule.overview.title} - How to Play
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="overview">
            {/* Overview content */}
          </TabsContent>

          <TabsContent value="controls">
            {/* Controls content */}
          </TabsContent>

          <TabsContent value="scoring">
            {/* Scoring content */}
          </TabsContent>

          <TabsContent value="learning">
            {/* Learning goals content */}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(!!checked)}
            />
            <label className="text-sm text-muted-foreground">
              Don't show this again
            </label>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Skip
            </Button>
            {onStartTutorial && (
              <Button variant="secondary" onClick={onStartTutorial}>
                Start Tutorial
              </Button>
            )}
            <Button onClick={handleStartGame}>
              Start Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

#### 2. **In-Game Rules Button**
**File**: `src/components/games/RulesButton.tsx`

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { GameRulesModal } from './GameRulesModal'
import { GameRule } from '@/lib/games/gameRules'

interface RulesButtonProps {
  gameRule: GameRule
  variant?: 'default' | 'floating'
}

export function RulesButton({ gameRule, variant = 'default' }: RulesButtonProps) {
  const [showRules, setShowRules] = useState(false)

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={() => setShowRules(true)}
          className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-110"
          title="View Rules"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <GameRulesModal
          open={showRules}
          onClose={() => setShowRules(false)}
          gameRule={gameRule}
          onStartGame={() => setShowRules(false)}
        />
      </>
    )
  }

  return (
    <>
      <Button variant="outline" onClick={() => setShowRules(true)}>
        <HelpCircle className="mr-2 h-4 w-4" />
        Rules & Tips
      </Button>

      <GameRulesModal
        open={showRules}
        onClose={() => setShowRules(false)}
        gameRule={gameRule}
        onStartGame={() => setShowRules(false)}
      />
    </>
  )
}
```

---

#### 3. **Mode-Specific Rules Toast**
**File**: `src/components/games/ModeRulesNotification.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, BookOpen } from 'lucide-react'
import { GameRule } from '@/lib/games/gameRules'

interface ModeRulesNotificationProps {
  gameId: string
  mode: string
  modeRule: GameRule
  onViewDetails: () => void
}

export function ModeRulesNotification({
  gameId,
  mode,
  modeRule,
  onViewDetails
}: ModeRulesNotificationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has seen this mode's rules
    const seen = localStorage.getItem(`rules-seen-${gameId}-${mode}`)
    if (!seen) {
      setShow(true)
    }
  }, [gameId, mode])

  const handleDismiss = () => {
    localStorage.setItem(`rules-seen-${gameId}-${mode}`, 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom">
      <Card className="p-4 bg-blue-50 border-blue-200 shadow-lg">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">
              {modeRule.overview.title}
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-blue-800 mb-3">
          {modeRule.overview.objective}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="flex-1"
          >
            Got it!
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onViewDetails()
              handleDismiss()
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            View Guide
          </Button>
        </div>
      </Card>
    </div>
  )
}
```

---

### Phase 2: Game Rules Data (1-2 hours)

#### Create Rules for All Games
**File**: `src/lib/games/gameRules.ts`

```typescript
import { GameMode } from '@/types/catapult'

export interface GameRule {
  gameId: string
  mode?: GameMode
  overview: {
    title: string
    description: string
    objective: string
    imageUrl?: string
  }
  controls: ControlInstruction[]
  scoring: ScoringRule[]
  learningGoals: LearningObjective[]
  tips: string[]
  successCriteria: string[]
  estimatedTime: string
}

// ... (interfaces from above)

// Catapult - Free Play
export const catapultFreePlayRules: GameRule = { /* ... */ }

// Catapult - DOE Mode
export const catapultDOERules: GameRule = { /* ... */ }

// Catapult - Validation Mode
export const catapultValidationRules: GameRule = { /* ... */ }

// Catapult - Capability Mode
export const catapultCapabilityRules: GameRule = { /* ... */ }

// Catapult - Control Mode
export const catapultControlRules: GameRule = { /* ... */ }

// Helper function to get rules
export function getGameRules(gameId: string, mode?: GameMode): GameRule {
  if (gameId === 'catapult') {
    switch (mode) {
      case 'freeplay':
        return catapultFreePlayRules
      case 'doe':
        return catapultDOERules
      case 'validation':
        return catapultValidationRules
      case 'capability':
        return catapultCapabilityRules
      case 'control':
        return catapultControlRules
      default:
        return catapultFreePlayRules
    }
  }
  
  // Add other games here
  throw new Error(`Rules not found for game: ${gameId}`)
}
```

---

### Phase 3: Integration (1 hour)

#### Update Game Detail Page
**File**: `src/app/games/[slug]/page.tsx`

```typescript
// Add rules modal trigger before "Play Now" button
const [showRules, setShowRules] = useState(false)

// Check if user has seen rules
useEffect(() => {
  const seen = localStorage.getItem(`rules-seen-${game.slug}`)
  if (!seen) {
    // Could auto-show on page load or wait for Play Now click
  }
}, [game.slug])

// Update Play Now button
<Link href={`/games/play/${game.slug}`}>
  <Button
    size="lg"
    onClick={(e) => {
      const seen = localStorage.getItem(`rules-seen-${game.slug}`)
      if (!seen) {
        e.preventDefault()
        setShowRules(true)
      }
    }}
  >
    <Play className="mr-2 h-5 w-5" />
    Play Now
  </Button>
</Link>

<GameRulesModal
  open={showRules}
  onClose={() => setShowRules(false)}
  gameRule={getGameRules(game.slug)}
  onStartGame={() => {
    setShowRules(false)
    router.push(`/games/play/${game.slug}`)
  }}
/>
```

#### Update Catapult Game Page
**File**: `src/app/games/play/catapult/page.tsx`

```typescript
import { RulesButton } from '@/components/games/RulesButton'
import { ModeRulesNotification } from '@/components/games/ModeRulesNotification'
import { getGameRules } from '@/lib/games/gameRules'

// In the render:
<div className="relative">
  {/* Floating Rules Button */}
  <RulesButton
    gameRule={getGameRules('catapult', gameMode)}
    variant="floating"
  />

  {/* Mode-specific notification */}
  <ModeRulesNotification
    gameId="catapult"
    mode={gameMode}
    modeRule={getGameRules('catapult', gameMode)}
    onViewDetails={() => {
      // Open rules modal
    }}
  />

  {/* Rest of game UI */}
</div>
```

---

## 📊 **Success Metrics**

### User Experience:
- [ ] 90%+ of first-time players view rules
- [ ] Average rules view time: 30-60 seconds
- [ ] <10% skip rate on first view
- [ ] 80%+ users complete tutorial (if implemented)

### Educational Value:
- [ ] Users can explain game objective after reading rules
- [ ] Users understand controls before playing
- [ ] Users know what Six Sigma concepts they'll learn

### Technical:
- [ ] Rules load in <500ms
- [ ] "Don't show again" persists correctly
- [ ] Mode-specific rules trigger appropriately
- [ ] In-game rules button always accessible

---

## 🎯 **Implementation Priority**

### Phase 1 (MVP - 2-3 hours):
1. ✅ Create `GameRulesModal` component
2. ✅ Create `RulesButton` component
3. ✅ Create rules data for Catapult (5 modes)
4. ✅ Integrate into Catapult game
5. ✅ Add localStorage persistence

### Phase 2 (Enhanced - 1-2 hours):
1. ✅ Add `ModeRulesNotification` component
2. ✅ Add mode-specific rules for all modes
3. ✅ Add visual aids (icons, images)
4. ✅ Add tips & tricks section

### Phase 3 (Polish - 1 hour):
1. ⬜ Add tutorial mode (interactive walkthrough)
2. ⬜ Add video tutorials
3. ⬜ Add printable rule sheets
4. ⬜ Add localization support

### Phase 4 (Future - 2-3 hours):
1. ⬜ Move to database (Supabase)
2. ⬜ Admin interface for editing rules
3. ⬜ A/B testing for rule formats
4. ⬜ Analytics on rule effectiveness

---

## 📝 **Content Checklist**

For each game, create rules covering:
- [ ] **Overview**: Title, description, objective
- [ ] **Controls**: All inputs with clear explanations
- [ ] **Scoring**: Point system and bonuses
- [ ] **Learning Goals**: Six Sigma concepts covered
- [ ] **Tips**: 3-5 helpful hints
- [ ] **Success Criteria**: Clear completion goals
- [ ] **Estimated Time**: How long to play
- [ ] **Mode-Specific**: Rules for each game mode

---

## 🔄 **User Flow Diagram**

```
User clicks "Play Now"
    ↓
Check localStorage: rules-seen-{gameId}?
    ↓
NO → Show GameRulesModal
    ↓
User reads rules (tabs: Overview, Controls, Scoring, Learning)
    ↓
User clicks "Don't show again" checkbox?
    ↓
YES → Set localStorage flag
    ↓
User clicks "Start Game"
    ↓
Navigate to game page
    ↓
Game loads with floating "Rules" button
    ↓
User switches to new mode?
    ↓
YES → Check localStorage: rules-seen-{gameId}-{mode}?
    ↓
NO → Show ModeRulesNotification (bottom-right)
    ↓
User clicks "View Guide" or "Got it!"
    ↓
Continue playing with rules accessible anytime
```

---

## 💻 **Code Example: Complete Integration**

### For Catapult Game:

```typescript
// src/app/games/play/catapult/page.tsx

import { RulesButton } from '@/components/games/RulesButton'
import { ModeRulesNotification } from '@/components/games/ModeRulesNotification'
import { getGameRules } from '@/lib/games/gameRules'
import { useState, useEffect } from 'react'

export default function CatapultGamePage() {
  const [gameMode, setGameMode] = useState<GameMode>('freeplay')
  const [showModeRules, setShowModeRules] = useState(false)

  // Watch for mode changes
  useEffect(() => {
    const seen = localStorage.getItem(`rules-seen-catapult-${gameMode}`)
    if (!seen && gameMode !== 'freeplay') {
      setShowModeRules(true)
    }
  }, [gameMode])

  return (
    <div className="relative min-h-screen">
      {/* Floating Rules Button */}
      <RulesButton
        gameRule={getGameRules('catapult', gameMode)}
        variant="floating"
      />

      {/* Mode Change Notification */}
      {showModeRules && (
        <ModeRulesNotification
          gameId="catapult"
          mode={gameMode}
          modeRule={getGameRules('catapult', gameMode)}
          onViewDetails={() => {
            // Could open full rules modal here
          }}
        />
      )}

      {/* Rest of game UI */}
      {/* ... */}
    </div>
  )
}
```

---

## 🎯 **Final Deliverables**

### Components (3 files):
1. `src/components/games/GameRulesModal.tsx` - Main rules display
2. `src/components/games/RulesButton.tsx` - In-game rules access
3. `src/components/games/ModeRulesNotification.tsx` - Mode change notification

### Data (1 file):
4. `src/lib/games/gameRules.ts` - All game rules data

### Integration (2 files modified):
5. `src/app/games/[slug]/page.tsx` - Game detail page
6. `src/app/games/play/catapult/page.tsx` - Catapult game page

### Documentation (1 file):
7. This scope document

---

## 📊 **Effort Estimate**

| Phase | Task | Time |
|-------|------|------|
| 1 | Build GameRulesModal component | 1.5 hours |
| 1 | Build RulesButton component | 30 min |
| 1 | Build ModeRulesNotification | 1 hour |
| 2 | Write all Catapult rules (5 modes) | 2 hours |
| 3 | Integrate into game pages | 1 hour |
| 3 | Testing & polish | 1 hour |
| **Total** | **MVP Complete** | **6-7 hours** |

---

## ✅ **Ready to Implement**

This scope is:
- ✅ **Comprehensive**: Covers all aspects of rules display
- ✅ **Detailed**: Includes code examples and data structures
- ✅ **Prioritized**: Clear MVP vs. future enhancements
- ✅ **Measurable**: Success metrics defined
- ✅ **Practical**: 6-7 hours for complete implementation

**Next Steps**:
1. Review and approve scope
2. Begin Phase 1: Build components
3. Phase 2: Write rule content
4. Phase 3: Integrate and test

---

**Created**: October 3, 2025  
**Status**: Scoped - Ready for Implementation  
**Estimated Effort**: 6-7 hours
