/**
 * Game Rules Modal Component
 * Displays comprehensive game rules in a tabbed interface
 */

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Target,
  Gamepad2,
  Trophy,
  GraduationCap,
  Clock,
  CheckCircle2,
  Lightbulb
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

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

export interface GameRule {
  gameId: string
  mode?: string
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

interface GameRulesModalProps {
  open: boolean
  onClose: () => void
  gameRule: GameRule
  onStartGame: () => void
  onStartTutorial?: () => void
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-500/10 text-green-700 border-green-200'
    case 'intermediate':
      return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
    case 'advanced':
      return 'bg-red-500/10 text-red-700 border-red-200'
    default:
      return 'bg-gray-500/10 text-gray-700 border-gray-200'
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

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
      localStorage.setItem(`rules-seen-${gameRule.gameId}${gameRule.mode ? `-${gameRule.mode}` : ''}`, 'true')
    }
    onStartGame()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            {gameRule.overview.title} - How to Play
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {gameRule.overview.description}
          </p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <Target className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="controls" className="text-xs sm:text-sm">
              <Gamepad2 className="h-4 w-4 mr-1" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="scoring" className="text-xs sm:text-sm">
              <Trophy className="h-4 w-4 mr-1" />
              Scoring
            </TabsTrigger>
            <TabsTrigger value="learning" className="text-xs sm:text-sm">
              <GraduationCap className="h-4 w-4 mr-1" />
              Learning
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-4 m-0">
              {gameRule.overview.imageUrl && (
                <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <Target className="h-20 w-20 text-blue-600 opacity-50" />
                </div>
              )}

              <Card className="p-4 bg-blue-50 border-blue-200">
                <h3 className="font-semibold flex items-center gap-2 mb-2 text-blue-900">
                  <Target className="h-5 w-5" />
                  Game Objective
                </h3>
                <p className="text-sm text-blue-800">{gameRule.overview.objective}</p>
              </Card>

              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                  What You&apos;ll Learn
                </h3>
                <div className="space-y-2">
                  {gameRule.learningGoals.slice(0, 3).map((goal, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{goal.concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Success Criteria
                </h3>
                <div className="space-y-2">
                  {gameRule.successCriteria.map((criteria, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-blue-700">{idx + 1}</span>
                      </div>
                      <span className="text-sm">{criteria}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Time</p>
                  <p className="text-sm font-semibold">{gameRule.estimatedTime}</p>
                </div>
              </div>
            </TabsContent>

            {/* CONTROLS TAB */}
            <TabsContent value="controls" className="space-y-4 m-0">
              <Card className="p-4 bg-purple-50 border-purple-200">
                <h3 className="font-semibold flex items-center gap-2 mb-2 text-purple-900">
                  <Gamepad2 className="h-5 w-5" />
                  How to Play
                </h3>
                <p className="text-sm text-purple-800">
                  Use these controls to interact with the game. Master the basics before attempting advanced modes.
                </p>
              </Card>

              <div className="grid gap-4">
                {gameRule.controls.map((control, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{control.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{control.name}</h4>
                          {control.keyBinding && (
                            <Badge variant="secondary" className="text-xs">
                              {control.keyBinding}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{control.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {gameRule.tips.length > 0 && (
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <h3 className="font-semibold flex items-center gap-2 mb-3 text-amber-900">
                    <Lightbulb className="h-5 w-5" />
                    Tips & Tricks
                  </h3>
                  <ul className="space-y-2">
                    {gameRule.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                        <span className="text-amber-600 font-semibold">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </TabsContent>

            {/* SCORING TAB */}
            <TabsContent value="scoring" className="space-y-4 m-0">
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <h3 className="font-semibold flex items-center gap-2 mb-2 text-yellow-900">
                  <Trophy className="h-5 w-5" />
                  Point System
                </h3>
                <p className="text-sm text-yellow-800">
                  Earn points by completing objectives and mastering the game mechanics.
                </p>
              </Card>

              <div className="grid gap-3">
                {gameRule.scoring.map((rule, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{rule.action}</h4>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                      <div className="ml-4 flex flex-col items-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          +{rule.points}
                        </div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <h3 className="font-semibold mb-2 text-purple-900">Bonus Multipliers</h3>
                <p className="text-sm text-purple-800">
                  Chain consecutive successes to earn streak bonuses and maximize your score!
                </p>
              </Card>
            </TabsContent>

            {/* LEARNING TAB */}
            <TabsContent value="learning" className="space-y-4 m-0">
              <Card className="p-4 bg-green-50 border-green-200">
                <h3 className="font-semibold flex items-center gap-2 mb-2 text-green-900">
                  <GraduationCap className="h-5 w-5" />
                  Educational Objectives
                </h3>
                <p className="text-sm text-green-800">
                  This game teaches real-world Six Sigma and Continuous Improvement concepts.
                </p>
              </Card>

              <div className="space-y-3">
                {gameRule.learningGoals.map((goal, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{goal.concept}</h4>
                          <Badge className={getDifficultyColor(goal.difficulty)}>
                            {goal.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-4 bg-gradient-to-br from-indigo-50 to-cyan-50 border-indigo-200">
                <h3 className="font-semibold mb-2 text-indigo-900">After Completing This Game</h3>
                <p className="text-sm text-indigo-800 mb-3">
                  You&apos;ll be able to apply these concepts in real-world scenarios and advance your Six Sigma knowledge.
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-indigo-800">Certificate eligible upon completion</span>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(!!checked)}
            />
            <label
              htmlFor="dont-show"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Don&apos;t show this again
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
            <Button onClick={handleStartGame} className="bg-blue-600 hover:bg-blue-700">
              Start Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// EXPORT
// ============================================================================

export default GameRulesModal
