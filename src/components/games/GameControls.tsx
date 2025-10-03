'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Settings,
  Info,
  Trophy,
  User,
  ArrowLeft,
  Maximize,
  Minimize,
  FastForward,
  Rewind
} from 'lucide-react'

// ============================================================================
// CONTROL BUTTON
// ============================================================================

export interface ControlButtonProps {
  icon: 'play' | 'pause' | 'restart' | 'volume' | 'mute' | 'settings' | 'info' | 'leaderboard' | 'profile' | 'back' | 'fullscreen' | 'minimize' | 'forward' | 'rewind'
  label?: string
  onClick: () => void
  disabled?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  className?: string
}

const iconMap = {
  play: Play,
  pause: Pause,
  restart: RotateCcw,
  volume: Volume2,
  mute: VolumeX,
  settings: Settings,
  info: Info,
  leaderboard: Trophy,
  profile: User,
  back: ArrowLeft,
  fullscreen: Maximize,
  minimize: Minimize,
  forward: FastForward,
  rewind: Rewind
}

export function ControlButton({
  icon,
  label,
  onClick,
  disabled = false,
  variant = 'outline',
  size = 'icon',
  className = ''
}: ControlButtonProps) {
  const Icon = iconMap[icon]
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={label || icon}
    >
      <Icon className={size === 'icon' ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
      {size !== 'icon' && label}
    </Button>
  )
}

// ============================================================================
// CONTROL GROUP
// ============================================================================

export interface ControlGroupProps {
  children: React.ReactNode
  label?: string
  className?: string
}

export function ControlGroup({ children, label, className = '' }: ControlGroupProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label className="text-xs text-gray-400">{label}</Label>}
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  )
}

// ============================================================================
// DIFFICULTY SELECTOR
// ============================================================================

export interface DifficultySelectorProps {
  value: 'easy' | 'medium' | 'hard'
  onChange: (value: 'easy' | 'medium' | 'hard') => void
  disabled?: boolean
  className?: string
}

export function DifficultySelector({
  value,
  onChange,
  disabled = false,
  className = ''
}: DifficultySelectorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-xs text-gray-400">Difficulty</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">🟢 Easy</SelectItem>
          <SelectItem value="medium">🟡 Medium</SelectItem>
          <SelectItem value="hard">🔴 Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// ============================================================================
// VOLUME CONTROL
// ============================================================================

export interface VolumeControlProps {
  volume: number
  onChange: (volume: number) => void
  muted: boolean
  onToggleMute: () => void
  className?: string
}

export function VolumeControl({
  volume,
  onChange,
  muted,
  onToggleMute,
  className = ''
}: VolumeControlProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-xs text-gray-400">Volume</Label>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          className="h-6 w-6"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <VolumeX className="h-3 w-3" />
          ) : (
            <Volume2 className="h-3 w-3" />
          )}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Slider
          value={[muted ? 0 : volume]}
          onValueChange={(values: number[]) => onChange(values[0])}
          max={100}
          step={1}
          className="flex-1"
          disabled={muted}
        />
        <span className="w-10 text-right text-xs text-gray-400">
          {muted ? '0' : volume}%
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// SPEED CONTROL
// ============================================================================

export interface SpeedControlProps {
  speed: number
  onChange: (speed: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function SpeedControl({
  speed,
  onChange,
  min = 0.5,
  max = 2,
  step = 0.25,
  className = ''
}: SpeedControlProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-xs text-gray-400">Speed</Label>
        <span className="text-xs font-medium text-white">{speed}x</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange(Math.max(min, speed - step))}
          disabled={speed <= min}
          className="h-6 w-6"
        >
          <Rewind className="h-3 w-3" />
        </Button>
        <Slider
          value={[speed]}
          onValueChange={(values: number[]) => onChange(values[0])}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange(Math.min(max, speed + step))}
          disabled={speed >= max}
          className="h-6 w-6"
        >
          <FastForward className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// TOGGLE CONTROL
// ============================================================================

export interface ToggleControlProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  description?: string
  className?: string
}

