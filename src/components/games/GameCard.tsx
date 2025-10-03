'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, Trophy, Star, Lock, Play } from 'lucide-react'
import type { GameMetadata } from '@/lib/games/gameRegistry'
import { getGameDifficultyLabel, getGameCategoryLabel } from '@/lib/games/gameRegistry'

// ============================================================================
// TYPES
// ============================================================================

export interface GameCardProps {
  game: GameMetadata
  showPlayButton?: boolean
  showStats?: boolean
  userBestScore?: number
  className?: string
}

// ============================================================================
// GAME CARD COMPONENT
// ============================================================================

export function GameCard({
  game,
  showPlayButton = true,
  showStats = false,
  userBestScore,
  className = ''
}: GameCardProps) {
  const difficultyColor = {
    beginner: 'bg-green-500/10 text-green-500',
    intermediate: 'bg-yellow-500/10 text-yellow-500',
    advanced: 'bg-red-500/10 text-red-500'
  }[game.difficulty]
  
  const categoryColor = {
    lean: 'bg-blue-500/10 text-blue-500',
    'six-sigma': 'bg-purple-500/10 text-purple-500',
    'continuous-improvement': 'bg-cyan-500/10 text-cyan-500'
  }[game.category]
  
  return (
    <Card className={`group relative overflow-hidden border-white/10 bg-slate-800/50 backdrop-blur-sm transition-all hover:border-white/30 hover:shadow-xl hover:shadow-blue-500/10 ${className}`}>
      {/* Thumbnail */}
      <Link href={`/games/${game.slug}`}>
        <div className="relative aspect-video overflow-hidden bg-slate-900">
          {/* Placeholder gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          
          {/* Coming Soon Overlay */}
          {game.isComingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center">
                <Lock className="mx-auto mb-2 h-8 w-8 text-white" />
                <p className="text-sm font-medium text-white">Coming Soon</p>
                {game.releaseDate && (
                  <p className="text-xs text-gray-300">{new Date(game.releaseDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Featured Badge */}
          {game.isFeatured && !game.isComingSoon && (
            <div className="absolute left-2 top-2">
              <Badge className="bg-yellow-500/20 text-yellow-500">
                <Star className="mr-1 h-3 w-3 fill-current" />
                Featured
              </Badge>
            </div>
          )}
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        {/* Category & Difficulty */}
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary" className={`text-xs ${categoryColor}`}>
            {getGameCategoryLabel(game.category)}
          </Badge>
          <Badge variant="secondary" className={`text-xs ${difficultyColor}`}>
            {getGameDifficultyLabel(game.difficulty)}
          </Badge>
        </div>
        
        {/* Title & Tagline */}
        <Link href={`/games/${game.slug}`}>
          <h3 className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-blue-400">
            {game.name}
          </h3>
        </Link>
        <p className="mb-3 line-clamp-2 text-sm text-gray-400">
          {game.tagline}
        </p>
        
        {/* Meta Info */}
        <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {game.estimatedTime} min
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {game.playerCount} player
          </div>
        </div>
        
        {/* Stats */}
        {showStats && userBestScore !== undefined && (
          <div className="mb-3 rounded border border-blue-500/20 bg-blue-500/5 p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Your Best</span>
              <div className="flex items-center gap-1 text-sm font-bold text-blue-400">
                <Trophy className="h-3 w-3" />
                {userBestScore.toLocaleString()}
              </div>
            </div>
          </div>
        )}
        
        {/* Play Button */}
        {showPlayButton && !game.isComingSoon && (
          <Link href={`/games/${game.slug}`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Play className="mr-2 h-4 w-4" />
              Play Now
            </Button>
          </Link>
        )}
        
        {showPlayButton && game.isComingSoon && (
          <Button disabled className="w-full">
            <Lock className="mr-2 h-4 w-4" />
            Coming Soon
          </Button>
        )}
      </div>
      
      {/* Hover Gradient Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent" />
      </div>
    </Card>
  )
}

// ============================================================================
// COMPACT GAME CARD (for lists/smaller spaces)
// ============================================================================

export function CompactGameCard({
  game,
  userBestScore,
  className = ''
}: GameCardProps) {
  const difficultyIcon = {
    beginner: '🟢',
    intermediate: '🟡',
    advanced: '🔴'
  }[game.difficulty]
  
  return (
    <Link href={`/games/${game.slug}`}>
      <Card className={`flex items-center gap-4 border-white/10 bg-slate-800/50 p-3 transition-all hover:border-white/30 hover:bg-slate-800/70 ${className}`}>
        {/* Thumbnail */}
        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-gradient-to-br from-blue-600/20 to-purple-600/20">
          {game.isComingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Lock className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-bold text-white">
              {game.name}
            </h4>
            <span>{difficultyIcon}</span>
          </div>
          <p className="truncate text-xs text-gray-400">{game.tagline}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {game.estimatedTime}m
          </div>
        </div>
        
        {/* Score */}
        {userBestScore !== undefined && (
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-gray-400">Best</div>
            <div className="text-sm font-bold text-blue-400">
              {userBestScore.toLocaleString()}
            </div>
          </div>
        )}
      </Card>
    </Link>
  )
}

// ============================================================================
// FEATURED GAME CARD (hero-style, larger)
// ============================================================================

export function FeaturedGameCard({ game }: { game: GameMetadata }) {
  return (
    <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900 md:w-1/2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <div className="absolute right-2 top-2">
            <Badge className="bg-yellow-500/20 text-yellow-500">
              <Star className="mr-1 h-3 w-3 fill-current" />
              Featured
            </Badge>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              {getGameCategoryLabel(game.category)}
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
              {getGameDifficultyLabel(game.difficulty)}
            </Badge>
          </div>
          
          <h2 className="mb-2 text-3xl font-bold text-white">
            {game.name}
          </h2>
          
          <p className="mb-4 text-gray-300">
            {game.tagline}
          </p>
          
          <p className="mb-6 line-clamp-3 text-sm text-gray-400">
            {game.description}
          </p>
          
          <div className="flex items-center gap-4">
            <Link href={`/games/${game.slug}`}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Play className="mr-2 h-5 w-5" />
                Play Now
              </Button>
            </Link>
            
            <Link href={`/games/${game.slug}`}>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
