'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Grid, List, Filter, X } from 'lucide-react'
import type { GameCategory, GameDifficulty } from '@/types/games'
import { getGameCategoryLabel, getGameDifficultyLabel } from '@/lib/games/gameRegistry'

// ============================================================================
// TYPES
// ============================================================================

export interface GameFilterOptions {
  search: string
  category: GameCategory | 'all'
  difficulty: GameDifficulty | 'all'
  status: 'all' | 'available' | 'coming-soon'
  layout: 'grid' | 'list'
}

export interface GameFiltersProps {
  filters: GameFilterOptions
  onChange: (filters: GameFilterOptions) => void
  resultCount?: number
  className?: string
}

// ============================================================================
// GAME FILTERS COMPONENT
// ============================================================================

export function GameFilters({
  filters,
  onChange,
  resultCount,
  className = ''
}: GameFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const updateFilter = <K extends keyof GameFilterOptions>(
    key: K,
    value: GameFilterOptions[K]
  ) => {
    onChange({ ...filters, [key]: value })
  }

  const hasActiveFilters = 
    filters.category !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.status !== 'all' ||
    filters.search !== ''

  const clearFilters = () => {
    onChange({
      search: '',
      category: 'all',
      difficulty: 'all',
      status: 'all',
      layout: filters.layout
    })
    setShowFilters(false)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search & Controls Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search games..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Layout Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={filters.layout === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => updateFilter('layout', 'grid')}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={filters.layout === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => updateFilter('layout', 'list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs">
              {[
                filters.category !== 'all',
                filters.difficulty !== 'all',
                filters.status !== 'all',
                filters.search !== ''
              ].filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="space-y-4 rounded-lg border border-white/10 bg-slate-800/50 p-4">
          {/* Category Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <FilterBadge
                active={filters.category === 'all'}
                onClick={() => updateFilter('category', 'all')}
              >
                All Categories
              </FilterBadge>
              <FilterBadge
                active={filters.category === 'lean'}
                onClick={() => updateFilter('category', 'lean')}
              >
                {getGameCategoryLabel('lean')}
              </FilterBadge>
              <FilterBadge
                active={filters.category === 'six-sigma'}
                onClick={() => updateFilter('category', 'six-sigma')}
              >
                {getGameCategoryLabel('six-sigma')}
              </FilterBadge>
              <FilterBadge
                active={filters.category === 'continuous-improvement'}
                onClick={() => updateFilter('category', 'continuous-improvement')}
              >
                {getGameCategoryLabel('continuous-improvement')}
              </FilterBadge>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              <FilterBadge
                active={filters.difficulty === 'all'}
                onClick={() => updateFilter('difficulty', 'all')}
              >
                All Levels
              </FilterBadge>
              <FilterBadge
                active={filters.difficulty === 'beginner'}
                onClick={() => updateFilter('difficulty', 'beginner')}
                className="border-green-500/30 text-green-400"
              >
                🟢 {getGameDifficultyLabel('beginner')}
              </FilterBadge>
              <FilterBadge
                active={filters.difficulty === 'intermediate'}
                onClick={() => updateFilter('difficulty', 'intermediate')}
                className="border-yellow-500/30 text-yellow-400"
              >
                🟡 {getGameDifficultyLabel('intermediate')}
              </FilterBadge>
              <FilterBadge
                active={filters.difficulty === 'advanced'}
                onClick={() => updateFilter('difficulty', 'advanced')}
                className="border-red-500/30 text-red-400"
              >
                🔴 {getGameDifficultyLabel('advanced')}
              </FilterBadge>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              <FilterBadge
                active={filters.status === 'all'}
                onClick={() => updateFilter('status', 'all')}
              >
                All Games
              </FilterBadge>
              <FilterBadge
                active={filters.status === 'available'}
                onClick={() => updateFilter('status', 'available')}
              >
                Available Now
              </FilterBadge>
              <FilterBadge
                active={filters.status === 'coming-soon'}
                onClick={() => updateFilter('status', 'coming-soon')}
              >
                Coming Soon
              </FilterBadge>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-end border-t border-white/10 pt-4">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      {resultCount !== undefined && (
        <div className="text-sm text-gray-400">
          {resultCount} {resultCount === 1 ? 'game' : 'games'} found
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-2 text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// FILTER BADGE COMPONENT
// ============================================================================

function FilterBadge({
  active,
  onClick,
  children,
  className = ''
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <Badge
      variant={active ? 'default' : 'outline'}
      className={`cursor-pointer transition-all hover:bg-blue-600 ${
        active ? 'bg-blue-600' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </Badge>
  )
}

// ============================================================================
// QUICK FILTERS (for homepage)
// ============================================================================

export function QuickFilters({
  onFilterClick
}: {
  onFilterClick: (category: GameCategory) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterClick('lean')}
        className="border-blue-500/30 hover:bg-blue-500/10"
      >
        {getGameCategoryLabel('lean')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterClick('six-sigma')}
        className="border-purple-500/30 hover:bg-purple-500/10"
      >
        {getGameCategoryLabel('six-sigma')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFilterClick('continuous-improvement')}
        className="border-cyan-500/30 hover:bg-cyan-500/10"
      >
        {getGameCategoryLabel('continuous-improvement')}
      </Button>
    </div>
  )
}
