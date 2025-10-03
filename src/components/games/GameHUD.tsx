'use client'

import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, Target, TrendingUp, Award, Zap } from 'lucide-react'
import type { HUDData } from '@/types/games'

// ============================================================================
// TYPES
// ============================================================================

export interface GameHUDProps {
  data: HUDData
  layout?: 'top' | 'bottom' | 'overlay'
  showProgress?: boolean
  showTimer?: boolean
  showScore?: boolean
  showStats?: boolean
  className?: string
}

// ============================================================================
// GAME HUD COMPONENT
// ============================================================================

export function GameHUD({
  data,
  layout = 'top',
  showProgress = true,
  showTimer = true,
  showScore = true,
  showStats = true,
  className = ''
}: GameHUDProps) {
  const layoutClasses = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    overlay: 'top-4 left-4 right-4'
  }
  
  const isOverlay = layout === 'overlay'
  
  return (
    <div
      className={`
        ${isOverlay ? 'absolute' : 'relative'} 
        z-10 
        ${layoutClasses[layout]} 
        ${className}
      `}
    >
      <div
        className={`
          ${isOverlay ? 'rounded-lg border border-white/10 bg-slate-900/80 backdrop-blur-md' : 'bg-slate-800'}
          p-4
        `}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Section: Score & Timer */}
          <div className="flex items-center gap-4">
            {showScore && (
              <HUDStat
                icon={<Star className="h-5 w-5" />}
                label="Score"
                value={data.score?.toLocaleString() || '0'}
                variant="primary"
              />
            )}
            
            {showTimer && data.timeElapsed !== undefined && (
              <HUDStat
                icon={<Clock className="h-5 w-5" />}
                label="Time"
                value={formatTime(data.timeElapsed)}
                variant="secondary"
              />
            )}
            
            {data.level !== undefined && (
              <HUDStat
                icon={<TrendingUp className="h-5 w-5" />}
                label="Level"
                value={data.level.toString()}
                variant="accent"
              />
            )}
          </div>
          
          {/* Right Section: Stats */}
          {showStats && (
            <div className="flex items-center gap-4">
              {data.streak !== undefined && data.streak > 0 && (
                <HUDStat
                  icon={<Zap className="h-5 w-5 text-yellow-400" />}
                  label="Streak"
                  value={data.streak.toString()}
                  variant="warning"
                />
              )}
              
              {data.accuracy !== undefined && (
                <HUDStat
                  icon={<Target className="h-5 w-5 text-green-400" />}
                  label="Accuracy"
                  value={`${Math.round(data.accuracy)}%`}
                  variant="success"
                />
              )}
              
              {data.achievements !== undefined && (
                <HUDStat
                  icon={<Award className="h-5 w-5 text-purple-400" />}
                  label="Achievements"
                  value={data.achievements.toString()}
                  variant="info"
                />
              )}
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {showProgress && data.progress !== undefined && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium text-white">{Math.round(data.progress)}%</span>
            </div>
            <Progress value={data.progress} className="h-2" />
          </div>
        )}
        
        {/* Custom Messages */}
        {data.message && (
          <div className="mt-3 text-center">
            <Badge variant="secondary" className="text-sm">
              {data.message}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// HUD STAT COMPONENT
// ============================================================================

interface HUDStatProps {
  icon: React.ReactNode
  label: string
  value: string
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info'
}

function HUDStat({ icon, label, value, variant = 'primary' }: HUDStatProps) {
  const variantClasses = {
    primary: 'text-blue-400',
    secondary: 'text-gray-400',
    accent: 'text-purple-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    info: 'text-cyan-400'
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className={`${variantClasses[variant]}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-lg font-bold text-white">{value}</div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPACT HUD (for smaller screens/space)
// ============================================================================

export function CompactHUD({ data, className = '' }: { data: HUDData; className?: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-lg bg-slate-900/80 px-4 py-2 backdrop-blur-md ${className}`}>
      {data.score !== undefined && (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-blue-400" />
          <span className="font-bold text-white">{data.score.toLocaleString()}</span>
        </div>
      )}
      
      {data.timeElapsed !== undefined && (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-white">{formatTime(data.timeElapsed)}</span>
        </div>
      )}
      
      {data.progress !== undefined && (
        <div className="flex items-center gap-1">
          <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${data.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{Math.round(data.progress)}%</span>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// FLOATING STATS (for individual stat displays)
// ============================================================================

export function FloatingStat({
  icon,
  value,
  label,
  position = 'top-left',
  className = ''
}: {
  icon: React.ReactNode
  value: string
  label: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }
  
  return (
    <div
      className={`
        absolute ${positionClasses[position]} z-20
        flex items-center gap-2
        rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2
        backdrop-blur-md
        ${className}
      `}
    >
      <div className="text-blue-400">{icon}</div>
      <div>
        <div className="text-sm font-bold text-white">{value}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  )
}

// ============================================================================
// MINIMAL HUD (just essential info)
// ============================================================================

export function MinimalHUD({
  score,
  time,
  className = ''
}: {
  score?: number
  time?: number
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between text-white ${className}`}>
      {score !== undefined && (
        <span className="text-2xl font-bold">{score.toLocaleString()}</span>
      )}
      {time !== undefined && (
        <span className="text-lg font-mono">{formatTime(time)}</span>
      )}
    </div>
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
