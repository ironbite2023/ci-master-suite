'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Award, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ============================================================================
// TYPES
// ============================================================================

export interface Achievement {
  id: string
  name: string
  description: string
  icon?: string
  points: number
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

export interface AchievementToastProps {
  achievement: Achievement | null
  onClose?: () => void
  duration?: number
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center'
  showConfetti?: boolean
}

// ============================================================================
// ACHIEVEMENT TOAST COMPONENT
// ============================================================================

export function AchievementToast({
  achievement,
  onClose,
  duration = 5000,
  position = 'top-right'
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      if (onClose) onClose()
    }, 300) // Wait for exit animation
  }, [onClose])
  
  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      
      // Auto-hide after duration
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [achievement, duration, handleClose])
  
  if (!achievement) return null
  
  const rarityConfig = getRarityConfig(achievement.rarity || 'common')
  const positionClasses = getPositionClasses(position)
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position.startsWith('top') ? -100 : 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`fixed z-50 ${positionClasses}`}
        >
          <Card className={`relative overflow-hidden border-2 ${rarityConfig.borderColor} ${rarityConfig.bgGradient} p-4 shadow-2xl backdrop-blur-md`}>
            {/* Animated Background Glow */}
            <div className={`absolute inset-0 ${rarityConfig.glowColor} opacity-20 blur-xl`} />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute right-2 top-2 h-6 w-6 text-white/60 hover:text-white"
            >
              <X className="h-3 w-3" />
            </Button>
            
            {/* Content */}
            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full ${rarityConfig.iconBg}`}>
                {achievement.icon ? (
                  <span className="text-3xl">{achievement.icon}</span>
                ) : (
                  <Trophy className={`h-8 w-8 ${rarityConfig.iconColor}`} />
                )}
              </div>
              
              {/* Text Content */}
              <div className="flex-1 space-y-1 pr-6">
                <div className="flex items-center gap-2">
                  <Sparkles className={`h-4 w-4 ${rarityConfig.accentColor}`} />
                  <span className="text-xs font-medium text-gray-300">Achievement Unlocked!</span>
                </div>
                
                <h3 className="text-lg font-bold text-white">
                  {achievement.name}
                </h3>
                
                <p className="text-sm text-gray-300">
                  {achievement.description}
                </p>
                
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant="secondary" className={`${rarityConfig.badgeBg} ${rarityConfig.badgeText}`}>
                    <Star className="mr-1 h-3 w-3" />
                    +{achievement.points} pts
                  </Badge>
                  
                  {achievement.rarity && achievement.rarity !== 'common' && (
                    <Badge variant="outline" className={`border-${rarityConfig.borderColor} ${rarityConfig.badgeText}`}>
                      {achievement.rarity}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className={`absolute bottom-0 left-0 h-1 ${rarityConfig.progressBg} origin-left`}
            />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// ACHIEVEMENT NOTIFICATION QUEUE
// ============================================================================

export interface AchievementNotificationQueueProps {
  achievements: Achievement[]
  onDismiss: (id: string) => void
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center'
  maxVisible?: number
  duration?: number
}

export function AchievementNotificationQueue({
  achievements,
  onDismiss,
  position = 'top-right',
  maxVisible = 3,
  duration = 5000
}: AchievementNotificationQueueProps) {
  const visibleAchievements = achievements.slice(0, maxVisible)
  const positionClasses = getPositionClasses(position)
  
  return (
    <div className={`fixed z-50 flex flex-col gap-2 ${positionClasses}`}>
      <AnimatePresence mode="popLayout">
        {visibleAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            layout
          >
            <CompactAchievementToast
              achievement={achievement}
              onClose={() => onDismiss(achievement.id)}
              duration={duration}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Overflow Indicator */}
      {achievements.length > maxVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-center backdrop-blur-md"
        >
          <span className="text-xs text-gray-400">
            +{achievements.length - maxVisible} more
          </span>
        </motion.div>
      )}
    </div>
  )
}

// ============================================================================
// COMPACT ACHIEVEMENT TOAST
// ============================================================================

function CompactAchievementToast({
  achievement,
  onClose,
  duration
}: {
  achievement: Achievement
  onClose: () => void
  duration: number
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  const rarityConfig = getRarityConfig(achievement.rarity || 'common')
  
  return (
    <Card className={`relative overflow-hidden border ${rarityConfig.borderColor} ${rarityConfig.bgGradient} p-3 shadow-lg backdrop-blur-md`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${rarityConfig.iconBg}`}>
          {achievement.icon ? (
            <span className="text-xl">{achievement.icon}</span>
          ) : (
            <Award className={`h-5 w-5 ${rarityConfig.iconColor}`} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-bold text-white">
            {achievement.name}
          </p>
          <div className="flex items-center gap-1">
            <Star className={`h-3 w-3 ${rarityConfig.accentColor}`} />
            <span className="text-xs text-gray-300">+{achievement.points}</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 flex-shrink-0 text-white/60 hover:text-white"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Progress Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-0.5 ${rarityConfig.progressBg} origin-left`}
      />
    </Card>
  )
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRarityConfig(rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary') {
  const configs = {
    common: {
      borderColor: 'border-gray-400',
      bgGradient: 'bg-gradient-to-br from-gray-900/90 to-slate-900/90',
      glowColor: 'bg-gray-500',
      iconBg: 'bg-gray-700/50',
      iconColor: 'text-gray-300',
      accentColor: 'text-gray-300',
      badgeBg: 'bg-gray-700',
      badgeText: 'text-gray-200',
      progressBg: 'bg-gray-400'
    },
    uncommon: {
      borderColor: 'border-green-400',
      bgGradient: 'bg-gradient-to-br from-green-900/90 to-emerald-900/90',
      glowColor: 'bg-green-500',
      iconBg: 'bg-green-700/50',
      iconColor: 'text-green-300',
      accentColor: 'text-green-300',
      badgeBg: 'bg-green-700',
      badgeText: 'text-green-200',
      progressBg: 'bg-green-400'
    },
    rare: {
      borderColor: 'border-blue-400',
      bgGradient: 'bg-gradient-to-br from-blue-900/90 to-cyan-900/90',
      glowColor: 'bg-blue-500',
      iconBg: 'bg-blue-700/50',
      iconColor: 'text-blue-300',
      accentColor: 'text-blue-300',
      badgeBg: 'bg-blue-700',
      badgeText: 'text-blue-200',
      progressBg: 'bg-blue-400'
    },
    epic: {
      borderColor: 'border-purple-400',
      bgGradient: 'bg-gradient-to-br from-purple-900/90 to-pink-900/90',
      glowColor: 'bg-purple-500',
      iconBg: 'bg-purple-700/50',
      iconColor: 'text-purple-300',
      accentColor: 'text-purple-300',
      badgeBg: 'bg-purple-700',
      badgeText: 'text-purple-200',
      progressBg: 'bg-purple-400'
    },
    legendary: {
      borderColor: 'border-yellow-400',
      bgGradient: 'bg-gradient-to-br from-yellow-900/90 to-orange-900/90',
      glowColor: 'bg-yellow-500',
      iconBg: 'bg-yellow-700/50',
      iconColor: 'text-yellow-300',
      accentColor: 'text-yellow-300',
      badgeBg: 'bg-yellow-700',
      badgeText: 'text-yellow-200',
      progressBg: 'bg-yellow-400'
    }
  }
  
  return configs[rarity]
}

function getPositionClasses(position: string): string {
  const positions = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  }
  
  return positions[position as keyof typeof positions] || positions['top-right']
}

