'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  FlaskConical, 
  BarChart3, 
  Target, 
  TrendingUp,
  Lock,
  CheckCircle2
} from 'lucide-react'
import type { GameMode, GameProgress } from '@/types/catapult'

// ============================================================================
// TYPES
// ============================================================================

interface ModeSelectorProps {
  currentMode: GameMode
  progress: GameProgress
  onModeChange: (mode: GameMode) => void
  disabled?: boolean
}

interface ModeConfig {
  id: GameMode
  name: string
  icon: React.ReactNode
  description: string
  color: string
  unlockRequirement?: string
}

// ============================================================================
// MODE CONFIGURATIONS
// ============================================================================

const MODE_CONFIGS: ModeConfig[] = [
  {
    id: 'freeplay',
    name: 'Free Play',
    icon: <Play className="h-4 w-4" />,
    description: 'Practice and explore',
    color: 'text-blue-400'
  },
  {
    id: 'doe',
    name: 'DOE Challenge',
    icon: <FlaskConical className="h-4 w-4" />,
    description: 'Design of Experiments',
    color: 'text-purple-400',
    unlockRequirement: 'Complete tutorial'
  },
  {
    id: 'validation',
    name: 'Validation Study',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Normality testing',
    color: 'text-green-400',
    unlockRequirement: 'Complete DOE (8 experiments)'
  },
  {
    id: 'capability',
    name: 'Capability Analysis',
    icon: <Target className="h-4 w-4" />,
    description: 'Process capability (Cpk)',
    color: 'text-orange-400',
    unlockRequirement: 'Complete Validation (30 shots)'
  },
  {
    id: 'control',
    name: 'Control Charts',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Statistical process control',
    color: 'text-pink-400',
    unlockRequirement: 'Complete Capability Analysis'
  }
]

// ============================================================================
// MODE SELECTOR COMPONENT
// ============================================================================

export function ModeSelector({
  currentMode,
  progress,
  onModeChange,
  disabled = false
}: ModeSelectorProps) {
  const isModeUnlocked = (mode: GameMode): boolean => {
    return progress.unlockedModes.includes(mode)
  }

  const isModeCompleted = (mode: GameMode): boolean => {
    return progress.completedModes.includes(mode)
  }

  const getNextUnlock = (): ModeConfig | null => {
    const nextMode = MODE_CONFIGS.find(
      config => !progress.unlockedModes.includes(config.id)
    )
    return nextMode || null
  }

  const getProgressPercentage = (): number => {
    return Math.round((progress.completedModes.length / MODE_CONFIGS.length) * 100)
  }

  const nextUnlock = getNextUnlock()
  const progressPercent = getProgressPercentage()

  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">🎯 Catapult Quality Lab</h3>
        <Badge 
          variant="secondary" 
          className="bg-blue-500/20 text-blue-400"
        >
          {progress.completedModes.length}/{MODE_CONFIGS.length} Complete
        </Badge>
      </div>

      {/* Mode Tabs */}
      <Tabs value={currentMode} onValueChange={(value) => onModeChange(value as GameMode)}>
        <TabsList className="grid w-full grid-cols-5 bg-slate-700/50">
          {MODE_CONFIGS.map((config) => {
            const isUnlocked = isModeUnlocked(config.id)
            const isCompleted = isModeCompleted(config.id)
            const isActive = currentMode === config.id

            return (
              <TabsTrigger
                key={config.id}
                value={config.id}
                disabled={!isUnlocked || disabled}
                className={`relative ${
                  isActive 
                    ? 'bg-slate-600 text-white' 
                    : isUnlocked 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-600'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  {/* Icon with status indicator */}
                  <div className="relative">
                    <div className={isUnlocked ? config.color : 'text-gray-600'}>
                      {config.icon}
                    </div>
                    
                    {/* Lock icon for locked modes */}
                    {!isUnlocked && (
                      <Lock className="absolute -right-2 -top-2 h-3 w-3 text-gray-500" />
                    )}
                    
                    {/* Checkmark for completed modes */}
                    {isCompleted && (
                      <CheckCircle2 className="absolute -right-2 -top-2 h-3 w-3 text-green-500" />
                    )}
                  </div>
                  
                  {/* Mode name */}
                  <span className="text-xs font-medium">
                    {config.name.split(' ')[0]}
                  </span>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {/* Mode Description */}
      <div className="mt-4 rounded-lg bg-slate-700/30 p-4">
        {MODE_CONFIGS.filter(c => c.id === currentMode).map((config) => (
          <div key={config.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={config.color}>
                {config.icon}
              </div>
              <h4 className="font-semibold text-white">{config.name}</h4>
            </div>
            <p className="text-sm text-gray-400">{config.description}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Overall Progress</span>
          <span className="font-medium text-white">{progressPercent}%</span>
        </div>
        
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {/* Next unlock info */}
        {nextUnlock && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Lock className="h-3 w-3" />
            <span>
              Next unlock: <span className="font-medium text-white">{nextUnlock.name}</span>
              {nextUnlock.unlockRequirement && (
                <span className="text-gray-500"> - {nextUnlock.unlockRequirement}</span>
              )}
            </span>
          </div>
        )}
        
        {/* Completion message */}
        {!nextUnlock && progressPercent === 100 && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle2 className="h-3 w-3" />
            <span className="font-medium">
              🎓 Black Belt Certification Ready!
            </span>
          </div>
        )}
      </div>

      {/* Achievement Count */}
      {progress.achievements.length > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <div className="text-sm font-medium text-yellow-400">
                {progress.achievements.length} Achievement{progress.achievements.length !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-400">
                Keep unlocking modes to earn more!
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// COMPACT MODE SELECTOR (for smaller spaces)
// ============================================================================

export function CompactModeSelector({
  currentMode,
  progress,
  onModeChange
}: ModeSelectorProps) {
  const isModeUnlocked = (mode: GameMode): boolean => {
    return progress.unlockedModes.includes(mode)
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 p-2">
      {MODE_CONFIGS.map((config) => {
        const isUnlocked = isModeUnlocked(config.id)
        const isActive = currentMode === config.id

        return (
          <button
            key={config.id}
            onClick={() => isUnlocked && onModeChange(config.id)}
            disabled={!isUnlocked}
            className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition-all ${
              isActive
                ? 'bg-slate-600 text-white'
                : isUnlocked
                ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                : 'cursor-not-allowed text-gray-600'
            }`}
            title={config.description}
          >
            <div className={isUnlocked ? config.color : 'text-gray-600'}>
              {config.icon}
            </div>
            <span className="hidden md:inline">{config.name.split(' ')[0]}</span>
            {!isUnlocked && <Lock className="h-3 w-3" />}
          </button>
        )
      })}
    </div>
  )
}
