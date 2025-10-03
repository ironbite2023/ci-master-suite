/**
 * Variation Indicator
 * Shows real-time variation after each shot with educational tooltip
 */

'use client'

import { Card } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { TrendingUp, TrendingDown, Info, Minus } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface VariationIndicatorProps {
  lastDistance: number
  targetDistance: number
  optimalDistance?: number
  showTooltip?: boolean
  compact?: boolean
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateVariation(actual: number, target: number) {
  const absoluteVariation = actual - target
  const percentVariation = (absoluteVariation / target) * 100
  
  return {
    absolute: absoluteVariation,
    percent: percentVariation,
    sign: absoluteVariation >= 0 ? '+' : ''
  }
}

function getVariationColor(percentVariation: number): string {
  const absPercent = Math.abs(percentVariation)
  
  if (absPercent < 1) return 'text-green-600' // Excellent
  if (absPercent < 2) return 'text-blue-600'  // Good
  if (absPercent < 5) return 'text-yellow-600' // Acceptable
  return 'text-red-600' // High variation
}

function getVariationIcon(variation: number) {
  if (Math.abs(variation) < 0.1) return <Minus className="h-4 w-4" />
  return variation > 0 
    ? <TrendingUp className="h-4 w-4" /> 
    : <TrendingDown className="h-4 w-4" />
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function VariationIndicator({
  lastDistance,
  targetDistance,
  optimalDistance,
  showTooltip = true,
  compact = false
}: VariationIndicatorProps) {
  const target = optimalDistance || targetDistance
  const variation = calculateVariation(lastDistance, target)
  const colorClass = getVariationColor(variation.percent)
  const icon = getVariationIcon(variation.absolute)

  // Compact version
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Variation:</span>
        <span className={`font-mono font-semibold ${colorClass}`}>
          {variation.sign}{variation.absolute.toFixed(1)}m
        </span>
        <span className={`text-xs ${colorClass}`}>
          ({variation.sign}{variation.percent.toFixed(2)}%)
        </span>
      </div>
    )
  }

  // Full version with tooltip
  return (
    <Card className="p-3 bg-white border-gray-200">
      <div className="space-y-2">
        {/* Last Shot */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">📏 Last Shot:</span>
          <span className="font-semibold text-gray-900">
            {lastDistance.toFixed(1)}m
          </span>
        </div>

        {/* Target */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">🎯 Target:</span>
          <span className="font-semibold text-gray-900">
            {target.toFixed(1)}m
          </span>
        </div>

        {/* Variation */}
        <div className="flex items-center justify-between border-t pt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-600">📊 Variation:</span>
            {showTooltip && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Process Variation</h4>
                    <p className="text-xs text-gray-600">
                      Natural variation exists due to:
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">• Material:</span>
                        <span className="font-mono">±1-2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">• Environment:</span>
                        <span className="font-mono">±0.5-1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">• Equipment:</span>
                        <span className="font-mono">±1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">• Operator:</span>
                        <span className="font-mono">±2-3%</span>
                      </div>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-xs">
                        <span>Your process:</span>
                        <span className="text-blue-600">±2% (Good!)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic">
                      Six Sigma aims for: ±3σ within specs
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 font-mono font-semibold ${colorClass}`}>
              {icon}
              {variation.sign}{variation.absolute.toFixed(1)}m
            </span>
            <span className={`text-xs ${colorClass}`}>
              ({variation.sign}{variation.percent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Interpretation */}
        <div className="pt-2 border-t">
          <VariationInterpretation percentVariation={Math.abs(variation.percent)} />
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// INTERPRETATION COMPONENT
// ============================================================================

function VariationInterpretation({ percentVariation }: { percentVariation: number }) {
  let message: string
  let colorClass: string
  let icon: React.ReactNode

  if (percentVariation < 1) {
    message = 'Excellent! Very low variation'
    colorClass = 'text-green-700 bg-green-50 border-green-200'
    icon = '✓'
  } else if (percentVariation < 2) {
    message = 'Good variation (typical for well-controlled process)'
    colorClass = 'text-blue-700 bg-blue-50 border-blue-200'
    icon = '✓'
  } else if (percentVariation < 5) {
    message = 'Acceptable variation (room for improvement)'
    colorClass = 'text-yellow-700 bg-yellow-50 border-yellow-200'
    icon = '⚠️'
  } else {
    message = 'High variation (Six Sigma would investigate)'
    colorClass = 'text-red-700 bg-red-50 border-red-200'
    icon = '⚠️'
  }

  return (
    <div className={`text-xs px-2 py-1.5 rounded border ${colorClass}`}>
      <span className="mr-1">{icon}</span>
      {message}
    </div>
  )
}

// ============================================================================
// INLINE VARIANT
// ============================================================================

interface InlineVariationIndicatorProps {
  lastDistance: number
  targetDistance: number
}

export function InlineVariationIndicator({ lastDistance, targetDistance }: InlineVariationIndicatorProps) {
  const variation = calculateVariation(lastDistance, targetDistance)
  const colorClass = getVariationColor(variation.percent)

  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-50">
      <span className="text-xs text-gray-600">Var:</span>
      <span className={`text-xs font-mono font-semibold ${colorClass}`}>
        {variation.sign}{variation.absolute.toFixed(1)}m
      </span>
      <span className={`text-xs ${colorClass}`}>
        ({variation.sign}{variation.percent.toFixed(1)}%)
      </span>
    </div>
  )
}

// ============================================================================
// STATISTICS SUMMARY
// ============================================================================

interface VariationStatsSummaryProps {
  shots: Array<{ landingDistance: number }>
}

export function VariationStatsSummary({ shots }: VariationStatsSummaryProps) {
  if (shots.length === 0) return null

  // Calculate statistics
  const distances = shots.map(s => s.landingDistance)
  const mean = distances.reduce((sum, d) => sum + d, 0) / distances.length
  const variance = distances.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / distances.length
  const stdDev = Math.sqrt(variance)
  const coefficientOfVariation = (stdDev / mean) * 100

  return (
    <Card className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">
        📊 Variation Statistics
      </h4>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-600">Shots:</span>
          <span className="ml-2 font-semibold">{shots.length}</span>
        </div>
        <div>
          <span className="text-gray-600">Mean:</span>
          <span className="ml-2 font-semibold">{mean.toFixed(1)}m</span>
        </div>
        <div>
          <span className="text-gray-600">Std Dev:</span>
          <span className="ml-2 font-semibold">{stdDev.toFixed(2)}m</span>
        </div>
        <div>
          <span className="text-gray-600">CV:</span>
          <span className="ml-2 font-semibold">{coefficientOfVariation.toFixed(2)}%</span>
        </div>
      </div>

      {shots.length >= 10 && (
        <div className="mt-2 pt-2 border-t border-blue-200">
          <p className="text-xs text-blue-900">
            {stdDev / mean < 0.02 
              ? '✓ Excellent consistency! StdDev < 2%'
              : stdDev / mean < 0.05
              ? '✓ Good consistency. StdDev < 5%'
              : '⚠️ High variation. Consider process improvement.'}
          </p>
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// EXPORT
// ============================================================================

export default VariationIndicator
