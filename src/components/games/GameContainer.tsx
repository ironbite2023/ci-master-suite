'use client'

import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { useRouter } from 'next/navigation'

// ============================================================================
// TYPES
// ============================================================================

export interface GameContainerProps {
  children: ReactNode
  title: string
  description?: string
  isPlaying: boolean
  isPaused: boolean
  isMuted: boolean
  showBackButton?: boolean
  showControls?: boolean
  onPause?: () => void
  onResume?: () => void
  onRestart?: () => void
  onToggleMute?: () => void
  onBack?: () => void
  headerActions?: ReactNode
  className?: string
}

// ============================================================================
// GAME CONTAINER COMPONENT
// ============================================================================

export function GameContainer({
  children,
  title,
  description,
  isPlaying,
  isPaused,
  isMuted,
  showBackButton = true,
  showControls = true,
  onPause,
  onResume,
  onRestart,
  onToggleMute,
  onBack,
  headerActions,
  className = ''
}: GameContainerProps) {
  const router = useRouter()
  
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push('/games')
    }
  }
  
  const handlePauseResume = () => {
    if (isPaused && onResume) {
      onResume()
    } else if (!isPaused && onPause) {
      onPause()
    }
  }
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="text-white hover:bg-white/10"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-gray-400 md:text-base">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {/* Header Actions & Controls */}
          <div className="flex items-center gap-2">
            {headerActions}
            
            {showControls && isPlaying && (
              <>
                {/* Pause/Resume */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePauseResume}
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  aria-label={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                </Button>
                
                {/* Restart */}
                {onRestart && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onRestart}
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                    aria-label="Restart"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Mute/Unmute */}
                {onToggleMute && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onToggleMute}
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Game Content */}
        <Card className="overflow-hidden border-white/10 bg-slate-800/50 backdrop-blur-sm">
          <div className="relative">
            {children}
            
            {/* Pause Overlay */}
            {isPaused && isPlaying && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <h2 className="mb-4 text-4xl font-bold text-white">
                    PAUSED
                  </h2>
                  <Button
                    size="lg"
                    onClick={onResume}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Resume
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        {/* Footer Info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Use keyboard shortcuts: Space to pause/resume, R to restart, M to mute</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// GAME CONTENT WRAPPER (for consistent padding)
// ============================================================================

export function GameContent({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`p-6 md:p-8 ${className}`}>
      {children}
    </div>
  )
}

// ============================================================================
// GAME CANVAS WRAPPER (for games using canvas)
// ============================================================================

export function GameCanvas({
  children,
  aspectRatio = '16/9',
  className = ''
}: {
  children: ReactNode
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto'
  className?: string
}) {
  const aspectRatioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    'auto': ''
  }[aspectRatio]
  
  return (
    <div className={`relative bg-slate-900 ${aspectRatioClass} ${className}`}>
      {children}
    </div>
  )
}
