/**
 * Rules Button Component
 * Provides in-game access to rules with two variants: default and floating
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HelpCircle, BookOpen } from 'lucide-react'
import { GameRulesModal, GameRule } from './GameRulesModal'

// ============================================================================
// TYPES
// ============================================================================

interface RulesButtonProps {
  gameRule: GameRule
  variant?: 'default' | 'floating'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  size?: 'sm' | 'md' | 'lg'
  onStartTutorial?: () => void
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getPositionClasses(position: string): string {
  switch (position) {
    case 'top-right':
      return 'top-4 right-4'
    case 'top-left':
      return 'top-4 left-4'
    case 'bottom-right':
      return 'bottom-4 right-4'
    case 'bottom-left':
      return 'bottom-4 left-4'
    default:
      return 'top-4 right-4'
  }
}

function getSizeClasses(size: string): string {
  switch (size) {
    case 'sm':
      return 'h-10 w-10 p-2'
    case 'md':
      return 'h-12 w-12 p-3'
    case 'lg':
      return 'h-14 w-14 p-3.5'
    default:
      return 'h-12 w-12 p-3'
  }
}

function getIconSize(size: string): string {
  switch (size) {
    case 'sm':
      return 'h-4 w-4'
    case 'md':
      return 'h-5 w-5'
    case 'lg':
      return 'h-6 w-6'
    default:
      return 'h-5 w-5'
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function RulesButton({
  gameRule,
  variant = 'default',
  position = 'top-right',
  size = 'md',
  onStartTutorial
}: RulesButtonProps) {
  const [showRules, setShowRules] = useState(false)

  const handleStartGame = () => {
    setShowRules(false)
  }

  // Floating variant: Fixed position button with icon only
  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={() => setShowRules(true)}
          className={`
            fixed z-50
            ${getPositionClasses(position)}
            ${getSizeClasses(size)}
            bg-blue-600 hover:bg-blue-700 active:bg-blue-800
            text-white rounded-full
            shadow-lg hover:shadow-xl
            transition-all duration-200
            hover:scale-110 active:scale-95
            flex items-center justify-center
            group
          `}
          title="View Rules & Instructions"
          aria-label="View Rules"
        >
          <HelpCircle className={`${getIconSize(size)} transition-transform group-hover:rotate-12`} />
        </button>

        <GameRulesModal
          open={showRules}
          onClose={() => setShowRules(false)}
          gameRule={gameRule}
          onStartGame={handleStartGame}
          onStartTutorial={onStartTutorial}
        />
      </>
    )
  }

  // Default variant: Standard button with text and icon
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowRules(true)}
        className="group"
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
      >
        <BookOpen className={`${getIconSize(size)} mr-2 transition-transform group-hover:scale-110`} />
        Rules & Tips
      </Button>

      <GameRulesModal
        open={showRules}
        onClose={() => setShowRules(false)}
        gameRule={gameRule}
        onStartGame={handleStartGame}
        onStartTutorial={onStartTutorial}
      />
    </>
  )
}

// ============================================================================
// COMPACT VARIANT
// ============================================================================

interface CompactRulesButtonProps {
  gameRule: GameRule
  onStartTutorial?: () => void
}

export function CompactRulesButton({ gameRule, onStartTutorial }: CompactRulesButtonProps) {
  const [showRules, setShowRules] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowRules(true)}
        className="
          flex items-center gap-2 px-3 py-2
          text-sm text-blue-600 hover:text-blue-700
          bg-blue-50 hover:bg-blue-100
          rounded-md transition-colors
          border border-blue-200 hover:border-blue-300
        "
      >
        <HelpCircle className="h-4 w-4" />
        <span className="font-medium">Help</span>
      </button>

      <GameRulesModal
        open={showRules}
        onClose={() => setShowRules(false)}
        gameRule={gameRule}
        onStartGame={() => setShowRules(false)}
        onStartTutorial={onStartTutorial}
      />
    </>
  )
}

// ============================================================================
// ICON-ONLY VARIANT
// ============================================================================

interface IconRulesButtonProps {
  gameRule: GameRule
  className?: string
  onStartTutorial?: () => void
}

export function IconRulesButton({ gameRule, className = '', onStartTutorial }: IconRulesButtonProps) {
  const [showRules, setShowRules] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowRules(true)}
        className={`
          p-2 rounded-md
          text-gray-600 hover:text-blue-600
          hover:bg-blue-50
          transition-colors
          ${className}
        `}
        title="View Rules"
        aria-label="View Rules"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      <GameRulesModal
        open={showRules}
        onClose={() => setShowRules(false)}
        gameRule={gameRule}
        onStartGame={() => setShowRules(false)}
        onStartTutorial={onStartTutorial}
      />
    </>
  )
}

// ============================================================================
// EXPORT
// ============================================================================

export default RulesButton
