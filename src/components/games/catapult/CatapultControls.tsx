'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Play, RotateCcw, Zap, Target as TargetIcon } from 'lucide-react'
import type { CatapultSettings, WeightType } from '@/types/catapult'

// ============================================================================
// TYPES
// ============================================================================

interface CatapultControlsProps {
  settings: CatapultSettings
  onSettingsChange: (settings: CatapultSettings) => void
  onLaunch: () => void
  onReset: () => void
  isFlying: boolean
  disabled?: boolean
  showPrediction?: boolean
  onPredictionToggle?: () => void
}

// ============================================================================
// CATAPULT CONTROLS COMPONENT
// ============================================================================

export function CatapultControls({
  settings,
  onSettingsChange,
  onLaunch,
  onReset,
  isFlying,
  disabled = false,
  showPrediction = true,
  onPredictionToggle
}: CatapultControlsProps) {
  const handleAngleChange = (value: number) => {
    onSettingsChange({ ...settings, angle: value })
  }

  const handleForceChange = (value: number) => {
    onSettingsChange({ ...settings, force: value })
  }

  const handleWeightChange = (weight: WeightType) => {
    onSettingsChange({ ...settings, weight })
  }

  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Catapult Controls</h3>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
          Experiment Mode
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Angle Control */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Launch Angle
            </label>
            <span className="text-lg font-bold text-white">{settings.angle}°</span>
          </div>
          <input
            type="range"
            min="30"
            max="60"
            step="1"
            value={settings.angle}
            onChange={(e) => handleAngleChange(Number(e.target.value))}
            disabled={disabled || isFlying}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((settings.angle - 30) / 30) * 100}%, #374151 ${((settings.angle - 30) / 30) * 100}%, #374151 100%)`
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>30° (Low)</span>
            <span>45° (Optimal)</span>
            <span>60° (High)</span>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Force Control */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Launch Force
            </label>
            <span className="text-lg font-bold text-white">{settings.force}N</span>
          </div>
          <input
            type="range"
            min="75"
            max="125"
            step="1"
            value={settings.force}
            onChange={(e) => handleForceChange(Number(e.target.value))}
            disabled={disabled || isFlying}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${((settings.force - 75) / 50) * 100}%, #374151 ${((settings.force - 75) / 50) * 100}%, #374151 100%)`
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>75N (Low)</span>
            <span>100N (Medium)</span>
            <span>125N (High)</span>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Weight Control */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-300">
            Projectile Weight
          </label>
          <div className="grid grid-cols-3 gap-2">
            <WeightButton
              label="Light"
              selected={settings.weight === 'light'}
              onClick={() => handleWeightChange('light')}
              disabled={disabled || isFlying}
              icon="🪶"
              description="1.0 kg"
            />
            <WeightButton
              label="Medium"
              selected={settings.weight === 'medium'}
              onClick={() => handleWeightChange('medium')}
              disabled={disabled || isFlying}
              icon="⚪"
              description="1.5 kg"
            />
            <WeightButton
              label="Heavy"
              selected={settings.weight === 'heavy'}
              onClick={() => handleWeightChange('heavy')}
              disabled={disabled || isFlying}
              icon="🏋️"
              description="2.0 kg"
            />
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Prediction Toggle */}
        {onPredictionToggle && (
          <div className="flex items-center justify-between rounded-lg bg-slate-700/50 p-3">
            <div className="flex items-center gap-2">
              <TargetIcon className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-300">Show Trajectory</span>
            </div>
            <button
              onClick={onPredictionToggle}
              disabled={disabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showPrediction ? 'bg-blue-600' : 'bg-gray-600'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showPrediction ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={onLaunch}
            disabled={disabled || isFlying}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            size="lg"
          >
            <Play className="mr-2 h-5 w-5" />
            {isFlying ? 'Launching...' : 'Launch Catapult'}
          </Button>
          
          <Button
            onClick={onReset}
            disabled={disabled}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Settings
          </Button>
        </div>

        {/* Quick Settings */}
        <div className="rounded-lg border border-white/10 bg-slate-700/30 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">
            <Zap className="h-3 w-3" />
            <span>QUICK PRESETS</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSettingsChange({ angle: 45, force: 100, weight: 'medium' })}
              disabled={disabled || isFlying}
              className="flex-1 text-xs"
            >
              Balanced
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSettingsChange({ angle: 30, force: 125, weight: 'light' })}
              disabled={disabled || isFlying}
              className="flex-1 text-xs"
            >
              Far Shot
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSettingsChange({ angle: 60, force: 75, weight: 'heavy' })}
              disabled={disabled || isFlying}
              className="flex-1 text-xs"
            >
              High Arc
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// WEIGHT BUTTON COMPONENT
// ============================================================================

function WeightButton({
  label,
  selected,
  onClick,
  disabled,
  icon,
  description
}: {
  label: string
  selected: boolean
  onClick: () => void
  disabled: boolean
  icon: string
  description: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all ${
        selected
          ? 'border-blue-500 bg-blue-500/20 text-white'
          : 'border-white/10 bg-slate-700/50 text-gray-400 hover:border-white/20 hover:bg-slate-700'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span className="mb-1 text-2xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
      <span className="text-xs text-gray-500">{description}</span>
    </button>
  )
}
