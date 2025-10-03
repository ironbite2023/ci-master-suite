'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  Sigma,
  Target
} from 'lucide-react'
import type { DescriptiveStats } from '@/lib/games/catapult/normalityTests'

// ============================================================================
// TYPES
// ============================================================================

interface DescriptiveStatsCardProps {
  stats: DescriptiveStats
  showInterpretation?: boolean
}

// ============================================================================
// DESCRIPTIVE STATS CARD COMPONENT
// ============================================================================

export function DescriptiveStatsCard({
  stats,
  showInterpretation = true
}: DescriptiveStatsCardProps) {
  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Descriptive Statistics</h3>
        <Badge className="bg-blue-500/20 text-blue-400">
          n = {stats.n}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Central Tendency */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-400">
            Central Tendency
          </div>
          
          <StatItem
            label="Mean"
            value={stats.mean.toFixed(2)}
            icon={<Target className="h-4 w-4" />}
            color="text-blue-400"
          />
          
          <StatItem
            label="Median"
            value={stats.median.toFixed(2)}
            icon={<Minus className="h-4 w-4" />}
            color="text-cyan-400"
          />
          
          <StatItem
            label="Range"
            value={`${stats.min.toFixed(1)} - ${stats.max.toFixed(1)}`}
            subvalue={`Δ ${stats.range.toFixed(2)}`}
            icon={<BarChart3 className="h-4 w-4" />}
            color="text-purple-400"
          />
        </div>

        {/* Dispersion */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-400">
            Dispersion
          </div>
          
          <StatItem
            label="Std Deviation"
            value={stats.stdDev.toFixed(2)}
            icon={<Sigma className="h-4 w-4" />}
            color="text-orange-400"
          />
          
          <StatItem
            label="Variance"
            value={stats.variance.toFixed(2)}
            subvalue={`σ² = ${stats.stdDev.toFixed(2)}²`}
            icon={<Sigma className="h-4 w-4" />}
            color="text-red-400"
          />
          
          <StatItem
            label="IQR"
            value={stats.iqr.toFixed(2)}
            subvalue={`Q1: ${stats.q1.toFixed(1)}, Q3: ${stats.q3.toFixed(1)}`}
            icon={<BarChart3 className="h-4 w-4" />}
            color="text-pink-400"
          />
        </div>

        {/* Distribution Shape */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-400">
            Distribution Shape
          </div>
          
          <StatItem
            label="Skewness"
            value={stats.skewness.toFixed(3)}
            badge={getSkewnessBadge(stats.skewness)}
            icon={getSkewnessIcon(stats.skewness)}
            color={getSkewnessColor(stats.skewness)}
          />
          
          <StatItem
            label="Kurtosis"
            value={stats.kurtosis.toFixed(3)}
            badge={getKurtosisBadge(stats.kurtosis)}
            icon={getKurtosisIcon(stats.kurtosis)}
            color={getKurtosisColor(stats.kurtosis)}
          />
        </div>
      </div>

      {/* Interpretation Section */}
      {showInterpretation && (
        <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
          <div className="text-sm font-medium text-white">
            Statistical Interpretation
          </div>
          
          <div className="space-y-2 text-sm text-gray-400">
            {/* Skewness Interpretation */}
            <div className="flex items-start gap-2">
              {getSkewnessIcon(stats.skewness)}
              <div>
                <span className="font-medium text-gray-300">Skewness:</span>{' '}
                {getSkewnessInterpretation(stats.skewness)}
              </div>
            </div>

            {/* Kurtosis Interpretation */}
            <div className="flex items-start gap-2">
              {getKurtosisIcon(stats.kurtosis)}
              <div>
                <span className="font-medium text-gray-300">Kurtosis:</span>{' '}
                {getKurtosisInterpretation(stats.kurtosis)}
              </div>
            </div>

            {/* Coefficient of Variation */}
            {stats.mean !== 0 && (
              <div className="flex items-start gap-2">
                <Sigma className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                <div>
                  <span className="font-medium text-gray-300">
                    Coefficient of Variation:
                  </span>{' '}
                  {((stats.stdDev / stats.mean) * 100).toFixed(1)}%
                  {' - '}
                  {getCVInterpretation((stats.stdDev / stats.mean) * 100)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// STAT ITEM COMPONENT
// ============================================================================

interface StatItemProps {
  label: string
  value: string
  subvalue?: string
  icon: React.ReactNode
  color: string
  badge?: React.ReactNode
}

function StatItem({ label, value, subvalue, icon, color, badge }: StatItemProps) {
  return (
    <div className="rounded-lg bg-slate-700/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className={color}>{icon}</span>
          <span>{label}</span>
        </div>
        {badge}
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
      {subvalue && (
        <div className="mt-1 text-xs text-gray-500">{subvalue}</div>
      )}
    </div>
  )
}

// ============================================================================
// SKEWNESS HELPERS
// ============================================================================

function getSkewnessBadge(skewness: number): React.ReactNode {
  if (Math.abs(skewness) < 0.5) {
    return <Badge className="bg-green-500/20 text-green-400 text-[10px]">Normal</Badge>
  } else if (Math.abs(skewness) < 1) {
    return <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px]">Moderate</Badge>
  } else {
    return <Badge className="bg-red-500/20 text-red-400 text-[10px]">High</Badge>
  }
}

function getSkewnessIcon(skewness: number): React.ReactNode {
  if (Math.abs(skewness) < 0.5) {
    return <Minus className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
  } else if (skewness > 0) {
    return <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
  } else {
    return <TrendingDown className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
  }
}

function getSkewnessColor(skewness: number): string {
  if (Math.abs(skewness) < 0.5) return 'text-green-400'
  if (Math.abs(skewness) < 1) return 'text-yellow-400'
  return 'text-red-400'
}

function getSkewnessInterpretation(skewness: number): string {
  if (Math.abs(skewness) < 0.5) {
    return 'Data is symmetrically distributed (approximately normal).'
  } else if (skewness > 0 && skewness < 1) {
    return 'Data is moderately right-skewed (tail extends to the right).'
  } else if (skewness > 1) {
    return 'Data is highly right-skewed with a long tail to the right.'
  } else if (skewness < 0 && skewness > -1) {
    return 'Data is moderately left-skewed (tail extends to the left).'
  } else {
    return 'Data is highly left-skewed with a long tail to the left.'
  }
}

// ============================================================================
// KURTOSIS HELPERS
// ============================================================================

function getKurtosisBadge(kurtosis: number): React.ReactNode {
  if (Math.abs(kurtosis) < 0.5) {
    return <Badge className="bg-green-500/20 text-green-400 text-[10px]">Normal</Badge>
  } else if (Math.abs(kurtosis) < 1) {
    return <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px]">Moderate</Badge>
  } else {
    return <Badge className="bg-red-500/20 text-red-400 text-[10px]">High</Badge>
  }
}

function getKurtosisIcon(kurtosis: number): React.ReactNode {
  if (Math.abs(kurtosis) < 0.5) {
    return <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
  } else if (kurtosis > 0) {
    return <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
  } else {
    return <TrendingDown className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
  }
}

function getKurtosisColor(kurtosis: number): string {
  if (Math.abs(kurtosis) < 0.5) return 'text-green-400'
  if (Math.abs(kurtosis) < 1) return 'text-yellow-400'
  return 'text-red-400'
}

function getKurtosisInterpretation(kurtosis: number): string {
  if (Math.abs(kurtosis) < 0.5) {
    return 'Distribution has normal tail behavior (mesokurtic).'
  } else if (kurtosis > 0 && kurtosis < 1) {
    return 'Distribution has moderately heavy tails and sharp peak (leptokurtic).'
  } else if (kurtosis > 1) {
    return 'Distribution has very heavy tails with many outliers (highly leptokurtic).'
  } else if (kurtosis < 0 && kurtosis > -1) {
    return 'Distribution has moderately light tails and flat peak (platykurtic).'
  } else {
    return 'Distribution has very light tails with few outliers (highly platykurtic).'
  }
}

// ============================================================================
// COEFFICIENT OF VARIATION HELPER
// ============================================================================

function getCVInterpretation(cv: number): string {
  if (cv < 10) return 'Low variability (very consistent)'
  if (cv < 20) return 'Moderate variability (acceptable)'
  if (cv < 30) return 'High variability (needs improvement)'
  return 'Very high variability (critical concern)'
}

// ============================================================================
// COMPACT VERSION
// ============================================================================

interface CompactDescriptiveStatsProps {
  stats: DescriptiveStats
}

export function CompactDescriptiveStats({ stats }: CompactDescriptiveStatsProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-800/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">Statistics</h4>
        <Badge className="bg-blue-500/20 text-blue-400 text-xs">
          n={stats.n}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Mean ± SD:</span>
          <span className="font-mono text-white">
            {stats.mean.toFixed(2)} ± {stats.stdDev.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Median:</span>
          <span className="font-mono text-white">{stats.median.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Range:</span>
          <span className="font-mono text-white">
            {stats.min.toFixed(1)} - {stats.max.toFixed(1)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Skewness:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-white">{stats.skewness.toFixed(2)}</span>
            {getSkewnessBadge(stats.skewness)}
          </div>
        </div>
      </div>
    </div>
  )
}
