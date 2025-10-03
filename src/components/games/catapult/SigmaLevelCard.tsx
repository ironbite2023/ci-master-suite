/**
 * Sigma Level Card Component
 * Displays sigma level, DPMO, PPM, and yield percentage
 */

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { CapabilityAnalysis } from '@/lib/games/catapult/capabilityCalculations'

// ============================================================================
// TYPES
// ============================================================================

interface SigmaLevelCardProps {
  analysis: CapabilityAnalysis | null
  compact?: boolean
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getSigmaLevelColor(sigmaLevel: number): string {
  if (sigmaLevel >= 6) return 'text-green-600 bg-green-50 border-green-200'
  if (sigmaLevel >= 5) return 'text-blue-600 bg-blue-50 border-blue-200'
  if (sigmaLevel >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  if (sigmaLevel >= 3) return 'text-amber-600 bg-amber-50 border-amber-200'
  return 'text-red-600 bg-red-50 border-red-200'
}

function getSigmaLevelIcon(sigmaLevel: number) {
  if (sigmaLevel >= 5) return <CheckCircle2 className="h-6 w-6" />
  if (sigmaLevel >= 4) return <TrendingUp className="h-6 w-6" />
  if (sigmaLevel >= 3) return <AlertTriangle className="h-6 w-6" />
  return <XCircle className="h-6 w-6" />
}

function getSigmaLevelRating(sigmaLevel: number): string {
  if (sigmaLevel >= 6) return 'World Class'
  if (sigmaLevel >= 5) return 'Excellent'
  if (sigmaLevel >= 4) return 'Good'
  if (sigmaLevel >= 3) return 'Average'
  if (sigmaLevel >= 2) return 'Below Average'
  return 'Poor'
}

function formatDPMO(dpmo: number): string {
  if (dpmo < 1) return dpmo.toFixed(2)
  if (dpmo < 1000) return dpmo.toFixed(0)
  if (dpmo < 10000) return (dpmo / 1000).toFixed(1) + 'K'
  return (dpmo / 1000).toFixed(0) + 'K'
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SigmaLevelCard({
  analysis,
  compact = false
}: SigmaLevelCardProps) {
  if (!analysis) {
    return (
      <Card className="p-4">
        <div className="text-center py-8 text-muted-foreground">
          <Target className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No sigma level data</p>
        </div>
      </Card>
    )
  }

  const { sigmaMetrics } = analysis
  const yieldPercent = sigmaMetrics.yield

  if (compact) {
    return (
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Sigma Level</span>
          <Badge className={getSigmaLevelColor(sigmaMetrics.sigmaLevel)}>
            {sigmaMetrics.sigmaLevel.toFixed(2)}σ
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          Yield: {yieldPercent.toFixed(2)}%
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Process Sigma Level
          </h3>
          <p className="text-sm text-muted-foreground">
            Six Sigma quality metric
          </p>
        </div>
      </div>

      {/* Sigma Level Display */}
      <div className={`p-6 rounded-lg border-2 mb-6 ${getSigmaLevelColor(sigmaMetrics.sigmaLevel)}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium mb-2">Current Sigma Level</div>
            <div className="text-5xl font-bold">
              {sigmaMetrics.sigmaLevel.toFixed(2)}σ
            </div>
            <div className="text-sm mt-2 font-semibold">
              {getSigmaLevelRating(sigmaMetrics.sigmaLevel)}
            </div>
          </div>
          <div className="flex flex-col items-center">
            {getSigmaLevelIcon(sigmaMetrics.sigmaLevel)}
          </div>
        </div>

        {/* Sigma Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress to Next Level</span>
            <span>{Math.min(((sigmaMetrics.sigmaLevel % 1) * 100), 100).toFixed(0)}%</span>
          </div>
          <Progress 
            value={Math.min(((sigmaMetrics.sigmaLevel % 1) * 100), 100)} 
            className="h-2"
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* DPMO */}
        <div className="p-4 border rounded-lg bg-white">
          <div className="text-xs text-muted-foreground mb-1">DPMO</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatDPMO(sigmaMetrics.dpmo)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Defects per Million Opportunities
          </div>
        </div>

        {/* PPM */}
        <div className="p-4 border rounded-lg bg-white">
          <div className="text-xs text-muted-foreground mb-1">PPM</div>
          <div className="text-2xl font-bold text-amber-600">
            {formatDPMO(sigmaMetrics.ppm)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Parts per Million
          </div>
        </div>

        {/* Yield */}
        <div className="p-4 border rounded-lg bg-green-50">
          <div className="text-xs text-green-700 mb-1">Yield</div>
          <div className="text-2xl font-bold text-green-600">
            {yieldPercent.toFixed(2)}%
          </div>
          <div className="text-xs text-green-700 mt-1">
            Expected Good Parts
          </div>
        </div>
      </div>

      {/* Sigma Level Reference */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-sm mb-3">Sigma Level Reference:</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span><strong>6σ:</strong> 3.4 DPMO (99.99966% yield)</span>
            </div>
            <span className="text-muted-foreground">World Class</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span><strong>5σ:</strong> 233 DPMO (99.977% yield)</span>
            </div>
            <span className="text-muted-foreground">Excellent</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span><strong>4σ:</strong> 6,210 DPMO (99.379% yield)</span>
            </div>
            <span className="text-muted-foreground">Good</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span><strong>3σ:</strong> 66,807 DPMO (93.319% yield)</span>
            </div>
            <span className="text-muted-foreground">Average</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span><strong>2σ:</strong> 308,538 DPMO (69.146% yield)</span>
            </div>
            <span className="text-muted-foreground">Poor</span>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Sigma Level:</strong> Measures process quality and capability. Higher sigma levels 
          mean fewer defects. Six Sigma (6σ) aims for near-perfect quality with only 3.4 defects 
          per million opportunities. Each sigma level increase represents a 10x improvement in quality!
        </p>
      </div>

      {/* Improvement Potential */}
      {sigmaMetrics.sigmaLevel < 6 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-900 mb-1">
                Improvement Potential:
              </p>
              <p className="text-sm text-green-800">
                Reaching {Math.ceil(sigmaMetrics.sigmaLevel)}σ would reduce DPMO to{' '}
                {formatDPMO(sigmaMetrics.dpmo * 0.1)} and increase yield to{' '}
                {(yieldPercent + (100 - yieldPercent) * 0.9).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