// ============================================================================
// ACHIEVEMENT POPUP (Modal-style)
// ============================================================================

export function AchievementPopup({
  achievement,
  isOpen,
  onClose
}: {
  achievement: Achievement | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!achievement || !isOpen) return null
  
  const rarityConfig = getRarityConfig(achievement.rarity || 'common')
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <Card className={`relative overflow-hidden border-2 ${rarityConfig.borderColor} ${rarityConfig.bgGradient} p-8 text-center shadow-2xl`}>
              {/* Sparkles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 opacity-20"
              >
                {[...Array(6)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className={`absolute ${rarityConfig.accentColor}`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      transform: `scale(${0.5 + Math.random()})`
                    }}
                  />
                ))}
              </motion.div>
              
              {/* Content */}
              <div className="relative space-y-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                  className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${rarityConfig.iconBg} ${rarityConfig.glowColor} shadow-lg`}
                >
                  {achievement.icon ? (
                    <span className="text-5xl">{achievement.icon}</span>
                  ) : (
                    <Trophy className={`h-12 w-12 ${rarityConfig.iconColor}`} />
                  )}
                </motion.div>
                
                <div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`mb-2 text-sm font-medium ${rarityConfig.accentColor}`}
                  >
                    Achievement Unlocked!
                  </motion.p>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-white"
                  >
                    {achievement.name}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-2 text-gray-300"
                  >
                    {achievement.description}
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Badge className={`${rarityConfig.badgeBg} ${rarityConfig.badgeText} text-lg`}>
                    <Star className="mr-2 h-4 w-4" />
                    +{achievement.points} Points
                  </Badge>
                  
                  {achievement.rarity && achievement.rarity !== 'common' && (
                    <Badge variant="outline" className={`border-2 ${rarityConfig.borderColor} ${rarityConfig.badgeText}`}>
                      {achievement.rarity}
                    </Badge>
                  )}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    onClick={onClose}
                    className={`${rarityConfig.badgeBg} hover:opacity-90`}
                  >
                    Awesome!
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