export function ToggleControl({
  label,
  checked,
  onChange,
  disabled = false,
  description,
  className = ''
}: ToggleControlProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="space-y-0.5">
        <Label className="text-sm">{label}</Label>
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  )
}

// ============================================================================
// GAME TOOLBAR
// ============================================================================

export interface GameToolbarProps {
  onPause?: () => void
  onResume?: () => void
  onRestart?: () => void
  onSettings?: () => void
  onLeaderboard?: () => void
  onInfo?: () => void
  isPaused: boolean
  isPlaying: boolean
  showPause?: boolean
  showRestart?: boolean
  showSettings?: boolean
  showLeaderboard?: boolean
  showInfo?: boolean
  className?: string
}

export function GameToolbar({
  onPause,
  onResume,
  onRestart,
  onSettings,
  onLeaderboard,
  onInfo,
  isPaused,
  isPlaying,
  showPause = true,
  showRestart = true,
  showSettings = true,
  showLeaderboard = true,
  showInfo = true,
  className = ''
}: GameToolbarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showPause && isPlaying && (
        <ControlButton
          icon={isPaused ? 'play' : 'pause'}
          onClick={isPaused ? (onResume || (() => {})) : (onPause || (() => {}))}
          label={isPaused ? 'Resume' : 'Pause'}
          variant="outline"
        />
      )}
      
      {showRestart && onRestart && (
        <ControlButton
          icon="restart"
          onClick={onRestart}
          label="Restart"
          variant="outline"
        />
      )}
      
      <div className="flex-1" />
      
      {showInfo && onInfo && (
        <ControlButton
          icon="info"
          onClick={onInfo}
          variant="ghost"
        />
      )}
      
      {showLeaderboard && onLeaderboard && (
        <ControlButton
          icon="leaderboard"
          onClick={onLeaderboard}
          variant="ghost"
        />
      )}
      
      {showSettings && onSettings && (
        <ControlButton
          icon="settings"
          onClick={onSettings}
          variant="ghost"
        />
      )}
    </div>
  )
}

// ============================================================================
// SETTINGS PANEL
// ============================================================================

export interface SettingsPanelProps {
  settings: {
    volume?: number
    muted?: boolean
    speed?: number
    showHints?: boolean
    showTimer?: boolean
    vibration?: boolean
    particles?: boolean
  }
  onChange: (key: string, value: number | boolean) => void
  className?: string
}

export function SettingsPanel({
  settings,
  onChange,
  className = ''
}: SettingsPanelProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-bold">Game Settings</h3>
      
      {settings.volume !== undefined && settings.muted !== undefined && (
        <VolumeControl
          volume={settings.volume}
          onChange={(v) => onChange('volume', v)}
          muted={settings.muted}
          onToggleMute={() => onChange('muted', !settings.muted)}
        />
      )}
      
      {settings.speed !== undefined && (
        <SpeedControl
          speed={settings.speed}
          onChange={(v) => onChange('speed', v)}
        />
      )}
      
      {settings.showHints !== undefined && (
        <ToggleControl
          label="Show Hints"
          checked={settings.showHints}
          onChange={(v) => onChange('showHints', v)}
          description="Display helpful tips during gameplay"
        />
      )}
      
      {settings.showTimer !== undefined && (
        <ToggleControl
          label="Show Timer"
          checked={settings.showTimer}
          onChange={(v) => onChange('showTimer', v)}
          description="Display elapsed time"
        />
      )}
      
      {settings.vibration !== undefined && (
        <ToggleControl
          label="Vibration"
          checked={settings.vibration}
          onChange={(v) => onChange('vibration', v)}
          description="Haptic feedback on mobile devices"
        />
      )}
      
      {settings.particles !== undefined && (
        <ToggleControl
          label="Particle Effects"
          checked={settings.particles}
          onChange={(v) => onChange('particles', v)}
          description="Enable visual particle effects"
        />
      )}
    </div>
  )
}
