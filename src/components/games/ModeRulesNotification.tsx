/**
 * Mode Rules Notification Component
 * Displays a toast notification when entering a new game mode for the first time
 */

'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  X,
  BookOpen,
  Target,
  TrendingUp,
  Sparkles,
  Clock
} from 'lucide-react'
import { GameRule } from './GameRulesModal'

// ============================================================================
// TYPES
// ============================================================================

interface ModeRulesNotificationProps {
  gameId: string
  mode: string
  modeRule: GameRule
  onViewDetails: () => void
  autoHideDelay?: number
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getPositionClasses(position: string): string {
  switch (position) {
    case 'bottom-right':
      return 'bottom-4 right-4 slide-in-from-bottom'
    case 'bottom-left':
      return 'bottom-4 left-4 slide-in-from-bottom'
    case 'top-right':
      return 'top-4 right-4 slide-in-from-top'
    case 'top-left':
      return 'top-4 left-4 slide-in-from-top'
    default:
      return 'bottom-4 right-4 slide-in-from-bottom'
  }
}

function getModeIcon(mode: string) {
  const modeIcons: Record<string, React.ReactElement> = {
    freeplay: <Target className="h-5 w-5" />,
    doe: <TrendingUp className="h-5 w-5" />,
    validation: <Sparkles className="h-5 w-5" />,
    capability: <TrendingUp className="h-5 w-5" />,
    control: <Target className="h-5 w-5" />
  }
  return modeIcons[mode] || <Target className="h-5 w-5" />
}

function getModeColor(mode: string): string {
  const modeColors: Record<string, string> = {
    freeplay: 'blue',
    doe: 'purple',
    validation: 'green',
    capability: 'orange',
    control: 'red'
  }
  return modeColors[mode] || 'blue'
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ModeRulesNotification({
  gameId,
  mode,
  modeRule,
  onViewDetails,
  autoHideDelay = 10000,
  position = 'bottom-right'
}: ModeRulesNotificationProps) {
  const [show, setShow] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const color = getModeColor(mode)

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      localStorage.setItem(`rules-seen-${gameId}-${mode}`, 'true')
      setShow(false)
      setIsExiting(false)
    }, 300)
  }, [gameId, mode])

  useEffect(() => {
    // Check if user has seen this mode's rules
    const seen = localStorage.getItem(`rules-seen-${gameId}-${mode}`)
    if (!seen) {
      setShow(true)

      // Auto-hide after delay if specified
      if (autoHideDelay > 0) {
        const timer = setTimeout(() => {
          handleDismiss()
        }, autoHideDelay)

        return () => clearTimeout(timer)
      }
    }
  }, [gameId, mode, autoHideDelay, handleDismiss])

  const handleViewDetails = () => {
    onViewDetails()
    handleDismiss()
  }

  if (!show) return null

  return (
    <div
      className={`
        fixed z-50 max-w-md
        ${getPositionClasses(position)}
        ${isExiting ? 'animate-out fade-out slide-out-to-bottom' : 'animate-in fade-in'}
      `}
    >
      <Card
        className={`
          p-4 shadow-2xl border-2
          bg-${color}-50 border-${color}-200
        `}
        style={{
          backgroundColor: `var(--${color}-50, rgb(239 246 255))`,
          borderColor: `var(--${color}-200, rgb(191 219 254))`
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-${color}-100`}
              style={{ backgroundColor: `var(--${color}-100, rgb(219 234 254))` }}
            >
              {getModeIcon(mode)}
            </div>
            <div>
              <h3 className={`font-semibold text-${color}-900`}>
                {modeRule.overview.title}
              </h3>
              <Badge variant="secondary" className="text-xs mt-1">
                New Mode Unlocked!
              </Badge>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className={`text-${color}-600 hover:text-${color}-800 transition-colors`}
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Objective */}
        <p className={`text-sm text-${color}-800 mb-3 leading-relaxed`}>
          {modeRule.overview.objective}
        </p>

        {/* Key Info */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className={`flex items-center gap-2 p-2 rounded bg-${color}-100/50`}>
            <Target className="h-4 w-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Goals</p>
              <p className={`text-sm font-semibold text-${color}-900`}>
                {modeRule.learningGoals.length}
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-2 p-2 rounded bg-${color}-100/50`}>
            <Clock className="h-4 w-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className={`text-sm font-semibold text-${color}-900`}>
                {modeRule.estimatedTime}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
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
            onClick={handleViewDetails}
            className={`flex-1 bg-${color}-600 hover:bg-${color}-700 text-white`}
            style={{
              backgroundColor: `var(--${color}-600, rgb(37 99 235))`,
            }}
          >
            <BookOpen className="mr-1 h-4 w-4" />
            View Guide
          </Button>
        </div>

        {/* Auto-hide progress bar */}
        {autoHideDelay > 0 && (
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-${color}-600 animate-shrink-width`}
              style={{
                animation: `shrinkWidth ${autoHideDelay}ms linear`,
                backgroundColor: `var(--${color}-600, rgb(37 99 235))`
              }}
            />
          </div>
        )}
      </Card>

      {/* Add custom CSS for shrink animation */}
      <style jsx>{`
        @keyframes shrinkWidth {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-shrink-width {
          animation: shrinkWidth ${autoHideDelay}ms linear;
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// COMPACT VARIANT
// ============================================================================

interface CompactModeNotificationProps {
  gameId: string
  mode: string
  modeTitle: string
  modeObjective: string
  onViewDetails: () => void
}

export function CompactModeNotification({
  gameId,
  mode,
  modeTitle,
  modeObjective,
  onViewDetails
}: CompactModeNotificationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
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
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom">
      <Card className="p-3 bg-blue-50 border-blue-200 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-blue-600 text-white">New Mode!</Badge>
          <button onClick={handleDismiss} className="text-blue-600 hover:text-blue-800">
            <X className="h-3 w-3" />
          </button>
        </div>
        <h4 className="font-semibold text-sm mb-1">{modeTitle}</h4>
        <p className="text-xs text-gray-600 mb-2">{modeObjective}</p>
        <Button
          size="sm"
          onClick={() => {
            onViewDetails()
            handleDismiss()
          }}
          className="w-full"
        >
          Learn More
        </Button>
      </Card>
    </div>
  )
}

// ============================================================================
// EXPORT
// ============================================================================

export default ModeRulesNotification
