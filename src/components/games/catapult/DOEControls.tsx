'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FlaskConical, 
  Play, 
  RotateCcw, 
  Download,
  ChevronRight,
  Table as TableIcon
} from 'lucide-react'
import type { DOEExperiment, CatapultSettings } from '@/types/catapult'
import { DOE_LEVELS } from '@/types/catapult'
import { 
  getExperimentSummary, 
  getNextIncompleteExperiment,
  loadExperimentSettings 
} from '@/lib/games/catapult/doeEngine'

// ============================================================================
// TYPES
// ============================================================================

interface DOEControlsProps {
  experiments: DOEExperiment[]
  currentSettings: CatapultSettings
  onSettingsChange: (settings: CatapultSettings) => void
  onLaunch: () => void
  onReset: () => void
  onShowMatrix: () => void
  onExport: () => void
  isFlying: boolean
  disabled?: boolean
}

// ============================================================================
// DOE CONTROLS COMPONENT
// ============================================================================

export function DOEControls({
  experiments,
  currentSettings,
  onSettingsChange,
  onLaunch,
  onReset,
  onShowMatrix,
  onExport,
  isFlying,
  disabled = false
}: DOEControlsProps) {
  const summary = getExperimentSummary(experiments)
  const nextExperiment = getNextIncompleteExperiment(experiments)
  
  // Get current DOE levels from settings
  const getCurrentLevels = () => {
    return {
      angle: currentSettings.angle === DOE_LEVELS.angle.low ? 'low' : 'high',
      force: currentSettings.force === DOE_LEVELS.force.low ? 'low' : 'high',
      weight: currentSettings.weight === DOE_LEVELS.weight.low ? 'low' : 'high'
    }
  }
  
  const currentLevels = getCurrentLevels()
  
  // Handle level toggle
  const handleLevelToggle = (
    factor: 'angle' | 'force' | 'weight',
    level: 'low' | 'high'
  ) => {
    const newSettings = { ...currentSettings }
    
    if (factor === 'angle') {
      newSettings.angle = DOE_LEVELS.angle[level]
    } else if (factor === 'force') {
      newSettings.force = DOE_LEVELS.force[level]
    } else if (factor === 'weight') {
      newSettings.weight = DOE_LEVELS.weight[level]
    }
    
    onSettingsChange(newSettings)
  }
  
  // Load next experiment
  const handleLoadNext = () => {
    if (nextExperiment) {
      const settings = loadExperimentSettings(nextExperiment)
      onSettingsChange(settings)
    }
  }
  
  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">DOE Experiment Mode</h3>
        </div>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
          2³ Factorial Design
        </Badge>
      </div>

      {/* Progress Section */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Experiment {summary.completed} of {summary.total}
          </span>
          <span className="font-bold text-white">{summary.percentage}%</span>
        </div>
        
        <Progress value={summary.percentage} className="h-2" />
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>✅ {summary.completed} Completed</span>
          <span>⬜ {summary.remaining} Remaining</span>
        </div>
      </div>

      {/* Factor Level Toggles */}
      <div className="space-y-4">
        {/* Angle */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Angle
          </label>
          <div className="grid grid-cols-2 gap-2">
            <LevelButton
              label="LOW"
              value="30°"
              selected={currentLevels.angle === 'low'}
              onClick={() => handleLevelToggle('angle', 'low')}
              disabled={disabled || isFlying}
              color="blue"
            />
            <LevelButton
              label="HIGH"
              value="60°"
              selected={currentLevels.angle === 'high'}
              onClick={() => handleLevelToggle('angle', 'high')}
              disabled={disabled || isFlying}
              color="blue"
            />
          </div>
        </div>

        {/* Force */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Force
          </label>
          <div className="grid grid-cols-2 gap-2">
            <LevelButton
              label="LOW"
              value="75N"
              selected={currentLevels.force === 'low'}
              onClick={() => handleLevelToggle('force', 'low')}
              disabled={disabled || isFlying}
              color="green"
            />
            <LevelButton
              label="HIGH"
              value="125N"
              selected={currentLevels.force === 'high'}
              onClick={() => handleLevelToggle('force', 'high')}
              disabled={disabled || isFlying}
              color="green"
            />
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Weight
          </label>
          <div className="grid grid-cols-2 gap-2">
            <LevelButton
              label="LOW"
              value="Light (1.0kg)"
              selected={currentLevels.weight === 'low'}
              onClick={() => handleLevelToggle('weight', 'low')}
              disabled={disabled || isFlying}
              color="orange"
            />
            <LevelButton
              label="HIGH"
              value="Heavy (2.0kg)"
              selected={currentLevels.weight === 'high'}
              onClick={() => handleLevelToggle('weight', 'high')}
              disabled={disabled || isFlying}
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="my-4 rounded-lg bg-slate-700/30 p-3">
        <div className="text-xs font-medium text-gray-400">Current Settings:</div>
        <div className="mt-1 text-sm font-bold text-white">
          {currentSettings.angle}° • {currentSettings.force}N • {currentSettings.weight}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={onLaunch}
          disabled={disabled || isFlying}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          <Play className="mr-2 h-4 w-4" />
          {isFlying ? 'Launching...' : 'Launch Experiment'}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleLoadNext}
            disabled={!nextExperiment || disabled || isFlying}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="mr-1 h-3 w-3" />
            Load Next
          </Button>
          
          <Button
            onClick={onShowMatrix}
            disabled={disabled}
            variant="outline"
            size="sm"
          >
            <TableIcon className="mr-1 h-3 w-3" />
            View Matrix
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onReset}
            disabled={disabled || summary.completed === 0}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset All
          </Button>
          
          <Button
            onClick={onExport}
            disabled={disabled || summary.completed === 0}
            variant="outline"
            size="sm"
          >
            <Download className="mr-1 h-3 w-3" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Next Experiment Hint */}
      {nextExperiment && (
        <div className="mt-4 rounded-lg border border-purple-500/20 bg-purple-500/10 p-3">
          <div className="text-xs font-medium text-purple-400">
            📌 Next Experiment: Run {nextExperiment.runNumber}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {nextExperiment.angle.toUpperCase()} Angle • {' '}
            {nextExperiment.force.toUpperCase()} Force • {' '}
            {nextExperiment.weight.toUpperCase()} Weight
          </div>
        </div>
      )}

      {/* Completion Message */}
      {summary.completed === summary.total && (
        <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <div>
              <div className="text-sm font-bold text-green-400">
                All Experiments Complete!
              </div>
              <div className="text-xs text-gray-400">
                Ready to analyze results
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// LEVEL BUTTON COMPONENT
// ============================================================================

interface LevelButtonProps {
  label: string
  value: string
  selected: boolean
  onClick: () => void
  disabled: boolean
  color: 'blue' | 'green' | 'orange'
}

function LevelButton({
  label,
  value,
  selected,
  onClick,
  disabled,
  color
}: LevelButtonProps) {
  const colorClasses = {
    blue: selected
      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
      : 'border-white/10 bg-slate-700/50 text-gray-400 hover:border-blue-500/50 hover:bg-slate-700',
    green: selected
      ? 'border-green-500 bg-green-500/20 text-green-400'
      : 'border-white/10 bg-slate-700/50 text-gray-400 hover:border-green-500/50 hover:bg-slate-700',
    orange: selected
      ? 'border-orange-500 bg-orange-500/20 text-orange-400'
      : 'border-white/10 bg-slate-700/50 text-gray-400 hover:border-orange-500/50 hover:bg-slate-700'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all ${
        colorClasses[color]
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span className="text-xs font-bold">{label}</span>
      <span className="mt-1 text-xs opacity-80">{value}</span>
      {selected && (
        <div className="mt-1">
          <div className="h-1 w-1 rounded-full bg-current" />
        </div>
      )}
    </button>
  )
}

// ============================================================================
// COMPACT DOE CONTROLS (for smaller spaces)
// ============================================================================

export function CompactDOEControls({
  experiments,
  onShowMatrix
}: {
  experiments: DOEExperiment[]
  onShowMatrix: () => void
}) {
  const summary = getExperimentSummary(experiments)
  
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
      <div className="flex items-center gap-3">
        <FlaskConical className="h-4 w-4 text-purple-400" />
        <div>
          <div className="text-sm font-medium text-white">
            DOE: {summary.completed}/{summary.total}
          </div>
          <div className="text-xs text-gray-400">{summary.percentage}% Complete</div>
        </div>
      </div>
      <Button onClick={onShowMatrix} variant="outline" size="sm">
        <TableIcon className="mr-1 h-3 w-3" />
        View
      </Button>
    </div>
  )
}
