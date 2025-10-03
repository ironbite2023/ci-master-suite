'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Play,
  RotateCcw,
  Home,
  Trophy,
  Star,
  Clock,
  Target,
  TrendingUp,
  Award,
  Share2,
  Download,
  ChevronRight
} from 'lucide-react'
import type { ModalData } from '@/types/games'

// ============================================================================
// TYPES
// ============================================================================

export interface GameModalProps {
  isOpen: boolean
  onClose: () => void
  data: ModalData
  onAction?: (action: string) => void
}

// ============================================================================
// GAME MODAL COMPONENT
// ============================================================================

export function GameModal({ isOpen, onClose, data, onAction }: GameModalProps) {
  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action)
    }
    onClose()
  }
  
  const renderContent = () => {
    switch (data.type) {
      case 'start':
        return <StartModal data={data} onAction={handleAction} />
      case 'pause':
        return <PauseModal data={data} onAction={handleAction} />
      case 'completion':
      case 'complete':
        return <CompleteModal data={data} onAction={handleAction} />
      case 'gameover':
        return <GameOverModal data={data} onAction={handleAction} />
      case 'tutorial':
        return <TutorialModal data={data} onAction={handleAction} />
      case 'custom':
        return <CustomModal data={data} onAction={handleAction} />
      default:
        return null
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-white/10 bg-slate-900 text-white">
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// START MODAL
// ============================================================================

function StartModal({ data, onAction }: { data: ModalData; onAction: (action: string) => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold">{data.title || 'Start Game'}</DialogTitle>
        <DialogDescription className="text-base text-gray-400">
          {data.description || 'Get ready to play!'}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        {/* Difficulty Selection */}
        {data.difficulty && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">Select Difficulty</h3>
            <div className="grid grid-cols-3 gap-2">
              <DifficultyButton difficulty="easy" label="Easy" icon="🟢" onClick={() => onAction('start-easy')} />
              <DifficultyButton difficulty="medium" label="Medium" icon="🟡" onClick={() => onAction('start-medium')} />
              <DifficultyButton difficulty="hard" label="Hard" icon="🔴" onClick={() => onAction('start-hard')} />
            </div>
          </div>
        )}
        
        {/* Game Instructions */}
        {data.instructions && (
          <Card className="border-white/10 bg-slate-800/50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Target className="h-4 w-4 text-blue-400" />
              How to Play
            </h3>
            <ul className="space-y-1 text-sm text-gray-400">
              {data.instructions.map((instruction, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-3 w-3 flex-shrink-0" />
                  {instruction}
                </li>
              ))}
            </ul>
          </Card>
        )}
        
        {/* Statistics */}
        {data.stats && (
          <div className="grid grid-cols-3 gap-2">
            <StatCard icon={<Trophy />} label="Best Score" value={data.stats.bestScore?.toLocaleString() || '0'} />
            <StatCard icon={<Star />} label="Avg Score" value={data.stats.avgScore?.toLocaleString() || '0'} />
            <StatCard icon={<Play />} label="Plays" value={data.stats.totalPlays?.toString() || '0'} />
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onAction('cancel')} className="flex-1">
          Cancel
        </Button>
        <Button onClick={() => onAction(data.difficulty ? 'start-medium' : 'start')} className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Play className="mr-2 h-4 w-4" />
          Start Game
        </Button>
      </div>
    </>
  )
}

// ============================================================================
// PAUSE MODAL
// ============================================================================

function PauseModal({ data, onAction }: { data: ModalData; onAction: (action: string) => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold">Game Paused</DialogTitle>
        <DialogDescription className="text-gray-400">
          Take a break and resume when ready
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Star />} label="Score" value={data.score?.toLocaleString() || '0'} />
          <StatCard icon={<Clock />} label="Time" value={formatTime(data.timeElapsed || 0)} />
          {data.progress !== undefined && (
            <StatCard icon={<Target />} label="Progress" value={`${Math.round(data.progress)}%`} />
          )}
          {data.level !== undefined && (
            <StatCard icon={<TrendingUp />} label="Level" value={data.level.toString()} />
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onAction('quit')} className="flex-1">
          <Home className="mr-2 h-4 w-4" />
          Quit
        </Button>
        <Button variant="outline" onClick={() => onAction('restart')} className="flex-1">
          <RotateCcw className="mr-2 h-4 w-4" />
          Restart
        </Button>
        <Button onClick={() => onAction('resume')} className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Play className="mr-2 h-4 w-4" />
          Resume
        </Button>
      </div>
    </>
  )
}

// ============================================================================
// COMPLETE MODAL
// ============================================================================

function CompleteModal({ data, onAction }: { data: ModalData; onAction: (action: string) => void }) {
  const isNewBest = data.isNewBest || false
  const rank = data.rank || null
  
  return (
    <>
      <DialogHeader>
        <div className="text-center">
          <div className="mb-2 text-6xl">🎉</div>
          <DialogTitle className="text-4xl font-bold text-blue-400">
            {isNewBest ? 'New Best Score!' : 'Game Complete!'}
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-400">
            {data.description || 'Congratulations on finishing!'}
          </DialogDescription>
        </div>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        {/* Score Display */}
        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 text-center">
          <div className="mb-2 text-sm text-gray-400">Final Score</div>
          <div className="text-5xl font-bold text-white">{data.score?.toLocaleString() || '0'}</div>
          {isNewBest && (
            <Badge className="mt-2 bg-yellow-500/20 text-yellow-400">
              <Trophy className="mr-1 h-3 w-3" />
              Personal Best
            </Badge>
          )}
        </Card>
        
        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={<Clock />} label="Time" value={formatTime(data.timeElapsed || 0)} />
          {data.accuracy !== undefined && (
            <StatCard icon={<Target />} label="Accuracy" value={`${Math.round(data.accuracy)}%`} />
          )}
          {rank && (
            <StatCard icon={<TrendingUp />} label="Rank" value={`#${rank}`} />
          )}
        </div>
        
        {/* Achievements Unlocked */}
        {data.achievements && data.achievements.length > 0 && (
          <Card className="border-purple-500/20 bg-purple-900/10 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-purple-400">
              <Award className="h-4 w-4" />
              Achievements Unlocked ({data.achievements.length})
            </h3>
            <div className="space-y-2">
              {data.achievements.map((achievement, i) => (
                <div key={i} className="flex items-center gap-2 rounded bg-purple-900/20 p-2">
                  <span className="text-xl">{achievement.icon || '🏆'}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{achievement.name}</div>
                    <div className="text-xs text-gray-400">{achievement.description}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    +{achievement.points}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        <Separator className="bg-white/10" />
        
        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => onAction('share')} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={() => onAction('save-replay')} className="gap-2">
            <Download className="h-4 w-4" />
            Save Replay
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onAction('home')} className="flex-1">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button onClick={() => onAction('play-again')} className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Play className="mr-2 h-4 w-4" />
          Play Again
        </Button>
      </div>
    </>
  )
}

// ============================================================================
// GAME OVER MODAL
// ============================================================================

function GameOverModal({ data, onAction }: { data: ModalData; onAction: (action: string) => void }) {
  return (
    <>
      <DialogHeader>
        <div className="text-center">
          <div className="mb-2 text-6xl">💔</div>
          <DialogTitle className="text-4xl font-bold text-red-400">Game Over</DialogTitle>
          <DialogDescription className="text-lg text-gray-400">
            {data.description || "Don't give up! Try again."}
          </DialogDescription>
        </div>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        {/* Score Display */}
        <Card className="border-white/10 bg-slate-800/50 p-6 text-center">
          <div className="mb-2 text-sm text-gray-400">Your Score</div>
          <div className="text-4xl font-bold text-white">{data.score?.toLocaleString() || '0'}</div>
        </Card>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={<Clock />} label="Time" value={formatTime(data.timeElapsed || 0)} />
          {data.level !== undefined && (
            <StatCard icon={<TrendingUp />} label="Level Reached" value={data.level.toString()} />
          )}
        </div>
        
        {/* Tip */}
        {data.tip && (
          <Card className="border-blue-500/20 bg-blue-900/10 p-4">
            <div className="text-sm text-blue-400">💡 Tip: {data.tip}</div>
          </Card>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onAction('home')} className="flex-1">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button onClick={() => onAction('try-again')} className="flex-1 bg-blue-600 hover:bg-blue-700">
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </>
  )
}

// ============================================================================
// TUTORIAL MODAL
// ============================================================================

function TutorialModal({ data, onAction }: { data: ModalData; onAction: (action: string) => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Tutorial</DialogTitle>
        <DialogDescription className="text-gray-400">
          Learn how to play
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        {data.steps && data.steps.map((step, i) => (
          <Card key={i} className="border-white/10 bg-slate-800/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 text-center">
                {i + 1}
              </Badge>
              <h3 className="font-medium">{step.title}</h3>
            </div>
            <p className="text-sm text-gray-400">{step.description}</p>
            {step.image && (
              <div className="mt-2 rounded bg-slate-700/50 p-4 text-center text-gray-500">
                [Tutorial Image: {step.image}]
              </div>
            )}
          </Card>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onAction('skip')} className="flex-1">
          Skip
        </Button>
        <Button onClick={() => onAction('start')} className="flex-1 bg-blue-600 hover:bg-blue-700">
          Got It!
        </Button>
      </div>
    </>
  )
}

// ============================================================================
// CUSTOM MODAL
// ============================================================================

function CustomModal({ data, onAction }: { data: ModalData; onAction: (action: string) => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">{data.title}</DialogTitle>
        {data.description && (
          <DialogDescription className="text-gray-400">
            {data.description}
          </DialogDescription>
        )}
      </DialogHeader>
      
      <div className="py-4">
        {data.content && (
          <div className="text-sm text-gray-300">{data.content}</div>
        )}
      </div>
      
      <div className="flex gap-2">
        {data.actions?.map((action, i) => (
          <Button
            key={i}
            variant={i === (data.actions?.length || 0) - 1 ? 'default' : 'outline'}
            onClick={() => onAction(action.value || action.label)}
            className="flex-1"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </>
  )
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function DifficultyButton({
  label,
  icon,
  onClick
}: {
  difficulty: string
  label: string
  icon: string
  onClick: () => void
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-auto flex-col gap-2 border-white/10 bg-slate-800/50 py-4 hover:border-white/30 hover:bg-slate-700/50"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  )
}

function StatCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Card className="border-white/10 bg-slate-800/50 p-3">
      <div className="mb-1 flex items-center justify-center text-blue-400">
        {icon}
      </div>
      <div className="text-center text-xs text-gray-400">{label}</div>
      <div className="text-center text-lg font-bold text-white">{value}</div>
    </Card>
  )
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
