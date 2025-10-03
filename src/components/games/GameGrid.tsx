'use client'

import { GameCard, CompactGameCard } from './GameCard'
import type { GameMetadata } from '@/lib/games/gameRegistry'

// ============================================================================
// TYPES
// ============================================================================

export interface GameGridProps {
  games: GameMetadata[]
  layout?: 'grid' | 'list'
  columns?: 2 | 3 | 4
  showPlayButton?: boolean
  showStats?: boolean
  userScores?: Record<string, number>
  emptyMessage?: string
  className?: string
}

// ============================================================================
// GAME GRID COMPONENT
// ============================================================================

export function GameGrid({
  games,
  layout = 'grid',
  columns = 3,
  showPlayButton = true,
  showStats = false,
  userScores = {},
  emptyMessage = 'No games found',
  className = ''
}: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className={`flex min-h-[400px] items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="mb-4 text-6xl">🎮</div>
          <h3 className="mb-2 text-xl font-bold text-white">
            {emptyMessage}
          </h3>
          <p className="text-gray-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {games.map(game => (
          <CompactGameCard
            key={game.id}
            game={game}
            userBestScore={userScores[game.id]}
          />
        ))}
      </div>
    )
  }

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[columns]

  return (
    <div className={`grid gap-6 ${gridCols} ${className}`}>
      {games.map(game => (
        <GameCard
          key={game.id}
          game={game}
          showPlayButton={showPlayButton}
          showStats={showStats}
          userBestScore={userScores[game.id]}
        />
      ))}
    </div>
  )
}

// ============================================================================
// GAME GRID WITH SECTIONS
// ============================================================================

export interface GameGridSectionProps {
  title: string
  description?: string
  games: GameMetadata[]
  layout?: 'grid' | 'list'
  columns?: 2 | 3 | 4
  showPlayButton?: boolean
  showStats?: boolean
  userScores?: Record<string, number>
  viewAllLink?: string
  className?: string
}

export function GameGridSection({
  title,
  description,
  games,
  layout = 'grid',
  columns = 3,
  showPlayButton = true,
  showStats = false,
  userScores = {},
  viewAllLink,
  className = ''
}: GameGridSectionProps) {
  return (
    <section className={className}>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-gray-400">{description}</p>
          )}
        </div>
        {viewAllLink && games.length > 0 && (
          <a
            href={viewAllLink}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            View All →
          </a>
        )}
      </div>

      <GameGrid
        games={games}
        layout={layout}
        columns={columns}
        showPlayButton={showPlayButton}
        showStats={showStats}
        userScores={userScores}
      />
    </section>
  )
}
